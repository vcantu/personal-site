import type { AuthContext, AuthProvider } from "../../types.ts";

/**
 * Anonymous auth provider. Always resolves to a synthetic anonymous context.
 * Used when AUTH_STRATEGY=none so that WebSocket handlers (which require a
 * non-null AuthContext) don't reject connections.
 */
export function anonymousAuth(): AuthProvider {
  return {
    async resolve(_req: Request): Promise<AuthContext | null> {
      return {
        userId: "anonymous",
        role: "member",
        claims: { type: "anonymous" },
      };
    },
  };
}
