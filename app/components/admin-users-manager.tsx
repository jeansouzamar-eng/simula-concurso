"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Check, Pencil, X } from "lucide-react";

type AdminUser = {
  id: string;
  nome: string;
  email: string;
  plano: "GRATIS" | "PREMIUM";
  tipo: "ALUNO" | "ADMIN";
};

export function AdminUsersManager({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [plan, setPlan] = useState<"GRATIS" | "PREMIUM">("GRATIS");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function startEditing(user: AdminUser) {
    setEditingUser(user);
    setPlan(user.plano);
    setMessage("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingUser) {
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const response = await fetch(`/api/usuarios/${editingUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plano: plan }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel atualizar o plano.");
      return;
    }

    setMessage("Plano atualizado com sucesso.");
    setEditingUser(null);
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
      <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div>
          <h2 className="text-2xl font-black text-white">Editar plano</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Selecione um aluno na lista e altere o plano para Gratis ou Premium.
          </p>
        </div>

        {editingUser ? (
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="rounded-lg border border-white/10 bg-[#061421]/55 p-4">
              <p className="font-black text-white">{editingUser.nome}</p>
              <p className="mt-1 text-sm text-slate-400">{editingUser.email}</p>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-slate-200">Plano</span>
              <select
                value={plan}
                onChange={(event) => setPlan(event.target.value as "GRATIS" | "PREMIUM")}
                className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
              >
                <option value="GRATIS">Gratis</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </label>

            {error && <p className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] shadow-[0_16px_45px_rgba(37,211,142,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:opacity-70"
              >
                <Check size={18} /> {loading ? "Salvando..." : "Salvar plano"}
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 font-bold text-white transition hover:bg-white/12"
              >
                <X size={18} /> Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 rounded-lg border border-white/10 bg-[#061421]/55 p-5 text-sm leading-6 text-slate-300">
            Clique no icone de editar ao lado de um usuario para liberar ou remover o Premium.
          </div>
        )}

        {message && <p className="mt-4 rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}
      </section>

      <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div>
          <h2 className="text-2xl font-black text-white">Usuarios</h2>
          <p className="mt-2 text-sm text-slate-300">Altere o plano de alunos cadastrados.</p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead className="bg-[#061421]/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-black">Nome</th>
                <th className="px-4 py-3 font-black">E-mail</th>
                <th className="px-4 py-3 font-black">Plano</th>
                <th className="px-4 py-3 font-black">Tipo</th>
                <th className="px-4 py-3 font-black">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-white/10">
                  <td className="px-4 py-4 font-bold text-white">{user.nome}</td>
                  <td className="px-4 py-4 text-slate-200">{user.email}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${user.plano === "PREMIUM" ? "bg-emerald-400 text-[#061421]" : "bg-white/10 text-slate-200"}`}>
                      {user.plano}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-200">{user.tipo}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => startEditing(user)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-emerald-300 transition hover:bg-white/12"
                      aria-label={`Editar plano de ${user.nome}`}
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
