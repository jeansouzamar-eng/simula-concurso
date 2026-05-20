import { AdminCrud } from "../../components/admin-crud";
import { AdminShell } from "../../components/admin-shell";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSimulationsPage() {
  await requireAdmin();
  const simulations = await prisma.simulado.findMany({
    include: { materia: true, questoes: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell title="Simulados" eyebrow="CRUD de simulados">
      <AdminCrud
        title="Cadastrar simulado"
        description="Monte simulados com tempo, nivel, materia e quantidade de questoes."
        fields={[
          { label: "Titulo", placeholder: "Ex: TJ - Analista Judiciario" },
          { label: "Descricao", type: "textarea", placeholder: "Resumo do simulado" },
          { label: "Tempo limite", placeholder: "Ex: 180 min" },
          { label: "Nivel", type: "select", options: ["Facil", "Intermediario", "Avancado"] },
          { label: "Materia", type: "select", options: ["Conhecimentos Gerais", "Portugues", "Direito Administrativo", "Administracao Publica"] },
          { label: "Quantidade de questoes", placeholder: "Ex: 60" },
          { label: "Simulado premium", type: "select", options: ["false", "true"] },
        ]}
        columns={[
          { key: "title", label: "Titulo" },
          { key: "timeLimit", label: "Tempo" },
          { key: "level", label: "Nivel" },
          { key: "subject", label: "Materia" },
          { key: "questions", label: "Questoes" },
        ]}
        rows={simulations.map((simulation) => ({
          title: simulation.titulo,
          timeLimit: `${simulation.tempoLimite} min`,
          level: simulation.nivel,
          subject: simulation.materia.nome,
          questions: simulation.questoes.length || simulation.quantidadeQuestoes,
        }))}
      />
    </AdminShell>
  );
}
