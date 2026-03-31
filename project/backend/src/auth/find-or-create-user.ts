import { users } from "../schema/index.ts";

export async function findOrCreateUser(
  db: any,
  email: string,
  options: { passwordHash?: string; displayName?: string } = {},
) {
  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash: options.passwordHash ?? "external-auth",
      displayName: options.displayName ?? email.split("@")[0],
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        updatedAt: new Date(),
      },
    })
    .returning();
  return user;
}
