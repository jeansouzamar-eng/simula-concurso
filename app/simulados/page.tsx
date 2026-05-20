import Link from "next/link";
import { ArrowRight, Clock3, FileQuestion, Gauge, ListChecks } from "lucide-react";
import { AppShell } from "../components/app-shell";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../../lib/auth";
import { getWeeklySimulationCount, FREE_WEEKLY_SIMULATION_LIMIT } from "../../lib/plans";

export const dynamic = "force-dynamic";

export default async function SimuladosPage() {
  const user = await requireAuth();
  const [simulados, weeklyCount] = await Promise.all([
    prisma.simulado.findMany({
      include: {
        materia: true,
        banca: true,
        questoes: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    getWeeklySimulationCount(user.id),
  ]);
  const reachedFreeLimit = user.plano === "GRATIS" && weeklyCount >= FREE_WEEKLY_SIMULATION_LIMIT;

  return (
    <AppShell title="Selecionar Simulado" eyebrow="Simulados disponiveis">
      <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black text-white">Escolha sua prova</h2>
            <p className="mt-2 text-slate-300">
              Plano atual: {user.plano}. {user.plano === "GRATIS" ? `${weeklyCount}/${FREE_WEEKLY_SIMULATION_LIMIT} simulados usados nesta semana.` : "Simulados ilimitados liberados."}
            </p>
          </div>
          <span className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-4 font-bold text-emerald-200">
            <ListChecks size={18} /> {simulados.length} cadastrados
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {simulados.map((simulado) => {
            const blocked = user.plano === "GRATIS" && (simulado.isPremium || reachedFreeLimit);
            return (
            <article
              key={simulado.id}
              className="rounded-lg border border-white/10 bg-[#061421]/55 p-5 transition hover:-translate-y-0.5 hover:bg-[#061421]/70"
            >
              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-400/15 text-emerald-300">
                  <FileQuestion size={24} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-white">{simulado.titulo}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">
                    {simulado.descricao}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 font-bold text-slate-200">
                  <Clock3 size={15} /> {simulado.tempoLimite} min
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 font-bold text-slate-200">
                  <Gauge size={15} /> {simulado.nivel}
                </span>
                <span className="inline-flex rounded-full bg-white/8 px-3 py-1 font-bold text-slate-200">
                  {simulado.questoes.length || simulado.quantidadeQuestoes} questoes
                </span>
                <span className="inline-flex rounded-full bg-emerald-400/15 px-3 py-1 font-bold text-emerald-200">
                  {simulado.materia.nome}
                </span>
                {simulado.isPremium && (
                  <span className="inline-flex rounded-full bg-amber-300/15 px-3 py-1 font-bold text-amber-200">
                    Premium
                  </span>
                )}
                {simulado.banca && (
                  <span className="inline-flex rounded-full bg-emerald-400/15 px-3 py-1 font-bold text-emerald-200">
                    {simulado.banca.nome}
                  </span>
                )}
              </div>

              {blocked ? (
                <Link
                  href="/planos"
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-amber-300/30 bg-amber-300/10 font-black text-amber-100 transition hover:bg-amber-300/15"
                >
                  Assinar Premium <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  href={`/simulado/${simulado.id}`}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 font-black text-[#061421] transition hover:-translate-y-0.5 hover:bg-emerald-300"
                >
                  Iniciar Simulado <ArrowRight size={18} />
                </Link>
              )}
            </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
