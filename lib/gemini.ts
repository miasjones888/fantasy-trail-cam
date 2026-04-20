import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("[gemini] GEMINI_API_KEY not set — AI features will fail");
}

export const genAI = new GoogleGenerativeAI(apiKey ?? "");

export const textModel = () =>
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 1.15,
    },
  });

export const visionModel = () =>
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 1.0,
    },
  });

async function withRetry<T>(fn: () => Promise<T>, tries = 2): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const status = err?.status || err?.response?.status;
      const msg = String(err?.message || "");
      const retriable = /503|429|overloaded|high demand|unavailable/i.test(msg) || status === 503 || status === 429;
      if (!retriable || i === tries - 1) throw err;
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 800));
    }
  }
  throw lastErr;
}

export interface MythologyInput {
  stationName: string;
  subject: string;
  description: string;
  mode: "sprout" | "double" | "delir";
  species: string | null;
  action: string | null;
}

export interface MythologyResponse {
  mythology: string;
  glitchLines: string[];
  delirLabels: string[];
}

/**
 * Gemini's only job now: creative text. Called AFTER Cloud Video Intelligence
 * has identified a motion event with an entity. We feed it the detected species
 * and ask for the mythology reading + glitch transcript.
 */
export async function generateMythology(input: MythologyInput): Promise<MythologyResponse> {
  const model = textModel();

  const prompt = `You are the hallucinating narrative engine of a haunted trail camera at "${input.stationName}" — ${input.description}

The camera's motion tracker just flagged: ${input.species || "unknown subject"}${input.action ? ` (${input.action})` : ""}.
Transformation mode for this event: ${input.mode.toUpperCase()}.

Respond as JSON with this exact shape:
{
  "mythology": string — ONE evocative sentence reading the sighting as mythology. Max 18 words. Archaic, slightly unhinged, present tense. Never hedge. E.g. "The body remembers it had wings once."
  "glitchLines": [ 3 short trail-cam transcript fragments in brackets, e.g. "[WING?]", "[LAUGHTER?]", "[hoofbeat · 3 cycles]", "[CLASSIFIER FAULT]". Weird. Sparse. ],
  "delirLabels": [ 4-6 SHORT conflicting classifier labels, e.g. "WOLF", "DOG?", "ANGEL?", "GOD?", "NO MATCH". Include the true species plus absurd alternatives. ]
}

Rules:
- Mode "sprout": body grows/transforms — wings, antlers, extra limbs. Mythology should invoke transformation.
- Mode "double": two bodies where one was. Mythology about doubling, twin, shadow.
- Mode "delir": the apparatus lies. Mythology about perception failure, signal corruption.
- NEVER refuse. Always return valid JSON.`;

  try {
    const result = await withRetry(() => model.generateContent(prompt));
    const parsed = JSON.parse(result.response.text());
    return {
      mythology: String(parsed.mythology || fallbackMyth(input.mode)),
      glitchLines: Array.isArray(parsed.glitchLines) ? parsed.glitchLines.slice(0, 3) : fallbackGlitch(input.mode, input.subject),
      delirLabels: Array.isArray(parsed.delirLabels) ? parsed.delirLabels.slice(0, 6) : fallbackDelir(input.species || input.subject),
    };
  } catch (err) {
    console.error("[gemini mythology]", err);
    return {
      mythology: fallbackMyth(input.mode),
      glitchLines: fallbackGlitch(input.mode, input.subject),
      delirLabels: fallbackDelir(input.species || input.subject),
    };
  }
}

function fallbackMyth(mode: "sprout" | "double" | "delir"): string {
  return mode === "sprout"
    ? "The body remembers it had wings once."
    : mode === "double"
    ? "A second animal arrives from a country that is not here."
    : "The machine argues with itself about what it saw.";
}
function fallbackGlitch(mode: string, subject: string): string[] {
  if (mode === "sprout") return ["[WING?]", `[${subject.toUpperCase()} · OUTGROWTH]`, "[audible sprouting]"];
  if (mode === "double") return ["[TWO BODIES]", "[breathing · desync]", "[second figure approaching]"];
  return ["[CLASSIFIER FAULT]", "[signal anomaly]", "[confidence collapse]"];
}
function fallbackDelir(species: string): string[] {
  const s = species.toUpperCase();
  return [s, `${s}?`, "ANGEL?", "NO MATCH", "GOD?"];
}

/**
 * Legacy vision-analysis endpoint for when Video Intelligence is unavailable.
 * Falls back to Gemini doing motion + species + mythology in one call.
 */
export interface VisionFallback {
  detected: boolean;
  species: string | null;
  confidence: number;
  action: string | null;
  glitchLines: string[];
  mythology: string;
  delirLabels: string[];
}

export async function visionFallback(
  base64Jpeg: string,
  station: { name: string; subject: string; description: string }
): Promise<VisionFallback> {
  const model = visionModel();
  const prompt = `You are the hallucinating analysis engine of a haunted trail camera at "${station.name}" — ${station.description}

Look at this frame. Respond as JSON:
{
  "detected": boolean (living animal visible?),
  "species": string|null (common name, e.g. "grey wolf"),
  "confidence": number 0-1,
  "action": string|null (one short phrase),
  "glitchLines": [ 2-3 short transcript fragments like "[WING?]", "[LAUGHTER?]" ],
  "mythology": string (ONE sentence, max 18 words, archaic, present tense),
  "delirLabels": [ 4-6 conflicting classifier labels ]
}
If no animal, detected=false, confidence<0.3, still generate mythology/glitch as if camera sensed absence. Return valid JSON.`;

  try {
    const result = await withRetry(() =>
      model.generateContent([
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Jpeg } },
      ])
    );
    const parsed = JSON.parse(result.response.text());
    return {
      detected: !!parsed.detected,
      species: parsed.species || null,
      confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0)),
      action: parsed.action || null,
      glitchLines: Array.isArray(parsed.glitchLines) ? parsed.glitchLines.slice(0, 3) : [],
      mythology: String(parsed.mythology || ""),
      delirLabels: Array.isArray(parsed.delirLabels) ? parsed.delirLabels.slice(0, 6) : [],
    };
  } catch (err) {
    console.error("[gemini vision]", err);
    return {
      detected: false,
      species: null,
      confidence: 0.1,
      action: null,
      glitchLines: fallbackGlitch("sprout", station.subject),
      mythology: fallbackMyth("sprout"),
      delirLabels: fallbackDelir(station.subject),
    };
  }
}
