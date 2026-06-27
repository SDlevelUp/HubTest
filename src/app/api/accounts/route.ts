import { NextRequest, NextResponse } from "next/server";
import { listAccounts, deleteAccount } from "@/lib/db";

export async function GET() {
  return NextResponse.json(listAccounts());
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  deleteAccount(id);
  return NextResponse.json({ ok: true });
}
