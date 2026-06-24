# thekandynature_frontend

Marketing site + lead/admin backend for **The Heights Retreat** (by The Kandy Nature) —
a nature homestay on Doolwala Road, Kandy, Sri Lanka.

Next.js 14 (App Router) · Framer Motion · bilingual English / සිංහල.

## Features

- Animated, bilingual one-page site: video hero, animated leaf backgrounds, gallery mosaic with lightbox.
- **Contact / inquiry form** — one submit saves the lead, opens WhatsApp with the message prefilled, and emails the admin.
- **Newsletter opt-in** capture.
- **Admin panel** at `/admin` (shared-password login):
  - Leads table (search + CSV export)
  - Newsletter subscribers (CSV export)
  - **Bookings calendar** — click a date to add/remove bookings, set status (pending / confirmed / completed / cancelled), amount paid, and see a monthly revenue / profit overview.
- Storage: **Firebase Firestore** (Admin SDK) with automatic **local-JSON fallback** to `/data` when Firebase isn't configured.

## Setup

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev                        # http://localhost:3000  (admin: /admin)
```

### Environment (`.env.local`)

- `ADMIN_PASSWORD` — login for `/admin`.
- SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, …) — Gmail App Password or any SMTP, for inquiry emails.
- Firebase **service account** (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) — for Firestore. Note: this is the *service account* key, **not** the web/client config. Without it, data is stored in `/data/*.json` locally.

## Scripts

- `npm run dev` / `npm run build` / `npm start`
- `npm run enhance` — re-process gallery photos (sharp)
- `node scripts/make-logo.mjs` — regenerate the logo files in `public/logo/`
