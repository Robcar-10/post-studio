"use client";
import { type ChangeEvent } from "react";
import type { Template, BrandVoice, Project } from "@/lib/types";
import { BRAND, SIZE_OPTIONS } from "@/lib/brand";
import { CollapsibleSection } from "./CollapsibleSection";
import { AIPanel } from "./panels/AIPanel";
import { CarouselPanel } from "./panels/CarouselPanel";

interface Props {
  rightCollapsed: boolean;
  setRightCollapsed: (v: boolean) => void;

  // slide info
  tpl: Template;
  activeIdx: number;
  values: Record<string, unknown>;
  variantId: string;
  theme: string;
  accent: string;
  gradient: boolean;
  fontScale: number;

  // setters
  setVariantId: (id: string) => void;
  setTheme: (v: string) => void;
  setAccent: (v: string) => void;
  setGradient: (v: boolean) => void;
  setFontScale: (v: number) => void;
  setValue: (key: string, val: unknown) => void;

  // project
  project: Project;
  setProject: (fn: (prev: Project) => Project, opts?: { batch?: boolean }) => void;
  activeTpl: string;

  // AI
  brandVoice: BrandVoice;
  aiBusy: boolean;
  setAiBusy: (v: boolean) => void;
  setStatus: (s: string) => void;
  applyAllValues: (patch: Record<string, unknown>) => void;
  generateCarousel: (prompt: string, count: number) => void;

  // caption
  copyFx: string;
  setCopyFx: (s: string) => void;
  aiCaption: () => void;

  // export
  exportCurrent: () => void;
  exportCurrentMultiSize: () => void;
  exportCarousel: () => void;
  slides: import("@/lib/types").Slide[];
}

export function ControlsRail({
  rightCollapsed, setRightCollapsed,
  tpl, activeIdx, values, variantId, theme, accent, gradient, fontScale,
  setVariantId, setTheme, setAccent, setGradient, setFontScale, setValue,
  project, setProject, activeTpl,
  brandVoice, aiBusy, setAiBusy, setStatus, applyAllValues,
  generateCarousel, copyFx, setCopyFx, aiCaption,
  exportCurrent, exportCurrentMultiSize, exportCarousel, slides,
}: Props) {
  const size = { w: 1080, h: 1350, label: "IG Portrait", short: "4:5" }; // placeholder; actual size passed via context

  const handleImageUpload = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setValue(key, reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <aside className="controls">

      {/* Slide header */}
      <div className="ctl-section">
        <div className="ctl-h">
          <div>
            <div className="ctl-title">Slide {activeIdx + 1} · {tpl.name}</div>
            <div className="ctl-sub">{tpl.description}</div>
          </div>
        </div>
      </div>

      {/* Carousel generator — only shown when carousel tpl is active */}
      {activeTpl === "carousel" && (
        <CollapsibleSection id="cg" title="Carousel generator" defaultOpen={slides.length <= 1} badge="AI">
          <CarouselPanel onGenerate={generateCarousel} aiBusy={aiBusy}/>
        </CollapsibleSection>
      )}

      {/* Content fields */}
      <CollapsibleSection id="content" title="Content" defaultOpen>
        {tpl.fields.map((f) => (
          <div key={f.key} className="field">
            <label>{f.label}</label>
            {f.kind === "textarea" ? (
              <textarea
                value={(values[f.key] ?? tpl.defaults[f.key] ?? "") as string}
                onChange={(e) => setValue(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            ) : f.kind === "image" ? (
              <div className="img-field">
                {values[f.key] ? (
                  <div className="img-preview">
                    <img src={values[f.key] as string} alt=""/>
                    <button onClick={() => setValue(f.key, null)}>Remove</button>
                  </div>
                ) : (
                  <label className="upload-btn">
                    Drop or click to upload
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(f.key, e)}/>
                  </label>
                )}
              </div>
            ) : f.kind === "number" ? (
              <input
                type="number" min={f.min} max={f.max}
                value={(values[f.key] ?? tpl.defaults[f.key] ?? "") as number}
                onChange={(e) => setValue(f.key, +e.target.value)}
              />
            ) : (
              <input
                type="text"
                value={(values[f.key] ?? tpl.defaults[f.key] ?? "") as string}
                onChange={(e) => setValue(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            )}
          </div>
        ))}
      </CollapsibleSection>

      {/* Caption */}
      <CollapsibleSection
        id="caption" title="Caption" defaultOpen
        badge={project.caption ? String(project.caption.length) : undefined}
      >
        <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.45, marginBottom: 10 }}>
          Written once per post — used when you upload to Instagram. Never rendered inside any slide.
        </div>
        <textarea
          value={project.caption}
          onChange={(e) => setProject((prev) => ({ ...prev, caption: e.target.value }), { batch: true })}
          placeholder="Write your caption here, or hit 'Write caption' to draft one from all your slides…"
          rows={7}
          style={{
            width: "100%", border: "1px solid var(--border)", borderRadius: 8,
            padding: "10px 12px", fontFamily: "inherit", fontSize: 13, lineHeight: 1.45,
            color: "var(--fg)", background: "#fff", resize: "vertical",
          }}
        />
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <button className="ghost" style={{ flex: 1 }} disabled={aiBusy} onClick={aiCaption}>
            {aiBusy ? "Thinking…" : "Write caption"}
          </button>
          <button
            className="ghost" style={{ flex: 1 }}
            disabled={!project.caption}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(project.caption);
                setCopyFx("Copied!");
                setTimeout(() => setCopyFx(""), 1800);
              } catch { setCopyFx("Copy failed"); setTimeout(() => setCopyFx(""), 1800); }
            }}
          >
            {copyFx || "Copy caption"}
          </button>
        </div>
        {project.caption && (
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 8, textAlign: "right", fontWeight: 600 }}>
            {project.caption.length} chars · {project.caption.split(/\s+/).filter(Boolean).length} words
          </div>
        )}
      </CollapsibleSection>

      {/* Layout variant */}
      <CollapsibleSection id="layout" title="Layout variant" defaultOpen={false}>
        <div className="seg">
          {tpl.variants.map((v) => (
            <button key={v.id} className={`seg-b ${v.id === variantId ? "on" : ""}`}
              onClick={() => setVariantId(v.id)}>
              {v.name}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Look */}
      <CollapsibleSection id="look" title="Look · theme, accent, size" defaultOpen={false}>
        <div className="ctl-label">Theme</div>
        <div className="seg">
          <button className={`seg-b ${theme === "dark" ? "on" : ""}`} onClick={() => setTheme("dark")}>Dark</button>
          <button className={`seg-b ${theme === "light" ? "on" : ""}`} onClick={() => setTheme("light")}>Light</button>
          <button className={`seg-b ${theme === "cream" ? "on" : ""}`} onClick={() => setTheme("cream")}>Cream</button>
        </div>

        <div className="ctl-label" style={{ marginTop: 16 }}>Accent</div>
        <div className="seg">
          <button className={`seg-b ${accent === "purple" ? "on" : ""}`} onClick={() => setAccent("purple")}>
            <span className="dot" style={{ background: BRAND.purple }}/> Purple
          </button>
          <button className={`seg-b ${accent === "coral" ? "on" : ""}`} onClick={() => setAccent("coral")}>
            <span className="dot" style={{ background: BRAND.coral }}/> Coral
          </button>
        </div>

        <label className="toggle" style={{ marginTop: 12 }}>
          <input type="checkbox" checked={gradient} onChange={(e) => setGradient(e.target.checked)}/>
          <span>Gradient on accents</span>
        </label>

        <div className="ctl-label" style={{ marginTop: 16 }}>
          Text size · {Math.round(fontScale * 100)}%
        </div>
        <input type="range" min="0.7" max="1.4" step="0.05" value={fontScale}
          onChange={(e) => setFontScale(parseFloat(e.target.value))} className="slider"/>
        <div className="slider-marks"><span>Smaller</span><span>Default</span><span>Larger</span></div>
      </CollapsibleSection>

      {/* AI copywriting */}
      <CollapsibleSection id="ai" title="AI copywriting" defaultOpen={false} badge="AI">
        <AIPanel
          tpl={tpl}
          values={values}
          size={size}
          brandVoice={brandVoice}
          applyAll={applyAllValues}
          applyOne={setValue}
          aiBusy={aiBusy}
          setAiBusy={setAiBusy}
          setStatus={setStatus}
        />
      </CollapsibleSection>

      {/* Export */}
      <CollapsibleSection id="export" title="Export" defaultOpen={false} className="export">
        <button className="primary big" onClick={exportCurrent}>
          Download PNG · {SIZE_OPTIONS.find((s) => s.key === project.sizeKey)?.short || ""}
        </button>

        <div className="ctl-label" style={{ marginTop: 14 }}>Or multiple sizes</div>
        <div className="size-checks">
          {SIZE_OPTIONS.map((s) => (
            <label key={s.key} className="check">
              <input
                type="checkbox"
                checked={project.exportSizes.includes(s.key)}
                onChange={(e) => {
                  setProject((prev) => ({
                    ...prev,
                    exportSizes: e.target.checked
                      ? [...prev.exportSizes, s.key]
                      : prev.exportSizes.filter((x) => x !== s.key),
                  }));
                }}
              />
              <span>{s.label} <em>{s.short}</em></span>
            </label>
          ))}
        </div>
        <button className="primary" disabled={project.exportSizes.length === 0} onClick={exportCurrentMultiSize}>
          Export {project.exportSizes.length} size{project.exportSizes.length === 1 ? "" : "s"}
          {project.exportSizes.length > 1 ? " as ZIP" : ""}
        </button>

        <div className="ctl-label" style={{ marginTop: 20 }}>Export this post</div>
        <button className="primary" onClick={exportCarousel} disabled={slides.length < 1}>
          Export {slides.length}-slide {tpl.name} post (ZIP)
        </button>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>
          All slides at {SIZE_OPTIONS.find((s) => s.key === project.sizeKey)?.short}{project.caption ? ", plus caption.txt" : ""} — ready for Instagram.
        </div>
      </CollapsibleSection>
    </aside>
  );
}
