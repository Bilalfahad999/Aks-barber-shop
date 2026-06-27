import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "clients.json");

function hash(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function readClients() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeClients(clients: unknown[]) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(clients, null, 2));
}

// GET ?email=xxx — check if account exists
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ exists: false });
  const clients = readClients();
  const exists = clients.some(
    (c: { email: string }) => c.email.toLowerCase() === email.toLowerCase()
  );
  return NextResponse.json({ exists });
}

// POST — register or login
export async function POST(req: NextRequest) {
  const { action, email, password, name } = await req.json();
  const clients = readClients();
  const emailLower = email.toLowerCase();

  if (action === "register") {
    const exists = clients.some((c: { email: string }) => c.email === emailLower);
    if (exists) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." });
    }
    clients.push({ email: emailLower, name, passwordHash: hash(password), createdAt: new Date().toISOString() });
    writeClients(clients);
    return NextResponse.json({ success: true, name });
  }

  if (action === "login") {
    const client = clients.find((c: { email: string }) => c.email === emailLower);
    if (!client) {
      return NextResponse.json({ success: false, error: "No account found with this email." });
    }
    if (client.passwordHash !== hash(password)) {
      return NextResponse.json({ success: false, error: "Incorrect password." });
    }
    return NextResponse.json({ success: true, name: client.name });
  }

  return NextResponse.json({ success: false, error: "Invalid action." });
}
