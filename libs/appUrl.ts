import config from "../config";

export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    const configured = config.appUrl?.trim();
    if (configured && !configured.includes("localhost")) {
      return configured;
    }
    return origin || configured || "http://localhost:3000";
  }

  return config.appUrl?.trim() || "http://localhost:3000";
}

export function getRedirectUrl(path: string): string {
  const base = getAppUrl();
  if (!path) return base;
  if (path.startsWith("/")) return `${base}${path}`;
  return `${base}/${path}`;
}
