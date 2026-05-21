"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { AuthCard } from "../components/auth-card";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel enviar o email.");
      return;
    }

    setMessage(data.message);
  }

  return (
    <AuthCard
      title="Recuperar senha"
      subtitle="Informe seu email cadastrado para receber um link de redefinicao."
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-bold text-slate-200">E-mail</span>
          <input
            name="email"
            type="email"
            placeholder="voce@email.com"
            className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-white/10 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
          />
        </label>

        {message && <p className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}
        {error && <p className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] shadow-[0_16px_45px_rgba(37,211,142,0.25)] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:opacity-70"
        >
          <Mail size={18} /> {loading ? "Enviando..." : "Enviar link"} <ArrowRight size={18} />
        </button>

        <p className="text-center text-sm text-slate-300">
          Lembrou a senha?{" "}
          <Link href="/login" className="font-bold text-emerald-300 hover:text-emerald-200">
            Entrar
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
