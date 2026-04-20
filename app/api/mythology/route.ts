import { NextRequest, NextResponse } from "next/server";
import { CAM_BY_ID } from "@/lib/stations";
import { generateMythology } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 20;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { camId, mode, species, action } = body as {
      camId: string;
      mode: "sprout" | "double" | "delir";
      species?: string | null;
      action?: string | null;
    };

    const station = CAM_BY_ID[camId];
    if (!station) return NextResponse.json({ error: "Unknown cam" }, { status: 404 });

    const result = await generateMythology({
      stationName: station.name,
      subject: station.subject,
      description: station.description,
      mode,
      species: species || null,
      action: action || null,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
