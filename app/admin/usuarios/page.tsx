import { AdminShell } from "../../components/admin-shell";
import { AdminUsersManager } from "../../components/admin-users-manager";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell title="Usuarios" eyebrow="Gestao de usuarios">
      <AdminUsersManager users={users} />
    </AdminShell>
  );
}
