# Handoff — Fantasy Trail Cam / Station Four

**Date:** 2026-04-20
**Repo:** https://github.com/miasjones888/fantasy-trail-cam
**Branch:** `main` @ `60cbc4d`

## What this is

A production build of the Station Four live-testbed design (from `claude.ai/design`). Four live wildlife cams → an HLS proxy → a composited canvas with SVG overlays → periodic AI analysis → timed "transformation events" (sprout, double, delirium) that archive to the right-hand panel.

Design source of truth: `project/Station Four - Live Testbed.html` + `chats/chat1.md`.
Deep orientation: `CLAUDE.md` (for Claude Code), `SETUP.md` (for humans).

## Current state — what works

| Piece | Status |
|---|---|
| Next.js 14 app scaffold, TS strict, builds clean | ✅ |
| HLS proxy (YouTube manifest via `youtubei.js` → rewritten segments via host allowlist) | ✅ |
| `hls.js` + `<video>` + canvas composite pipeline | ✅ |
| Subject silhouettes (wolf, deer, bird, polar) | ✅ |
| Synthetic background fallback (4 palettes) when streams fail | ✅ |
| Sprout / double / delirium transformation animations | ✅ |
| Archive panel — counter / strip / feed (all three modes, design-accurate) | ✅ |
| Tweaks panel — station mode, archive mode, frequency, trigger-now | ✅ |
| `localStorage` persistence for tweaks + anomalies (day-scoped) | ✅ |
| **Gemini 2.5 Flash** — creative text (mythology, glitch lines, delirium labels) via `/api/mythology` | ✅ |
| **Gemini vision fallback** — `/api/analyze` for when motion API is down | ✅ |
| **Cloud Speech-to-Text** — `/api/speech` route + `lib/speech.ts` client | ✅ built, not yet wired to UI |
| **Cloud Video Intelligence** — `/api/motion` route + `lib/motion.ts` client (LABEL_DETECTION + OBJECT_TRACKING) | ✅ built, not yet wired to UI |
| **YouTube Data API** — `/api/live-status/[cam]` for HUD metadata | ✅ built, not yet surfaced in UI |
| `lib/clipRecorder.ts` — rolling MediaRecorder helper for audio + canvas streams | ✅ ready to use |

## Where I stopped — the in-progress rewire

**`components/Station.tsx` is still on the pre-refactor pipeline**: random timer + Gemini-vision poll every 10s (`/api/analyze`). The second-pass architecture was agreed but the client-side rewire wasn't finished.

The intended flow, per the division-of-labor decision:

```
Station render loop (already exists)
  │
  ├─ canvas.captureStream(15fps) → lib/clipRecorder (8s clips)
  │     → POST /api/motion → Cloud Video Intelligence
  │     → if hasMotion && animal object detected:
  │           pull nextEventAt forward by ~2s
  │           species/action passed into the glitch state
  │           fetch /api/mythology (species, mode, station) for creative text
  │
  ├─ <video> audio via MediaElementSource → MediaStreamDestination
  │     → lib/clipRecorder (5s audio clips, WEBM_OPUS)
  │     → POST /api/speech → Cloud Speech-to-Text
  │     → feed transcripts into the ambient transcript display
  │         (during glitch, these are REPLACED by /api/mythology glitchLines)
  │
  └─ Once per minute: fetch /api/live-status/[cam]
        → display title, concurrentViewers somewhere in HUD
```

### Concrete next steps

1. In `components/Station.tsx`, add two `useEffect`s per station:
   - **Video clip loop**: `canvas.captureStream()` → `startRollingClip` (from `lib/clipRecorder.ts`) with `durationMs: 8000`, mime `video/webm` → `POST /api/motion` → on `hasMotion`, set `nextEventAtRef.current = performance.now() + 1500` and stash `latestAnalysisRef.current = { species: objects[0].entity, ... }`.
   - **Audio clip loop**: grab the `<video>` element, `new AudioContext()`, `createMediaElementSource`, pipe to a `MediaStreamDestination`, pass that stream to `startRollingClip` with `durationMs: 5000`, mime `audio/webm;codecs=opus` → `POST /api/speech` → when a transcript returns with `text.length > 0`, push to transcript as a non-glitch line. **Also connect back to `audioCtx.destination`** so the user can still hear the stream (unless muted).

2. In `triggerGlitch`, replace the current "call `/api/glitch` for delir labels" with a single `/api/mythology` call that returns `mythology`, `glitchLines`, and `delirLabels` in one shot. The `glitchAnalysisRef.current` then holds everything the renderer needs.

3. Remove the 10-second polling to `/api/analyze`. It becomes pure fallback — only called if `/api/motion` returns `{ blocked: true }` or fails.

4. Add a `useEffect` that fetches `/api/live-status/:cam` on mount and every 60s. Surface `concurrentViewers` and `isLive` somewhere in the station HUD (the `br` corner is a natural home).

### Gotchas for that rewire

- **MediaRecorder browser support**: Safari's WebM support is spotty. `lib/clipRecorder.ts` already iterates through candidate mime types — use that.
- **Audio playback vs. capture**: `createMediaElementSource()` detaches audio from the default output. You must connect the source to both `audioCtx.destination` (so it's audible) *and* the `MediaStreamDestination` (for the recorder).
- **Cost**: Video Intelligence is ~$0.10/min of analyzed video. Four stations × one 8-second clip every ~15s = $3–4 per minute of runtime. Consider throttling when `document.hidden` or the tab is unfocused (there's already a `document.hidden` check in the current render loop for triggers).
- **Cloud Video Intelligence sync limit**: the non-streaming API needs the clip under 10MB. 8s of 640×360 WebM @ VP9 fits comfortably.
- **Same API key, four services**: `GEMINI_API_KEY` in `.env.local` is used for Gemini, Speech, Video Intelligence, *and* YouTube Data. All four must be enabled on the same Google Cloud project.

## Environment notes

- **The sandbox this was built in cannot reach `googlevideo.com` or `youtube.com`** (403 on all outbound). Locally, with a normal network, the HLS proxy works end-to-end.
- **The sandbox DNS was flaky** when probing Cloud APIs (intermittent 503 "DNS cache overflow"). Gemini worked reliably; Speech/Motion/YouTube Data weren't verified end-to-end from here. Every endpoint was coded against documented request/response shapes.
- If a Cloud API returns 403 with `API_KEY_SERVICE_BLOCKED`, that API isn't enabled on the Google Cloud project. The routes return `{ blocked: true, ...empty result }` with HTTP 200 so the UI degrades gracefully.

## Files of interest

```
components/Station.tsx        ← THE file that needs the rewire
lib/clipRecorder.ts           ← helper waiting to be consumed
lib/motion.ts  lib/speech.ts  ← API clients already built
app/api/motion  app/api/speech app/api/mythology app/api/live-status  ← endpoints ready

project/Station Four - Live Testbed.html    ← visual spec
chats/chat1.md                               ← design intent / tone
CLAUDE.md                                    ← architecture for the next Claude session
SETUP.md                                     ← how to run it
```

## Dependency on the human

The repo is **public** on GitHub. The `.env.local` with the Gemini key is gitignored and never committed. If the key ever needs rotating, update `.env.local` and redeploy — no code changes needed. The one-line `.env.example` documents what the key's Google Cloud project needs enabled.

Design spirit to preserve: the archive modes are rhetorical postures, not just layouts. The transformation isn't noise — each mode makes a different argument (sprout = body transforms; double = ontology splits; delirium = the apparatus lies). When editing copy or behavior, reread the relevant bits of `chats/chat1.md`.
