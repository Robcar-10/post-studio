"use client";
import { useState, useEffect, useRef } from "react";
import type { FieldStyle } from "@/lib/types";

const FONT_PRESETS = [
  { id: "display", label: "Display · Work Sans",  stack: '"Work Sans", system-ui, sans-serif',     weight: 900 },
  { id: "body",    label: "Body · Inter",          stack: '"Inter", system-ui, sans-serif',          weight: 700 },
  { id: "label",   label: "Label · Montserrat",    stack: '"Montserrat", "Inter", sans-serif',       weight: 800 },
  { id: "mono",    label: "Mono · Menlo",           stack: "Menlo, Consolas, monospace",              weight: 600 },
  { id: "serif",   label: "Serif · Georgia",        stack: 'Georgia, "Times New Roman", serif',       weight: 600 },
];

const WEIGHT_OPTIONS = [
  { v: 300, label: "Light" }, { v: 400, label: "Regular" }, { v: 600, label: "Semibold" },
  { v: 700, label: "Bold" }, { v: 800, label: "Heavy" }, { v: 900, label: "Black" },
];

const CASE_OPTIONS = [
  { id: "none", icon: "Aa", label: "Normal" }, { id: "upper", icon: "AA", label: "Upper" },
  { id: "lower", icon: "aa", label: "Lower" }, { id: "title", icon: "Aa", label: "Title" },
];

const COLOR_SWATCHES = [
  "#160028", "#FFFFFF", "#F6F4EF", "#FAF8F2",
  "#B221F6", "#FF6452", "#10B981", "#F59E0B",
  "#6B7280", "#374151", "#EF4444", "#3B82F6",
];

interface ToolbarProps {
  fieldKey: string;
  fieldStyle: FieldStyle | null;
  setFieldStyle: (key: string, s: FieldStyle | null) => void;
  stageRect: DOMRect;
  targetRect: DOMRect;
  onClose: () => void;
}

function TextStyleToolbar({ fieldKey, fieldStyle, setFieldStyle, stageRect, targetRect }: ToolbarProps) {
  const [pickerOpen, setPickerOpen] = useState<"font" | "color" | null>(null);
  const style = fieldStyle || {};
  const TOOLBAR_W = 520;
  const TOOLBAR_H = 42;

  const left = Math.max(12, Math.min(
    (targetRect.left - stageRect.left) + targetRect.width / 2 - TOOLBAR_W / 2,
    stageRect.width - TOOLBAR_W - 12,
  ));
  const topRaw = (targetRect.top - stageRect.top) - TOOLBAR_H - 14;
  const top = topRaw < 8 ? (targetRect.bottom - stageRect.top) + 14 : topRaw;

  const set = (patch: Partial<FieldStyle>) => setFieldStyle(fieldKey, { ...style, ...patch });
  const reset = () => setFieldStyle(fieldKey, null);
  const activeFont = FONT_PRESETS.find((f) => f.id === style.font);

  return (
    <div className="tt-wrap" style={{ left, top, width: TOOLBAR_W }} onClick={(e) => e.stopPropagation()}>
      <div className="tt-bar">
        <button
          className={`tt-btn font ${pickerOpen === "font" ? "on" : ""}`}
          onClick={() => setPickerOpen(pickerOpen === "font" ? null : "font")}
        >
          <span className="tt-font-label" style={activeFont ? { fontFamily: activeFont.stack } : {}}>
            {activeFont ? activeFont.label.split(" · ")[0] : "Font"}
          </span>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <div className="tt-sep"/>

        <select className="tt-select" value={style.weight || ""}
          onChange={(e) => set({ weight: e.target.value ? +e.target.value : undefined })}>
          <option value="">Weight</option>
          {WEIGHT_OPTIONS.map((w) => <option key={w.v} value={w.v}>{w.label}</option>)}
        </select>

        <div className="tt-sep"/>

        <div className="tt-group">
          {(["left", "center", "right"] as const).map((a) => (
            <button key={a} className={`tt-btn sq ${style.align === a ? "on" : ""}`}
              title={a.charAt(0).toUpperCase() + a.slice(1)}
              onClick={() => set({ align: style.align === a ? undefined : a })}>
              {a === "left" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>}
              {a === "center" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>}
              {a === "right" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>}
            </button>
          ))}
        </div>

        <div className="tt-sep"/>

        <div className="tt-group">
          {CASE_OPTIONS.map((c) => (
            <button key={c.id}
              className={`tt-btn sq txt ${style.case === c.id || (!style.case && c.id === "none") ? "on" : ""}`}
              title={c.label}
              onClick={() => set({ case: c.id === "none" ? undefined : c.id as FieldStyle["case"] })}>
              <span style={{ textTransform: c.id === "upper" ? "uppercase" : c.id === "lower" ? "lowercase" : "none" }}>
                {c.icon}
              </span>
            </button>
          ))}
        </div>

        <div className="tt-sep"/>

        <button className={`tt-btn color ${pickerOpen === "color" ? "on" : ""}`}
          onClick={() => setPickerOpen(pickerOpen === "color" ? null : "color")}>
          <span className="tt-color-dot" style={{ background: style.color || "#888" }}/>
          <span>Color</span>
        </button>

        <div className="tt-sep"/>

        <button className="tt-btn reset" title="Clear overrides" onClick={reset}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/>
            <polyline points="3 3 3 8 8 8"/>
          </svg>
        </button>
      </div>

      {pickerOpen === "font" && (
        <div className="tt-pop">
          {FONT_PRESETS.map((f) => (
            <button key={f.id} className={`tt-opt ${style.font === f.id ? "on" : ""}`}
              style={{ fontFamily: f.stack }}
              onClick={() => { set({ font: f.id }); setPickerOpen(null); }}>
              {f.label}
            </button>
          ))}
          {style.font && (
            <button className="tt-opt clear" onClick={() => { set({ font: undefined }); setPickerOpen(null); }}>
              Clear font override
            </button>
          )}
        </div>
      )}

      {pickerOpen === "color" && (
        <div className="tt-pop color-pop">
          <div className="tt-swatches">
            {COLOR_SWATCHES.map((c) => (
              <button key={c} className={`tt-swatch ${style.color === c ? "on" : ""}`}
                style={{ background: c }}
                onClick={() => { set({ color: c }); setPickerOpen(null); }}/>
            ))}
          </div>
          <div className="tt-color-row">
            <input type="color" value={style.color || "#160028"}
              onChange={(e) => set({ color: e.target.value })}/>
            <input type="text" placeholder="#hex" value={style.color || ""}
              onChange={(e) => set({ color: e.target.value })}
              className="tt-hex"/>
            {style.color && (
              <button className="tt-btn mini" onClick={() => set({ color: undefined })}>Clear</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface HostProps {
  selectedKey: string | null;
  stageRef: React.RefObject<HTMLDivElement | null>;
  canvasInnerRef: React.RefObject<HTMLDivElement | null>;
  fieldStyles: Record<string, FieldStyle>;
  setFieldStyle: (key: string, s: FieldStyle | null) => void;
  setSelectedKey: (k: string | null) => void;
}

export function TextStyleToolbarHost({
  selectedKey, stageRef, canvasInnerRef, fieldStyles, setFieldStyle, setSelectedKey,
}: HostProps) {
  const [rects, setRects] = useState<{ stageRect: DOMRect; targetRect: DOMRect } | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!selectedKey || !stageRef.current) { setRects(null); return; }
    const inner = canvasInnerRef?.current || stageRef.current;

    const measure = () => {
      const candidate = inner.querySelector(`[data-field-key="${CSS.escape(selectedKey)}"]`);
      if (!candidate) { setRects(null); return; }
      const isText = candidate.matches(".rut-edit") || candidate.querySelector(".rut-edit");
      if (!isText) { setRects(null); return; }
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
    <TextStyleToolbar
      fieldKey={selectedKey}
      fieldStyle={fieldStyles[selectedKey] || null}
      setFieldStyle={setFieldStyle}
      stageRect={rects.stageRect}
      targetRect={rects.targetRect}
      onClose={() => setSelectedKey(null)}
    />
  );
}
