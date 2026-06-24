"use client";

import { useMemo } from "react";

const LEAF_PATHS = [
  "M5 19c0-7 5-13 14-14 .5 8-3.5 14-11 14-2 0-3-1-3-3Z",
  "M3 12c4-6 10-7 18-6-2 7-7 11-14 10-3-.4-4-2-4-4Z",
];

// CSS-driven falling leaves. Cheap (no JS per frame) and respects
// prefers-reduced-motion via globals.css (.leaf-field hidden).
export default function LeafField({ count = 14, seed = 1, variant = "hero" }) {
  const leaves = useMemo(() => {
    const rng = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => {
      const size = 14 + Math.floor(rng() * 26);
      return {
        id: i,
        left: rng() * 100,
        size,
        delay: -rng() * 18,
        duration: 14 + rng() * 16,
        sway: 30 + rng() * 60,
        opacity: 0.25 + rng() * 0.4,
        path: LEAF_PATHS[i % LEAF_PATHS.length],
        hue: rng() > 0.7 ? "var(--gold)" : "var(--moss)",
      };
    });
  }, [count, seed]);

  return (
    <div className={`leaf-field ${variant === "section" ? "leaf-field--section" : ""}`} aria-hidden="true">
      {leaves.map((l) => (
        <span
          key={l.id}
          className="leaf"
          style={{
            left: `${l.left}%`,
            color: l.hue,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
            "--sway": `${l.sway}px`,
          }}
        >
          <svg width={l.size} height={l.size} viewBox="0 0 24 24" fill="currentColor" style={{ opacity: l.opacity }}>
            <path d={l.path} />
          </svg>
        </span>
      ))}
    </div>
  );
}

// tiny deterministic PRNG so the layout is stable between server & client
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
