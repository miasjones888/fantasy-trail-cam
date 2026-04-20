import { NextRequest, NextResponse } from "next/server";
import { analyzeClip } from "@/lib/motion";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { video } = body as { video?: string };

    if (!video || typeof video !== "string") {
      return NextResponse.json({ error: "Missing video" }, { status: 400 });
    }
    const base64 = video.replace(/^data:video\/\w+;base64,/, "");
    const result = await analyzeClip(base64);
    return NextResponse.json(result);
  } catch (err: any) {
    const msg = String(err?.message || err);
    const blocked = /API_KEY_SERVICE_BLOCKED|blocked|403/.test(msg);
    return NextResponse.json(
      { error: msg, blocked, events: [], objects: [], shots: 0, hasMotion: false },
      { status: blocked ? 200 : 500 }
    );
  }
}
