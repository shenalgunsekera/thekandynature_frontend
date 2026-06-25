"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WD = ["S", "M", "T", "W", "T", "F", "S"];
const pad = (n) => String(n).padStart(2, "0");
const ymd = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const todayYmd = () => { const t = new Date(); return ymd(t.getFullYear(), t.getMonth(), t.getDate()); };
const pretty = (s) => (s ? new Date(s + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "");

// Range date picker that blocks past days and admin-booked days.
export default function AvailabilityDates({ checkin, checkout, onChange, labels }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => { const t = new Date(); return { y: t.getFullYear(), m: t.getMonth() }; });
  const [booked, setBooked] = useState(() => new Set());
  const ref = useRef(null);
  const today = todayYmd();

  useEffect(() => {
    let active = true;
    fetch("/api/availability")
      .then((r) => r.json())
      .then((d) => { if (active) setBooked(new Set(Array.isArray(d.booked) ? d.booked : [])); })
      .catch(() => {});
    return () => { active = false; };
  }, [open]); // refresh each time it opens

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstWeekday, daysInMonth]);

  const shift = (delta) => setView((v) => {
    const m = v.m + delta;
    return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
  });

  // is any booked day strictly between a and b?
  const rangeHasBooked = (a, b) => {
    const start = new Date(a + "T00:00:00");
    const end = new Date(b + "T00:00:00");
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (booked.has(ymd(d.getFullYear(), d.getMonth(), d.getDate()))) return true;
    }
    return false;
  };

  const pick = (date) => {
    if (date < today || booked.has(date)) return;
    if (!checkin || (checkin && checkout)) {
      onChange(date, "");
    } else if (date > checkin && !rangeHasBooked(checkin, date)) {
      onChange(checkin, date);
      setOpen(false);
    } else {
      onChange(date, "");
    }
  };

  const inRange = (date) => checkin && checkout && date > checkin && date < checkout;

  return (
    <div className="datepick" ref={ref}>
      <button type="button" className="datepick__trigger" onClick={() => setOpen((v) => !v)}>
        <span className="datepick__field">
          <small>{labels.checkin}</small>
          <span className={checkin ? "" : "datepick__ph"}>{checkin ? pretty(checkin) : labels.pick}</span>
        </span>
        <span className="datepick__arrow">→</span>
        <span className="datepick__field">
          <small>{labels.checkout}</small>
          <span className={checkout ? "" : "datepick__ph"}>{checkout ? pretty(checkout) : labels.pick}</span>
        </span>
        <svg className="datepick__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="datepick__pop">
          <div className="datepick__bar">
            <button type="button" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
            <strong>{MONTHS[view.m]} {view.y}</strong>
            <button type="button" onClick={() => shift(1)} aria-label="Next month">›</button>
          </div>
          <div className="datepick__wd">{WD.map((w, i) => <span key={i}>{w}</span>)}</div>
          <div className="datepick__grid">
            {cells.map((d, i) => {
              if (d === null) return <span key={`e${i}`} />;
              const date = ymd(view.y, view.m, d);
              const isPast = date < today;
              const isBooked = booked.has(date);
              const disabled = isPast || isBooked;
              const sel = date === checkin || date === checkout;
              return (
                <button
                  key={date}
                  type="button"
                  disabled={disabled}
                  onClick={() => pick(date)}
                  className={`datepick__day ${sel ? "is-sel" : ""} ${inRange(date) ? "is-range" : ""} ${isBooked ? "is-booked" : ""} ${date === today ? "is-today" : ""}`}
                  title={isBooked ? "Booked" : undefined}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <div className="datepick__legend">
            <span><i className="dot dot--booked" /> {labels.booked || "Booked"}</span>
            <span><i className="dot dot--sel" /> {labels.selected || "Selected"}</span>
            {(checkin || checkout) && (
              <button type="button" className="datepick__clear" onClick={() => onChange("", "")}>{labels.clear || "Clear"}</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
