const API_BASE = "https://videointelligence.googleapis.com/v1/videos:annotate";
const OP_BASE = "https://videointelligence.googleapis.com/v1/operations";

export interface MotionEvent {
  description: string;
  confidence: number;
  startSec: number;
  endSec: number;
}

export interface TrackedObject {
  entity: string;
  confidence: number;
  boxes: Array<{ t: number; left: number; top: number; right: number; bottom: number }>;
}

export interface MotionResult {
  events: MotionEvent[];
  objects: TrackedObject[];
  shots: number;
  hasMotion: boolean;
}

/**
 * Run Cloud Video Intelligence on a short WebM clip.
 * Uses LABEL_DETECTION (SHOT_MODE) + OBJECT_TRACKING which are the most useful
 * signals for "did an animal appear". Runs synchronously by polling the
 * long-running operation.
 */
export async function analyzeClip(base64Video: string): Promise<MotionResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");

  // Kick off the operation
  const startRes = await fetch(`${API_BASE}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inputContent: base64Video,
      features: ["LABEL_DETECTION", "OBJECT_TRACKING"],
      videoContext: {
        labelDetectionConfig: {
          labelDetectionMode: "SHOT_MODE",
          model: "builtin/latest",
        },
      },
    }),
  });

  if (!startRes.ok) {
    const text = await startRes.text().catch(() => "");
    throw new Error(`VideoIntel start ${startRes.status}: ${text.slice(0, 200)}`);
  }
  const startData = await startRes.json();
  const opName: string = startData.name;
  if (!opName) throw new Error("No operation name returned");

  // Poll until done (max ~25 seconds)
  const deadline = Date.now() + 25000;
  let opData: any = null;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1200));
    const pollRes = await fetch(`https://videointelligence.googleapis.com/v1/${opName}?key=${key}`);
    if (!pollRes.ok) continue;
    opData = await pollRes.json();
    if (opData.done) break;
  }
  if (!opData?.done) {
    throw new Error("VideoIntel timeout");
  }
  if (opData.error) {
    throw new Error(`VideoIntel error: ${opData.error.message}`);
  }

  const annotation = opData.response?.annotationResults?.[0] || {};

  // Shot-level labels
  const shotLabels: any[] = annotation.shotLabelAnnotations || [];
  const events: MotionEvent[] = shotLabels.flatMap((l: any) =>
    (l.segments || []).map((s: any) => ({
      description: String(l.entity?.description || "unknown"),
      confidence: Number(s.confidence || 0),
      startSec: parseTime(s.segment?.startTimeOffset),
      endSec: parseTime(s.segment?.endTimeOffset),
    }))
  );

  // Object tracking
  const tracks: any[] = annotation.objectAnnotations || [];
  const objects: TrackedObject[] = tracks
    .filter((t) => (t.confidence || 0) > 0.35)
    .map((t) => ({
      entity: String(t.entity?.description || "object"),
      confidence: Number(t.confidence || 0),
      boxes: (t.frames || []).slice(0, 10).map((f: any) => ({
        t: parseTime(f.timeOffset),
        left: f.normalizedBoundingBox?.left ?? 0,
        top: f.normalizedBoundingBox?.top ?? 0,
        right: f.normalizedBoundingBox?.right ?? 1,
        bottom: f.normalizedBoundingBox?.bottom ?? 1,
      })),
    }));

  const shots = (annotation.shotAnnotations || []).length;

  // Heuristic: motion if any tracked object has non-trivial movement OR multiple shots
  const hasMotion =
    objects.some((o) => o.boxes.length > 1 && bboxesMoved(o.boxes)) ||
    shots > 1 ||
    events.some((e) => /(animal|bird|wolf|bear|deer|dog|cat|fox|wildlife|motion)/i.test(e.description));

  return { events, objects, shots, hasMotion };
}

function parseTime(iso?: string): number {
  if (!iso) return 0;
  // e.g. "0.500s" or "3.200000s"
  const m = /^([\d.]+)s$/.exec(iso);
  return m ? parseFloat(m[1]) : 0;
}

function bboxesMoved(boxes: TrackedObject["boxes"]): boolean {
  if (boxes.length < 2) return false;
  const first = boxes[0];
  for (const b of boxes.slice(1)) {
    const dx = Math.abs(b.left - first.left) + Math.abs(b.right - first.right);
    const dy = Math.abs(b.top - first.top) + Math.abs(b.bottom - first.bottom);
    if (dx + dy > 0.05) return true;
  }
  return false;
}
