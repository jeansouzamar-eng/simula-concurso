import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { apiError, badRequest } from "../../../lib/api";
import { requireAuth } from "../../../lib/auth";
import { canUserStartSimulation } from "../../../lib/plans";

type IncomingAnswer = {
  questaoId: string;
  alternativa: string;
};

export async function GET() {
  try {
    const user = await requireAuth();
    const resultados = await prisma.resultado.findMany({
      where: user.tipo === "ADMIN" ? undefined : { userId: user.id },
      include: {
        simulado: true,
        respostas: {
          include: {
            questao: {
              select: {
                id: true,
                enunciado: true,
                alternativaCorreta: true,
                explicacao: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ resultados });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { simuladoId, respostas } = await request.json();

    if (!simuladoId || !Array.isArray(respostas) || respostas.length === 0) {
      return badRequest("Simulado e respostas sao obrigatorios.");
    }

    const simulado = await prisma.simulado.findUnique({
      where: { id: simuladoId },
      include: {
        questoes: {
          include: {
            questao: {
              select: { id: true, alternativaCorreta: true },
            },
          },
          orderBy: { ordem: "asc" },
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

    const answerByQuestion = new Map(
      respostas.map((resposta: IncomingAnswer) => [resposta.questaoId, resposta.alternativa]),
    );
    const questaoIds = simulado.questoes.map((item) => item.questao.id);
    const questoes = await prisma.questao.findMany({
      where: { id: { in: questaoIds } },
      select: { id: true, alternativaCorreta: true },
    });

    const correctByQuestion = new Map(
      questoes.map((questao) => [questao.id, questao.alternativaCorreta]),
    );

    let acertos = 0;
    const normalizedAnswers = questaoIds.map((questaoId) => {
      const alternativa = String(answerByQuestion.get(questaoId) ?? "N");
      const correta = correctByQuestion.get(questaoId) === alternativa;

      if (correta) {
        acertos += 1;
      }

      return {
        questaoId,
        alternativa,
        correta,
        userId: user.id,
      };
    });

    const erros = normalizedAnswers.length - acertos;
    const percentual = Number(((acertos / normalizedAnswers.length) * 100).toFixed(2));

    const resultado = await prisma.resultado.create({
      data: {
        userId: user.id,
        simuladoId,
        acertos,
        erros,
        percentual,
        respostas: {
          create: normalizedAnswers,
        },
      },
      include: {
        simulado: true,
        respostas: {
          include: {
            questao: true,
          },
        },
      },
    });

    return NextResponse.json({ resultado }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
