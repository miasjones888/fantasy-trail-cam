// primitives.jsx
// Palette + type system + visual primitives (noise, scanlines, moss, lichen,
// creatures, OS chrome). Small, composable, referenced by every specimen card.

const { useContext, createContext, useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── Palettes ────────────────────────────────────────────────
// Three sibling palettes — same role names so components are palette-agnostic.
const PALETTES = {
  bone: {
    name: 'BONE / SLATE',
    ground:'#e8e2d0', paper:'#f1ecdd', ink:'#232821', dim:'#6b6f68',
    rule:  '#b8b09e', forest:'#4a5c52', teal:'#6b7d80', plum:'#7d6a85',
    lichen:'#9aa68a', ir:'#ff3d7f', cobalt:'#4a5f85', phosphor:'#7fd87a',
  },
  night: {
    name: 'NIGHT / TEAL',
    ground:'#1f2421', paper:'#2a322d', ink:'#e0d8c6', dim:'#8c9089',
    rule:  '#3d4642', forest:'#7da89d', teal:'#9ab8b8', plum:'#b8a8c4',
    lichen:'#a8b89a', ir:'#ff5c92', cobalt:'#8aa0c8', phosphor:'#b8f5a8',
  },
  moss: {
    name: 'MOSS / PLUM',
    ground:'#c6bfab', paper:'#d0c9b4', ink:'#1f2419', dim:'#5a5e54',
    rule:  '#9a9380', forest:'#3d4a3a', teal:'#5d7075', plum:'#6d5c78',
    lichen:'#8a9680', ir:'#d83670', cobalt:'#3d507a', phosphor:'#5ea858',
  },
};

const TweakCtx = createContext(null);
function useTweaks() {
  return useContext(TweakCtx) || {
    corruption: 35, palette: PALETTES.bone, paletteKey: 'bone',
    irMode: false, fieldConditions: true,
  };
}

// ─── SVG defs, reused ────────────────────────────────────────
function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden>
      <defs>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="grain-heavy">
          <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" seed="11" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
        </filter>
        <filter id="displace-soft">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
        <filter id="displace-heavy">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="12" />
        </filter>
        <filter id="blurry">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <filter id="chroma">
          <feOffset in="SourceGraphic" dx="-1" dy="0" result="r" />
          <feColorMatrix in="r" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" result="rr" />
          <feOffset in="SourceGraphic" dx="1" dy="0" result="b" />
          <feColorMatrix in="b" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0.5 0" result="bb" />
          <feMerge><feMergeNode in="rr"/><feMergeNode in="bb"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
    </svg>
  );
}

// ─── Noise overlay ───────────────────────────────────────────
function Noise({ opacity = 0.15, heavy = false, style = {} }) {
  const t = useTweaks();
  const mult = 0.5 + (t.corruption ?? 35) / 100 * 1.2;
  return (
    <svg aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      mixBlendMode: 'multiply', opacity: opacity * mult, ...style,
    }}>
      <rect width="100%" height="100%" filter={heavy ? 'url(#grain-heavy)' : 'url(#grain)'} />
    </svg>
  );
}

function Scanlines({ opacity = 0.14, gap = 3, style = {} }) {
  const t = useTweaks();
  const mult = t.fieldConditions ? 1 : 0.25;
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `repeating-linear-gradient(0deg,
        rgba(0,0,0,${opacity}) 0 1px, transparent 1px ${gap}px)`,
      mixBlendMode: 'multiply', opacity: mult, ...style,
    }}/>
  );
}

// ─── Moss creeping along an edge ─────────────────────────────
function MossEdge({ side = 'bottom', thickness = 22, seed = 3, style = {} }) {
  const t = useTweaks();
  const c = t.palette;
  const h = thickness * (0.5 + (t.corruption ?? 35) / 100 * 1.3);
  const pos = {
    bottom: { left: 0, right: 0, bottom: 0, height: h },
    top:    { left: 0, right: 0, top: 0, height: h, transform: 'scaleY(-1)' },
    left:   { top: 0, bottom: 0, left: 0, width: h, transform: 'rotate(-90deg)', transformOrigin: 'top left' },
  }[side];
  const dots = useMemo(() => {
    const rng = n => { let s = seed*7411 + n*13931; return (s % 97) / 97; };
    return Array.from({ length: 80 }, (_, i) => ({
      x: rng(i) * 100, y: 60 + rng(i+50) * 40,
      r: 0.6 + rng(i+100) * 2.4,
      fill: [c.lichen, c.forest, c.teal, c.plum][Math.floor(rng(i+200)*4)],
      o: 0.35 + rng(i+300) * 0.5,
    }));
  }, [seed, c]);
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position: 'absolute', ...pos, pointerEvents: 'none', mixBlendMode: 'multiply', ...style }}>
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.fill} opacity={d.o}/>)}
    </svg>
  );
}

// ─── Lichen corner ───────────────────────────────────────────
function Lichen({ corner = 'br', size = 100, seed = 1, style = {} }) {
  const t = useTweaks();
  const c = t.palette;
  const scale = 0.4 + (t.corruption ?? 35)/100 * 1.0;
  const pos = {
    br: { right: -size/3, bottom: -size/3 },
    bl: { left: -size/3, bottom: -size/3 },
    tr: { right: -size/3, top: -size/3 },
    tl: { left: -size/3, top: -size/3 },
  }[corner];
  const blobs = useMemo(() => {
    const rng = n => { let s = seed*9301 + n*49297; return (s % 233280)/233280; };
    return Array.from({ length: 18 }, (_, i) => ({
      cx: rng(i)*size, cy: rng(i+100)*size,
      r: 4 + rng(i+200)*12,
      fill: [c.lichen, c.forest, c.teal][Math.floor(rng(i+300)*3)],
      o: 0.3 + rng(i+400)*0.45,
    }));
  }, [seed, size, c]);
  return (
    <svg aria-hidden width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ position:'absolute', ...pos, pointerEvents:'none', mixBlendMode:'multiply',
        transform:`scale(${scale})`, transformOrigin:'center', ...style }}>
      {blobs.map((b, i) => <circle key={i} {...b} filter="url(#displace-soft)" />)}
    </svg>
  );
}

// ─── IR glow wrapper ─────────────────────────────────────────
function IRFrame({ children, force, style = {} }) {
  const t = useTweaks();
  const on = force ?? t.irMode;
  const c = t.palette;
  return (
    <div style={{
      position: 'relative',
      boxShadow: on ? `0 0 0 1px ${c.ir}, 0 0 18px ${c.ir}55, inset 0 0 36px ${c.ir}22` : 'none',
      filter: on ? 'contrast(1.12) saturate(0.7) hue-rotate(-12deg)' : 'none',
      transition: 'box-shadow .2s, filter .2s',
      ...style,
    }}>{children}</div>
  );
}

// ─── Creature — a fawn that sometimes has wings ─────────────
// `wing` = 0 (none) → 1 (full bloom). `distort` adds glitch.
function Fawn({ w = 200, h = 140, wing = 0, distort = 0, tint, style = {} }) {
  const t = useTweaks();
  const c = t.palette;
  const ink = tint || c.ink;
  const wingOpacity = Math.min(1, wing);
  const wingScale = 0.3 + wing * 0.9;
  const shake = distort > 0 ? `translate(${(Math.random()-.5)*distort}px,${(Math.random()-.5)*distort}px)` : 'none';
  return (
    <svg viewBox="0 0 200 140" width={w} height={h} style={{ display:'block', transform: shake, ...style }}>
      {/* wings BEHIND body */}
      <g opacity={wingOpacity} style={{ transformOrigin: '100px 70px', transform: `scale(${wingScale})` }}>
        {/* left wing */}
        <path d="M95 70 Q60 40 30 50 Q50 65 68 75 Q80 80 95 78 Z" fill={c.teal} opacity="0.85" filter="url(#displace-soft)" />
        <path d="M90 68 Q55 48 28 52 Q48 68 66 76" fill="none" stroke={c.forest} strokeWidth="0.6" opacity="0.6"/>
        {/* feather detail */}
        {[0,1,2,3,4].map(i => (
          <line key={i} x1={90-i*6} y1={72-i*3} x2={62-i*10} y2={60-i*3} stroke={c.forest} strokeWidth="0.5" opacity="0.7"/>
        ))}
      </g>
      {/* body */}
      <ellipse cx="100" cy="88" rx="38" ry="20" fill={ink} opacity="0.82"/>
      {/* chest/shoulder */}
      <path d="M128 78 Q140 66 144 52 L150 52 L147 72 Q143 84 132 86 Z" fill={ink} opacity="0.82"/>
      {/* head */}
      <ellipse cx="150" cy="48" rx="10" ry="7" fill={ink} opacity="0.88"/>
      {/* ear */}
      <path d="M145 42 Q140 34 143 30 Q148 34 149 42 Z" fill={ink} opacity="0.8"/>
      {/* eye */}
      <circle cx="153" cy="48" r="0.8" fill={c.ground}/>
      {/* legs */}
      <line x1="74" y1="105" x2="72" y2="128" stroke={ink} strokeWidth="2.2" opacity="0.8"/>
      <line x1="88" y1="107" x2="86" y2="128" stroke={ink} strokeWidth="2.2" opacity="0.8"/>
      <line x1="114" y1="107" x2="116" y2="128" stroke={ink} strokeWidth="2.2" opacity="0.8"/>
      <line x1="128" y1="105" x2="130" y2="128" stroke={ink} strokeWidth="2.2" opacity="0.8"/>
      {/* tiny bloom — a leaf sprouting from the back where wings should be */}
      {wing < 0.1 && (
        <g>
          <circle cx="108" cy="70" r="1.8" fill={c.lichen} opacity="0.9"/>
          <circle cx="104" cy="67" r="1.2" fill={c.forest} opacity="0.8"/>
        </g>
      )}
    </svg>
  );
}

// ─── The Unknown — what the camera caught but can't resolve ─
function Unknown({ w = 200, h = 140, style = {} }) {
  const t = useTweaks();
  const c = t.palette;
  return (
    <svg viewBox="0 0 200 140" width={w} height={h} style={{ display:'block', ...style }}>
      <path d="M60 100 Q50 60 90 55 Q130 50 145 85 Q155 115 120 118 Q80 122 60 100 Z"
        fill={c.ink} opacity="0.55" filter="url(#displace-heavy)"/>
      <path d="M70 90 Q85 70 110 70 Q130 72 135 92"
        fill="none" stroke={c.ink} strokeWidth="0.8" opacity="0.4" filter="url(#displace-soft)"/>
      <circle cx="120" cy="78" r="1.8" fill={c.ir}/>
      <circle cx="130" cy="78" r="1.8" fill={c.ir}/>
    </svg>
  );
}

// ─── Forest background — layered silhouettes ───────────────
function ForestBG({ w, h, density = 1, style = {} }) {
  const t = useTweaks();
  const c = t.palette;
  const ir = t.irMode;
  const trees = useMemo(() => {
    const rng = n => { let s = n*16807 % 2147483647; return s/2147483647; };
    return Array.from({ length: Math.floor(18 * density) }, (_, i) => ({
      x: rng(i*3+1)*w,
      width: 4 + rng(i*3+2)*18,
      height: h * (0.6 + rng(i*3+3)*0.4),
      depth: rng(i*3+4),
    })).sort((a,b) => a.depth - b.depth);
  }, [w, h, density]);
  return (
    <svg width={w} height={h} style={{ display:'block', ...style }}>
      <defs>
        <linearGradient id={`forest-grad-${w}-${h}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={ir ? '#0a0a08' : c.forest} stopOpacity={ir ? 1 : 0.9}/>
          <stop offset="1" stopColor={ir ? '#050504' : c.ink} stopOpacity="1"/>
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#forest-grad-${w}-${h})`}/>
      {/* ferns / ground fog */}
      {Array.from({ length: 24 }).map((_, i) => {
        const x = (i * 47) % w;
        const y = h - 10 - (i % 3) * 6;
        return <circle key={i} cx={x} cy={y} r={4 + (i%4)*2}
          fill={ir ? c.ground : c.lichen} opacity={ir ? 0.08 : 0.18}/>;
      })}
      {trees.map((tr, i) => (
        <rect key={i} x={tr.x} y={h - tr.height} width={tr.width} height={tr.height}
          fill={ir ? '#000' : c.ink}
          opacity={0.4 + tr.depth * 0.5}/>
      ))}
      {/* light shafts */}
      {!ir && Array.from({ length: 3 }).map((_, i) => (
        <line key={i} x1={w*0.2 + i*w*0.25} y1="0" x2={w*0.1 + i*w*0.3} y2={h}
          stroke={c.ground} strokeWidth="30" opacity="0.06"/>
      ))}
    </svg>
  );
}

// ─── Trail cam HUD overlay ───────────────────────────────────
function TrailCamHUD({ w, h, timestamp = '03:47:12', date = '10/24', temp = '04°C', moon = '◐', cam = 'CAM-03', battery = 67 }) {
  const t = useTweaks();
  const c = t.palette;
  const text = { fontFamily: 'var(--mono)', fontSize: 10, fill: c.ground, letterSpacing: 0.5 };
  const ir = t.irMode;
  return (
    <svg width={w} height={h} style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
      {/* top bar */}
      <text x="8" y="14" {...text}>{cam}</text>
      <text x={w-8} y="14" {...text} textAnchor="end">{ir ? 'IR' : 'DAY'}</text>
      {/* bottom bar */}
      <text x="8" y={h-8} {...text}>{date}  {timestamp}</text>
      <text x={w/2} y={h-8} {...text} textAnchor="middle">{temp}  MOON {moon}</text>
      <text x={w-8} y={h-8} {...text} textAnchor="end">BAT {battery}%</text>
      {/* corner brackets */}
      {[
        [8,22, 18,22, 8,22, 8,32],
        [w-8,22, w-18,22, w-8,22, w-8,32],
        [8,h-22, 18,h-22, 8,h-22, 8,h-32],
        [w-8,h-22, w-18,h-22, w-8,h-22, w-8,h-32],
      ].map((pts, i) => (
        <g key={i} stroke={c.ground} strokeWidth="1" fill="none" opacity="0.7">
          <line x1={pts[0]} y1={pts[1]} x2={pts[2]} y2={pts[3]}/>
          <line x1={pts[4]} y1={pts[5]} x2={pts[6]} y2={pts[7]}/>
        </g>
      ))}
    </svg>
  );
}

// ─── OS window chrome (Mac OS 9 / Amiga hybrid) ──────────────
function OSWindow({ title, children, w, h, chromeStyle = 'mac9', style = {}, titleRight }) {
  const t = useTweaks();
  const c = t.palette;
  if (chromeStyle === 'mac9') {
    return (
      <div style={{
        width: w, height: h, background: c.paper,
        border: `1px solid ${c.ink}`,
        boxShadow: `2px 2px 0 ${c.ink}`,
        fontFamily: 'var(--mono)', fontSize: 10,
        display: 'flex', flexDirection: 'column',
        ...style,
      }}>
        <div style={{
          background: `repeating-linear-gradient(0deg, ${c.ink} 0 1px, ${c.paper} 1px 3px)`,
          borderBottom: `1px solid ${c.ink}`,
          padding: '2px 6px',
          display: 'flex', alignItems: 'center', gap: 6,
          color: c.ink,
        }}>
          <div style={{ width: 11, height: 11, border: `1px solid ${c.ink}`, background: c.paper, flexShrink:0 }}/>
          <div style={{
            background: c.paper, padding: '0 8px', fontSize: 10,
            fontWeight: 600, color: c.ink, letterSpacing: 0.3,
          }}>{title}</div>
          {titleRight && <div style={{ marginLeft:'auto', background:c.paper, padding:'0 6px', color:c.dim }}>{titleRight}</div>}
          <div style={{ marginLeft: titleRight ? 0 : 'auto', flexShrink:0, display:'flex', gap:2 }}>
            <div style={{ width: 11, height: 11, border:`1px solid ${c.ink}`, background: c.paper }}/>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>
      </div>
    );
  }
  if (chromeStyle === 'win98') {
    return (
      <div style={{
        width: w, height: h, background: '#c3c3c3',
        border: `2px solid`, borderColor: '#fff #555 #555 #fff',
        fontFamily: 'var(--mono)', fontSize: 11, color: '#000',
        display:'flex', flexDirection:'column', ...style,
      }}>
        <div style={{
          background: 'linear-gradient(90deg, #000080, #1084d0)',
          color: '#fff', padding: '2px 4px',
          display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700,
        }}>
          <span style={{ flex: 1 }}>{title}</span>
          <span style={{ background: '#c3c3c3', color:'#000', border:'1px solid', borderColor:'#fff #555 #555 #fff', width:14, height:12, display:'inline-flex',alignItems:'center',justifyContent:'center', lineHeight:1 }}>×</span>
        </div>
        <div style={{ flex:1, padding: 6, overflow:'hidden', position: 'relative' }}>
          {children}
        </div>
      </div>
    );
  }
  if (chromeStyle === 'terminal') {
    return (
      <div style={{
        width: w, height: h, background: '#0a0a0a',
        border: `1px solid ${c.phosphor}66`,
        fontFamily: 'var(--mono)', fontSize: 11, color: c.phosphor,
        display:'flex', flexDirection:'column', ...style,
      }}>
        <div style={{ padding:'4px 8px', borderBottom:`1px solid ${c.phosphor}33`, fontSize:10, letterSpacing:1 }}>
          {title}
        </div>
        <div style={{ flex:1, padding: 10, overflow:'hidden', position:'relative', textShadow:`0 0 4px ${c.phosphor}88` }}>
          {children}
        </div>
      </div>
    );
  }
}

// ─── Tape label (handwritten Dymo feel) ─────────────────────
function TapeLabel({ children, rotate = -2, style = {}, color }) {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{
      display: 'inline-block',
      background: color || c.paper,
      color: c.ink,
      padding: '3px 10px',
      fontFamily: 'var(--mono-2)',
      fontSize: 11,
      letterSpacing: 1,
      border: `1px dashed ${c.rule}`,
      transform: `rotate(${rotate}deg)`,
      boxShadow: '1px 1px 0 rgba(0,0,0,0.1)',
      ...style,
    }}>{children}</div>
  );
}

// ─── Hand-lettered sticker (for "SET ME ON FIRE" feel) ──────
function Sticker({ children, rotate = 0, style = {}, size = 14 }) {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{
      display:'inline-block',
      fontFamily: '"Courier Prime", var(--mono)',
      fontSize: size, fontWeight: 700,
      color: c.ink, letterSpacing: 1,
      transform: `rotate(${rotate}deg)`,
      textShadow: `1px 1px 0 ${c.ground}`,
      ...style,
    }}>{children}</div>
  );
}

// ─── Specimen metadata row (CSS grid, dense mono) ───────────
function MetaRow({ label, value, style }) {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'90px 1fr',
      fontFamily:'var(--mono)', fontSize: 10, color: c.ink,
      borderBottom: `1px dotted ${c.rule}`,
      padding: '3px 0', gap: 8,
      ...style,
    }}>
      <span style={{ color: c.dim, textTransform:'uppercase', letterSpacing: 1 }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

// ─── Expose ──────────────────────────────────────────────────
Object.assign(window, {
  PALETTES, TweakCtx, useTweaks,
  SvgDefs, Noise, Scanlines, MossEdge, Lichen, IRFrame,
  Fawn, Unknown, ForestBG, TrailCamHUD,
  OSWindow, TapeLabel, Sticker, MetaRow,
});
