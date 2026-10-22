import type { DraftStore, DraftEntry, Project } from "./types";

export const DRAFTS_KEY = "rut_studio_drafts_v1";
export const AUTOSAVE_INTERVAL_MS = 8000;
export const MAX_DRAFTS = 50;

export function readDrafts(): DraftStore {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    if (!raw) return { drafts: [], autosaveId: null };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.drafts)) return { drafts: [], autosaveId: null };
    return parsed;
  } catch { return { drafts: [], autosaveId: null }; }
}

export function writeDrafts(state: DraftStore): boolean {
  try {
    let s = state;
    if (s.drafts.length > MAX_DRAFTS) s = { ...s, drafts: s.drafts.slice(0, MAX_DRAFTS) };
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(s));
    return true;
  } catch {
    try {
      const shrunk = { ...state, drafts: state.drafts.slice(0, Math.max(5, Math.floor(state.drafts.length / 2))) };
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(shrunk));
      return true;
    } catch { return false; }
  }
}

export function newDraftId(): string {
  return `d${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function suggestDraftName(project: Project): string {
  const firstSlide = project?.slides?.[0];
  if (!firstSlide) return "Untitled draft";
  const vals = firstSlide.valuesByTpl?.[firstSlide.tplId] || {};
  const headline = vals.headline || vals.title || vals.quote;
  if (typeof headline === "string" && headline.trim()) {
    return headline.trim().slice(0, 50);
  }
  const d = new Date();
  const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
  return `Post · ${dateStr}`;
}

export function friendlyTimeAgo(ts: number): string {
  const d = Date.now() - ts;
  if (d < 60 * 1000) return "just now";
  if (d < 60 * 60 * 1000) return `${Math.floor(d / 60000)}m ago`;
  if (d < 24 * 60 * 60 * 1000) return `${Math.floor(d / 3600000)}h ago`;
  if (d < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(d / 86400000)}d ago`;
  return new Date(ts).toLocaleDateString();
}

export function makeDraftEntry(
  project: Project,
  name: string,
  thumb: string | null,
  opts: { isAutosave?: boolean } = {}
): DraftEntry {
  const now = Date.now();
  return {
    id: newDraftId(),
    name,
    createdAt: now,
    updatedAt: now,
    thumb,
    project: JSON.parse(JSON.stringify(project)),
    isAutosave: opts.isAutosave,
  };
}
