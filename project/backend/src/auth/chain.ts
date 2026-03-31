import { Hono } from "hono";
import type { AuthContext, AuthProvider } from "../types.ts";

export function chain(...providers: AuthProvider[]): AuthProvider {
  let routesCache: Hono | undefined;
  return {
    async resolve(req: Request): Promise<AuthContext | null> {
      for (const provider of providers) {
        const result = await provider.resolve(req);
        if (result) return result;
      }
      return null;
    },
    get routes() {
      if (!routesCache) {
        routesCache = new Hono();
        for (const provider of providers) {
          if (provider.routes) {
            routesCache.route("/", provider.routes);
          }
        }
      }
      return routesCache;
    },
  };
}
