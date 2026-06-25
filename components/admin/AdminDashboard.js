"use client";

import { useMemo, useState } from "react";
import { Peaks } from "../icons";
import BookingsCalendar from "./BookingsCalendar";

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function toCSV(rows, headers) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = headers.map((h) => esc(h.label)).join(",");
  const body = rows.map((r) => headers.map((h) => esc(r[h.key])).join(",")).join("\n");
  return `${head}\n${body}`;
}

function download(name, text, type = "text/csv") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard({ leads, subscribers, reviews = [], mode }) {
  const [tab, setTab] = useState("leads");
  const [q, setQ] = useState("");
  const [removed, setRemoved] = useState(() => new Set());
  const [removedReviews, setRemovedReviews] = useState(() => new Set());

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const visibleLeads = useMemo(() => leads.filter((l) => !removed.has(l.id)), [leads, removed]);

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead? This cannot be undone.")) return;
    setRemoved((s) => new Set(s).add(id));
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
  };

  const visibleReviews = useMemo(() => reviews.filter((r) => !removedReviews.has(r.id)), [reviews, removedReviews]);
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review? It will be removed from the website.")) return;
    setRemovedReviews((s) => new Set(s).add(id));
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
  };

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return visibleLeads;
    return visibleLeads.filter((l) =>
      [l.name, l.email, l.phone, l.message].some((v) => String(v || "").toLowerCase().includes(t))
    );
  }, [visibleLeads, q]);

  const newsletterCount = useMemo(
    () => subscribers.length || visibleLeads.filter((l) => l.newsletter).length,
    [subscribers, visibleLeads]
  );

  const exportLeads = () =>
    download(
      "heights-retreat-leads.csv",
      toCSV(visibleLeads, [
        { key: "receivedAt", label: "Date" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "checkin", label: "Check-in" },
        { key: "checkout", label: "Check-out" },
        { key: "newsletter", label: "Newsletter" },
        { key: "message", label: "Message" },
      ])
    );

  const exportSubs = () =>
    download("heights-retreat-subscribers.csv", toCSV(subscribers, [
      { key: "email", label: "Email" },
      { key: "name", label: "Name" },
      { key: "subscribedAt", label: "Subscribed" },
    ]));

  return (
    <div className="admin">
      <header className="admin__bar">
        <div className="admin__brand">
          <span className="admin__mark"><Peaks size={22} /></span>
          The Heights Retreat <span className="admin__tag">Admin</span>
        </div>
        <div className="admin__bar-right">
          <span className={`admin__mode admin__mode--${mode === "firestore" ? "live" : "local"}`}>
            {mode === "firestore" ? "● Firestore" : "● Local storage"}
          </span>
          <button className="btn btn--ghost" style={{ minHeight: 40, padding: "8px 16px" }} onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="admin__main">
        <div className="admin__stats">
          <div className="admin__stat"><b>{visibleLeads.length}</b><span>Total leads</span></div>
          <div className="admin__stat"><b>{newsletterCount}</b><span>Newsletter sign-ups</span></div>
          <div className="admin__stat"><b>{visibleLeads.filter((l) => {
            const d = new Date(l.receivedAt || l.createdAt);
            return !isNaN(d) && Date.now() - d.getTime() < 7 * 864e5;
          }).length}</b><span>Last 7 days</span></div>
        </div>

        <div className="admin__tabs">
          <button className={tab === "leads" ? "is-active" : ""} onClick={() => setTab("leads")}>
            Leads ({visibleLeads.length})
          </button>
          <button className={tab === "calendar" ? "is-active" : ""} onClick={() => setTab("calendar")}>
            Bookings calendar
          </button>
          <button className={tab === "subs" ? "is-active" : ""} onClick={() => setTab("subs")}>
            Newsletter ({subscribers.length})
          </button>
          <button className={tab === "reviews" ? "is-active" : ""} onClick={() => setTab("reviews")}>
            Reviews ({visibleReviews.length})
          </button>
        </div>

        {tab === "leads" && (
          <section>
            <div className="admin__toolbar">
              <input
                className="admin__search"
                placeholder="Search name, email, message…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="btn btn--ghost" style={{ minHeight: 40, padding: "8px 16px" }} onClick={exportLeads}>
                Export CSV
              </button>
            </div>

            {filtered.length === 0 ? (
              <p className="admin__empty">No leads yet. Submitted inquiries will appear here.</p>
            ) : (
              <div className="admin__tablewrap">
                <table className="admin__table">
                  <thead>
                    <tr>
                      <th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Stay</th><th>News</th><th>Message</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((l) => (
                      <tr key={l.id}>
                        <td className="nowrap">{fmtDate(l.receivedAt || l.createdAt)}</td>
                        <td>{l.name}</td>
                        <td><a href={`mailto:${l.email}`}>{l.email}</a></td>
                        <td className="nowrap">{l.phone || "—"}</td>
                        <td className="nowrap">{l.checkin || l.checkout ? `${l.checkin || "?"} → ${l.checkout || "?"}` : "—"}</td>
                        <td>{l.newsletter ? "✓" : "—"}</td>
                        <td className="admin__msg">{l.message}</td>
                        <td><button className="admin__del" onClick={() => deleteLead(l.id)} title="Delete lead" aria-label="Delete lead">✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab === "calendar" && <BookingsCalendar />}

        {tab === "subs" && (
          <section>
            <div className="admin__toolbar">
              <span className="muted">{subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}</span>
              <button className="btn btn--ghost" style={{ minHeight: 40, padding: "8px 16px" }} onClick={exportSubs}>
                Export CSV
              </button>
            </div>
            {subscribers.length === 0 ? (
              <p className="admin__empty">No newsletter sign-ups yet.</p>
            ) : (
              <div className="admin__tablewrap">
                <table className="admin__table">
                  <thead><tr><th>Email</th><th>Name</th><th>Subscribed</th></tr></thead>
                  <tbody>
                    {subscribers.map((s, i) => (
                      <tr key={s.email || i}>
                        <td><a href={`mailto:${s.email}`}>{s.email}</a></td>
                        <td>{s.name || "—"}</td>
                        <td className="nowrap">{fmtDate(s.subscribedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        {tab === "reviews" && (
          <section>
            {visibleReviews.length === 0 ? (
              <p className="admin__empty">No reviews yet.</p>
            ) : (
              <div className="admin__reviews">
                {visibleReviews.map((rev) => (
                  <div className="admin__review" key={rev.id}>
                    <div>
                      <div className="admin__review-head">
                        <b>{rev.name}</b>
                        <span className="admin__stars">{"★".repeat(Math.max(0, Math.min(5, rev.rating || 0)))}</span>
                        <span className="muted">{fmtDate(rev.createdAt)}</span>
                      </div>
                      <p className="admin__review-text">{rev.comment}</p>
                    </div>
                    <button className="admin__del" onClick={() => deleteReview(rev.id)} title="Delete review" aria-label="Delete review">✕</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
