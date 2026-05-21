import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { apiError, badRequest } from "../../../lib/api";
import { requireAdmin, requireAuth } from "../../../lib/auth";

export async function GET() {
  try {
    await requireAuth();
    const simulados = await prisma.simulado.findMany({
      include: {
        materia: true,
        banca: true,
        concursos: { include: { concurso: true } },
        questoes: {
          include: {
            questao: {
              include: {
                materia: true,
                banca: true,
              },
            },
          },
          orderBy: { ordem: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ simulados });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      titulo,
      descricao,
      tempoLimite,
      nivel = "INTERMEDIARIO",
      materiaId,
      bancaId,
      concursoIds = [],
      quantidadeQuestoes,
      questaoIds = [],
    } = body;

    if (!titulo || !descricao || !tempoLimite || !materiaId || !quantidadeQuestoes) {
      return badRequest("Titulo, descricao, tempo limite, materia e quantidade sao obrigatorios.");
    }

    if (!["FACIL", "INTERMEDIARIO", "AVANCADO"].includes(nivel)) {
      return badRequest("Nivel invalido.");
    }

    if (Number(tempoLimite) < 1 || Number(quantidadeQuestoes) < 1) {
      return badRequest("Tempo limite e quantidade devem ser maiores que zero.");
    }

    if (!Array.isArray(questaoIds) || !Array.isArray(concursoIds)) {
      return badRequest("Questoes ou concursos invalidos.");
    }

    const simulado = await prisma.simulado.create({
      data: {
        titulo,
        descricao,
        tempoLimite: Number(tempoLimite),
        nivel,
        isPremium: Boolean(body.isPremium),
        materiaId,
        bancaId: bancaId || null,
        concursos: {
          create: concursoIds.map((concursoId: string) => ({ concursoId })),
        },
        quantidadeQuestoes: Number(quantidadeQuestoes),
        questoes: {
          create: questaoIds.map((questaoId: string, index: number) => ({
            questaoId,
            ordem: index + 1,
          })),
        },
      },
      include: {
        materia: true,
        banca: true,
        concursos: { include: { concurso: true } },
        questoes: { include: { questao: true } },
      },
    });

    return NextResponse.json({ simulado }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
