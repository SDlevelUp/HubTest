import { NextRequest, NextResponse } from "next/server";
import {
  listSales,
  createSale,
  updateSaleInstallments,
  deleteSale,
} from "@/lib/db";

export async function GET() {
  return NextResponse.json(listSales());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount_gross, amount_net } = body;
  if (typeof amount_gross !== "number" || typeof amount_net !== "number") {
    return NextResponse.json({ error: "montants requis" }, { status: 400 });
  }
  createSale({
    client_id: body.client_id ?? null,
    product_id: body.product_id ?? null,
    amount_gross,
    amount_net,
    payment_plan: body.payment_plan ?? "comptant",
    installments_paid: body.installments_paid ?? 1,
    installments_total: body.installments_total ?? 1,
    sold_at: body.sold_at ?? new Date().toISOString(),
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, installments_paid } = await req.json();
  updateSaleInstallments(id, installments_paid);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  deleteSale(id);
  return NextResponse.json({ ok: true });
}
