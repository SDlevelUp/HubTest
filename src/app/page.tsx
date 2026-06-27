import { getDb } from "@/lib/db";
import type { Sale, Goal } from "@/lib/types";

export const dynamic = "force-dynamic";

function startOfMonthISO() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

function startOfYearISO() {
  const d = new Date();
  return new Date(d.getFullYear(), 0, 1).toISOString();
}

export default function DashboardPage() {
  const db = getDb();
  const year = new Date().getFullYear();

  const sales = db
    .prepare("SELECT * FROM sales WHERE sold_at >= ? ORDER BY sold_at DESC")
    .all(startOfYearISO()) as Sale[];

  const monthSales = sales.filter((s) => s.sold_at >= startOfMonthISO());

  const caBrutAnnee = sales.reduce((sum, s) => sum + s.amount_gross, 0);
  const caNetAnnee = sales.reduce((sum, s) => sum + s.amount_net, 0);
  const caBrutMois = monthSales.reduce((sum, s) => sum + s.amount_gross, 0);

  const recurringSales = db
    .prepare(
      `SELECT sales.* FROM sales
       JOIN products ON products.id = sales.product_id
       WHERE products.recurring = 1 AND sales.sold_at >= ?`
    )
    .all(startOfMonthISO()) as Sale[];
  const mrr = recurringSales.reduce((sum, s) => sum + s.amount_net, 0);

  const panierMoyen = sales.length ? caBrutAnnee / sales.length : 0;

  const goal = db.prepare("SELECT * FROM goals WHERE year = ?").get(year) as
    | Goal
    | undefined;
  const progression = goal ? Math.min(100, (caBrutAnnee / goal.target_amount) * 100) : null;

  const expensesMonth = db
    .prepare("SELECT SUM(amount) AS total FROM expenses WHERE spent_at >= ?")
    .get(startOfMonthISO()) as { total: number | null };

  const cards = [
    { label: "CA brut (année)", value: `${caBrutAnnee.toFixed(0)} €` },
    { label: "CA net (année)", value: `${caNetAnnee.toFixed(0)} €` },
    { label: "CA brut (mois)", value: `${caBrutMois.toFixed(0)} €` },
    { label: "MRR (mois)", value: `${mrr.toFixed(0)} €` },
    { label: "Panier moyen", value: `${panierMoyen.toFixed(0)} €` },
    { label: "Dépenses (mois)", value: `${(expensesMonth.total ?? 0).toFixed(0)} €` },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl text-indigo-900">Tableau de bord</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-stone-200 rounded-xl p-4">
            <div className="text-xs text-stone-500">{c.label}</div>
            <div className="text-2xl font-semibold text-indigo-900 mt-1">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <div className="text-sm text-stone-500 mb-2">
          Objectif {year} — {goal ? `${goal.target_amount.toFixed(0)} €` : "non défini"}
        </div>
        {goal ? (
          <div className="w-full bg-stone-100 rounded-full h-3">
            <div
              className="bg-indigo-900 h-3 rounded-full"
              style={{ width: `${progression}%` }}
            />
          </div>
        ) : (
          <a href="/finances" className="text-sm text-indigo-700 underline">
            Définir un objectif dans Pilotage & finances
          </a>
        )}
        {goal && (
          <div className="text-xs text-stone-500 mt-1">{progression!.toFixed(1)}% atteint</div>
        )}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <div className="text-sm font-medium text-stone-700 mb-2">Dernières ventes</div>
        <ul className="text-sm divide-y divide-stone-100">
          {sales.slice(0, 5).map((s) => (
            <li key={s.id} className="py-2 flex justify-between">
              <span>{new Date(s.sold_at).toLocaleDateString("fr-FR")}</span>
              <span className="font-medium">{s.amount_gross.toFixed(0)} €</span>
            </li>
          ))}
          {sales.length === 0 && <li className="py-2 text-stone-400">Aucune vente encore.</li>}
        </ul>
      </div>
    </div>
  );
}
