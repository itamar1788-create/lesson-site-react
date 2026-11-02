import { LOOKS, TEACHERS } from "../data/data";

/** Cartoon avatar generated from a teacher's look, so no real photos are needed. */
export function Avatar({ teacher, size }: { teacher: number; size: number }) {
  const t = TEACHERS[teacher];
  if (t.img) return <img src={t.img} alt="" width={size} height={size} />;
  const a = LOOKS[teacher];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <rect width="100" height="100" fill={a.b} />
      <path d="M10 100c0-20 14-30 40-30s40 10 40 30z" fill={a.c} />
      {a.s === "long" && <path d="M28 50c-4-30 8-40 22-40s26 10 22 40c0 10-4 18-8 22H36c-4-4-8-12-8-22z" fill={a.h} />}
      <rect x="43" y="58" width="14" height="16" rx="6" fill={a.k} />
      <ellipse cx="50" cy="44" rx="17" ry="20" fill={a.k} />
      <path d="M32 44c-3-20 7-27 18-27s21 7 18 27c-3-9-9-14-18-14s-15 5-18 14z" fill={a.h} />
      {a.s === "bun" && <circle cx="50" cy="15" r="8" fill={a.h} />}
      {a.s === "beard" && <path d="M33 48c0 12 7 20 17 20s17-8 17-20c-4 6-10 9-17 9s-13-3-17-9z" fill={a.h} />}
      <circle cx="43" cy="43" r="2" fill="#2B1B12" />
      <circle cx="57" cy="43" r="2" fill="#2B1B12" />
      <path d="M43 53q7 5 14 0" stroke="#B5655A" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
