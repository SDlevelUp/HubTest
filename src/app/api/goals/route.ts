import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM goals ORDER BY year DESC").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { year, target_amount } = body;
  if (typeof year !== "number" || typeof target_amount !== "number") {
    return NextResponse.json({ error: "year et target_amount requis" }, { status: 400 });
  }
  const db = getDb();
  db.prepare(
    `INSERT INTO goals (year, target_amount) VALUES (?, ?)
     ON CONFLICT(year) DO UPDATE SET target_amount = excluded.target_amount`
  ).run(year, target_amount);
  return NextResponse.json({ ok: true }, { status: 201 });
}
