import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM clients ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, notes } = body;
  if (!name) {
    return NextResponse.json({ error: "name requis" }, { status: 400 });
  }
  const db = getDb();
  db.prepare(
    "INSERT INTO clients (name, email, phone, notes) VALUES (?, ?, ?, ?)"
  ).run(name, email ?? null, phone ?? null, notes ?? null);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM clients WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
