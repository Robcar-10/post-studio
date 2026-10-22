"use client";
import { useState, useEffect, useRef } from "react";
import type { Crop } from "@/lib/types";

const DEFAULT_CROP: Crop = { zoom: 1, x: 50, y: 50 };

const FOCAL_POINTS = [
  [0, 0], [50, 0], [100, 0],
  [0, 50], [50, 50], [100, 50],
  [0, 100], [50, 100], [100, 100],
] as const;

interface ToolbarProps {
  fieldKey: string;
  crop: Crop | null;
  setFieldCrop: (key: string, crop: Crop | null) => void;
  stageRect: DOMRect;
  targetRect: DOMRect;
  onSmartFit: (key: string) => void;
  aiBusy: boolean;
}

function ImageCropToolbar({ fieldKey, crop, setFieldCrop, stageRect, targetRect, onSmartFit, aiBusy }: ToolbarProps) {
  const c = { ...DEFAULT_CROP, ...(crop || {}) };
  const TOOLBAR_W = 420;
  const TOOLBAR_H = 42;

  const left = Math.max(12, Math.min(
    (targetRect.left - stageRect.left) + targetRect.width / 2 - TOOLBAR_W / 2,
    stageRect.width - TOOLBAR_W - 12,
  ));
  const topRaw = (targetRect.top - stageRect.top) - TOOLBAR_H - 14;
  const top = topRaw < 8 ? (targetRect.bottom - stageRect.top) + 14 : topRaw;

  const set = (patch: Partial<Crop>) => setFieldCrop(fieldKey, { ...c, ...patch });
  const reset = () => setFieldCrop(fieldKey, null);

  return (
    <div className="ic-wrap" style={{ left, top, width: TOOLBAR_W }} onClick={(e) => e.stopPropagation()}>
      <div className="ic-bar">
        <div className="ic-label">Zoom</div>
        <input type="range" className="ic-slider" min="1" max="4" step="0.05"
          value={c.zoom} onChange={(e) => set({ zoom: +e.target.value })}/>
        <span className="ic-val">{c.zoom.toFixed(2)}×</span>

        <div className="ic-sep"/>

        <div className="ic-pad" title="Focal point">
          {FOCAL_POINTS.map(([x, y]) => (
            <button key={`${x}-${y}`}
              className={`ic-pad-dot ${Math.abs(c.x - x) < 2 && Math.abs(c.y - y) < 2 ? "on" : ""}`}
              onClick={() => set({ x, y })}
              title={`${x}%, ${y}%`}
            />
          ))}
        </div>

        <div className="ic-sep"/>

        <button className="ic-btn ai" disabled={aiBusy} onClick={() => onSmartFit(fieldKey)}
          title="AI: best crop for this template slot">
          {aiBusy ? "…" : "Smart fit"}
        </button>

        <div className="ic-sep"/>

        <button className="ic-btn reset" onClick={reset} title="Reset crop">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/>
            <polyline points="3 3 3 8 8 8"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

interface HostProps {
  selectedKey: string | null;
  stageRef: React.RefObject<HTMLDivElement | null>;
  canvasInnerRef: React.RefObject<HTMLDivElement | null>;
  crops: Record<string, Crop>;
  setFieldCrop: (key: string, crop: Crop | null) => void;
  onSmartFit: (key: string) => void;
  aiBusy: boolean;
}

export function ImageCropToolbarHost({
  selectedKey, stageRef, canvasInnerRef, crops, setFieldCrop, onSmartFit, aiBusy,
}: HostProps) {
  const [rects, setRects] = useState<{ stageRect: DOMRect; targetRect: DOMRect } | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!selectedKey || !stageRef.current) { setRects(null); return; }
    const inner = canvasInnerRef?.current || stageRef.current;

    const measure = () => {
      const candidate = inner.querySelector(`[data-field-key="${CSS.escape(selectedKey)}"]`);
      if (!candidate) { setRects(null); return; }
      // Only show for image fields — look for img or .rut-img-placeholder
      const isImage = candidate.matches("img, .rut-img-placeholder")
        || candidate.querySelector("img, .rut-img-placeholder");
      if (!isImage) { setRects(null); return; }
      const stageRect = stageRef.current!.getBoundingClientRect();
      const targetRect = candidate.getBoundingClientRect();
      setRects({ stageRect, targetRect });
    };

    const loop = () => { measure(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [selectedKey, stageRef, canvasInnerRef]);

  if (!selectedKey || !rects) return null;

  return (
    <ImageCropToolbar
      fieldKey={selectedKey}
      crop={crops[selectedKey] || null}
      setFieldCrop={setFieldCrop}
      stageRect={rects.stageRect}
      targetRect={rects.targetRect}
      onSmartFit={onSmartFit}
      aiBusy={aiBusy}
    />
  );
}
