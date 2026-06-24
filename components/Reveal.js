"use client";

import { motion } from "framer-motion";

const DIRS = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 36, y: 0 },
  right: { x: -36, y: 0 },
  none: { x: 0, y: 0 },
};

export default function Reveal({
  children,
  as = "div",
  dir = "up",
  delay = 0,
  amount = 0.25,
  className,
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;
  const offset = DIRS[dir] || DIRS.up;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

// Stagger container + child for lists/grids
export function Stagger({ children, className, gap = 0.08, amount = 0.2, ...rest }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ show: { transition: { staggerChildren: gap } } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, dir = "up", ...rest }) {
  const offset = DIRS[dir] || DIRS.up;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
