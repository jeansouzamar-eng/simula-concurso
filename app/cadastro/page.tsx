 "use client";

import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthCard } from "../components/auth-card";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const senha = String(formData.get("senha") ?? "");
    const confirmarSenha = String(formData.get("confirmarSenha") ?? "");

    if (senha !== confirmarSenha) {
      setError("As senhas nao conferem.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: formData.get("nome"),
        email: formData.get("email"),
        senha,
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel criar a conta.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <AuthCard
      title="Crie sua conta"
      subtitle="Comece com dados fictícios por enquanto e explore a experiência interna."
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {[
          ["Nome", "nome", "text", "Seu nome"],
          ["E-mail", "email", "email", "voce@email.com"],
          ["Senha", "senha", "password", "Crie uma senha"],
          ["Confirmar senha", "confirmarSenha", "password", "Repita a senha"],
        ].map(([label, name, type, placeholder]) => (
          <label key={name} className="block">
            <span className="text-sm font-bold text-slate-200">{label}</span>
            <input name={name} type={type} placeholder={placeholder} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-white/10 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" />
          </label>
        ))}

        {error && <p className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] shadow-[0_16px_45px_rgba(37,211,142,0.25)] transition hover:-translate-y-0.5 hover:bg-emerald-300"
        >
          <UserPlus size={18} /> {loading ? "Criando..." : "Criar Conta"} <ArrowRight size={18} />
        </button>

        <p className="text-center text-sm text-slate-300">
          Já tem cadastro?{" "}
          <Link href="/login" className="font-bold text-emerald-300 hover:text-emerald-200">
            Entrar
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
