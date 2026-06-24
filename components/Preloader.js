"use client";

import { useEffect, useState } from "react";
import { Peaks } from "./icons";

// Holds a full-screen cover until the hero video is actually playing, so the
// page reveals with motion already running. Has hard fallbacks so it can never
// get stuck: a max timeout, plus window 'load'.
export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setDone(true);
    };

    window.addEventListener("hero-ready", finish);
    // safety nets: never trap the user behind the loader
    const hardTimeout = setTimeout(finish, 9000);
    const onLoad = () => setTimeout(finish, 1200);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("hero-ready", finish);
      window.removeEventListener("load", onLoad);
      clearTimeout(hardTimeout);
    };
  }, []);

  // lock scroll while the loader is up
  useEffect(() => {
    document.body.style.overflow = done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  return (
    <div className={`preloader ${done ? "preloader--done" : ""}`} role="status" aria-live="polite" aria-hidden={done}>
      <div className="preloader__inner">
        <span className="preloader__leaf"><Peaks size={38} /></span>
        <div className="preloader__title">The <b>Heights</b> Retreat</div>
        <div className="preloader__bar"><span /></div>
        <span className="preloader__sub">Kandy · Sri Lanka</span>
      </div>
    </div>
  );
}
