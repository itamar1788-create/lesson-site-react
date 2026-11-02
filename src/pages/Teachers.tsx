import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { CAR_REVIEWS, PALETTE, REGIONS, REVIEWS, SUBJECTS, TEACHERS } from "../data/data";
import { useI18n } from "../i18n";

export function Teachers() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [subject, setSubject] = useState("");
  const [region, setRegion] = useState("");
  const list = TEACHERS.map((tc, i) => ({ tc, i })).filter(
    ({ tc }) => (subject === "" || tc.s.includes(+subject)) && (region === "" || tc.r.includes(+region)),
  );
  return (
    <>
      <div className="ph"><div className="wrap">
        <h1>{t("המורים שלנו")}</h1>
        <p className="sub">{t("סננו לפי מקצוע ואזור. המורים באתר הם דוגמאות להמחשה.")}</p>
      </div></div>
      <section className="sec" style={{ paddingTop: 20 }}><div className="wrap">
        <div className="filters">
          <select aria-label={t("מקצוע")} value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">{t("כל המקצועות")}</option>
            {SUBJECTS.map((s, i) => <option key={s.n} value={i}>{t(s.n)}</option>)}
          </select>
          <select aria-label={t("אזור")} value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">{t("כל האזורים")}</option>
            {REGIONS.map((r, i) => <option key={r[0]} value={i}>{t(r[0])}</option>)}
          </select>
        </div>
        <div className="cards">
          {list.length === 0 && <p>{t("אין מורה שמתאים לסינון הזה. נסו אזור או מקצוע אחר.")}</p>}
          {list.map(({ tc, i }, j) => {
            const reviews = SUBJECTS[tc.s[0]].car ? CAR_REVIEWS : REVIEWS;
            const pair = [reviews[i % reviews.length], reviews[(i + 1) % reviews.length]];
            return (
              <article key={tc.n} className="card t" style={{ "--c": PALETTE[j % PALETTE.length] } as React.CSSProperties}>
                <div className="hd">
                  <span className="pic"><Avatar teacher={i} size={72} /></span>
                  <div><h3>{t(tc.n)}</h3><small>{t("{0} שנות ניסיון", tc.y)}</small></div>
                </div>
                <div className="tags">
                  {tc.s.map((k) => <span key={k} className="tag" style={{ "--c": SUBJECTS[k].c } as React.CSSProperties}>{t(SUBJECTS[k].n)}</span>)}
                </div>
                <small>
                  {t("אזורים: {0}", tc.r.map((k) => t(REGIONS[k][0])).join(", "))}
                  {SUBJECTS[tc.s[0]].car ? "" : t(" · וגם אונליין")}
                </small>
                <details className="rv">
                  <summary>{t("חוות דעת")} <small>({t("דוגמה")})</small></summary>
                  {pair.map((r) => (
                    <blockquote key={r[0]}>
                      <span className="stars" role="img" aria-label={t("5 מתוך 5")}>★★★★★</span>
                      <p>{t(r[1])}</p>
                      <footer>{t(r[0])}</footer>
                    </blockquote>
                  ))}
                </details>
                <button className="btn" type="button" onClick={() => nav("/book", { state: { teacher: i } })}>
                  {t("להזמנה אצל {0}", t(tc.n.split(" ")[0]))}
                </button>
              </article>
            );
          })}
        </div>
      </div></section>
    </>
  );
}
