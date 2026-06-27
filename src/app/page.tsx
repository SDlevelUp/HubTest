import {
  salesSince,
  recurringSalesSince,
  getGoal,
  expensesTotalSince,
  allSales,
} from "@/lib/db";
import { StatCard, Card, BarChart, eur } from "@/components/ui";

export const dynamic = "force-dynamic";

function startOfMonthISO() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}
function startOfYearISO() {
  const d = new Date();
  return new Date(d.getFullYear(), 0, 1).toISOString();
}

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const icons = {
  cash: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  trend: <path d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  repeat: <path d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  cart: <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L23 6H6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  out: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
};

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      {children}
    </svg>
  );
}

export default function DashboardPage() {
  const year = new Date().getFullYear();
  const sales = salesSince(startOfYearISO());
  const monthSales = sales.filter((s) => s.sold_at >= startOfMonthISO());

  const caBrutAnnee = sales.reduce((s, x) => s + x.amount_gross, 0);
  const caNetAnnee = sales.reduce((s, x) => s + x.amount_net, 0);
  const caBrutMois = monthSales.reduce((s, x) => s + x.amount_gross, 0);
  const mrr = recurringSalesSince(startOfMonthISO()).reduce((s, x) => s + x.amount_net, 0);
  const panierMoyen = sales.length ? caBrutAnnee / sales.length : 0;
  const depensesMois = expensesTotalSince(startOfMonthISO());

  const goal = getGoal(year);
  const progression = goal ? Math.min(100, (caBrutAnnee / goal.target_amount) * 100) : 0;

  // CA mensuel sur l'année courante
  const monthly = MONTHS.map((label, i) => {
    const total = allSales()
      .filter((s) => {
        const d = new Date(s.sold_at);
        return d.getFullYear() === year && d.getMonth() === i;
      })
      .reduce((sum, s) => sum + s.amount_gross, 0);
    return { label, value: total };
  });

  const recent = [...sales].sort((a, b) => b.sold_at.localeCompare(a.sold_at)).slice(0, 6);

  return (
    <div className="space-y-7">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-[#1e1b3a]">Tableau de bord</h1>
          <p className="text-sm text-stone-500 mt-1">
            Vue d&apos;ensemble de ton activité · {year}
          </p>
        </div>
        <div className="text-sm text-stone-500">
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="CA brut · année" value={eur(caBrutAnnee)} accent="indigo" icon={<Icon>{icons.cash}</Icon>} />
        <StatCard label="CA net · année" value={eur(caNetAnnee)} accent="green" icon={<Icon>{icons.trend}</Icon>} />
        <StatCard label="CA brut · ce mois" value={eur(caBrutMois)} accent="indigo" icon={<Icon>{icons.trend}</Icon>} />
        <StatCard label="MRR · ce mois" value={eur(mrr)} accent="green" icon={<Icon>{icons.repeat}</Icon>} />
        <StatCard label="Panier moyen" value={eur(panierMoyen)} accent="amber" icon={<Icon>{icons.cart}</Icon>} />
        <StatCard label="Dépenses · ce mois" value={eur(depensesMois)} accent="rose" icon={<Icon>{icons.out}</Icon>} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card title={`Chiffre d'affaires mensuel · ${year}`} className="lg:col-span-2">
          <BarChart data={monthly} format={eur} />
        </Card>

        <Card title={`Objectif ${year}`}>
          {goal ? (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#ece9f5" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(progression / 100) * 264} 264`}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-[#1e1b3a]">
                      {progression.toFixed(0)}%
                    </div>
                    <div className="text-[10px] text-stone-400">atteint</div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-stone-500 mt-3 text-center">
                {eur(caBrutAnnee)} / {eur(goal.target_amount)}
              </div>
            </div>
          ) : (
            <div className="text-sm text-stone-400 py-8 text-center">
              Aucun objectif défini.{" "}
              <a href="/finances" className="text-indigo-600 underline">
                En définir un
              </a>
            </div>
          )}
        </Card>
      </div>

      <Card title="Dernières ventes" action={<a href="/finances" className="text-sm text-indigo-600 hover:underline">Tout voir</a>}>
        {recent.length === 0 ? (
          <div className="text-sm text-stone-400 py-6 text-center">Aucune vente enregistrée pour le moment.</div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recent.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 grid place-items-center text-xs font-semibold">
                    {s.payment_plan === "comptant" ? "1x" : s.payment_plan}
                  </div>
                  <div className="text-sm">
                    <div className="text-stone-700">
                      {new Date(s.sold_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div className="text-xs text-stone-400">net {eur(s.amount_net)}</div>
                  </div>
                </div>
                <div className="font-semibold text-[#1e1b3a]">{eur(s.amount_gross)}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
