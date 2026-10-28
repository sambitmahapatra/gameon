import type { Metadata } from 'next';
import { Check, Minus } from 'lucide-react';

import { JoinDialog } from '@/components/join-dialog';
import { Reveal } from '@/components/motion/reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { COMPARISON, FAQ, TIERS } from '@/lib/data/tiers';
import { cn, inrDigits } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Four tiers, from pay-as-you-play to 60 hours a month with lounge access. Compare hours, discounts, priority booking and guest passes.',
};

/** "No"/"None" become a dash, "Yes" a tick; anything else prints as written. */
function Value({ value }: { value: string }) {
  if (value === 'No' || value === 'None') {
    return (
      <span className="inline-flex items-center gap-1.5 text-fg-dim">
        <Minus aria-hidden="true" className="size-3.5" />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  if (value === 'Yes') {
    return (
      <span className="inline-flex items-center gap-1.5 text-brand">
        <Check aria-hidden="true" className="size-4" />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  return <span className="text-fg">{value}</span>;
}

export default function MembershipPage() {
  return (
    <div className="section section--tight">
      <div className="wrap">
        <header className="section-head">
          <div className="eyebrow">Membership</div>
          <h1>Members play more</h1>
          <p className="sub">
            If you are here more than twice a month, a membership already pays for itself.
            Hours work across every zone, and you keep your rate during tournaments.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <JoinDialog />
            <a href="#compare" className="btn btn--ghost btn--lg">
              Compare tiers
            </a>
          </div>
        </header>

        {/* the four tiers, the same cards as the landing page */}
        <Reveal className="tiers" stagger=".tier">
          {TIERS.map((tier) => (
            <div key={tier.id} className={`tier${tier.popular ? 'tier--highlight' : ''}`}>
              {tier.popular ? <div className="tier__badge">Most picked</div> : null}
              <div className="tier__name">{tier.name}</div>
              <div className="tier__price">
                ₹{inrDigits(tier.price)}
                <small>{tier.cadence}</small>
              </div>
              <p className="tier__sub">{tier.summary}</p>

              <ul>
                {tier.highlights.map((perk) => (
                  <li key={perk.text}>
                    <span>
                      {perk.strong ? <b>{perk.strong} </b> : null}
                      {perk.text}
                    </span>
                  </li>
                ))}
              </ul>

              {tier.id === 'walk-in' ? (
                <a href="/book" className="tier__btn">
                  {tier.cta}
                </a>
              ) : (
                <JoinDialog
                  defaultTier={tier.id as 'bronze' | 'silver' | 'gold'}
                  trigger={
                    <button type="button" className="tier__btn">
                      {tier.cta}
                    </button>
                  }
                />
              )}
            </div>
          ))}
        </Reveal>

        {/*
          Mobile gets the full comparison as snap-scrolling cards: a
          12-row × 4-column table cannot work at 375px.
        */}
        <section id="compare" className="mt-20 scroll-mt-24 lg:hidden">
          <h2>What each tier includes</h2>
          <p className="sub mt-3">Swipe across to compare.</p>

          <div className="snap-rail mt-8">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  'panel w-[82vw] shrink-0 snap-start p-6',
                  tier.popular && 'border-brand',
                )}
              >
                <div className="tier__name">{tier.name}</div>
                <div className="mono mt-1 text-fg-muted">
                  ₹{inrDigits(tier.price)}
                  {tier.cadence}
                </div>
                <dl className="mt-5">
                  {COMPARISON.map((row) => (
                    <div key={row.feature} className="meta-row">
                      <dt>{row.feature}</dt>
                      <dd>
                        <Value value={row.values[tier.id]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 hidden scroll-mt-24 lg:block">
          <h2>What each tier includes</h2>
          <p className="sub mt-3">
            Every tier can book every zone. The difference is price, priority and how much
            is already paid for.
          </p>

          <div className="panel mt-10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28%]">Feature</TableHead>
                  {TIERS.map((tier) => (
                    <TableHead
                      key={tier.id}
                      className={cn('text-left', tier.popular && 'text-brand')}
                    >
                      <span className="flex flex-col gap-1 py-2">
                        <span className="font-display text-[1.05rem] font-medium text-fg">
                          {tier.name}
                        </span>
                        <span className="mono text-fg-muted">
                          ₹{inrDigits(tier.price)}
                          {tier.cadence}
                        </span>
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="text-fg-muted">{row.feature}</TableCell>
                    {TIERS.map((tier) => (
                      <TableCell key={tier.id}>
                        <Value value={row.values[tier.id]} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="mt-20 max-w-[760px]">
          <h2>Questions people actually ask</h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQ.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <div className="mt-16 flex flex-wrap items-center gap-4">
          <JoinDialog />
          <p className="text-meta text-fg-dim">
            Nothing is charged here — we hold your tier at the counter.
          </p>
        </div>
      </div>
    </div>
  );
}
