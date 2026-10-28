import Link from 'next/link';

import { Logo } from '@/components/logo';
import { SITE } from '@/lib/site';

const EXPLORE = [
  { href: '/zones/vr-arena', label: 'All zones' },
  { href: '/#experiences', label: 'Signature experiences' },
  { href: '/membership', label: 'Membership' },
  { href: '/events', label: 'Tournaments' },
  { href: '/menu', label: 'Café menu' },
];

const LEGAL = [
  { href: '/#house-rules', label: 'House rules' },
  { href: '/#cancellation', label: 'Cancellation' },
  { href: '/#privacy', label: 'Privacy' },
  { href: '/#terms', label: 'Terms' },
];

export function Footer() {
  return (
    <footer className="site-footer above-grain">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" aria-label="GameOn home">
              <Logo idPrefix="foot" />
            </Link>
            <p>
              Six gaming worlds and a café under one roof. Walk in, or reserve the rig you
              want before you leave the house.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Visit</h4>
            <ul>
              <li>Open 10 AM — 10 PM</li>
              <li>Every day of the year</li>
              <li>
                <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GameOn Lounges Pvt. Ltd.</span>
          <span>Built for people who still read the manual.</span>
        </div>
      </div>
    </footer>
  );
}
