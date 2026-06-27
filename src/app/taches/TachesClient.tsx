"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/lib/types";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const PRIORITIES = ["haute", "normale", "basse"];
const prioColor: Record<string, string> = {
  haute: "bg-rose-100 text-rose-700",
  normale: "bg-indigo-100 text-indigo-700",
  basse: "bg-stone-100 text-stone-500",
};

export default function TachesClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState({ title: "", priority: "normale", due_date: "" });

  async function refresh() {
    setTasks(await api<Task[]>("/api/tasks"));
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  async function add() {
    if (!form.title) return;
    await api("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: form.title,
        priority: form.priority,
        due_date: form.due_date || null,
      }),
    });
    setForm({ title: "", priority: "normale", due_date: "" });
    refresh();
  }
  async function toggle(t: Task) {
    await api("/api/tasks", {
      method: "PATCH",
      body: JSON.stringify({ id: t.id, done: t.done ? 0 : 1 }),
    });
    refresh();
  }
  async function remove(id: number) {
    await api("/api/tasks", { method: "DELETE", body: JSON.stringify({ id }) });
    refresh();
  }

  const todo = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-[#2a1d54]">Mes tâches</h1>
        <p className="text-sm text-stone-500 mt-1">To-do et priorités</p>
      </header>

      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          className="md:col-span-2 border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e8920c]/40"
          placeholder="Nouvelle tâche…"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <select
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e8920c]/40"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              Priorité {p}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e8920c]/40"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
          <button
            onClick={add}
            className="bg-[#2a1d54] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#3a2a6e] transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm divide-y divide-stone-100 overflow-hidden">
        {todo.map((t) => (
          <Row key={t.id} t={t} toggle={toggle} remove={remove} />
        ))}
        {todo.length === 0 && (
          <div className="p-4 text-sm text-stone-400">Aucune tâche en cours 🎉</div>
        )}
      </div>

      {done.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            Terminées
          </div>
          <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm divide-y divide-stone-100 overflow-hidden">
            {done.map((t) => (
              <Row key={t.id} t={t} toggle={toggle} remove={remove} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  function Row({
    t,
    toggle,
    remove,
  }: {
    t: Task;
    toggle: (t: Task) => void;
    remove: (id: number) => void;
  }) {
    return (
      <div className="flex items-center gap-3 p-3 text-sm">
        <button
          onClick={() => toggle(t)}
          className={`w-5 h-5 rounded-md border grid place-items-center shrink-0 ${
            t.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-stone-300"
          }`}
        >
          {t.done ? "✓" : ""}
        </button>
        <div className={`flex-1 ${t.done ? "line-through text-stone-400" : ""}`}>
          {t.title}
        </div>
        {t.due_date && (
          <span className="text-xs text-stone-400">
            {new Date(t.due_date).toLocaleDateString("fr-FR")}
          </span>
        )}
        <span className={`text-[11px] px-2 py-0.5 rounded-md ${prioColor[t.priority] ?? ""}`}>
          {t.priority}
        </span>
        <button onClick={() => remove(t.id)} className="text-rose-500 text-xs">
          ✕
        </button>
      </div>
    );
  }
}
