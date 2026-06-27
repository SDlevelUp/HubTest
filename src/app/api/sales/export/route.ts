import { listSales } from "@/lib/db";

export async function GET() {
  const sales = listSales();
  const header = [
    "date",
    "client",
    "produit",
    "montant_brut",
    "montant_net",
    "paiement",
    "echeances_payees",
    "echeances_total",
  ];
  const rows = sales.map((s) =>
    [
      s.sold_at.slice(0, 10),
      s.client_name ?? "",
      s.product_name ?? "",
      s.amount_gross,
      s.amount_net,
      s.payment_plan,
      s.installments_paid,
      s.installments_total,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ventes.csv"`,
    },
  });
}
