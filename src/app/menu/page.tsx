import type { Metadata } from 'next';
import { BrandPhoto } from '@/components/brand-photo';
import { Suspense } from 'react';
import { MenuBrowser } from '@/components/menu-browser';

export const metadata: Metadata = {
  title: 'Café menu',
  description:
    'Indian-forward snacks, chicken and vegetarian mains, chai, mocktails and combos. Made to order and delivered to your zone.',
};

export default function MenuPage() {
  return (
    <div className="section section--tight">
      <div className="wrap">
        <header className="section-head menu-hero">
          <div>
            <div className="eyebrow">Café</div>
            <h1>
              Good game.
              <br />
              Great food.
            </h1>
            <p className="sub">
              Quick bites between matches. A proper sit-down with your crew. The café is
              part of the experience—not an afterthought. Order at the counter and refuel.
            </p>
          </div>
          <BrandPhoto
            src="/images/menu/hero.webp"
            alt="Warm pendant lights over the café counter at GameOn, with gaming zones beyond a glass partition"
            width={1920}
            height={1080}
            sizes="(min-width: 900px) 45vw, 100vw"
            priority
          />
        </header>
        <Suspense fallback={<p className="text-fg-muted">Loading the café menu…</p>}>
          <MenuBrowser />
        </Suspense>
        <p className="panel panel--flat mt-14 px-6 py-5 text-meta text-fg-muted">
          Order at counter — delivered to any zone within 10 minutes.
        </p>
      </div>
    </div>
  );
}
