export function isValidEmail(email: unknown) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongEnoughPassword(password: unknown) {
  return typeof password === "string" && password.length >= 8;
}

export function requiredString(value: unknown, minLength = 1) {
  return typeof value === "string" && value.trim().length >= minLength;
}
