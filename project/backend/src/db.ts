import { drizzle } from "drizzle-orm/node-postgres";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";

const require = createRequire(import.meta.url);

/**
 * KEEP: if this app uses a database, keep the DATABASE_URL branch — required for production deploy.
 *
 * Create a Drizzle database instance.
 *
 * - With DATABASE_URL: uses the node-postgres (`pg`) driver. Works under both
 *   Bun and Node.js runtimes (Docker, Vercel serverless, etc.).
 * - Without DATABASE_URL: falls back to PGlite (embedded Postgres at ./pglite)
 *   for local dev with zero external setup.
 *
 * Both use identical pgTable schemas — same code works in dev and production.
 */
export function createDb(): ReturnType<typeof drizzle> {
  if (process.env.DATABASE_URL) {
    return drizzle(process.env.DATABASE_URL);
  }
  // Lazy require keeps PGlite out of the production path. Module names are
  // stored in variables so serverless function tracers (e.g. @vercel/nft)
  // don't pick them up and bundle 8MB of dev-only Postgres into the lambda.
  // The build step also externalizes these modules; they resolve from
  // node_modules at runtime in dev/Docker only.
  const pgliteModule = "@electric-sql/pglite";
  const drizzlePgliteModule = "drizzle-orm/pglite";
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PGlite } = require(pgliteModule);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle: drizzlePglite } = require(drizzlePgliteModule);
  return drizzlePglite(new PGlite("./pglite"));
}

export const db = createDb();

/**
 * KEEP: if this app uses a database, keep this — run pending migrations at
 * startup. For PGlite (embedded, per-process) this is always safe. For shared
 * Postgres in multi-replica deploys, concurrent migrations race: set
 * SKIP_MIGRATIONS=1 and run `bun run db:migrate` in your deploy pipeline
 * instead (or wrap in an advisory lock).
 *
 * No-op if ./drizzle doesn't exist yet — `bun x drizzle-kit generate` to
 * produce the first migration from src/schema.ts.
 */
export async function runMigrations() {
  const migrationsFolder = "./drizzle";
  // Template ships no migrations; drizzle's migrate() throws on a missing
  // folder. Guard here so fresh checkouts start cleanly before the first
  // `drizzle-kit generate` run.
  if (!existsSync(migrationsFolder)) return;

  if (process.env.DATABASE_URL) {
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");
    await migrate(db, { migrationsFolder });
  } else {
    // Same lazy-load trick as createDb() — keep pglite out of the prod bundle.
    const migratorModule = "drizzle-orm/pglite/migrator";
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { migrate } = require(migratorModule);
    await migrate(db, { migrationsFolder });
  }
}
