import { cookies } from "next/headers";
import { listLeads, listSubscribers, storageMode } from "@/lib/store";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin — The Heights Retreat",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const expected = process.env.ADMIN_PASSWORD || "heights-admin";
  const authed = cookies().get("hr_admin")?.value === expected;

  if (!authed) return <AdminLogin />;

  const [leads, subscribers] = await Promise.all([listLeads(), listSubscribers()]);
  return <AdminDashboard leads={leads} subscribers={subscribers} mode={storageMode()} />;
}
