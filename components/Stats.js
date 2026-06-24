"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useLang } from "@/lib/i18n";
import LeafField from "./LeafField";

function Counter({ to, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVal(to); return; }
    let raf;
    const start = performance.now();
    const dur = 1200;
    const tick = (now) => {
      const tt = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - tt, 3);
      setVal(Math.round(eased * to));
      if (tt < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return <span ref={ref} className="stat__num">{val}{suffix}</span>;
}

export default function Stats() {
  const { t } = useLang();
  return (
    <section className="section section--alt">
      <LeafField variant="section" count={7} seed={5} />
      <div className="container">
        <div className="stats">
          {t.stats.map((s) => (
            <div className="stat" key={s.label}>
              <Counter to={s.to} suffix={s.suffix} />
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
