"use client";

import { motion } from "framer-motion";

// An animated line-art tree that "draws" itself into view — a nod to the
// hand-painted mural on the property wall. Decorative.
export default function TreePattern({ className, style }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i) => ({
      pathLength: 1,
      opacity: 0.9,
      transition: {
        pathLength: { duration: 1.6, ease: "easeInOut", delay: i * 0.12 },
        opacity: { duration: 0.3, delay: i * 0.12 },
      },
    }),
  };
  return (
    <motion.svg
      className={className}
      style={style}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {/* trunk + main branches */}
      <motion.path
        d="M100 200 V96 M100 120 C82 108 70 92 64 74 M100 132 C120 122 134 108 142 88 M100 150 C86 142 78 132 72 118 M100 96 C100 78 108 64 122 54"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={draw}
        custom={0}
      />
      {/* leaf clusters */}
      {[
        [64, 74], [142, 88], [122, 54], [72, 118], [100, 86],
      ].map(([cx, cy], i) => (
        <motion.path
          key={i}
          d={`M${cx} ${cy} c-7 -6 -7 -16 2 -20 6 9 5 17 -2 20Z`}
          stroke="currentColor"
          strokeWidth="1.6"
          variants={draw}
          custom={i + 1}
        />
      ))}
    </motion.svg>
  );
}
