import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import * as jose from "jose";
import { users } from "../../schema.ts";
import type { AuthContext, AuthProvider } from "../../types.ts";
import { hashPassword, verifyPassword } from "../password.ts";

interface JwtConfig {
  secret?: string;
  expiresIn?: string;
  db?: any;
  /** When false, suppresses /api/auth/register and /api/auth/login routes.
   *  /api/auth/me is always mounted. Use this when jwtAuth is included in a
   *  chain purely to verify JWT tokens issued by another provider (e.g. Google OAuth). */
  routesEnabled?: boolean;
}

async function createToken(
  user: { id: number; email: string; displayName: string | null },
  role: string,
  secret: Uint8Array,
  expiresIn: string,
): Promise<string> {
  return new jose.SignJWT({
    sub: String(user.id),
    email: user.email,
    displayName: user.displayName,
    role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
}

function userToResponse(user: {
  id: number;
  email: string;
  displayName: string | null;
}) {
  return { id: user.id, email: user.email, displayName: user.displayName };
}

export function jwtAuth(config: JwtConfig = {}): AuthProvider {
  const secretStr = config.secret ?? process.env.JWT_SECRET;
  if (!secretStr && process.env.NODE_ENV !== "development") {
    throw new Error(
      "JWT_SECRET environment variable is required (set NODE_ENV=development to use the insecure default)",
    );
  }
  const secret = new TextEncoder().encode(
    secretStr ?? "dev-secret-change-in-production",
  );
  const expiresIn = config.expiresIn ?? "7d";
  const db = config.db;
  const routesEnabled = config.routesEnabled ?? true;

  // /api/auth/me is always available. It reads the chain-resolved auth context
  // first (works for IAP, dev, apiKey) and falls back to local JWT verify.
  // /api/auth/register and /api/auth/login are only mounted when routesEnabled
  // is true (i.e., the password strategy is active).
  const routes = new Hono();

  if (routesEnabled) {
  routes.post("/api/auth/register", async (c) => {
    const { email, password, displayName } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    const passwordHash = await hashPassword(password);

    try {
      const [user] = await db
        .insert(users)
        .values({
          email,
          passwordHash,
          displayName: displayName ?? null,
        })
        .returning();

      const role = "member";
      const token = await createToken(user, role, secret, expiresIn);

      return c.json({ token, user: userToResponse(user) }, 201);
    } catch (e: any) {
      if (e.message?.includes("unique") || e.code === "23505") {
        return c.json({ error: "Email already exists" }, 409);
      }
      throw e;
    }
  });

  routes.post("/api/auth/login", async (c) => {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    let valid = false;
    try {
      valid = await verifyPassword(password, user.passwordHash);
    } catch {
      // Sentinel hash (IAP/dev user) or corrupt hash — treat as invalid credentials
      valid = false;
    }
    if (!valid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const role = "member";
    const token = await createToken(user, role, secret, expiresIn);

    return c.json({ token, user: userToResponse(user) });
  });
  } // end routesEnabled gate

  routes.get("/api/auth/me", async (c) => {
    // Prefer the middleware chain's resolved auth. authMiddleware runs on "*"
    // before these routes mount, so IAP/dev/apiKey all populate this —
    // previously this handler only verified JWT and 401'd on IAP headers.
    const ctx = c.get("auth") as AuthContext | undefined;
    if (ctx) {
      return c.json({
        id: ctx.userId,
        email: ctx.claims?.email as string | undefined,
        displayName: ctx.claims?.displayName as string | undefined,
        role: ctx.role,
      });
    }

    // Fallback: direct JWT verification (clients hitting /me with a bearer
    // token but no middleware — shouldn't happen in practice, kept for safety).
    const authHeader = c.req.header("Authorization");
    const tokenStr = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : getCookie(c, "auth_token") ?? null;

    if (!tokenStr) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const { payload } = await jose.jwtVerify(tokenStr, secret);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(payload.sub)));
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }
      return c.json({
        id: String(user.id),
        email: user.email,
        displayName: user.displayName,
        role: (payload.role as string) ?? "member",
      });
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }
  });

  return {
    async resolve(req: Request): Promise<AuthContext | null> {
      // Check Authorization header first, then fall back to auth_token cookie
      // (set by OAuth callback redirect).
      const header = req.headers.get("Authorization");
      let tokenStr: string | undefined;
      if (header?.startsWith("Bearer ")) {
        tokenStr = header.slice(7);
      } else {
        const cookieHeader = req.headers.get("Cookie") ?? "";
        const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
        if (match) tokenStr = decodeURIComponent(match[1]);
      }
      if (!tokenStr) return null;
      try {
        const { payload } = await jose.jwtVerify(tokenStr, secret);
        return {
          userId: payload.sub ?? (payload.userId as string),
          role: (payload.role as string) ?? "member",
          claims: payload as Record<string, unknown>,
        };
      } catch {
        return null;
      }
    },
    routes,
  };
}
