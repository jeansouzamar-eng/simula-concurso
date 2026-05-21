import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { apiError, badRequest } from "../../../../lib/api";
import { requireAdmin, requireAuth } from "../../../../lib/auth";
import { canUserStartSimulation } from "../../../../lib/plans";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const simulado = await prisma.simulado.findUnique({
      where: { id },
      include: {
        materia: true,
        banca: true,
        questoes: {
          orderBy: { ordem: "asc" },
          include: {
            questao: {
              select: {
                id: true,
                enunciado: true,
                alternativaA: true,
                alternativaB: true,
                alternativaC: true,
                alternativaD: true,
                dificuldade: true,
                materia: { select: { nome: true } },
                banca: { select: { nome: true } },
              },
            },
          },
        },
      },
    });

    if (!simulado) {
      return NextResponse.json({ error: "Simulado nao encontrado." }, { status: 404 });
    }

    const access = await canUserStartSimulation({
      userId: user.id,
      userPlan: user.plano,
      isPremiumSimulation: simulado.isPremium,
    });

    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 });
    }

    return NextResponse.json({ simulado });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const questaoIds = Array.isArray(body.questaoIds) ? body.questaoIds : undefined;

    if (body.nivel && !["FACIL", "INTERMEDIARIO", "AVANCADO"].includes(body.nivel)) {
      return badRequest("Nivel invalido.");
    }

    if (body.tempoLimite && Number(body.tempoLimite) < 1) {
      return badRequest("Tempo limite deve ser maior que zero.");
    }

    if (body.quantidadeQuestoes && Number(body.quantidadeQuestoes) < 1) {
      return badRequest("Quantidade deve ser maior que zero.");
    }

    const simulado = await prisma.$transaction(async (tx) => {
      if (questaoIds) {
        await tx.simuladoQuestao.deleteMany({ where: { simuladoId: id } });
      }

      return tx.simulado.update({
        where: { id },
        data: {
          titulo: body.titulo,
          descricao: body.descricao,
          tempoLimite: body.tempoLimite ? Number(body.tempoLimite) : undefined,
          nivel: body.nivel,
          materiaId: body.materiaId,
          bancaId: body.bancaId || null,
        quantidadeQuestoes: body.quantidadeQuestoes ? Number(body.quantidadeQuestoes) : undefined,
          isPremium: typeof body.isPremium === "boolean" ? body.isPremium : undefined,
          questoes: questaoIds
            ? {
                create: questaoIds.map((questaoId: string, index: number) => ({
                  questaoId,
                  ordem: index + 1,
                })),
              }
            : undefined,
        },
        include: { materia: true, banca: true, questoes: true },
      });
    });

    return NextResponse.json({ simulado });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.simulado.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
