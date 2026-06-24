"use client";

import { useLang } from "@/lib/i18n";
import { SITE } from "@/data/site";
import { Peaks, Pin, Phone, Mail } from "./icons";

const telHref = (p) => "tel:+94" + p.replace(/\D/g, "").replace(/^0/, "");

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="brand" style={{ marginBottom: 12 }}>
              <span className="brand__mark"><Peaks size={24} /></span>
              <span className="brand__name">The <span className="brand__accent">Heights</span> Retreat</span>
            </div>
            <p className="muted" style={{ maxWidth: "34ch" }}>{t.footer.desc}</p>
            <p className="footer__credit">By <span>The Kandy Nature</span></p>
          </div>

          <div>
            <h5>{t.footer.explore}</h5>
            <a href="#about">{t.nav.place}</a>
            <a href="#amenities">{t.nav.amenities}</a>
            <a href="#gallery">{t.nav.gallery}</a>
            <a href="#contact">{t.contact.navLabel}</a>
          </div>

          <div>
            <h5>{t.footer.find}</h5>
            <a href={telHref(SITE.phone)} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Phone size={16} /> {SITE.phone}
            </a>
            <a href={telHref(SITE.phone2)} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Phone size={16} /> {SITE.phone2}
            </a>
            <a href={`mailto:${SITE.email}`} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Mail size={16} /> {SITE.email}
            </a>
            <span style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--text-soft)", padding: "5px 0", fontSize: 14.5 }}>
              <Pin size={16} /> {SITE.location}
            </span>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} The Heights Retreat · by The Kandy Nature. {t.footer.rights}</span>
          <span>{t.footer.bottom}</span>
        </div>
      </div>
    </footer>
  );
}
