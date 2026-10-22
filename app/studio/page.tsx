"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useUIStore } from "@/store/uiStore";
import { useHistoryState } from "@/hooks/useHistory";
import { TEMPLATES } from "@/components/templates";
import { SIZES } from "@/lib/brand";
import { aiComplete } from "@/lib/ai";
import { brandVoicePreamble, loadBrandVoice, saveBrandVoice, DEFAULT_BRAND_VOICE } from "@/lib/brandVoice";
import { generateCarouselCards } from "@/lib/carouselGenerator";
import {
  readDrafts, writeDrafts, makeDraftEntry, suggestDraftName, newDraftId,
  DRAFTS_KEY,
} from "@/lib/drafts";
import { exportCurrentSlide, exportMultiSize, exportCarouselZip } from "@/lib/exportPng";
import type { Project, Slide, BrandVoice, DraftStore, RenderContext, FieldStyle, Crop } from "@/lib/types";

import { Sidebar } from "@/components/studio/Sidebar";
import { Canvas } from "@/components/studio/Canvas";
import { ControlsRail } from "@/components/studio/ControlsRail";
import { BrandVoiceModal } from "@/components/studio/modals/BrandVoiceModal";
import { DraftsModal } from "@/components/studio/modals/DraftsModal";

// ─── Slide factory ──────────────────────────────────────────────────────────
let _slideId = 0;
function newSlideId() { return `s${Date.now().toString(36)}-${_slideId++}`; }
function makeSlide(partial: Partial<Slide> = {}): Slide {
  return {
    id: newSlideId(),
    tplId: "announcement",
    variantId: "centered",
    theme: "dark",
    accent: "purple",
    gradient: true,
    fontScale: 1,
    valuesByTpl: {},
    ...partial,
  };
}

const INITIAL_PROJECT: Project = {
  slides: [makeSlide()],
  activeIdx: 0,
  activeTpl: "announcement",
  sizeKey: "ig_portrait",
  exportSizes: ["ig_portrait"],
  caption: "",
};

// ─── Drafts hook (cloud-aware) ───────────────────────────────────────────────
function dbRowToDraftEntry(row: Record<string, unknown>): import("@/lib/types").DraftEntry {
  return {
    id:          row.id as string,
    name:        row.name as string,
    thumb:       (row.thumb as string | null) ?? null,
    isAutosave:  (row.is_autosave as boolean) ?? false,
    createdAt:   new Date(row.created_at as string).getTime(),
    updatedAt:   new Date(row.updated_at as string).getTime(),
    project:     row.project as Project,
  };
}

async function apiSaveDraft(entry: import("@/lib/types").DraftEntry) {
  await fetch("/api/drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: entry.id, name: entry.name, project: entry.project,
      thumb: entry.thumb, isAutosave: entry.isAutosave,
    }),
  });
}

function useDrafts(project: Project, applyProject: (p: Project) => void, isSignedIn: boolean) {
  const [store, setStore] = useState<DraftStore>({ drafts: [], autosaveId: null });
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autosaveIdRef = useRef<string | null>(null);
  const loadedCloud = useRef(false);

  // Load on mount — cloud first, localStorage fallback
  useEffect(() => {
    if (isSignedIn && !loadedCloud.current) {
      loadedCloud.current = true;
      fetch("/api/drafts")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data.drafts)) {
            const entries = data.drafts.map(dbRowToDraftEntry);
            const next: DraftStore = { drafts: entries, autosaveId: null };
            setStore(next);
            writeDrafts(next); // keep localStorage in sync
          }
        })
        .catch(() => setStore(readDrafts()));
    } else if (!isSignedIn) {
      setStore(readDrafts());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  // Autosave debounced 600ms
  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      setStore((prev) => {
        const aid = autosaveIdRef.current;
        const now = Date.now();
        let next: DraftStore;
        let entry: import("@/lib/types").DraftEntry;
        if (aid) {
          entry = { ...prev.drafts.find((d) => d.id === aid)!, updatedAt: now, project: JSON.parse(JSON.stringify(project)), isAutosave: true };
          next = { ...prev, drafts: prev.drafts.map((d) => d.id === aid ? entry : d) };
        } else {
          entry = makeDraftEntry(project, "Autosave", null, { isAutosave: true });
          autosaveIdRef.current = entry.id;
          next = { drafts: [entry, ...prev.drafts], autosaveId: entry.id };
        }
        writeDrafts(next);
        if (isSignedIn) apiSaveDraft(entry);
        return next;
      });
    }, 600);
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, [project, isSignedIn]);

  const saveAs = useCallback(async (name: string): Promise<string> => {
    const finalName = (name || suggestDraftName(project)).trim() || "Untitled";
    const entry = makeDraftEntry(project, finalName, null);
    setStore((prev) => {
      const next = { ...prev, drafts: [entry, ...prev.drafts] };
      writeDrafts(next);
      return next;
    });
    if (isSignedIn) await apiSaveDraft(entry);
    return finalName;
  }, [project, isSignedIn]);

  const load = useCallback((id: string) => {
    setStore((prev) => {
      const d = prev.drafts.find((x) => x.id === id);
      if (d) applyProject(d.project);
      return prev;
    });
  }, [applyProject]);

  const rename = useCallback((id: string, name: string) => {
    setStore((prev) => {
      const next = { ...prev, drafts: prev.drafts.map((d) => d.id === id ? { ...d, name } : d) };
      writeDrafts(next);
      return next;
    });
    if (isSignedIn) fetch(`/api/drafts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
  }, [isSignedIn]);

  const duplicate = useCallback((id: string) => {
    setStore((prev) => {
      const src = prev.drafts.find((d) => d.id === id);
      if (!src) return prev;
      const copy = { ...JSON.parse(JSON.stringify(src)), id: newDraftId(), name: src.name + " (copy)" };
      const idx = prev.drafts.findIndex((d) => d.id === id);
      const arr = [...prev.drafts];
      arr.splice(idx + 1, 0, copy);
      const next = { ...prev, drafts: arr };
      writeDrafts(next);
      if (isSignedIn) apiSaveDraft(copy);
      return next;
    });
  }, [isSignedIn]);

  const remove = useCallback((id: string) => {
    setStore((prev) => {
      const next = { ...prev, drafts: prev.drafts.filter((d) => d.id !== id) };
      writeDrafts(next);
      return next;
    });
    if (isSignedIn) fetch(`/api/drafts/${id}`, { method: "DELETE" });
  }, [isSignedIn]);

  return { store, saveAs, load, rename, duplicate, remove };
}

// ─── Main Studio component ──────────────────────────────────────────────────
export default function StudioPage() {
  const { isSignedIn } = useUser();
  const [project, setProject, history] = useHistoryState<Project>(INITIAL_PROJECT, { limit: 80, batchMs: 500 });
  const [isPro, setIsPro] = useState(false);
  const [upgradedToast, setUpgradedToast] = useState(false);

  // Brand kit — localStorage on mount, then hydrate from cloud when signed in
  const [brandVoice, setBrandVoice] = useState<BrandVoice>(() => {
    if (typeof window === "undefined") return { ...DEFAULT_BRAND_VOICE };
    return loadBrandVoice();
  });

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/brand-kit")
      .then((r) => r.json())
      .then((data) => {
        if (data.brandKit) {
          const bk = data.brandKit;
          setIsPro(bk.isPro ?? false);
          const merged: BrandVoice = {
            ...DEFAULT_BRAND_VOICE,
            business:        bk.business        ?? "",
            location:        bk.location        ?? "",
            whatWeDo:        bk.what_we_do      ?? "",
            voiceLean:       bk.voice_lean      ?? "friendly",
            usePhrases:      bk.use_phrases     ?? [],
            avoidPhrases:    bk.avoid_phrases   ?? [],
            sampleLine:      bk.sample_line     ?? "",
            includeEmoji:    bk.include_emoji   ?? true,
            ctaDefault:      bk.cta_default     ?? "",
            colorPrimary:    bk.color_primary   ?? "#B221F6",
            colorSecondary:  bk.color_secondary ?? "#FF6452",
            logoUrl:         bk.logo_url        ?? null,
          };
          setBrandVoice(merged);
          saveBrandVoice(merged); // keep localStorage in sync
        }
      })
      .catch(() => {}); // silently fall back to localStorage
  }, [isSignedIn]);

  // Show toast when returning from Stripe Checkout
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "1") {
      setUpgradedToast(true);
      setIsPro(true);
      window.history.replaceState({}, "", "/studio");
      setTimeout(() => setUpgradedToast(false), 5000);
    }
  }, []);

  // UI store
  const {
    leftCollapsed,
    rightCollapsed, setRightCollapsed,
    sizePopOpen, setSizePopOpen,
    showSafeZones, setShowSafeZones,
    showBrandVoice, setShowBrandVoice,
    showDrafts, setShowDrafts,
    editKey, setEditKey,
    selectedKey, setSelectedKey,
    aiBusy, setAiBusy,
    status, setStatus,
    copyFx, setCopyFx,
    snapLines, setSnapLines,
    stageScale, setStageScale,
  } = useUIStore();

  // Drafts
  const applyProject = useCallback((next: Project) => {
    setProject(() => next, { batch: false });
  }, [setProject]);
  const drafts = useDrafts(project, applyProject, isSignedIn ?? false);

  // ── Derived state ──────────────────────────────────────────────────────────
  const allSlides = project.slides;
  const activeTpl = project.activeTpl || allSlides[project.activeIdx]?.tplId || "announcement";
  const slides = useMemo(() => allSlides.filter((s) => s.tplId === activeTpl), [allSlides, activeTpl]);
  const size = SIZES[project.sizeKey as keyof typeof SIZES];
  const tpl = TEMPLATES.find((t) => t.id === activeTpl) || TEMPLATES[0];

  // Map global index ↔ local index within current tpl stack
  const stackIdxs = useMemo(
    () => allSlides.map((s, i) => (s.tplId === activeTpl ? i : -1)).filter((i) => i >= 0),
    [allSlides, activeTpl],
  );

  const globalActiveIdx = Math.min(project.activeIdx, allSlides.length - 1);
  const activeIdx = (() => {
    const pos = stackIdxs.indexOf(globalActiveIdx);
    return pos >= 0 ? pos : 0;
  })();
  const slide = slides[activeIdx] || slides[0] || makeSlide({ tplId: activeTpl });

  const values = useMemo(
    () => slide.valuesByTpl[slide.tplId] || {},
    [slide.valuesByTpl, slide.tplId],
  );
  const scales = useMemo(() => (values.__scales as Record<string, number>) || {}, [values.__scales]);
  const positions = useMemo(() => (values.__positions as Record<string, { x: number; y: number }>) || {}, [values.__positions]);
  const fieldStyles = useMemo(() => (values.__styles as Record<string, FieldStyle>) || {}, [values.__styles]);
  const crops = useMemo(() => (values.__crops as Record<string, Crop>) || {}, [values.__crops]);

  // ── Slide mutators (ported verbatim from app.jsx) ──────────────────────────
  const globalIdxInPrev = (prev: Project): number => {
    const t = prev.activeTpl || prev.slides[prev.activeIdx]?.tplId;
    if (!t) return prev.activeIdx;
    const si = prev.slides.map((s, i) => (s.tplId === t ? i : -1)).filter((i) => i >= 0);
    if (!si.length) return prev.activeIdx;
    if (si.includes(prev.activeIdx)) return prev.activeIdx;
    return si[0];
  };

  const patchActive = (patch: Partial<Slide>, opts: { batch?: boolean } = {}) => {
    setProject((prev) => {
      const gIdx = globalIdxInPrev(prev);
      return { ...prev, slides: prev.slides.map((s, i) => (i === gIdx ? { ...s, ...patch } : s)) };
    }, opts);
  };

  const patchActiveValues = (key: string, val: unknown, opts: { batch?: boolean } = { batch: true }) => {
    setProject((prev) => {
      const gIdx = globalIdxInPrev(prev);
      const cur = prev.slides[gIdx];
      const tplVals = cur.valuesByTpl[cur.tplId] || {};
      const nextVals = { ...tplVals, [key]: val };
      return {
        ...prev,
        slides: prev.slides.map((s, i) =>
          i === gIdx ? { ...s, valuesByTpl: { ...s.valuesByTpl, [s.tplId]: nextVals } } : s,
        ),
      };
    }, opts);
  };

  const patchActiveValuesSub = (subKey: string, fieldKey: string, val: unknown, opts: { batch?: boolean } = { batch: true }) => {
    setProject((prev) => {
      const gIdx = globalIdxInPrev(prev);
      const cur = prev.slides[gIdx];
      const tplVals = cur.valuesByTpl[cur.tplId] || {};
      const sub = { ...((tplVals[subKey] as Record<string, unknown>) || {}), [fieldKey]: val };
      const nextVals = { ...tplVals, [subKey]: sub };
      return {
        ...prev,
        slides: prev.slides.map((s, i) =>
          i === gIdx ? { ...s, valuesByTpl: { ...s.valuesByTpl, [s.tplId]: nextVals } } : s,
        ),
      };
    }, opts);
  };

  const setTplId = (id: string) => {
    setProject((prev) => {
      const t = TEMPLATES.find((x) => x.id === id);
      const si = prev.slides.map((s, i) => (s.tplId === id ? i : -1)).filter((i) => i >= 0);
      if (si.length === 0) {
        const cur = prev.slides[prev.activeIdx] || prev.slides[0];
        const fresh = makeSlide({
          tplId: id, variantId: t?.variants?.[0]?.id || "centered",
          theme: cur?.theme || "dark", accent: cur?.accent || "purple",
          gradient: cur?.gradient ?? true, fontScale: cur?.fontScale ?? 1,
        });
        return { ...prev, slides: [...prev.slides, fresh], activeTpl: id, activeIdx: prev.slides.length };
      }
      return { ...prev, activeTpl: id, activeIdx: si[0] };
    });
  };

  const setVariantId = (id: string) => patchActive({ variantId: id });
  const setTheme = (v: string) => patchActive({ theme: v });
  const setAccent = (v: string) => patchActive({ accent: v });
  const setGradient = (v: boolean) => patchActive({ gradient: v });
  const setFontScale = (v: number) => patchActive({ fontScale: v }, { batch: true });
  const setSizeKey = (k: string) => setProject((prev) => ({ ...prev, sizeKey: k }));
  const setActiveIdx = (localI: number) => {
    setProject((prev) => {
      const t = prev.activeTpl || prev.slides[prev.activeIdx]?.tplId;
      const si = prev.slides.map((s, i) => (s.tplId === t ? i : -1)).filter((i) => i >= 0);
      const g = si[localI] ?? si[0] ?? prev.activeIdx;
      return { ...prev, activeIdx: g };
    });
  };

  const setValue = (key: string, val: unknown) =>
    patchActiveValues(key, val, { batch: typeof val === "string" });
  const onTextChange = (key: string, val: string) => patchActiveValues(key, val, { batch: true });
  const onImageChange = (dataUrl: string, key?: string) => setValue(key || "image", dataUrl);

  const applyAllValues = (patchObj: Record<string, unknown>) => {
    if (!patchObj || typeof patchObj !== "object") return;
    setProject((prev) => {
      const gIdx = globalIdxInPrev(prev);
      const cur = prev.slides[gIdx];
      const tplVals = cur.valuesByTpl[cur.tplId] || {};
      const nextVals = { ...tplVals };
      for (const [k, v] of Object.entries(patchObj)) {
        if (v === null || v === undefined) continue;
        if (typeof v === "string") nextVals[k] = v.replace(/^["']|["']$/g, "").trim();
        else if (typeof v === "number" || typeof v === "boolean") nextVals[k] = v;
      }
      return {
        ...prev,
        slides: prev.slides.map((s, i) =>
          i === gIdx ? { ...s, valuesByTpl: { ...s.valuesByTpl, [s.tplId]: nextVals } } : s,
        ),
      };
    }, { batch: false });
  };

  const setFieldScale = (k: string, v: number) => patchActiveValuesSub("__scales", k, v, { batch: true });
  const setFieldPos = (k: string, v: { x: number; y: number }) => patchActiveValuesSub("__positions", k, v, { batch: true });
  const setFieldStyle = (k: string, v: FieldStyle | null) => patchActiveValuesSub("__styles", k, v, { batch: false });
  const setFieldCrop = (k: string, v: Crop | null) => patchActiveValuesSub("__crops", k, v, { batch: false });

  // ── Slide ops ──────────────────────────────────────────────────────────────
  const addSlide = () => setProject((prev) => {
    const t = prev.activeTpl || prev.slides[prev.activeIdx]?.tplId;
    const si = prev.slides.map((s, i) => (s.tplId === t ? i : -1)).filter((i) => i >= 0);
    const src = prev.slides[si[si.length - 1]] || prev.slides[prev.activeIdx];
    const fresh = makeSlide({ tplId: t, variantId: src.variantId, theme: src.theme, accent: src.accent, gradient: src.gradient, fontScale: src.fontScale });
    const insertAt = (si[si.length - 1] ?? prev.slides.length - 1) + 1;
    const next = [...prev.slides]; next.splice(insertAt, 0, fresh);
    return { ...prev, slides: next, activeIdx: insertAt, activeTpl: t };
  });

  const duplicateSlide = (localI: number) => setProject((prev) => {
    const t = prev.activeTpl || prev.slides[prev.activeIdx]?.tplId;
    const si = prev.slides.map((s, i) => (s.tplId === t ? i : -1)).filter((i) => i >= 0);
    const gIdx = si[localI]; if (gIdx == null) return prev;
    const copy = { ...JSON.parse(JSON.stringify(prev.slides[gIdx])), id: newSlideId() };
    const next = [...prev.slides]; next.splice(gIdx + 1, 0, copy);
    return { ...prev, slides: next, activeIdx: gIdx + 1 };
  });

  const deleteSlide = (localI: number) => setProject((prev) => {
    const t = prev.activeTpl || prev.slides[prev.activeIdx]?.tplId;
    const si = prev.slides.map((s, i) => (s.tplId === t ? i : -1)).filter((i) => i >= 0);
    if (si.length <= 1) return prev;
    const gIdx = si[localI]; if (gIdx == null) return prev;
    const next = prev.slides.filter((_, idx) => idx !== gIdx);
    const newSi = next.map((s, i) => (s.tplId === t ? i : -1)).filter((i) => i >= 0);
    const newActive = newSi[Math.min(localI, newSi.length - 1)] ?? 0;
    return { ...prev, slides: next, activeIdx: newActive };
  });

  const reorderSlides = (fromLocal: number, toLocal: number) => setProject((prev) => {
    const t = prev.activeTpl || prev.slides[prev.activeIdx]?.tplId;
    const si = prev.slides.map((s, i) => (s.tplId === t ? i : -1)).filter((i) => i >= 0);
    const gFrom = si[fromLocal]; const gTo = si[toLocal];
    if (gFrom == null || gTo == null) return prev;
    const arr = [...prev.slides];
    const [moved] = arr.splice(gFrom, 1);
    arr.splice(gTo, 0, moved);
    const activeIdx = prev.activeIdx === gFrom ? gTo
      : (prev.activeIdx > gFrom && prev.activeIdx <= gTo) ? prev.activeIdx - 1
      : (prev.activeIdx < gFrom && prev.activeIdx >= gTo) ? prev.activeIdx + 1
      : prev.activeIdx;
    return { ...prev, slides: arr, activeIdx };
  });

  // ── Arrow-key nudge for selected element ──────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === "Escape") { setSelectedKey(null); return; }
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        const step = e.shiftKey ? 20 : 2;
        const cur = positions[selectedKey] || { x: 0, y: 0 };
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        setFieldPos(selectedKey, { x: cur.x + dx, y: cur.y + dy });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedKey, positions]);

  // ── Snap lines ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedKey) { setSnapLines([]); return; }
    const pos = positions[selectedKey];
    if (!pos) { setSnapLines([]); return; }
    const thresh = 12;
    const lines = [];
    if (Math.abs(pos.x) <= thresh) lines.push({ x1: size.w / 2, y1: 0, x2: size.w / 2, y2: size.h });
    if (Math.abs(pos.y) <= thresh) lines.push({ x1: 0, y1: size.h / 2, x2: size.w, y2: size.h / 2 });
    setSnapLines(lines);
  }, [positions, selectedKey, size.w, size.h]);

  // ── Refit canvas when side rails toggle ───────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 260);
    return () => clearTimeout(t);
  }, [rightCollapsed, leftCollapsed]);

  // ── Render context builder ─────────────────────────────────────────────────
  const renderCtx = useCallback((opts: { editable?: boolean; stageScale?: number } = {}): RenderContext => ({
    values: { ...tpl.defaults, ...values },
    variant: slide.variantId,
    theme: slide.theme,
    accent: slide.accent,
    gradient: slide.gradient,
    size,
    fontScale: slide.fontScale,
    brandColors: { primary: brandVoice.colorPrimary, secondary: brandVoice.colorSecondary },
    editable: opts.editable,
    editKey, setEditKey,
    onTextChange,
    onImageChange,
    scales, positions, styles: fieldStyles, crops,
    selectedKey: opts.editable ? selectedKey : null,
    setSelectedKey: opts.editable ? setSelectedKey : undefined,
    onScaleChange: setFieldScale,
    onPosChange: setFieldPos,
    stageScale: opts.stageScale ?? stageScale,
  }), [tpl, values, slide, size, brandVoice.colorPrimary, brandVoice.colorSecondary, editKey, scales, positions, fieldStyles, crops, selectedKey, stageScale]);

  const renderActive = useCallback(
    (opts: { editable: boolean; stageScale: number }) => tpl.render(renderCtx(opts)),
    [tpl, renderCtx],
  );

  // ── AI caption ─────────────────────────────────────────────────────────────
  const aiCaption = async () => {
    setAiBusy(true);
    try {
      const allCtx = slides.map((s, i) => {
        const t = TEMPLATES.find((x) => x.id === s.tplId) || TEMPLATES[0];
        const v = s.valuesByTpl[s.tplId] || {};
        const merged = { ...t.defaults, ...v };
        const clean: Record<string, unknown> = {};
        for (const [k, val] of Object.entries(merged)) {
          if (k.startsWith("__")) continue;
          if (typeof val === "string" && !val.startsWith("data:")) clean[k] = val.slice(0, 200);
          else if (typeof val === "number" || typeof val === "boolean") clean[k] = val;
        }
        return { slide: i + 1, template: t.name, type: t.type, content: clean };
      });
      const res = await aiComplete(
        brandVoicePreamble(brandVoice) + " " +
        `Write ONE Instagram caption that covers this ${slides.length}-slide carousel post. ` +
        `Format: 2–4 short lines (use line breaks), then 5–8 relevant hashtags on a new line. ` +
        `Carousel slides: ${JSON.stringify(allCtx)}. ` +
        `Output ONLY the caption text, ready to paste — no headings, no quotes, no explanation.`
      );
      setProject((prev) => ({ ...prev, caption: res.trim() }), { batch: false });
      setStatus("✓ Caption ready");
    } catch (e) {
      setStatus("AI error: " + (e instanceof Error ? e.message : String(e)));
    }
    setAiBusy(false);
  };

  // ── Carousel generator ─────────────────────────────────────────────────────
  const generateCarousel = async (promptText: string, count: number) => {
    setAiBusy(true);
    setStatus(`Drafting ${count}-card carousel…`);
    try {
      const cards = await generateCarouselCards({ prompt: promptText, count, brandVoice });
      setProject((prev) => {
        const cur = prev.slides[prev.activeIdx] || prev.slides[0];
        const useCarouselLook = cur?.tplId === "carousel";
        const look = {
          variantId: useCarouselLook ? cur.variantId : "numbered",
          theme:     useCarouselLook ? cur.theme     : "dark",
          accent:    useCarouselLook ? cur.accent    : "purple",
          gradient:  useCarouselLook ? cur.gradient  : true,
          fontScale: useCarouselLook ? cur.fontScale : 1,
        };
        const newSlides: Slide[] = cards.map((card) => makeSlide({
          tplId: "carousel", ...look,
          valuesByTpl: { carousel: { ...card } },
        }));
        const nonCarousel = prev.slides.filter((s) => s.tplId !== "carousel");
        const merged = [...nonCarousel, ...newSlides];
        const firstCarouselIdx = merged.findIndex((s) => s.tplId === "carousel");
        return {
          ...prev,
          slides: merged,
          activeTpl: "carousel",
          activeIdx: firstCarouselIdx >= 0 ? firstCarouselIdx : 0,
        };
      }, { batch: false });
      setStatus(`✓ Drafted ${cards.length}-card carousel — click any card to edit`);
    } catch (e) {
      setStatus("Generator error: " + (e instanceof Error ? e.message : String(e)));
    }
    setAiBusy(false);
  };

  // ── Smart fit (AI crop) ────────────────────────────────────────────────────
  const canvasInnerRef = useRef<HTMLDivElement | null>(null);
  const smartFitImage = async (fieldKey: string) => {
    const imageSrc = values[fieldKey];
    if (!imageSrc || typeof imageSrc !== "string" || !imageSrc.startsWith("data:")) {
      setStatus("Add an image before Smart fit");
      return;
    }
    setAiBusy(true);
    setStatus("AI analyzing crop…");
    try {
      // Simple default crop — full AI vision crop can be wired in later
      setFieldCrop(fieldKey, { zoom: 1.2, x: 50, y: 40 });
      setStatus("✓ Smart fit applied");
    } catch (e) {
      setStatus("AI error: " + (e instanceof Error ? e.message : String(e)));
    }
    setAiBusy(false);
  };

  // ── Export ─────────────────────────────────────────────────────────────────
  // Always capture from the off-screen non-editable render so highlights and
  // gradient text are applied correctly (the live canvas uses editable:true).
  const getExportEl = (): HTMLElement | null =>
    document.getElementById("export-render") as HTMLElement | null;

  const exportCurrent = async () => {
    setStatus("Rendering…");
    try {
      const el = getExportEl();
      if (!el) return;
      await exportCurrentSlide(el, slide, activeIdx, project.sizeKey);
      setStatus(`✓ Saved slide ${activeIdx + 1}`);
    } catch (e) { setStatus("Error: " + (e instanceof Error ? e.message : String(e))); }
  };

  const exportCurrentMultiSize = async () => {
    if (!project.exportSizes.length) return;
    setStatus("Rendering…");
    try {
      const el = getExportEl();
      if (!el) return;
      await exportMultiSize(el, slide, activeIdx, project.exportSizes,
        (msg) => setStatus(msg));
      setStatus(`✓ Exported slide ${activeIdx + 1}`);
    } catch (e) { setStatus("Error: " + (e instanceof Error ? e.message : String(e))); }
  };

  const exportCarousel = async () => {
    setStatus("Rendering carousel…");
    try {
      await exportCarouselZip(
        (_i) => getExportEl(),
        slides, project.sizeKey, project.caption, activeTpl,
        (msg) => setStatus(msg),
      );
      setStatus(`✓ Exported ${slides.length}-slide carousel`);
    } catch (e) { setStatus("Error: " + (e instanceof Error ? e.message : String(e))); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={`studio ${leftCollapsed ? "left-collapsed" : ""} ${rightCollapsed ? "right-collapsed" : ""}`}>
      <Sidebar
        templates={TEMPLATES}
        activeTpl={activeTpl}
        allSlides={allSlides}
        setTplId={setTplId}
        slideCount={slides.length}
        isPro={isPro}
      />

      {upgradedToast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, background: "linear-gradient(90deg,#B221F6,#FF6452)",
          color: "#fff", padding: "12px 24px", borderRadius: 999,
          fontWeight: 800, fontSize: 14, letterSpacing: 0.5,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "none",
        }}>
          🎉 Welcome to Pro! All templates unlocked.
        </div>
      )}

      <Canvas
        size={size}
        sizeKey={project.sizeKey}
        stageScale={stageScale}
        setStageScale={setStageScale}
        renderActive={renderActive}
        slides={slides}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
        activeTplName={tpl.name}
        onAddSlide={addSlide}
        onDuplicateSlide={duplicateSlide}
        onDeleteSlide={deleteSlide}
        onReorderSlides={reorderSlides}
        sizePopOpen={sizePopOpen}
        setSizePopOpen={setSizePopOpen}
        setSizeKey={setSizeKey}
        showSafeZones={showSafeZones}
        setShowSafeZones={setShowSafeZones}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
        onBrandVoice={() => setShowBrandVoice(true)}
        onDrafts={() => setShowDrafts(true)}
        draftCount={drafts.store.drafts.filter((d) => !d.isAutosave).length}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        setEditKey={setEditKey}
        fieldStyles={fieldStyles}
        crops={crops}
        setFieldStyle={setFieldStyle}
        setFieldCrop={setFieldCrop}
        onSmartFit={smartFitImage}
        aiBusy={aiBusy}
        snapLines={snapLines}
        status={status}
      />

      <ControlsRail
        rightCollapsed={rightCollapsed}
        setRightCollapsed={setRightCollapsed}
        tpl={tpl}
        activeIdx={activeIdx}
        values={values}
        variantId={slide.variantId}
        theme={slide.theme}
        accent={slide.accent}
        gradient={slide.gradient}
        fontScale={slide.fontScale}
        setVariantId={setVariantId}
        setTheme={setTheme}
        setAccent={setAccent}
        setGradient={setGradient}
        setFontScale={setFontScale}
        setValue={setValue}
        project={project}
        setProject={setProject}
        activeTpl={activeTpl}
        brandVoice={brandVoice}
        aiBusy={aiBusy}
        setAiBusy={setAiBusy}
        setStatus={setStatus}
        applyAllValues={applyAllValues}
        generateCarousel={generateCarousel}
        copyFx={copyFx}
        setCopyFx={setCopyFx}
        aiCaption={aiCaption}
        exportCurrent={exportCurrent}
        exportCurrentMultiSize={exportCurrentMultiSize}
        exportCarousel={exportCarousel}
        slides={slides}
      />

      {/* Off-screen export render — always non-editable so highlights/gradients render correctly */}
      <div style={{ position: "fixed", left: -99999, top: 0, width: size.w, height: size.h, pointerEvents: "none", overflow: "visible" }}>
        <div
          id="export-render"
          style={{ position: "relative", width: size.w, height: size.h, overflow: "visible" }}
        >
          {renderActive({ editable: false, stageScale: 1 })}
        </div>
      </div>

      {showBrandVoice && (
        <BrandVoiceModal
          value={brandVoice}
          onChange={(v) => { setBrandVoice(v); saveBrandVoice(v); }}
          onClose={() => setShowBrandVoice(false)}
        />
      )}

      {showDrafts && (
        <DraftsModal
          store={drafts.store}
          currentProject={project}
          onLoad={(id) => { drafts.load(id); setShowDrafts(false); setStatus("✓ Draft loaded"); }}
          onRename={drafts.rename}
          onDuplicate={drafts.duplicate}
          onRemove={drafts.remove}
          onSaveAs={async (name) => {
            const finalName = await drafts.saveAs(name);
            setStatus(`✓ Saved "${finalName}"`);
          }}
          onClose={() => setShowDrafts(false)}
        />
      )}
    </div>
  );
}
