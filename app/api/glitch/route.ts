import { NextRequest, NextResponse } from "next/server";
import { generateGlitch } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(req: NextRequest) {
  try {
    const { mode, subject, action } = await req.json();
    const result = await generateGlitch(String(mode || "sprout"), String(subject || ""), action || null);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
