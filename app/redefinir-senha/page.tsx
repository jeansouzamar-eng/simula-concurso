"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthCard } from "../components/auth-card";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const senha = String(formData.get("senha") ?? "");
    const confirmarSenha = String(formData.get("confirmarSenha") ?? "");

    if (senha !== confirmarSenha) {
      setError("As senhas nao conferem.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, senha }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel redefinir a senha.");
      return;
    }

    setMessage(data.message);
  }

  return (
    <AuthCard
      title="Criar nova senha"
      subtitle="Defina uma nova senha para voltar a acessar seus simulados."
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-bold text-slate-200">Nova senha</span>
          <input
            name="senha"
            type="password"
            placeholder="Digite a nova senha"
            className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-white/10 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-200">Confirmar senha</span>
          <input
            name="confirmarSenha"
            type="password"
            placeholder="Repita a nova senha"
            className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-white/10 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
          />
        </label>

        {message && <p className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}
        {error && <p className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

        <button
          type="submit"
          disabled={loading || !token || Boolean(message)}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] shadow-[0_16px_45px_rgba(37,211,142,0.25)] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:opacity-70"
        >
          <LockKeyhole size={18} /> {loading ? "Salvando..." : "Atualizar senha"} <ArrowRight size={18} />
        </button>

        <p className="text-center text-sm text-slate-300">
          <Link href="/login" className="font-bold text-emerald-300 hover:text-emerald-200">
            Voltar para login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
