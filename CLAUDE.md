# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow rule — always land via PR

**Never push directly to `main`.** Every change (even a one-line fix, even a HANDOFF update) must land through a pull request that the human reviews. Work on the task branch, push it, open a PR via the GitHub MCP, and stop there. Do not fast-forward, merge, or push `main` yourself. If the user says "push to main," interpret that as "get this in front of me to review" — open a PR and ask.

## Commands

```bash
npm run dev      # Next.js dev server at http://localhost:3000
npm run build    # production build (runs TypeScript check)
npm run start    # run production build
npm run lint     # next lint
```

No test suite yet. Validate changes with `npm run build` (catches type errors) plus a dev-server spot check against `http://localhost:3000`.

## What this project is

A production build of a design prototype from `claude.ai/design`. The original prototype lives in `project/Station Four - Live Testbed.html` (self-contained HTML/CSS/JS). That file is the **visual source of truth** — when changing UI, match its palette, typography, layout, and transformation behavior. The chat transcripts in `chats/` explain *why* the design landed where it did — read them before making design decisions (especially `chats/chat1.md`).

Reference images from the original design session are in `project/uploads/`. A textual reference for the running build (per-station state, archive panel, tweaks overlay) is captured in `project/prototype-reference.md` — read that file when reasoning about the live UI.

## Architecture — non-obvious pieces

### Single API key, four Google services

`GEMINI_API_KEY` in `.env.local` is used for **every** Google API call, not just Gemini:

- `lib/gemini.ts` → Generative Language API
- `lib/speech.ts` → Cloud Speech-to-Text (`speech.googleapis.com`)
- `lib/motion.ts` → Cloud Video Intelligence (`videointelligence.googleapis.com`)
- `app/api/live-status/[cam]/route.ts` → YouTube Data API v3

All four APIs must be enabled on the same Google Cloud project that owns the key. `.env.example` documents this.

### Stream pipeline (this is the tricky part)

Browsers can't `drawImage()` a YouTube iframe to canvas because of CORS — but we need pixel access for overlays and motion detection. The solution:

1. `app/api/stream/[cam]/playlist/route.ts` uses `youtubei.js` (InnerTube API) to extract the HLS manifest URL from a YouTube live video ID.
2. It fetches that `.m3u8`, rewrites every segment URL to route back through `app/api/stream/[cam]/segment/route.ts` (which proxies, host-allowlisted to googlevideo/youtube), and serves the rewritten playlist to the browser.
3. Browser-side, `hls.js` plays the proxied playlist into a hidden `<video>`. `components/Station.tsx` calls `ctx.drawImage(video, ...)` every animation frame into the overlay canvas.

**If YouTube is unreachable from the server** (common in sandboxed envs — the dev env `/home/claude/repo` cannot reach `googlevideo.com`), the playlist route returns 500. The client probes the playlist with a `fetch()` before initializing hls.js and falls back to `lib/syntheticBg.ts` — animated canvas backgrounds per `BgHue`. The AI pipeline keeps running on the synthetic output.

### Division of labor for the "transformation" pipeline

The design concept is: feeds play normally, then motion triggers a brief hallucination (sprout / double / classifier delirium), archived, feed resumes. Services are split by role:

- **Cloud Video Intelligence** (`lib/motion.ts`) — motion/object detection on rolling video clips; answers "did anything happen". Drives transformation triggers.
- **Cloud Speech-to-Text** (`lib/speech.ts`) — real audio transcripts from the stream's audio track.
- **Gemini 2.5 Flash** (`lib/gemini.ts`) — **creative text only**: mythology sentence, glitch transcript lines, delirium classifier labels. Called *after* Video Intelligence identifies a species.
- **YouTube Data API** (`app/api/live-status/[cam]/route.ts`) — live status, title, concurrent viewers for HUD.
- **Gemini vision fallback** (`visionFallback()` in `lib/gemini.ts`, exposed via `/api/analyze`) — only used when Video Intelligence is unavailable; does motion+species+text in a single multimodal call.

Every external API is wrapped to degrade quietly: Speech/Motion endpoints return `{ blocked: true, ... }` with an empty result on 403/API_KEY_SERVICE_BLOCKED so the UI stays responsive.

### Station state machine

Each station is an instance of the `Station` component. Per-station state (not in React state — kept in refs to survive the render loop):

- `state: "live" | "glitching"`
- `glitchStart`, `glitchDur`, `glitchMode`, `glitchAnalysis`
- `nextEventAt` — when to trigger next transformation (set by timer in current code; will be set by motion detection in the rewire)

The render loop runs inside a single `useEffect` in `components/Station.tsx`. It's a `requestAnimationFrame` loop that draws the video frame, computes transformation progress (`p = (now - start) / duration`), and re-renders SVG overlays. The AI loop is a separate `setInterval`.

### Archive persistence

Anomalies persist to `localStorage` under `station-four-anomalies`, scoped to the current day (filtered by `date` field in `loadAnomalies()`). Tweaks persist under `station-four-tweaks`. No server-side persistence.

Archive modes (`counter` / `strip` / `feed`) are three **different rhetorical postures**, not just three layouts — the prototype's design argument is that the container makes a claim about what the archive is *for*. Preserve the tone and copy in `components/ArchivePanel.tsx` when editing.

### Four stations (`lib/stations.ts`)

| ID | Subject | YouTube | Default mode |
|---|---|---|---|
| cam-01 | wolf | `CYl_uPm7yto` | double |
| cam-02 | deer | `2BDnAMR3GLg` | sprout |
| cam-03 | bird | `x10vL6_47Dw` | delir |
| cam-04 | polar | `lyX7ZxWU64A` | sprout |

Subject silhouettes live in `lib/silhouettes.ts` (one `subjectSVG()` per subject, parameterized by `wing`, `double`, `offset`). Add a new subject by extending the `Subject` union in `lib/stations.ts` and adding a branch to `subjectSVG`.

### Known in-progress rewire

`components/Station.tsx` currently uses a timer-scheduled trigger plus a Gemini-vision poll (`/api/analyze` every 10s). The intended architecture calls `/api/motion` on rolling 8-second video clips from `canvas.captureStream()` and `/api/speech` on audio captured via `MediaElementSource` → `MediaStreamDestination`. `lib/clipRecorder.ts` is the ready helper for this. When `hasMotion` comes back true, pull `nextEventAt` forward and call `/api/mythology` for creative text. Speech transcripts feed the ambient transcript (currently pulled from `lib/transcripts.ts` pools).

## When in doubt

Read `chats/chat1.md` first, then `project/Station Four - Live Testbed.html`, then `SETUP.md`. The visual spec (palette, typography, tone) is frozen by the design phase — production code should match it, not reinvent it.
