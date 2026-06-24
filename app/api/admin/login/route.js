import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const password = String(body.password || "");
  const expected = process.env.ADMIN_PASSWORD || "heights-admin";

  if (password !== expected) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  cookies().set("hr_admin", expected, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return Response.json({ ok: true });
}
