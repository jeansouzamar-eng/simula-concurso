import { AdminShell } from "../../components/admin-shell";
import { AdminQuestionsManager } from "../../components/admin-questions-manager";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  await requireAdmin();
  const [questions, materias, bancas] = await Promise.all([
    prisma.questao.findMany({
      include: { materia: true, banca: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.materia.findMany({ orderBy: { nome: "asc" } }),
    prisma.banca.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <AdminShell title="Questoes" eyebrow="CRUD de questoes">
      <AdminQuestionsManager questions={questions} materias={materias} bancas={bancas} />
    </AdminShell>
  );
}
