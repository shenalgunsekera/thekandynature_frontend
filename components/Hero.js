"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { Leaf, Pool, Racket, Arrow } from "./icons";

export default function Hero() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const signalReady = () => {
    try {
      window.dispatchEvent(new Event("hero-ready"));
    } catch {}
  };

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero__bg" style={{ y: bgY }}>
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-kandy.webp"
          aria-label="Aerial footage drifting over misty tea hills in Sri Lanka"
          onPlaying={signalReady}
          onCanPlay={signalReady}
          onError={signalReady}
          onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.65; }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <div className="hero__scrim" />

      <motion.div className="container hero__content" style={{ opacity: fade }}>
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Leaf size={15} /> {t.hero.eyebrow}
        </motion.span>

        <h1 className="hero__title">
          {t.hero.titleWords.map((w, i) => (
            <motion.span
              className="word"
              key={`${w}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {w}&nbsp;
            </motion.span>
          ))}
          <motion.em
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {t.hero.titleEm}
          </motion.em>
        </h1>

        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {t.hero.lead}
        </motion.p>

        <motion.div
          className="hero__chips"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
        >
          <span className="chip"><Pool size={16} /> {t.hero.chips.pool}</span>
          <span className="chip"><Racket size={16} /> {t.hero.chips.badminton}</span>
          <span className="chip"><Leaf size={16} /> {t.hero.chips.gardens}</span>
        </motion.div>

        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <a href="#contact" className="btn btn--primary">{t.hero.ctaPrimary} <Arrow size={17} /></a>
          <a href="#gallery" className="btn btn--ghost">{t.hero.ctaSecondary}</a>
        </motion.div>
      </motion.div>

      <a href="#about" className="scroll-cue" aria-label={t.hero.scroll}>
        <span className="scroll-cue__mouse"><span className="scroll-cue__dot" /></span>
        {t.hero.scroll}
      </a>
    </section>
  );
}
