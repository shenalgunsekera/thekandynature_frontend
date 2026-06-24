"use client";

import { useLang } from "@/lib/i18n";

export default function LangToggle({ className = "" }) {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      className={`lang-toggle ${className}`}
      onClick={toggle}
      aria-label={lang === "en" ? "Switch to Sinhala" : "Switch to English"}
      title={lang === "en" ? "සිංහලට මාරු වන්න" : "Switch to English"}
    >
      <span className={lang === "en" ? "is-active" : ""}>EN</span>
      <span className="lang-toggle__sep" aria-hidden="true">/</span>
      <span className={lang === "si" ? "is-active" : ""}>සිං</span>
    </button>
  );
}
