// Email notifications via Nodemailer (Gmail/SMTP). No-ops gracefully if SMTP
// env vars aren't set, so the rest of the flow still works.
import nodemailer from "nodemailer";

export function mailerConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function transporter() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS, 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export async function sendLeadEmail(lead) {
  if (!mailerConfigured()) return { sent: false, reason: "smtp-not-configured" };

  const to = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const rows = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || "—"],
    ["Dates", lead.checkin || lead.checkout ? `${lead.checkin || "?"} → ${lead.checkout || "?"}` : "—"],
    ["Newsletter opt-in", lead.newsletter ? "Yes" : "No"],
    ["Received", new Date(lead.receivedAt || Date.now()).toLocaleString()],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#888">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`
    )
    .join("");

  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:560px">
    <h2 style="margin:0 0 4px">New inquiry — The Heights Retreat</h2>
    <p style="color:#888;margin:0 0 16px">A new lead came in from the website.</p>
    <table style="border-collapse:collapse;margin-bottom:16px">${rows}</table>
    <div style="background:#f5f5f3;border-radius:8px;padding:14px;white-space:pre-wrap">${esc(lead.message)}</div>
  </div>`;

  await transporter().sendMail({
    from,
    to,
    replyTo: lead.email,
    subject: `New inquiry — ${lead.name}`,
    html,
    text: `New inquiry from ${lead.name} (${lead.email}, ${lead.phone || "no phone"}):\n\n${lead.message}`,
  });
  return { sent: true };
}
