import { isAdmin } from "@/lib/adminAuth";
import { updateBooking, deleteBooking } from "@/lib/store";

export const runtime = "nodejs";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export async function DELETE(_request, { params }) {
  if (!isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await deleteBooking(params.id);
  return Response.json({ ok: true });
}

export async function PATCH(request, { params }) {
  if (!isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let patch;
  try {
    patch = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const allowed = {};
  if (patch.status && STATUSES.includes(patch.status)) allowed.status = patch.status;
  if (patch.amount != null) allowed.amount = Number(patch.amount) || 0;
  if (typeof patch.guest === "string") allowed.guest = patch.guest.slice(0, 120);
  if (typeof patch.notes === "string") allowed.notes = patch.notes.slice(0, 500);

  await updateBooking(params.id, allowed);
  return Response.json({ ok: true });
}
