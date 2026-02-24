const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function wsUrl(path: string) {
  // http://localhost:8000 -> ws://localhost:8000
  const base = API_BASE.replace(/^http/, "ws");
  return `${base}${path}`;
}
