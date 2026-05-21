import { AdminShell } from "../../components/admin-shell";
import { AdminSimpleEntityManager } from "../../components/admin-simple-entity-manager";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSubjectsPage() {
  await requireAdmin();
  const subjects = await prisma.materia.findMany({
    include: { _count: { select: { questoes: true } } },
    orderBy: { nome: "asc" },
  });

  return (
    <AdminShell title="Materias" eyebrow="CRUD de materias">
      <AdminSimpleEntityManager
        title="Cadastrar materia"
        description="Organize as disciplinas usadas em questoes e simulados."
        endpoint="/api/materias"
        countLabel="Questoes vinculadas"
        entities={subjects.map((subject) => ({
          id: subject.id,
          nome: subject.nome,
          count: subject._count.questoes,
        }))}
      />
    </AdminShell>
  );
}
