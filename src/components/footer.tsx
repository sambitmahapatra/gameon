import Link from 'next/link';
import { Instagram, MapPin, MessageCircle, Youtube } from 'lucide-react';

import { Logo } from '@/components/logo';
import { Separator } from '@/components/ui/separator';
import { SITE } from '@/lib/site';

const COLUMNS = [
  {
    heading: 'Explore',
    links: [
      { label: 'All zones', href: '/zones/vr-arena' },
      { label: 'Book a session', href: '/book' },
      { label: 'Tournaments', href: '/events' },
      { label: 'Café menu', href: '/menu' },
      { label: 'Membership', href: '/membership' },
    ],
  },
  {
    heading: 'Visit',
    links: [
      { label: 'Open 10 AM to 10 PM, daily', href: '/book' },
      { label: 'Hiranandani Gardens, Powai', href: SITE.mapsUrl, external: true },
      { label: SITE.phoneDisplay, href: `tel:${SITE.phone}` },
      { label: SITE.email, href: `mailto:${SITE.email}` },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'House rules', href: '/membership#faq' },
      { label: 'Cancellation policy', href: '/membership#faq' },
      { label: 'Privacy', href: '/membership#faq' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-surface/40">
      <div className="shell py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-prose text-meta text-muted-foreground">
              Six gaming worlds and a café under one roof in Powai. Walk in, or reserve the rig
              you want before you leave the house.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SITE.whatsappUrl}
                className="rounded-button border border-border p-2.5 text-muted-foreground transition-colors hover:border-cyan/50 hover:text-cyan"
                aria-label="Message GameOn on WhatsApp"
              >
                <MessageCircle className="size-4" />
              </a>
              <a
                href={SITE.instagramUrl}
                className="rounded-button border border-border p-2.5 text-muted-foreground transition-colors hover:border-cyan/50 hover:text-cyan"
                aria-label="GameOn on Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={SITE.youtubeUrl}
                className="rounded-button border border-border p-2.5 text-muted-foreground transition-colors hover:border-cyan/50 hover:text-cyan"
                aria-label="GameOn on YouTube"
              >
                <Youtube className="size-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col gap-4">
              <h2 className="font-display text-meta font-medium text-foreground">
                {column.heading}
              </h2>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-meta text-muted-foreground transition-colors hover:text-cyan"
                      >
                        <MapPin className="size-3.5" />
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-meta text-muted-foreground transition-colors hover:text-cyan"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-3 text-meta text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{SITE.address}</p>
          <p className="font-mono">
            © {new Date().getFullYear()} GameOn. Made in Mumbai.
          </p>
        </div>
      </div>
    </footer>
  );
}
