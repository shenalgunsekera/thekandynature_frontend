import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  cookies().delete("hr_admin");
  return Response.json({ ok: true });
}
