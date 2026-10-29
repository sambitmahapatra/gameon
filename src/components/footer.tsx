import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/logo';
import { SITE } from '@/lib/site';
export function Footer() {
  return (
    <footer className="club-footer above-grain">
      <div className="club-wrap">
        <div className="club-footer__top">
          <div>
            <Link href="/" aria-label="GameOn home">
              <Logo />
            </Link>
            <p>
              A gaming social club built around play, community, great food and
              experiences worth sharing.
            </p>
          </div>
          <div className="club-footer__links">
            <Link href="/#zones">Zones</Link>
            <Link href="/#experiences">Experiences</Link>
            <Link href="/menu">Café</Link>
            <Link href="/membership">Membership</Link>
            <Link href="/events">Events</Link>
            <Link href="/book">
              Book a session <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="club-footer__contact">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={SITE.mapsUrl}>
              Powai, Mumbai <ArrowUpRight size={13} />
            </a>
            <span>10 AM – 10 PM · Every day</span>
          </div>
        </div>
        <div className="club-footer__bottom">
          <span>© {new Date().getFullYear()} GameOn. Play beyond ordinary.</span>
          <span>Your squad. Your rules. Your next great night.</span>
        </div>
      </div>
    </footer>
  );
}
