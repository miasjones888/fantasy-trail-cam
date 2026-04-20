"use client";

import { useState } from "react";
import type { Tweaks } from "@/lib/types";

interface Props {
  tweaks: Tweaks;
  onChange: (next: Tweaks) => void;
  onTriggerRandom: () => void;
}

export function TweaksPanel({ tweaks, onChange, onTriggerRandom }: Props) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button className="tweaks-open" onClick={() => setOpen(true)}>
        ⚙ TWEAKS
      </button>
    );
  }

  return (
    <div className="tweaks">
      <h3>
        <span>⚙ STATION FOUR · TWEAKS</span>
        <button className="close" onClick={() => setOpen(false)} aria-label="Close">
          ×
        </button>
      </h3>

      <label>STATION MODE</label>
      <div className="row">
        {(["mixed", "sprout", "double", "delir"] as const).map((v) => (
          <div
            key={v}
            className={`opt ${tweaks.stationMode === v ? "active" : ""}`}
            onClick={() => onChange({ ...tweaks, stationMode: v })}
          >
            {v === "delir" ? "DELIR." : v.toUpperCase()}
          </div>
        ))}
      </div>

      <label>ARCHIVE MODE</label>
      <div className="row">
        {(["counter", "strip", "feed"] as const).map((v) => (
          <div
            key={v}
            className={`opt ${tweaks.archiveMode === v ? "active" : ""}`}
            onClick={() => onChange({ ...tweaks, archiveMode: v })}
          >
            {v.toUpperCase()}
          </div>
        ))}
      </div>

      <label>EVENT FREQUENCY</label>
      <div className="row">
        {(["rare", "normal", "dense"] as const).map((v) => (
          <div
            key={v}
            className={`opt ${tweaks.freq === v ? "active" : ""}`}
            onClick={() => onChange({ ...tweaks, freq: v })}
          >
            {v.toUpperCase()}
          </div>
        ))}
      </div>

      <button className="trigger" onClick={onTriggerRandom}>
        ⚡ TRIGGER EVENT NOW
      </button>
    </div>
  );
}
