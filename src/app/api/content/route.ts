import { NextRequest, NextResponse } from "next/server";
import {
  listContent,
  createContent,
  updateContentStatus,
  deleteContent,
} from "@/lib/db";

export async function GET() {
  return NextResponse.json(listContent());
}

export async function POST(req: NextRequest) {
  const { title, channel, status, date, notes } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "title requis" }, { status: 400 });
  }
  createContent({
    title,
    channel: channel ?? "Instagram",
    status: status ?? "idée",
    date: date ?? null,
    notes: notes ?? null,
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  updateContentStatus(id, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  deleteContent(id);
  return NextResponse.json({ ok: true });
}
