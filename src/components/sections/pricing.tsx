import Link from 'next/link';

import { Reveal } from '@/components/motion/reveal';
import { TIERS } from '@/lib/data/tiers';
import { inrDigits } from '@/lib/utils';

/**
 * Four tiers, Silver highlighted with the "Most picked" badge. The walk-in
 * card links to the booking flow; the membership cards land on /membership,
 * where the signup dialog lives.
 */
export function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Membership</div>
          <h2>Pay as you play, or go all in</h2>
          <p className="sub">
            Members get priority booking, better rates, and tournament invites. Walk-ins
            never pay a cover charge.
          </p>
        </Reveal>

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

              <Link
                href={tier.id === 'walk-in' ? '/book' : '/membership'}
                className="tier__btn"
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
