import { defineConfig } from "drizzle-kit";

// KEEP: if this app uses a database, keep the DATABASE_URL branch — required for production deploy.
export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  ...(process.env.DATABASE_URL
    ? { dbCredentials: { url: process.env.DATABASE_URL } }
    : { driver: "pglite", dbCredentials: { url: "./pglite" } }),
});
