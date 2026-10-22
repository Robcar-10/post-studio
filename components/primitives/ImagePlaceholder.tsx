"use client";
import { useRef, useEffect, useState, type CSSProperties } from "react";
import { BRAND, FONT_BODY, FONT_EYEBROW } from "@/lib/brand";
import { cropToImgStyle } from "./cropUtils";
import type { Crop } from "@/lib/types";

interface Props {
  src?: string | null;
  label?: string;
  style?: CSSProperties;
  onSelect?: (dataUrl: string) => void;
  hintW?: number;
  hintH?: number;
  crop?: Crop | null;
  fieldKey?: string;
}

export function ImagePlaceholder({ src, label = "Drop or click to add image", style = {}, onSelect, hintW, hintH, crop, fieldKey }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState({ w: hintW, h: hintH });

  useEffect(() => {
    if (hintW && hintH) return;
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    if (r.width && r.height) setMeasured({ w: Math.round(r.width), h: Math.round(r.height) });
  }, [src, hintW, hintH]);

  const handleFile = (file: File | undefined) => {
    if (!file || !onSelect) return;
    const reader = new FileReader();
    reader.onload = () => onSelect(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (src) {
    return (
      <div
        ref={wrapRef}
        className="rut-img-wrap"
        data-field-key={fieldKey}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
        style={{ position: "relative", overflow: "hidden", ...style }}
      >
        <img src={src} style={cropToImgStyle(crop)} alt=""/>
        <div
          className="rut-img-replace"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          ⇆ Replace · best at {measured.w}×{measured.h}
        </div>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0])}/>
      </div>
    );
  }

  const labelSize = Math.max(16, ((style.height as number) || 200) * 0.045);
  return (
    <div
      ref={wrapRef}
      data-field-key={fieldKey}
      onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
      onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.background = "rgba(178,33,246,0.18)"; }}
      onDragLeave={(e) => { e.currentTarget.style.background = "rgba(178,33,246,0.06)"; }}
      onDrop={(e) => { e.preventDefault(); e.currentTarget.style.background = "rgba(178,33,246,0.06)"; handleFile(e.dataTransfer.files?.[0]); }}
      style={{
        border: `4px dashed ${BRAND.lavender700}`,
        background: "rgba(178,33,246,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 14, cursor: "pointer",
        color: BRAND.lavender700, fontFamily: FONT_BODY, fontWeight: 700,
        textAlign: "center", padding: 24,
        ...style,
      }}
    >
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
      <div style={{ fontSize: labelSize, lineHeight: 1.2 }}>{label}</div>
      <div style={{
        fontFamily: FONT_EYEBROW, fontWeight: 800, fontSize: Math.max(13, labelSize * 0.65),
        letterSpacing: 2, textTransform: "uppercase", padding: "8px 14px",
        background: BRAND.lavender700, color: "#fff", borderRadius: 999,
      }}>Crop to {measured.w} × {measured.h}px</div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}/>
    </div>
  );
}
