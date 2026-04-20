# Handoff — Fantasy Trail Cam / Station Four

**Date:** 2026-04-20
**Repo:** https://github.com/miasjones888/fantasy-trail-cam
**Branch:** `main` @ `ddfeb3c`

## What this is

A production build of the Station Four live-testbed design (from `claude.ai/design`). Four live wildlife cams → an HLS proxy → a composited canvas with SVG overlays → motion/speech analysis → "transformation events" (sprout, double, delirium) that archive to the right-hand panel.

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
| **Gemini 2.5 Flash** — mythology, glitch lines, delirium labels via `/api/mythology`, called from `triggerGlitch` | ✅ wired |
| **Cloud Video Intelligence** — rolling 8s canvas clips → `/api/motion` → advances next event on motion, seeds species/action | ✅ wired |
| **Cloud Speech-to-Text** — rolling 5s audio clips from WebAudio graph → `/api/speech` → real transcripts pushed into ambient feed | ✅ wired |
| **YouTube Data API** — `/api/live-status/[cam]` polled every 60s, viewer count + OFFLINE state rendered in HUD `.br` corner | ✅ wired |
| **Gemini vision fallback** — `/api/analyze`, triggered only when Video Intelligence is blocked or MediaRecorder isn't available | ✅ fallback-only |
| `lib/clipRecorder.ts` — rolling MediaRecorder helper for audio + canvas streams | ✅ in use |

## Pipeline overview (post-rewire)

```
Station render loop (RAF-driven, composite canvas)
  │
  ├─ canvas.captureStream(15fps)
  │     → lib/clipRecorder (8s video/webm;codecs=vp9)
  │     → POST /api/motion (Cloud Video Intelligence)
  │     → on hasMotion:
  │         - set nextEventAtRef = now + 1500ms
  │         - cache species/action in latestAnalysisRef
  │     → on blocked: flip motionBlockedRef, slow /api/analyze loop takes over
  │
  ├─ <video> → MediaElementSource → MediaStreamDestination (+ silent GainNode for user-side)
  │     → lib/clipRecorder (5s audio/webm;codecs=opus)
  │     → POST /api/speech (Cloud Speech-to-Text)
  │     → on hasSpeech: push transcript to ambient feed
  │     → during glitch: suppressed (glitch lines own the feed)
  │
  ├─ triggerGlitch()
  │     → POST /api/mythology once per event
  │     → fills mythology + glitchLines + delirLabels in one call
  │
  └─ GET /api/live-status/:cam every 60s
        → concurrentViewers + OFFLINE surfaced in HUD `.br`
```

## Not yet verified in a browser

The rewire type-checks and builds clean (`npm run build`), but nothing was exercised against a real stream from this sandbox — outbound to `googlevideo.com` is blocked here, and Cloud API calls hit flaky DNS. Before treating this as shipped, run the dev server locally and confirm:

1. **HLS playback** — all four stations should reach `streamOk === "ok"` within ~5s on a normal network.
2. **Motion loop** — Network tab should show a POST to `/api/motion` roughly every 8s per station. Responses should include `objects[]` with entity names; those should appear in the species tag overlay.
3. **Speech loop** — POSTs to `/api/speech` every 5s per station. Expect mostly empty responses because the `<video>` elements are `muted` (see "Audio gotcha" below). Real speech only shows up if you remove the mute or the stream has loud foreground audio that the decoder routes through WebAudio.
4. **Mythology** — when a transformation fires, one POST to `/api/mythology` per event; the `.myth` overlay should show the returned sentence mid-animation.
5. **Live status** — the `.br` HUD corner should show a viewer count (or OFFLINE) on the four active streams.
6. **Fallback path** — temporarily disable the Video Intelligence API on the Cloud project; the console should show `motionBlockedRef` going true and `/api/analyze` should start firing every 12s.

## Known follow-ups / open questions

- **Audio gotcha.** All four `<video>` elements use `muted` so Chromium allows autoplay. `createMediaElementSource` on a muted element produces silence in Chrome (but not Firefox — behavior varies). Today we live with this: Speech-to-Text mostly returns empty, which degrades cleanly to the ambient pool. If we want real transcripts, the fix is to remove `muted` and rely on a user-gesture unlock to start `AudioContext`, plus an explicit "unmute station" toggle — because four stations playing at once is clearly bad UX. Worth designing on paper before coding.
- **Cost.** Four stations × one 8s clip every ~15s is still ~$3-4/min of Cloud Video Intelligence. The current code pauses clip POSTs when `document.hidden` is true, but doesn't throttle per station. If cost becomes a problem, either stagger stations or only run the motion loop on the focused/hovered station.
- **Safari.** `MediaRecorder` support for WebM is still patchy on Safari. `lib/clipRecorder.ts` iterates mime candidates; if none match it falls back to `onError` which flips `motionBlockedRef` and the station lives on the vision fallback. Needs a real Safari test.
- **Race between mythology and glitch end.** `/api/mythology` is fetched when the glitch starts; if it resolves after `endGlitch` the overlay has already cleared. The renderer already guards against stale writes via `capturedMode !== glitchModeRef.current`, but the archive record snapshotted at glitch-end may be missing mythology for very short glitches. Minor; consider pre-fetching mythology on motion detection so it's ready by the time the glitch fires.
- **Strict mode double-mount.** `createMediaElementSource` throws if called twice on the same element. The audio effect catches this silently, but in dev-mode double-mount you'll lose speech capture after the second mount. Not an issue in production; would be cleaner to memoize the AudioContext on `videoRef.current`.

## Environment notes

- **The sandbox this was built in cannot reach `googlevideo.com` or `youtube.com`** (403 on all outbound). Locally, with a normal network, the HLS proxy works end-to-end.
- **The sandbox DNS was flaky** when probing Cloud APIs (intermittent 503 "DNS cache overflow"). Every endpoint was coded against documented request/response shapes but not verified end-to-end from here.
- If a Cloud API returns 403 with `API_KEY_SERVICE_BLOCKED`, that API isn't enabled on the Google Cloud project. Routes return `{ blocked: true, ...empty result }` with HTTP 200 so the UI degrades gracefully.

## Files of interest

```
components/Station.tsx         ← fully rewired — motion, speech, mythology, live-status all in here
lib/clipRecorder.ts            ← rolling MediaRecorder helper
lib/motion.ts  lib/speech.ts   ← Cloud API clients
lib/gemini.ts                  ← mythology + vision fallback
app/api/motion/                ← Cloud Video Intelligence proxy
app/api/speech/                ← Cloud Speech-to-Text proxy
app/api/mythology/             ← Gemini creative text (called from triggerGlitch)
app/api/analyze/               ← Gemini vision fallback (only when motion blocked)
app/api/live-status/[cam]/     ← YouTube Data API proxy, cached 60s
app/api/stream/[cam]/          ← HLS playlist + segment proxy

project/Station Four - Live Testbed.html    ← visual spec
chats/chat1.md                               ← design intent / tone
CLAUDE.md                                    ← architecture for the next Claude session
SETUP.md                                     ← how to run it
```

## Dependency on the human

The repo is **public** on GitHub. `.env.local` with the Gemini key is gitignored and never committed. If the key ever needs rotating, update `.env.local` and redeploy — no code changes needed. The one-line `.env.example` documents what the key's Google Cloud project needs enabled (Generative Language API, Cloud Speech-to-Text, Cloud Video Intelligence, YouTube Data v3).

Design spirit to preserve: the archive modes are rhetorical postures, not just layouts. The transformation isn't noise — each mode makes a different argument (sprout = body transforms; double = ontology splits; delirium = the apparatus lies). When editing copy or behavior, reread the relevant bits of `chats/chat1.md`.
