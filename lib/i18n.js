"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CONTENT } from "@/lib/content";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState("en");

  // restore saved choice on the client (default stays "en" for SSR)
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("tnk-lang") : null;
    if (saved === "si" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
    try {
      window.localStorage.setItem("tnk-lang", lang);
    } catch {}
  }, [lang]);

  const value = {
    lang,
    setLang,
    toggle: () => setLang((l) => (l === "en" ? "si" : "en")),
    t: CONTENT[lang],
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
