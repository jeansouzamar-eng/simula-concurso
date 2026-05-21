import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { apiError, badRequest } from "../../../../lib/api";
import { isValidEmail } from "../../../../lib/validation";
import { createResetToken, hashResetToken, passwordResetExpiresAt } from "../../../../lib/password-reset";
import { sendPasswordResetEmail } from "../../../../lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!isValidEmail(email)) {
      return badRequest("Informe um email valido.");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (user) {
      const token = createResetToken();
      const tokenHash = hashResetToken(token);

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: passwordResetExpiresAt(),
        },
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/redefinir-senha?token=${token}`;

      await sendPasswordResetEmail({
        to: user.email,
        name: user.nome,
        resetUrl,
      });
    }

    return NextResponse.json({
      message: "Se o email estiver cadastrado, enviaremos um link para redefinir sua senha.",
    });
  } catch (error) {
    return apiError(error);
  }
}
