import { NextRequest, NextResponse } from "next/server";
import { listTasks, createTask, toggleTask, deleteTask } from "@/lib/db";

export async function GET() {
  return NextResponse.json(listTasks());
}

export async function POST(req: NextRequest) {
  const { title, priority, due_date } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "title requis" }, { status: 400 });
  }
  createTask(title, priority ?? "normale", due_date ?? null);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, done } = await req.json();
  toggleTask(id, !!done);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  deleteTask(id);
  return NextResponse.json({ ok: true });
}
