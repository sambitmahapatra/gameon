/**
 * The hero's orbital composition from the reference: six coloured orbs — one
 * per zone — orbiting a glowing core, inside three tilted rings.
 *
 * The rings and core animate through CSS classes in globals.css (orbit-spin,
 * core-pulse), so the motion is transform/opacity only and stops under
 * prefers-reduced-motion with everything else.
 */

const ORBS: Array<{
  x: number;
  y: number;
  r: number;
  core: number;
  id: string;
  hex: string;
}> = [
  { x: 300, y: 60, r: 24, core: 12, id: 'cyan', hex: '#00F0FF' },
  { x: 500, y: 180, r: 20, core: 10, id: 'amber', hex: '#FFB84D' },
  { x: 500, y: 420, r: 22, core: 11, id: 'magenta', hex: '#FF2E9A' },
  { x: 300, y: 540, r: 26, core: 13, id: 'violet', hex: '#A78BFA' },
  { x: 100, y: 420, r: 20, core: 10, id: 'green', hex: '#10D97E' },
  { x: 100, y: 180, r: 22, core: 11, id: 'rose', hex: '#FF80B5' },
];

const ORB_GRADIENTS: Array<[string, string, string]> = [
  ['cyan', '#00F0FF', '#0052CC'],
  ['magenta', '#FF2E9A', '#C2185B'],
  ['amber', '#FFB84D', '#B45309'],
  ['violet', '#A78BFA', '#6D28D9'],
  ['green', '#10D97E', '#047857'],
  ['rose', '#FF80B5', '#BE185D'],
];

const DUST: Array<[number, number, number]> = [
  [140, 110, 1.5],
  [460, 130, 1],
  [520, 320, 1.5],
  [470, 490, 1],
  [200, 520, 1.2],
  [80, 300, 1],
  [150, 470, 1.2],
  [380, 90, 1],
  [420, 550, 1.5],
];

export function HeroVisual() {
  return (
    <svg viewBox="0 0 600 600" aria-hidden="true">
      <defs>
        <radialGradient id="hv-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="1" />
          <stop offset="0.4" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="1" stopColor="var(--magenta)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hv-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hv-ring" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="var(--magenta)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--violet)" stopOpacity="0.5" />
        </linearGradient>
        {ORB_GRADIENTS.map(([id, from, to]) => (
          <radialGradient key={id} id={`hv-orb-${id}`}>
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} stopOpacity="0.6" />
          </radialGradient>
        ))}
        <filter id="hv-blur-sm">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="hv-blur-lg">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <circle cx="300" cy="300" r="280" fill="url(#hv-halo)" opacity="0.5" />

      {/* three tilted rings, each on its own period */}
      <g>
        <g className="orbit-ring" style={{ '--d': '90s' } as React.CSSProperties}>
          <ellipse
            cx="300"
            cy="300"
            rx="220"
            ry="90"
            fill="none"
            stroke="url(#hv-ring)"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
        <g
          className="orbit-ring orbit-ring--reverse"
          style={
            {
              '--d': '120s',
              transformOrigin: '300px 300px',
              rotate: '30deg',
            } as React.CSSProperties
          }
        >
          <ellipse
            cx="300"
            cy="300"
            rx="220"
            ry="90"
            fill="none"
            stroke="url(#hv-ring)"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
        <g
          className="orbit-ring"
          style={
            {
              '--d': '70s',
              transformOrigin: '300px 300px',
              rotate: '60deg',
            } as React.CSSProperties
          }
        >
          <ellipse
            cx="300"
            cy="300"
            rx="220"
            ry="90"
            fill="none"
            stroke="url(#hv-ring)"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      </g>

      {/* the six worlds */}
      <g
        className="orbit-ring"
        style={{ '--d': '48s', transformOrigin: '300px 300px' } as React.CSSProperties}
      >
        {ORBS.map((orb) => (
          <g key={orb.id} transform={`translate(${orb.x} ${orb.y})`}>
            <circle r={orb.r} fill={`url(#hv-orb-${orb.id})`} filter="url(#hv-blur-sm)" />
            <circle r={orb.core} fill={orb.hex} />
          </g>
        ))}
      </g>

      {/* core */}
      <circle
        cx="300"
        cy="300"
        r="180"
        fill="url(#hv-core)"
        opacity="0.6"
        filter="url(#hv-blur-lg)"
      />
      <g className="pulse-core">
        <circle cx="300" cy="300" r="80" fill="url(#hv-core)" />
        <circle cx="300" cy="300" r="40" fill="var(--accent)" opacity="0.9" />
        <circle cx="300" cy="300" r="18" fill="#fff" opacity="0.8" />
      </g>

      <g fill="var(--accent)" opacity="0.6">
        {DUST.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
    </svg>
  );
}
