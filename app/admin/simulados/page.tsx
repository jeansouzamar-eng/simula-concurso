import { AdminShell } from "../../components/admin-shell";
import { AdminSimulationsManager } from "../../components/admin-simulations-manager";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSimulationsPage() {
  await requireAdmin();
  const [simulations, materias, bancas, concursos, questions] = await Promise.all([
    prisma.simulado.findMany({
      include: { materia: true, banca: true, concursos: { include: { concurso: true } }, questoes: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.materia.findMany({ orderBy: { nome: "asc" } }),
    prisma.banca.findMany({ orderBy: { nome: "asc" } }),
    prisma.concurso.findMany({ orderBy: { nome: "asc" } }),
    prisma.questao.findMany({
      include: { materia: true, banca: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AdminShell title="Simulados" eyebrow="CRUD de simulados">
      <AdminSimulationsManager
        simulations={simulations}
        materias={materias}
        bancas={bancas}
        concursos={concursos}
        questions={questions}
      />
    </AdminShell>
  );
}
