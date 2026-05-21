"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Check, FileQuestion, Pencil, Search, Trash2, X } from "lucide-react";

type Option = {
  id: string;
  nome: string;
};

type QuestionRow = {
  id: string;
  enunciado: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  alternativaCorreta: string;
  explicacao: string;
  dificuldade: string;
  materiaId: string;
  bancaId: string;
  materia: Option;
  banca: Option;
};

const emptyForm = {
  enunciado: "",
  alternativaA: "",
  alternativaB: "",
  alternativaC: "",
  alternativaD: "",
  alternativaCorreta: "",
  explicacao: "",
  materiaId: "",
  bancaId: "",
  dificuldade: "MEDIA",
};

export function AdminQuestionsManager({
  questions,
  materias,
  bancas,
}: {
  questions: QuestionRow[];
  materias: Option[];
  bancas: Option[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<QuestionRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredQuestions = questions.filter((question) =>
    [question.enunciado, question.materia.nome, question.banca.nome, question.dificuldade]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
  }

  function startEditing(question: QuestionRow) {
    setEditing(question);
    setForm({
      enunciado: question.enunciado,
      alternativaA: question.alternativaA,
      alternativaB: question.alternativaB,
      alternativaC: question.alternativaC,
      alternativaD: question.alternativaD,
      alternativaCorreta: question.alternativaCorreta,
      explicacao: question.explicacao,
      materiaId: question.materiaId,
      bancaId: question.bancaId,
      dificuldade: question.dificuldade,
    });
    setMessage("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const response = await fetch(editing ? `/api/questoes/${editing.id}` : "/api/questoes", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel cadastrar a questao.");
      return;
    }

    resetForm();
    setMessage(editing ? "Questao atualizada com sucesso." : "Questao cadastrada com sucesso.");
    router.refresh();
  }

  async function remove(question: QuestionRow) {
    const confirmed = window.confirm("Excluir esta questao?");
    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");
    const response = await fetch(`/api/questoes/${question.id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel excluir a questao. Verifique se ela esta vinculada a simulados.");
      return;
    }

    setMessage("Questao excluida com sucesso.");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[28rem_1fr]">
      <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">{editing ? "Editar questao" : "Cadastrar questao"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Preencha enunciado, alternativas, resposta correta e classificacoes.
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-400 text-[#061421]">
            <FileQuestion size={19} />
          </span>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-slate-200">Enunciado</span>
            <textarea
              value={form.enunciado}
              onChange={(event) => updateField("enunciado", event.target.value)}
              rows={4}
              placeholder="Digite o enunciado da questao"
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-[#061421]/55 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
            />
          </label>

          {[
            ["Alternativa A", "alternativaA"],
            ["Alternativa B", "alternativaB"],
            ["Alternativa C", "alternativaC"],
            ["Alternativa D", "alternativaD"],
          ].map(([label, name]) => (
            <label key={name} className="block">
              <span className="text-sm font-bold text-slate-200">{label}</span>
              <input
                value={form[name as keyof typeof form]}
                onChange={(event) => updateField(name, event.target.value)}
                placeholder={label}
                className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
              />
            </label>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Alternativa correta</span>
              <select value={form.alternativaCorreta} onChange={(event) => updateField("alternativaCorreta", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="" disabled>Selecione</option>
                {["A", "B", "C", "D"].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-200">Dificuldade</span>
              <select value={form.dificuldade} onChange={(event) => updateField("dificuldade", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="FACIL">Facil</option>
                <option value="MEDIA">Media</option>
                <option value="DIFICIL">Dificil</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Materia</span>
              <select value={form.materiaId} onChange={(event) => updateField("materiaId", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="" disabled>Selecione</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>{materia.nome}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-200">Banca</span>
              <select value={form.bancaId} onChange={(event) => updateField("bancaId", event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="" disabled>Selecione</option>
                {bancas.map((banca) => (
                  <option key={banca.id} value={banca.id}>{banca.nome}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-slate-200">Explicacao</span>
            <textarea
              value={form.explicacao}
              onChange={(event) => updateField("explicacao", event.target.value)}
              rows={4}
              placeholder="Explique a resposta correta"
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-[#061421]/55 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
            />
          </label>

          {message && <p className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}
          {error && <p className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] shadow-[0_16px_45px_rgba(37,211,142,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:opacity-70"
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
        <div>
          <h2 className="text-2xl font-black text-white">Questoes cadastradas</h2>
          <p className="mt-2 text-sm text-slate-300">Registros carregados do banco de dados.</p>
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
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <thead className="bg-[#061421]/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-black">Enunciado</th>
                <th className="px-4 py-3 font-black">Materia</th>
                <th className="px-4 py-3 font-black">Banca</th>
                <th className="px-4 py-3 font-black">Dificuldade</th>
                <th className="px-4 py-3 font-black">Correta</th>
                <th className="px-4 py-3 font-black">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question) => (
                <tr key={question.id} className="border-t border-white/10">
                  <td className="max-w-md px-4 py-4 text-slate-200">
                    <span className="line-clamp-2">{question.enunciado}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-200">{question.materia.nome}</td>
                  <td className="px-4 py-4 text-slate-200">{question.banca.nome}</td>
                  <td className="px-4 py-4 text-slate-200">{question.dificuldade}</td>
                  <td className="px-4 py-4 font-black text-emerald-300">{question.alternativaCorreta}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEditing(question)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-emerald-300 transition hover:bg-white/12" aria-label="Editar questao">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => remove(question)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-rose-300 transition hover:bg-white/12" aria-label="Excluir questao">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredQuestions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    Nenhuma questao encontrada.
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
