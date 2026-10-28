'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LiveCounter } from '@/components/live-counter';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/zones/vr-arena', label: 'Zones', match: '/zones' },
  { href: '/book', label: 'Book', match: '/book' },
  { href: '/events', label: 'Events', match: '/events' },
  { href: '/menu', label: 'Menu', match: '/menu' },
  { href: '/membership', label: 'Membership', match: '/membership' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Past 100px the bar takes on its own surface (V2 fix 4d)
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled
          ? 'border-border bg-surface/80 backdrop-blur-[20px]'
          : 'border-transparent bg-transparent',
      )}
    >
      <nav className="shell flex h-18 items-center justify-between gap-6 py-4">
        <Link href="/" aria-label="GameOn home" className="rounded-button">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative rounded-button py-1 text-meta transition-colors',
                  active ? 'text-cyan' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
                {/* Underline grows from the left on hover, and stays for the active link */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-cyan transition-transform duration-300 ease-out',
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LiveCounter className="mr-1 hidden xl:inline-flex" />
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/book">Book a Session</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu aria-hidden="true" className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>
                <Logo />
              </SheetTitle>
              <div className="flex flex-col gap-1">
                {LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-button px-3 py-3 font-display text-h3 text-foreground transition-colors hover:text-cyan"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-4">
                <LiveCounter />
                <SheetClose asChild>
                  <Button asChild size="lg">
                    <Link href="/book">Book a Session</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
