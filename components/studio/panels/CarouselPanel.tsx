"use client";
import { useState } from "react";

const QUICK_PICKS = [3, 5, 7, 10];

interface Props {
  onGenerate: (prompt: string, count: number) => void;
  aiBusy: boolean;
}

export function CarouselPanel({ onGenerate, aiBusy }: Props) {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(5);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt, count);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label className="ctl-label" style={{ marginBottom: 6 }}>What&apos;s the carousel about?</label>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. 5 reasons to choose custom screen printing for your school fundraiser"
          style={{
            width: "100%", border: "1px solid var(--border)", borderRadius: 8,
            padding: "10px 12px", fontFamily: "inherit", fontSize: 13, lineHeight: 1.4,
            color: "var(--fg)", background: "#fff", resize: "vertical",
          }}
        />
      </div>

      <div>
        <div className="ctl-label" style={{ marginBottom: 6 }}>
          Slides — {count}
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {QUICK_PICKS.map((n) => (
            <button
              key={n}
              className={`seg-b ${count === n ? "on" : ""}`}
              onClick={() => setCount(n)}
              style={{ flex: 1 }}
            >
              {n}
            </button>
          ))}
        </div>
        <input
          type="range" min={3} max={12} step={1} value={count}
          onChange={(e) => setCount(+e.target.value)}
          className="slider"
        />
        <div className="slider-marks">
          <span>3</span>
          <span>7</span>
          <span>12</span>
        </div>
      </div>

      <button
        className="primary big"
        disabled={aiBusy || !prompt.trim()}
        onClick={handleGenerate}
      >
        {aiBusy ? "Drafting…" : `Generate ${count}-card carousel`}
      </button>

      <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>
        Replaces existing carousel slides. All other templates are preserved.
      </div>
    </div>
  );
}
