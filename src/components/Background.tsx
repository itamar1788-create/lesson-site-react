import { useEffect, useRef } from "react";

const GLYPHS = ("אבגדהוזחטיכלמנסעפצקרשת" + "ABCDEFGHKMRSTXZabegkm" + "0123456789").split("");
const CELL = 22;

/** Deterministic hash → [0,1). One glyph per grid cell, so letters never overlap or repeat in a pattern. */
function hash(a: number, b: number, c: number) {
  let h = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967296;
}

/** Faint letters and numbers behind the page that move (at half speed) with scrolling. */
export function Background() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const cx = cv.getContext("2d");
    if (!cx) return;
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, queued = false;

    const draw = () => {
      queued = false;
      const dark = root.getAttribute("data-theme") === "dark";
      const off = window.scrollY * (reduce ? 1 : 0.5);
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.clearRect(0, 0, cv.width, cv.height);
      cx.fillStyle = dark ? "rgba(241,242,255,.065)" : "rgba(20,20,58,.05)";
      cx.textAlign = "center";
      cx.textBaseline = "middle";
      const j0 = Math.floor(off / CELL) - 1, j1 = Math.ceil((off + h) / CELL) + 1, i1 = Math.ceil(w / CELL) + 1;
      for (let j = j0; j <= j1; j++)
        for (let i = -1; i <= i1; i++) {
          const size = 8 + hash(i, j, 3) * 7;
          const m = CELL / 2 - size * 0.55; // jitter limit keeps neighbours from touching
          const x = (i + 0.5) * CELL + (hash(i, j, 1) - 0.5) * 2 * m;
          const y = (j + 0.5) * CELL + (hash(i, j, 2) - 0.5) * 2 * m - off;
          const angle = hash(i, j, 4) * Math.PI * 2;
          const g = GLYPHS[Math.floor(hash(i, j, 5) * GLYPHS.length)];
          const c = Math.cos(angle) * dpr, s = Math.sin(angle) * dpr;
          cx.setTransform(c, s, -s, c, x * dpr, y * dpr);
          cx.font = `700 ${size.toFixed(1)}px Arial,Helvetica,sans-serif`;
          cx.fillText(g, 0, 0);
        }
    };
    const ask = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(draw);
      }
    };
    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      draw();
    };
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", size);
    const mo = new MutationObserver(ask);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    size();
    return () => {
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", size);
      mo.disconnect();
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1, pointerEvents: "none" }} />;
}
