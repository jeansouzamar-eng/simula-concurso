import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { apiError, badRequest } from "../../../lib/api";
import { requireAdmin, requireAuth } from "../../../lib/auth";

export async function GET() {
  try {
    await requireAuth();
    const materias = await prisma.materia.findMany({ orderBy: { nome: "asc" } });
    return NextResponse.json({ materias });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { nome } = await request.json();

    if (!nome) {
      return badRequest("Nome da materia e obrigatorio.");
    }

    const materia = await prisma.materia.create({ data: { nome } });
    return NextResponse.json({ materia }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
