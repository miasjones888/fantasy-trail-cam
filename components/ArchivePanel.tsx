"use client";

import type { Anomaly, Tweaks } from "@/lib/types";

interface Props {
  anomalies: Anomaly[];
  tweaks: Tweaks;
  onReplay: (ev: Anomaly) => void;
}

export function ArchivePanel({ anomalies, tweaks, onReplay }: Props) {
  const total = anomalies.length;
  const modeName = { counter: "COUNTER", strip: "THUMBNAIL STRIP", feed: "ANOMALY FEED" }[tweaks.archiveMode];

  return (
    <aside className="archive">
      <h2>Anomaly Archive</h2>
      <div className="ah">
        MODE · <span>{modeName}</span> · <span>{String(total).padStart(3, "0")} LOGGED</span>
      </div>

      {total === 0 && <div className="empty">Waiting for the first event…</div>}

      {total > 0 && tweaks.archiveMode === "counter" && <CounterView anomalies={anomalies} />}
      {total > 0 && tweaks.archiveMode === "strip" && <StripView anomalies={anomalies} onReplay={onReplay} />}
      {total > 0 && tweaks.archiveMode === "feed" && <FeedView anomalies={anomalies} onReplay={onReplay} />}

      <div className="legend">
        <b>ARCHIVE MODES</b>
        <br />
        <span style={{ color: "var(--ir)" }}>Counter</span> — just the number, growing
        <br />
        <span style={{ color: "var(--ir)" }}>Thumbnail strip</span> — scrubbable, click to replay
        <br />
        <span style={{ color: "var(--ir)" }}>Anomaly feed</span> — full metadata, transcript snippet, shareable
        <br />
        <br />
        <b>STATION MODES</b>
        <br />
        <span style={{ color: "var(--forest)" }}>Sprouting</span> — body grows wings/antlers
        <br />
        <span style={{ color: "var(--forest)" }}>Doubling</span> — briefly two silhouettes
        <br />
        <span style={{ color: "var(--forest)" }}>Classifier delirium</span> — boxes lie; body stays
        <br />
        <span style={{ color: "var(--forest)" }}>Mixed</span> — each station does its own
      </div>
    </aside>
  );
}

function CounterView({ anomalies }: { anomalies: Anomaly[] }) {
  const total = anomalies.length;
  const byMode = anomalies.reduce<Record<string, number>>((a, e) => ((a[e.mode] = (a[e.mode] || 0) + 1), a), {});
  const byCam = anomalies.reduce<Record<string, number>>((a, e) => ((a[e.camName] = (a[e.camName] || 0) + 1), a), {});

  return (
    <>
      <div className="counter">
        {String(total).padStart(3, "0")}
        <small>ANOMALIES LOGGED · TODAY</small>
      </div>
      <div style={{ marginTop: 22, fontSize: 10, lineHeight: 1.7, color: "var(--ink)" }}>
        <b style={{ color: "var(--dim)", letterSpacing: 1.5, fontSize: 9 }}>BY MODE</b>
        {Object.entries(byMode).map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px dotted var(--rule)",
              padding: "3px 0",
            }}
          >
            <span>{k.toUpperCase()}</span>
            <span style={{ color: "var(--ir)" }}>{String(v).padStart(2, "0")}</span>
          </div>
        ))}
        <div style={{ height: 10 }} />
        <b style={{ color: "var(--dim)", letterSpacing: 1.5, fontSize: 9 }}>BY STATION</b>
        {Object.entries(byCam).map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px dotted var(--rule)",
              padding: "3px 0",
            }}
          >
            <span>{k}</span>
            <span style={{ color: "var(--ir)" }}>{String(v).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, fontSize: 10, color: "var(--dim)", fontStyle: "italic", lineHeight: 1.6 }}>
        The counter mode keeps no evidence. Each anomaly is witnessed, tallied, forgotten. The project's only promise is
        the count itself.
      </div>
    </>
  );
}

function StripView({ anomalies, onReplay }: { anomalies: Anomaly[]; onReplay: (ev: Anomaly) => void }) {
  const latest = anomalies.slice(0, 36);
  return (
    <>
      <div className="thumb-strip">
        {latest.map((e) => (
          <div key={e.id} className="thumb" title={`${e.camName} · ${e.ts}`} onClick={() => onReplay(e)}>
            {e.thumbnail ? (
              <img src={e.thumbnail} alt="" />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#0e1410" }} />
            )}
            <div className="tl-ts">{e.ts}</div>
            <div className="tl-cam">{e.cam.slice(-2)}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: "var(--dim)", lineHeight: 1.6 }}>
        <b style={{ color: "var(--ink)", letterSpacing: 1.5, fontSize: 9 }}>{latest.length} CAPTURES</b>
        <br />
        Click any thumbnail to replay that event on its source station. The strip holds the last 36.
      </div>
      <div style={{ marginTop: 16, fontSize: 10, color: "var(--dim)", fontStyle: "italic", lineHeight: 1.6 }}>
        The strip commits to the captures but not to their meaning. Scrubbable, shareable, quotidian — a feed of
        prophecies.
      </div>
    </>
  );
}

function FeedView({ anomalies, onReplay }: { anomalies: Anomaly[]; onReplay: (ev: Anomaly) => void }) {
  const list = anomalies.slice(0, 24);
  return (
    <div className="feed-list">
      {list.map((e) => (
        <div key={e.id} className="anom" onClick={() => onReplay(e)}>
          <div className="ah-row">
            <span className="cam">{e.camName}</span>
            <span>{e.date} · {e.ts}</span>
          </div>
          <div className="title">
            {e.mythology ||
              (e.mode === "sprout"
                ? "The body grew something."
                : e.mode === "double"
                ? "Two bodies where one was."
                : "The apparatus argued with itself.")}
          </div>
          <div className="body">
            {e.mode === "sprout"
              ? `A ${e.species || e.subject}${e.action ? ` (${e.action})` : ""} held an outgrowth for ${(e.durationMs / 1000).toFixed(1)}s. Canopy undisturbed. Classifier confidence collapsed from 0.93 to 0.31.`
              : e.mode === "double"
              ? `A second silhouette resolved alongside the primary subject for ${(e.durationMs / 1000).toFixed(1)}s. Tracker assigned two IDs. The feed does not record which was the original.`
              : `Classifier produced ${e.delirLabels.length || 4} contradicting bodies during a window of ${(e.durationMs / 1000).toFixed(1)}s. Subject geometry unchanged. Labels included: ${e.delirLabels.slice(0, 4).map((l) => `"${l}"`).join(", ") || '"unknown"'}.`}
          </div>
          {e.thumbnail && <img className="captured" src={e.thumbnail} alt="" />}
          {e.glitchLines.length > 0 && (
            <div className="glitch-snip">
              {e.glitchLines.map((l, i) => (
                <div key={i}>
                  <span className="dim">[{e.ts}]</span> {l}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
