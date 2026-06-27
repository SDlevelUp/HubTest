import { NextRequest, NextResponse } from "next/server";
import { listClients, createClient, deleteClient } from "@/lib/db";

export async function GET() {
  return NextResponse.json(listClients());
}

export async function POST(req: NextRequest) {
  const { name, email, phone, notes } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "name requis" }, { status: 400 });
  }
  createClient(name, email ?? null, phone ?? null, notes ?? null);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  deleteClient(id);
  return NextResponse.json({ ok: true });
}
