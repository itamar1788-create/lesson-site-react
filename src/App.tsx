import { createContext, useContext, useEffect, useState } from "react";
import { HashRouter, Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { SUBJECTS } from "./data/data";
import { useI18n } from "./i18n";
import { useBackHandler, useEdgeSwipe, useScrollHop, useTheme } from "./lib/hooks";
import { Background } from "./components/Background";
import { Home } from "./pages/Home";
import { Subjects } from "./pages/Subjects";
import { Teachers } from "./pages/Teachers";
import { Book } from "./pages/Book";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Join } from "./pages/Join";
import { TeacherArea } from "./pages/TeacherArea";
import { StudentArea } from "./pages/StudentArea";

type BackCtx = { register: (fn: null | (() => boolean)) => void };
const BackContext = createContext<BackCtx>({ register: () => {} });
export const useRegisterBack = () => useContext(BackContext).register;

const Moon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
);
const Sun = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);

function Shell() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [dark, toggleDark] = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const back = useBackHandler();

  const goBack = () => {
    if (open) return setOpen(false);
    if (back.ref.current?.()) return;
    if (loc.pathname === "/") return;
    if (window.history.state && window.history.state.idx > 0) nav(-1);
    else nav("/");
  };
  useEdgeSwipe(goBack);
  useScrollHop();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [loc.pathname, loc.key]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const showBack = loc.pathname !== "/" && loc.pathname !== "/book";
  const link = (to: string, label: string, state?: object) => (
    <NavLink to={to} state={state} end>{t(label)}</NavLink>
  );

  return (
    <BackContext.Provider value={{ register: back.register }}>
      <Background />
      <header>
        <div className="wrap">
          <Link className="brand" to="/">
            <span className="mark">{SUBJECTS.slice(0, 4).map((s) => <i key={s.n} style={{ background: s.c }} />)}</span>
            {t("שיעור אישי")}
          </Link>
          <button className="burger" type="button" aria-label={t("תפריט אישי")} aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(true)}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </header>

      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <aside className="drawer" id="drawer" hidden={!open} aria-label={t("תפריט")}>
        <div className="dh">
          <b className="disp">{t("תפריט")}</b>
          <button className="x" type="button" aria-label={t("סגירה")} onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="dnav">
          {link("/", "בית")}
          {link("/book", "הזמנת שיעור", { fresh: true })}
          {link("/subjects", "מקצועות")}
          {link("/teachers", "המורים")}
          {link("/about", "אודות")}
          {link("/contact", "צור קשר")}
        </div>
        <div className="dgrp">
          <span className="dlab">{t("אזור אישי")}</span>
          <div className="dnav">
            {link("/student", "תלמידים")}
            {link("/login", "מורים")}
            {link("/join", "הצטרפות כמורה")}
          </div>
        </div>
        <div className="dfoot">
          <button className="th2" type="button" onClick={toggleDark}>
            {dark ? <Sun /> : <Moon />}
            <span>{dark ? t("מצב יום") : t("מצב לילה")}</span>
          </button>
          <button className="th2" type="button" translate="no" aria-label={lang === "en" ? "עברית" : "English"} onClick={() => setLang(lang === "en" ? "he" : "en")}>
            {lang === "en" ? "עב" : "EN"}
          </button>
        </div>
      </aside>

      <main>
        {showBack && (
          <div className="wrap" style={{ paddingTop: 16 }}>
            <button className="btn sm" type="button" onClick={goBack}>{t("→ חזרה")}</button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/book" element={<Book />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<TeacherArea />} />
          <Route path="/student" element={<StudentArea />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer>
        <div className="wrap">
          <span>{t("שיעור אישי · שיעורים פרטיים בכל הארץ")}</span>
          <span>{t("אתר הדגמה: המורים, התמונות והביקורות הם דוגמאות בדויות")}</span>
        </div>
      </footer>
    </BackContext.Provider>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
