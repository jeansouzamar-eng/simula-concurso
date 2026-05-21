import { createHash, randomBytes } from "crypto";

export function createResetToken() {
  return randomBytes(32).toString("hex");
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function passwordResetExpiresAt() {
  return new Date(Date.now() + 60 * 60 * 1000);
}
