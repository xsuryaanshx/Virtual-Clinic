/**
 * AI chat API URL. On Vercel (same origin) use relative `/api/chat`.
 * For split deployments, set `VITE_CHAT_API_BASE` at build time (e.g. `https://your-app.vercel.app`).
 * For local `vite` against a remote API, set `VITE_CHAT_API_BASE` and the Vite dev server proxies `/api` to that host.
 */
export function getChatApiUrl(): string {
  const base = import.meta.env.VITE_CHAT_API_BASE?.replace(/\/$/, "");
  if (base) return `${base}/api/chat`;
  return "/api/chat";
}
