/**
 * The six hand-composed zone scenes from the approved reference, one per
 * slug. These are not photographs and not placeholders — each is an abstract
 * composition in that zone's accent colour.
 *
 * Every gradient and filter id is prefixed with `uid`, which callers set when
 * the same zone's art can appear twice on one page (a card and a hero, say).
 * Duplicate SVG ids are document-global: the second instance would silently
 * inherit the first one's gradient.
 */

export const ZONE_SLUGS = [
  'vr-arena',
  'flight-sim',
  'racing-cockpit',
  'esports-station',
  'console-lounge',
  'streaming-pod',
] as const;

export type ZoneSlug = (typeof ZONE_SLUGS)[number];

/** The accent each zone's art is drawn in, matching the reference palette. */
export const ZONE_ACCENT: Record<string, string> = {
  'vr-arena': '#00F0FF',
  'flight-sim': '#FFB84D',
  'racing-cockpit': '#FF2E9A',
  'esports-station': '#A78BFA',
  'console-lounge': '#10D97E',
  'streaming-pod': '#FF80B5',
};

type ArtProps = { uid: string };

const CARD_VIEWBOX = '0 0 400 240';

function VrArena({ uid }: ArtProps) {
  return (
    <svg viewBox={CARD_VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="55%" r="70%">
          <stop offset="0" stopColor="#083747" />
          <stop offset="0.5" stopColor="#061826" />
          <stop offset="1" stopColor="#030810" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#00F0FF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#00F0FF" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-blur`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <rect width="400" height="240" fill={`url(#${uid}-bg)`} />
      <ellipse
        cx="200"
        cy="135"
        rx="150"
        ry="60"
        fill="none"
        stroke="#00F0FF"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <ellipse
        cx="200"
        cy="135"
        rx="110"
        ry="45"
        fill="none"
        stroke="#00F0FF"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <ellipse
        cx="200"
        cy="135"
        rx="70"
        ry="28"
        fill="none"
        stroke="#00F0FF"
        strokeOpacity="0.7"
        strokeWidth="1"
      />
      <circle cx="200" cy="135" r="60" fill={`url(#${uid}-glow)`} />
      <g transform="translate(200 135)">
        <path
          d="M -50 -8 Q -50 -22 -36 -22 L 36 -22 Q 50 -22 50 -8 L 50 10 Q 50 22 36 22 L -36 22 Q -50 22 -50 10 Z"
          fill="#0D1120"
          stroke="#00F0FF"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <circle
          cx="-20"
          cy="0"
          r="10"
          fill="#00F0FF"
          opacity="0.4"
          filter={`url(#${uid}-blur)`}
        />
        <circle
          cx="20"
          cy="0"
          r="10"
          fill="#00F0FF"
          opacity="0.4"
          filter={`url(#${uid}-blur)`}
        />
        <circle cx="-20" cy="0" r="6" fill="#00F0FF" />
        <circle cx="20" cy="0" r="6" fill="#00F0FF" />
      </g>
      <circle cx="80" cy="50" r="1.5" fill="#00F0FF" opacity="0.6" />
      <circle cx="340" cy="70" r="1" fill="#00F0FF" opacity="0.5" />
      <circle cx="60" cy="200" r="1" fill="#00F0FF" opacity="0.4" />
      <circle cx="350" cy="190" r="1.5" fill="#00F0FF" opacity="0.6" />
    </svg>
  );
}

const CITY_LIGHTS: Array<[number, number, number]> = [
  [20, 162, 8],
  [40, 158, 12],
  [56, 164, 6],
  [78, 160, 10],
  [95, 156, 14],
  [130, 158, 12],
  [150, 163, 7],
  [175, 155, 15],
  [210, 160, 10],
  [245, 158, 12],
  [270, 162, 8],
  [295, 156, 14],
  [320, 160, 10],
  [350, 164, 6],
  [375, 158, 12],
];

function FlightSim({ uid }: ArtProps) {
  return (
    <svg viewBox={CARD_VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A1830" />
          <stop offset="0.6" stopColor="#1E1138" />
          <stop offset="1" stopColor="#FFB84D" stopOpacity="0.4" />
        </linearGradient>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <rect width="400" height="240" fill={`url(#${uid}-sky)`} />
      <rect y="170" width="400" height="2" fill="#FFB84D" opacity="0.6" />
      <g fill="#FFB84D">
        {CITY_LIGHTS.map(([x, y, h]) => (
          <rect key={x} x={x} y={y} width="2" height={h} />
        ))}
      </g>
      <g fill="#FFB84D" opacity="0.3" filter={`url(#${uid}-glow)`}>
        <circle cx="100" cy="175" r="4" />
        <circle cx="200" cy="175" r="5" />
        <circle cx="300" cy="175" r="4" />
      </g>
      <g
        transform="translate(200 110)"
        stroke="#FFB84D"
        fill="none"
        strokeWidth="1.2"
        opacity="0.8"
      >
        <circle r="50" opacity="0.4" />
        <circle r="30" opacity="0.6" />
        <circle r="12" />
        <line x1="-70" y1="0" x2="-55" y2="0" />
        <line x1="55" y1="0" x2="70" y2="0" />
        <line x1="0" y1="-70" x2="0" y2="-55" />
        <line x1="0" y1="55" x2="0" y2="70" />
        <path d="M -10 -32 L 0 -42 L 10 -32" fill="#FFB84D" opacity="0.9" />
      </g>
      <g fill="#fff" opacity="0.6">
        <circle cx="60" cy="30" r="0.8" />
        <circle cx="120" cy="50" r="0.6" />
        <circle cx="260" cy="40" r="0.8" />
        <circle cx="340" cy="60" r="0.6" />
        <circle cx="30" cy="80" r="0.5" />
        <circle cx="370" cy="90" r="0.7" />
      </g>
    </svg>
  );
}

function RacingCockpit({ uid }: ArtProps) {
  const speedLines: Array<[number, number, number]> = [
    [20, 40, 0.6],
    [10, 80, 0.7],
    [30, 130, 0.8],
    [20, 170, 0.7],
    [40, 210, 0.6],
    [380, 40, 0.6],
    [390, 80, 0.7],
    [370, 130, 0.8],
    [380, 170, 0.7],
    [360, 210, 0.6],
  ];

  return (
    <svg viewBox={CARD_VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="50%" r="70%">
          <stop offset="0" stopColor="#3A0D1A" />
          <stop offset="0.6" stopColor="#190712" />
          <stop offset="1" stopColor="#060208" />
        </radialGradient>
        <linearGradient id={`${uid}-speed`} x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0" stopColor="#FF2E9A" stopOpacity="0" />
          <stop offset="1" stopColor="#FF2E9A" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${uid}-bg)`} />
      <g stroke={`url(#${uid}-speed)`} strokeWidth="1.5" fill="none">
        {speedLines.map(([x, y, o]) => (
          <line key={`${x}-${y}`} x1={x} y1={y} x2="200" y2="120" opacity={o} />
        ))}
      </g>
      <circle cx="200" cy="120" r="40" fill="#FF2E9A" opacity="0.3" />
      <circle cx="200" cy="120" r="20" fill="#FF2E9A" opacity="0.6" />
      <circle cx="200" cy="120" r="8" fill="#fff" />
      <g transform="translate(200 120)" opacity="0.9">
        <polygon
          points="40,0 20,34 -20,34 -40,0 -20,-34 20,-34"
          fill="none"
          stroke="#FF2E9A"
          strokeWidth="1.5"
        />
        <polygon
          points="24,0 12,20 -12,20 -24,0 -12,-20 12,-20"
          fill="none"
          stroke="#FF2E9A"
          strokeWidth="1"
          opacity="0.7"
        />
        <circle r="5" fill="#FF2E9A" />
      </g>
    </svg>
  );
}

function EsportsStation({ uid }: ArtProps) {
  const keys = [
    '#A78BFA',
    '#FF2E9A',
    '#00F0FF',
    '#A78BFA',
    '#FF2E9A',
    '#A78BFA',
    '#00F0FF',
    '#A78BFA',
    '#FF2E9A',
    '#A78BFA',
    '#00F0FF',
    '#A78BFA',
  ];

  return (
    <svg viewBox={CARD_VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A0F3D" />
          <stop offset="1" stopColor="#0A0520" />
        </linearGradient>
        <radialGradient id={`${uid}-mon`}>
          <stop offset="0" stopColor="#A78BFA" stopOpacity="0.6" />
          <stop offset="1" stopColor="#A78BFA" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${uid}-bg)`} />
      <rect
        x="80"
        y="40"
        width="240"
        height="130"
        rx="4"
        fill="#000"
        stroke="#A78BFA"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <rect
        x="90"
        y="50"
        width="220"
        height="110"
        rx="2"
        fill={`url(#${uid}-mon)`}
        opacity="0.5"
      />
      <circle cx="200" cy="105" r="30" fill="#FF2E9A" opacity="0.3" />
      <g stroke="#A78BFA" strokeWidth="1" fill="none" opacity="0.7">
        <path d="M 100 60 L 100 70 M 100 60 L 110 60" />
        <path d="M 300 60 L 300 70 M 300 60 L 290 60" />
        <path d="M 100 150 L 100 140 M 100 150 L 110 150" />
        <path d="M 300 150 L 300 140 M 300 150 L 290 150" />
      </g>
      <rect x="190" y="170" width="20" height="20" fill="#A78BFA" opacity="0.4" />
      <rect x="170" y="188" width="60" height="4" fill="#A78BFA" opacity="0.6" />
      <g transform="translate(70 200)" opacity="0.9">
        {keys.map((fill, index) => (
          <rect
            key={index}
            x={index * 22}
            y="0"
            width="16"
            height="16"
            rx="2"
            fill={fill}
          />
        ))}
      </g>
    </svg>
  );
}

function ConsoleController({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M 0 0 Q -16 0 -16 16 Q -16 32 0 32 L 50 32 Q 66 32 66 16 Q 66 0 50 0 Z"
        fill="#10D97E"
        opacity="0.3"
        stroke="#10D97E"
        strokeWidth="1"
      />
      <circle cx="12" cy="16" r="4" fill="#10D97E" opacity="0.6" />
      <circle cx="54" cy="12" r="2.5" fill="#FF2E9A" />
      <circle cx="60" cy="18" r="2.5" fill="#00F0FF" />
      <circle cx="54" cy="24" r="2.5" fill="#FFB84D" />
      <circle cx="48" cy="18" r="2.5" fill="#A78BFA" />
    </g>
  );
}

function ConsoleLounge({ uid }: ArtProps) {
  return (
    <svg viewBox={CARD_VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="50%" r="70%">
          <stop offset="0" stopColor="#0F3326" />
          <stop offset="1" stopColor="#040E0A" />
        </radialGradient>
        <radialGradient id={`${uid}-screen`}>
          <stop offset="0" stopColor="#10D97E" stopOpacity="0.6" />
          <stop offset="1" stopColor="#10D97E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${uid}-bg)`} />
      <rect
        x="60"
        y="30"
        width="280"
        height="140"
        rx="6"
        fill="#000"
        stroke="#10D97E"
        strokeWidth="1.5"
      />
      <rect x="70" y="40" width="260" height="120" rx="2" fill={`url(#${uid}-screen)`} />
      <line
        x1="200"
        y1="40"
        x2="200"
        y2="160"
        stroke="#10D97E"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <g stroke="#10D97E" fill="none" strokeWidth="1" opacity="0.7">
        <rect x="80" y="50" width="40" height="6" rx="1" fill="#10D97E" opacity="0.4" />
        <rect x="210" y="50" width="40" height="6" rx="1" fill="#FF2E9A" opacity="0.4" />
        <circle cx="100" cy="110" r="12" />
        <circle cx="300" cy="110" r="12" />
      </g>
      <ConsoleController x={100} y={190} />
      <ConsoleController x={234} y={190} />
    </svg>
  );
}

const WAVEFORM_LEFT: Array<[number, number, number]> = [
  [30, 210, 8],
  [36, 206, 12],
  [42, 212, 6],
  [48, 200, 18],
  [54, 208, 10],
  [60, 214, 4],
  [66, 204, 14],
  [72, 212, 6],
  [78, 206, 12],
];

const WAVEFORM_RIGHT: Array<[number, number, number]> = [
  [320, 212, 6],
  [326, 208, 10],
  [332, 202, 16],
  [338, 210, 8],
  [344, 206, 12],
  [350, 212, 6],
  [356, 200, 18],
  [362, 208, 10],
  [368, 212, 6],
];

function StreamingPod({ uid }: ArtProps) {
  return (
    <svg viewBox={CARD_VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="50%" r="70%">
          <stop offset="0" stopColor="#3D0F2C" />
          <stop offset="1" stopColor="#120515" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor="#FF80B5" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FF80B5" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${uid}-bg)`} />
      <circle
        cx="200"
        cy="120"
        r="80"
        fill="none"
        stroke="#FF80B5"
        strokeWidth="3"
        opacity="0.4"
      />
      <circle cx="200" cy="120" r="80" fill={`url(#${uid}-glow)`} />
      <circle
        cx="200"
        cy="120"
        r="70"
        fill="none"
        stroke="#FFB84D"
        strokeWidth="1"
        opacity="0.5"
      />
      <g transform="translate(200 120)">
        <rect
          x="-14"
          y="-40"
          width="28"
          height="56"
          rx="14"
          fill="#0D1120"
          stroke="#FF80B5"
          strokeWidth="1.5"
        />
        <g stroke="#FF80B5" opacity="0.6">
          <line x1="-10" y1="-30" x2="10" y2="-30" />
          <line x1="-10" y1="-20" x2="10" y2="-20" />
          <line x1="-10" y1="-10" x2="10" y2="-10" />
          <line x1="-10" y1="0" x2="10" y2="0" />
          <line x1="-10" y1="10" x2="10" y2="10" />
        </g>
        <line x1="0" y1="20" x2="0" y2="38" stroke="#FF80B5" strokeWidth="2" />
        <path d="M -16 42 Q 0 32 16 42" fill="none" stroke="#FF80B5" strokeWidth="2" />
      </g>
      <g fill="none" stroke="#FF80B5" opacity="0.3">
        <circle cx="200" cy="120" r="110" />
        <circle cx="200" cy="120" r="130" />
      </g>
      <g fill="#FF80B5" opacity="0.6">
        {[...WAVEFORM_LEFT, ...WAVEFORM_RIGHT].map(([x, y, h]) => (
          <rect key={x} x={x} y={y} width="2" height={h} />
        ))}
      </g>
    </svg>
  );
}

const ART: Record<string, (props: ArtProps) => JSX.Element> = {
  'vr-arena': VrArena,
  'flight-sim': FlightSim,
  'racing-cockpit': RacingCockpit,
  'esports-station': EsportsStation,
  'console-lounge': ConsoleLounge,
  'streaming-pod': StreamingPod,
};

/**
 * Renders a zone's scene. An unknown slug falls back to the VR composition
 * rather than rendering nothing, so a new DB row can never leave a blank card.
 */
export function ZoneArt({ slug, uid }: { slug: string; uid?: string }) {
  const Art = ART[slug] ?? VrArena;
  return <Art uid={uid ?? `za-${slug}`} />;
}
