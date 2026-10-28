import type { Metadata } from 'next';

import { Reveal } from '@/components/motion/reveal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MENU, MENU_CATEGORIES } from '@/lib/data/menu';
import { cn, inrDigits } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Café menu',
  description:
    'One-handed snacks, proper mains, cold brew and combo deals that bundle food with play time.',
};

/** Green square for vegetarian, red for everything else — the Indian convention. */
function VegDot({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn(
        'mt-1.5 inline-flex size-3 shrink-0 items-center justify-center rounded-[3px] border',
        veg ? 'border-green' : 'border-destructive',
      )}
      aria-label={veg ? 'Vegetarian' : 'Contains meat'}
      title={veg ? 'Vegetarian' : 'Contains meat'}
    >
      <span
        className={cn('size-1.5 rounded-full', veg ? 'bg-green' : 'bg-destructive')}
        aria-hidden="true"
      />
    </span>
  );
}

export default function MenuPage() {
  return (
    <div className="section section--tight">
      <div className="wrap">
        <header className="section-head">
          <div className="eyebrow">Café</div>
          <h1>Fuel between frags</h1>
          <p className="sub">
            Food reaches every zone, so you do not have to pause a match to eat.
            Everything is made to order between 10 AM and 9:30 PM.
          </p>
        </header>

        <Tabs defaultValue="snacks">
          <TabsList className="flex-wrap gap-2 bg-transparent p-0">
            {MENU_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="chip data-[state=active]:border-brand data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {MENU_CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-10">
              <p className="mb-8 text-meta text-fg-muted">{category.note}</p>

              <Reveal
                as="ul"
                className="grid gap-x-14 gap-y-7 md:grid-cols-2"
                stagger="li"
              >
                {MENU.filter((item) => item.category === category.id).map((item) => (
                  <li
                    key={item.name}
                    className="flex items-start justify-between gap-6 border-b border-line pb-6"
                  >
                    <div className="flex min-w-0 gap-3">
                      <VegDot veg={item.veg} />
                      <div className="min-w-0">
                        <h3 className="font-display text-[1.05rem] font-medium leading-snug">
                          {item.name}
                        </h3>
                        <p className="mt-1.5 max-w-prose text-meta text-fg-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <span className="mono shrink-0 text-fg">
                      ₹{inrDigits(item.price)}
                    </span>
                  </li>
                ))}
              </Reveal>
            </TabsContent>
          ))}
        </Tabs>

        <p className="panel panel--flat mt-14 px-6 py-5 text-meta text-fg-muted">
          Order at the counter or from the QR card at your station. Taxes are included; we
          do not add a service charge.
        </p>
      </div>
    </div>
  );
}
