import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { apiError, badRequest } from "../../../../lib/api";
import { requireAdmin } from "../../../../lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { nome } = await request.json();

    if (!nome) {
      return badRequest("Nome da banca e obrigatorio.");
    }

    const banca = await prisma.banca.update({ where: { id }, data: { nome } });
    return NextResponse.json({ banca });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.banca.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
