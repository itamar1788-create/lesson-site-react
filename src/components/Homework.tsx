import { useState, type CSSProperties } from "react";
import { SUBJECTS, TEACHERS } from "../data/data";
import { useI18n } from "../i18n";
import { downloadBlob, isPdf } from "../lib/pdf";
import { useDispatch, useStore, type Homework, type HwFile } from "../store";
import { FileInput } from "./FileInput";
import { Limited } from "./Limited";

const BADGES: [string, "w" | "g" | "r"][] = [
  ["פתוחה", "w"],
  ["הוגשה, ממתינה לבדיקה", "w"],
  ["הוגשה ואושרה", "g"],
  ["לא התקבלה, נדרשת הגשה מחדש", "r"],
];

const Check = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: -2, marginInlineEnd: 4 }}>
    <path d="M5 12l5 5 9-10" />
  </svg>
);

function FileLink({ file }: { file: HwFile }) {
  const { t } = useI18n();
  return (
    <span className="pdfl">
      <span translate="no">{file.name}</span>
      <button type="button" className="lnk" onClick={() => downloadBlob(file.name, file.blob)}>{t("הורדה")}</button>
    </span>
  );
}

/** Text typed by a person is shown as-is; seeded demo text is translated. */
function Typed({ hw, field }: { hw: Homework; field: "title" | "desc" }) {
  const { t } = useI18n();
  return hw.own ? <span translate="no">{hw[field]}</span> : <>{t(hw[field])}</>;
}

function Head({ hw, who }: { hw: Homework; who: string }) {
  const { t } = useI18n();
  const [label, tone] = BADGES[hw.st];
  return (
    <>
      <div>
        <b><Typed hw={hw} field="title" /></b><br />
        <small>{who} · {t(SUBJECTS[hw.s].n)}</small><br />
        <small>{hw.due ? t("להגשה עד {0}", hw.due) : t("ללא תאריך הגשה")}</small>
      </div>
      {hw.desc && <p className="hwd"><Typed hw={hw} field="desc" /></p>}
      {hw.file && <div className="hwr"><small>{t("קובץ המטלה")}</small><FileLink file={hw.file} /></div>}
      <div className="hwr"><span className={`badge ${tone}`}>{hw.st === 2 && <Check />}{t(label)}</span></div>
    </>
  );
}

function Result({ hw }: { hw: Homework }) {
  const { t } = useI18n();
  return (
    <>
      {hw.st === 2 && hw.grade && <div className="hwr"><small>{t("ציון: {0}", hw.grade)}</small></div>}
      {hw.feedback && <div className="hwr"><small>{t("קובץ בדיקה מהמורה")}</small><FileLink file={hw.feedback} /></div>}
    </>
  );
}

const sorted = (all: Homework[], keep: (h: Homework) => boolean, rank: number[]) =>
  all.map((hw, i) => ({ hw, i })).filter(({ hw }) => keep(hw)).sort((a, b) => rank.indexOf(a.hw.st) - rank.indexOf(b.hw.st) || b.i - a.i);

/* ---------- Student side ---------- */

function StudentCard({ hw, index }: { hw: Homework; index: number }) {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [round, setRound] = useState(0);
  const submit = () => {
    if (!file) return setMsg(t("נא לבחור קובץ PDF להגשה."));
    if (!isPdf(file)) return setMsg(t("אפשר להגיש רק קובץ PDF."));
    dispatch({ type: "hwSubmit", index, file: { name: file.name, blob: file } });
    setMsg(""); setFile(null); setRound((r) => r + 1);
  };
  return (
    <article className="card lsn hwc" style={{ "--c": SUBJECTS[hw.s].c, "--o": "#fff" } as CSSProperties}>
      <Head hw={hw} who={t("מורה: {0}", t(TEACHERS[hw.t].n))} />
      {hw.sub && <div className="hwr"><small>{t("ההגשה שלי")}</small><FileLink file={hw.sub} /></div>}
      <Result hw={hw} />
      {(hw.st === 0 || hw.st === 3) && (
        <div className="hwsub">
          <label htmlFor={`hs${index}`}>{t("קובץ PDF להגשה")}</label>
          <FileInput key={round} id={`hs${index}`} onFile={setFile} />
          <button className="btn sm" type="button" onClick={submit}>{t("הגשת שיעורי בית")}</button>
          <small className="warn" role="alert">{msg}</small>
        </div>
      )}
    </article>
  );
}

export function StudentHomework({ student }: { student: string }) {
  const { t } = useI18n();
  const { homework } = useStore();
  const list = sorted(homework, (h) => h.p === student, [0, 3, 1, 2]);
  const open = list.filter(({ hw }) => hw.st === 0 || hw.st === 3).length;
  return (
    <>
      <h3 className="dh3">{t("שיעורי בית")} <small>({t("{0} פתוחות", open)})</small></h3>
      <div className="cards">
        {list.length ? <Limited items={list.map(({ hw, i }) => <StudentCard key={i} hw={hw} index={i} />)} /> : <p>{t("אין שיעורי בית כרגע.")}</p>}
      </div>
    </>
  );
}

/* ---------- Teacher side ---------- */

function TeacherCard({ hw, index }: { hw: Homework; index: number }) {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const [grade, setGrade] = useState("");
  const [fb, setFb] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const approve = () => {
    if (grade !== "" && !(+grade >= 0 && +grade <= 100)) return setMsg(t("הציון צריך להיות בין 0 ל-100."));
    if (fb && !isPdf(fb)) return setMsg(t("אפשר להעלות רק קובץ PDF."));
    dispatch({ type: "hwApprove", index, grade, feedback: fb ? { name: fb.name, blob: fb } : null });
    setMsg("");
  };
  return (
    <article className="card lsn hwc" style={{ "--c": SUBJECTS[hw.s].c, "--o": "#fff" } as CSSProperties}>
      <Head hw={hw} who={t("תלמיד: {0}", t(hw.p))} />
      {hw.sub && <div className="hwr"><small>{t("הגשת התלמיד")}</small><FileLink file={hw.sub} /></div>}
      <Result hw={hw} />
      {hw.st === 1 && (
        <div className="hwsub">
          <label htmlFor={`hg${index}`}>{t("ציון (לא חובה)")}</label>
          <input id={`hg${index}`} type="number" min={0} max={100} inputMode="numeric" value={grade} onChange={(e) => setGrade(e.target.value)} />
          <label htmlFor={`hf${index}`}>{t("קובץ בדיקה (לא חובה)")}</label>
          <FileInput id={`hf${index}`} onFile={setFb} />
          <div className="row2">
            <button className="btn sm" type="button" onClick={approve}>{t("אישור")}</button>
            <button className="btn sm" type="button" onClick={() => dispatch({ type: "hwStatus", index, st: 3 })}>{t("להגשה מחדש")}</button>
          </div>
          <small className="warn" role="alert">{msg}</small>
        </div>
      )}
      {hw.st === 2 && (
        <div className="row2"><button className="btn sm" type="button" onClick={() => dispatch({ type: "hwStatus", index, st: hw.sub ? 1 : 0 })}>{t("ביטול סימון")}</button></div>
      )}
      {(hw.st === 0 || hw.st === 3) && (
        <div className="row2"><button className="btn sm" type="button" onClick={() => dispatch({ type: "hwStatus", index, st: 2 })}>{t("סימון כהוגש")}</button></div>
      )}
    </article>
  );
}

function NewHomework({ students, onDone }: { students: string[]; onDone: (student: string) => void }) {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const [f, setF] = useState({ p: "", s: String(TEACHERS[0].s[0]), title: "", desc: "", due: "" });
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const add = () => {
    if (!f.title.trim() || !f.p) return setMsg(t("נא לבחור תלמיד ולכתוב כותרת למטלה."));
    if (file && !isPdf(file)) return setMsg(t("אפשר לצרף רק קובץ PDF."));
    dispatch({
      type: "hwAdd",
      hw: { t: 0, s: +f.s, p: f.p, title: f.title.trim(), desc: f.desc.trim(), due: f.due ? `${f.due.slice(8, 10)}.${f.due.slice(5, 7)}` : "", file: file ? { name: file.name, blob: file } : null, st: 0, own: true },
    });
    onDone(f.p);
  };
  return (
    <div className="card hwf">
      <label htmlFor="hws" style={{ marginTop: 0 }}>{t("תלמיד")}</label>
      <select id="hws" value={f.p} onChange={set("p")}>
        <option value="">{t("בחרו תלמיד")}</option>
        {students.map((n) => <option key={n} value={n}>{t(n)}</option>)}
      </select>
      <label htmlFor="hwsb">{t("מקצוע")}</label>
      <select id="hwsb" value={f.s} onChange={set("s")}>{TEACHERS[0].s.map((i) => <option key={i} value={i}>{t(SUBJECTS[i].n)}</option>)}</select>
      <label htmlFor="hwt">{t("כותרת")}</label>
      <input id="hwt" value={f.title} onChange={set("title")} />
      <label htmlFor="hwd">{t("הוראות (לא חובה)")}</label>
      <textarea id="hwd" rows={3} value={f.desc} onChange={set("desc")} />
      <label htmlFor="hwdue">{t("תאריך הגשה (לא חובה)")}</label>
      <input id="hwdue" type="date" value={f.due} onChange={set("due")} />
      <label htmlFor="hwf">{t("קובץ PDF למטלה (לא חובה)")}</label>
      <FileInput id="hwf" onFile={setFile} />
      <div className="row2" style={{ marginTop: 14 }}>
        <button className="btn cta sm" type="button" onClick={add}>{t("שליחת המטלה")}</button>
        <button className="btn sm" type="button" onClick={() => onDone("")}>{t("ביטול")}</button>
      </div>
      <p className="warn" role="alert">{msg}</p>
    </div>
  );
}

export function TeacherHomework({ students, onSent }: { students: string[]; onSent: (student: string) => void }) {
  const { t } = useI18n();
  const { homework } = useStore();
  const [form, setForm] = useState(false);
  const list = sorted(homework, (h) => h.t === 0, [1, 0, 3, 2]);
  const waiting = list.filter(({ hw }) => hw.st === 1).length;
  return (
    <>
      <h3 className="dh3">{t("שיעורי בית")} <small>({t("{0} ממתינים לבדיקה", waiting)})</small></h3>
      <div className="row2" style={{ marginBottom: 14 }}>
        <button className="btn" type="button" onClick={() => setForm(!form)}>{t("מטלה חדשה")}</button>
      </div>
      {form && <NewHomework students={students} onDone={(p) => { setForm(false); if (p) onSent(p); }} />}
      <div className="cards">
        {list.length ? <Limited items={list.map(({ hw, i }) => <TeacherCard key={i} hw={hw} index={i} />)} /> : <p>{t("עוד לא נתתם שיעורי בית.")}</p>}
      </div>
    </>
  );
}
