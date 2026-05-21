import { AdminShell } from "../../components/admin-shell";
import { AdminSimpleEntityManager } from "../../components/admin-simple-entity-manager";
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
      <AdminSimpleEntityManager
        title="Cadastrar banca"
        description="Cadastre organizadoras para classificar questoes e simulados."
        endpoint="/api/bancas"
        countLabel="Simulados vinculados"
        entities={boards.map((board) => ({
          id: board.id,
          nome: board.nome,
          count: board._count.simulados,
        }))}
      />
    </AdminShell>
  );
}
