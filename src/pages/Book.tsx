import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRegisterBack } from "../App";
import { Avatar } from "../components/Avatar";
import { DAYS, HOURS, LEVELS, REGIONS, SUBJECTS, TEACHERS } from "../data/data";
import { useI18n } from "../i18n";
import { freeHours, hoursOf } from "../lib/schedule";
import { openWhatsApp, validPhone } from "../lib/whatsapp";
import { useStore } from "../store";

type Wizard = {
  sub: number | null; // subject
  l: number; // level / stage
  m: "home" | "online";
  r: number; // region
  t: number | null; // teacher
  ft: boolean; // arrived through a specific teacher
  d: number | null; // day
  tm: string | null; // time
  step: 1 | 2 | 3 | 4;
  nm: string;
  ph: string;
};

const blank: Wizard = { sub: null, l: 2, m: "home", r: 0, t: null, ft: false, d: null, tm: null, step: 1, nm: "", ph: "" };

/** Where the wizard starts, depending on how the person arrived. */
function fromNavigation(state: { sub?: number; teacher?: number } | null): Wizard {
  if (state?.sub !== undefined) {
    return { ...blank, sub: state.sub, m: "home", step: 2 };
  }
  if (state?.teacher !== undefined) {
    const t = TEACHERS[state.teacher];
    if (t.s.length === 1) return { ...blank, ft: true, t: state.teacher, sub: t.s[0], step: 2 };
    return { ...blank, ft: true, t: state.teacher };
  }
  return blank;
}

const levelsOf = (sub: number) => SUBJECTS[sub].lv ?? LEVELS;
const style = (c: string) => ({ "--c": c, "--o": "#fff" }) as React.CSSProperties;

export function Book() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const loc = useLocation();
  const registerBack = useRegisterBack();
  const { lessons, hours } = useStore();
  const [S, setS] = useState<Wizard>(() => fromNavigation(loc.state));
  const [msg, setMsg] = useState("");
  const patch = (p: Partial<Wizard>) => setS((s) => ({ ...s, ...p }));

  // Starting again from the menu or a link resets the wizard.
  useEffect(() => { setS(fromNavigation(loc.state)); setMsg(""); }, [loc.key]);

  // Back goes one wizard step before leaving the page.
  useEffect(() => {
    registerBack(() => {
      if (S.step > 1) { setS((s) => ({ ...s, step: (s.step - 1) as Wizard["step"] })); return true; }
      return false;
    });
    return () => registerBack(null);
  }, [S.step, registerBack]);

  // Keep the chosen day / hour valid for the chosen teacher.
  useEffect(() => {
    if (S.step !== 3 || S.t === null) return;
    setS((s) => {
      let { d, tm } = s;
      if (d !== null && !freeHours(hours, s.t!, d, lessons).length) d = null;
      if (d !== null && tm && !freeHours(hours, s.t!, d, lessons).includes(tm)) tm = null;
      return d === s.d && tm === s.tm ? s : { ...s, d, tm };
    });
  }, [S.step, S.t, S.d, S.tm, hours, lessons]);

  const subj = S.sub !== null ? SUBJECTS[S.sub] : null;
  const teacherOptions = useMemo(() => {
    if (S.sub === null) return [];
    if (S.ft && S.t !== null) return [S.t];
    return TEACHERS.map((_, i) => i).filter((i) => TEACHERS[i].s.includes(S.sub!) && (S.m === "online" || TEACHERS[i].r.includes(S.r)));
  }, [S.sub, S.ft, S.t, S.m, S.r]);

  const chooseSubject = (i: number) => {
    patch({ sub: i, m: SUBJECTS[i].car ? "home" : S.m, t: S.ft ? S.t : null, step: 2 });
  };

  const next = () => {
    if (S.step === 3 && (S.d === null || !S.tm)) return setMsg(t("נא לבחור יום ושעה לבקשת השיעור."));
    setMsg("");
    patch({ step: (S.step + 1) as Wizard["step"] });
  };
  const back = () => { setMsg(""); patch({ step: (S.step - 1) as Wizard["step"] }); };

  const message = () => {
    const s = SUBJECTS[S.sub!], car = !!s.car;
    const when = S.d !== null || S.tm !== null;
    if (lang === "en") {
      const where = car ? `in the car, pickup from ${t(REGIONS[S.r][0])}` : S.m === "online" ? "online" : `at the student's home, ${t(REGIONS[S.r][0])}`;
      return `Hello, I'm ${S.nm.trim()} (${S.ph.trim()}). I'd like a private lesson in ${t(s.n)}, ${car ? "stage" : "level"}: ${t(levelsOf(S.sub!)[S.l])}, ${where}` +
        (S.t !== null ? `, preferred teacher: ${t(TEACHERS[S.t].n)}` : "") +
        (when ? `, requested time: ${S.d !== null ? "on " + t(DAYS[S.d]) : ""}${S.tm ? " at " + S.tm : ""}` : "") + ".";
    }
    const where = car ? "ברכב, איסוף מאזור " + REGIONS[S.r][0] : S.m === "online" ? "אונליין" : "בבית התלמיד, " + REGIONS[S.r][0];
    return `שלום, אני ${S.nm.trim()} (${S.ph.trim()}). אשמח לשיעור פרטי ב${s.n}, ${car ? "שלב" : "שכבה"}: ${levelsOf(S.sub!)[S.l]}, ${where}` +
      (S.t !== null ? `, מורה מועדף: ${TEACHERS[S.t].n}` : "") +
      (when ? `, מועד מבוקש: ${S.d !== null ? "יום " + DAYS[S.d] : ""}${S.tm ? " בשעה " + S.tm : ""}` : "") + ".";
  };
  const send = () => {
    if (!S.nm.trim() || !validPhone(S.ph)) return setMsg(t("נא למלא שם מלא וטלפון תקין כדי לשלוח את הבקשה."));
    setMsg("");
    openWhatsApp(message());
  };

  const chip = (on: boolean, label: string, click: () => void, disabled = false) => (
    <button key={label} type="button" className="chip" aria-pressed={on} disabled={disabled} onClick={click}>{label}</button>
  );

  const freeToday = S.t !== null && S.d !== null ? freeHours(hours, S.t, S.d, lessons) : [];
  const teacherHours = S.t !== null && S.d !== null ? hoursOf(hours, S.t)[S.d] : null;

  return (
    <>
      <div className="ph"><div className="wrap"><h1>{t("הזמנת שיעור")}</h1></div></div>
      <div className="wrap wizgrid" style={{ paddingTop: 12 }}>
        <div className="wiz">
          <p className="pk" style={{ margin: "0 0 14px" }}>{t("שלב {0} מתוך {1}", S.step, 4)}</p>

          {S.step === 1 && (
            <>
              <h2>{S.ft && S.t !== null ? t("איזה מקצוע אצל {0}?", t(TEACHERS[S.t].n.split(" ")[0])) : t("איזה מקצוע?")}</h2>
              <div className="tiles">
                {(S.ft && S.t !== null ? TEACHERS[S.t].s : SUBJECTS.map((_, i) => i)).map((i) => (
                  <button key={i} className="tile" type="button" style={style(SUBJECTS[i].c)} onClick={() => chooseSubject(i)}>
                    <b>{t(SUBJECTS[i].n)}</b><span>{t(SUBJECTS[i].d)}</span>
                  </button>
                ))}
              </div>
              <div className="nav"><button className="btn" type="button" onClick={() => (window.history.state?.idx > 0 ? nav(-1) : nav("/"))}>{t("חזרה")}</button></div>
            </>
          )}

          {S.step === 2 && subj && (
            <>
              <h2>{t("פרטי השיעור")}</h2>
              <h3>{subj.car ? t("שלב") : t("שכבה")}</h3>
              <div className="chips">{levelsOf(S.sub!).map((l, i) => chip(S.l === i, t(l), () => patch({ l: i })))}</div>
              {!subj.car && (
                <>
                  <h3>{t("אופן השיעור")}</h3>
                  <div className="chips">
                    {chip(S.m === "home", t("בבית התלמיד"), () => patch({ m: "home", t: S.ft ? S.t : null }))}
                    {chip(S.m === "online", t("אונליין"), () => patch({ m: "online", t: S.ft ? S.t : null }))}
                  </div>
                </>
              )}
              {S.m === "home" && (
                <>
                  <h3>{t("אזור")}</h3>
                  <div className="chips">{REGIONS.map((r, i) => chip(S.r === i, t(r[0]), () => patch({ r: i, t: S.ft ? S.t : null })))}</div>
                </>
              )}
              <div className="nav">
                <button className="btn" type="button" onClick={back}>{t("חזרה")}</button>
                <button className="btn cta" type="button" onClick={next}>{t("המשך")}</button>
              </div>
            </>
          )}

          {S.step === 3 && subj && (
            <>
              <h2>{t("מורה וזמן")}</h2>
              {!S.ft && (
                <button className="opt" type="button" aria-pressed={S.t === null} onClick={() => patch({ t: null })}>
                  <b>{t("אין העדפה, תמצאו לי מורה")}</b>
                </button>
              )}
              {S.ft && S.t !== null && S.m === "home" && !TEACHERS[S.t].r.includes(S.r) && (
                <p className="pk warn">{t("{0} לא מגיע לאזור {1}. אפשר לחזור ולבחור אזור אחר או שיעור אונליין.", t(TEACHERS[S.t].n.split(" ")[0]), t(REGIONS[S.r][0]))}</p>
              )}
              {teacherOptions.length ? teacherOptions.map((i) => (
                <button key={i} className="opt" type="button" aria-pressed={S.t === i} style={style(subj.c)} onClick={() => patch({ t: i })}>
                  <span className="pic" style={{ width: 44, height: 44 }}><Avatar teacher={i} size={44} /></span>
                  <span><b>{t(TEACHERS[i].n)}</b><br /><small>{t("{0} שנות ניסיון", TEACHERS[i].y)}</small></span>
                </button>
              )) : <p className="pk">{t("עדיין אין מורה בדוגמאות שמתאים לבחירה הזו. נמצא לכם מורה אחרי השליחה.")}</p>}

              <h3>{t("יום מבוקש")}</h3>
              <div className="chips">
                {DAYS.map((d, i) => chip(S.d === i, t(d), () => patch({ d: S.d === i ? null : i }),
                  S.t !== null && !freeHours(hours, S.t, i, lessons).length))}
              </div>

              <h3>{t("שעה מבוקשת")}</h3>
              <select style={{ maxWidth: 220 }} aria-label={t("שעה מבוקשת")} value={S.tm ?? ""} onChange={(e) => patch({ tm: e.target.value || null })}>
                <option value="">{S.t !== null && S.d === null ? t("בחרו קודם יום") : t("בחרו שעה")}</option>
                {(S.t === null ? HOURS : freeToday).map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              {teacherHours && (
                <p className="pk">
                  {t("שעות העבודה של המורה ביום {0}: {1}", t(DAYS[S.d!]), `${teacherHours.from}–${teacherHours.to}`)}
                  <br />{t("מוצגות רק שעות פנויות של המורה.")}
                </p>
              )}
              <p className="msg" role="alert">{msg}</p>
              <div className="nav">
                <button className="btn" type="button" onClick={back}>{t("חזרה")}</button>
                <button className="btn cta" type="button" onClick={next}>{t("המשך")}</button>
              </div>
            </>
          )}

          {S.step === 4 && (
            <>
              <h2>{t("כמעט סיימנו")}</h2>
              <p className="pk">{t("המחיר נקבע מול המורה. שולחים בקשה, והמורה מאשר את השעה.")}</p>
              <label htmlFor="nm" style={{ marginTop: 0 }}>{t("שם מלא")}</label>
              <input id="nm" autoComplete="name" value={S.nm} onChange={(e) => patch({ nm: e.target.value })} />
              <label htmlFor="ph">{t("טלפון")}</label>
              <input id="ph" type="tel" inputMode="tel" autoComplete="tel" value={S.ph} onChange={(e) => patch({ ph: e.target.value })} />
              <div className="nav">
                <button className="btn" type="button" onClick={back}>{t("חזרה")}</button>
                <button className="btn cta" type="button" onClick={send}>{t("שליחת בקשה לאישור")}</button>
              </div>
              <p className="msg" role="alert">{msg}</p>
            </>
          )}
        </div>

        <aside className="card side" aria-live="polite">
          <h3>{t("הסיכום שלכם")}</h3>
          {S.sub === null || !subj ? (
            <p className="pk">{t("בחרו מקצוע כדי להתחיל.")}</p>
          ) : (
            <>
              <Row k={t("מקצוע")} v={t(subj.n)} />
              <Row k={subj.car ? t("שלב") : t("שכבה")} v={t(levelsOf(S.sub)[S.l])} />
              <Row k={t("אופן")} v={subj.car ? t("ברכב עם מורה נהיגה") : S.m === "online" ? t("אונליין") : t("בבית התלמיד")} />
              {S.m === "home" && <Row k={t("אזור")} v={t(REGIONS[S.r][0])} />}
              {S.t !== null && <Row k={t("מורה")} v={t(TEACHERS[S.t].n)} />}
              {S.d !== null && S.tm && <Row k={t("מועד מבוקש")} v={`${t("יום " + DAYS[S.d])} · ${S.tm}`} />}
            </>
          )}
        </aside>
      </div>
    </>
  );
}

const Row = ({ k, v }: { k: string; v: string }) => <div className="rw"><span>{k}</span><b>{v}</b></div>;
