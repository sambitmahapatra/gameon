import Link from 'next/link';

import { Button } from '@/components/ui/button';

const ELSEWHERE = [
  { href: '/zones/vr-arena', label: 'VR Arena' },
  { href: '/zones/flight-sim', label: 'Flight Simulator' },
  { href: '/book', label: 'Book a session' },
  { href: '/events', label: 'Tournaments' },
  { href: '/menu', label: 'Café menu' },
];

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70dvh] max-w-3xl flex-col justify-center gap-6 py-24">
      <p className="eyebrow">404</p>
      <h1 className="text-h1">This zone does not exist yet</h1>
      <p className="max-w-prose text-body text-muted-foreground">
        The page you tried is not on the floor plan. Six zones are, though, and they are
        all a click away.
      </p>

      <div className="flex flex-wrap gap-4 pt-2">
        <Button asChild size="lg">
          <Link href="/">Back to the floor</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/book">Book a session</Link>
        </Button>
      </div>

      <nav aria-label="Popular pages" className="mt-8 flex flex-wrap gap-2">
        {ELSEWHERE.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-border px-3.5 py-1.5 text-meta text-muted-foreground transition-colors hover:border-cyan/50 hover:text-cyan"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
