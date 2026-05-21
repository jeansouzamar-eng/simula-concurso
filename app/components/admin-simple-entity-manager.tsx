"use client";

import { useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";

type Entity = {
  id: string;
  nome: string;
  count: number;
};

export function AdminSimpleEntityManager({
  title,
  description,
  endpoint,
  countLabel,
  entities,
}: {
  title: string;
  description: string;
  endpoint: "/api/materias" | "/api/bancas";
  countLabel: string;
  entities: Entity[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Entity | null>(null);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return entities;
    }
    return entities.filter((entity) => entity.nome.toLowerCase().includes(term));
  }, [entities, search]);

  function resetForm() {
    setEditing(null);
    setName("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const response = await fetch(editing ? `${endpoint}/${editing.id}` : endpoint, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: name }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel salvar.");
      return;
    }

    setMessage(editing ? "Registro atualizado com sucesso." : "Registro cadastrado com sucesso.");
    resetForm();
    router.refresh();
  }

  async function remove(entity: Entity) {
    const confirmed = window.confirm(`Excluir "${entity.nome}"?`);
    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");
    const response = await fetch(`${endpoint}/${entity.id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel excluir. Verifique se existem vinculos.");
      return;
    }

    setMessage("Registro excluido com sucesso.");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
      <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div>
          <h2 className="text-2xl font-black text-white">{editing ? "Editar registro" : title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-slate-200">Nome</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Digite o nome"
              className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
            />
          </label>

          {message && <p className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}
          {error && <p className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] shadow-[0_16px_45px_rgba(37,211,142,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:opacity-70"
          >
            <Check size={18} /> {loading ? "Salvando..." : "Salvar"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 font-bold text-white transition hover:bg-white/12"
            >
              <X size={18} /> Cancelar
            </button>
          )}
        </form>
      </section>

      <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black text-white">Registros</h2>
            <p className="mt-2 text-sm text-slate-300">Crie, edite, busque e exclua registros reais.</p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-4 font-bold text-white transition hover:bg-white/12"
          >
            <Plus size={17} /> Novo
          </button>
        </div>

        <label className="mt-5 flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-slate-300">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar"
            className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
          />
        </label>

        <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead className="bg-[#061421]/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-black">Nome</th>
                <th className="px-4 py-3 font-black">{countLabel}</th>
                <th className="px-4 py-3 font-black">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entity) => (
                <tr key={entity.id} className="border-t border-white/10">
                  <td className="px-4 py-4 font-bold text-white">{entity.nome}</td>
                  <td className="px-4 py-4 text-slate-200">{entity.count}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(entity);
                          setName(entity.nome);
                          setError("");
                          setMessage("");
                        }}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-emerald-300 transition hover:bg-white/12"
                        aria-label={`Editar ${entity.nome}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(entity)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-rose-300 transition hover:bg-white/12"
                        aria-label={`Excluir ${entity.nome}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
