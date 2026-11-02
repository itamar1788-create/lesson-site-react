import { useNavigate } from "react-router-dom";
import { LEVELS, SUBJECTS } from "../data/data";
import { useI18n } from "../i18n";

export function Subjects() {
  const { t } = useI18n();
  const nav = useNavigate();
  return (
    <>
      <div className="ph"><div className="wrap">
        <h1>{t("מקצועות")}</h1>
        <p className="sub">{t("בוחרים מקצוע ושלב ומזמינים. המחיר נקבע מול המורה. שיעורי נהיגה הם ברכב בלבד.")}</p>
      </div></div>
      <section className="sec" style={{ paddingTop: 20 }}><div className="wrap"><div className="cards">
        {SUBJECTS.map((s, i) => (
          <article key={s.n} className="card subj" style={{ "--c": s.c, "--o": s.o } as React.CSSProperties}>
            <div className="top"><h3>{t(s.n)}</h3><p>{t(s.d)}</p></div>
            <div className="bot">
              <ul className="lv">{(s.lv ?? LEVELS).map((l) => <li key={l}>{t(l)}</li>)}</ul>
              <button className="btn cta" type="button" onClick={() => nav("/book", { state: { sub: i } })}>{t("להזמנה")}</button>
            </div>
          </article>
        ))}
      </div></div></section>
    </>
  );
}
