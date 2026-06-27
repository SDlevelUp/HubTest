"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionnaireFields from "@/components/QuestionnaireFields";
import { emptyAnswers } from "@/lib/questionnaire";
import type { PublicAccount } from "@/lib/types";

export default function EspaceClient() {
  const router = useRouter();
  const [account, setAccount] = useState<PublicAccount | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>(emptyAnswers());
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState("");

  async function load() {
    const res = await fetch("/api/espace/me");
    const j = await res.json();
    if (!j.account) {
      router.replace("/espace/login");
      return;
    }
    setAccount(j.account);
    setAnswers({ ...emptyAnswers(), ...(j.account.answers ?? {}) });
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(status: "brouillon" | "soumis") {
    setSaved("");
    const res = await fetch("/api/espace/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, status }),
    });
    const j = await res.json();
    if (j.account) {
      setAccount(j.account);
      setSaved(status === "soumis" ? "Questionnaire soumis ✅" : "Brouillon enregistré 💾");
    }
  }

  async function logout() {
    await fetch("/api/espace/logout", { method: "POST" });
    router.push("/espace/login");
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-stone-400">Chargement…</div>;
  }

  const displayName = account?.answers?.full_name || account?.username;

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="SDlevelUp" className="w-10 h-10" />
          <span className="text-xl font-bold">SDlevelUp</span>
        </div>
        <button onClick={logout} className="text-sm text-stone-500 hover:text-[#8d47dc]">
          Se déconnecter
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-title text-3xl text-[#8d47dc]">Bonjour {displayName} 👋</h1>
          <p className="text-sm text-stone-500 mt-1">Ton espace personnel</p>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            account?.status === "soumis"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {account?.status === "soumis" ? "Soumis" : "Brouillon"}
        </span>
      </div>

      <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-8">
        <QuestionnaireFields answers={answers} set={setAnswers} />

        {saved && <div className="text-sm text-emerald-600">{saved}</div>}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => save("soumis")}
            className="bg-[#8d47dc] text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-[#7a35b8] transition-colors"
          >
            Soumettre
          </button>
          <button
            onClick={() => save("brouillon")}
            className="bg-white border border-stone-200 rounded-lg px-5 py-2.5 text-sm font-medium text-[#8d47dc] hover:border-[#8d47dc] transition-colors"
          >
            Enregistrer en brouillon
          </button>
        </div>
      </div>
    </div>
  );
}
