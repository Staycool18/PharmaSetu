/**
 * Axios base URL for Spring Boot API.
 * Production (ALB + nginx): browser calls https://<site>/api/... → proxied to Spring on 8083 without /api prefix.
 * Env VITE_API_BASE_URL is the public site origin (e.g. https://deploysolutions.me) — we append /api.
 * Local dev: set VITE_API_BASE_URL=http://localhost:8083 to call Spring directly (no /api prefix).
 */
export function resolveApiBase() {
  const raw = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (raw) {
    if (raw.endsWith("/api")) return raw;
    // Direct backend (typical local): port 8083 → paths are /auth, /medicine, …
    if (/:8083$/.test(raw) || raw.includes("localhost:8083") || raw.includes("127.0.0.1:8083")) {
      return raw;
    }
    return `${raw}/api`;
  }
  if (import.meta.env.DEV) {
    const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
    return `http://${host}:8083`;
  }
  return "https://deploysolutions.me/api";
}
