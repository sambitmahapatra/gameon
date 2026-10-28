import { Hero } from '@/components/hero';
import { FinalCta } from '@/components/sections/final-cta';
import { Pricing } from '@/components/sections/pricing';
import { SignatureExperiences } from '@/components/sections/signature-experiences';
import { StatsStrip } from '@/components/sections/stats-strip';
import { TournamentsTeaser } from '@/components/sections/tournaments-teaser';
import { ZonesGrid } from '@/components/sections/zones-grid';
import { withDb } from '@/lib/bootstrap';
import { getSiteStats, getZones, listEvents } from '@/lib/db';

export { dynamic } from '@/lib/render-mode';

export default function HomePage() {
  const { zones, stats, events } = withDb(() => ({
    zones: getZones(),
    stats: getSiteStats(),
    events: listEvents(),
  }));

  return (
    <>
      <Hero />
      <StatsStrip stats={stats} />
      <ZonesGrid zones={zones} />
      <SignatureExperiences zones={zones} />
      <Pricing />
      <TournamentsTeaser events={events} />
      <FinalCta />
    </>
  );
}
