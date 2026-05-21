import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { apiError, badRequest } from "../../../../lib/api";
import { requireAdmin } from "../../../../lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { plano } = await request.json();

    if (plano !== "GRATIS" && plano !== "PREMIUM") {
      return badRequest("Plano invalido.");
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        plano,
        premiumAt: plano === "PREMIUM" ? new Date() : null,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        plano: true,
        tipo: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return apiError(error);
  }
}
