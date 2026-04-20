import { Innertube, UniversalCache } from "youtubei.js";

interface HLSResult {
  url: string;
  expiresAt: number;
}

const cache = new Map<string, HLSResult>();

let ytPromise: Promise<Innertube> | null = null;
async function getYT() {
  if (!ytPromise) {
    ytPromise = Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });
  }
  return ytPromise;
}

export async function getHLSUrl(youtubeId: string): Promise<string> {
  const cached = cache.get(youtubeId);
  if (cached && cached.expiresAt > Date.now()) return cached.url;

  const yt = await getYT();
  const info = await yt.getInfo(youtubeId);

  // Live streams expose a top-level hls_manifest_url
  const anyInfo = info as any;
  const hls =
    anyInfo.streaming_data?.hls_manifest_url ||
    anyInfo.basic_info?.hls_manifest_url ||
    anyInfo.hls_manifest_url;

  if (!hls || typeof hls !== "string") {
    throw new Error(`No HLS manifest found for ${youtubeId}. Stream may be offline.`);
  }

  cache.set(youtubeId, { url: hls, expiresAt: Date.now() + 45 * 60 * 1000 });
  return hls;
}

/** Rewrite an m3u8 playlist so all absolute URLs route back through our proxy. */
export function rewritePlaylist(body: string, baseUrl: string, proxyPrefix: string): string {
  const base = new URL(baseUrl);
  return body
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      if (trimmed.startsWith("#")) {
        // #EXT-X-MAP:URI="..." tags etc
        return line.replace(/URI="([^"]+)"/g, (_, u) => {
          const abs = new URL(u, base).toString();
          return `URI="${proxyPrefix}?u=${encodeURIComponent(abs)}"`;
        });
      }
      const abs = new URL(trimmed, base).toString();
      return `${proxyPrefix}?u=${encodeURIComponent(abs)}`;
    })
    .join("\n");
}
