"use client";
import { useRef, useState, type ReactNode } from "react";
import type { Slide } from "@/lib/types";
import { SIZES } from "@/lib/brand";
import { TEMPLATES } from "@/components/templates";

const THUMB_W = 140;
const THUMB_SRC_W = 1080;
const THUMB_SRC_H = 1350;
const THUMB_SCALE = THUMB_W / THUMB_SRC_W;

interface Props {
  slides: Slide[];
  activeIdx: number;
  setActiveIdx: (i: number) => void;
  onAdd: () => void;
  onDuplicate: (i: number) => void;
  onDelete: (i: number) => void;
  onReorder: (from: number, to: number) => void;
  groupLabel: string;
  renderThumb: (s: Slide, i: number) => ReactNode;
}

export function Filmstrip({
  slides, activeIdx, setActiveIdx, onAdd, onDuplicate, onDelete, onReorder, groupLabel, renderThumb,
}: Props) {
  const [menuIdx, setMenuIdx] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);

  const handleDragStart = (i: number) => { dragFrom.current = i; };
  const handleDrop = (i: number) => {
    if (dragFrom.current !== null && dragFrom.current !== i) {
      onReorder(dragFrom.current, i);
    }
    dragFrom.current = null;
  };

  return (
    <div className="filmstrip">
      <div className="film-label">{groupLabel}</div>
      <div className="film-track">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`film-thumb ${i === activeIdx ? "active" : ""}`}
            onClick={() => { setActiveIdx(i); setMenuIdx(null); }}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
          >
            <div style={{
              position: "relative",
              width: THUMB_W,
              height: Math.round(THUMB_SRC_H * THUMB_SCALE),
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                width: THUMB_SRC_W,
                height: THUMB_SRC_H,
                transform: `scale(${THUMB_SCALE})`,
                transformOrigin: "0 0",
                pointerEvents: "none",
              }}>
                {renderThumb(s, i)}
              </div>
            </div>
            <div className="film-idx">{i + 1}</div>
            <button
              className="film-menu-btn"
              onClick={(e) => { e.stopPropagation(); setMenuIdx(menuIdx === i ? null : i); }}
              title="Slide options"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
            {menuIdx === i && (
              <div className="film-menu" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => { onDuplicate(i); setMenuIdx(null); }}>Duplicate</button>
                <button
                  onClick={() => { onDelete(i); setMenuIdx(null); }}
                  disabled={slides.length <= 1}
                >Delete</button>
              </div>
            )}
          </div>
        ))}
        <button className="film-add" onClick={onAdd} title="Add slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Standalone helper: render a slide into a thumbnail without edit controls
export function renderSlideThumb(slide: Slide): ReactNode {
  const tpl = TEMPLATES.find((t) => t.id === slide.tplId) || TEMPLATES[0];
  const v = slide.valuesByTpl[slide.tplId] || {};
  return tpl.render({
    values: { ...tpl.defaults, ...v },
    variant: slide.variantId,
    theme: slide.theme,
    accent: slide.accent,
    gradient: slide.gradient,
    size: SIZES.ig_portrait,
    fontScale: slide.fontScale,
    scales: (v.__scales as Record<string, number>) || {},
    positions: (v.__positions as Record<string, { x: number; y: number }>) || {},
    styles: (v.__styles as Record<string, import("@/lib/types").FieldStyle>) || {},
    crops: (v.__crops as Record<string, import("@/lib/types").Crop>) || {},
  });
}
