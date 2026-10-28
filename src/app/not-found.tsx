import Link from 'next/link';

const ELSEWHERE = [
  { href: '/zones/vr-arena', label: 'VR Arena' },
  { href: '/zones/flight-sim', label: 'Flight Simulator' },
  { href: '/book', label: 'Book a session' },
  { href: '/events', label: 'Tournaments' },
  { href: '/menu', label: 'Café menu' },
];

/**
 * The hero's orbital mark, reduced to a single broken ring: the dot has come
 * off its path. Static SVG, no animation to fail.
 */
function LostOrbit() {
  return (
    <svg viewBox="0 0 220 220" aria-hidden="true" className="size-40 md:size-52">
      <defs>
        <linearGradient id="nf-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--magenta)" />
        </linearGradient>
      </defs>

      <circle
        cx="110"
        cy="110"
        r="78"
        fill="none"
        stroke="url(#nf-ring)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeDasharray="300 190"
        transform="rotate(-24 110 110)"
      />
      <ellipse
        cx="110"
        cy="110"
        rx="78"
        ry="30"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="1"
        transform="rotate(18 110 110)"
      />
      <circle cx="110" cy="110" r="13" fill="var(--accent)" fillOpacity="0.14" />
      <circle cx="110" cy="110" r="5" fill="var(--accent)" />
      <circle cx="196" cy="54" r="4.5" fill="var(--magenta)" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="section section--tight">
      <div className="wrap flex min-h-[62dvh] max-w-[760px] flex-col justify-center gap-7">
        <LostOrbit />

        <div>
          <div className="eyebrow">404</div>
          <h1 className="mt-4">This zone does not exist yet</h1>
          <p className="sub mt-4">
            The page you tried is not on the floor plan. Six zones are, though, and they
            are all a click away.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn--primary btn--lg">
            Back to the floor
          </Link>
          <Link href="/book" className="btn btn--ghost btn--lg">
            Book a session
          </Link>
        </div>

        <nav aria-label="Popular pages" className="mt-4 flex flex-wrap gap-2.5">
          {ELSEWHERE.map((item) => (
            <Link key={item.href} href={item.href} className="chip">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
