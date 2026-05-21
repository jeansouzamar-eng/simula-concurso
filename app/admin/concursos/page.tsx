import { AdminShell } from "../../components/admin-shell";
import { AdminSimpleEntityManager } from "../../components/admin-simple-entity-manager";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminContestsPage() {
  await requireAdmin();
  const contests = await prisma.concurso.findMany({
    include: { _count: { select: { simulados: true } } },
    orderBy: { nome: "asc" },
  });

  return (
    <AdminShell title="Concursos" eyebrow="Categorias policiais">
      <AdminSimpleEntityManager
        title="Cadastrar concurso"
        description="Organize as categorias de concursos policiais usadas em simulados."
        endpoint="/api/concursos"
        countLabel="Simulados vinculados"
        entities={contests.map((contest) => ({
          id: contest.id,
          nome: contest.nome,
          count: contest._count.simulados,
        }))}
      />
    </AdminShell>
  );
}
