import { isAdmin } from "@/lib/adminAuth";
import { listBookings, saveBooking } from "@/lib/store";

export const runtime = "nodejs";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export async function GET() {
  if (!isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const bookings = await listBookings();
  return Response.json({ bookings });
}

export async function POST(request) {
  if (!isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let b;
  try {
    b = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const date = String(b.date || "").trim();
  const guest = String(b.guest || "").trim().slice(0, 120);
  const amount = Number(b.amount) || 0;
  const status = STATUSES.includes(b.status) ? b.status : "confirmed";
  const notes = String(b.notes || "").trim().slice(0, 500);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Response.json({ error: "Invalid date." }, { status: 422 });
  if (!guest) return Response.json({ error: "Guest name is required." }, { status: 422 });

  const booking = await saveBooking({ date, guest, amount, status, notes });
  return Response.json({ ok: true, booking });
}
