import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/**
 * Hash a password using scrypt. Returns a self-describing string
 * (`scrypt$<salt-hex>$<key-hex>`) that embeds the salt.
 *
 * Uses node:crypto so it works identically under Bun and Node.js.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

/**
 * Verify a password against a stored hash produced by hashPassword().
 * Uses constant-time comparison.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [algo, saltHex, keyHex] = stored.split("$");
  if (algo !== "scrypt") return false;
  const salt = Buffer.from(saltHex, "hex");
  const key = Buffer.from(keyHex, "hex");
  const derived = (await scryptAsync(password, salt, key.length)) as Buffer;
  return derived.length === key.length && timingSafeEqual(derived, key);
}
