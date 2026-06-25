import { listBookings } from "@/lib/store";

// Public: returns the list of dates that are booked (non-cancelled), so the
// website date picker can block them. Only reveals which days are unavailable.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bookings = await listBookings();
    const booked = [
      ...new Set(
        bookings
          .filter((b) => b && b.date && b.status !== "cancelled")
          .map((b) => b.date)
      ),
    ];
    return Response.json({ booked });
  } catch {
    return Response.json({ booked: [] });
  }
}
