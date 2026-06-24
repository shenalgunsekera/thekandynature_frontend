"use client";

import { useEffect, useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const pad = (n) => String(n).padStart(2, "0");
const ymd = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const money = (n) => "Rs " + Number(n || 0).toLocaleString();

export default function BookingsCalendar() {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ guest: "", amount: "", status: "confirmed", notes: "" });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch {
      setError("Could not load bookings.");
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  // modal behaviour for the selected-day popup
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  const byDate = useMemo(() => {
    const map = {};
    for (const b of bookings) (map[b.date] ||= []).push(b);
    return map;
  }, [bookings]);

  const monthKey = `${view.y}-${pad(view.m + 1)}`;
  const monthBookings = useMemo(
    () => bookings.filter((b) => String(b.date).startsWith(monthKey)),
    [bookings, monthKey]
  );
  const stats = useMemo(() => {
    const active = monthBookings.filter((b) => b.status !== "cancelled");
    const revenue = active.reduce((s, b) => s + (Number(b.amount) || 0), 0);
    const completed = monthBookings.filter((b) => b.status === "completed").reduce((s, b) => s + (Number(b.amount) || 0), 0);
    const bookedDays = new Set(active.map((b) => b.date)).size;
    return { revenue, completed, count: monthBookings.length, bookedDays };
  }, [monthBookings]);

  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const shift = (delta) => {
    setSelected(null);
    setView((v) => {
      const m = v.m + delta;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });
  };
  const goToday = () => setView({ y: today.getFullYear(), m: today.getMonth() });

  const addBooking = async (e) => {
    e.preventDefault();
    if (!selected || !draft.guest.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, amount: Number(draft.amount) || 0, date: selected }),
      });
      if (!res.ok) throw new Error();
      setDraft({ guest: "", amount: "", status: "confirmed", notes: "" });
      await load();
    } catch {
      setError("Could not save booking.");
    }
    setBusy(false);
  };

  const patchBooking = async (id, patch) => {
    setBookings((arr) => arr.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  };
  const removeBooking = async (id) => {
    setBookings((arr) => arr.filter((b) => b.id !== id));
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
  };

  const todayStr = ymd(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedPretty = selected
    ? new Date(selected + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <section className="cal">
      <div className="cal__stats">
        <div className="admin__stat"><b>{money(stats.revenue)}</b><span>{MONTHS[view.m]} revenue</span></div>
        <div className="admin__stat"><b>{money(stats.completed)}</b><span>Completed (paid)</span></div>
        <div className="admin__stat"><b>{stats.count}</b><span>Bookings this month</span></div>
        <div className="admin__stat"><b>{stats.bookedDays}</b><span>Booked days</span></div>
      </div>

      <div className="cal__bar">
        <div className="cal__nav">
          <button onClick={() => shift(-1)} aria-label="Previous month">‹</button>
          <strong>{MONTHS[view.m]} {view.y}</strong>
          <button onClick={() => shift(1)} aria-label="Next month">›</button>
        </div>
        <div className="cal__legend">
          {STATUSES.map((s) => <span key={s} className={`cal__chip cal__chip--${s}`}>{s}</span>)}
          <button className="btn btn--ghost" style={{ minHeight: 36, padding: "6px 14px" }} onClick={goToday}>Today</button>
        </div>
      </div>

      {error && <div className="form__status form__status--err" role="alert" style={{ marginBottom: 12 }}>{error}</div>}

      <div className="cal__grid cal__grid--head">
        {WEEKDAYS.map((w) => <div key={w} className="cal__wd">{w}</div>)}
      </div>
      <div className="cal__grid">
        {cells.map((d, i) => {
          if (d === null) return <div key={`b${i}`} className="cal__cell cal__cell--empty" />;
          const date = ymd(view.y, view.m, d);
          const list = byDate[date] || [];
          const dayTotal = list.filter((b) => b.status !== "cancelled").reduce((s, b) => s + (Number(b.amount) || 0), 0);
          return (
            <button
              key={date}
              type="button"
              className={`cal__cell ${date === selected ? "is-selected" : ""} ${date === todayStr ? "is-today" : ""}`}
              onClick={() => setSelected(date)}
            >
              <span className="cal__day">{d}</span>
              {dayTotal > 0 && <span className="cal__total">{money(dayTotal)}</span>}
              <span className="cal__dots">
                {list.slice(0, 4).map((b) => <span key={b.id} className={`cal__dot cal__dot--${b.status}`} title={`${b.guest} · ${money(b.amount)} · ${b.status}`} />)}
                {list.length > 4 && <span className="cal__more">+{list.length - 4}</span>}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="cal__modal" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="cal__dialog">
          <div className="cal__panel-head">
            <h3>{selectedPretty}</h3>
            <button className="cal__x" onClick={() => setSelected(null)} aria-label="Close">×</button>
          </div>

          {(byDate[selected] || []).length === 0 ? (
            <p className="muted" style={{ margin: "4px 0 16px" }}>No bookings yet for this day.</p>
          ) : (
            <div className="cal__list">
              {(byDate[selected] || []).map((b) => (
                <div key={b.id} className={`cal__bk cal__bk--${b.status}`}>
                  <div className="cal__bk-main">
                    <b>{b.guest}</b>
                    <span>{money(b.amount)}</span>
                    {b.notes && <small>{b.notes}</small>}
                  </div>
                  <div className="cal__bk-actions">
                    <select value={b.status} onChange={(e) => patchBooking(b.id, { status: e.target.value })}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="cal__del" onClick={() => removeBooking(b.id)} aria-label="Delete booking">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form className="cal__add" onSubmit={addBooking}>
            <input
              placeholder="Guest name"
              value={draft.guest}
              onChange={(e) => setDraft({ ...draft, guest: e.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Amount (Rs)"
              value={draft.amount}
              onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
            />
            <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              placeholder="Notes (optional)"
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />
            <button type="submit" className="btn btn--primary" disabled={busy} style={{ minHeight: 42, padding: "10px 18px" }}>
              {busy ? "Saving…" : "Add booking"}
            </button>
          </form>
          </div>
        </div>
      )}

      {loading && <p className="muted" style={{ marginTop: 12 }}>Loading…</p>}
    </section>
  );
}
