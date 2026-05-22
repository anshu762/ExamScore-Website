import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

function generateSalt(): string {
  return randomBytes(16).toString("hex");
}

function hashPassword(password: string, salt: string): string {
  const derivedKey = scryptSync(password, salt, 64);
  return derivedKey.toString("hex");
}

export function hashUserPassword(password: string): string {
  const salt = generateSalt();
  const hashed = hashPassword(password, salt);
  return `${salt}:${hashed}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derivedKey = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  const derivedBuffer = derivedKey;
  if (keyBuffer.length !== derivedBuffer.length) return false;
  return timingSafeEqual(keyBuffer, derivedBuffer);
}
