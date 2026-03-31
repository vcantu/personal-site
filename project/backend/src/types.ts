import type { Hono } from "hono";

export interface AuthContext {
  userId: string;
  teamId?: string;
  role: string;
  claims: Record<string, unknown>;
}

export interface AuthProvider {
  resolve(req: Request): Promise<AuthContext | null>;
  routes?: Hono;
}
