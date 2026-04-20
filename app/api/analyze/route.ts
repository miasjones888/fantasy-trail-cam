import { NextRequest, NextResponse } from "next/server";
import { CAM_BY_ID } from "@/lib/stations";
import { visionFallback } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Gemini vision fallback — used only when Cloud Video Intelligence is
 * unavailable (quota, 403, or network). Returns the same shape Video
 * Intelligence produces plus creative text in one call.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { camId, frame } = body as { camId: string; frame: string };

    const station = CAM_BY_ID[camId];
    if (!station) return NextResponse.json({ error: "Unknown cam" }, { status: 404 });
    if (!frame || typeof frame !== "string") {
      return NextResponse.json({ error: "Missing frame" }, { status: 400 });
    }

    const base64 = frame.replace(/^data:image\/\w+;base64,/, "");
    const result = await visionFallback(base64, station);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
