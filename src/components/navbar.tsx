'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

import { LiveCounter } from '@/components/live-counter';
import { Logo } from '@/components/logo';
import { Magnetic } from '@/components/magnetic';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const LINKS = [
  { href: '/zones/vr-arena', label: 'Zones', match: '/zones' },
  { href: '/#experiences', label: 'Experiences', match: '#experiences' },
  { href: '/membership', label: 'Membership', match: '/membership' },
  { href: '/events', label: 'Tournaments', match: '/events' },
  { href: '/menu', label: 'Café', match: '/menu' },
];

/**
 * Sticky nav that picks up a bottom border once the page has scrolled past
 * 20px, matching the reference's `.is-stuck` state. The blur and translucent
 * background are always on, so the bar never flashes opaque.
 */
export function Navbar() {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A route change closes the drawer; otherwise it stays open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className={`nav${stuck ? 'is-stuck' : ''}`}>
      <div className="wrap nav__inner">
        <Link href="/" aria-label="GameOn home">
          <Logo idPrefix="nav" />
        </Link>

        <div className="nav__links">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav__link"
              data-active={link.match.startsWith('/') && pathname.startsWith(link.match)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav__right">
          <LiveCounter />
          <ThemeToggle />

          <Magnetic className="hidden sm:inline-flex">
            <Link href="/book" className="btn btn--primary">
              Book a session
            </Link>
          </Magnetic>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="theme-toggle min-[900px]:hidden"
                aria-label="Open menu"
              >
                <Menu aria-hidden="true" className="size-[18px]" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-line bg-bg">
              <SheetTitle className="font-display text-h3">Menu</SheetTitle>

              <div className="mt-8 flex flex-col gap-1">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-button px-3 py-3 text-[1.05rem] font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <Link href="/book" className="btn btn--primary btn--lg mt-8 w-full">
                Book a session
              </Link>

              <p className="mt-6 text-meta text-fg-dim">Open 10 AM — 10 PM, every day</p>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
