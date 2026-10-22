import type { BrandVoice } from "./types";
import type { Template } from "./types";

export const BRAND_VOICE_KEY = "rutstudio.brandvoice.v1";

export const DEFAULT_BRAND_VOICE: BrandVoice = {
  business: "",
  location: "",
  whatWeDo: "",
  voiceLean: "friendly",
  usePhrases: [],
  avoidPhrases: [],
  sampleLine: "",
  includeEmoji: true,
  ctaDefault: "",
  colorPrimary: "#B221F6",
  colorSecondary: "#FF6452",
  logoUrl: null,
};

export const VOICE_LEAN_OPTIONS = [
  { id: "friendly", label: "Friendly · warm, neighborly" },
  { id: "bold", label: "Bold · confident, direct" },
  { id: "playful", label: "Playful · witty, casual" },
  { id: "professional", label: "Professional · clean, polished" },
  { id: "hype", label: "Hype · energetic, big caps" },
];

export function loadBrandVoice(): BrandVoice {
  try {
    const raw = localStorage.getItem(BRAND_VOICE_KEY);
    if (!raw) return { ...DEFAULT_BRAND_VOICE };
    return { ...DEFAULT_BRAND_VOICE, ...JSON.parse(raw) };
  } catch { return { ...DEFAULT_BRAND_VOICE }; }
}

export function saveBrandVoice(v: BrandVoice): void {
  try { localStorage.setItem(BRAND_VOICE_KEY, JSON.stringify(v)); } catch {}
}

export function brandVoicePreamble(v: BrandVoice): string {
  const parts: string[] = [];
  parts.push(`You are writing for ${v.business || "Rolled Up Tees"}${v.location ? `, based in ${v.location}` : ""}.`);
  if (v.whatWeDo) parts.push(`What we do: ${v.whatWeDo}.`);
  const lean = VOICE_LEAN_OPTIONS.find((x) => x.id === v.voiceLean)?.label || v.voiceLean;
  parts.push(`Brand voice lean: ${lean}. Specific, concrete, human. Never generic marketing fluff.`);
  if (v.usePhrases?.length) parts.push(`Preferred words/phrases you may use: ${v.usePhrases.join(", ")}.`);
  if (v.avoidPhrases?.length) parts.push(`NEVER use these words/phrases: ${v.avoidPhrases.join(", ")}.`);
  if (v.sampleLine) parts.push(`Example of a line that sounds like us: "${v.sampleLine}"`);
  parts.push(v.includeEmoji ? `Emoji: sparingly, 0–2 per caption max, only if they add meaning.` : `No emoji.`);
  return parts.join(" ");
}

export const TEMPLATE_AI_HINTS: Record<string, { purpose: string; fields: Record<string, string> }> = {
  announcement: {
    purpose: "Announcing something new, big, or newsworthy.",
    fields: {
      eyebrow: "2–4 words, all caps feel. E.g. 'NOW BOOKING', 'JUST LAUNCHED'.",
      headline: "4–8 words. Concrete, specific, high-impact. No ellipsis. End with a period for declarative punch.",
      highlight: "1–2 words from the headline that should pop (gradient). Must be an exact substring of the headline.",
      subhead: "1 sentence, max 14 words. Add the specific so-what.",
      footer: "CTA or link. Short.",
    },
  },
  promo: {
    purpose: "Driving action on a time-limited offer.",
    fields: {
      eyebrow: "2–3 words. 'LIMITED TIME', 'THIS WEEK ONLY'.",
      headline: "The offer, plainly. 4–7 words.",
      offer: "The discount or deal, short. E.g. '20% OFF', 'FREE SETUP'.",
      subhead: "1 sentence explaining the offer.",
      deadline: "When it ends. E.g. 'Ends Sunday'.",
      cta: "Action verb phrase. 'Order yours', 'Get a quote'.",
    },
  },
  quote: {
    purpose: "Customer testimonial. Keep the customer's voice.",
    fields: {
      quote: "An AUTHENTIC-sounding review, specific, 1–2 sentences. Mention a real-feeling detail (turnaround, quality, team response).",
      attribution: "Name + role. E.g. 'Sarah M. · Nyack HS Cross Country'.",
      headline: "A short framing line above the quote. Optional.",
    },
  },
  beforeafter: {
    purpose: "Transformation story — dull shirt to custom piece, or concept to finished product.",
    fields: {
      headline: "Short. 3–6 words. E.g. 'From blank to brilliant.'",
      beforeLabel: "1–2 words. E.g. 'BEFORE', 'THE BRIEF'.",
      afterLabel: "1–2 words. E.g. 'AFTER', 'THE FINAL'.",
      caption: "1 sentence telling the story.",
    },
  },
  showcase: {
    purpose: "Editorial photo-led post. Let the image breathe.",
    fields: {
      eyebrow: "Short tag. 2–3 words.",
      headline: "Poetic, short. 3–6 words.",
      caption: "1 line of credit/context.",
    },
  },
  tip: {
    purpose: "Educational, shareable. Drives saves.",
    fields: {
      label: "E.g. 'DID YOU KNOW', 'PRO TIP'.",
      tipNumber: "E.g. '01' or 'TIP 01'. Optional.",
      headline: "The tip itself. Concrete, useful. 6–12 words.",
      body: "1–2 sentences explaining.",
    },
  },
  question: {
    purpose: "Engagement post. Get comments.",
    fields: {
      headline: "A clear either/or question. 3–8 words. E.g. 'Which would you rock?'",
      optionA: "Short name for option A.",
      optionB: "Short name for option B.",
      footer: "Optional nudge. 'Vote in comments 👇'.",
    },
  },
};

export const VOICE_VARIANTS = [
  { id: "tight", label: "Tight", hint: "Spare, punchy, few words. Zero fluff. Short sentences." },
  { id: "warm", label: "Warm", hint: "Friendly, neighborly, human. Conversational but crisp." },
  { id: "hype", label: "Hype", hint: "Energetic, exclamatory, confident. A bit louder. Never cheesy." },
];

export function buildGenerateAllPrompt({
  voice, template, size, currentValues, extraPrompt, variant,
}: {
  voice: BrandVoice;
  template: Template;
  size: { w: number; h: number; label: string; short: string };
  currentValues?: Record<string, unknown>;
  extraPrompt?: string;
  variant?: { id: string; label: string; hint: string };
}): string {
  const hint = TEMPLATE_AI_HINTS[template.id] || { purpose: "", fields: {} };
  const fieldSpec = template.fields
    .filter((f) => f.kind !== "image" && !f.key.startsWith("__"))
    .map((f) => {
      const guide = hint.fields?.[f.key] || "";
      return `  "${f.key}": <${f.label}${guide ? " · " + guide : ""}>`;
    })
    .join(",\n");

  const variantNote = variant ? ` Additional tonal direction: ${variant.hint}` : "";

  return [
    brandVoicePreamble(voice),
    `Task: write the full copy for a single ${template.name} social post. ${hint.purpose}${variantNote}`,
    extraPrompt ? `User's brief: ${extraPrompt}` : "",
    currentValues && Object.keys(currentValues).length
      ? `Keep this context if relevant (but you may replace anything): ${JSON.stringify(currentValues)}`
      : "",
    `Output ONLY valid JSON matching exactly this shape — no prose, no code fences:`,
    `{`,
    fieldSpec,
    `}`,
  ].filter(Boolean).join("\n");
}

export function parseAIJson(text: string): Record<string, unknown> | null {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try { return JSON.parse(cleaned); } catch {}
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}
