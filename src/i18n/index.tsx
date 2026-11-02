import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "./en.json";
import atoms from "./atoms.json";

export type Lang = "he" | "en";
type Dict = Record<string, string>;
const EN = en as Dict;
const ATOMS = atoms as Dict;
const hebrew = /[֐-׿]/;
// Longest names first so "נועה כהן" wins over "נועה".
const atomRe = new RegExp(
  "(^|[^\\u0590-\\u05FF])(" +
    Object.keys(ATOMS)
      .sort((a, b) => b.length - a.length)
      .join("|") +
    ")(?![\\u0590-\\u05FF])",
  "g",
);

/** Translate a Hebrew source string. Hebrew text is the key; `{0}`, `{1}` are replaced by args. */
export function translate(lang: Lang, he: string, ...args: (string | number)[]): string {
  let out = he;
  if (lang === "en" && hebrew.test(he)) {
    out = EN[he] ?? he.replace(atomRe, (_m, pre: string, word: string) => pre + ATOMS[word]);
  }
  return args.length ? out.replace(/\{(\d+)\}/g, (_m, i: string) => String(args[Number(i)] ?? "")) : out;
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (he: string, ...args: (string | number)[]) => string };
const I18n = createContext<Ctx>(null!);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") === "en" ? "en" : "he"));
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    localStorage.setItem("lang", lang);
    document.title = translate(lang, "שיעור אישי – שיעורים פרטיים בכל הארץ");
  }, [lang]);
  const t = useCallback((he: string, ...args: (string | number)[]) => translate(lang, he, ...args), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18n.Provider value={value}>{children}</I18n.Provider>;
}

export const useI18n = () => useContext(I18n);
