import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth/index.ts";
import { authMiddleware } from "./auth/middleware.ts";
import { db, runMigrations } from "./db.ts";
import { seedDevUsers } from "./seed-dev.ts";
import { healthRoute } from "./routes/health.ts";
import { blogRoute } from "./routes/blog.ts";
import { websocket, upgrade } from "./ws.ts";

const isDev = process.env.NODE_ENV === "development";
const authStrategy = process.env.AUTH_STRATEGY;

// Run pending migrations at startup. Zero-config for PGlite/single-replica.
// Multi-replica on shared Postgres: set SKIP_MIGRATIONS=1 and run
// `bun run db:migrate` in your deploy pipeline instead.
if (process.env["SKIP_MIGRATIONS"] !== "1") {
  await runMigrations();
}

// Seed dev users whenever devAuth is in the chain: unset strategy → devAuth
// is the primary provider; iap → devAuth is a fallback (see buildAuthChain).
if (isDev && (!authStrategy || authStrategy === "iap")) {
  console.log(
    "Dev auth enabled -- use ?_user=email@example.com&_role=member to impersonate",
  );
  await seedDevUsers(db);
}

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use("*", authMiddleware(auth));

// Auth routes (login, register, etc.)
if (auth.routes) {
  app.route("/", auth.routes);
}

// Routes
app.route("/api", healthRoute);
app.route("/api", blogRoute);

// Root
app.get("/", (c) => c.json({ name: "backend", version: "0.0.1" }));

// Named export for deploy targets that adapt the Hono app to their own
// handler contract (e.g. @hono/node-server/vercel for Vercel serverless).
export { app };

const port = Number(process.env["PORT"] ?? 8000);

// Only log server startup when run as an entry point (Bun dev/Docker).
// When imported by a deploy wrapper (Vercel), no server is actually
// listening — the wrapper adapts app.fetch to the platform's handler.
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`Server running on http://localhost:${port}`);
}

export default {
  port,
  async fetch(req: Request, server: import("bun").Server) {
    // ws.ts overlay slot — dormant by default (upgrade → false, falls through).
    // await handles both sync boolean (dormant) and Promise (overlay with
    // async auth resolution before upgrade).
    if (await upgrade(req, server)) return undefined;
    return app.fetch(req, server);
  },
  // Spread only when ws.ts exports a real handler; dormant stub exports
  // undefined so this key is absent — safe on non-WS platforms.
  ...(websocket && { websocket }),
  idleTimeout: 0,
};
