"use client";

import { useEffect, useState } from "react";
import type { Product, Sale, Expense, Goal, Client } from "@/lib/types";

type SaleRow = Sale & { client_name?: string; product_name?: string };

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const TABS = ["Ventes", "Produits", "Dépenses", "Objectif"] as const;

export default function FinancesClient() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Ventes");
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  async function refresh() {
    const [p, c, s, e, g] = await Promise.all([
      api<Product[]>("/api/products"),
      api<Client[]>("/api/clients"),
      api<SaleRow[]>("/api/sales"),
      api<Expense[]>("/api/expenses"),
      api<Goal[]>("/api/goals"),
    ]);
    setProducts(p);
    setClients(c);
    setSales(s);
    setExpenses(e);
    setGoals(g);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-[#1e1b3a]">Pilotage &amp; finances</h1>
        <p className="text-sm text-stone-500 mt-1">Ventes, produits, dépenses et objectifs</p>
      </header>
      <div className="inline-flex gap-1 bg-white border border-stone-200/70 rounded-xl p-1 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              tab === t
                ? "bg-[#1e1b3a] text-white font-medium"
                : "text-stone-500 hover:text-[#1e1b3a]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Ventes" && (
        <VentesTab
          sales={sales}
          products={products}
          clients={clients}
          refresh={refresh}
        />
      )}
      {tab === "Produits" && <ProduitsTab products={products} refresh={refresh} />}
      {tab === "Dépenses" && <DepensesTab expenses={expenses} refresh={refresh} />}
      {tab === "Objectif" && <ObjectifTab goals={goals} refresh={refresh} />}
    </div>
  );
}

function VentesTab({
  sales,
  products,
  clients,
  refresh,
}: {
  sales: SaleRow[];
  products: Product[];
  clients: Client[];
  refresh: () => void;
}) {
  const [form, setForm] = useState({
    client_id: "",
    product_id: "",
    amount_gross: "",
    amount_net: "",
    payment_plan: "comptant",
    installments_total: "1",
    sold_at: new Date().toISOString().slice(0, 10),
  });

  async function add() {
    if (!form.amount_gross || !form.amount_net) return;
    await api("/api/sales", {
      method: "POST",
      body: JSON.stringify({
        client_id: form.client_id ? Number(form.client_id) : null,
        product_id: form.product_id ? Number(form.product_id) : null,
        amount_gross: Number(form.amount_gross),
        amount_net: Number(form.amount_net),
        payment_plan: form.payment_plan,
        installments_paid: form.payment_plan === "comptant" ? 1 : 1,
        installments_total:
          form.payment_plan === "comptant" ? 1 : Number(form.installments_total),
        sold_at: new Date(form.sold_at).toISOString(),
      }),
    });
    setForm({ ...form, amount_gross: "", amount_net: "" });
    refresh();
  }

  async function markPaid(s: SaleRow) {
    await api("/api/sales", {
      method: "PATCH",
      body: JSON.stringify({
        id: s.id,
        installments_paid: Math.min(s.installments_paid + 1, s.installments_total),
      }),
    });
    refresh();
  }

  async function remove(id: number) {
    await api("/api/sales", { method: "DELETE", body: JSON.stringify({ id }) });
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-3">
        <select
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={form.client_id}
          onChange={(e) => setForm({ ...form, client_id: e.target.value })}
        >
          <option value="">Client (optionnel)</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={form.product_id}
          onChange={(e) => setForm({ ...form, product_id: e.target.value })}
        >
          <option value="">Produit (optionnel)</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Montant brut €"
          type="number"
          value={form.amount_gross}
          onChange={(e) => setForm({ ...form, amount_gross: e.target.value })}
        />
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Montant net €"
          type="number"
          value={form.amount_net}
          onChange={(e) => setForm({ ...form, amount_net: e.target.value })}
        />
        <select
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={form.payment_plan}
          onChange={(e) => setForm({ ...form, payment_plan: e.target.value })}
        >
          <option value="comptant">Comptant</option>
          <option value="3x">3x</option>
          <option value="4x">4x</option>
        </select>
        {form.payment_plan !== "comptant" && (
          <input
            className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Nb échéances"
            type="number"
            value={form.installments_total}
            onChange={(e) => setForm({ ...form, installments_total: e.target.value })}
          />
        )}
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          type="date"
          value={form.sold_at}
          onChange={(e) => setForm({ ...form, sold_at: e.target.value })}
        />
        <button
          onClick={add}
          className="bg-[#1e1b3a] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-900 transition-colors"
        >
          Ajouter la vente
        </button>
      </div>

      <div className="bg-white border border-stone-200/70 rounded-2xl divide-y divide-stone-100 shadow-sm overflow-hidden">
        {sales.map((s) => (
          <div key={s.id} className="p-3 flex items-center justify-between text-sm">
            <div>
              <div className="font-medium">
                {s.amount_gross.toFixed(0)} € brut / {s.amount_net.toFixed(0)} € net
              </div>
              <div className="text-stone-500">
                {s.client_name ?? "—"} · {s.product_name ?? "—"} ·{" "}
                {new Date(s.sold_at).toLocaleDateString("fr-FR")} · {s.payment_plan}
                {s.payment_plan !== "comptant" &&
                  ` (${s.installments_paid}/${s.installments_total})`}
              </div>
            </div>
            <div className="flex gap-2">
              {s.payment_plan !== "comptant" && s.installments_paid < s.installments_total && (
                <button
                  onClick={() => markPaid(s)}
                  className="text-indigo-700 underline text-xs"
                >
                  Échéance payée
                </button>
              )}
              <button onClick={() => remove(s.id)} className="text-rose-600 text-xs">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {sales.length === 0 && (
          <div className="p-3 text-stone-400 text-sm">Aucune vente enregistrée.</div>
        )}
      </div>
    </div>
  );
}

function ProduitsTab({
  products,
  refresh,
}: {
  products: Product[];
  refresh: () => void;
}) {
  const [form, setForm] = useState({ name: "", price: "", recurring: false });

  async function add() {
    if (!form.name || !form.price) return;
    await api("/api/products", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        recurring: form.recurring,
      }),
    });
    setForm({ name: "", price: "", recurring: false });
    refresh();
  }

  async function remove(id: number) {
    await api("/api/products", { method: "DELETE", body: JSON.stringify({ id }) });
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Nom du produit"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Prix €"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.recurring}
            onChange={(e) => setForm({ ...form, recurring: e.target.checked })}
          />
          Récurrent (abonnement)
        </label>
        <button
          onClick={add}
          className="bg-[#1e1b3a] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-900 transition-colors"
        >
          Ajouter
        </button>
      </div>
      <div className="bg-white border border-stone-200/70 rounded-2xl divide-y divide-stone-100 shadow-sm overflow-hidden">
        {products.map((p) => (
          <div key={p.id} className="p-3 flex items-center justify-between text-sm">
            <div>
              {p.name} — {p.price.toFixed(0)} € {p.recurring ? "(récurrent)" : ""}
            </div>
            <button onClick={() => remove(p.id)} className="text-rose-600 text-xs">
              Supprimer
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <div className="p-3 text-stone-400 text-sm">Aucun produit au catalogue.</div>
        )}
      </div>
    </div>
  );
}

function DepensesTab({
  expenses,
  refresh,
}: {
  expenses: Expense[];
  refresh: () => void;
}) {
  const [form, setForm] = useState({
    label: "",
    amount: "",
    category: "",
    spent_at: new Date().toISOString().slice(0, 10),
  });

  async function add() {
    if (!form.label || !form.amount) return;
    await api("/api/expenses", {
      method: "POST",
      body: JSON.stringify({
        label: form.label,
        amount: Number(form.amount),
        category: form.category || null,
        spent_at: new Date(form.spent_at).toISOString(),
      }),
    });
    setForm({ ...form, label: "", amount: "" });
    refresh();
  }

  async function remove(id: number) {
    await api("/api/expenses", { method: "DELETE", body: JSON.stringify({ id }) });
    refresh();
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-3">
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Libellé"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Montant €"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Catégorie"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          type="date"
          value={form.spent_at}
          onChange={(e) => setForm({ ...form, spent_at: e.target.value })}
        />
        <button
          onClick={add}
          className="bg-[#1e1b3a] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-900 transition-colors col-span-2 md:col-span-1"
        >
          Ajouter
        </button>
      </div>
      <div className="text-sm text-stone-500">Total : {total.toFixed(0)} €</div>
      <div className="bg-white border border-stone-200/70 rounded-2xl divide-y divide-stone-100 shadow-sm overflow-hidden">
        {expenses.map((e) => (
          <div key={e.id} className="p-3 flex items-center justify-between text-sm">
            <div>
              {e.label} — {e.amount.toFixed(0)} € {e.category ? `(${e.category})` : ""} ·{" "}
              {new Date(e.spent_at).toLocaleDateString("fr-FR")}
            </div>
            <button onClick={() => remove(e.id)} className="text-rose-600 text-xs">
              Supprimer
            </button>
          </div>
        ))}
        {expenses.length === 0 && (
          <div className="p-3 text-stone-400 text-sm">Aucune dépense enregistrée.</div>
        )}
      </div>
    </div>
  );
}

function ObjectifTab({ goals, refresh }: { goals: Goal[]; refresh: () => void }) {
  const year = new Date().getFullYear();
  const current = goals.find((g) => g.year === year);
  const [amount, setAmount] = useState(current?.target_amount.toString() ?? "");

  async function save() {
    if (!amount) return;
    await api("/api/goals", {
      method: "POST",
      body: JSON.stringify({ year, target_amount: Number(amount) }),
    });
    refresh();
  }

  return (
    <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm space-y-3 max-w-sm">
      <div className="text-sm text-stone-500">Objectif de CA brut pour {year}</div>
      <input
        className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full"
        type="number"
        placeholder="Montant €"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={save} className="bg-[#1e1b3a] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-900 transition-colors">
        Enregistrer
      </button>
    </div>
  );
}
