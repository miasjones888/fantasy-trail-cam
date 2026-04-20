# Fantasy Trail Cam — Station Four

Production build of the Station Four live-testbed design. Four live wildlife
feeds pulled from YouTube, proxied through an HLS-rewriting Next.js server so
they land in a canvas the page can actually read pixels from, with every
frame analyzed by Gemini 2.5 Flash. When Gemini finds an animal, the station
glitches — sprouting wings, splitting in two, or spiralling into classifier
delirium — with mythology text and transcript glitches written by Gemini in
real time.

## Four stations

| ID | Cam | Subject | YouTube |
|---|---|---|---|
| cam-01 | International Wolf Center · Ely MN | Wolves | `CYl_uPm7yto` |
| cam-02 | Transylvania Wilds · Romania | Deer (+ bears, wolves) | `2BDnAMR3GLg` |
| cam-03 | Cornell FeederWatch · Sapsucker Woods | Birds (4K) | `x10vL6_47Dw` |
| cam-04 | Wapusk Cape South · Hudson Bay | Polar bears | `lyX7ZxWU64A` |

## Run it

```bash
npm install
# .env.local already contains GEMINI_API_KEY
npm run dev     # http://localhost:3000
```

## Architecture

```
Browser                                      Next.js API routes
────────────                                 ────────────────────
<video hidden>     ←── /api/stream/:cam/playlist   (HLS proxy)
  └ hls.js                                  │  └ youtubei.js → HLS manifest URL
canvas ← drawImage(video)                   │  └ rewrites segment URLs to point here
  ├ SVG overlays: subject silhouette,       │
  │   tracker boxes, mythology text         ← /api/stream/:cam/segment (HLS proxy)
  └ every 10s:                              │  └ allowlists googlevideo/youtube hosts
    canvas.toDataURL → POST /api/analyze    │
                                            ← /api/analyze
                                            │  └ Gemini 2.5 Flash (vision):
                                            │      { species, confidence,
                                            │        mythology, glitchLines,
                                            │        delirLabels }
                                            ← /api/glitch
                                               └ Gemini 2.5 Flash (text only):
                                                   { lines: [...] }
```

When Gemini sees an animal with confidence > 0.65, the station's next
transformation event is pulled forward to ~2 seconds. The mythology line,
glitch transcript, and delirium labels shown during that event all came from
Gemini's reading of what was actually on-camera.

If a stream fails to load, the station transparently falls back to the
prototype's synthetic canvas animation. Gemini still analyzes what's visible,
so the mythology/glitch pipeline keeps running even without a live feed.

## Network requirements

- **YouTube (googlevideo.com) must be reachable** from the Next.js server —
  this is where the HLS manifests and segments come from. Many cloud
  sandboxes block YouTube; if `/api/stream/cam-XX/playlist` returns 500, that's
  why.
- **generativelanguage.googleapis.com** for Gemini. If you see `503
  Service Unavailable`, retry — it's transient, and the code already retries
  twice automatically.

## Files

```
app/page.tsx                       Main Station Four page
app/layout.tsx                     Fonts + globals.css
app/globals.css                    All design tokens + component styles
app/api/stream/[cam]/playlist/     HLS playlist proxy
app/api/stream/[cam]/segment/      HLS segment proxy (with host allowlist)
app/api/analyze/                   Gemini Vision frame analysis
app/api/glitch/                    Gemini text-only glitch lines
components/Station.tsx             hls.js + canvas + transformation loop
components/ArchivePanel.tsx        Counter / Strip / Feed archive modes
components/TweaksPanel.tsx         Station mode, archive mode, frequency
lib/stations.ts                    Station config (cam IDs, subjects)
lib/gemini.ts                      Gemini client + prompts + retry
lib/youtube.ts                     InnerTube → HLS manifest
lib/silhouettes.ts                 Subject SVG silhouettes (wolf, deer, bird, polar)
lib/syntheticBg.ts                 Fallback animated backgrounds
lib/transcripts.ts                 Ambient transcript pools
lib/types.ts                       Shared types
```

## Known gaps from the design doc

- **Google Speech-to-Text on live audio** was in the original spec but needs
  a separate Google Cloud project + billing (different from a Gemini API
  key). The transcript system uses Gemini-generated lines plus ambient pools
  instead.
- Archive persists to `localStorage`, scoped to the current day. No
  server-side persistence yet.
