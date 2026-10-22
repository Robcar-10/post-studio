import { aiComplete } from "./ai";
import { brandVoicePreamble } from "./brandVoice";
import type { BrandVoice, CarouselCard } from "./types";

export async function generateCarouselCards({
  prompt,
  count,
  brandVoice,
}: {
  prompt: string;
  count: number;
  brandVoice: BrandVoice;
}): Promise<CarouselCard[]> {
  if (!prompt || !prompt.trim()) throw new Error("Tell the generator what the carousel should be about.");
  const n = Math.max(3, Math.min(15, Math.round(count || 5)));
  const pad = (i: number) => String(i).padStart(2, "0");
  const voice = brandVoicePreamble(brandVoice);

  const instructions =
    voice +
    ` Design an Instagram ${n}-slide carousel about: ${prompt.trim()}\n\n` +
    `Think of the carousel as a story with a HOOK → BODY → CTA shape.\n` +
    `- Slide 1 is the hook/cover: bold, curiosity-driving title.\n` +
    `- Slides 2 through ${n - 1} each take one discrete idea, tip, or step and sell it clearly.\n` +
    `- Slide ${n} is the payoff/CTA: tell the reader what to do next.\n\n` +
    `Return ONLY valid JSON — an array of exactly ${n} objects, no prose, no markdown fences:\n` +
    `[\n` +
    `  { "eyebrow": "SHORT LABEL", "number": "01", "title": "Short bold headline.", "body": "One-to-two sentences.", "footer": "Swipe →" },\n` +
    `  ...\n` +
    `]\n\n` +
    `Rules:\n` +
    `- "eyebrow": 1–4 words, UPPERCASE-friendly short label (no emoji)\n` +
    `- "number": "01", "02", … "${pad(n)}" zero-padded\n` +
    `- "title": at most 8 words, punchy, no emoji\n` +
    `- "body": 1–2 short sentences, ≤ 24 words total\n` +
    `- "footer": "Swipe →" for slides 1..${n - 1}; last slide footer = a short CTA line\n` +
    `Do not include markdown. Do not wrap in code fences. Do not explain. Return the JSON array only.`;

  const raw = await aiComplete(instructions, { maxTokens: 2048 });
  const cleaned = String(raw).replace(/```json/gi, "").replace(/```/g, "").trim();
  const m = cleaned.match(/\[[\s\S]*\]/);
  if (!m) throw new Error("Couldn't parse generator response. Try again?");
  let arr: CarouselCard[];
  try { arr = JSON.parse(m[0]); }
  catch { throw new Error("Generator returned invalid JSON."); }
  if (!Array.isArray(arr) || arr.length === 0) throw new Error("Generator returned no cards.");

  const normalized: CarouselCard[] = [];
  for (let i = 0; i < n; i++) {
    const src = arr[i] || arr[arr.length - 1] || {};
    normalized.push({
      eyebrow: (src.eyebrow || "").toString().trim().slice(0, 40),
      number: src.number ? src.number.toString().trim().slice(0, 4) : pad(i + 1),
      title: (src.title || "").toString().replace(/^["']|["']$/g, "").trim().slice(0, 120),
      body: (src.body || "").toString().trim().slice(0, 220),
      footer: (src.footer || (i === n - 1 ? "Link in bio" : "Swipe →")).toString().trim().slice(0, 60),
    });
  }
  return normalized;
}
