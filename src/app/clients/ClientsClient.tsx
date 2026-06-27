"use client";

import { useEffect, useState } from "react";
import type { Client } from "@/lib/types";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function ClientsClient() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [selected, setSelected] = useState<Client | null>(null);

  async function refresh() {
    setClients(await api<Client[]>("/api/clients"));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  async function add() {
    if (!form.name) return;
    await api("/api/clients", { method: "POST", body: JSON.stringify(form) });
    setForm({ name: "", email: "", phone: "", notes: "" });
    refresh();
  }

  async function remove(id: number) {
    await api("/api/clients", { method: "DELETE", body: JSON.stringify({ id }) });
    if (selected?.id === id) setSelected(null);
    refresh();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-[#1e1b3a]">Clients</h1>
        <p className="text-sm text-stone-500 mt-1">Tes fiches clients</p>
      </header>

      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-3">
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Téléphone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button onClick={add} className="bg-[#1e1b3a] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-900 transition-colors">
          Ajouter
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200/70 rounded-2xl divide-y divide-stone-100 shadow-sm overflow-hidden">
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`w-full text-left p-3 text-sm hover:bg-stone-50 ${
                selected?.id === c.id ? "bg-stone-50" : ""
              }`}
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-stone-500 text-xs">{c.email ?? "—"}</div>
            </button>
          ))}
          {clients.length === 0 && (
            <div className="p-3 text-stone-400 text-sm">Aucun client enregistré.</div>
          )}
        </div>

        <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm">
          {selected ? (
            <div className="space-y-2 text-sm">
              <div className="font-serif text-xl text-[#1e1b3a]">{selected.name}</div>
              <div>Email : {selected.email ?? "—"}</div>
              <div>Téléphone : {selected.phone ?? "—"}</div>
              <div>Notes : {selected.notes ?? "—"}</div>
              <div className="text-stone-400 text-xs">
                Client depuis le {new Date(selected.created_at).toLocaleDateString("fr-FR")}
              </div>
              <button
                onClick={() => remove(selected.id)}
                className="text-rose-600 text-xs mt-2"
              >
                Supprimer la fiche
              </button>
            </div>
          ) : (
            <div className="text-stone-400 text-sm">Sélectionne un client pour voir sa fiche.</div>
          )}
        </div>
      </div>
    </div>
  );
}
