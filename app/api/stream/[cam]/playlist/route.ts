import { NextRequest, NextResponse } from "next/server";
import { CAM_BY_ID } from "@/lib/stations";
import { getHLSUrl, rewritePlaylist } from "@/lib/youtube";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: { cam: string } }) {
  const station = CAM_BY_ID[params.cam];
  if (!station) {
    return NextResponse.json({ error: "Unknown cam" }, { status: 404 });
  }

  try {
    const hlsUrl = await getHLSUrl(station.youtubeId);
    const origin = new URL(req.url).origin;
    const proxyPrefix = `${origin}/api/stream/${station.id}/segment`;

    const res = await fetch(hlsUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FantasyTrailCam/1.0)" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }
    const body = await res.text();
    const rewritten = rewritePlaylist(body, hlsUrl, proxyPrefix);

    return new NextResponse(rewritten, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error(`[playlist ${params.cam}]`, err?.message || err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
