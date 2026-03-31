/**
 * Dormant WebSocket slot. Overlays that need WS overwrite this file.
 *
 * Default state: `websocket` is undefined and `upgrade` returns false, so
 * index.ts spreads nothing into the server export and the fetch handler
 * falls straight through to Hono. Bun const-folds the undefined check and
 * tree-shakes the WS branch — no `websocket` key in the bundle, safe on
 * platforms without WebSocket support (Vercel serverless etc.).
 *
 * Overlays (e.g. --ai-backend sdk) overwrite this file with a real
 * handler + upgrade predicate. index.ts never changes.
 */
import type { Server, WebSocketHandler } from "bun";

export const websocket: WebSocketHandler<unknown> | undefined = undefined;

/**
 * Return type allows `Promise<boolean>` so overlays can resolve async
 * auth before upgrading. index.ts awaits the result; awaiting a plain
 * boolean is a no-op, so the dormant stub stays synchronous.
 */
export function upgrade(_req: Request, _server: Server): boolean | Promise<boolean> {
  return false;
}
