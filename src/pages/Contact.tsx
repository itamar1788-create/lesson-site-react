import { useState } from "react";
import { useI18n } from "../i18n";
import { openWhatsApp, validPhone } from "../lib/whatsapp";

export function Contact() {
  const { t, lang } = useI18n();
  const [f, setF] = useState({ n: "", p: "", m: "" });
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const send = () => {
    if (!f.n.trim() || !validPhone(f.p) || !f.m.trim()) return setMsg(t("נא למלא שם, טלפון תקין והודעה."));
    setMsg("");
    openWhatsApp(lang === "en" ? `Hello, I'm ${f.n.trim()} (${f.p.trim()}). ${f.m.trim()}` : `שלום, אני ${f.n.trim()} (${f.p.trim()}). ${f.m.trim()}`);
  };
  return (
    <>
      <div className="ph"><div className="wrap">
        <h1>{t("צור קשר")}</h1>
        <p className="sub">{t("שאלה, בקשה מיוחדת או מורה למקצוע שלא ברשימה? כתבו לנו.")}</p>
      </div></div>
      <section className="sec" style={{ paddingTop: 20 }}><div className="wrap two">
        <div className="card">
          <label htmlFor="cn" style={{ marginTop: 0 }}>{t("שם")}</label>
          <input id="cn" autoComplete="name" value={f.n} onChange={set("n")} />
          <label htmlFor="cp">{t("טלפון")}</label>
          <input id="cp" type="tel" inputMode="tel" autoComplete="tel" value={f.p} onChange={set("p")} />
          <label htmlFor="cm">{t("הודעה")}</label>
          <textarea id="cm" rows={4} value={f.m} onChange={set("m")} />
          <button className="btn cta" type="button" style={{ marginTop: 16 }} onClick={send}>{t("שליחה בוואטסאפ")}</button>
          <p className="msg" role="alert">{msg}</p>
        </div>
        <div className="card">
          <h3>{t("פרטים")}</h3>
          <p>{t("טלפון")}: 050-000-0000<br />{t("אימייל")}: hello@example.com<br />{t("ימים א׳–ה׳, 9:00–20:00")}</p>
        </div>
      </div></section>
    </>
  );
}
