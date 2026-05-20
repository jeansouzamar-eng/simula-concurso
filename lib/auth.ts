import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { AUTH_COOKIE, signAuthToken, verifyAuthToken } from "./jwt";

export { AUTH_COOKIE, signAuthToken, verifyAuthToken };
export type { AuthPayload } from "./jwt";

export async function getCurrentUser() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAuthToken(token);

    return prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        plano: true,
        createdAt: true,
      },
    });
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Response("Nao autenticado", { status: 401 });
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.tipo !== "ADMIN") {
    throw new Response("Acesso negado", { status: 403 });
  }

  return user;
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
