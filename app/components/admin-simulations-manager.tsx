"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";

type Option = { id: string; nome: string };
type QuestionOption = { id: string; enunciado: string; materia: Option; banca: Option };
type Simulation = {
  id: string;
  titulo: string;
  descricao: string;
  tempoLimite: number;
  nivel: "FACIL" | "INTERMEDIARIO" | "AVANCADO";
  quantidadeQuestoes: number;
  isPremium: boolean;
  materiaId: string;
  bancaId: string | null;
  materia: Option;
  banca: Option | null;
  concursos: Array<{ concursoId: string; concurso: Option }>;
  questoes: Array<{ questaoId: string }>;
};

const emptyForm = {
  titulo: "",
  descricao: "",
  tempoLimite: "30",
  nivel: "INTERMEDIARIO",
  quantidadeQuestoes: "5",
  isPremium: "false",
  materiaId: "",
  bancaId: "",
};

export function AdminSimulationsManager({
  simulations,
  materias,
  bancas,
  concursos,
  questions,
}: {
  simulations: Simulation[];
  materias: Option[];
  bancas: Option[];
  concursos: Option[];
  questions: QuestionOption[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Simulation | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedContests, setSelectedContests] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return simulations;
    }
    return simulations.filter((simulation) =>
      [
        simulation.titulo,
        simulation.materia.nome,
        simulation.banca?.nome ?? "",
        ...simulation.concursos.map((item) => item.concurso.nome),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [search, simulations]);

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setSelectedContests([]);
    setSelectedQuestions([]);
    setError("");
  }

  function startEditing(simulation: Simulation) {
    setEditing(simulation);
    setForm({
      titulo: simulation.titulo,
      descricao: simulation.descricao,
      tempoLimite: String(simulation.tempoLimite),
      nivel: simulation.nivel,
      quantidadeQuestoes: String(simulation.quantidadeQuestoes),
      isPremium: String(simulation.isPremium),
      materiaId: simulation.materiaId,
      bancaId: simulation.bancaId ?? "",
    });
    setSelectedContests(simulation.concursos.map((item) => item.concursoId));
    setSelectedQuestions(simulation.questoes.map((item) => item.questaoId));
    setMessage("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const payload = {
      ...form,
      tempoLimite: Number(form.tempoLimite),
      quantidadeQuestoes: Number(form.quantidadeQuestoes),
      isPremium: form.isPremium === "true",
      bancaId: form.bancaId || null,
      concursoIds: selectedContests,
      questaoIds: selectedQuestions,
    };

    const response = await fetch(editing ? `/api/simulados/${editing.id}` : "/api/simulados", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel salvar o simulado.");
      return;
    }

    setMessage(editing ? "Simulado atualizado com sucesso." : "Simulado cadastrado com sucesso.");
    resetForm();
    router.refresh();
  }

  async function remove(simulation: Simulation) {
    const confirmed = window.confirm(`Excluir "${simulation.titulo}"?`);
    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");
    const response = await fetch(`/api/simulados/${simulation.id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel excluir o simulado.");
      return;
    }

    setMessage("Simulado excluido com sucesso.");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[28rem_1fr]">
      <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div>
          <h2 className="text-2xl font-black text-white">{editing ? "Editar simulado" : "Cadastrar simulado"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Monte simulados com concurso policial, tempo, nivel, materia, banca e questoes vinculadas.
          </p>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-slate-200">Titulo</span>
            <input value={form.titulo} onChange={(event) => updateField("titulo", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-200">Descricao</span>
            <textarea value={form.descricao} onChange={(event) => updateField("descricao", event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-[#061421]/55 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Tempo limite</span>
              <input type="number" min="1" value={form.tempoLimite} onChange={(event) => updateField("tempoLimite", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Quantidade</span>
              <input type="number" min="1" value={form.quantidadeQuestoes} onChange={(event) => updateField("quantidadeQuestoes", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Nivel</span>
              <select value={form.nivel} onChange={(event) => updateField("nivel", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="FACIL">Facil</option>
                <option value="INTERMEDIARIO">Intermediario</option>
                <option value="AVANCADO">Avancado</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Premium</span>
              <select value={form.isPremium} onChange={(event) => updateField("isPremium", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="false">Gratis</option>
                <option value="true">Premium</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Concurso</span>
              <div className="mt-2 grid max-h-44 gap-2 overflow-y-auto rounded-lg border border-white/10 bg-[#061421]/35 p-3">
                {concursos.map((concurso) => (
                  <label key={concurso.id} className="flex items-center gap-3 rounded-md bg-white/8 px-3 py-2 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={selectedContests.includes(concurso.id)}
                      onChange={(event) => {
                        setSelectedContests((current) =>
                          event.target.checked
                            ? [...current, concurso.id]
                            : current.filter((id) => id !== concurso.id),
                        );
                      }}
                    />
                    {concurso.nome}
                  </label>
                ))}
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Materia</span>
              <select value={form.materiaId} onChange={(event) => updateField("materiaId", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="">Selecione</option>
                {materias.map((materia) => <option key={materia.id} value={materia.id}>{materia.nome}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Banca</span>
              <select value={form.bancaId} onChange={(event) => updateField("bancaId", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="">Sem banca</option>
                {bancas.map((banca) => <option key={banca.id} value={banca.id}>{banca.nome}</option>)}
              </select>
            </label>
          </div>

          <fieldset className="rounded-lg border border-white/10 bg-[#061421]/35 p-4">
            <legend className="px-2 text-sm font-bold text-slate-200">Questoes</legend>
            <div className="mt-2 grid max-h-56 gap-2 overflow-y-auto pr-1">
              {questions.map((question) => (
                <label key={question.id} className="flex gap-3 rounded-lg bg-white/8 p-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question.id)}
                    onChange={(event) => {
                      setSelectedQuestions((current) =>
                        event.target.checked
                          ? [...current, question.id]
                          : current.filter((id) => id !== question.id),
                      );
                    }}
                    className="mt-1"
                  />
                  <span className="line-clamp-2">{question.enunciado}</span>
                </label>
              ))}
              {questions.length === 0 && <p className="text-sm text-slate-400">Cadastre questoes antes de montar simulados.</p>}
            </div>
          </fieldset>

          {message && <p className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}
          {error && <p className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

          <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] shadow-[0_16px_45px_rgba(37,211,142,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:opacity-70">
            <Check size={18} /> {loading ? "Salvando..." : "Salvar"}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 font-bold text-white transition hover:bg-white/12">
              <X size={18} /> Cancelar
            </button>
          )}
        </form>
      </section>

      <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black text-white">Simulados</h2>
            <p className="mt-2 text-sm text-slate-300">Crie, edite, busque e exclua simulados reais.</p>
          </div>
          <button type="button" onClick={resetForm} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-4 font-bold text-white transition hover:bg-white/12">
            <Plus size={17} /> Novo
          </button>
        </div>

        <label className="mt-5 flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-slate-300">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar" className="w-full bg-transparent text-white outline-none placeholder:text-slate-500" />
        </label>

        <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
            <thead className="bg-[#061421]/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-black">Titulo</th>
                <th className="px-4 py-3 font-black">Tempo</th>
                <th className="px-4 py-3 font-black">Nivel</th>
                <th className="px-4 py-3 font-black">Concurso</th>
                <th className="px-4 py-3 font-black">Materia</th>
                <th className="px-4 py-3 font-black">Questoes</th>
                <th className="px-4 py-3 font-black">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((simulation) => (
                <tr key={simulation.id} className="border-t border-white/10">
                  <td className="px-4 py-4 font-bold text-white">{simulation.titulo}</td>
                  <td className="px-4 py-4 text-slate-200">{simulation.tempoLimite} min</td>
                  <td className="px-4 py-4 text-slate-200">{simulation.nivel}</td>
                  <td className="px-4 py-4 text-slate-200">
                    {simulation.concursos.map((item) => item.concurso.nome).join(", ") || "-"}
                  </td>
                  <td className="px-4 py-4 text-slate-200">{simulation.materia.nome}</td>
                  <td className="px-4 py-4 text-slate-200">{simulation.questoes.length || simulation.quantidadeQuestoes}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEditing(simulation)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-emerald-300 transition hover:bg-white/12" aria-label={`Editar ${simulation.titulo}`}>
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => remove(simulation)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-rose-300 transition hover:bg-white/12" aria-label={`Excluir ${simulation.titulo}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">Nenhum simulado encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
