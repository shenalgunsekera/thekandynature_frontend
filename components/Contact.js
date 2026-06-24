"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import Reveal from "./Reveal";
import LeafField from "./LeafField";
import { SITE } from "@/data/site";
import { Pin, Phone, Mail, Arrow } from "./icons";

const EMPTY = { name: "", email: "", phone: "", checkin: "", checkout: "", message: "", newsletter: false, consent: false };
const telHref = (p) => "tel:+94" + p.replace(/\D/g, "").replace(/^0/, "");

export default function Contact() {
  const { t } = useLang();
  const f = t.booking.form;
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: "idle", msg: "", wa: "" });

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "", wa: "" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank", "noopener");
      setStatus({ state: "ok", msg: data.message, wa: data.whatsappUrl || "" });
      setForm(EMPTY);
    } catch (err) {
      setStatus({ state: "err", msg: err.message, wa: "" });
    }
  };

  const loading = status.state === "loading";

  return (
    <section className="section section--alt" id="contact">
      <LeafField variant="section" count={8} seed={44} />
      <div className="container">
        <Reveal className="center" amount={0.2}>
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 className="h-lg">{t.booking.title}</h2>
          <p className="lead">{t.booking.lead}</p>
        </Reveal>

        <div className="book__grid" style={{ marginTop: "var(--space-8)" }}>
          {/* left — inquiry form */}
          <Reveal dir="right">
            {status.state === "ok" ? (
              <div className="form form--done">
                <div className="form__status form__status--ok" role="status">{status.msg}</div>
                {status.wa && (
                  <a className="btn btn--primary" href={status.wa} target="_blank" rel="noopener noreferrer" style={{ justifyContent: "center" }}>
                    {f.openWhatsApp} <Arrow size={17} />
                  </a>
                )}
                <button type="button" className="btn btn--ghost" style={{ justifyContent: "center" }} onClick={() => setStatus({ state: "idle", msg: "", wa: "" })}>
                  {f.sendAnother}
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={submit} noValidate>
                <div className="field">
                  <label htmlFor="name">{f.name}</label>
                  <input id="name" name="name" value={form.name} onChange={update} required autoComplete="name" placeholder={f.namePh} />
                </div>
                <div className="field--row">
                  <div className="field">
                    <label htmlFor="email">{f.email}</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={update} required autoComplete="email" placeholder="you@email.com" />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">{f.phone}</label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" placeholder={f.phonePh} />
                  </div>
                </div>
                <div className="field--row">
                  <div className="field">
                    <label htmlFor="checkin">{f.checkin}</label>
                    <input id="checkin" name="checkin" type="date" value={form.checkin} onChange={update} />
                  </div>
                  <div className="field">
                    <label htmlFor="checkout">{f.checkout}</label>
                    <input id="checkout" name="checkout" type="date" value={form.checkout} onChange={update} min={form.checkin || undefined} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="message">{f.message}</label>
                  <textarea id="message" name="message" rows={4} value={form.message} onChange={update} required placeholder={f.messagePh} />
                </div>

                <label className="check">
                  <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={update} />
                  <span>{f.newsletter}</span>
                </label>
                <label className="check">
                  <input type="checkbox" name="consent" checked={form.consent} onChange={update} required />
                  <span>{f.consent}</span>
                </label>

                {status.state === "err" && <div className="form__status form__status--err" role="alert">{status.msg}</div>}

                <button type="submit" className="btn btn--primary" disabled={loading} style={{ justifyContent: "center" }}>
                  {loading ? f.sending : <>{f.submit} <Arrow size={17} /></>}
                </button>
                <p className="form__note">{f.note}</p>
              </form>
            )}
          </Reveal>

          {/* right — map + reach us */}
          <Reveal dir="left" delay={0.1}>
            <div className="contact__map">
              <iframe
                title="Map showing The Heights Retreat on Doolwala Road, Kandy"
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <span className="contact__map__frame" aria-hidden="true" />
              <span className="contact__map__chip">
                <span className="contact__map__dot" aria-hidden="true" />
                <Pin size={15} /> {SITE.name}
              </span>
            </div>

            <div className="contact__reach">
              <div className="info-row">
                <span className="ic"><Pin size={18} /></span>
                <div><b>{t.contact.address}</b><span>{SITE.address}</span></div>
              </div>
              <div className="info-row">
                <span className="ic"><Phone size={18} /></span>
                <div>
                  <b>{t.contact.call}</b>
                  <span>
                    <a href={telHref(SITE.phone)} style={{ color: "var(--gold)" }}>{SITE.phone}</a>
                    {"  ·  "}
                    <a href={telHref(SITE.phone2)} style={{ color: "var(--gold)" }}>{SITE.phone2}</a>
                  </span>
                </div>
              </div>
              <div className="info-row" style={{ borderBottom: "none" }}>
                <span className="ic"><Mail size={18} /></span>
                <div><b>{t.contact.email}</b><span><a href={`mailto:${SITE.email}`} style={{ color: "var(--gold)" }}>{SITE.email}</a></span></div>
              </div>

              <div className="contact__actions">
                <a className="btn btn--primary" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  {t.contact.whatsapp} <Arrow size={17} />
                </a>
                <a className="btn btn--ghost" href={mapsLink} target="_blank" rel="noopener noreferrer">
                  {t.contact.openMaps}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
