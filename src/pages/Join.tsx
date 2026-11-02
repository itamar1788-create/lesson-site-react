import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { openWhatsApp, validPhone } from "../lib/whatsapp";

const TERMS: [string, string][] = [
  ["לא כל המורים מתקבלים.", "לפני הכניסה לאתר יש ראיון היכרות."],
  ["עלות כניסה לאתר.", "יש עלות הצטרפות, והסכום יימסר לכם בשיחת ההיכרות."],
  ["עמלה על שיעורים.", "מכל שיעור שנסגר דרך האתר נגבה אחוז מהתשלום, והאחוז יימסר לכם בשיחה."],
  ["תיעוד וקבלות.", "כל השיעורים והתשלומים מתועדים, והקבלה מונפקת על שם האתר."],
];

export function Join() {
  const { t, lang } = useI18n();
  const [f, setF] = useState({ n: "", p: "", m: "" });
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const send = () => {
    if (!f.n.trim() || !validPhone(f.p) || !f.m.trim()) return setMsg(t("נא למלא שם, טלפון תקין ומה אתם מלמדים."));
    setMsg("");
    openWhatsApp(
      lang === "en"
        ? `Hello, I'm ${f.n.trim()} (${f.p.trim()}). I'm a teacher and I'd like to join the site. ${f.m.trim()}`
        : `שלום, אני ${f.n.trim()} (${f.p.trim()}). אני מורה ואשמח להצטרף לאתר. ${f.m.trim()}`,
    );
  };
  return (
    <>
      <div className="ph"><div className="wrap">
        <h1>{t("הצטרפות מורים")}</h1>
        <p className="sub">{t("מלמדים מקצוע או נהיגה? השאירו פרטים ונחזור אליכם. כבר רשומים?")} <Link to="/login">{t("כניסה לאזור האישי")}</Link></p>
      </div></div>
      <section className="sec" style={{ paddingTop: 20 }}><div className="wrap two">
        <div className="card">
          <h3>{t("לפני שמשאירים פרטים")}</h3>
          <ul className="terms">{TERMS.map(([b, r]) => <li key={b}><b>{t(b)}</b> {t(r)}</li>)}</ul>
        </div>
        <div className="card">
          <label htmlFor="jn" style={{ marginTop: 0 }}>{t("שם מלא")}</label>
          <input id="jn" autoComplete="name" value={f.n} onChange={set("n")} />
          <label htmlFor="jp">{t("טלפון")}</label>
          <input id="jp" type="tel" inputMode="tel" autoComplete="tel" value={f.p} onChange={set("p")} />
          <label htmlFor="jm">{t("מה אתם מלמדים, ובאילו אזורים?")}</label>
          <textarea id="jm" rows={4} value={f.m} onChange={set("m")} />
          <button className="btn cta" type="button" style={{ marginTop: 16 }} onClick={send}>{t("שליחת פרטים בוואטסאפ")}</button>
          <p className="msg" role="alert">{msg}</p>
          <p className="pk">{t("השארת פרטים אינה התחייבות, ונחזור אליכם בהקדם.")}</p>
        </div>
      </div></section>
    </>
  );
}
