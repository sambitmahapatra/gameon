import { Hero } from '@/components/hero';
import { Marquee } from '@/components/marquee';
import { FinalCta } from '@/components/sections/final-cta';
import { Pricing } from '@/components/sections/pricing';
import { SignatureExperiences } from '@/components/sections/signature-experiences';
import { TournamentsTeaser } from '@/components/sections/tournaments-teaser';
import { ZonesGrid } from '@/components/sections/zones-grid';
import { databaseConfigured } from '@/lib/db';
import { getPublicZones, getPublicStats, getPublicEvents } from '@/lib/public-data';
import { inrDigits } from '@/lib/utils';

export { dynamic } from '@/lib/render-mode';

export default async function HomePage() {
  const [zones, stats, events] = await Promise.all([
    getPublicZones(),
    getPublicStats(),
    getPublicEvents(),
  ]);

  const headline = events[0];

  // Ticker copy is built from live figures where we have them, so the strip
  // never contradicts the numbers in the sections below it.
  const ticker = [
    { dot: true, text: 'Open 10 AM to 10 PM, every day' },
    ...(databaseConfigured()
      ? [{ strong: String(stats.slotsFreeToday), text: ' slots open today' }]
      : []),
    ...(headline
      ? [
          {
            dot: true,
            text: `${headline.title} — ₹${inrDigits(headline.prize_pool)} prize pool`,
          },
        ]
      : []),
    ...(databaseConfigured()
      ? [{ strong: `${stats.members}+`, text: ' members on the floor' }]
      : []),
    { dot: true, text: 'Café orders delivered to any zone' },
    { strong: '₹350/hr', text: ' for walk-ins' },
    { dot: true, text: 'Flight Sim: 737 cockpit, instructor beside you' },
  ];

  return (
    <>
      <Hero openSlots={stats.slotsFreeToday} />
      <Marquee items={ticker} />
      <ZonesGrid zones={zones} />
      <SignatureExperiences />
      <Pricing />
      <TournamentsTeaser events={events} />
      <FinalCta />
    </>
  );
}
