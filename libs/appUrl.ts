import config from "../config";

export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    const runtimeOrigin = window.location.origin?.trim();
    if (runtimeOrigin && runtimeOrigin !== "null") {
      return runtimeOrigin;
    }
  }

  return config.appUrl?.trim() || "http://localhost:3000";
}

export function getRedirectUrl(path: string): string {
  const base = getAppUrl();
  if (!path) return base;
  if (path.startsWith("/")) return `${base}${path}`;
  return `${base}/${path}`;
}
