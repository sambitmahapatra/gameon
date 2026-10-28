import type { Metadata } from 'next';
import { Check, Minus } from 'lucide-react';

import { JoinDialog } from '@/components/join-dialog';
import { Reveal } from '@/components/motion/reveal';
import { Price } from '@/components/price';
import { SectionHeading } from '@/components/section-heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { COMPARISON, FAQ, TIERS } from '@/lib/data/tiers';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Four tiers, from pay-as-you-play to 60 hours a month with lounge access. Compare hours, discounts, priority booking and guest passes.',
};

function Value({ value }: { value: string }) {
  if (value === 'No' || value === 'None') {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Minus aria-hidden="true" className="size-3.5" />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  if (value === 'Yes') {
    return (
      <span className="inline-flex items-center gap-1.5 text-cyan">
        <Check aria-hidden="true" className="size-4" />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  return <span className="text-foreground">{value}</span>;
}

export default function MembershipPage() {
  return (
    <div className="shell py-16">
      <header className="flex max-w-prose flex-col gap-4">
        <p className="eyebrow">Membership</p>
        <h1 className="text-h1">Members play more</h1>
        <p className="text-body text-muted-foreground">
          If you are here more than twice a month, a membership already pays for itself.
          Hours work across every zone, and you keep your rate during tournaments.
        </p>
        <div className="mt-2 flex flex-wrap gap-4">
          <JoinDialog />
          <Button asChild variant="outline" size="lg">
            <a href="#compare">Compare tiers</a>
          </Button>
        </div>
      </header>

      {/* Mobile: snap-scroll cards. Desktop: the comparison table below. */}
      <Reveal className="mt-16 lg:hidden">
        <div className="snap-rail">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'flex w-[80vw] shrink-0 flex-col gap-5 rounded-card border bg-surface p-6',
                tier.popular ? 'border-cyan/60' : 'border-border',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-h3">{tier.name}</h2>
                {tier.popular ? <Badge>Most popular</Badge> : null}
              </div>
              <p className="font-mono text-h3 text-foreground">
                {tier.price === 0 ? 'Free' : <Price amount={tier.price} />}
              </p>
              <p className="text-meta text-muted-foreground">{tier.summary}</p>
              <ul className="flex flex-col gap-2">
                {COMPARISON.map((row) => (
                  <li key={row.feature} className="flex justify-between gap-4 text-meta">
                    <span className="text-muted-foreground">{row.feature}</span>
                    <span className="text-right">
                      <Value value={row.values[tier.id]} />
                    </span>
                  </li>
                ))}
              </ul>
              {tier.price > 0 ? (
                <JoinDialog
                  defaultTier={tier.id as 'bronze' | 'silver' | 'gold'}
                  trigger={
                    <Button variant={tier.popular ? 'default' : 'secondary'}>
                      Join {tier.name}
                    </Button>
                  }
                />
              ) : null}
            </div>
          ))}
        </div>
      </Reveal>

      <section id="compare" className="mt-20 hidden scroll-mt-24 lg:block">
        <SectionHeading
          title="What each tier includes"
          sub="Every tier can book every zone. The difference is price, priority and how much is already paid for."
        />

        <div className="panel mt-10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[28%]">Feature</TableHead>
                {TIERS.map((tier) => (
                  <TableHead
                    key={tier.id}
                    className={cn('text-left', tier.popular && 'text-cyan')}
                  >
                    <span className="flex flex-col gap-1 py-2">
                      <span className="font-display text-body font-medium text-foreground">
                        {tier.name}
                      </span>
                      <span className="font-mono text-meta text-muted-foreground">
                        {tier.price === 0 ? (
                          'Pay per hour'
                        ) : (
                          <Price amount={tier.price} suffix="/month" />
                        )}
                      </span>
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPARISON.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell className="text-muted-foreground">{row.feature}</TableCell>
                  {TIERS.map((tier) => (
                    <TableCell key={tier.id}>
                      <Value value={row.values[tier.id]} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell />
                {TIERS.map((tier) => (
                  <TableCell key={tier.id}>
                    {tier.price === 0 ? (
                      <Button asChild variant="ghost" size="sm" className="-ml-3">
                        <a href="/book">Book a session</a>
                      </Button>
                    ) : (
                      <JoinDialog
                        defaultTier={tier.id as 'bronze' | 'silver' | 'gold'}
                        trigger={
                          <Button
                            size="sm"
                            variant={tier.popular ? 'default' : 'secondary'}
                          >
                            Join {tier.name}
                          </Button>
                        }
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="faq" className="mt-24 scroll-mt-24">
        <SectionHeading title="Questions people ask at the counter" />
        <Accordion type="single" collapsible className="mt-8 max-w-3xl">
          {FAQ.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
