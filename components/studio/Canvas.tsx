"use client";
import { useRef, useEffect, type ReactNode } from "react";
import type { Slide, CanvasSize, FieldStyle, Crop, SnapLine } from "@/lib/types";
import { CanvasTopBar } from "./CanvasTopBar";
import { Filmstrip, renderSlideThumb } from "./Filmstrip";
import { SafeZones } from "./overlays/SafeZones";
import { TextStyleToolbarHost } from "./toolbars/TextToolbar";
import { ImageCropToolbarHost } from "./toolbars/ImageCropToolbar";

interface Props {
  // canvas state
  size: CanvasSize;
  sizeKey: string;
  stageScale: number;
  setStageScale: (v: number) => void;

  // template render
  renderActive: (opts: { editable: boolean; stageScale: number }) => ReactNode;

  // slides / filmstrip
  slides: Slide[];
  activeIdx: number;
  setActiveIdx: (i: number) => void;
  activeTplName: string;
  onAddSlide: () => void;
  onDuplicateSlide: (i: number) => void;
  onDeleteSlide: (i: number) => void;
  onReorderSlides: (from: number, to: number) => void;

  // top bar
  sizePopOpen: boolean;
  setSizePopOpen: (v: boolean) => void;
  setSizeKey: (k: string) => void;
  showSafeZones: boolean;
  setShowSafeZones: (v: boolean) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onBrandVoice: () => void;
  onDrafts: () => void;
  draftCount: number;

  // toolbars
  selectedKey: string | null;
  setSelectedKey: (k: string | null) => void;
  setEditKey: (k: string | null) => void;
  fieldStyles: Record<string, FieldStyle>;
  crops: Record<string, Crop>;
  setFieldStyle: (key: string, s: FieldStyle | null) => void;
  setFieldCrop: (key: string, crop: Crop | null) => void;
  onSmartFit: (key: string) => void;
  aiBusy: boolean;

  // snap
  snapLines: SnapLine[];

  // status
  status: string;
}

export function Canvas({
  size, sizeKey, stageScale, setStageScale,
  renderActive,
  slides, activeIdx, setActiveIdx, activeTplName,
  onAddSlide, onDuplicateSlide, onDeleteSlide, onReorderSlides,
  sizePopOpen, setSizePopOpen, setSizeKey,
  showSafeZones, setShowSafeZones,
  canUndo, canRedo, onUndo, onRedo, onBrandVoice, onDrafts, draftCount,
  selectedKey, setSelectedKey, setEditKey,
  fieldStyles, crops, setFieldStyle, setFieldCrop, onSmartFit, aiBusy,
  snapLines, status,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasInnerRef = useRef<HTMLDivElement>(null);

  // Recompute scale whenever size changes or stage is resized
  useEffect(() => {
    let raf = 0;
    const fit = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!stageRef.current) return;
        const r = stageRef.current.getBoundingClientRect();
        if (r.width < 10 || r.height < 10) return; // skip during collapse transition
        const pad = 32;
        const s = Math.min((r.width - pad * 2) / size.w, (r.height - pad * 2) / size.h, 1);
        if (s > 0) setStageScale(s);
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", fit);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("resize", fit); };
  }, [size.w, size.h, setStageScale]);

  const onCanvasBgClick = () => { setEditKey(null); setSelectedKey(null); };

  return (
    <main className="canvas-area">
      <CanvasTopBar
        sizeKey={sizeKey}
        sizePopOpen={sizePopOpen}
        setSizePopOpen={setSizePopOpen}
        setSizeKey={setSizeKey}
        stageScale={stageScale}
        showSafeZones={showSafeZones}
        setShowSafeZones={setShowSafeZones}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        onBrandVoice={onBrandVoice}
        onDrafts={onDrafts}
        draftCount={draftCount}
      />

      <div className="canvas-stage" ref={stageRef} onClick={onCanvasBgClick}>
        <div className="canvas-wrap" style={{ width: size.w * stageScale, height: size.h * stageScale }}>
          <div
            ref={canvasInnerRef}
            className="canvas-inner"
            style={{
              width: size.w, height: size.h,
              transform: `scale(${stageScale})`, transformOrigin: "0 0",
              background: "#fff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderActive({ editable: true, stageScale })}
            <SafeZones size={size} sizeKey={sizeKey} show={showSafeZones}/>
          </div>
        </div>

        <TextStyleToolbarHost
          selectedKey={selectedKey}
          stageRef={stageRef}
          canvasInnerRef={canvasInnerRef}
          fieldStyles={fieldStyles}
          setFieldStyle={setFieldStyle}
          setSelectedKey={setSelectedKey}
        />
        <ImageCropToolbarHost
          selectedKey={selectedKey}
          stageRef={stageRef}
          canvasInnerRef={canvasInnerRef}
          crops={crops}
          setFieldCrop={setFieldCrop}
          onSmartFit={onSmartFit}
          aiBusy={aiBusy}
        />
      </div>

      <Filmstrip
        slides={slides}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
        onAdd={onAddSlide}
        onDuplicate={onDuplicateSlide}
        onDelete={onDeleteSlide}
        onReorder={onReorderSlides}
        groupLabel={`${activeTplName} · ${slides.length} slide${slides.length === 1 ? "" : "s"}`}
        renderThumb={(s) => renderSlideThumb(s)}
      />

      {status && <div className="status-toast">{status}</div>}
    </main>
  );
}
