"use client";

import { useEffect, useState } from "react";
import type { PublicAccount } from "@/lib/types";
import { FIELDS } from "@/lib/questionnaire";

export default function DemandesClient() {
  const [accounts, setAccounts] = useState<PublicAccount[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  async function refresh() {
    const res = await fetch("/api/accounts");
    setAccounts(await res.json());
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setOrigin(window.location.origin);
  }, []);

  async function remove(id: number) {
    await fetch("/api/accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    refresh();
  }

  const link = `${origin}/onboarding`;
  const soumis = accounts.filter((a) => a.status === "soumis").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-title text-3xl text-[#8d47dc]">Onboarding clients</h1>
        <p className="text-sm text-stone-500 mt-1">
          Les questionnaires remplis par tes clients
        </p>
      </header>

      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm">
        <div className="text-sm font-medium text-[#0a0a0a] mb-2">
          Lien à partager avec tes clients
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <code className="text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-[#8d47dc] flex-1 min-w-0 truncate">
            {link}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="bg-[#8d47dc] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#7a35b8]"
          >
            {copied ? "Copié ✓" : "Copier"}
          </button>
        </div>
      </div>

      <div className="flex gap-3 text-sm">
        <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600">
          {accounts.length} compte{accounts.length > 1 ? "s" : ""}
        </span>
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
          {soumis} soumis
        </span>
      </div>

      <div className="bg-white border border-stone-200/70 rounded-2xl shadow-sm divide-y divide-stone-100 overflow-hidden">
        {accounts.map((a) => (
          <div key={a.id}>
            <button
              onClick={() => setOpen(open === a.id ? null : a.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50"
            >
              <div>
                <div className="font-medium text-[#0a0a0a]">
                  {a.answers?.full_name || a.username}
                </div>
                <div className="text-xs text-stone-400">
                  @{a.username} · {a.answers?.email || "sans email"}
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  a.status === "soumis"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {a.status === "soumis" ? "Soumis" : "Brouillon"}
              </span>
            </button>
            {open === a.id && (
              <div className="px-4 pb-4 text-sm grid grid-cols-1 md:grid-cols-2 gap-3 bg-stone-50/50">
                {FIELDS.filter((f) => f.id !== "full_name" && f.id !== "email").map((f) => (
                  <Field
                    key={f.id}
                    label={f.label}
                    value={a.answers?.[f.id] ?? ""}
                    full={f.full || f.type === "textarea"}
                  />
                ))}
                <div className="md:col-span-2">
                  <button
                    onClick={() => remove(a.id)}
                    className="text-rose-500 text-xs mt-1"
                  >
                    Supprimer ce compte
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="p-6 text-sm text-stone-400 text-center">
            Aucun onboarding pour le moment. Partage le lien ci-dessus à tes clients.
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="text-[11px] uppercase tracking-wide text-stone-400">{label}</div>
      <div className="text-[#0a0a0a] whitespace-pre-wrap">{value || "—"}</div>
    </div>
  );
}
