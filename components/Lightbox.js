"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const item = items[index];
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={`Photo: ${item.caption}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <button ref={closeRef} className="lightbox__btn lightbox__btn--close" onClick={onClose} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <button className="lightbox__btn lightbox__btn--prev" onClick={onPrev} aria-label="Previous photo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className="lightbox__btn lightbox__btn--next" onClick={onNext} aria-label="Next photo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        <motion.figure
          key={item.slug}
          style={{ margin: 0, display: "grid", justifyItems: "center" }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {/* plain img keeps the lightbox simple and avoids layout math */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lightbox__img" src={`/gallery/${item.slug}.webp`} alt={item.alt} />
          <figcaption className="lightbox__cap">{item.caption} · {index + 1} / {items.length}</figcaption>
        </motion.figure>
      </motion.div>
    </AnimatePresence>
  );
}
