import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const [algorithm, salt, storedHash] = encoded.split("$");
  if (algorithm !== "scrypt" || !salt || !storedHash) {
    return false;
  }

  const currentHash = scryptSync(password, salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (currentHash.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(currentHash, storedBuffer);
}
