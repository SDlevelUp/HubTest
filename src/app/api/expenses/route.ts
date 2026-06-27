import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM expenses ORDER BY spent_at DESC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { label, amount, category, spent_at } = body;
  if (!label || typeof amount !== "number") {
    return NextResponse.json({ error: "label et amount requis" }, { status: 400 });
  }
  const db = getDb();
  db.prepare(
    "INSERT INTO expenses (label, amount, category, spent_at) VALUES (?, ?, ?, ?)"
  ).run(label, amount, category ?? null, spent_at ?? new Date().toISOString());
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
