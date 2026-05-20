import { AdminCrud } from "../../components/admin-crud";
import { AdminShell } from "../../components/admin-shell";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminBoardsPage() {
  await requireAdmin();
  const boards = await prisma.banca.findMany({
    include: { _count: { select: { simulados: true } } },
    orderBy: { nome: "asc" },
  });

  return (
    <AdminShell title="Bancas" eyebrow="CRUD de bancas">
      <AdminCrud
        title="Cadastrar banca"
        description="Cadastre organizadoras para classificar questoes e simulados."
        fields={[{ label: "Nome da banca", placeholder: "Ex: FGV" }]}
        columns={[
          { key: "name", label: "Nome da banca" },
          { key: "simulations", label: "Simulados vinculados" },
        ]}
        rows={boards.map((board) => ({
          name: board.nome,
          simulations: board._count.simulados,
        }))}
      />
    </AdminShell>
  );
}
