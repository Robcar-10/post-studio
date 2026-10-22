"use client";
import { useState, useRef, type ChangeEvent } from "react";
import type { BrandVoice } from "@/lib/types";
import { saveBrandVoice, VOICE_LEAN_OPTIONS } from "@/lib/brandVoice";

interface Props {
  value: BrandVoice;
  onChange: (v: BrandVoice) => void;
  onClose: () => void;
}

export function BrandVoiceModal({ value, onChange, onClose }: Props) {
  const [draft, setDraft] = useState<BrandVoice>({ ...value });
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<BrandVoice>) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/logo", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      set({ logoUrl: data.url });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLogoUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      // Always persist locally as fallback
      saveBrandVoice(draft);

      // Attempt cloud save — silently succeeds for logged-out users via 401
      const res = await fetch("/api/brand-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok && res.status !== 401) {
        const d = await res.json();
        throw new Error(d.error ?? "Save failed");
      }

      onChange(draft);
      onClose();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const listField = (key: "usePhrases" | "avoidPhrases", label: string, placeholder: string) => (
    <div className="bv-field">
      <label>{label}</label>
      <textarea
        rows={3}
        value={(draft[key] || []).join("\n")}
        onChange={(e) => set({ [key]: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
        placeholder={placeholder}
      />
      <div className="bv-hint">One per line</div>
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
              color: "var(--purple)", marginBottom: 4 }}>Settings</div>
            <div className="modal-title">Brand Kit</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              Colors, logo, and voice — saved to your account and used by AI.
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", maxHeight: "70vh" }}>

          {/* ── Colors ── */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
              color: "var(--muted)", marginBottom: 12 }}>Brand Colors</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div className="bv-field" style={{ flex: 1, marginBottom: 0 }}>
                <label>Primary color</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="color"
                    value={draft.colorPrimary}
                    onChange={(e) => set({ colorPrimary: e.target.value })}
                    style={{ width: 44, height: 36, padding: 2, border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer" }}
                  />
                  <input
                    type="text"
                    value={draft.colorPrimary}
                    onChange={(e) => set({ colorPrimary: e.target.value })}
                    style={{ flex: 1, fontFamily: "monospace", fontSize: 13 }}
                    placeholder="#B221F6"
                    maxLength={7}
                  />
                </div>
              </div>
              <div className="bv-field" style={{ flex: 1, marginBottom: 0 }}>
                <label>Secondary color</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="color"
                    value={draft.colorSecondary}
                    onChange={(e) => set({ colorSecondary: e.target.value })}
                    style={{ width: 44, height: 36, padding: 2, border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer" }}
                  />
                  <input
                    type="text"
                    value={draft.colorSecondary}
                    onChange={(e) => set({ colorSecondary: e.target.value })}
                    style={{ flex: 1, fontFamily: "monospace", fontSize: 13 }}
                    placeholder="#FF6452"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Logo ── */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
              color: "var(--muted)", marginBottom: 12 }}>Logo</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {draft.logoUrl ? (
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={draft.logoUrl}
                    alt="Logo"
                    style={{ width: 72, height: 72, objectFit: "contain", border: "1px solid var(--border)",
                      borderRadius: 8, background: "#f6f4ef", padding: 4 }}
                  />
                  <button
                    onClick={() => set({ logoUrl: null })}
                    style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%",
                      background: "var(--ink)", color: "#fff", border: "none", cursor: "pointer",
                      fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >×</button>
                </div>
              ) : (
                <div style={{ width: 72, height: 72, border: "2px dashed var(--border)", borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--muted)", fontSize: 11, flexShrink: 0, background: "#fafafa" }}>
                  No logo
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  style={{ display: "none" }}
                  onChange={handleLogoUpload}
                />
                <button
                  className="ghost"
                  style={{ width: "100%" }}
                  disabled={logoUploading}
                  onClick={() => logoInputRef.current?.click()}
                >
                  {logoUploading ? "Uploading…" : draft.logoUrl ? "Replace logo" : "Upload logo"}
                </button>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                  PNG, JPG, WebP, or SVG — used as an overlay in supported templates.
                </div>
              </div>
            </div>
          </div>

          {/* ── Voice ── */}
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
            color: "var(--muted)", marginBottom: -8 }}>Brand Voice</div>

          <div className="bv-field">
            <label>Business name</label>
            <input type="text" value={draft.business} onChange={(e) => set({ business: e.target.value })}
              placeholder="Acme Custom Tees"/>
          </div>

          <div className="bv-field">
            <label>Location</label>
            <input type="text" value={draft.location} onChange={(e) => set({ location: e.target.value })}
              placeholder="City, State"/>
          </div>

          <div className="bv-field">
            <label>What you do</label>
            <textarea rows={2} value={draft.whatWeDo} onChange={(e) => set({ whatWeDo: e.target.value })}
              placeholder="1–2 sentences describing your products and customers"/>
          </div>

          <div className="bv-field">
            <label>Voice lean</label>
            <div className="seg" style={{ flexWrap: "wrap" }}>
              {VOICE_LEAN_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className={`seg-b ${draft.voiceLean === opt.id ? "on" : ""}`}
                  onClick={() => set({ voiceLean: opt.id })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {listField("usePhrases", "Words / phrases to use", "no minimums\nfree store setup\ncustom gear")}
          {listField("avoidPhrases", "Words / phrases to avoid", "leverage\nsynergy\ngame-changer")}

          <div className="bv-field">
            <label>Sample line (optional)</label>
            <input type="text" value={draft.sampleLine}
              onChange={(e) => set({ sampleLine: e.target.value })}
              placeholder="A line that sounds exactly like your brand"/>
          </div>

          <div className="bv-field">
            <label>Default CTA</label>
            <input type="text" value={draft.ctaDefault}
              onChange={(e) => set({ ctaDefault: e.target.value })}
              placeholder="Message us to get started →"/>
          </div>

          <label className="toggle">
            <input type="checkbox" checked={draft.includeEmoji}
              onChange={(e) => set({ includeEmoji: e.target.checked })}/>
            <span>Allow emoji in AI copy (0–2 max)</span>
          </label>

          {saveError && (
            <div style={{ fontSize: 12, color: "#d00", background: "#fff0f0", border: "1px solid #fcc",
              borderRadius: 6, padding: "8px 12px" }}>
              {saveError}
            </div>
          )}
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="ghost" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save brand kit"}
          </button>
        </div>
      </div>
    </div>
  );
}
