"use client";
import { useState } from "react";
import { aiComplete } from "@/lib/ai";
import {
  TEMPLATE_AI_HINTS, VOICE_VARIANTS, buildGenerateAllPrompt, parseAIJson,
} from "@/lib/brandVoice";
import type { Template, BrandVoice, CanvasSize } from "@/lib/types";

interface Props {
  tpl: Template;
  values: Record<string, unknown>;
  size: CanvasSize;
  brandVoice: BrandVoice;
  applyAll: (patch: Record<string, unknown>) => void;
  applyOne: (key: string, val: unknown) => void;
  aiBusy: boolean;
  setAiBusy: (v: boolean) => void;
  setStatus: (s: string) => void;
}

interface AltDraft {
  voiceId: string;
  label: string;
  hint: string;
  fields: Record<string, unknown> | null;
}

export function AIPanel({ tpl, values, size, brandVoice, applyAll, aiBusy, setAiBusy, setStatus }: Props) {
  const [brief, setBrief] = useState("");
  const [alts, setAlts] = useState<AltDraft[] | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const hint = TEMPLATE_AI_HINTS[tpl.id];
  const textFields = tpl.fields.filter((f) => f.kind !== "image" && !f.key.startsWith("__"));

  const cleanValues = () => {
    const out: Record<string, unknown> = {};
    for (const f of textFields) {
      const val = values[f.key] ?? tpl.defaults[f.key];
      if (typeof val === "string" && !val.startsWith("data:") && !val.startsWith("blob:")) {
        out[f.key] = val.length > 200 ? val.slice(0, 200) : val;
      } else if (typeof val === "number" || typeof val === "boolean") {
        out[f.key] = val;
      }
    }
    return out;
  };

  const generateAll = async () => {
    setAiBusy(true);
    setAlts(null);
    setStatus("Writing your post…");
    try {
      const prompt = buildGenerateAllPrompt({
        voice: brandVoice, template: tpl, size,
        currentValues: cleanValues(), extraPrompt: brief,
      });
      const res = await aiComplete(prompt);
      const parsed = parseAIJson(res);
      if (!parsed) throw new Error("couldn't parse response");
      applyAll(parsed);
      setStatus("✓ Copy generated");
    } catch (e) {
      setStatus("AI error: " + (e instanceof Error ? e.message : String(e)));
    }
    setAiBusy(false);
  };

  const generateVoices = async () => {
    setAiBusy(true);
    setAlts(null);
    setStatus("Drafting 3 voice variants…");
    try {
      const results = await Promise.all(
        VOICE_VARIANTS.map(async (v) => {
          const prompt = buildGenerateAllPrompt({
            voice: brandVoice, template: tpl, size,
            currentValues: cleanValues(), extraPrompt: brief, variant: v,
          });
          const res = await aiComplete(prompt);
          return { voiceId: v.id, label: v.label, hint: v.hint, fields: parseAIJson(res) };
        }),
      );
      const good = results.filter((r) => r.fields);
      if (!good.length) throw new Error("all voices failed to parse");
      setAlts(good);
      setStatus(`✓ ${good.length} voice variants ready`);
    } catch (e) {
      setStatus("AI error: " + (e instanceof Error ? e.message : String(e)));
    }
    setAiBusy(false);
  };

  const preview = (fields: Record<string, unknown>) => {
    const headline = fields.headline || fields.quote || fields.body || Object.values(fields)[0] || "";
    const sub = fields.subhead || fields.caption || fields.body || fields.attribution || "";
    return { headline: String(headline).slice(0, 90), sub: String(sub).slice(0, 80) };
  };

  return (
    <div>
      <div className="ai-brief-wrap">
        <label className="ai-brief-label">Brief (optional)</label>
        <textarea
          className="ai-brief"
          rows={2}
          placeholder="e.g. Nyack HS fall soccer team, orders due Friday, 40 shirts"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
        <div className="ai-brief-hint">
          The AI already knows your brand voice. Add anything post-specific here.
        </div>
      </div>

      <div className="ai-btn-row">
        <button className="ai-btn primary" disabled={aiBusy} onClick={generateAll}>
          {aiBusy ? "…" : "Write all fields"}
        </button>
        <button className="ai-btn" disabled={aiBusy} onClick={generateVoices}
          title="3 alternate drafts — Tight, Warm, Hype">
          {aiBusy ? "…" : "3 voices"}
        </button>
      </div>

      {hint && (
        <div className="ai-purpose">
          <b>Purpose:</b> {hint.purpose}
        </div>
      )}

      {alts && alts.length > 0 && (
        <div className="ai-alts">
          <div className="ai-alts-head">Pick one to apply</div>
          {alts.map((a) => {
            if (!a.fields) return null;
            const pv = preview(a.fields);
            return (
              <button
                key={a.voiceId}
                className={`ai-alt ${hoverId === a.voiceId ? "hov" : ""}`}
                onMouseEnter={() => setHoverId(a.voiceId)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => {
                  if (a.fields) applyAll(a.fields);
                  setAlts(null);
                  setStatus(`✓ Applied "${a.label}" draft`);
                }}
              >
                <div className="ai-alt-tag">{a.label}</div>
                <div className="ai-alt-head">{pv.headline || "—"}</div>
                {pv.sub && <div className="ai-alt-sub">{pv.sub}</div>}
                <div className="ai-alt-apply">Click to apply</div>
              </button>
            );
          })}
          <button className="ai-alts-dismiss" onClick={() => setAlts(null)}>Dismiss drafts</button>
        </div>
      )}
    </div>
  );
}
