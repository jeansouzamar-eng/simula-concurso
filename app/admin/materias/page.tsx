import { AdminCrud } from "../../components/admin-crud";
import { AdminShell } from "../../components/admin-shell";
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
      <AdminCrud
        title="Cadastrar materia"
        description="Organize as disciplinas usadas em questoes e simulados."
        fields={[{ label: "Nome da materia", placeholder: "Ex: Direito Administrativo" }]}
        columns={[
          { key: "name", label: "Nome da materia" },
          { key: "questions", label: "Questoes vinculadas" },
        ]}
        rows={subjects.map((subject) => ({
          name: subject.nome,
          questions: subject._count.questoes,
        }))}
      />
    </AdminShell>
  );
}
