 "use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthCard } from "../components/auth-card";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        senha: formData.get("senha"),
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel entrar.");
      return;
    }

    router.push(data.user.tipo === "ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <AuthCard
      title="Entre na sua conta"
      subtitle="Acesse seus simulados, ranking e relatórios de desempenho."
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-bold text-slate-200">E-mail</span>
          <input name="email" type="email" placeholder="voce@email.com" className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-white/10 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-200">Senha</span>
          <input name="senha" type="password" placeholder="Digite sua senha" className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-white/10 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" />
        </label>

        <div className="flex items-center justify-between gap-3 text-sm">
          <Link href="/cadastro" className="font-bold text-emerald-300 hover:text-emerald-200">
            Criar Conta
          </Link>
          <a href="#" className="text-slate-300 hover:text-white">
            Esqueci minha senha
          </a>
        </div>

        {error && <p className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] shadow-[0_16px_45px_rgba(37,211,142,0.25)] transition hover:-translate-y-0.5 hover:bg-emerald-300"
        >
          <LockKeyhole size={18} /> {loading ? "Entrando..." : "Entrar"} <ArrowRight size={18} />
        </button>
      </form>
    </AuthCard>
  );
}
