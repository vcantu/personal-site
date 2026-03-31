import { Hono } from "hono";
import { users } from "../../schema.ts";
import { findOrCreateUser } from "../find-or-create-user.ts";
import type { AuthContext, AuthProvider } from "../../types.ts";

interface DevAuthConfig {
  db: any;
}

export function devAuth(config: DevAuthConfig): AuthProvider {
  if (process.env.NODE_ENV === 'production') {
    console.error('WARNING: devAuth should not be used in production. Returning no-op provider.');
    return { resolve: async () => null, routes: new Hono() };
  }

  const { db } = config;

  const routes = new Hono();

  // Dev endpoint: list all users (for user-switcher UI)
  routes.get("/api/auth/dev/users", async (c) => {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
      })
      .from(users);
    return c.json(allUsers);
  });

  // Dev endpoint: create a user quickly
  routes.post("/api/auth/dev/create", async (c) => {
    const { email, displayName, role } = await c.req.json();
    if (!email) return c.json({ error: "Email required" }, 400);

    const user = await findOrCreateUser(db, email, {
      passwordHash: "dev-mode-no-password",
      displayName,
    });
    return c.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: role ?? "member",
    });
  });

  return {
    async resolve(req: Request): Promise<AuthContext | null> {
      const url = new URL(req.url);

      // Check query param first, then header
      const email =
        url.searchParams.get("_user") ?? req.headers.get("X-Dev-User");
      if (!email) return null;

      const role = url.searchParams.get("_role") ?? "member";

      const user = await findOrCreateUser(db, email, {
        passwordHash: "dev-mode-no-password",
      });

      return {
        userId: String(user.id),
        role,
        claims: { email, displayName: user.displayName, devMode: true },
      };
    },
    routes,
  };
}
