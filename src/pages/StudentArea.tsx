import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { StudentHomework } from "../components/Homework";
import { Limited } from "../components/Limited";
import { HISTORY, PALETTE, SUBJECTS, TEACHERS, UPCOMING } from "../data/data";
import { useI18n } from "../i18n";
import { useDispatch, useStore } from "../store";

const STUDENT = "דנה";
const tone = (c: string) => ({ "--c": c, "--o": "#fff" }) as CSSProperties;

export function StudentArea() {
  const { t } = useI18n();
  const { studentIn, lessons, liked } = useStore();
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState("");
  const [likedOnly, setLikedOnly] = useState(false);

  const rows = HISTORY.filter((l) => (filter === "" || l.s === +filter) && (!likedOnly || liked[l.t]));
  const seen: Record<number, number> = {};
  HISTORY.forEach((l) => (seen[l.t] = (seen[l.t] ?? 0) + 1));

  const heart = (teacher: number) => (
    <button type="button" className="heart" aria-pressed={!!liked[teacher]} aria-label={t("אהבתי את {0}", t(TEACHERS[teacher].n))} onClick={() => dispatch({ type: "like", teacher })}>
      {liked[teacher] ? "♥" : "♡"}
    </button>
  );

  return (
    <>
      <div className="ph"><div className="wrap">
        <h1>{t("האזור האישי שלי")}</h1>
        <p className="sub">{t("היסטוריית שיעורים, מורים שניסיתם ומה שאהבתם.")}</p>
      </div></div>
      <section className="sec" style={{ paddingTop: 20 }}><div className="wrap">
        {studentIn ? (
          <div>
            <div className="dtop">
              <h2>{t("שלום, {0}", t(STUDENT))} <small>({t("תצוגת דמו")})</small></h2>
              <button className="btn" type="button" onClick={() => dispatch({ type: "sessionStudent", on: false })}>{t("יציאה")}</button>
            </div>

            <h3 className="dh3">{t("השיעורים הקרובים")}</h3>
            <div className="cards">
              <Limited items={UPCOMING.map((l, i) => {
                const cancelled = l.tl !== undefined && lessons[l.tl].st === 3;
                const note = l.tl !== undefined ? lessons[l.tl].note : undefined;
                return (
                  <article key={i} className="card lsn" style={tone(SUBJECTS[l.s].c)}>
                    <div><b>{t(SUBJECTS[l.s].n)}</b> · {t(TEACHERS[l.t].n)}<br /><small>{t(l.d)} · {l.tm}</small></div>
                    {cancelled ? (
                      <>
                        <span className="badge bad">{t("בוטל")}</span>
                        {note && <small className="cnote">{t("הערת המורה:")} <span translate="no">{note}</span></small>}
                      </>
                    ) : <span className="badge">{t("מאושר")}</span>}
                  </article>
                );
              })} />
            </div>

            <StudentHomework student={STUDENT} />

            <h3 className="dh3">{t("היסטוריית שיעורים")}</h3>
            <div className="filters">
              <select aria-label={t("מקצוע")} value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">{t("כל המקצועות")}</option>
                {SUBJECTS.map((s, i) => <option key={s.n} value={i}>{t(s.n)}</option>)}
              </select>
              <button type="button" className="chip" aria-pressed={likedOnly} onClick={() => setLikedOnly(!likedOnly)}>{t("רק מורים שאהבתי")}</button>
            </div>
            <div className="cards">
              {rows.length ? (
                <Limited items={rows.map((l, i) => (
                  <article key={i} className="card lsn" style={tone(SUBJECTS[l.s].c)}>
                    <div><b>{t(SUBJECTS[l.s].n)}</b> · {t(TEACHERS[l.t].n)}<br /><small>{l.d}</small></div>
                    {heart(l.t)}
                  </article>
                ))} />
              ) : <p>{t("אין שיעורים שמתאימים לסינון.")}</p>}
            </div>

            <h3 className="dh3">{t("המורים שניסיתי")}</h3>
            <div className="cards">
              <Limited items={Object.keys(seen).map(Number).map((k) => (
                <article key={k} className="card lsn" style={tone(PALETTE[k % PALETTE.length])}>
                  <div className="hd">
                    <span className="pic" style={{ width: 52, height: 52 }}><Avatar teacher={k} size={52} /></span>
                    <div><b>{t(TEACHERS[k].n)}</b><br /><small>{t("{0} שיעורים", seen[k])}</small></div>
                  </div>
                  <div className="row2">
                    {heart(k)}
                    <TeacherBook teacher={k} />
                  </div>
                </article>
              ))} />
            </div>
          </div>
        ) : (
          <div className="card" style={{ maxWidth: 460, margin: "0 auto" }}>
            <label htmlFor="su" style={{ marginTop: 0 }}>{t("טלפון או אימייל")}</label>
            <input id="su" autoComplete="username" />
            <label htmlFor="sw">{t("סיסמה")}</label>
            <input id="sw" type="password" autoComplete="current-password" />
            <button className="btn cta" type="button" style={{ marginTop: 16, display: "block", width: "100%" }} onClick={() => setMsg(t("ההתחברות האמיתית תיפתח בקרוב. בינתיים אפשר להציץ בדמו."))}>{t("התחברות")}</button>
            <p className="pk" role="status">{msg}</p>
            <button className="btn" type="button" style={{ marginTop: 14, display: "block", width: "100%" }} onClick={() => dispatch({ type: "sessionStudent", on: true })}>{t("הצצה לאזור האישי (דמו)")}</button>
          </div>
        )}
      </div></section>
    </>
  );
}

function TeacherBook({ teacher }: { teacher: number }) {
  const { t } = useI18n();
  const nav = useNavigate();
  return <button className="btn" type="button" onClick={() => nav("/book", { state: { teacher } })}>{t("להזמנה שוב")}</button>;
}
