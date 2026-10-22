const COLLAPSE_KEY = "rutstudio.collapse.v1";

let _cache: Record<string, boolean> | null = null;
const _listeners = new Set<() => void>();

function readState(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(COLLAPSE_KEY) || "{}"); } catch { return {}; }
}

function writeState(s: Record<string, boolean>): void {
  try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify(s)); } catch {}
}

export function getCollapseCache(): Record<string, boolean> {
  if (!_cache) _cache = readState();
  return _cache;
}

export function setCollapseKey(key: string, open: boolean): void {
  _cache = { ...getCollapseCache(), [key]: open };
  writeState(_cache);
  _listeners.forEach((fn) => fn());
}

export function subscribeCollapse(fn: () => void): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}
