/**
 * Rolling clip recorder. Captures short MediaStream clips from a canvas
 * (video) or audio MediaStream, emits them as base64, then immediately
 * starts a new clip. Survives browser quirks around MediaRecorder.
 */

export type ClipKind = "audio" | "video";

export interface RollingClipOptions {
  durationMs: number;
  mimeType: string;
  onClip: (base64: string, mime: string) => void;
  onError?: (err: unknown) => void;
}

export function startRollingClip(stream: MediaStream, opts: RollingClipOptions) {
  let rec: MediaRecorder | null = null;
  let chunks: BlobPart[] = [];
  let stopped = false;

  function tryMimes(): string | null {
    const candidates = [
      opts.mimeType,
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "audio/webm;codecs=opus",
      "audio/webm",
    ];
    for (const c of candidates) {
      if (MediaRecorder.isTypeSupported(c)) return c;
    }
    return null;
  }

  function startOne() {
    if (stopped) return;
    const mime = tryMimes();
    if (!mime) {
      opts.onError?.(new Error("No supported MediaRecorder mime type"));
      return;
    }
    chunks = [];
    try {
      rec = new MediaRecorder(stream, { mimeType: mime, bitsPerSecond: 600_000 });
    } catch (err) {
      opts.onError?.(err);
      return;
    }
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    rec.onstop = async () => {
      try {
        const blob = new Blob(chunks, { type: mime });
        if (blob.size > 0) {
          const b64 = await blobToBase64(blob);
          opts.onClip(b64, mime);
        }
      } catch (err) {
        opts.onError?.(err);
      } finally {
        if (!stopped) startOne();
      }
    };
    try {
      rec.start();
    } catch (err) {
      opts.onError?.(err);
      return;
    }
    setTimeout(() => {
      if (rec && rec.state === "recording") {
        try { rec.stop(); } catch {}
      }
    }, opts.durationMs);
  }

  startOne();

  return () => {
    stopped = true;
    if (rec && rec.state === "recording") {
      try { rec.stop(); } catch {}
    }
  };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => {
      const res = String(r.result || "");
      // Strip data URL prefix
      const comma = res.indexOf(",");
      resolve(comma >= 0 ? res.slice(comma + 1) : res);
    };
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}
