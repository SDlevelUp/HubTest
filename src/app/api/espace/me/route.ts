import { NextRequest, NextResponse } from "next/server";
import { getAccount, publicAccount, updateAccountProfile } from "@/lib/db";
import { getSessionAccountId } from "@/lib/auth";
import { sanitizeAnswers } from "@/lib/questionnaire";

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
    answers: sanitizeAnswers(body.answers),
    status,
  });
  return NextResponse.json({ ok: true, account: updated });
}
