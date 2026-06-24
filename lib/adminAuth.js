import { cookies } from "next/headers";

// True when the request carries a valid admin session cookie.
export function isAdmin() {
  const expected = process.env.ADMIN_PASSWORD || "heights-admin";
  return cookies().get("hr_admin")?.value === expected;
}
