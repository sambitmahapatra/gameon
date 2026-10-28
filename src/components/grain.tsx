/**
 * Fixed fractal-noise layer over the whole page (V2 fix 3a). The SVG is a data
 * URI so it costs no request, and the layer only paints — it never animates, so
 * it survives prefers-reduced-motion untouched.
 *
 * Opacity comes from --grain-overlay, which each theme sets for itself.
 */
const NOISE =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E";

export function Grain() {
  return (
    <div
      aria-hidden="true"
      data-grain
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay"
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundRepeat: 'repeat',
        opacity: 'var(--grain-overlay)',
      }}
    />
  );
}
