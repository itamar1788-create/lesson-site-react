import { useState, type CSSProperties } from "react";
import { TeacherHomework } from "../components/Homework";
import { Limited } from "../components/Limited";
import { DAYS, END_HOURS, HOURS, SUBJECTS } from "../data/data";
import { useI18n } from "../i18n";
import { hoursOf, inWorkingHours, isBusy } from "../lib/schedule";
import { useDispatch, useStore } from "../store";
import { Link } from "react-router-dom";

const tone = (c: string) => ({ "--c": c, "--o": "#fff" }) as CSSProperties;

export function TeacherArea() {
  const { t } = useI18n();
  const { teacherIn, lessons, hours } = useStore();
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const [note, setNote] = useState("");
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [loginMsg, setLoginMsg] = useState("");
  const wk = hoursOf(hours, 0);
  const pending = lessons.map((l, i) => ({ l, i })).filter(({ l }) => l.st === 0);
  const approved = lessons.filter((l) => l.st === 1);
  const students = ["דנה", ...new Set(lessons.map((l) => l.p))].filter((n, i, a) => a.indexOf(n) === i);

  const approve = (i: number) => {
    const l = lessons[i];
    setMsg("");
    if (inWorkingHours(hours, 0, l.w, l.tm) && !isBusy(0, l.w, l.tm, lessons)) dispatch({ type: "lessonStatus", index: i, st: 1 });
  };
  const cancel = (i: number) => {
    dispatch({ type: "lessonStatus", index: i, st: 3, note: note.trim() });
    setMsg(t("השיעור של {0} בוטל, ו{1} נשלחה לתלמיד.", t(lessons[i].p), note.trim() ? t("ההערה") : t("הודעת הביטול")));
    setCancelling(null); setNote("");
  };

  return (
    <>
      <div className="ph"><div className="wrap">
        <h1>{t("אזור אישי למורים")}</h1>
        <p className="sub">{t("מורים רשומים מתחברים כאן. עדיין לא רשומים?")} <Link to="/join">{t("להצטרפות")}</Link></p>
      </div></div>
      <section className="sec" style={{ paddingTop: 20 }}><div className="wrap">
        {teacherIn ? (
          <div>
            <div className="dtop">
              <h2>{t("שלום, {0}", t("נועה"))} <small>({t("תצוגת דמו")})</small></h2>
              <button className="btn" type="button" onClick={() => dispatch({ type: "sessionTeacher", on: false })}>{t("יציאה")}</button>
            </div>
            {msg && <p className="tmsg" role="status">{msg}</p>}

            <h3 className="dh3">{t("שיעורים שבוקשו")} <small>({pending.length})</small></h3>
            {pending.length === 0 ? <p className="free">{t("אין בקשות חדשות.")}</p> : (
              <div className="cards">
                <Limited items={pending.map(({ l, i }) => {
                  const busy = isBusy(0, l.w, l.tm, lessons);
                  const outside = !hoursOf(hours, 0)[l.w].on || !(l.tm >= wk[l.w].from && l.tm < wk[l.w].to);
                  return (
                    <article key={i} className="card lsn" style={tone(SUBJECTS[l.s].c)}>
                      <div>
                        <b>{t(SUBJECTS[l.s].n)}</b> · {t(l.p)}<br />
                        <small>{t("יום " + DAYS[l.w])} · {l.tm}</small>
                        {busy ? <><br /><small className="warn">{t("השעה הזו כבר תפוסה בלוח")}</small></>
                          : outside ? <><br /><small className="warn">{t("מחוץ לשעות העבודה שלך")}</small></> : null}
                      </div>
                      <div className="row2">
                        <button className="btn sm" type="button" disabled={busy || outside} onClick={() => approve(i)}>{t("אשר")}</button>
                        <button className="btn sm" type="button" onClick={() => dispatch({ type: "lessonStatus", index: i, st: 2 })}>{t("דחייה")}</button>
                      </div>
                    </article>
                  );
                })} />
              </div>
            )}

            <h3 className="dh3">{t("לוח השיעורים השבועי")} <small>({t("{0} מאושרים", approved.length)})</small></h3>
            <div className="bw"><div className="board">
              {DAYS.map((d, w) => {
                const day = lessons.map((l, i) => ({ l, i })).filter(({ l }) => l.w === w && l.st === 1).sort((a, b) => (a.l.tm < b.l.tm ? -1 : 1));
                return (
                  <div className="day" key={d}>
                    <h3>{t(d)}</h3>
                    <small className="hrs">{wk[w].on ? `${wk[w].from}–${wk[w].to}` : t("יום חופשי")}</small>
                    {day.length ? day.map(({ l, i }) => (
                      <div className="les" key={i} style={tone(SUBJECTS[l.s].c)}>
                        <b>{l.tm}</b> {t(SUBJECTS[l.s].n)}<br /><small>{t(l.p)}</small><br />
                        <span className="badge">{t("מאושר")}</span>{" "}
                        {cancelling === i ? (
                          <div className="cf">
                            <label htmlFor="cxn">{t("הערה לתלמיד (לא חובה)")}</label>
                            <textarea id="cxn" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
                            <button className="btn sm" type="button" onClick={() => cancel(i)}>{t("ביטול ושליחה לתלמיד")}</button>{" "}
                            <button className="btn sm" type="button" onClick={() => setCancelling(null)}>{t("חזרה")}</button>
                          </div>
                        ) : <button className="btn sm" type="button" onClick={() => { setCancelling(i); setNote(""); }}>{t("ביטול")}</button>}
                      </div>
                    )) : wk[w].on ? <p className="free">{t("פנוי")}</p> : null}
                  </div>
                );
              })}
            </div></div>

            <TeacherHomework students={students} onSent={(p) => setMsg(t("המטלה נשלחה ל{0}.", t(p)))} />

            <h3 className="dh3">{t("שעות העבודה שלי")}</h3>
            <p className="sub">{t("סמנו באילו ימים ובאילו שעות אתם עובדים. תלמידים יוכלו לבקש שיעור רק בשעות האלה.")}</p>
            <div className="whl">
              {DAYS.map((d, i) => (
                <div className="wh" key={d}>
                  <label className="wd">
                    <input type="checkbox" checked={wk[i].on} onChange={(e) => dispatch({ type: "hours", day: i, field: "on", value: e.target.checked })} /> {t(d)}
                  </label>
                  <span className="whs">
                    <select aria-label={t("משעה")} disabled={!wk[i].on} value={wk[i].from} onChange={(e) => dispatch({ type: "hours", day: i, field: "from", value: e.target.value })}>
                      {HOURS.map((h) => <option key={h}>{h}</option>)}
                    </select>{" "}{t("עד")}{" "}
                    <select aria-label={t("עד שעה")} disabled={!wk[i].on} value={wk[i].to} onChange={(e) => dispatch({ type: "hours", day: i, field: "to", value: e.target.value })}>
                      {END_HOURS.map((h) => <option key={h}>{h}</option>)}
                    </select>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card" style={{ maxWidth: 460, margin: "0 auto" }}>
            <label htmlFor="lu" style={{ marginTop: 0 }}>{t("טלפון או אימייל")}</label>
            <input id="lu" autoComplete="username" />
            <label htmlFor="lw">{t("סיסמה")}</label>
            <input id="lw" type="password" autoComplete="current-password" />
            <button className="btn cta" type="button" style={{ marginTop: 16, display: "block", width: "100%" }} onClick={() => setLoginMsg(t("האזור האישי עדיין לא פעיל. הוא ייפתח אחרי שהמורים הראשונים יאושרו. להצטרפות השאירו פרטים בעמוד ההצטרפות."))}>{t("התחברות")}</button>
            <p className="pk" role="status">{loginMsg}</p>
            <button className="btn" type="button" style={{ marginTop: 14, display: "block", width: "100%" }} onClick={() => dispatch({ type: "sessionTeacher", on: true })}>{t("הצצה לאזור האישי (דמו)")}</button>
          </div>
        )}
      </div></section>
    </>
  );
}
