"use client";
import { useEffect } from "react";
import { SIZES, SIZE_OPTIONS } from "@/lib/brand";
import type { SizeKey } from "@/lib/brand";
import { useUIStore } from "@/store/uiStore";

interface Props {
  sizeKey: string;
  sizePopOpen: boolean;
  setSizePopOpen: (v: boolean) => void;
  setSizeKey: (k: string) => void;
  stageScale: number;
  showSafeZones: boolean;
  setShowSafeZones: (v: boolean) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onBrandVoice: () => void;
  onDrafts: () => void;
  draftCount: number;
}

export function CanvasTopBar({
  sizeKey, sizePopOpen, setSizePopOpen, setSizeKey,
  stageScale, showSafeZones, setShowSafeZones,
  canUndo, canRedo, onUndo, onRedo,
  onBrandVoice, onDrafts, draftCount,
}: Props) {
  const size = SIZES[sizeKey as SizeKey];
  const { leftCollapsed, setLeftCollapsed, rightCollapsed, setRightCollapsed } = useUIStore();

  // Close popover on outside click
  useEffect(() => {
    if (!sizePopOpen) return;
    const handler = () => setSizePopOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [sizePopOpen, setSizePopOpen]);

  const shapeW = Math.max(10, Math.round(16 * Math.min(1, size.w / Math.max(size.w, size.h))));
  const shapeH = Math.max(10, Math.round(16 * Math.min(1, size.h / Math.max(size.w, size.h))));

  return (
    <div className="canvas-top">
      <div className="ct-left">
        <button
          className="hamburger-btn"
          onClick={() => setLeftCollapsed(!leftCollapsed)}
          title="Toggle sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <button
          className={`size-trigger ${sizePopOpen ? "open" : ""}`}
          onClick={(e) => { e.stopPropagation(); setSizePopOpen(!sizePopOpen); }}
          title="Change canvas size"
        >
          <div className="size-trigger-icon">
            <div style={{ width: shapeW, height: shapeH, background: "#fff", borderRadius: 2 }}/>
          </div>
          <div className="size-trigger-text">
            <b>{size.label}</b>
            <span>{size.short} · {size.w}×{size.h}</span>
          </div>
          <svg className="size-trigger-chev" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {sizePopOpen && (
          <div className="size-pop" onClick={(e) => e.stopPropagation()}>
            <div className="size-pop-head">
              Canvas size <em>Instagram · Facebook · Google</em>
            </div>
            <div className="size-pop-grid">
              {SIZE_OPTIONS.map((s) => {
                const maxDim = Math.max(s.w, s.h);
                const sw = Math.max(10, Math.round(24 * s.w / maxDim));
                const sh = Math.max(10, Math.round(28 * s.h / maxDim));
                return (
                  <button
                    key={s.key}
                    className={`size-opt ${s.key === sizeKey ? "on" : ""}`}
                    onClick={() => { setSizeKey(s.key); setSizePopOpen(false); }}
                  >
                    <div className="size-opt-shape">
                      <div style={{ width: sw, height: sh }}/>
                    </div>
                    <div className="size-opt-text">
                      <b>{s.label}</b>
                      <span>{s.short} · {s.w}×{s.h}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="zoom-info">
          <em>{Math.round(stageScale * 100)}%</em>
        </div>
      </div>

      <div className="ct-right">
        <button
          className={`tool-btn ${showSafeZones ? "on" : ""}`}
          onClick={() => setShowSafeZones(!showSafeZones)}
          title="Toggle safe zones + rule of thirds"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="1"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
          Safe zones
        </button>

        <div style={{ width: 1, height: 22, background: "var(--border)", margin: "0 2px" }}/>

        <button className="tool-btn" onClick={onUndo} disabled={!canUndo} title="Undo (⌘Z)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 3-7"/>
          </svg>
          Undo
        </button>
        <button className="tool-btn" onClick={onRedo} disabled={!canRedo} title="Redo (⌘⇧Z)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 7v6h-6"/><path d="M21 13a9 9 0 1 1-3-7"/>
          </svg>
          Redo
        </button>

        <div style={{ width: 1, height: 22, background: "var(--border)", margin: "0 2px" }}/>

        <button className="tool-btn" onClick={onBrandVoice} title="Brand voice settings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l2.39 4.84L20 8l-4 3.9L17 18l-5-2.6L7 18l1-6.1L4 8l5.61-1.16z"/>
          </svg>
          Brand voice
        </button>
        <button className="tool-btn" onClick={onDrafts} title="Your saved drafts">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          Drafts
          {draftCount > 0 && (
            <span style={{
              background: "var(--purple)", color: "#fff", borderRadius: 999,
              padding: "1px 7px", fontSize: 10, fontWeight: 800, marginLeft: 2,
            }}>{draftCount}</span>
          )}
        </button>

        <div style={{ width: 1, height: 22, background: "var(--border)", margin: "0 2px" }}/>

        <button
          className="hamburger-btn"
          onClick={() => setRightCollapsed(!rightCollapsed)}
          title="Toggle controls panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
