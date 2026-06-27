import { NextRequest, NextResponse } from "next/server";
import { getAccount, publicAccount, updateAccountProfile } from "@/lib/db";
import { getSessionAccountId } from "@/lib/auth";

export async function GET() {
  const id = await getSessionAccountId();
  if (!id) return NextResponse.json({ account: null });
  const account = getAccount(id);
  return NextResponse.json({ account: account ? publicAccount(account) : null });
}

export async function PATCH(req: NextRequest) {
  const id = await getSessionAccountId();
  if (!id) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  const body = await req.json();
  const status = body.status === "soumis" ? "soumis" : "brouillon";
  const updated = updateAccountProfile(id, {
    full_name: String(body.full_name ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    activity: String(body.activity ?? ""),
    level: String(body.level ?? ""),
    objectives: String(body.objectives ?? ""),
    budget: String(body.budget ?? ""),
    availability: String(body.availability ?? ""),
    message: String(body.message ?? ""),
    status,
  });
  return NextResponse.json({ ok: true, account: updated });
}
