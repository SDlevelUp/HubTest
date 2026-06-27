import { NextRequest, NextResponse } from "next/server";
import { listGoals, upsertGoal } from "@/lib/db";

export async function GET() {
  return NextResponse.json(listGoals());
}

export async function POST(req: NextRequest) {
  const { year, target_amount } = await req.json();
  if (typeof year !== "number" || typeof target_amount !== "number") {
    return NextResponse.json({ error: "year et target_amount requis" }, { status: 400 });
  }
  upsertGoal(year, target_amount);
  return NextResponse.json({ ok: true }, { status: 201 });
}
