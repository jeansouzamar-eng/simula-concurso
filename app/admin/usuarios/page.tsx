import { AdminCrud } from "../../components/admin-crud";
import { AdminShell } from "../../components/admin-shell";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell title="Usuarios" eyebrow="Gestao de usuarios">
      <AdminCrud
        title="Cadastrar usuario"
        description="Controle usuarios, plano e tipo de acesso dentro do sistema."
        fields={[
          { label: "Nome", placeholder: "Nome do usuario" },
          { label: "E-mail", placeholder: "usuario@email.com" },
          { label: "Plano", type: "select", options: ["Gratis", "Premium", "Equipe"] },
          { label: "Tipo de usuario", type: "select", options: ["Aluno", "Mentor", "Admin"] },
        ]}
        columns={[
          { key: "name", label: "Nome" },
          { key: "email", label: "E-mail" },
          { key: "plan", label: "Plano" },
          { key: "type", label: "Tipo" },
        ]}
        rows={users.map((user) => ({
          name: user.nome,
          email: user.email,
          plan: user.plano,
          type: user.tipo,
        }))}
      />
    </AdminShell>
  );
}
