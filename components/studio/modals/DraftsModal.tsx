"use client";
import { useState, useMemo } from "react";
import type { DraftStore, Project } from "@/lib/types";
import { suggestDraftName, friendlyTimeAgo } from "@/lib/drafts";

interface Props {
  store: DraftStore;
  currentProject: Project;
  onLoad: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onSaveAs: (name: string) => Promise<void>;
  onClose: () => void;
}

export function DraftsModal({
  store, currentProject, onLoad, onRename, onDuplicate, onRemove, onSaveAs, onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Suggested name follows the project; the user's own typing wins until the project changes.
  const suggested = useMemo(() => suggestDraftName(currentProject), [currentProject]);
  const [typedName, setTypedName] = useState<string | null>(null);
  const [lastSuggested, setLastSuggested] = useState(suggested);
  if (lastSuggested !== suggested) { setLastSuggested(suggested); setTypedName(null); }
  const saveAsName = typedName ?? suggested;
  const setSaveAsName = (v: string) => setTypedName(v);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return store.drafts;
    return store.drafts.filter((d) => d.name.toLowerCase().includes(q));
  }, [store.drafts, query]);

  const handleSaveAs = async () => {
    setSaving(true);
    try { await onSaveAs(saveAsName); } finally { setSaving(false); }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640, maxHeight: "85vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
              color: "var(--purple)", marginBottom: 4 }}>Library</div>
            <div className="modal-title">Drafts</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              Autosaves every few seconds while you work. Stored on this device.
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            style={{ flex: 1, minWidth: 160, border: "1px solid var(--border)", borderRadius: 8,
              padding: "8px 12px", fontFamily: "inherit", fontSize: 13 }}
            placeholder="Name this version…"
            value={saveAsName}
            onChange={(e) => setSaveAsName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSaveAs(); }}
          />
          <button className="primary" onClick={handleSaveAs} disabled={saving}>
            {saving ? "Saving…" : "Save version"}
          </button>
          {store.drafts.length > 3 && (
            <input
              style={{ flex: 1, minWidth: 140, border: "1px solid var(--border)", borderRadius: 8,
                padding: "8px 12px", fontFamily: "inherit", fontSize: 13 }}
              placeholder="Search drafts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
              {query ? (
                <>No drafts match <b>&ldquo;{query}&rdquo;</b>.</>
              ) : (
                <div>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>&#128194;</div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>No drafts yet</div>
                  <div style={{ fontSize: 13 }}>Your autosaves and saved versions will appear here.</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
              {filtered.map((d) => (
                <div key={d.id} style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden",
                  background: "#fff", position: "relative" }}>
                  <button
                    style={{ display: "block", width: "100%", aspectRatio: "4/5", position: "relative",
                      background: "var(--bg)", border: "none", cursor: "pointer", padding: 0 }}
                    onClick={() => onLoad(d.id)}
                    title="Open this draft"
                  >
                    {d.thumb
                      ? <img src={d.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 11, color: "var(--muted)" }}>No preview</div>
                    }
                    {d.isAutosave && (
                      <div style={{ position: "absolute", top: 6, left: 6, background: "var(--purple)", color: "#fff",
                        borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>AUTO</div>
                    )}
                  </button>

                  <div style={{ padding: "8px 10px" }}>
                    {renaming === d.id ? (
                      <input
                        autoFocus
                        style={{ width: "100%", border: "1px solid var(--purple)", borderRadius: 4,
                          padding: "3px 6px", fontSize: 12, fontFamily: "inherit" }}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => { onRename(d.id, renameValue); setRenaming(null); }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { onRename(d.id, renameValue); setRenaming(null); }
                          if (e.key === "Escape") setRenaming(null);
                        }}
                      />
                    ) : (
                      <div
                        style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, marginBottom: 3,
                          cursor: "text", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        onClick={() => { setRenaming(d.id); setRenameValue(d.name); }}
                        title="Click to rename"
                      >
                        {d.name}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
                      {d.project?.slides?.length ?? 1} slide{(d.project?.slides?.length ?? 1) === 1 ? "" : "s"}
                      {" · "}{friendlyTimeAgo(d.updatedAt)}
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="primary" style={{ flex: 1, fontSize: 11, padding: "4px 0" }}
                        onClick={() => onLoad(d.id)}>Open</button>
                      <button className="ghost" style={{ fontSize: 11, padding: "4px 8px" }}
                        title="Duplicate" onClick={() => onDuplicate(d.id)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="8" y="8" width="12" height="12" rx="2"/>
                          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>
                        </svg>
                      </button>
                      <button className="ghost" style={{ fontSize: 11, padding: "4px 8px", color: "#EF4444" }}
                        title="Delete" onClick={() => setConfirmDelete(d.id)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/>
                        </svg>
                      </button>
                    </div>

                    {confirmDelete === d.id && (
                      <div style={{ marginTop: 8, padding: "8px", background: "#FEF2F2", borderRadius: 6 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: "#EF4444" }}>Delete?</div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="ghost" style={{ flex: 1, fontSize: 11 }}
                            onClick={() => setConfirmDelete(null)}>Cancel</button>
                          <button style={{ flex: 1, fontSize: 11, background: "#EF4444", color: "#fff",
                            border: "none", borderRadius: 6, cursor: "pointer", padding: "4px 0" }}
                            onClick={() => { onRemove(d.id); setConfirmDelete(null); }}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            {store.drafts.length} draft{store.drafts.length === 1 ? "" : "s"} on this device
          </div>
          <button className="primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
