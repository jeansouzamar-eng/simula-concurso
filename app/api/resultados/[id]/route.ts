import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { apiError } from "../../../../lib/api";
import { requireAuth } from "../../../../lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const resultado = await prisma.resultado.findFirst({
      where: {
        id,
        ...(user.tipo === "ADMIN" ? {} : { userId: user.id }),
      },
      include: {
        simulado: {
          include: {
            materia: true,
            banca: true,
          },
        },
        respostas: {
          include: {
            questao: {
              include: {
                materia: true,
                banca: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!resultado) {
      return NextResponse.json({ error: "Resultado nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ resultado });
  } catch (error) {
    return apiError(error);
  }
}
