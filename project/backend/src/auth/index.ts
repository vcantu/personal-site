/**
 * Auth chain singleton. Extracted from index.ts so both the HTTP server
 * and out-of-Hono consumers (WebSocket upgrade handlers) can resolve
 * auth against the same provider stack.
 *
 * Environment variables:
 *   AUTH_IAP_ENABLED=true — enable IAP passthrough (behind Google IAP proxy)
 *   JWT_SECRET            — JWT signing key (required in production)
 *   API_KEYS              — comma-separated valid API keys
 *   AUTH_STRATEGY         — optional override: "iap", "password", "none"
 */

import { chain } from "./chain.ts";
import { apiKeyAuth } from "./providers/api-key.ts";
import { devAuth } from "./providers/dev.ts";
import { iapAuth } from "./providers/iap.ts";
import { jwtAuth } from "./providers/jwt.ts";
import { anonymousAuth } from "./providers/anonymous.ts";
import { db } from "../db.ts";
import type { AuthContext, AuthProvider } from "../types.ts";

const isDev = process.env.NODE_ENV === "development";
const iapEnabled = process.env.AUTH_IAP_ENABLED === "true";
const authStrategy = process.env.AUTH_STRATEGY;

function buildAuthChain(): AuthProvider {
  // AUTH_STRATEGY override takes precedence
  if (authStrategy) {
    switch (authStrategy) {
      case "none":
        return chain(anonymousAuth(), apiKeyAuth());
      case "iap":
        // In dev, keep devAuth in the chain so ?_user= and /api/auth/dev/*
        // work alongside IAP header injection via Vite proxy. chain() is
        // first-match-wins — IAP tries X-Goog header, then dev tries ?_user=.
        // jwtAuth stays in both for /api/auth/me (now chain-aware).
        return isDev
          ? chain(iapAuth({ db }), devAuth({ db }), jwtAuth({ db, routesEnabled: false }), apiKeyAuth())
          : chain(iapAuth({ db }), jwtAuth({ db, routesEnabled: false }), apiKeyAuth());
      case "password":
        return chain(jwtAuth({ db }), apiKeyAuth());
      default:
        console.warn(`Warning: unknown AUTH_STRATEGY "${authStrategy}", falling back to password`);
        return chain(jwtAuth({ db }), apiKeyAuth());
    }
  }

  // Dev mode: devAuth for ?_user= impersonation, jwtAuth for /register
  // and /login so RegisterForm works in preview. chain() is first-match-
  // wins — devAuth handles ?_user=, jwtAuth handles bearer tokens; both
  // contribute routes (devAuth: /api/auth/dev/*, jwtAuth: /api/auth/*).
  if (isDev) {
    return chain(devAuth({ db }), jwtAuth({ db }), apiKeyAuth());
  }

  // IAP mode: trust proxy headers, fall back to JWT + API keys
  if (iapEnabled) {
    return chain(iapAuth({ db }), jwtAuth({ db, routesEnabled: false }), apiKeyAuth());
  }

  // Default: password (JWT username/password) + API keys
  return chain(jwtAuth({ db }), apiKeyAuth());
}

/** The configured auth chain. Same instance everywhere. */
export const auth = buildAuthChain();

/**
 * Resolve a WebSocket upgrade request against the auth chain.
 *
 * Browser WebSocket clients cannot set custom headers, so ?token= in the
 * URL is bridged into an Authorization header before resolve(). Non-browser
 * clients (native apps, server-to-server) that CAN set headers pass through
 * unchanged.
 */
export async function resolveWebSocketAuth(req: Request): Promise<AuthContext | null> {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  // If a ?token= query param is present and no Authorization header,
  // build a synthetic Request so jwtAuth.resolve() can see the token.
  // Header takes precedence if both are set.
  if (token && !req.headers.get("Authorization")) {
    const headers = new Headers(req.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return auth.resolve(new Request(req.url, { headers }));
  }

  return auth.resolve(req);
}
