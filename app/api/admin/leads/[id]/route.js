import { isAdmin } from "@/lib/adminAuth";
import { deleteLead } from "@/lib/store";

export const runtime = "nodejs";

export async function DELETE(_request, { params }) {
  if (!isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await deleteLead(params.id);
  return Response.json({ ok: true });
}
