"use client";

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import Hls from "hls.js";
import type { StationConfig, TransformMode } from "@/lib/stations";
import type { Anomaly, TranscriptLine, Tweaks } from "@/lib/types";
import { subjectSVG } from "@/lib/silhouettes";
import { drawSyntheticBg } from "@/lib/syntheticBg";
import { AMBIENT } from "@/lib/transcripts";
import type { AnalyzeResponse } from "@/lib/gemini";

interface Props {
  station: StationConfig;
  tweaks: Tweaks;
  onAnomaly: (ev: Anomaly) => void;
}

export interface StationHandle {
  triggerGlitch: (forceMode?: TransformMode, analysis?: AnalyzeResponse) => void;
  replayAnomaly: (ev: Anomaly) => void;
}

function fmtTs(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function resolveMode(station: StationConfig, tweaks: Tweaks): TransformMode {
  if (tweaks.stationMode === "mixed") return station.defaultMode;
  return tweaks.stationMode;
}

export const Station = forwardRef<StationHandle, Props>(function Station({ station, tweaks, onAnomaly }, ref) {
  const feedRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null); // offscreen for frame snapshots
  const subjRef = useRef<SVGGElement>(null);
  const trackerRef = useRef<SVGGElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const chRef = useRef<HTMLDivElement>(null);
  const chModeRef = useRef<HTMLSpanElement>(null);
  const chConfRef = useRef<HTMLSpanElement>(null);
  const mythRef = useRef<HTMLDivElement>(null);
  const tsRef = useRef<HTMLSpanElement>(null);

  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [streamOk, setStreamOk] = useState<"loading" | "ok" | "fail">("loading");
  const [aiState, setAiState] = useState<"idle" | "working">("idle");
  const [species, setSpecies] = useState<string | null>(null);
  const [speciesConf, setSpeciesConf] = useState<number>(0);

  // Latest analysis result (may set the glitch details)
  const latestAnalysisRef = useRef<AnalyzeResponse | null>(null);
  const stateRef = useRef<"live" | "glitching">("live");
  const glitchStartRef = useRef(0);
  const glitchDurRef = useRef(0);
  const glitchModeRef = useRef<TransformMode | null>(null);
  const glitchAnalysisRef = useRef<AnalyzeResponse | null>(null);
  const nextEventAtRef = useRef<number>(performance.now() + 10000);
  const transcriptRef = useRef<TranscriptLine[]>([]);
  const tweaksRef = useRef(tweaks);
  const capturedThumbRef = useRef<string | null>(null);

  useEffect(() => { tweaksRef.current = tweaks; }, [tweaks]);
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);

  // Update the channel's mode label whenever station mode changes
  useEffect(() => {
    if (chModeRef.current) {
      const m = resolveMode(station, tweaks);
      chModeRef.current.textContent = { sprout: "SPROUT MODE", double: "DOUBLE MODE", delir: "DELIRIUM MODE" }[m];
    }
  }, [tweaks.stationMode, station]);

  // Set up HLS playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = `/api/stream/${station.id}/playlist`;

    let hls: Hls | null = null;
    let canceled = false;

    async function attach() {
      if (!video) return;
      // Probe the playlist first — if it 500s we skip hls.js entirely.
      try {
        const head = await fetch(src, { method: "GET", cache: "no-store" });
        if (!head.ok) {
          setStreamOk("fail");
          return;
        }
      } catch {
        setStreamOk("fail");
        return;
      }
      if (canceled) return;

      if (Hls.isSupported()) {
        hls = new Hls({
          lowLatencyMode: true,
          backBufferLength: 20,
          maxBufferLength: 10,
          manifestLoadingMaxRetry: 1,
          levelLoadingMaxRetry: 1,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (canceled) return;
          video.play().then(() => setStreamOk("ok")).catch(() => setStreamOk("fail"));
        });
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) {
            console.warn(`[hls ${station.id}] fatal`, data.type, data.details);
            setStreamOk("fail");
            hls?.destroy();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.addEventListener("loadedmetadata", () => {
          video.play().then(() => setStreamOk("ok")).catch(() => setStreamOk("fail"));
        });
        video.addEventListener("error", () => setStreamOk("fail"));
      } else {
        setStreamOk("fail");
      }
    }
    attach();

    return () => {
      canceled = true;
      if (hls) hls.destroy();
    };
  }, [station.id]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    function resize() {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * DPR;
      canvas.height = r.height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    function frame(now: number) {
      render(now);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function render(now: number) {
      const W = canvas!.width / DPR;
      const H = canvas!.height / DPR;
      const video = videoRef.current;

      // Draw video frame if ready, else synthetic background
      if (video && streamOk === "ok" && video.readyState >= 2 && !video.paused) {
        try {
          // cover-fit the video into the canvas
          const vw = video.videoWidth;
          const vh = video.videoHeight;
          if (vw && vh) {
            const vr = vw / vh;
            const cr = W / H;
            let sx = 0, sy = 0, sw = vw, sh = vh;
            if (vr > cr) {
              sw = vh * cr;
              sx = (vw - sw) / 2;
            } else {
              sh = vw / cr;
              sy = (vh - sh) / 2;
            }
            ctx.drawImage(video, sx, sy, sw, sh, 0, 0, W, H);
          } else {
            drawSyntheticBg(ctx, W, H, now, station.bgHue);
          }
        } catch {
          drawSyntheticBg(ctx, W, H, now, station.bgHue);
        }
      } else {
        drawSyntheticBg(ctx, W, H, now, station.bgHue);
      }

      // Apply color cast tint to match old trail-cam feel
      ctx.fillStyle = "rgba(40, 50, 30, 0.08)";
      ctx.fillRect(0, 0, W, H);

      if (tsRef.current) tsRef.current.textContent = fmtTs();

      // Update transformation progress + render overlays
      const mode = glitchModeRef.current || resolveMode(station, tweaksRef.current);
      let wing = 0, double = 0, offset = 0, conf = 0.93;

      if (stateRef.current === "glitching") {
        const p = (now - glitchStartRef.current) / glitchDurRef.current;
        if (p >= 1) {
          endGlitch();
        } else {
          const arc = p < 0.5 ? p * 2 : 2 - p * 2;
          const eased = arc * arc * (3 - 2 * arc);
          if (mode === "sprout") { wing = eased; conf = 0.93 - eased * 0.6; }
          if (mode === "double") { double = eased; offset = eased; conf = 0.93 - eased * 0.5; }
          if (mode === "delir") { conf = 0.93 - eased * 0.8 + Math.sin(p * 50) * 0.1; }

          // Mythology overlay fade — peak at middle 60%
          if (mythRef.current && glitchAnalysisRef.current?.mythology) {
            const mythAlpha = p > 0.15 && p < 0.85 ? 1 : 0;
            mythRef.current.classList.toggle("on", mythAlpha > 0);
          }
        }
      } else {
        if (now > nextEventAtRef.current && !document.hidden) triggerGlitch();
      }

      if (chConfRef.current) chConfRef.current.textContent = `CONF ${conf.toFixed(2)}`;

      // Render subject + tracker
      if (subjRef.current) {
        subjRef.current.innerHTML = subjectSVG(station.subject, wing, double, offset);
      }
      renderTracker(mode, now);
    }

    function renderTracker(mode: TransformMode, now: number) {
      const trk = trackerRef.current;
      if (!trk) return;
      const active = stateRef.current === "glitching";
      const t = active ? (now - glitchStartRef.current) / glitchDurRef.current : 0;

      if (mode === "delir" && active) {
        const fromAI = glitchAnalysisRef.current?.delirLabels || [];
        const labels = fromAI.length ? fromAI : ["WOLF", "BEAR", "DOG?", "ANGEL?", "NO MATCH", "GOD?"];
        let html = "";
        const n = Math.min(6, 2 + Math.floor(t * 10));
        for (let i = 0; i < n; i++) {
          const cx = 140 + Math.sin(i * 1.7 + now * 0.003) * 30;
          const cy = 110 + Math.cos(i * 2.1 + now * 0.002) * 18;
          const w = 80 + ((i * 23) % 40);
          const h = 60 + ((i * 19) % 30);
          const lbl = (labels[i % labels.length] || "UNKNOWN").slice(0, 16);
          const cf = (0.5 - Math.abs(i / n - 0.5)).toFixed(2);
          html += `
            <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" class="${i === 0 ? "glitched" : ""} ${i > 2 ? "rejected" : ""}"/>
            <rect x="${cx - w / 2}" y="${cy - h / 2 - 10}" width="${lbl.length * 6 + 20}" height="9" fill="${i === 0 ? "#ff3d7f" : "#7fd87a"}" opacity="${i > 2 ? 0.5 : 1}"/>
            <text x="${cx - w / 2 + 3}" y="${cy - h / 2 - 3}" class="lbl" fill="#000" font-weight="700">${lbl} · ${cf}</text>
          `;
        }
        trk.innerHTML = html;
      } else {
        const speciesUpper = (species || station.subject).toString().toUpperCase();
        const primary = speciesUpper.slice(0, 12);
        let html = `
          <rect x="60" y="60" width="160" height="100" class="${active && mode !== "delir" ? "glitched" : ""}"/>
          <rect x="60" y="50" width="${primary.length * 6 + 24}" height="9" fill="${active ? "#ff3d7f" : "#7fd87a"}"/>
          <text x="63" y="57" class="lbl" fill="#000" font-weight="700">${primary} · ${(speciesConf || 0.9).toFixed(2)}</text>
        `;
        if (mode === "double" && active) {
          const off = Math.sin(t * Math.PI) * 40;
          html += `
            <rect x="${100 + off}" y="80" width="120" height="80" class="glitched"/>
            <rect x="${100 + off}" y="70" width="100" height="9" fill="#ff3d7f"/>
            <text x="${103 + off}" y="77" class="lbl" fill="#000" font-weight="700">${primary}² · 0.${Math.floor(30 + t * 40)}?</text>
          `;
        }
        if (mode === "sprout" && active) {
          html += `
            <rect x="70" y="32" width="140" height="50" class="glitched rejected"/>
            <text x="72" y="30" class="lbl" fill="#ff3d7f">OUTGROWTH · 0.${Math.floor(10 + t * 40)}</text>
          `;
        }
        trk.innerHTML = html;
      }
    }

    function triggerGlitch(forceMode?: TransformMode, analysis?: AnalyzeResponse) {
      if (stateRef.current === "glitching") return;
      stateRef.current = "glitching";
      glitchStartRef.current = performance.now();
      glitchDurRef.current = 4200 + Math.random() * 2000;
      glitchModeRef.current = forceMode || resolveMode(station, tweaksRef.current);
      glitchAnalysisRef.current = analysis || latestAnalysisRef.current;

      capturedThumbRef.current = snapshotFrame();

      if (statusRef.current) statusRef.current.innerHTML = `<span style="color:#ff3d7f;letter-spacing:2px">⚠ ANOMALY</span>`;
      if (chRef.current) { chRef.current.classList.remove("live"); chRef.current.classList.add("anom"); }
      if (mythRef.current) {
        const myth = glitchAnalysisRef.current?.mythology || "";
        mythRef.current.textContent = myth;
      }

      // Push AI-generated glitch transcript lines
      const lines = glitchAnalysisRef.current?.glitchLines?.length
        ? glitchAnalysisRef.current.glitchLines
        : ["[ANOMALY]", "[classifier fault]", "[UNIDENTIFIED]"];
      lines.slice(0, 3).forEach((line, i) => {
        setTimeout(() => pushLine(line, true), i * 900 + 200);
      });

      // Also generate delir labels via the secondary endpoint if needed (fire-and-forget)
      if (glitchModeRef.current === "delir" && !glitchAnalysisRef.current?.delirLabels?.length) {
        fetch("/api/glitch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "delir", subject: station.subject }),
        }).catch(() => {});
      }
    }

    function endGlitch() {
      const duration = glitchDurRef.current;
      const mode = glitchModeRef.current!;
      const analysis = glitchAnalysisRef.current;
      stateRef.current = "live";
      glitchModeRef.current = null;

      if (statusRef.current) statusRef.current.innerHTML = `<span class="rec">REC</span>`;
      if (chRef.current) { chRef.current.classList.remove("anom"); chRef.current.classList.add("live"); }
      if (mythRef.current) mythRef.current.classList.remove("on");

      const d = new Date();
      const ev: Anomaly = {
        id: `${station.id}-${Date.now()}`,
        cam: station.id,
        camName: station.name,
        subject: station.subject,
        mode,
        ts: fmtTs(d),
        date: d.toISOString().slice(0, 10),
        species: analysis?.species || species,
        mythology: analysis?.mythology || "",
        action: analysis?.action || null,
        glitchLines: analysis?.glitchLines || [],
        delirLabels: analysis?.delirLabels || [],
        capture: {
          wing: mode === "sprout" ? 0.9 : mode === "delir" ? 0 : 0.2,
          double: mode === "double" ? 0.8 : mode === "delir" ? 0 : 0,
        },
        thumbnail: capturedThumbRef.current,
        durationMs: duration,
      };
      onAnomaly(ev);

      // schedule next
      const base = { rare: 26000, normal: 13000, dense: 6500 }[tweaksRef.current.freq] || 13000;
      const jitter = base * 0.6 * (Math.random() - 0.3);
      nextEventAtRef.current = performance.now() + base + jitter + 1500;
    }

    function snapshotFrame(): string | null {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        if (!captureCanvasRef.current) {
          captureCanvasRef.current = document.createElement("canvas");
        }
        const cc = captureCanvasRef.current;
        cc.width = 320;
        cc.height = 180;
        const cctx = cc.getContext("2d")!;
        cctx.drawImage(canvas, 0, 0, cc.width, cc.height);
        return cc.toDataURL("image/jpeg", 0.7);
      } catch {
        return null;
      }
    }

    // Pull ambient transcript lines periodically
    const ambientInterval = setInterval(() => {
      if (stateRef.current === "glitching") return;
      const pool = AMBIENT[station.subject] || AMBIENT.wolf;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      pushLine(pick.join(" · "), false);
    }, 3400 + Math.random() * 2600);

    function pushLine(text: string, glitch: boolean) {
      const ts = fmtTs();
      setTranscript((prev) => {
        const next = [{ ts, text, glitch }, ...prev].slice(0, 4);
        return next;
      });
    }

    // Seed initial next event
    const base = { rare: 26000, normal: 13000, dense: 6500 }[tweaksRef.current.freq] || 13000;
    nextEventAtRef.current = performance.now() + base + Math.random() * 4000;

    // Gemini frame analysis loop — every 10s send the current composite to /api/analyze
    const aiInterval = setInterval(async () => {
      if (document.hidden) return;
      const frame = snapshotFrame();
      if (!frame) return;
      setAiState("working");
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ camId: station.id, frame }),
        });
        if (res.ok) {
          const data: AnalyzeResponse = await res.json();
          latestAnalysisRef.current = data;
          if (data.species) setSpecies(data.species);
          setSpeciesConf(data.confidence);
          // If AI detects something with high confidence AND we're live AND not scheduled imminently,
          // advance the next event so it fires within a couple seconds — "Gemini saw something".
          if (data.detected && data.confidence > 0.65 && stateRef.current === "live") {
            const inTwo = performance.now() + 1800 + Math.random() * 2400;
            if (inTwo < nextEventAtRef.current) nextEventAtRef.current = inTwo;
          }
        }
      } catch (err) {
        // silent — fallback already built into the analysis
      } finally {
        setAiState("idle");
      }
    }, 10000);

    // Expose trigger to imperative handle
    (feedRef.current as any).__triggerGlitch = triggerGlitch;

    // Kick off a seeded first event for this station (staggered by station id hash)
    const seedDelay = 3500 + (station.id.charCodeAt(4) * 1700) % 8000;
    const seedTimeout = setTimeout(() => {
      if (stateRef.current === "live") {
        nextEventAtRef.current = performance.now();
      }
    }, seedDelay);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(ambientInterval);
      clearInterval(aiInterval);
      clearTimeout(seedTimeout);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station.id, streamOk]);

  useImperativeHandle(ref, () => ({
    triggerGlitch: (forceMode?: TransformMode, analysis?: AnalyzeResponse) => {
      const fn = (feedRef.current as any)?.__triggerGlitch;
      if (fn) fn(forceMode, analysis);
    },
    replayAnomaly: (ev: Anomaly) => {
      const fn = (feedRef.current as any)?.__triggerGlitch;
      if (fn) {
        fn(ev.mode, {
          detected: true,
          species: ev.species,
          confidence: 0.85,
          action: ev.action,
          glitchLines: ev.glitchLines,
          mythology: ev.mythology,
          delirLabels: ev.delirLabels,
        });
      }
    },
  }));

  return (
    <div className="station">
      <div className="feed" ref={feedRef}>
        <video
          className="stream"
          ref={videoRef}
          muted
          playsInline
          autoPlay
          crossOrigin="anonymous"
        />
        <canvas className="bg" ref={canvasRef} />
        <svg className="overlay" viewBox="0 0 280 180" preserveAspectRatio="xMidYMid meet">
          <g className="subject xform" ref={subjRef as any} />
          <g className="tracker" ref={trackerRef as any} />
        </svg>
        <div className="scanlines" />
        <div className="vignette" />
        <div className="hud">
          <span className="tl">{station.id.toUpperCase()} · {station.name}</span>
          <span className="tr" ref={statusRef}>
            <span className="rec">REC</span>
          </span>
          <span className="bl" ref={tsRef}>—</span>
          <span className="br">{station.sub}</span>
        </div>
        {species && (
          <div className={`species-tag ${speciesConf < 0.5 ? "unknown" : ""}`}>
            {species.toUpperCase()} · {speciesConf.toFixed(2)}
          </div>
        )}
        <div className="myth" ref={mythRef} />
      </div>
      <div className={`ch live`} ref={chRef}>
        <span>
          <span className="dot"></span>
          {streamOk === "ok" ? "LIVE" : streamOk === "loading" ? "CONNECTING" : "SYNTH FALLBACK"} ·{" "}
          <span ref={chModeRef}>—</span>
        </span>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className={`ai-badge ${aiState}`}>GEMINI {aiState === "working" ? "ANALYZING" : "VISION"}</span>
          <span ref={chConfRef}>CONF 0.93</span>
        </span>
      </div>
      <div className="transcript">
        {transcript.map((l, i) => (
          <div key={`${l.ts}-${i}`}>
            <span className="ts">[{l.ts}]</span>{" "}
            <span className={l.glitch ? "glitch" : "q"}>{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
