import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { apiError, badRequest } from "../../../lib/api";
import { requireAdmin, requireAuth } from "../../../lib/auth";

export async function GET() {
  try {
    await requireAuth();
    const questoes = await prisma.questao.findMany({
      include: {
        materia: true,
        banca: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ questoes });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      enunciado,
      alternativaA,
      alternativaB,
      alternativaC,
      alternativaD,
      alternativaCorreta,
      explicacao,
      materiaId,
      bancaId,
      dificuldade = "MEDIA",
    } = body;

    if (
      !enunciado ||
      !alternativaA ||
      !alternativaB ||
      !alternativaC ||
      !alternativaD ||
      !alternativaCorreta ||
      !explicacao ||
      !materiaId ||
      !bancaId
    ) {
      return badRequest("Todos os campos da questao sao obrigatorios.");
    }

    if (!["A", "B", "C", "D"].includes(alternativaCorreta)) {
      return badRequest("Alternativa correta deve ser A, B, C ou D.");
    }

    const questao = await prisma.questao.create({
      data: {
        enunciado,
        alternativaA,
        alternativaB,
        alternativaC,
        alternativaD,
        alternativaCorreta,
        explicacao,
        materiaId,
        bancaId,
        dificuldade,
      },
      include: { materia: true, banca: true },
    });

    return NextResponse.json({ questao }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
