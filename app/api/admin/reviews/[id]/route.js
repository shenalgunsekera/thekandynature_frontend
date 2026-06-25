import { isAdmin } from "@/lib/adminAuth";
import { deleteReview } from "@/lib/store";

export const runtime = "nodejs";

export async function DELETE(_request, { params }) {
  if (!isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await deleteReview(params.id);
  return Response.json({ ok: true });
}
