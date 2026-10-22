"use client";
import { useRef, useState, type ReactNode } from "react";

interface Props {
  fieldKey: string;
  editable?: boolean;
  selectedKey?: string | null;
  setSelectedKey?: (k: string | null) => void;
  scale?: number;
  pos?: { x: number; y: number } | null;
  onScaleChange?: (key: string, val: number) => void;
  onPosChange?: (key: string, pos: { x: number; y: number }) => void;
  mode?: "inline" | "fill" | "image";
  children: ReactNode;
  stageScale?: number;
}

export function Resizable({
  fieldKey, editable, selectedKey, setSelectedKey,
  scale = 1, pos = null, onScaleChange, onPosChange,
  mode = "inline", children, stageScale = 1,
}: Props) {
  const wrapRef = useRef<HTMLSpanElement & HTMLDivElement>(null);
  const startRef = useRef<{ startDist: number; startScale: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const tx = pos?.x || 0;
  const ty = pos?.y || 0;

  if (!editable) {
    const hasTransform = scale !== 1 || tx || ty;
    const style = hasTransform ? {
      display: mode === "inline" ? "inline-block" : "block",
      transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      transformOrigin: "center center",
    } : {};
    if (mode === "fill" || mode === "image") {
      return <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>;
    }
    return <span style={style}>{children}</span>;
  }

  const selected = selectedKey === fieldKey;

  const onHandle = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedKey?.(fieldKey);
    const rect = wrapRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const startDist = Math.hypot(e.clientX - cx, e.clientY - cy);
    startRef.current = { startDist, startScale: scale };

    const move = (ev: PointerEvent) => {
      const d = Math.hypot(ev.clientX - cx, ev.clientY - cy);
      const ratio = d / Math.max(8, startRef.current!.startDist);
      const next = Math.max(0.3, Math.min(3.5, startRef.current!.startScale * ratio));
      onScaleChange?.(fieldKey, Math.round(next * 100) / 100);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onClick = (e: React.MouseEvent) => { e.stopPropagation(); setSelectedKey?.(fieldKey); };

  const onDblClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".rut-edit")) return;
    e.stopPropagation();
    e.preventDefault();
    onScaleChange?.(fieldKey, 1);
    onPosChange?.(fieldKey, { x: 0, y: 0 });
  };

  const onBodyPointerDown = (e: React.PointerEvent) => {
    if (!selected) return;
    if ((e.target as HTMLElement).closest(".rut-handle")) return;
    if ((e.target as HTMLElement).closest(".rut-edit.is-editing")) return;
    if ((e.target as HTMLElement).closest("input, textarea")) return;
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { x: tx, y: ty };
    let moved = false;
    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / Math.max(0.05, stageScale);
      const dy = (ev.clientY - startY) / Math.max(0.05, stageScale);
      if (!moved && Math.hypot(dx, dy) < 3) return;
      moved = true;
      setDragging(true);
      onPosChange?.(fieldKey, { x: Math.round(startPos.x + dx), y: Math.round(startPos.y + dy) });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setDragging(false);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const wrapClass = `rut-resize rut-selectable ${selected ? "selected" : ""} ${mode} ${dragging ? "dragging" : ""}`;
  const inner = (
    <>
      {children}
      <div className="rut-sel-outline"/>
      {selected && (
        <div className="rut-size-pill">
          {Math.round(scale * 100)}%{(tx || ty) ? `  ·  ${tx > 0 ? "+" : ""}${tx}, ${ty > 0 ? "+" : ""}${ty}` : ""}
        </div>
      )}
      {selected && (
        <>
          <div className="rut-handle tl" onPointerDown={onHandle}/>
          <div className="rut-handle tr" onPointerDown={onHandle}/>
          <div className="rut-handle bl" onPointerDown={onHandle}/>
          <div className="rut-handle br" onPointerDown={onHandle}/>
        </>
      )}
    </>
  );

  const hasTransform = scale !== 1 || tx || ty;
  const wrapStyle: React.CSSProperties = hasTransform ? {
    transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
    transformOrigin: "center center",
    ...(selected ? { cursor: dragging ? "grabbing" : "grab" } : {}),
  } : (selected ? { cursor: dragging ? "grabbing" : "grab" } : {});

  if (mode === "fill" || mode === "image") {
    return (
      <div
        ref={wrapRef as React.RefObject<HTMLDivElement>}
        className={wrapClass}
        style={{ position: "absolute", inset: 0, ...wrapStyle }}
        onPointerDown={onBodyPointerDown}
        onClick={onClick}
        onDoubleClick={onDblClick}
      >
        {inner}
      </div>
    );
  }
  return (
    <span
      ref={wrapRef as React.RefObject<HTMLSpanElement>}
      className={wrapClass}
      style={wrapStyle}
      onPointerDown={onBodyPointerDown}
      onClick={onClick}
      onDoubleClick={onDblClick}
    >
      {inner}
    </span>
  );
}
