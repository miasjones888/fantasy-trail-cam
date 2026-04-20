# Prototype reference

Textual reference for the Station Four live testbed, captured from the running
production build. Use this alongside `project/Station Four - Live Testbed.html`
(the original self-contained prototype) and `chats/chat1.md` (design rationale).

No image files accompany this doc — the descriptions below are authoritative
and contain enough detail to reproduce the layout, palette, typography, and
per-station state.

---

## View 1 — full app, four stations + archive + tweaks

### Page chrome

- Background: warm cream (`#F1EDE4` range), the same paper tone as the original
  prototype.
- Top-left title: "Station Four" (serif) followed by "· *live testbed*" in serif
  italic, magenta/pink accent on the italic phrase.
- Intro paragraph immediately below the title, monospace, dark ink:
  > Four live feeds, running as normal. Motion triggers a *transformation event*
  > — a hallucination lasting 3–6 seconds, archived, and the feed returns.
  > Each station argues for a different *mode* of mythology. The archive panel
  > (right) shows captured anomalies in whichever *mode* you select.
- Top-right, right-aligned monospace stack:
  - `EST. 2026 · SYNDICATE FEED`
  - `14:07:41` (live clock)
  - `004 ANOMALIES TODAY`

### Station grid (2×2)

Each station tile is a dark, near-black panel with a mono HUD. Every tile shows
(clockwise from top-left of the tile):

- Top-left: `CAM-XX · SUBJECT NAME` in pale mono caps.
- Top-right: either `REC` (red dot, live) or `ANOMALY` (magenta triangle) badge.
- Interior: the live video frame (or synthetic fallback background) with SVG
  bounding-box overlays. Green boxes = classifier guesses, magenta box = the
  anomaly's focal box. Each box is labeled `LABEL · 0.NN` in the same green
  mono; the magenta box uses the magenta accent.
- Bottom-left: local wall-clock timestamp, e.g. `14:07:42`.
- Bottom-right: location caption, e.g. `Zeab enclosure · Westcliffe CO`.
- Status strip directly below the frame: `● LIVE · DELIRIUM MODE` on the left,
  `CONF 0.83` on the right.
- Transcript block (monospace, four lines max) below the strip, newest at top.
  Green lines are ordinary observations (`WIND`, `DISTANT VEHICLE`); magenta
  lines are anomaly tokens (`[re-identifying]`, `[confidence collapse]`,
  `[labeler: "god?"]`, `[signal anomaly · 14.3kHz]`).

Per-station snapshot visible in the screenshot:

- **CAM-01 · MISSION WOLF** (top-left) — night forest, faint wolf silhouette.
  Boxes: `BEAR · 0.33`, `WOLF · 0.00`, magenta `DOG? · 0.33`. Badge: ANOMALY.
  `CONF 0.83`. Transcript: `[re-identifying]`, `[confidence collapse]`,
  `DISTANT VEHICLE`, `WIND`.
- **CAM-02 · AURORA CAM** (top-right) — aurora gradient sky over black ridge,
  Manitoba 58.7°N. Single overlay label `REGION · 0.94`, no box. Badge: REC.
  `CONF 0.93`. Transcript: `[SILENCE]`, `DISTANT WIND`, `[re-identifying]`,
  `[confidence collapse]`.
- **CAM-03 · MUSKOX CAM** (bottom-left) — dusk tundra silhouette, Seward
  Peninsula AK. Boxes include `ANGEL? · 0.50`, `BEAR · 0.33`, `WOLF · 0.00`,
  magenta `DOG? · 0.33`. Badge: ANOMALY. `CONF 0.26`.
- **CAM-04 · CATTLE POND · PASTURE** (bottom-right) — holstein cow by pond,
  Farm Sanctuary · Watkins Glen NY. Boxes: `BEAR · 0.50`, magenta `WOLF · 0.00`
  over the cow. Badge: ANOMALY. `CONF 0.97`.

### Anomaly Archive panel (right column)

- Header: "Anomaly Archive" serif italic, matching the title treatment.
- Subheader (mono caps): `MODE · THUMBNAIL STRIP`.
- Thumbnail strip: four small dark tiles in a row with their own timestamps
  (`14:07:35`, `14:07:33`, `14:07:32`, `14:07:30`) and tiny index numbers
  (`02`, `01`, `04`, ...). Active thumbnail is outlined in magenta.
- Below the strip, mono caps: `4 CAPTURES`, then prose:
  > Click any thumbnail to re-trigger that event on its source station. The
  > strip holds the last 24.
- Italic paragraph, slightly smaller:
  > The strip commits to the captures but not to their meaning. Scrubbable,
  > shareable, quotidian — a TikTok feed of prophecies.
- `ARCHIVE MODES` list (each mode name in magenta, dash, definition):
  - **Counter** — just the number, growing
  - **Thumbnail strip** — scrubbable, click to replay
  - **Anomaly feed** — full metadata, transcript snippet, shareable
- `STATION MODES` list (mode in magenta, em-dash, definition):
  - **Sprouting** — body grows wings/antlers
  - **Doubling** — briefly two silhouettes
  - **Classifier delirium** — boxes lie; body stays
  - **Mixed** — each station does its own

### Tweaks overlay

Floating panel anchored to the bottom-left over CAM-03. Cream card, thin dark
border, mono labels.

- Title row: `⊙ STATION FOUR · TWEAKS` (bullet ring glyph + caps).
- `STATION MODE` segmented buttons: `MIXED / SPROUT / DOUBLE / DELIR.` —
  `DELIR.` is the active (filled) button.
- `ARCHIVE MODE` segmented buttons: `COUNTER / STRIP / FEED` — `STRIP` active.
- `EVENT FREQUENCY` segmented buttons: `RARE / NORMAL / DENSE` — `DENSE` active.
- Bottom CTA: full-width magenta button `⚡ TRIGGER EVENT NOW` in black caps.

A floating timestamp label `MUSKOX CAM · 14:07:30` sits just below the title,
top-left of the viewport — it is the current archive thumbnail's source label
on hover.

---

## View 2 — CAM-03 / CAM-04 detail with tweaks panel

Same visual language, zoomed in on the bottom row and the tweaks overlay. Adds
transcript detail for CAM-04 not fully visible in screenshot 1:

- CAM-03 at `14:08:25`, `CONF 0.96`. Boxes include `BEAR/MUSKOX · 0.33`,
  `DOG · 0.38/0.17` (stacked), `ANGEL? · 0.50`, magenta `WOLF · 0.00`.
- CAM-04 at `14:08:25`, `CONF 0.93`. One green box labeled `BOS · 0.90` wrapping
  the cow — `BOS` is the classifier's generic bovine genus guess.
- CAM-04 transcript (newest first):
  - `[14:08:21] [labeler: "god?"]` (magenta)
  - `[14:08:20] [signal anomaly · 14.3kHz]` (magenta)
  - `[14:08:16] WATER LAP` (green)
  - `[14:08:11] [distant moo]` (green, bracketed)

Below the station row, a dashed-border cream card shows the tail of the intro
copy, confirming the live cam roster text:
> ive cams: `mission-wolf-zeab`, `aurora-cam`, `muskox-cam`, plus a fourth TBD.
> In this [prototype we use placeholders] so we can stage transformation events
> deterministically — the feed layer [is faked on a seeded schedule]; in
> production it reads the cam's alert stream (or runs a …).

---

## What to preserve when editing UI

- The cream page / near-black station tiles contrast is load-bearing: the
  stations must read as "screens embedded in a printed page."
- Green for classifier truth, magenta/pink for anomaly focus and archive
  accents. Do not recolor either.
- Serif italic is reserved for the title, "live testbed," "Anomaly Archive,"
  and the one italic archive caption. Everything else is monospace.
- Bounding-box labels are `LABEL · 0.NN` with a middle dot separator, always
  in the same weight as the box stroke color.
- Transcript lines keep bracketed tokens for machine/uncertain events and bare
  caps for naturalistic ones. Magenta bracketed tokens signal anomaly state.
- The tweaks panel is the single source for runtime configuration during demo;
  it floats, it does not dock. Do not redesign it into a sidebar.

## Related files

- `project/Station Four - Live Testbed.html` — frozen visual spec.
- `components/Station.tsx` — renders one station tile.
- `components/ArchivePanel.tsx` — the right-column archive (three modes).
- `components/TweaksPanel.tsx` (if present) — the floating tweaks overlay.
- `lib/stations.ts` — the four-station roster and default modes.
- `lib/silhouettes.ts` — SVG silhouettes used during transformation events.
