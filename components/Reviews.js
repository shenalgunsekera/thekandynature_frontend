"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import Reveal, { Stagger, StaggerItem } from "./Reveal";
import LeafField from "./LeafField";

function Stars({ value, onChange }) {
  const items = [1, 2, 3, 4, 5];
  return (
    <div className={`stars ${onChange ? "stars--input" : ""}`} role={onChange ? "radiogroup" : undefined} aria-label="Rating">
      {items.map((n) =>
        onChange ? (
          <button
            type="button"
            key={n}
            className={`star ${n <= value ? "is-on" : ""}`}
            onClick={() => onChange(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-pressed={n === value}
          >★</button>
        ) : (
          <span key={n} className={`star ${n <= value ? "is-on" : ""}`} aria-hidden="true">★</span>
        )
      )}
    </div>
  );
}

export default function Reviews() {
  const { t } = useLang();
  const r = t.reviews;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((d) => setReviews(Array.isArray(d.reviews) ? d.reviews : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setReviews((arr) => [data.review, ...arr]);
      setForm({ name: "", rating: 5, comment: "" });
      setStatus({ state: "ok", msg: r.thanks });
    } catch (err) {
      setStatus({ state: "err", msg: err.message });
    }
  };

  const fmt = (iso) => {
    try { return new Date(iso).toLocaleDateString(undefined, { month: "short", year: "numeric" }); }
    catch { return ""; }
  };

  return (
    <section className="section" id="reviews">
      <LeafField variant="section" count={7} seed={61} />
      <div className="container">
        <Reveal className="center">
          <span className="eyebrow">{r.eyebrow}</span>
          <h2 className="h-lg">{r.title}</h2>
          <p className="lead">{r.lead}</p>
        </Reveal>

        {reviews.length > 0 && (
          <Stagger className="reviews__grid" gap={0.06}>
            {reviews.map((rev) => (
              <StaggerItem className="review" key={rev.id}>
                <Stars value={rev.rating} />
                <p className="review__text">{rev.comment}</p>
                <div className="review__meta">
                  <b>{rev.name}</b>
                  <span>{fmt(rev.createdAt)}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
        {!loading && reviews.length === 0 && (
          <p className="muted center" style={{ marginTop: "var(--space-6)" }}>{r.empty}</p>
        )}

        <Reveal className="review-form-wrap">
          <h3 className="review-form__title">{r.add}</h3>
          {status.state === "ok" ? (
            <div className="form__status form__status--ok" role="status">{status.msg}</div>
          ) : (
            <form className="review-form" onSubmit={submit} noValidate>
              <div className="field--row">
                <div className="field">
                  <label htmlFor="rv-name">{r.name}</label>
                  <input id="rv-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
                </div>
                <div className="field">
                  <label>{r.rating}</label>
                  <Stars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="rv-comment">{r.comment}</label>
                <textarea id="rv-comment" rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} required placeholder={r.commentPh} />
              </div>
              {status.state === "err" && <div className="form__status form__status--err" role="alert">{status.msg}</div>}
              <button type="submit" className="btn btn--primary" disabled={status.state === "loading"} style={{ justifyContent: "center" }}>
                {status.state === "loading" ? r.sending : r.submit}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
