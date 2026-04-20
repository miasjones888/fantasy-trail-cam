import { NextRequest, NextResponse } from "next/server";
import { CAM_BY_ID } from "@/lib/stations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface LiveStatus {
  isLive: boolean;
  title: string | null;
  thumbnail: string | null;
  concurrentViewers: number | null;
  startedAt: string | null;
  channel: string | null;
}

const cache = new Map<string, { data: LiveStatus; expiresAt: number }>();

export async function GET(_req: NextRequest, { params }: { params: { cam: string } }) {
  const station = CAM_BY_ID[params.cam];
  if (!station) return NextResponse.json({ error: "Unknown cam" }, { status: 404 });

  const hit = cache.get(station.id);
  if (hit && hit.expiresAt > Date.now()) return NextResponse.json(hit.data);

  try {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${station.youtubeId}&part=snippet,liveStreamingDetails&key=${key}`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `YouTube ${res.status}: ${text.slice(0, 120)}`, blocked: res.status === 403 },
        { status: res.status === 403 ? 200 : 502 }
      );
    }
    const data = await res.json();
    const item = data.items?.[0];
    const snippet = item?.snippet || {};
    const live = item?.liveStreamingDetails || {};

    const status: LiveStatus = {
      isLive: !!live.actualStartTime && !live.actualEndTime,
      title: snippet.title || null,
      thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || null,
      concurrentViewers: live.concurrentViewers ? Number(live.concurrentViewers) : null,
      startedAt: live.actualStartTime || null,
      channel: snippet.channelTitle || null,
    };

    cache.set(station.id, { data: status, expiresAt: Date.now() + 60_000 });
    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
