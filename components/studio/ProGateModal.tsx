"use client";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

export function ProGateModal({ onClose }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#1a0033", border: "1px solid rgba(178,33,246,0.35)",
        borderRadius: 20, padding: "40px 36px", maxWidth: 420, width: "90%",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        textAlign: "center",
      }} onClick={(e) => e.stopPropagation()}>
        {/* Lock icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 999,
          background: "linear-gradient(135deg,#B221F6,#FF6452)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: 24,
        }}>🔒</div>

        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 8, letterSpacing: -0.5 }}>
          Pro template
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, marginBottom: 28 }}>
          Promo, Showcase, Before&nbsp;&amp;&nbsp;After, Tip, Question, and Carousel are Pro templates.
          Upgrade to unlock all six — plus every future template we ship.
        </div>

        {/* Price callout */}
        <div style={{
          background: "rgba(178,33,246,0.12)", border: "1px solid rgba(178,33,246,0.25)",
          borderRadius: 12, padding: "14px 20px", marginBottom: 24,
        }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>
            $29<span style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>/mo</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
            Cancel any time · No contracts
          </div>
        </div>

        {/* Feature list */}
        <div style={{ textAlign: "left", marginBottom: 28 }}>
          {["All 6 Pro templates (6 layouts each)", "Unlimited drafts synced to cloud", "AI carousel generator", "All future templates included"].map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ color: "#B221F6", fontWeight: 700, fontSize: 16 }}>✓</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{f}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
            background: "linear-gradient(90deg,#B221F6,#FF6452)",
            color: "#fff", fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1, marginBottom: 12,
          }}
        >
          {loading ? "Redirecting…" : "Upgrade to Pro →"}
        </button>
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "10px 0", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer",
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
