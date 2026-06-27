"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const input =
  "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8d47dc]/30";
const label = "block text-sm font-medium text-[#0a0a0a] mb-1";

export default function LoginClient() {
  const router = useRouter();
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function login() {
    setError("");
    setBusy(true);
    const res = await fetch("/api/espace/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      return setError(j.error ?? "Connexion impossible.");
    }
    router.push("/espace");
  }

  return (
    <div className="min-h-screen grid place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="SDlevelUp" className="w-10 h-10" />
          <span className="text-xl font-bold">SDlevelUp</span>
        </div>
        <div className="bg-white border border-stone-200/70 rounded-2xl p-6 shadow-sm space-y-4">
          <h1 className="font-title text-2xl text-[#8d47dc]">Connexion à ton espace</h1>
          <div>
            <label className={label}>Identifiant</label>
            <input
              className={input}
              value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>
          <div>
            <label className={label}>Mot de passe</label>
            <input
              className={input}
              type="password"
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>
          {error && <div className="text-sm text-rose-600">{error}</div>}
          <button
            disabled={busy}
            onClick={login}
            className="w-full bg-[#8d47dc] text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-[#7a35b8] transition-colors disabled:opacity-50"
          >
            Se connecter
          </button>
        </div>
        <p className="text-sm text-stone-500 mt-6 text-center">
          Pas encore de compte ?{" "}
          <a href="/onboarding" className="text-[#8d47dc] underline">
            Remplir le questionnaire
          </a>
        </p>
      </div>
    </div>
  );
}
