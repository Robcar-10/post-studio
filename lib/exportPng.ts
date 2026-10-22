import type { Slide } from "./types";
import { SIZES } from "./brand";

async function getHtmlToImage() {
  const mod = await import("html-to-image");
  return mod;
}

async function getJSZip() {
  const { default: JSZip } = await import("jszip");
  return JSZip;
}

function downloadDataUrl(url: string, name: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function parseGradStops(gradStr: string): Array<{ offset: number; color: string }> {
  const hexes = gradStr.match(/#[0-9a-fA-F]{3,8}/g) ?? [];
  if (hexes.length === 0) return [{ offset: 0, color: "#B221F6" }, { offset: 1, color: "#FF6452" }];
  if (hexes.length === 1) return [{ offset: 0, color: hexes[0] }, { offset: 1, color: hexes[0] }];
  return hexes.map((c, i) => ({ offset: i / (hexes.length - 1), color: c }));
}

interface GradInfo {
  node: HTMLElement;
  text: string;
  gradStr: string;
  spanX: number;
  baselineY: number;
  spanWidth: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  letterSpacing: string;
}

// Collects each gradient-text span's rendering info and immediately converts it to a
// solid fallback color so html-to-image renders visible text (background-clip:text is
// broken inside SVG foreignObject). The EXACT baseline Y is measured via a zero-height
// inline-block probe — no font-metric math, directly from the DOM.
function collectAndFixGrads(el: HTMLElement): { infos: GradInfo[]; restore: () => void } {
  const elRect = el.getBoundingClientRect();
  const restores: Array<() => void> = [];
  const infos: GradInfo[] = [];

  el.querySelectorAll<HTMLElement>("*").forEach((node) => {
    const s = node.style;
    const isGrad =
      (s.webkitTextFillColor === "transparent" || s.color === "transparent") &&
      (s.backgroundClip === "text" || s.webkitBackgroundClip === "text") &&
      s.backgroundImage.includes("gradient");
    if (!isGrad) return;

    const text = node.textContent ?? "";
    if (!text.trim()) return;
    const spanRect = node.getBoundingClientRect();
    if (!spanRect.width || !spanRect.height) return;

    const gradStr = s.backgroundImage;

    // Zero-height inline-block with vertical-align:baseline — its top == the baseline y.
    // Inserted as next sibling so it shares the same line box as the gradient span.
    const probe = document.createElement("span");
    probe.style.cssText =
      "display:inline-block;width:0;height:0;font-size:0;line-height:0;vertical-align:baseline;overflow:hidden;";
    node.after(probe);
    const probeRect = probe.getBoundingClientRect();
    probe.remove();

    const cs = window.getComputedStyle(node);

    infos.push({
      node,
      text,
      gradStr,
      spanX: spanRect.left - elRect.left,
      baselineY: probeRect.top - elRect.top,
      spanWidth: spanRect.width,
      fontFamily: cs.fontFamily,
      fontSize: parseFloat(cs.fontSize),
      fontWeight: cs.fontWeight,
      fontStyle: cs.fontStyle,
      letterSpacing: cs.letterSpacing,
    });

    // Convert to solid fallback so the span renders visible text in the export
    const firstColor = gradStr.match(/#([0-9a-fA-F]{3,6})/)?.[0] ?? "#B221F6";
    const prev = {
      color: s.color,
      fill: s.webkitTextFillColor,
      bg: s.backgroundImage,
      clip: s.backgroundClip,
      wkClip: s.webkitBackgroundClip,
    };
    s.color = firstColor;
    s.webkitTextFillColor = firstColor;
    s.backgroundImage = "none";
    s.backgroundClip = "";
    s.webkitBackgroundClip = "";

    restores.push(() => {
      s.color = prev.color;
      s.webkitTextFillColor = prev.fill;
      s.backgroundImage = prev.bg;
      s.backgroundClip = prev.clip;
      s.webkitBackgroundClip = prev.wkClip;
    });
  });

  return { infos, restore: () => restores.forEach((r) => r()) };
}

// ── Core capture ─────────────────────────────────────────────────────────────

// Three-phase pipeline:
//   1. Warmup toPng — forces html-to-image to load web fonts into its SVG context
//      so measurements in phase 2 reflect the stable, post-font-load layout.
//   2. Measure gradient spans + fix to solid. Paint true gradient text onto a
//      full-size canvas overlay that is a direct child of el (html-to-image embeds
//      canvas elements as images — no external compositing step).
//   3. Capture final PNG, remove overlay, restore original styles.
async function capturePng(el: HTMLElement, w: number, h: number): Promise<string> {
  const { toPng } = await getHtmlToImage();

  const wrap = el.parentElement;
  const wrapWasHidden = wrap && window.getComputedStyle(wrap).overflow === "hidden";
  const prevWrapOverflow = wrap?.style.overflow ?? "";
  const prevWrapWidth = wrap?.style.width ?? "";
  const prevWrapHeight = wrap?.style.height ?? "";

  if (wrapWasHidden && wrap) {
    wrap.style.overflow = "visible";
    wrap.style.width = `${w}px`;
    wrap.style.height = `${h}px`;
  }

  try {
    // Phase 1: warmup — font loading settles, reflows complete
    await document.fonts.ready;
    await toPng(el, { width: w, height: h, pixelRatio: 1, cacheBust: false });

    // Phase 2: measure baselines (layout is now stable), fix spans to solid,
    //           paint gradient text onto a full-size canvas overlay.
    const { infos, restore } = collectAndFixGrads(el);

    const overlay = document.createElement("canvas");
    overlay.width = w;
    overlay.height = h;
    overlay.style.cssText = `position:absolute;top:0;left:0;width:${w}px;height:${h}px;pointer-events:none;z-index:9999;`;
    el.appendChild(overlay);

    const ctx = overlay.getContext("2d")!;
    for (const info of infos) {
      if (!info.text.trim()) continue;
      ctx.save();
      const fs = info.fontStyle !== "normal" ? `${info.fontStyle} ` : "";
      ctx.font = `${fs}${info.fontWeight} ${info.fontSize}px ${info.fontFamily}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ctx as any).letterSpacing = info.letterSpacing;
      ctx.textBaseline = "alphabetic";
      const stops = parseGradStops(info.gradStr);
      const grad = ctx.createLinearGradient(info.spanX, 0, info.spanX + info.spanWidth, 0);
      for (const stop of stops) grad.addColorStop(stop.offset, stop.color);
      ctx.fillStyle = grad;
      ctx.fillText(info.text, info.spanX, info.baselineY);
      ctx.restore();
    }

    // Phase 3: capture — html-to-image embeds the overlay canvas as an image
    try {
      return await toPng(el, { width: w, height: h, pixelRatio: 1, cacheBust: false });
    } finally {
      overlay.remove();
      restore();
    }
  } finally {
    if (wrapWasHidden && wrap) {
      wrap.style.overflow = prevWrapOverflow;
      wrap.style.width = prevWrapWidth;
      wrap.style.height = prevWrapHeight;
    }
  }
}

export async function captureSlideAtSize(
  slideEl: HTMLElement,
  sizeKey: string
): Promise<{ dataUrl: string; sz: { w: number; h: number }; sk: string }> {
  const sz = SIZES[sizeKey as keyof typeof SIZES];
  if (!sz) throw new Error(`Unknown size key: ${sizeKey}`);
  const dataUrl = await capturePng(slideEl, sz.w, sz.h);
  return { dataUrl, sz, sk: sizeKey };
}

export async function exportCurrentSlide(slideEl: HTMLElement, slide: Slide, activeIdx: number, sizeKey: string): Promise<void> {
  const sz = SIZES[sizeKey as keyof typeof SIZES];
  if (!sz) return;
  const dataUrl = await capturePng(slideEl, sz.w, sz.h);
  downloadDataUrl(dataUrl, `rut-${slide.tplId}-slide${activeIdx + 1}-${sizeKey}-${sz.w}x${sz.h}.png`);
}

export async function exportMultiSize(
  slideEl: HTMLElement,
  slide: Slide,
  activeIdx: number,
  exportSizes: string[],
  onProgress?: (msg: string) => void
): Promise<void> {
  if (!exportSizes.length) return;

  if (exportSizes.length === 1) {
    const sk = exportSizes[0];
    const sz = SIZES[sk as keyof typeof SIZES];
    if (!sz) return;
    const dataUrl = await capturePng(slideEl, sz.w, sz.h);
    downloadDataUrl(dataUrl, `rut-${slide.tplId}-slide${activeIdx + 1}-${sk}-${sz.w}x${sz.h}.png`);
    return;
  }

  const JSZip = await getJSZip();
  const zip = new JSZip();
  for (let i = 0; i < exportSizes.length; i++) {
    const sk = exportSizes[i];
    const sz = SIZES[sk as keyof typeof SIZES];
    if (!sz) continue;
    onProgress?.(`Rendering ${i + 1}/${exportSizes.length}…`);
    const dataUrl = await capturePng(slideEl, sz.w, sz.h);
    zip.file(`rut-${slide.tplId}-slide${activeIdx + 1}-${sk}-${sz.w}x${sz.h}.png`, dataUrl.split(",")[1], { base64: true });
  }
  onProgress?.("Compressing…");
  const blob = await zip.generateAsync({ type: "blob" });
  downloadDataUrl(URL.createObjectURL(blob), `rut-slide${activeIdx + 1}-multi.zip`);
}

export async function exportCarouselZip(
  renderEl: (slideIndex: number) => HTMLElement | null,
  slides: Slide[],
  sizeKey: string,
  caption: string,
  activeTpl: string,
  onProgress?: (msg: string) => void
): Promise<void> {
  const sz = SIZES[sizeKey as keyof typeof SIZES];
  if (!sz) return;
  const JSZip = await getJSZip();
  const zip = new JSZip();

  for (let i = 0; i < slides.length; i++) {
    onProgress?.(`Rendering slide ${i + 1}/${slides.length}…`);
    const el = renderEl(i);
    if (!el) continue;
    const dataUrl = await capturePng(el, sz.w, sz.h);
    const idxStr = String(i + 1).padStart(2, "0");
    zip.file(`rut-carousel-${idxStr}-${slides[i].tplId}-${sizeKey}.png`, dataUrl.split(",")[1], { base64: true });
  }
  if (caption && caption.trim()) zip.file("caption.txt", caption.trim());
  onProgress?.("Compressing ZIP…");
  const blob = await zip.generateAsync({ type: "blob" });
  downloadDataUrl(URL.createObjectURL(blob), `rut-${activeTpl}-${slides.length}slides.zip`);
}
