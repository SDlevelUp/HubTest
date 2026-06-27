import { NextRequest, NextResponse } from "next/server";
import { findAccountByUsername, publicAccount } from "@/lib/db";
import { verifyPassword, setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const account = findAccountByUsername(String(username ?? "").trim());
  if (
    !account ||
    !verifyPassword(String(password ?? ""), account.salt, account.password_hash)
  ) {
    return NextResponse.json(
      { error: "Identifiant ou mot de passe incorrect." },
      { status: 401 }
    );
  }
  await setSession(account.id);
  return NextResponse.json({ ok: true, account: publicAccount(account) });
}
