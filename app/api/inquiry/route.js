import { saveLead, saveSubscriber } from "@/lib/store";
import { sendLeadEmail } from "@/lib/mailer";
import { SITE } from "@/data/site";

// One submit fans out to: backend store (Firestore/local) + admin email +
// a prefilled WhatsApp link returned for the client to open. Node runtime.
export const runtime = "nodejs";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 160);
  const phone = String(body.phone || "").trim().slice(0, 40);
  const checkin = String(body.checkin || "").trim().slice(0, 20);
  const checkout = String(body.checkout || "").trim().slice(0, 20);
  const message = String(body.message || "").trim().slice(0, 2000);
  const newsletter = Boolean(body.newsletter);
  const consent = Boolean(body.consent);

  if (!name) return Response.json({ error: "Please add your name." }, { status: 422 });
  if (!isEmail(email)) return Response.json({ error: "Please add a valid email." }, { status: 422 });
  if (!message) return Response.json({ error: "Please add a short message." }, { status: 422 });
  if (!consent) return Response.json({ error: "Please confirm we can contact you." }, { status: 422 });

  const lead = {
    id: `lead_${Date.now().toString(36)}`,
    name,
    email,
    phone,
    checkin,
    checkout,
    message,
    newsletter,
    source: "website-inquiry",
    receivedAt: new Date().toISOString(),
  };

  // 1) persist to the backend (Firestore if configured, else local JSON)
  try {
    await saveLead(lead);
  } catch (err) {
    console.error("[inquiry] saveLead failed:", err.message);
    return Response.json({ error: "Could not save your message. Please call us instead." }, { status: 500 });
  }

  // 2) newsletter opt-in
  if (newsletter) {
    try {
      await saveSubscriber(email, { name, source: "inquiry" });
    } catch (err) {
      console.error("[inquiry] saveSubscriber failed:", err.message);
    }
  }

  // 3) email the admin (best-effort — never blocks the response)
  let emailed = false;
  try {
    const r = await sendLeadEmail(lead);
    emailed = r.sent;
  } catch (err) {
    console.error("[inquiry] email failed:", err.message);
  }

  // 4) WhatsApp deep link with the message prefilled, for the client to open
  const lines = [
    "Hi The Heights Retreat! I'd like to inquire.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
  ];
  if (phone) lines.push(`Phone: ${phone}`);
  if (checkin || checkout) lines.push(`Dates: ${checkin || "?"} → ${checkout || "?"}`);
  lines.push("", message);
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;

  return Response.json({
    ok: true,
    emailed,
    whatsappUrl,
    message: `Thanks ${name.split(" ")[0]}! Your message is saved and on its way to us. We'll reply soon.`,
  });
}
