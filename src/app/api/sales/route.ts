import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT sales.*, clients.name AS client_name, products.name AS product_name
       FROM sales
       LEFT JOIN clients ON clients.id = sales.client_id
       LEFT JOIN products ON products.id = sales.product_id
       ORDER BY sold_at DESC`
    )
    .all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    client_id,
    product_id,
    amount_gross,
    amount_net,
    payment_plan,
    installments_paid,
    installments_total,
    sold_at,
  } = body;
  if (typeof amount_gross !== "number" || typeof amount_net !== "number") {
    return NextResponse.json({ error: "montants requis" }, { status: 400 });
  }
  const db = getDb();
  db.prepare(
    `INSERT INTO sales
      (client_id, product_id, amount_gross, amount_net, payment_plan, installments_paid, installments_total, sold_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    client_id ?? null,
    product_id ?? null,
    amount_gross,
    amount_net,
    payment_plan ?? "comptant",
    installments_paid ?? 1,
    installments_total ?? 1,
    sold_at ?? new Date().toISOString()
  );
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, installments_paid } = await req.json();
  const db = getDb();
  db.prepare("UPDATE sales SET installments_paid = ? WHERE id = ?").run(
    installments_paid,
    id
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM sales WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
