/**
 * Seven-point trend line for the dashboard cards. Pure SVG with no axes or
 * labels — it is there to show shape, and the number above it carries the
 * value. `preserveAspectRatio="none"` lets it stretch to whatever width the
 * card gives it.
 */
export function Sparkline({
  points,
  label,
  accent = 'var(--accent)',
}: {
  points: number[];
  label: string;
  accent?: string;
}) {
  if (points.length < 2) return null;

  const max = Math.max(...points, 1);
  const step = 100 / (points.length - 1);
  const coords = points.map((value, index) => {
    const x = index * step;
    const y = 28 - (value / max) * 24;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      className="h-8 w-full"
    >
      <polyline
        points={`0,32 ${coords.join(' ')} 100,32`}
        fill={accent}
        fillOpacity="0.1"
        stroke="none"
      />
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
