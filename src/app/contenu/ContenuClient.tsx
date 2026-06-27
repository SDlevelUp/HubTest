"use client";

import { useEffect, useState } from "react";
import type { ContentItem, Launch } from "@/lib/types";
import { eur } from "@/components/ui";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const STATUSES = ["idée", "à faire", "programmé", "publié"];
const statusColor: Record<string, string> = {
  "idée": "border-stone-300",
  "à faire": "border-amber-400",
  "programmé": "border-indigo-400",
  "publié": "border-emerald-400",
};
const CHANNELS = ["Instagram", "TikTok", "YouTube", "Newsletter", "Blog", "LinkedIn"];

export default function ContenuClient() {
  const [tab, setTab] = useState<"Calendrier" | "Lancements">("Calendrier");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);

  async function refresh() {
    const [c, l] = await Promise.all([
      api<ContentItem[]>("/api/content"),
      api<Launch[]>("/api/launches"),
    ]);
    setContent(c);
    setLaunches(l);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-[#8d47dc]">Contenu &amp; lancements</h1>
        <p className="text-sm text-stone-500 mt-1">Calendrier éditorial et suivi des lancements</p>
      </header>

      <div className="inline-flex gap-1 bg-white border border-stone-200/70 rounded-xl p-1 shadow-sm">
        {(["Calendrier", "Lancements"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              tab === t ? "bg-[#8d47dc] text-white font-medium" : "text-stone-500 hover:text-[#8d47dc]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Calendrier" ? (
        <Calendrier content={content} refresh={refresh} />
      ) : (
        <Lancements launches={launches} refresh={refresh} />
      )}
    </div>
  );
}

function Calendrier({ content, refresh }: { content: ContentItem[]; refresh: () => void }) {
  const [form, setForm] = useState({
    title: "",
    channel: "Instagram",
    date: "",
    notes: "",
  });

  async function add() {
    if (!form.title) return;
    await api("/api/content", {
      method: "POST",
      body: JSON.stringify({ ...form, status: "idée", date: form.date || null }),
    });
    setForm({ title: "", channel: "Instagram", date: "", notes: "" });
    refresh();
  }
  async function move(c: ContentItem, status: string) {
    await api("/api/content", {
      method: "PATCH",
      body: JSON.stringify({ id: c.id, status }),
    });
    refresh();
  }
  async function remove(id: number) {
    await api("/api/content", { method: "DELETE", body: JSON.stringify({ id }) });
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          className="md:col-span-2 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8920c]/40"
          placeholder="Idée de contenu…"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <select
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e8920c]/40"
          value={form.channel}
          onChange={(e) => setForm({ ...form, channel: e.target.value })}
        >
          {CHANNELS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8920c]/40"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <button
            onClick={add}
            className="bg-[#8d47dc] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#7a35b8] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STATUSES.map((status) => {
          const items = content.filter((c) => c.status === status);
          return (
            <div key={status} className="bg-white border border-stone-200/70 rounded-2xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-sm font-medium text-[#8d47dc] capitalize">{status}</span>
                <span className="text-xs text-stone-400">{items.length}</span>
              </div>
              <div className="space-y-2 min-h-[60px]">
                {items.map((c) => (
                  <div
                    key={c.id}
                    className={`border-l-4 ${statusColor[status]} bg-stone-50 rounded-lg p-2.5 text-sm`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[#8d47dc]">{c.title}</span>
                      <button onClick={() => remove(c.id)} className="text-rose-400 text-xs">✕</button>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1">
                      {c.channel}
                      {c.date && ` · ${new Date(c.date).toLocaleDateString("fr-FR")}`}
                    </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {STATUSES.filter((s) => s !== status).map((s) => (
                        <button
                          key={s}
                          onClick={() => move(c, s)}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-500 hover:border-[#e8920c]"
                        >
                          → {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Lancements({ launches, refresh }: { launches: Launch[]; refresh: () => void }) {
  const [form, setForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    goal_amount: "",
    status: "à venir",
  });

  async function add() {
    if (!form.name) return;
    await api("/api/launches", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        goal_amount: form.goal_amount ? Number(form.goal_amount) : 0,
        status: form.status,
      }),
    });
    setForm({ name: "", start_date: "", end_date: "", goal_amount: "", status: "à venir" });
    refresh();
  }
  async function remove(id: number) {
    await api("/api/launches", { method: "DELETE", body: JSON.stringify({ id }) });
    refresh();
  }

  const statusBadge: Record<string, string> = {
    "à venir": "bg-amber-100 text-amber-700",
    "en cours": "bg-emerald-100 text-emerald-700",
    "terminé": "bg-stone-100 text-stone-500",
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-3">
        <input
          className="md:col-span-2 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8920c]/40"
          placeholder="Nom du lancement"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8920c]/40"
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />
        <input
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8920c]/40"
          placeholder="Objectif €"
          type="number"
          value={form.goal_amount}
          onChange={(e) => setForm({ ...form, goal_amount: e.target.value })}
        />
        <button
          onClick={add}
          className="bg-[#8d47dc] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#7a35b8] transition-colors"
        >
          Ajouter
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {launches.map((l) => (
          <div key={l.id} className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-[#8d47dc]">{l.name}</div>
                <div className="text-xs text-stone-400 mt-0.5">
                  {l.start_date ? new Date(l.start_date).toLocaleDateString("fr-FR") : "—"}
                  {l.end_date && ` → ${new Date(l.end_date).toLocaleDateString("fr-FR")}`}
                </div>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-md ${statusBadge[l.status] ?? "bg-stone-100"}`}>
                {l.status}
              </span>
            </div>
            {l.goal_amount > 0 && (
              <div className="text-sm text-stone-500 mt-3">Objectif : {eur(l.goal_amount)}</div>
            )}
            <button onClick={() => remove(l.id)} className="text-rose-500 text-xs mt-3">
              Supprimer
            </button>
          </div>
        ))}
        {launches.length === 0 && (
          <div className="text-sm text-stone-400">Aucun lancement planifié.</div>
        )}
      </div>
    </div>
  );
}
