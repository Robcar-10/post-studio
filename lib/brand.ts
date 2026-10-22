export const BRAND = {
  purple:        "#B221F6",
  purpleDeep:    "#9D1DD8",
  coral:         "#FF6452",
  coralDeep:     "#E55A49",
  pinkSoft:      "#d88eff",
  peachSoft:     "#ff9a8e",
  ink0:          "#160028",
  ink1:          "#1A0030",
  ink2:          "#220050",
  ink3:          "#2D0060",
  cream:         "#FAF3E5",
  lavenderBg:    "#F9F5FF",
  lavenderBorder:"#E8CCFF",
  lavender700:   "#7E22CE",
  fg900:         "#111827",
  fg700:         "#374151",
  fg600:         "#4B5563",
  fg500:         "#6B7280",
  fg400:         "#9CA3AF",
  star:          "#FACC15",
  yellow:        "#FFDB3B",
} as const;

export const FONT_DISPLAY = 'var(--font-palanquin-dark), var(--font-palanquin), var(--font-work-sans), "Inter", sans-serif';
export const FONT_BODY    = 'var(--font-palanquin), var(--font-inter), -apple-system, sans-serif';
export const FONT_EYEBROW = 'var(--font-palanquin-dark), var(--font-palanquin), var(--font-inter), sans-serif';

export const GRAD_CTA       = `linear-gradient(90deg, ${BRAND.purple}, ${BRAND.coral})`;
export const GRAD_HERO_DARK = `linear-gradient(135deg, ${BRAND.ink1} 0%, ${BRAND.ink3} 55%, ${BRAND.ink1} 100%)`;

export const SIZES = {
  ig_square:   { w: 1080, h: 1080, label: "IG Feed",         short: "1:1"    },
  ig_portrait: { w: 1080, h: 1350, label: "IG Portrait",     short: "4:5"    },
  ig_story:    { w: 1080, h: 1920, label: "IG Story / Reel", short: "9:16"   },
  fb_feed:     { w: 1200, h:  630, label: "FB Feed",         short: "1.91:1" },
  fb_square:   { w: 1200, h: 1200, label: "FB Square",       short: "1:1"    },
  gbp:         { w: 1200, h:  900, label: "Google Business", short: "4:3"    },
} as const;

export type SizeKey = keyof typeof SIZES;

export const SIZE_OPTIONS: Array<{ key: SizeKey; w: number; h: number; label: string; short: string }> = [
  { key: "ig_portrait", ...SIZES.ig_portrait },
  { key: "ig_square",   ...SIZES.ig_square   },
  { key: "ig_story",    ...SIZES.ig_story    },
  { key: "fb_feed",     ...SIZES.fb_feed     },
  { key: "fb_square",   ...SIZES.fb_square   },
  { key: "gbp",         ...SIZES.gbp         },
];

// Template rendering helpers
export const getBg     = (theme: string) => theme === "dark" ? BRAND.ink1 : theme === "cream" ? BRAND.cream : "#FFFFFF";
export const getFg     = (theme: string) => theme === "dark" ? "#fff" : BRAND.fg900;
export const getMuted  = (theme: string) => theme === "dark" ? "rgba(255,255,255,0.7)" : BRAND.fg600;
export const accentColor = (accent: string) => accent === "coral" ? BRAND.coral : BRAND.purple;
export const TS = (h: number, base: number, fs = 1) => Math.round(base * (h / 1350) * fs);

export type BrandColors = { primary: string; secondary: string };

// Brand-color-aware accent resolver — falls back to hardcoded RUT colors when no brand kit is set.
export function resolveAccent(accent: string, brandColors?: BrandColors): string {
  return accent === "coral"
    ? (brandColors?.secondary ?? BRAND.coral)
    : (brandColors?.primary  ?? BRAND.purple);
}

// Returns gradient string when gradient=true, flat accent color otherwise.
export function resolveGrad(gradient: boolean, accent: string, brandColors?: BrandColors): string {
  const p = brandColors?.primary  ?? BRAND.purple;
  const s = brandColors?.secondary ?? BRAND.coral;
  return gradient
    ? `linear-gradient(90deg, ${p}, ${s})`
    : resolveAccent(accent, brandColors);
}

// Convenience: the "other" accent (coral when accent=purple, purple when accent=coral).
export function resolveSecondary(accent: string, brandColors?: BrandColors): string {
  return accent === "coral"
    ? (brandColors?.primary  ?? BRAND.purple)
    : (brandColors?.secondary ?? BRAND.coral);
}
