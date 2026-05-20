import Link from "next/link";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { AppShell } from "../../components/app-shell";
import { prisma } from "../../../lib/prisma";
import { requireAuth } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  const { id } = await params;
  const resultado = await prisma.resultado.findFirst({
    where: {
      id,
      ...(user.tipo === "ADMIN" ? {} : { userId: user.id }),
    },
    include: {
      simulado: {
        include: {
          materia: true,
          banca: true,
        },
      },
      respostas: {
        include: {
          questao: {
            include: {
              materia: true,
              banca: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!resultado) {
    return (
      <AppShell title="Resultado indisponivel" eyebrow="Relatorio final">
        <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-8 text-rose-100">
          Resultado nao encontrado ou sem permissao de acesso.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Resultado do Simulado" eyebrow={resultado.simulado.titulo}>
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <article className="rounded-lg bg-emerald-400 p-5 text-[#061421]">
              <p className="text-sm font-bold">Total de acertos</p>
              <strong className="mt-2 block text-4xl font-black">{resultado.acertos}</strong>
            </article>
            <article className="rounded-lg border border-white/10 bg-[#061421]/55 p-5">
              <p className="text-sm font-bold text-slate-300">Total de erros</p>
              <strong className="mt-2 block text-4xl font-black text-white">{resultado.erros}</strong>
            </article>
            <article className="rounded-lg border border-white/10 bg-[#061421]/55 p-5">
              <p className="text-sm font-bold text-slate-300">Percentual de desempenho</p>
              <strong className="mt-2 block text-4xl font-black text-emerald-300">
                {resultado.percentual.toFixed(1)}%
              </strong>
            </article>
          </div>

          <div className="mt-8 rounded-lg border border-white/10 bg-[#061421]/55 p-5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Desempenho final</span>
              <span className="font-black text-emerald-300">{resultado.percentual.toFixed(1)}%</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-emerald-400"
                style={{ width: `${Math.min(resultado.percentual, 100)}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Resultado salvo no banco com respostas marcadas, questoes respondidas e status de acerto.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href={`/simulado/${resultado.simuladoId}`}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] transition hover:-translate-y-0.5 hover:bg-emerald-300"
            >
              <RotateCcw size={18} /> Refazer Simulado
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 font-bold text-white transition hover:bg-white/12"
            >
              Voltar ao Dashboard <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
          <div>
            <h2 className="text-2xl font-black text-white">Gabarito comentado</h2>
            <p className="mt-2 text-slate-300">
              Confira alternativa correta, resposta marcada e explicacao de cada questao.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {resultado.respostas.map((resposta, index) => {
              const isCorrect = resposta.correta;
              return (
                <article key={resposta.id} className="rounded-lg border border-white/10 bg-[#061421]/55 p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                        Questao {index + 1} · {resposta.questao.materia.nome}
                      </p>
                      <h3 className="mt-3 text-lg font-black leading-7 text-white">
                        {resposta.questao.enunciado}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        isCorrect ? "bg-emerald-400 text-[#061421]" : "bg-rose-400 text-white"
                      }`}
                    >
                      {isCorrect ? <Check size={18} /> : <X size={18} />}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-lg bg-white/8 p-3">
                      <span className="font-bold text-slate-400">Marcada</span>
                      <p className="mt-1 font-black text-white">
                        {resposta.alternativa === "N" ? "Nao respondida" : resposta.alternativa}
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-400/12 p-3">
                      <span className="font-bold text-emerald-200">Correta</span>
                      <p className="mt-1 font-black text-white">
                        {resposta.questao.alternativaCorreta}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 rounded-lg border border-white/10 bg-white/8 p-4 text-sm leading-6 text-slate-300">
                    {resposta.questao.explicacao}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
