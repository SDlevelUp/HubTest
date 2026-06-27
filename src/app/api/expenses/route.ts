import { NextRequest, NextResponse } from "next/server";
import { listExpenses, createExpense, deleteExpense } from "@/lib/db";

export async function GET() {
  return NextResponse.json(listExpenses());
}

export async function POST(req: NextRequest) {
  const { label, amount, category, spent_at } = await req.json();
  if (!label || typeof amount !== "number") {
    return NextResponse.json({ error: "label et amount requis" }, { status: 400 });
  }
  createExpense(label, amount, category ?? null, spent_at ?? new Date().toISOString());
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  deleteExpense(id);
  return NextResponse.json({ ok: true });
}
