import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { authCookieOptions, AUTH_COOKIE, signAuthToken } from "../../../../lib/auth";
import { apiError, badRequest } from "../../../../lib/api";
import { isStrongEnoughPassword, isValidEmail, requiredString } from "../../../../lib/validation";

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();

    if (!requiredString(nome, 2) || !isValidEmail(email) || !isStrongEnoughPassword(senha)) {
      return badRequest("Nome, email e senha sao obrigatorios.");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "Email ja cadastrado." }, { status: 409 });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const user = await prisma.user.create({
      data: { nome, email, senhaHash, tipo: "ALUNO", plano: "GRATIS" },
      select: { id: true, nome: true, email: true, tipo: true, plano: true },
    });

    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      tipo: user.tipo,
      plano: user.plano,
    });

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(AUTH_COOKIE, token, authCookieOptions());
    return response;
  } catch (error) {
    return apiError(error);
  }
}
