import type { Subject } from "./stations";

export function subjectSVG(subject: Subject, wing: number, double: number, offset: number): string {
  const col = "#0a0a08";
  if (subject === "wolf") {
    return `
      <g transform="translate(${-offset * 30},0)" opacity="${1 - double * 0.3}">
        <ellipse cx="140" cy="130" rx="44" ry="18" fill="${col}" opacity=".9"/>
        <path d="M180 125 Q192 112 196 100 L204 100 L200 122 Q195 130 186 130 Z" fill="${col}" opacity=".9"/>
        <ellipse cx="206" cy="100" rx="8" ry="6" fill="${col}"/>
        <path d="M202 92 L199 82 L205 84 Z M210 92 L213 82 L208 86 Z" fill="${col}"/>
        <path d="M98 130 Q82 132 76 140 L84 138 Q92 135 100 135" fill="${col}" opacity=".85"/>
        <line x1="110" y1="148" x2="108" y2="164" stroke="${col}" stroke-width="2.5"/>
        <line x1="128" y1="150" x2="126" y2="166" stroke="${col}" stroke-width="2.5"/>
        <line x1="150" y1="150" x2="152" y2="166" stroke="${col}" stroke-width="2.5"/>
        <line x1="168" y1="148" x2="170" y2="164" stroke="${col}" stroke-width="2.5"/>
        ${wing > 0
          ? `<g opacity="${wing}"><path d="M130 120 Q100 ${90 - wing * 20} 70 ${96 - wing * 10} Q88 114 110 124 Z" fill="#2a4a3a" opacity=".85"/><path d="M170 120 Q200 ${90 - wing * 20} 230 ${96 - wing * 10} Q212 114 190 124 Z" fill="#2a4a3a" opacity=".85"/></g>`
          : ""}
      </g>
      ${double > 0
        ? `<g transform="translate(${30 + offset * 30},0) scale(0.95)" opacity="${double * 0.7}" style="filter:blur(0.6px)">
          <ellipse cx="140" cy="130" rx="44" ry="18" fill="#ff3d7f" opacity=".5"/>
          <ellipse cx="206" cy="100" rx="8" ry="6" fill="#ff3d7f" opacity=".5"/>
          <path d="M180 125 Q192 112 196 100 L204 100 L200 122 Q195 130 186 130 Z" fill="#ff3d7f" opacity=".5"/>
        </g>`
        : ""}
    `;
  }
  if (subject === "deer") {
    return `
      <g transform="translate(${-offset * 24},0)" opacity="${1 - double * 0.3}">
        <ellipse cx="140" cy="118" rx="46" ry="20" fill="${col}"/>
        <path d="M180 116 Q200 110 206 90 L212 90 L208 116 Q202 124 188 122 Z" fill="${col}"/>
        <ellipse cx="210" cy="92" rx="5" ry="4" fill="${col}"/>
        ${wing > 0
          ? `<g opacity="${wing}">
              <path d="M208 86 Q215 ${70 - wing * 30} 212 ${60 - wing * 40}" stroke="${col}" stroke-width="${1.5 + wing * 2}" fill="none"/>
              <path d="M212 85 Q222 ${72 - wing * 30} 228 ${58 - wing * 40}" stroke="${col}" stroke-width="${1.2 + wing * 1.8}" fill="none"/>
              <path d="M204 85 Q198 ${70 - wing * 30} 195 ${58 - wing * 42}" stroke="${col}" stroke-width="${1.5 + wing * 2}" fill="none"/>
              <path d="M200 84 Q188 ${70 - wing * 28} 180 ${60 - wing * 38}" stroke="${col}" stroke-width="${1.2 + wing * 1.8}" fill="none"/>
            </g>`
          : `<path d="M206 88 Q212 78 210 72" stroke="${col}" stroke-width="1.5" fill="none"/>
             <path d="M212 88 Q220 78 222 72" stroke="${col}" stroke-width="1.2" fill="none"/>`}
        <!-- legs -->
        <line x1="108" y1="136" x2="104" y2="168" stroke="${col}" stroke-width="2"/>
        <line x1="124" y1="138" x2="122" y2="168" stroke="${col}" stroke-width="2"/>
        <line x1="156" y1="138" x2="158" y2="168" stroke="${col}" stroke-width="2"/>
        <line x1="172" y1="136" x2="174" y2="168" stroke="${col}" stroke-width="2"/>
        <!-- tail -->
        <path d="M96 112 Q90 108 88 114" stroke="${col}" stroke-width="1.5" fill="none"/>
      </g>
      ${double > 0
        ? `<g transform="translate(${24 + offset * 24},0) scale(0.97)" opacity="${double * 0.7}" style="filter:blur(0.5px)">
          <ellipse cx="140" cy="118" rx="46" ry="20" fill="#ff3d7f" opacity=".45"/>
          <ellipse cx="210" cy="92" rx="5" ry="4" fill="#ff3d7f" opacity=".6"/>
        </g>`
        : ""}
    `;
  }
  if (subject === "bird") {
    // Small perched bird — wings unfolding on sprout = reveal larger spectral wings
    return `
      <g transform="translate(${-offset * 18},0)" opacity="${1 - double * 0.3}">
        <ellipse cx="150" cy="115" rx="22" ry="14" fill="${col}"/>
        <circle cx="170" cy="104" r="9" fill="${col}"/>
        <path d="M178 102 L186 100 L180 106 Z" fill="#c4b25a"/>
        <circle cx="172" cy="102" r="1.5" fill="#fff"/>
        <!-- perch -->
        <line x1="120" y1="128" x2="180" y2="128" stroke="#3a2a1a" stroke-width="3"/>
        <!-- feet -->
        <line x1="146" y1="125" x2="146" y2="130" stroke="${col}" stroke-width="1.5"/>
        <line x1="154" y1="125" x2="154" y2="130" stroke="${col}" stroke-width="1.5"/>
        <!-- tail -->
        <path d="M128 116 L116 118 L114 124 Z" fill="${col}"/>
        ${wing > 0
          ? `<g opacity="${wing}">
            <path d="M150 108 Q${110 - wing * 40} ${90 - wing * 30} ${80 - wing * 50} ${120 - wing * 20} Q${110 - wing * 30} 118 148 116 Z" fill="#6a4a2a" opacity=".85"/>
            <path d="M150 108 Q${190 + wing * 40} ${90 - wing * 30} ${220 + wing * 50} ${120 - wing * 20} Q${190 + wing * 30} 118 152 116 Z" fill="#6a4a2a" opacity=".85"/>
            ${Array.from({ length: 6 }, (_, i) => `<line x1="${148 - i * 8}" y1="${112 - i * 3}" x2="${110 - i * 14 - wing * 20}" y2="${94 - i * 3 - wing * 14}" stroke="#3a2a1a" stroke-width=".7"/>`).join("")}
            ${Array.from({ length: 6 }, (_, i) => `<line x1="${152 + i * 8}" y1="${112 - i * 3}" x2="${190 + i * 14 + wing * 20}" y2="${94 - i * 3 - wing * 14}" stroke="#3a2a1a" stroke-width=".7"/>`).join("")}
            <ellipse cx="170" cy="${95 - wing * 14}" rx="${11 + wing * 3}" ry="${2.5 + wing}" fill="none" stroke="#e8d880" stroke-width="${.8 + wing}" opacity="${wing * .9}"/>
          </g>`
          : ""}
      </g>
      ${double > 0
        ? `<g transform="translate(${18 + offset * 18},0)" opacity="${double * 0.65}" style="filter:blur(0.5px)">
          <ellipse cx="150" cy="115" rx="22" ry="14" fill="#ff3d7f" opacity=".45"/>
          <circle cx="170" cy="104" r="9" fill="#ff3d7f" opacity=".55"/>
        </g>`
        : ""}
    `;
  }
  if (subject === "polar") {
    return `
      <g transform="translate(${-offset * 22},0)" opacity="${1 - double * 0.3}">
        <!-- body -->
        <path d="M64 138 Q60 110 98 104 L196 104 Q232 108 236 138 Q234 158 210 162 L92 162 Q66 160 64 138 Z" fill="#f6efe0"/>
        <!-- head -->
        <ellipse cx="216" cy="120" rx="18" ry="14" fill="#f6efe0"/>
        <circle cx="226" cy="116" r="2" fill="${col}"/>
        <ellipse cx="230" cy="124" rx="3" ry="2" fill="${col}"/>
        <!-- ears -->
        <circle cx="210" cy="108" r="3" fill="#f6efe0"/>
        <circle cx="222" cy="107" r="3" fill="#f6efe0"/>
        <circle cx="210" cy="108" r="1.5" fill="#d8cbb0"/>
        <!-- legs -->
        <rect x="90" y="160" width="14" height="18" rx="2" fill="#f6efe0"/>
        <rect x="126" y="160" width="14" height="18" rx="2" fill="#f6efe0"/>
        <rect x="170" y="160" width="14" height="18" rx="2" fill="#f6efe0"/>
        <rect x="202" y="160" width="14" height="18" rx="2" fill="#f6efe0"/>
        ${wing > 0
          ? `<g opacity="${wing}">
            <path d="M120 108 Q80 ${82 - wing * 24} 46 ${96 - wing * 14} Q80 114 110 114 Z" fill="#d4c4a8" opacity=".85"/>
            <path d="M180 108 Q220 ${82 - wing * 24} 254 ${96 - wing * 14} Q220 114 190 114 Z" fill="#d4c4a8" opacity=".85"/>
            <ellipse cx="216" cy="${102 - wing * 14}" rx="${18 + wing * 4}" ry="${3.5 + wing * 1.2}" fill="none" stroke="#e8d880" stroke-width="${.8 + wing}" opacity="${wing * .9}"/>
          </g>`
          : ""}
      </g>
      ${double > 0
        ? `<g transform="translate(${22 + offset * 22},0)" opacity="${double * 0.65}" style="filter:blur(0.5px)">
          <path d="M64 138 Q60 110 98 104 L196 104 Q232 108 236 138 Q234 158 210 162 L92 162 Q66 160 64 138 Z" fill="#ff3d7f" opacity=".3"/>
          <ellipse cx="216" cy="120" rx="18" ry="14" fill="#ff3d7f" opacity=".45"/>
        </g>`
        : ""}
    `;
  }
  // sky (unused in this roster but kept for future)
  return wing > 0 || double > 0
    ? `<g opacity="${Math.max(wing, double)}">
        <circle cx="140" cy="100" r="3" fill="rgba(255,255,255,.9)"/>
        <path d="M100 100 Q60 80 40 100 Q60 110 90 110 Z" fill="rgba(127,216,122,.4)"/>
        <path d="M180 100 Q220 80 240 100 Q220 110 190 110 Z" fill="rgba(127,216,122,.4)"/>
      </g>`
    : "";
}
