import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, price, recurring } = body;
  if (!name || typeof price !== "number") {
    return NextResponse.json({ error: "name et price requis" }, { status: 400 });
  }
  const db = getDb();
  db.prepare("INSERT INTO products (name, price, recurring) VALUES (?, ?, ?)").run(
    name,
    price,
    recurring ? 1 : 0
  );
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
