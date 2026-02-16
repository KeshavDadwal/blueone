/**
 * Central API configuration - base URL from .env
 * Set NEXT_PUBLIC_API_URL in .env (e.g. https://dashboard.bluone.ink)
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://dashboard.bluone.ink";

export const getApiUrl = (path) => {
  const base = API_BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
};
