import { NextRequest, NextResponse } from "next/server";
import { CAM_BY_ID } from "@/lib/stations";
import { rewritePlaylist } from "@/lib/youtube";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: { cam: string } }) {
  const station = CAM_BY_ID[params.cam];
  if (!station) return NextResponse.json({ error: "Unknown cam" }, { status: 404 });

  const upstream = req.nextUrl.searchParams.get("u");
  if (!upstream) return NextResponse.json({ error: "Missing u" }, { status: 400 });

  let url: URL;
  try {
    url = new URL(upstream);
  } catch {
    return NextResponse.json({ error: "Bad URL" }, { status: 400 });
  }
  // Minimal host allowlist — only Google/YouTube video infra
  const host = url.hostname;
  const ok = /\.googlevideo\.com$/.test(host) || /\.youtube\.com$/.test(host) || host === "youtube.com";
  if (!ok) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const res = await fetch(upstream, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FantasyTrailCam/1.0)" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }
    const ct = res.headers.get("content-type") || "application/octet-stream";

    // If it's a nested m3u8 (variant playlist), rewrite it too.
    if (ct.includes("mpegurl") || upstream.includes(".m3u8")) {
      const body = await res.text();
      const origin = new URL(req.url).origin;
      const proxyPrefix = `${origin}/api/stream/${station.id}/segment`;
      const rewritten = rewritePlaylist(body, upstream, proxyPrefix);
      return new NextResponse(rewritten, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      });
    }

    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": ct,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error(`[segment ${params.cam}]`, err?.message || err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
