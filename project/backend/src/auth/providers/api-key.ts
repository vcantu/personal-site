import type { AuthContext, AuthProvider } from "../../types.ts";

/**
 * API key auth provider. Only enabled when the API_KEYS env var is set to a
 * comma-separated list of valid keys. If API_KEYS is unset, this provider is
 * disabled (always returns null) to avoid accepting arbitrary ak_ tokens.
 */
export function apiKeyAuth(): AuthProvider {
  const configuredKeys = process.env.API_KEYS;
  const validKeys = configuredKeys
    ? new Set(configuredKeys.split(",").map((k) => k.trim()).filter(Boolean))
    : null;

  return {
    async resolve(req: Request): Promise<AuthContext | null> {
      if (!validKeys) return null; // provider disabled
      const header = req.headers.get("Authorization");
      if (!header?.startsWith("Bearer ak_")) return null;
      const key = header.slice(7);
      if (!validKeys.has(key)) return null;
      return {
        userId: `apikey:${key.slice(3, 11)}`,
        role: "member",
        claims: { type: "api_key" },
      };
    },
  };
}
