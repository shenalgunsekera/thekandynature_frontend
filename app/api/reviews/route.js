import { listReviews, saveReview } from "@/lib/store";

// Public: GET returns guest reviews for the site; POST adds a new one.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const safe = (r) => ({ id: r.id, name: r.name, rating: r.rating, comment: r.comment, createdAt: r.createdAt });

export async function GET() {
  try {
    const reviews = await listReviews();
    return Response.json({ reviews: reviews.map(safe) });
  } catch {
    return Response.json({ reviews: [] });
  }
}

export async function POST(request) {
  let b;
  try {
    b = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(b.name || "").trim().slice(0, 80);
  const comment = String(b.comment || "").trim().slice(0, 1000);
  let rating = parseInt(b.rating, 10);
  if (!(rating >= 1 && rating <= 5)) rating = 5;

  if (!name) return Response.json({ error: "Please add your name." }, { status: 422 });
  if (comment.length < 3) return Response.json({ error: "Please add a short review." }, { status: 422 });

  const review = await saveReview({ name, comment, rating, source: "website" });
  return Response.json({ ok: true, review: safe(review) });
}
