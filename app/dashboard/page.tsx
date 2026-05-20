import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Flame,
  Trophy,
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../../lib/auth";
import { FREE_WEEKLY_SIMULATION_LIMIT, getWeeklySimulationCount } from "../../lib/plans";

export const dynamic = "force-dynamic";

const statIcons = [CalendarDays, BarChart3, Trophy];

export default async function DashboardPage() {
  const user = await requireAuth();
  const [resultados, simulados, weeklyCount] = await Promise.all([
    prisma.resultado.findMany({
      where: { userId: user.id },
      include: {
        simulado: {
          include: {
            materia: true,
            banca: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.simulado.findMany({
      include: {
        materia: true,
        banca: true,
        questoes: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    getWeeklySimulationCount(user.id),
  ]);

  const totalRealizados = await prisma.resultado.count({ where: { userId: user.id } });
  const aggregate = await prisma.resultado.aggregate({
    where: { userId: user.id },
    _avg: { percentual: true },
    _max: { percentual: true },
  });

  const mediaGeral = aggregate._avg.percentual ?? 0;
  const melhorNota = aggregate._max.percentual ?? 0;
  const stats = [
    {
      label: "Simulados realizados",
      value: String(totalRealizados),
      helper: "Historico salvo no banco",
    },
    {
      label: "Media geral",
      value: `${mediaGeral.toFixed(1)}%`,
      helper: "Media de todos os resultados",
    },
    {
      label: "Melhor nota",
      value: `${melhorNota.toFixed(1)}%`,
      helper: "Maior percentual atingido",
    },
  ];

  return (
    <AppShell title="Dashboard do Aluno" eyebrow={`Area do aluno · ${user.nome}`} userName={user.nome}>
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = statIcons[index];
          return (
            <article key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-300">{stat.label}</span>
                <Icon className="text-emerald-300" size={22} />
              </div>
              <strong className="mt-4 block text-4xl font-black text-white">{stat.value}</strong>
              <p className="mt-2 text-sm text-emerald-200">{stat.helper}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black text-white">Simulados disponiveis</h2>
              <p className="mt-2 text-slate-300">
                Plano {user.plano}. {user.plano === "GRATIS" ? `${weeklyCount}/${FREE_WEEKLY_SIMULATION_LIMIT} simulados usados nesta semana.` : "Acesso ilimitado e premium liberado."}
              </p>
            </div>
            <Link href="/simulados" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 font-black text-[#061421] transition hover:-translate-y-0.5 hover:bg-emerald-300">
              Ver todos <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {simulados.map((simulado) => (
              <article key={simulado.id} className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#061421]/45 p-5 transition hover:-translate-y-0.5 hover:bg-[#061421]/65 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-black text-white">{simulado.titulo}</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {simulado.banca?.nome ?? "Banca mista"} · {simulado.questoes.length || simulado.quantidadeQuestoes} questoes · {simulado.tempoLimite} min · {simulado.nivel}
                  </p>
                  <p className="mt-1 text-sm text-emerald-200">
                    {simulado.materia.nome} {simulado.isPremium ? "· Premium" : "· Gratis"}
                  </p>
                </div>
                <Link href={user.plano === "GRATIS" && simulado.isPremium ? "/planos" : `/simulado/${simulado.id}`} className="inline-flex items-center gap-2 font-bold text-emerald-300 hover:text-emerald-200">
                  {user.plano === "GRATIS" && simulado.isPremium ? "Assinar" : "Iniciar"} <ChevronRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <aside className="grid gap-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur">
            <div className="flex items-center gap-3">
              <Flame className="text-emerald-300" />
              <h2 className="text-xl font-black">Historico do aluno</h2>
            </div>
            <div className="mt-5 space-y-4">
              {resultados.length === 0 && (
                <p className="rounded-lg border border-white/10 bg-[#061421]/55 p-4 text-sm leading-6 text-slate-300">
                  Nenhum simulado realizado ainda. Comece pelo simulado inicial.
                </p>
              )}
              {resultados.map((resultado) => (
                <Link
                  key={resultado.id}
                  href={`/resultado/${resultado.id}`}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-[#061421]/55 p-4 transition hover:bg-[#061421]/70"
                >
                  <CheckCircle2 className="mt-0.5 text-emerald-300" size={18} />
                  <div>
                    <p className="font-bold text-white">{resultado.simulado.titulo}</p>
                    <p className="text-sm text-slate-400">
                      {resultado.acertos} acertos · {resultado.erros} erros · {resultado.percentual.toFixed(1)}%
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur">
            <h2 className="text-xl font-black">Resumo rapido</h2>
            <div className="mt-5 grid gap-3">
              <div className="rounded-lg bg-[#061421]/55 p-4">
                <span className="text-sm font-bold text-slate-400">Quantidade realizada</span>
                <p className="mt-1 text-2xl font-black text-white">{totalRealizados}</p>
              </div>
              <div className="rounded-lg bg-[#061421]/55 p-4">
                <span className="text-sm font-bold text-slate-400">Melhor nota</span>
                <p className="mt-1 text-2xl font-black text-emerald-300">{melhorNota.toFixed(1)}%</p>
              </div>
              <div className="rounded-lg bg-[#061421]/55 p-4">
                <span className="text-sm font-bold text-slate-400">Media geral</span>
                <p className="mt-1 text-2xl font-black text-emerald-300">{mediaGeral.toFixed(1)}%</p>
              </div>
            </div>
          </section>

          {user.plano === "GRATIS" ? (
            <section className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-6 shadow-xl backdrop-blur">
              <h2 className="text-xl font-black text-white">Estatisticas avancadas</h2>
              <p className="mt-3 text-sm leading-6 text-amber-100">
                Ranking, historico completo e analises por materia estao disponiveis no plano Premium.
              </p>
              <Link href="/planos" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-emerald-400 font-black text-[#061421]">
                Assinar Premium
              </Link>
            </section>
          ) : (
            <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur">
              <h2 className="text-xl font-black">Ranking Premium</h2>
              <p className="mt-3 text-3xl font-black text-emerald-300">Top 8%</p>
              <p className="mt-2 text-sm text-slate-300">Ranking demonstrativo para assinantes Premium.</p>
            </section>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
