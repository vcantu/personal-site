/**
 * Seed default dev users so the user-switcher has accounts immediately.
 *
 * Only called when NODE_ENV=development. Uses upsert via findOrCreateUser
 * (ON CONFLICT DO UPDATE — bumps updatedAt) so it is safe to call on every startup.
 *
 * If the users table doesn't exist yet (db:push hasn't been run), the seed
 * logs a warning and exits gracefully instead of crashing the server.
 */
import { findOrCreateUser } from "./auth/find-or-create-user.ts";

const DEV_USERS = [
  { email: "alice@test.com", displayName: "Alice" },
  { email: "bob@test.com", displayName: "Bob" },
];

export async function seedDevUsers(db: any): Promise<void> {
  try {
    for (const { email, displayName } of DEV_USERS) {
      await findOrCreateUser(db, email, {
        passwordHash: "dev-mode-no-password",
        displayName,
      });
    }
    console.log(
      `Seeded dev users: ${DEV_USERS.map((u) => u.email).join(", ")}`,
    );
  } catch (err) {
    console.warn(
      "Warning: could not seed dev users (run `bun run db:push` first):",
      err instanceof Error ? err.message : err,
    );
  }
}
