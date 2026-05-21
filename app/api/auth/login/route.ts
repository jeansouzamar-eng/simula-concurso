import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { authCookieOptions, AUTH_COOKIE, signAuthToken } from "../../../../lib/auth";
import { apiError, badRequest } from "../../../../lib/api";
import { isValidEmail, requiredString } from "../../../../lib/validation";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    if (!isValidEmail(email) || !requiredString(senha, 1)) {
      return badRequest("Email e senha sao obrigatorios.");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json({ error: "Credenciais invalidas." }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(senha, user.senhaHash);

    if (!validPassword) {
      return NextResponse.json({ error: "Credenciais invalidas." }, { status: 401 });
    }

    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      tipo: user.tipo,
      plano: user.plano,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        plano: user.plano,
      },
    });
    response.cookies.set(AUTH_COOKIE, token, authCookieOptions());
    return response;
  } catch (error) {
    return apiError(error);
  }
}
