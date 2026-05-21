import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { apiError, badRequest } from "../../../lib/api";
import { requireAdmin, requireAuth } from "../../../lib/auth";

export async function GET() {
  try {
    await requireAuth();
    const concursos = await prisma.concurso.findMany({ orderBy: { nome: "asc" } });
    return NextResponse.json({ concursos });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { nome } = await request.json();

    if (!nome || String(nome).trim().length < 2) {
      return badRequest("Nome do concurso e obrigatorio.");
    }

    const concurso = await prisma.concurso.create({ data: { nome: String(nome).trim() } });
    return NextResponse.json({ concurso }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
