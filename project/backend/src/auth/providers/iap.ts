/**
 * Google Identity-Aware Proxy (IAP) auth provider.
 *
 * SECURITY: This provider trusts the X-Goog-Authenticated-User-Email header.
 * It MUST only be used behind a properly configured IAP proxy that:
 * 1. Strips these headers from incoming requests
 * 2. Sets them only after authenticating the user
 *
 * Using this provider without IAP in front allows any client to impersonate any user.
 *
 * This provider is opt-in via AUTH_IAP_ENABLED=true (see src/index.ts).
 */

import { findOrCreateUser } from "../find-or-create-user.ts";
import type { AuthContext, AuthProvider } from "../../types.ts";

interface IapAuthConfig {
  db: any;
  defaultRole?: string;
}

export function iapAuth(config: IapAuthConfig): AuthProvider {
  const { db, defaultRole = "member" } = config;

  return {
    async resolve(req: Request): Promise<AuthContext | null> {
      // IAP sets these headers after authenticating the user
      const emailHeader = req.headers.get("X-Goog-Authenticated-User-Email");
      if (!emailHeader) return null;

      // Header format is "accounts.google.com:user@example.com"
      const email = emailHeader.replace(/^accounts\.google\.com:/, "");
      if (!email) return null;

      const user = await findOrCreateUser(db, email, {
        passwordHash: "iap-external-auth",
      });

      return {
        userId: String(user.id),
        role: defaultRole,
        claims: {
          email,
          displayName: user.displayName,
          provider: "iap",
        },
      };
    },
    // No routes — IAP handles the login flow externally via the proxy
  };
}
