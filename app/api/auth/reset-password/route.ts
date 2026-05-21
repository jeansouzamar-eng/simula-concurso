import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { apiError, badRequest } from "../../../../lib/api";
import { isStrongEnoughPassword, requiredString } from "../../../../lib/validation";
import { hashResetToken } from "../../../../lib/password-reset";

export async function POST(request: Request) {
  try {
    const { token, senha } = await request.json();

    if (!requiredString(token, 20) || !isStrongEnoughPassword(senha)) {
      return badRequest("Token ou senha invalidos.");
    }

    const tokenHash = hashResetToken(String(token));
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Link expirado ou invalido." }, { status: 400 });
    }

    const senhaHash = await bcrypt.hash(String(senha), 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { senhaHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
          id: { not: resetToken.id },
        },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ message: "Senha atualizada com sucesso." });
  } catch (error) {
    return apiError(error);
  }
}
