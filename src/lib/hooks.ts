import { useCallback, useEffect, useRef, useState } from "react";

/** Day / night theme, stored in localStorage and applied as data-theme on <html>. */
export function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    if (dark) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, () => setDark((d) => !d)] as const;
}

/** Subject tiles hop a little whenever the page is scrolled. */
export function useScrollHop(selector = ".tile,.subj") {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let busy = false, last = window.scrollY;
    const hop = () => {
      const visible = [...document.querySelectorAll<HTMLElement>(selector)].filter((el) => {
        const r = el.getBoundingClientRect();
        return el.offsetParent !== null && r.bottom > 0 && r.top < innerHeight;
      });
      if (!visible.length) { busy = false; return; }
      let left = visible.length;
      setTimeout(() => (busy = false), 1500);
      visible.forEach((el, i) => {
        el.style.animationDelay = `${i * 70}ms`;
        el.classList.add("jump");
        el.addEventListener("animationend", function done() {
          el.classList.remove("jump");
          el.style.animationDelay = "";
          el.removeEventListener("animationend", done);
          if (--left === 0) busy = false;
        });
      });
    };
    const onScroll = () => {
      if (Math.abs(window.scrollY - last) < 8) return;
      last = window.scrollY;
      if (!busy) { busy = true; hop(); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [selector]);
}

/** Swipe back from the screen edge: right edge in Hebrew (RTL), left edge in English (LTR). */
export function useEdgeSwipe(onBack: () => void) {
  const cb = useRef(onBack);
  cb.current = onBack;
  useEffect(() => {
    let sx = 0, sy = 0, ok = false;
    const start = (e: TouchEvent) => {
      const t = e.touches[0];
      sx = t.clientX; sy = t.clientY;
      const ltr = document.documentElement.dir === "ltr";
      ok = e.touches.length === 1 && (ltr ? sx <= 36 : innerWidth - sx <= 36);
    };
    const end = (e: TouchEvent) => {
      if (!ok) return;
      ok = false;
      const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      const d = document.documentElement.dir === "ltr" ? dx : -dx;
      if (d > 70 && Math.abs(dy) < Math.abs(dx) * 0.6) cb.current();
    };
    const cancel = () => (ok = false);
    document.addEventListener("touchstart", start, { passive: true });
    document.addEventListener("touchend", end, { passive: true });
    document.addEventListener("touchcancel", cancel, { passive: true });
    return () => {
      document.removeEventListener("touchstart", start);
      document.removeEventListener("touchend", end);
      document.removeEventListener("touchcancel", cancel);
    };
  }, []);
}

/** Lets a page (the booking wizard) handle "back" itself before the router goes back. */
export function useBackHandler() {
  const ref = useRef<null | (() => boolean)>(null);
  const register = useCallback((fn: null | (() => boolean)) => { ref.current = fn; }, []);
  return { ref, register };
}
