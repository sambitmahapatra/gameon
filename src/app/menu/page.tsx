import type { Metadata } from 'next';

import { SectionHeading } from '@/components/section-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MENU, MENU_CATEGORIES } from '@/lib/data/menu';
import { cn, inr } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Café menu',
  description:
    'One-handed snacks, proper mains, cold brew and combo deals that bundle food with play time.',
};

function VegDot({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn(
        'mt-1.5 inline-flex size-3 shrink-0 items-center justify-center rounded-[3px] border',
        veg ? 'border-emerald-400' : 'border-red-400',
      )}
      aria-label={veg ? 'Vegetarian' : 'Contains meat'}
      title={veg ? 'Vegetarian' : 'Contains meat'}
    >
      <span
        className={cn('size-1.5 rounded-full', veg ? 'bg-emerald-400' : 'bg-red-400')}
        aria-hidden="true"
      />
    </span>
  );
}

export default function MenuPage() {
  return (
    <div className="shell py-16">
      <header className="flex max-w-prose flex-col gap-4">
        <p className="eyebrow">Café</p>
        <h1 className="text-h1">Fuel between frags</h1>
        <p className="text-body text-muted-foreground">
          Food reaches every zone, so you do not have to pause a match to eat. Everything
          is made to order between 10 AM and 9:30 PM.
        </p>
      </header>

      <div className="mt-12">
        <Tabs defaultValue="snacks">
          <TabsList>
            {MENU_CATEGORIES.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {MENU_CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <SectionHeading
                title={category.label}
                sub={category.note}
                className="sr-only"
              />
              <p className="mb-8 text-meta text-muted-foreground">{category.note}</p>

              <ul className="grid gap-x-12 gap-y-7 md:grid-cols-2">
                {MENU.filter((item) => item.category === category.id).map((item) => (
                  <li
                    key={item.name}
                    className="flex items-start justify-between gap-6 border-b border-border pb-6"
                  >
                    <div className="flex min-w-0 gap-3">
                      <VegDot veg={item.veg} />
                      <div className="min-w-0">
                        <h3 className="font-display text-body font-medium text-foreground">
                          {item.name}
                        </h3>
                        <p className="mt-1 max-w-prose text-meta text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-data text-foreground">
                      {inr(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <p className="mt-12 rounded-card border border-border bg-surface px-6 py-5 text-meta text-muted-foreground">
        Order at the counter or from the QR card at your station. Taxes are included; we
        do not add a service charge.
      </p>
    </div>
  );
}
