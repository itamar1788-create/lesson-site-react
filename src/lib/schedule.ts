import { DEFAULT_HOURS, HOURS, type DayHours, type Lesson } from "../data/data";

export type HoursMap = Record<number, DayHours[]>;
export const LESSON_MINUTES = 60;

export const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

/** Working hours of a teacher; teachers without a saved schedule get Sun–Thu 15:00–20:00. */
export function hoursOf(map: HoursMap, teacher: number): DayHours[] {
  return map[teacher] ?? [0, 1, 2, 3, 4, 5].map((d) => ({ on: d < 5, from: "15:00", to: "20:00" }));
}

/** Demo-only: fixed busy lessons for the example teachers other than teacher 0. */
const DEMO_BUSY: Record<number, [number, string][]> = {};
for (let i = 1; i <= 9; i++) {
  DEMO_BUSY[i] = [0, 1, 2].map((k) => [(i + k * 2) % 5, HOURS[14 + ((i * 3 + k * 4) % 9)]] as [number, string]);
}

/** Start times of the teacher's approved lessons on a given day (any subject). */
function busyStarts(teacher: number, day: number, lessons: Lesson[]): string[] {
  if (teacher === 0) return lessons.filter((l) => l.st === 1 && l.w === day).map((l) => l.tm);
  return (DEMO_BUSY[teacher] ?? []).filter(([d]) => d === day).map(([, tm]) => tm);
}

export function isBusy(teacher: number, day: number, time: string, lessons: Lesson[]) {
  const a = toMin(time);
  return busyStarts(teacher, day, lessons).some((x) => {
    const s = toMin(x);
    return a < s + LESSON_MINUTES && a + LESSON_MINUTES > s;
  });
}

export function inWorkingHours(map: HoursMap, teacher: number, day: number, time: string) {
  const d = hoursOf(map, teacher)[day];
  return d.on && time >= d.from && time < d.to;
}

/** Hours a student may request: inside working hours, whole lesson fits, and not overlapping another lesson. */
export function freeHours(map: HoursMap, teacher: number, day: number, lessons: Lesson[]): string[] {
  const d = hoursOf(map, teacher)[day];
  if (!d.on) return [];
  return HOURS.filter(
    (t) => t >= d.from && toMin(t) + LESSON_MINUTES <= toMin(d.to) && !isBusy(teacher, day, t, lessons),
  );
}

export const initialHours = (): HoursMap => structuredClone(DEFAULT_HOURS);
