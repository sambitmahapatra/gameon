import Link from 'next/link';
import { Check } from 'lucide-react';

import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TIERS } from '@/lib/data/tiers';
import { cn, inr } from '@/lib/utils';

export function Pricing() {
  return (
    <section id="pricing" className="shell scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="Membership"
        title="Pay as you play, or go all in"
        sub="Members get priority booking, better rates, and tournament invites. Walk-ins never pay a cover charge."
      />

      <Reveal stagger="[data-tier]" className="mt-12">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              data-tier
              className={cn(
                'flex flex-col gap-6 rounded-card border bg-surface p-6 transition-colors',
                tier.popular
                  ? 'border-cyan/60 shadow-glow'
                  : 'border-border hover:border-cyan/30',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-h3">{tier.name}</h3>
                {tier.popular ? <Badge>Most popular</Badge> : null}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-mono text-h2 font-bold text-foreground">
                  {tier.price === 0 ? 'Free' : inr(tier.price)}
                </span>
                <span className="text-meta text-muted-foreground">{tier.cadence}</span>
              </div>

              <p className="text-pretty text-meta text-muted-foreground">
                {tier.summary}
              </p>

              <ul className="flex flex-1 flex-col gap-3">
                {tier.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-meta">
                    <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={tier.popular ? 'default' : 'secondary'}
                className="w-full"
              >
                <Link href={tier.id === 'walk-in' ? '/book' : '/membership'}>
                  {tier.id === 'walk-in' ? 'Book a Session' : `Join ${tier.name}`}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </Reveal>

      <p className="mt-6 max-w-prose text-meta text-muted-foreground">
        Hours are shared across every zone. Peak evenings cost one and a half hours from
        your allowance, which is how we keep slots open for everyone.
      </p>
    </section>
  );
}
