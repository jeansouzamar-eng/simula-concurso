import { AdminCrud } from "../../components/admin-crud";
import { AdminShell } from "../../components/admin-shell";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  await requireAdmin();
  const questions = await prisma.questao.findMany({
    include: { materia: true, banca: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell title="Questoes" eyebrow="CRUD de questoes">
      <AdminCrud
        title="Cadastrar questao"
        description="Preencha enunciado, alternativas, resposta correta e classificacoes."
        fields={[
          { label: "Enunciado", type: "textarea", placeholder: "Digite o enunciado da questao" },
          { label: "Alternativa A" },
          { label: "Alternativa B" },
          { label: "Alternativa C" },
          { label: "Alternativa D" },
          { label: "Alternativa correta", type: "select", options: ["A", "B", "C", "D"] },
          { label: "Explicacao", type: "textarea", placeholder: "Explique a resposta correta" },
          { label: "Materia", type: "select", options: ["Portugues", "Direito Administrativo", "Raciocinio Logico", "Informatica"] },
          { label: "Banca", type: "select", options: ["FGV", "Cebraspe", "Cesgranrio", "FCC"] },
          { label: "Dificuldade", type: "select", options: ["Facil", "Media", "Dificil"] },
        ]}
        columns={[
          { key: "statement", label: "Enunciado" },
          { key: "subject", label: "Materia" },
          { key: "board", label: "Banca" },
          { key: "difficulty", label: "Dificuldade" },
          { key: "correct", label: "Correta" },
        ]}
        rows={questions.map((question) => ({
          statement: question.enunciado,
          subject: question.materia.nome,
          board: question.banca.nome,
          difficulty: question.dificuldade,
          correct: question.alternativaCorreta,
        }))}
      />
    </AdminShell>
  );
}
