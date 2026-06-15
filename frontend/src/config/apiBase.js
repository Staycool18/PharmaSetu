/**
 * Axios base URL for Spring Boot API.
 * Domain-locked production setup for deploysolutions.me.
 * Env VITE_API_BASE_URL may override if needed.
 */
export function resolveApiBase() {
  const raw = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (raw) {
    if (raw.endsWith("/api")) return raw;
    if (/:8083$/.test(raw) || raw.includes("localhost:8083") || raw.includes("127.0.0.1:8083")) {
      return raw;
    }
    return `${raw}/api`;
  }
  return "https://deploysolutions.me/api";
}
