import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "offers.json");

function readOffers() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeOffers(offers: unknown[]) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(offers, null, 2));
}

export async function GET(req: NextRequest) {
  const offers = readOffers();
  const email = req.nextUrl.searchParams.get("email");
  if (email) {
    return NextResponse.json(
      offers.filter((o: { customerEmail: string }) =>
        o.customerEmail.toLowerCase() === email.toLowerCase()
      )
    );
  }
  return NextResponse.json(offers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const offers = readOffers();
  const offer = {
    id: Date.now().toString(),
    ...body,
    used: false,
    createdAt: new Date().toISOString(),
  };
  offers.push(offer);
  writeOffers(offers);
  return NextResponse.json({ success: true, offer });
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const offers = readOffers();
  const idx = offers.findIndex((o: { id: string }) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  offers[idx] = { ...offers[idx], ...updates };
  writeOffers(offers);
  return NextResponse.json(offers[idx]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const offers = readOffers();
  const filtered = offers.filter((o: { id: string }) => o.id !== id);
  writeOffers(filtered);
  return NextResponse.json({ success: true });
}
