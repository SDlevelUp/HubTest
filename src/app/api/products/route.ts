import { NextRequest, NextResponse } from "next/server";
import { listProducts, createProduct, deleteProduct } from "@/lib/db";

export async function GET() {
  return NextResponse.json(listProducts());
}

export async function POST(req: NextRequest) {
  const { name, price, recurring } = await req.json();
  if (!name || typeof price !== "number") {
    return NextResponse.json({ error: "name et price requis" }, { status: 400 });
  }
  createProduct(name, price, !!recurring);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  deleteProduct(id);
  return NextResponse.json({ ok: true });
}
