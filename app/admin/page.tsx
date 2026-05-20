import { Activity, Crown, FileQuestion, Gauge, TrendingUp, Users } from "lucide-react";
import { AdminShell } from "../components/admin-shell";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/auth";

export const dynamic = "force-dynamic";

const statIcons = [Users, Gauge, FileQuestion, Crown];

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [totalUsers, totalSimulados, totalQuestoes, totalPremium, latestSimulado, latestQuestao, latestUser] =
    await Promise.all([
      prisma.user.count(),
      prisma.simulado.count(),
      prisma.questao.count(),
      prisma.user.count({ where: { plano: "PREMIUM" } }),
      prisma.simulado.findFirst({ orderBy: { createdAt: "desc" }, include: { questoes: true } }),
      prisma.questao.findFirst({ orderBy: { createdAt: "desc" }, include: { materia: true, banca: true } }),
      prisma.user.findFirst({ orderBy: { createdAt: "desc" } }),
    ]);

  const stats = [
    { label: "Total de usuarios", value: totalUsers, helper: "Base cadastrada" },
    { label: "Total de simulados", value: totalSimulados, helper: "Publicados no banco" },
    { label: "Total de questoes", value: totalQuestoes, helper: "Questões cadastradas" },
    { label: "Alunos premium", value: totalPremium, helper: "Assinantes ativos" },
  ];

  const premiumPercent = totalUsers ? Math.round((totalPremium / totalUsers) * 100) : 0;

  return (
    <AdminShell title="Dashboard Admin" eyebrow="Painel administrativo">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = statIcons[index];
          return (
            <article key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-300">{stat.label}</span>
                <Icon className="text-emerald-300" size={22} />
              </div>
              <strong className="mt-4 block text-4xl font-black text-white">{stat.value.toLocaleString("pt-BR")}</strong>
              <p className="mt-2 text-sm text-emerald-200">{stat.helper}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-3">
            <Activity className="text-emerald-300" />
            <h2 className="text-2xl font-black text-white">Operação da plataforma</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Questões cadastradas", totalQuestoes, Math.min(totalQuestoes * 5, 100)],
              ["Simulados publicados", totalSimulados, Math.min(totalSimulados * 20, 100)],
              ["Premium na base", `${premiumPercent}%`, premiumPercent],
            ].map(([label, value, percent]) => (
              <article key={String(label)} className="rounded-lg border border-white/10 bg-[#061421]/55 p-5">
                <p className="text-sm font-bold text-slate-300">{label}</p>
                <strong className="mt-3 block text-3xl font-black text-white">{value}</strong>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${percent}%` }} />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-white/10 bg-[#061421]/55 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-white">Saúde comercial</h3>
                <p className="mt-1 text-sm text-slate-400">Proporção atual de usuários Premium.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-bold text-emerald-200">
                <TrendingUp size={15} /> {premiumPercent}%
              </span>
            </div>
            <div className="mt-6 h-3 rounded-full bg-white/10">
              <div className="h-3 rounded-full bg-emerald-400" style={{ width: `${premiumPercent}%` }} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
          <h2 className="text-2xl font-black text-white">Resumo rápido</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-white/10 bg-[#061421]/55 p-5">
              <p className="text-sm font-bold text-slate-300">Último simulado criado</p>
              <strong className="mt-2 block text-white">{latestSimulado?.titulo ?? "Nenhum simulado"}</strong>
              <p className="mt-1 text-sm text-slate-400">{latestSimulado?.questoes.length ?? 0} questões</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#061421]/55 p-5">
              <p className="text-sm font-bold text-slate-300">Questão mais recente</p>
              <strong className="mt-2 block text-white">{latestQuestao?.materia.nome ?? "Nenhuma questão"}</strong>
              <p className="mt-1 text-sm text-slate-400">{latestQuestao?.banca.nome ?? "-"} · {latestQuestao?.dificuldade ?? "-"}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#061421]/55 p-5">
              <p className="text-sm font-bold text-slate-300">Usuário mais recente</p>
              <strong className="mt-2 block text-white">{latestUser?.nome ?? "Nenhum usuário"}</strong>
              <p className="mt-1 text-sm text-slate-400">{latestUser?.plano ?? "-"} · {latestUser?.tipo ?? "-"}</p>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
