import type { BgHue } from "./stations";

/** Fallback animated backgrounds if the live stream can't load. */
export function drawSyntheticBg(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, hue: BgHue) {
  if (hue === "aurora") {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0a0e1a");
    g.addColorStop(1, "#1a1220");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#050505";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.85);
    for (let x = 0; x <= W; x += 6) {
      const y = H * 0.85 + Math.sin((x + t * 0.02) * 0.02) * 4 + ((x * 7919) % 13) - 6;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.save();
      const alpha = 0.12 + Math.sin(t * 0.0006 + i) * 0.06;
      const grad = ctx.createLinearGradient(0, H * 0.2, 0, H * 0.75);
      grad.addColorStop(0, `rgba(60, 255, 170, 0)`);
      grad.addColorStop(0.5, `rgba(60, 255, 170, ${alpha})`);
      grad.addColorStop(1, `rgba(180, 100, 255, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      const off = t * 0.04 + i * 120;
      ctx.moveTo(0, H * 0.2);
      for (let x = 0; x <= W; x += 8) {
        const yTop = H * 0.2 + Math.sin((x + off) * 0.01 + i) * 30 + Math.sin((x + off) * 0.025) * 10;
        ctx.lineTo(x, yTop);
      }
      for (let x = W; x >= 0; x -= 8) {
        const yBot = H * 0.75 + Math.sin((x + off * 0.7) * 0.008 + i) * 20;
        ctx.lineTo(x, yBot);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    return;
  }
  if (hue === "tundra") {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#b8bdb8");
    g.addColorStop(0.7, "#8a8e80");
    g.addColorStop(1, "#4a4e44");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,.3)";
    for (let i = 0; i < 60; i++) {
      const x = (i * 73 + t * 0.02) % W;
      const y = H * 0.65 + ((i * 41) % 80);
      ctx.fillRect(x, y, 2, 1);
    }
    ctx.fillStyle = "#3a3e38";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.55);
    for (let x = 0; x <= W; x += 8) {
      const y = H * 0.55 + Math.sin(x * 0.01) * 8;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    return;
  }
  if (hue === "pasture") {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#a8c4d8");
    g.addColorStop(0.45, "#c8d8c8");
    g.addColorStop(0.55, "#6a8a5a");
    g.addColorStop(1, "#3a5a3a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#4a6a4a";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.52);
    for (let x = 0; x <= W; x += 4) {
      const y = H * 0.52 - Math.abs(Math.sin(x * 0.05)) * 6 - ((x * 13) % 7);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H * 0.55);
    ctx.lineTo(0, H * 0.55);
    ctx.closePath();
    ctx.fill();
    return;
  }
  // forest default
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#2a3a2a");
  g.addColorStop(1, "#0e1410");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#050805";
  for (let i = 0; i < 14; i++) {
    const x = (i * 97) % W;
    const w = 4 + ((i * 31) % 16);
    const h = H * (0.6 + ((i * 17) % 10) / 25);
    ctx.globalAlpha = 0.5 + (i % 5) / 10;
    ctx.fillRect(x, H - h, w, h);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(200,200,180,.2)";
  for (let i = 0; i < 30; i++) {
    const x = (i * 37 + Math.sin(t * 0.0005 + i) * 30) % W;
    const y = (i * 41 + Math.cos(t * 0.0007 + i) * 20) % H;
    ctx.beginPath();
    ctx.arc(x, y, 1 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}
