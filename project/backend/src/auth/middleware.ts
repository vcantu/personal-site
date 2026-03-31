import type { MiddlewareHandler } from "hono/types";
import type { AuthProvider } from "../types.ts";

/**
 * Hono middleware that resolves auth context from the request using the
 * configured auth provider chain. Sets `c.set("auth", ctx)` when
 * authentication succeeds. Does NOT reject unauthenticated requests — that
 * is left to individual route handlers or a separate guard middleware.
 */
export function authMiddleware(auth: AuthProvider): MiddlewareHandler {
  return async (c, next) => {
    const ctx = await auth.resolve(c.req.raw);
    if (ctx) {
      c.set("auth", ctx);
    }
    await next();
  };
}

/**
 * Guard middleware that rejects unauthenticated requests with 401.
 * Use on routes that require authentication.
 */
export function requireAuth(): MiddlewareHandler {
  return async (c, next) => {
    const auth = c.get("auth");
    if (!auth) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
  };
}
