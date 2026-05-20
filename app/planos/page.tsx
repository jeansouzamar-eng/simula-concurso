"use client";

import Link from "next/link";
import { Check, Crown, Lock, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { AppShell } from "../components/app-shell";

export default function PlansPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function subscribePremium() {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/payments/create-preference", {
      method: "POST",
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Nao foi possivel iniciar o pagamento.");
      return;
    }

    if (data.init_point) {
      window.location.href = data.init_point;
    }
  }

  return (
    <AppShell title="Planos" eyebrow="Assinatura Simula Concurso">
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-white">Gratis</h2>
              <p className="mt-2 text-slate-300">Para experimentar a plataforma.</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/10 text-slate-200">
              <Lock size={24} />
            </span>
          </div>
          <div className="mt-8 text-5xl font-black text-white">R$ 0</div>
          <ul className="mt-8 space-y-4 text-slate-200">
            {[
              "3 simulados por semana",
              "Acesso apenas a simulados gratis",
              "Historico resumido",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Check className="mt-0.5 text-emerald-300" size={18} /> {item}
              </li>
            ))}
          </ul>
          <Link
            href="/simulados"
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg border border-white/10 bg-white/8 font-bold text-white transition hover:bg-white/12"
          >
            Continuar Gratis
          </Link>
        </article>

        <article className="rounded-2xl border border-emerald-300/40 bg-[#071a2b] p-7 shadow-2xl shadow-emerald-950/30">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-3 py-1 text-sm font-black text-[#061421]">
            <Crown size={15} /> Mais completo
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-white">Premium</h2>
              <p className="mt-2 text-slate-300">Para estudar sem limite.</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-400 text-[#061421]">
              <Sparkles size={24} />
            </span>
          </div>
          <div className="mt-8 flex items-end gap-2">
            <span className="text-5xl font-black text-white">R$ 19,90</span>
            <span className="pb-1 text-slate-400">/mês</span>
          </div>
          <ul className="mt-8 space-y-4 text-slate-200">
            {[
              "Simulados ilimitados",
              "Acesso a simulados premium",
              "Estatisticas completas",
              "Historico completo",
              "Ranking",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Check className="mt-0.5 text-emerald-300" size={18} /> {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={subscribePremium}
            disabled={loading}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:opacity-70"
          >
            <Zap size={18} /> {loading ? "Preparando pagamento..." : "Assinar Premium"}
          </button>
          {message && (
            <p className="mt-4 rounded-lg border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
              {message}
            </p>
          )}
        </article>
      </div>
    </AppShell>
  );
}
