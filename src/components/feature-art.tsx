/**
 * The three large signature-experience compositions from the reference, at
 * 600×450. Ids are prefixed per scene so all three can share a page.
 */

function strip(values: Array<[number, number, number]>, fill: string, opacity = 1) {
  return (
    <g fill={fill} opacity={opacity}>
      {values.map(([x, y, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="2" height={h} />
      ))}
    </g>
  );
}

const F2_CITY: Array<[number, number, number]> = [
  [20, 310, 10],
  [40, 305, 15],
  [60, 312, 8],
  [85, 300, 20],
  [110, 308, 12],
  [140, 302, 18],
  [175, 310, 10],
  [210, 298, 22],
  [250, 305, 15],
  [290, 309, 11],
  [330, 303, 17],
  [370, 307, 13],
  [410, 311, 9],
  [450, 301, 19],
  [490, 306, 14],
  [530, 310, 10],
  [570, 304, 16],
];

/** VR Arena — figure inside a portal on a perspective grid floor. */
export function VrArenaArt() {
  return (
    <svg viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="f1-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#06080F" />
          <stop offset="0.5" stopColor="#0A1F3D" />
          <stop offset="1" stopColor="#082A4A" />
        </linearGradient>
        <radialGradient id="f1-portal" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#00F0FF" />
          <stop offset="0.3" stopColor="#0052CC" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0052CC" stopOpacity="0" />
        </radialGradient>
        <filter id="f1-blur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width="600" height="450" fill="url(#f1-bg)" />
      <g stroke="#00F0FF" strokeWidth="0.5" opacity="0.3" fill="none">
        <path d="M 0 450 L 300 280 L 600 450" />
        <path d="M 0 450 L 150 340 L 300 280" />
        <path d="M 300 280 L 450 340 L 600 450" />
        <line x1="100" y1="400" x2="500" y2="400" />
        <line x1="150" y1="360" x2="450" y2="360" />
        <line x1="200" y1="320" x2="400" y2="320" />
        <line x1="240" y1="300" x2="360" y2="300" />
      </g>
      <circle cx="300" cy="220" r="180" fill="url(#f1-portal)" filter="url(#f1-blur)" />
      <circle cx="300" cy="220" r="90" fill="url(#f1-portal)" />
      <g transform="translate(300 240)" fill="#000">
        <ellipse cx="0" cy="-10" rx="24" ry="28" opacity="0.9" />
        <rect
          x="-28"
          y="-18"
          width="56"
          height="20"
          rx="8"
          fill="#00F0FF"
          opacity="0.9"
        />
        <rect x="-20" y="20" width="40" height="80" rx="6" opacity="0.9" />
        <path
          d="M -20 30 Q -60 20 -72 -10"
          stroke="#000"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 20 30 Q 60 20 72 -10"
          stroke="#000"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <g fill="#00F0FF" opacity="0.5">
        <circle cx="150" cy="100" r="2" />
        <circle cx="450" cy="120" r="1.5" />
        <circle cx="100" cy="200" r="1" />
        <circle cx="500" cy="180" r="2" />
        <circle cx="80" cy="300" r="1" />
        <circle cx="520" cy="280" r="1.5" />
      </g>
    </svg>
  );
}

/** Flight Simulator — night approach seen through the cockpit frame. */
export function FlightSimArt() {
  return (
    <svg viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="f2-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A0A1F" />
          <stop offset="0.5" stopColor="#1E1033" />
          <stop offset="0.8" stopColor="#3A1810" />
          <stop offset="1" stopColor="#6B2912" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#f2-bg)" />
      {strip(F2_CITY, '#FFB84D')}
      <g fill="#FFB84D">
        <circle cx="280" cy="340" r="2" opacity="0.9" />
        <circle cx="285" cy="360" r="2.5" opacity="0.9" />
        <circle cx="290" cy="385" r="3" opacity="0.9" />
        <circle cx="295" cy="415" r="4" opacity="0.9" />
        <circle cx="320" cy="340" r="2" opacity="0.9" />
        <circle cx="315" cy="360" r="2.5" opacity="0.9" />
        <circle cx="310" cy="385" r="3" opacity="0.9" />
        <circle cx="305" cy="415" r="4" opacity="0.9" />
      </g>
      <path
        d="M 0 0 L 0 100 Q 20 80 50 72 L 150 72 Q 180 70 200 80 L 220 85 L 380 85 L 400 80 Q 420 70 450 72 L 550 72 Q 580 80 600 100 L 600 0 Z"
        fill="#000"
        opacity="0.8"
      />
      <path
        d="M 0 450 L 0 420 Q 50 390 150 385 L 450 385 Q 550 390 600 420 L 600 450 Z"
        fill="#000"
        opacity="0.9"
      />
      <g transform="translate(300 220)" stroke="#FFB84D" fill="none" opacity="0.7">
        <circle r="60" strokeWidth="1" />
        <circle r="36" strokeWidth="1" />
        <path
          d="M -70 0 L -60 0 M 60 0 L 70 0 M 0 -70 L 0 -60 M 0 60 L 0 70"
          strokeWidth="1.5"
        />
        <rect x="-50" y="-85" width="100" height="14" fill="#000" opacity="0.6" />
        <text
          x="0"
          y="-74"
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontSize="10"
          fill="#FFB84D"
          stroke="none"
        >
          270
        </text>
        <rect x="-100" y="-14" width="30" height="28" fill="#000" opacity="0.6" />
        <text
          x="-85"
          y="4"
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontSize="9"
          fill="#FFB84D"
          stroke="none"
        >
          142
        </text>
        <rect x="70" y="-14" width="30" height="28" fill="#000" opacity="0.6" />
        <text
          x="85"
          y="4"
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontSize="9"
          fill="#FFB84D"
          stroke="none"
        >
          2800
        </text>
      </g>
    </svg>
  );
}

/** Streaming Pod — treated booth, ring light, mic and flanking monitors. */
export function StreamingPodArt() {
  const foam = Array.from({ length: 12 }, (_, i) => 60 + i * 40);
  const wave = Array.from({ length: 26 }, (_, i) => {
    const heights = [
      8, 14, 10, 18, 6, 14, 8, 12, 6, 10, 16, 8, 12, 6, 14, 10, 18, 8, 12, 6, 14, 10, 6,
      12, 8, 14,
    ];
    const h = heights[i] ?? 8;
    return { x: 200 + i * 8, y: 408 - h, h };
  });

  return (
    <svg viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="f3-bg" cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#3D0F2C" />
          <stop offset="0.6" stopColor="#1A0712" />
          <stop offset="1" stopColor="#06030A" />
        </radialGradient>
      </defs>
      <rect width="600" height="450" fill="url(#f3-bg)" />
      <rect x="60" y="40" width="480" height="360" fill="#0D0A1E" opacity="0.6" />
      <g fill="#1F0E2E" opacity="0.8">
        {foam.map((x) => (
          <path key={x} d={`M ${x} 40 L ${x + 25} 40 L ${x + 12.5} 60 Z`} />
        ))}
      </g>
      <circle
        cx="300"
        cy="180"
        r="120"
        fill="none"
        stroke="#FF80B5"
        strokeWidth="3"
        opacity="0.6"
      />
      <circle cx="300" cy="180" r="120" fill="#FF80B5" opacity="0.15" />
      <circle
        cx="300"
        cy="180"
        r="100"
        fill="none"
        stroke="#FFB84D"
        strokeWidth="1"
        opacity="0.4"
      />
      <g transform="translate(300 220)">
        <circle cy="-10" r="36" fill="#2A0F26" />
        <rect x="-50" y="22" width="100" height="150" rx="12" fill="#2A0F26" />
      </g>
      <g transform="translate(300 300)">
        <rect
          x="-16"
          y="-30"
          width="32"
          height="52"
          rx="10"
          fill="#0D0A1E"
          stroke="#FF80B5"
          strokeWidth="1.5"
        />
        <g stroke="#FF80B5" opacity="0.6">
          <line x1="-12" y1="-22" x2="12" y2="-22" />
          <line x1="-12" y1="-14" x2="12" y2="-14" />
          <line x1="-12" y1="-6" x2="12" y2="-6" />
          <line x1="-12" y1="2" x2="12" y2="2" />
          <line x1="-12" y1="10" x2="12" y2="10" />
        </g>
      </g>
      <rect
        x="80"
        y="200"
        width="110"
        height="80"
        rx="4"
        fill="#000"
        stroke="#FF80B5"
        strokeWidth="1"
        opacity="0.7"
      />
      <rect
        x="410"
        y="200"
        width="110"
        height="80"
        rx="4"
        fill="#000"
        stroke="#FF80B5"
        strokeWidth="1"
        opacity="0.7"
      />
      <g fill="#FF80B5" opacity="0.5">
        <rect x="92" y="215" width="40" height="4" rx="1" />
        <rect x="92" y="225" width="60" height="4" rx="1" />
        <rect x="92" y="235" width="30" height="4" rx="1" />
        <rect x="92" y="245" width="50" height="4" rx="1" />
        <rect x="92" y="255" width="40" height="4" rx="1" />
      </g>
      <g fill="#00F0FF" opacity="0.5">
        <rect x="422" y="215" width="50" height="20" rx="2" />
        <rect x="422" y="243" width="80" height="4" rx="1" />
        <rect x="422" y="253" width="60" height="4" rx="1" />
        <rect x="422" y="263" width="70" height="4" rx="1" />
      </g>
      <g fill="#FF80B5" opacity="0.5">
        {wave.map((bar) => (
          <rect key={bar.x} x={bar.x} y={bar.y} width="3" height={bar.h} />
        ))}
      </g>
    </svg>
  );
}

export const FEATURE_ART: Record<string, () => JSX.Element> = {
  'vr-arena': VrArenaArt,
  'flight-sim': FlightSimArt,
  'streaming-pod': StreamingPodArt,
};
