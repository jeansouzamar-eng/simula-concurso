import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { apiError, badRequest } from "../../../lib/api";
import { requireAdmin, requireAuth } from "../../../lib/auth";

export async function GET() {
  try {
    await requireAuth();
    const bancas = await prisma.banca.findMany({ orderBy: { nome: "asc" } });
    return NextResponse.json({ bancas });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { nome } = await request.json();

    if (!nome) {
      return badRequest("Nome da banca e obrigatorio.");
    }

    const banca = await prisma.banca.create({ data: { nome } });
    return NextResponse.json({ banca }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
