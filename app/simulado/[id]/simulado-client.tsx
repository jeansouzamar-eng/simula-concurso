"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Flag, ListChecks } from "lucide-react";
import { AppShell } from "../../components/app-shell";

type Question = {
  id: string;
  enunciado: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  dificuldade: string;
  materia: { nome: string };
  banca: { nome: string };
};

type Simulation = {
  id: string;
  titulo: string;
  tempoLimite: number;
  questoes: Array<{ ordem: number; questao: Question }>;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function SimuladoClient({ simuladoId }: { simuladoId: string }) {
  const router = useRouter();
  const [simulado, setSimulado] = useState<Simulation | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSimulation() {
      const response = await fetch(`/api/simulados/${simuladoId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Nao foi possivel carregar o simulado.");
        setLoading(false);
        return;
      }

      setSimulado(data.simulado);
      setSecondsLeft(Number(data.simulado.tempoLimite) * 60);
      setLoading(false);
    }

    loadSimulation();
  }, [simuladoId]);

  useEffect(() => {
    if (!simulado || secondsLeft <= 0 || finishing) {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [finishing, secondsLeft, simulado]);

  const questions = useMemo(() => simulado?.questoes.map((item) => item.questao) ?? [], [simulado]);
  const currentQuestion = questions[currentIndex];
  const progress = questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  async function finishSimulation() {
    if (!simulado || finishing) {
      return;
    }

    setFinishing(true);
    const response = await fetch("/api/resultados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        simuladoId: simulado.id,
        respostas: Object.entries(answers).map(([questaoId, alternativa]) => ({
          questaoId,
          alternativa,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Nao foi possivel finalizar o simulado.");
      setFinishing(false);
      return;
    }

    router.push(`/resultado/${data.resultado.id}`);
  }

  if (loading) {
    return (
      <AppShell title="Simulado em andamento" eyebrow="Carregando">
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-8 text-slate-300">
          Buscando questoes no banco...
        </div>
      </AppShell>
    );
  }

  if (error || !simulado || !currentQuestion) {
    return (
      <AppShell title="Simulado indisponivel" eyebrow="Erro">
        <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-8 text-rose-100">
          {error || "Nenhuma questao encontrada para este simulado."}
        </div>
      </AppShell>
    );
  }

  const alternatives = [
    ["A", currentQuestion.alternativaA],
    ["B", currentQuestion.alternativaB],
    ["C", currentQuestion.alternativaC],
    ["D", currentQuestion.alternativaD],
  ];

  return (
    <AppShell title={simulado.titulo} eyebrow="Simulado em andamento">
      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-bold text-emerald-200">
                <ListChecks size={15} /> Questao {currentIndex + 1} de {questions.length}
              </span>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                {currentQuestion.materia.nome} · {currentQuestion.banca.nome} · {currentQuestion.dificuldade}
              </p>
            </div>
            <div className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-[#061421]/60 px-4 font-black text-emerald-200">
              <Clock3 size={18} /> {formatTime(secondsLeft)}
            </div>
          </div>

          <div className="mt-6 h-3 rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-3 rounded-full bg-emerald-400"
            />
          </div>

          <h2 className="mt-8 text-2xl font-black leading-snug text-white sm:text-3xl">
            {currentQuestion.enunciado}
          </h2>

          <div className="mt-8 grid gap-4">
            {alternatives.map(([letter, text]) => {
              const selected = answers[currentQuestion.id] === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() =>
                    setAnswers((current) => ({
                      ...current,
                      [currentQuestion.id]: letter,
                    }))
                  }
                  className={`flex cursor-pointer gap-4 rounded-lg border p-5 text-left transition hover:-translate-y-0.5 ${
                    selected
                      ? "border-emerald-300 bg-emerald-300/12"
                      : "border-white/10 bg-[#061421]/45 hover:bg-[#061421]/65"
                  }`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 font-black text-emerald-200">
                    {letter}
                  </span>
                  <span className="leading-7 text-slate-200">{text}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                setMarkedForReview((current) => ({
                  ...current,
                  [currentQuestion.id]: !current[currentQuestion.id],
                }))
              }
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-lg border px-5 font-bold transition ${
                markedForReview[currentQuestion.id]
                  ? "border-amber-300/40 bg-amber-300/15 text-amber-100"
                  : "border-white/10 bg-white/8 text-white hover:bg-white/12"
              }`}
            >
              <Flag size={18} /> {markedForReview[currentQuestion.id] ? "Revisar depois" : "Marcar para revisar"}
            </button>
            <div className="flex flex-col gap-3 sm:flex-row">
              {currentIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((index) => index - 1)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-5 font-bold text-white transition hover:bg-white/12"
                >
                  <ArrowLeft size={18} /> Voltar
                </button>
              )}
              {currentIndex < questions.length - 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((index) => index + 1)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-5 font-bold text-white transition hover:bg-white/12"
                >
                  Proxima <ArrowRight size={18} />
                </button>
              )}
              <button
                type="button"
                onClick={finishSimulation}
                disabled={finishing}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-6 font-black text-[#061421] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:opacity-70"
              >
                <CheckCircle2 size={18} /> {finishing ? "Salvando..." : "Finalizar Simulado"}
              </button>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur">
          <h3 className="text-xl font-black">Progresso</h3>
          <p className="mt-2 text-slate-300">{progress}% concluido</p>
          <div className="mt-6 grid grid-cols-5 gap-2">
            {questions.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`grid aspect-square place-items-center rounded-md text-xs font-black ${
                  index === currentIndex
                    ? "bg-white text-[#061421]"
                    : markedForReview[item.id]
                      ? "bg-amber-300 text-[#061421]"
                    : answers[item.id]
                      ? "bg-emerald-400 text-[#061421]"
                      : "bg-white/10 text-slate-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
