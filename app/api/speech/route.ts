import { NextRequest, NextResponse } from "next/server";
import { recognize } from "@/lib/speech";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 20;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audio, encoding, sampleRateHertz } = body as {
      audio?: string;
      encoding?: "WEBM_OPUS" | "OGG_OPUS" | "LINEAR16";
      sampleRateHertz?: number;
    };

    if (!audio || typeof audio !== "string") {
      return NextResponse.json({ error: "Missing audio" }, { status: 400 });
    }
    const base64 = audio.replace(/^data:audio\/\w+;base64,/, "");
    const result = await recognize(base64, { encoding, sampleRateHertz });
    return NextResponse.json(result);
  } catch (err: any) {
    const msg = String(err?.message || err);
    // Common permission case — report cleanly so client can fall back to ambient pool
    const blocked = /API_KEY_SERVICE_BLOCKED|blocked|403/.test(msg);
    return NextResponse.json(
      { error: msg, blocked, transcripts: [], hasSpeech: false, rawLabels: [] },
      { status: blocked ? 200 : 500 }
    );
  }
}
