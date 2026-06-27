import { NextRequest, NextResponse } from "next/server";
import { listLaunches, createLaunch, deleteLaunch } from "@/lib/db";

export async function GET() {
  return NextResponse.json(listLaunches());
}

export async function POST(req: NextRequest) {
  const { name, start_date, end_date, goal_amount, status, notes } =
    await req.json();
  if (!name) {
    return NextResponse.json({ error: "name requis" }, { status: 400 });
  }
  createLaunch({
    name,
    start_date: start_date ?? null,
    end_date: end_date ?? null,
    goal_amount: typeof goal_amount === "number" ? goal_amount : 0,
    status: status ?? "à venir",
    notes: notes ?? null,
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  deleteLaunch(id);
  return NextResponse.json({ ok: true });
}
