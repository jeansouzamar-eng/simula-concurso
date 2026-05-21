"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FileQuestion, Plus } from "lucide-react";

type Option = {
  id: string;
  nome: string;
};

type QuestionRow = {
  id: string;
  enunciado: string;
  alternativaCorreta: string;
  dificuldade: string;
  materia: Option;
  banca: Option;
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      enunciado: formData.get("enunciado"),
      alternativaA: formData.get("alternativaA"),
      alternativaB: formData.get("alternativaB"),
      alternativaC: formData.get("alternativaC"),
      alternativaD: formData.get("alternativaD"),
      alternativaCorreta: formData.get("alternativaCorreta"),
      explicacao: formData.get("explicacao"),
      materiaId: formData.get("materiaId"),
      bancaId: formData.get("bancaId"),
      dificuldade: formData.get("dificuldade"),
    };

    const response = await fetch("/api/questoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel cadastrar a questao.");
      return;
    }

    form.reset();
    setMessage("Questao cadastrada com sucesso.");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[28rem_1fr]">
      <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">Cadastrar questao</h2>
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
              name="enunciado"
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
                name={name}
                placeholder={label}
                className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15"
              />
            </label>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Alternativa correta</span>
              <select name="alternativaCorreta" defaultValue="" className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="" disabled>Selecione</option>
                {["A", "B", "C", "D"].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-200">Dificuldade</span>
              <select name="dificuldade" defaultValue="MEDIA" className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="FACIL">Facil</option>
                <option value="MEDIA">Media</option>
                <option value="DIFICIL">Dificil</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Materia</span>
              <select name="materiaId" defaultValue="" className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
                <option value="" disabled>Selecione</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>{materia.nome}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-200">Banca</span>
              <select name="bancaId" defaultValue="" className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#061421]/55 px-4 text-white outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-300/15">
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
              name="explicacao"
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
            <Plus size={18} /> {loading ? "Salvando..." : "Salvar cadastro"}
          </button>
        </form>
      </section>

      <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div>
          <h2 className="text-2xl font-black text-white">Questoes cadastradas</h2>
          <p className="mt-2 text-sm text-slate-300">Registros carregados do banco de dados.</p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <thead className="bg-[#061421]/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-black">Enunciado</th>
                <th className="px-4 py-3 font-black">Materia</th>
                <th className="px-4 py-3 font-black">Banca</th>
                <th className="px-4 py-3 font-black">Dificuldade</th>
                <th className="px-4 py-3 font-black">Correta</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id} className="border-t border-white/10">
                  <td className="max-w-md px-4 py-4 text-slate-200">
                    <span className="line-clamp-2">{question.enunciado}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-200">{question.materia.nome}</td>
                  <td className="px-4 py-4 text-slate-200">{question.banca.nome}</td>
                  <td className="px-4 py-4 text-slate-200">{question.dificuldade}</td>
                  <td className="px-4 py-4 font-black text-emerald-300">{question.alternativaCorreta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
