import { useI18n } from "../i18n";

const ITEMS = [
  { c: "#2563EB", h: "מחיר ברור", p: "המחיר נקבע ישירות מול המורה, לפני השיעור הראשון." },
  { c: "#E5484D", h: "מורה שמתאים", p: "מתאימים מורה לפי מקצוע, שכבה, אזור וזמנים." },
  { c: "#0B8A63", h: "גמישות", p: "בבית, אונליין או ברכב, בשעה שמתאימה לכם." },
];

export function About() {
  const { t } = useI18n();
  return (
    <>
      <div className="ph"><div className="wrap">
        <h1>{t("אודות")}</h1>
        <p className="sub">{t("אנחנו מחברים תלמידים למורים פרטיים טובים, עם מחיר ברור מראש ובלי כאב ראש.")}</p>
      </div></div>
      <section className="sec" style={{ paddingTop: 20 }}><div className="wrap"><div className="cards">
        {ITEMS.map((i) => (
          <div key={i.h} className="card c" style={{ "--c": i.c, "--o": "#fff" } as React.CSSProperties}><h3>{t(i.h)}</h3><p>{t(i.p)}</p></div>
        ))}
      </div></div></section>
    </>
  );
}
