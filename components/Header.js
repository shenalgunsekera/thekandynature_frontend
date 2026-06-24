"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "@/lib/i18n";
import LangToggle from "./LangToggle";
import { Peaks } from "./icons";

export default function Header() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#about", label: t.nav.place },
    { href: "#amenities", label: t.nav.amenities },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#contact", label: t.contact.navLabel },
  ];

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="container header__bar">
        <a
          href="#top"
          className="brand"
          aria-label="The Heights Retreat — home"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="brand__mark"><Peaks size={24} /></span>
          <span className="brand__name">The <span className="brand__accent">Heights</span> Retreat</span>
        </a>

        <nav className="nav" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">{l.label}</a>
          ))}
          <LangToggle />
          <a href="#contact" className="btn btn--primary" style={{ minHeight: 42, padding: "10px 20px" }}>
            {t.nav.book}
          </a>
        </nav>

        <div className="header__mobile-controls">
          <LangToggle />
          <button
            className="menu-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="Mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#contact" className="btn btn--primary" onClick={() => setOpen(false)} style={{ justifyContent: "center", marginTop: 8 }}>
            {t.nav.book}
          </a>
        </nav>
      )}

      <motion.div className="header__progress" style={{ scaleX: progress }} aria-hidden="true" />
    </header>
  );
}
