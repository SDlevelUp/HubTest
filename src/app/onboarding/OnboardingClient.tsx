"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionnaireFields from "@/components/QuestionnaireFields";
import { emptyAnswers } from "@/lib/questionnaire";

const input =
  "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8d47dc]/30";
const label = "block text-sm font-medium text-[#0a0a0a] mb-1";

export default function OnboardingClient() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>(emptyAnswers());
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(status: "brouillon" | "soumis") {
    setError("");
    if (creds.username.length < 3) return setError("Choisis un identifiant (3 caractères min).");
    if (creds.password.length < 6) return setError("Choisis un mot de passe (6 caractères min).");
    setBusy(true);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, ...creds, status }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      return setError(j.error ?? "Une erreur est survenue.");
    }
    router.push("/espace");
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="flex items-center gap-3 mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="SDlevelUp" className="w-10 h-10" />
        <span className="text-xl font-bold">SDlevelUp</span>
      </div>

      <h1 className="font-title text-3xl text-[#8d47dc]">Bienvenue 👋</h1>
      <p className="text-sm text-stone-500 mt-1 mb-8">
        Remplis ce questionnaire pour qu&apos;on prépare ton projet web. Tu peux
        l&apos;enregistrer en brouillon et le finir plus tard avec ton identifiant.
      </p>

      <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-8">
        <QuestionnaireFields answers={answers} set={setAnswers} />

        <div className="border-t border-stone-100 pt-6">
          <h3 className="font-title text-base text-[#8d47dc] mb-1">Tes identifiants</h3>
          <p className="text-xs text-stone-400 mb-4">
            Choisis un identifiant et un mot de passe pour accéder à ton espace.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Identifiant</label>
              <input
                className={input}
                value={creds.username}
                onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              />
            </div>
            <div>
              <label className={label}>Mot de passe</label>
              <input
                className={input}
                type="password"
                value={creds.password}
                onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              />
            </div>
          </div>
        </div>

        {error && <div className="text-sm text-rose-600">{error}</div>}

        <div className="flex flex-wrap gap-3">
          <button
            disabled={busy}
            onClick={() => submit("soumis")}
            className="bg-[#8d47dc] text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-[#7a35b8] transition-colors disabled:opacity-50"
          >
            Soumettre mon questionnaire
          </button>
          <button
            disabled={busy}
            onClick={() => submit("brouillon")}
            className="bg-white border border-stone-200 rounded-lg px-5 py-2.5 text-sm font-medium text-[#8d47dc] hover:border-[#8d47dc] transition-colors disabled:opacity-50"
          >
            Enregistrer en brouillon
          </button>
        </div>
      </div>

      <p className="text-sm text-stone-500 mt-6 text-center">
        Déjà un compte ?{" "}
        <a href="/espace/login" className="text-[#8d47dc] underline">
          Connecte-toi
        </a>
      </p>
    </div>
  );
}
