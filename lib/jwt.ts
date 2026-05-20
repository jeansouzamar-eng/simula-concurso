import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE = "simula_token";

export type AuthPayload = {
  userId: string;
  email: string;
  tipo: "ALUNO" | "ADMIN";
  plano: "GRATIS" | "PREMIUM";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET nao configurado.");
  }

  return new TextEncoder().encode(secret);
}

export async function signAuthToken(payload: AuthPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());

  return {
    userId: String(payload.userId),
    email: String(payload.email),
    tipo: payload.tipo === "ADMIN" ? "ADMIN" : "ALUNO",
    plano: payload.plano === "PREMIUM" ? "PREMIUM" : "GRATIS",
  };
}
