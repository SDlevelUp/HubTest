import { NextRequest, NextResponse } from "next/server";
import { createAccount, findAccountByUsername } from "@/lib/db";
import { hashPassword, setSession } from "@/lib/auth";
import { sanitizeAnswers } from "@/lib/questionnaire";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  const status = body.status === "soumis" ? "soumis" : "brouillon";

  if (username.length < 3) {
    return NextResponse.json(
      { error: "L'identifiant doit faire au moins 3 caractères." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Le mot de passe doit faire au moins 6 caractères." },
      { status: 400 }
    );
  }
  if (findAccountByUsername(username)) {
    return NextResponse.json(
      { error: "Cet identifiant est déjà pris." },
      { status: 409 }
    );
  }

  const { salt, hash } = hashPassword(password);
  const account = createAccount({
    username,
    password_hash: hash,
    salt,
    answers: sanitizeAnswers(body.answers),
    status,
  });

  await setSession(account.id);
  return NextResponse.json({ ok: true, account }, { status: 201 });
}
