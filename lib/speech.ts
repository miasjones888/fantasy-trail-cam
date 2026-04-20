const API_BASE = "https://speech.googleapis.com/v1/speech:recognize";

export interface SpeechResult {
  transcripts: Array<{ text: string; confidence: number }>;
  hasSpeech: boolean;
  rawLabels: string[]; // ambient / non-speech tags we'll infer from confidence + text
}

type Encoding = "WEBM_OPUS" | "OGG_OPUS" | "LINEAR16" | "MP3" | "FLAC";

/** Call Cloud Speech-to-Text synchronously on a short audio clip. */
export async function recognize(
  base64Audio: string,
  opts: { encoding?: Encoding; sampleRateHertz?: number; languageCode?: string } = {}
): Promise<SpeechResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const body = {
    config: {
      encoding: opts.encoding || "WEBM_OPUS",
      sampleRateHertz: opts.sampleRateHertz || 48000,
      languageCode: opts.languageCode || "en-US",
      model: "default",
      enableAutomaticPunctuation: true,
      maxAlternatives: 1,
      // Keep it fast
      enableWordConfidence: false,
    },
    audio: { content: base64Audio },
  };

  const res = await fetch(`${API_BASE}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Speech API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const results = Array.isArray(data.results) ? data.results : [];
  const transcripts = results.flatMap((r: any) =>
    (r.alternatives || []).map((a: any) => ({
      text: String(a.transcript || "").trim(),
      confidence: Number(a.confidence || 0),
    }))
  );

  return {
    transcripts,
    hasSpeech: transcripts.some((t: { text: string }) => t.text.length > 0),
    rawLabels: [],
  };
}
