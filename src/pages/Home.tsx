import { Link, useNavigate } from "react-router-dom";
import { REGIONS, SUBJECTS, TEACHERS } from "../data/data";
import { useI18n } from "../i18n";

const STEPS = [
  { c: "#E5484D", h: "בוחרים", p: "מקצוע, שכבה, אזור ואם בא לכם בבית או אונליין." },
  { c: "#2563EB", h: "מכירים מורה", p: "רואים מורים מתאימים באזור ובוחרים מי שמדבר אליכם." },
  { c: "#0B8A63", h: "מתחילים ללמוד", p: "שולחים בקשה לאישור, המורה מאשר את השעה ומשלמים אחרי השיעור." },
];

export function Home() {
  const { t } = useI18n();
  const nav = useNavigate();
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>{t("למדו מה שבא לכם, עם המורה הנכון.")}</h1>
            <p className="lead">{t("שיעורים פרטיים ושיעורי נהיגה בכל הארץ, בבית התלמיד או אונליין. בוחרים מקצוע ומזמינים בארבעה צעדים.")}</p>
            <div className="row2">
              <button className="btn cta" type="button" onClick={() => nav("/book", { state: { fresh: true } })}>{t("להזמנת שיעור")}</button>
              <Link className="btn" to="/teachers">{t("להכיר את המורים")}</Link>
            </div>
          </div>
        </div>
      </section>
      <div className="stats">
        <div className="wrap">
          <div><b>{SUBJECTS.length}</b>{t("מקצועות")}</div>
          <div><b>{REGIONS.length}</b>{t("אזורי פעילות")}</div>
          <div><b>{TEACHERS.length}</b>{t("מורים")}</div>
        </div>
      </div>
      <section className="sec">
        <div className="wrap">
          <h2>{t("איך זה עובד")}</h2>
          <p className="sub">{t("מהבחירה ועד השיעור הראשון.")}</p>
          <div className="cards">
            {STEPS.map((s, i) => (
              <div key={s.h} className="card c" style={{ "--c": s.c, "--o": "#fff" } as React.CSSProperties}>
                <span className="big">{i + 1}</span>
                <h3>{t(s.h)}</h3>
                <p>{t(s.p)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
