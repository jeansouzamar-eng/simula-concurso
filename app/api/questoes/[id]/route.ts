import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { apiError, badRequest } from "../../../../lib/api";
import { requireAdmin } from "../../../../lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    if (body.alternativaCorreta && !["A", "B", "C", "D"].includes(body.alternativaCorreta)) {
      return badRequest("Alternativa correta deve ser A, B, C ou D.");
    }

    if (body.dificuldade && !["FACIL", "MEDIA", "DIFICIL"].includes(body.dificuldade)) {
      return badRequest("Dificuldade invalida.");
    }

    const questao = await prisma.questao.update({
      where: { id },
      data: {
        enunciado: body.enunciado,
        alternativaA: body.alternativaA,
        alternativaB: body.alternativaB,
        alternativaC: body.alternativaC,
        alternativaD: body.alternativaD,
        alternativaCorreta: body.alternativaCorreta,
        explicacao: body.explicacao,
        materiaId: body.materiaId,
        bancaId: body.bancaId,
        dificuldade: body.dificuldade,
      },
      include: { materia: true, banca: true },
    });

    return NextResponse.json({ questao });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.questao.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
