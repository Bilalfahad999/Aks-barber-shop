import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "bookings.json");

function readBookings() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeBookings(bookings: unknown[]) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(bookings, null, 2));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const bookings = readBookings();

  const booking = {
    id: Date.now().toString(),
    ...body,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  writeBookings(bookings);

  // Send admin notification (modular - add email/telegram/webhook here)
  await notifyAdmin(booking);

  return NextResponse.json({ success: true, booking });
}

export async function GET(req: NextRequest) {
  const bookings = readBookings();
  const email = req.nextUrl.searchParams.get("email");
  if (email) {
    const filtered = bookings.filter(
      (b: { email: string }) => b.email.toLowerCase() === email.toLowerCase()
    );
    return NextResponse.json(filtered);
  }
  return NextResponse.json(bookings);
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const bookings = readBookings();
  const idx = bookings.findIndex((b: { id: string }) => b.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  bookings[idx].status = status;
  writeBookings(bookings);
  return NextResponse.json(bookings[idx]);
}

// ── Modular notification system ──────────────────────────────────────────────
async function notifyAdmin(booking: Record<string, string>) {
  const method = process.env.NOTIFICATION_METHOD || "none";

  if (method === "email") {
    await sendEmail(booking);
  } else if (method === "telegram") {
    await sendTelegram(booking);
  } else if (method === "webhook") {
    await sendWebhook(booking);
  }
}

async function sendEmail(booking: Record<string, string>) {
  if (!process.env.SMTP_HOST) return;
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@aksbarbershop.com",
      to: process.env.ADMIN_EMAIL || "admin@aksbarbershop.com",
      subject: `New Booking: ${booking.name} — ${booking.service}`,
      html: `<h2>New Appointment</h2>
        <p><b>Name:</b> ${booking.name}</p>
        <p><b>Phone:</b> ${booking.phone}</p>
        <p><b>Email:</b> ${booking.email}</p>
        <p><b>Service:</b> ${booking.service}</p>
        <p><b>Barber:</b> ${booking.barber}</p>
        <p><b>Date:</b> ${booking.date}</p>
        <p><b>Time:</b> ${booking.time}</p>
        <p><b>Notes:</b> ${booking.notes || "—"}</p>`,
    });
  } catch (err) {
    console.error("Email notification failed:", err);
  }
}

async function sendTelegram(booking: Record<string, string>) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;
  const text = `📅 *New Booking*\n\n👤 ${booking.name}\n📞 ${booking.phone}\n✂️ ${booking.service}\n💈 ${booking.barber}\n📆 ${booking.date} at ${booking.time}`;
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "Markdown" }),
  }).catch(() => {});
}

async function sendWebhook(booking: Record<string, string>) {
  if (!process.env.WEBHOOK_URL) return;
  await fetch(process.env.WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  }).catch(() => {});
}
