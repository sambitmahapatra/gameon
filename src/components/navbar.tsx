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
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/#zones', label: 'The zones', match: '/zones' },
  { href: '/#experiences', label: 'Experiences', match: '#experiences' },
  { href: '/#cafe', label: 'The café', match: '/menu' },
  { href: '/#membership', label: 'Membership', match: '/membership' },
  { href: '/#events', label: 'Events', match: '/events' },
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
    <>
      <div className="club-topline">
        Play more. Connect more. Make a night of it. <span>— Welcome to GameOn</span>
      </div>
      <nav aria-label="Main navigation" className={cn('club-nav', stuck && 'is-stuck')}>
        <div className="club-wrap club-nav__inner">
          <Link href="/" aria-label="GameOn home">
            <Logo idPrefix="nav" compact />
          </Link>

          <div className="club-nav__links">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="club-nav__link"
                data-active={
                  link.match.startsWith('/') && pathname.startsWith(link.match)
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="club-nav__right">
            <ThemeToggle />

            <Magnetic className="hidden sm:inline-flex">
              <Link href="/book" className="club-btn">
                Book your session ↗
              </Link>
            </Magnetic>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="theme-toggle min-[1000px]:hidden"
                  aria-label="Open menu"
                >
                  <Menu aria-hidden="true" className="size-[18px]" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-line bg-bg">
                <SheetTitle className="font-display text-h3">Menu</SheetTitle>

                <div className="mt-8 flex flex-col gap-1">
                  {LINKS.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="drawer-link rounded-button px-3 py-3 text-[1.05rem] font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <Link
                  href="/book"
                  onClick={() => setOpen(false)}
                  className="club-btn mt-8 w-full"
                >
                  Book a session
                </Link>

                <div className="mt-auto flex flex-col items-start gap-5 pt-6">
                  <LiveCounter className="!flex" />
                  <ThemeToggle />
                  <p className="text-meta text-fg-dim">Open 10 AM — 10 PM, every day</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
}
