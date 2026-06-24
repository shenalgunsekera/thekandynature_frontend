// Small inline icon set (currentColor, 1.6 stroke). Decorative ones get aria-hidden.

export function Leaf({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19c0-7 5-13 14-14 .5 8-3.5 14-11 14-2 0-3-1-3-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 19c3-4 6-7 11-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Peaks({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18.5" cy="5" r="1.7" fill="currentColor" />
      <path d="M2 20 L8.5 9 L12.5 15 L16.5 6.5 L22 20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="miter" strokeLinecap="round" />
    </svg>
  );
}

export function Pool({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 18c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 21c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 15V6a2 2 0 0 1 4 0M14 15V6a2 2 0 0 1 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Racket({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="9" cy="9" rx="6" ry="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 4.5v9M4.5 9h9" stroke="currentColor" strokeWidth="1.2" opacity=".7" />
      <path d="M13 13.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Kitchen({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 2v7M9 2v7M6 9h3a3 3 0 0 1-3 3v10M15 2c-1 1.5-1 4 0 5.5 1-1.5 1-4 0-5.5ZM15 8v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Lantern({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="7" y="5" width="10" height="14" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 19c0 1.5 6 1.5 6 0M10 9v6M14 9v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

export function Bed({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 13h18M3 17v3M21 17v3M7 9V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Tick({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5 10 17 19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Pin({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Phone({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V21a1 1 0 0 1-1 1A16 16 0 0 1 4 6a1 1 0 0 1 1-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function Mail({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function Arrow({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const ICONS = { pool: Pool, racket: Racket, kitchen: Kitchen, lantern: Lantern, leaf: Leaf, bed: Bed };
