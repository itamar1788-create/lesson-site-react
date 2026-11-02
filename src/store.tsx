import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import { LESSONS, END_HOURS, HOURS, type Lesson } from "./data/data";
import { makePdf } from "./lib/pdf";
import { hoursOf, initialHours, type HoursMap } from "./lib/schedule";

export type HwFile = { name: string; blob: Blob };
/** st: 0 open · 1 submitted, waiting for review · 2 approved · 3 sent back for resubmission */
export type Homework = {
  t: number; // teacher index
  s: number; // subject index
  p: string; // student name
  title: string;
  desc: string;
  due: string;
  file: HwFile | null;
  st: 0 | 1 | 2 | 3;
  sub?: HwFile | null;
  grade?: string;
  feedback?: HwFile | null;
  own?: boolean; // typed by the user, so it must not be machine-translated
};

const pdf = (name: string, ...lines: string[]): HwFile => ({ name, blob: makePdf(lines) });

const seedHomework = (): Homework[] => [
  { t: 0, s: 0, p: "דנה", title: "תרגילי אלגברה, פרק 3", desc: "פתרו את שאלות 1 עד 8 מהדף, והראו את דרך הפתרון.", due: "05.11", file: pdf("algebra-ch3.pdf", "Algebra - Chapter 3", "Solve questions 1 to 8.", "Show your work."), st: 0 },
  { t: 8, s: 5, p: "דנה", title: "שאלות תיאוריה: תמרורים", desc: "ענו על 20 השאלות שבדף לפני השיעור הבא.", due: "08.11", file: pdf("road-signs.pdf", "Driving theory - Road signs", "Answer all 20 questions."), st: 0 },
  { t: 0, s: 2, p: "דנה", title: "תרגיל בכוחות ותנועה", desc: "פתרו את התרגיל וצרפו את הפתרון כקובץ PDF.", due: "02.11", file: pdf("forces.pdf", "Physics - Forces and motion", "Solve the exercise."), st: 1, sub: pdf("dana-forces.pdf", "Forces and motion - answers", "Student: Dana") },
  { t: 3, s: 2, p: "דנה", title: "סיכום פרק תנועה", desc: "סכמו את הפרק בעמוד אחד.", due: "26.10", file: pdf("motion-summary.pdf", "Physics - Motion chapter", "Write a one page summary."), st: 2, sub: pdf("dana-summary.pdf", "Motion chapter summary", "Student: Dana"), grade: "92" },
  { t: 0, s: 0, p: "אורי", title: "חזרה לבוחן, משוואות", desc: "פתרו את דף החזרה.", due: "04.11", file: pdf("quiz-review.pdf", "Math - Quiz review", "Equations"), st: 1, sub: pdf("ori-quiz.pdf", "Quiz review - answers", "Student: Ori") },
  { t: 0, s: 2, p: "מאיה", title: "שאלות על חשמל", desc: "ענו על השאלות בסוף הפרק.", due: "09.11", file: pdf("electricity.pdf", "Physics - Electricity", "Answer the questions at the end of the chapter."), st: 0 },
  { t: 0, s: 0, p: "גיא", title: "תרגול נגזרות", desc: "פתרו 10 תרגילים.", due: "28.10", file: pdf("derivatives.pdf", "Math - Derivatives", "Solve 10 exercises."), st: 2, sub: pdf("guy-derivatives.pdf", "Derivatives - answers", "Student: Guy"), grade: "85" },
];

export type State = {
  lessons: Lesson[];
  hours: HoursMap;
  homework: Homework[];
  liked: Record<number, boolean>;
  studentIn: boolean;
  teacherIn: boolean;
};

export type Action =
  | { type: "sessionStudent"; on: boolean }
  | { type: "sessionTeacher"; on: boolean }
  | { type: "like"; teacher: number }
  | { type: "lessonStatus"; index: number; st: Lesson["st"]; note?: string }
  | { type: "hours"; day: number; field: "on" | "from" | "to"; value: boolean | string }
  | { type: "hwSubmit"; index: number; file: HwFile }
  | { type: "hwAdd"; hw: Homework }
  | { type: "hwApprove"; index: number; grade: string; feedback: HwFile | null }
  | { type: "hwStatus"; index: number; st: Homework["st"] };

function init(): State {
  return { lessons: LESSONS.map((l) => ({ ...l })), hours: initialHours(), homework: seedHomework(), liked: {}, studentIn: false, teacherIn: false };
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "sessionStudent":
      return { ...s, studentIn: a.on };
    case "sessionTeacher":
      return { ...s, teacherIn: a.on };
    case "like":
      return { ...s, liked: { ...s.liked, [a.teacher]: !s.liked[a.teacher] } };
    case "lessonStatus":
      return { ...s, lessons: s.lessons.map((l, i) => (i === a.index ? { ...l, st: a.st, note: a.note ?? l.note } : l)) };
    case "hours": {
      const days = hoursOf(s.hours, 0).map((d) => ({ ...d }));
      const d = days[a.day];
      if (a.field === "on") d.on = a.value as boolean;
      else if (a.field === "from") {
        d.from = a.value as string;
        if (d.to <= d.from) d.to = HOURS[HOURS.indexOf(d.from) + 2] ?? "21:00";
      } else {
        d.to = a.value as string;
        if (d.to <= d.from) d.from = HOURS[Math.max(0, END_HOURS.indexOf(d.to) - 1)];
      }
      return { ...s, hours: { ...s.hours, 0: days } };
    }
    case "hwSubmit":
      return { ...s, homework: s.homework.map((h, i) => (i === a.index ? { ...h, sub: a.file, st: 1 } : h)) };
    case "hwAdd":
      return { ...s, homework: [...s.homework, a.hw] };
    case "hwApprove":
      return { ...s, homework: s.homework.map((h, i) => (i === a.index ? { ...h, st: 2, grade: a.grade, feedback: a.feedback ?? h.feedback } : h)) };
    case "hwStatus":
      return {
        ...s,
        homework: s.homework.map((h, i) =>
          i === a.index ? { ...h, st: a.st, ...(a.st === 1 || a.st === 0 ? { grade: "", feedback: null } : {}) } : h,
        ),
      };
  }
}

const StateCtx = createContext<State>(null!);
const DispatchCtx = createContext<Dispatch<Action>>(null!);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const value = useMemo(() => state, [state]);
  return (
    <StateCtx.Provider value={value}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

export const useStore = () => useContext(StateCtx);
export const useDispatch = () => useContext(DispatchCtx);
