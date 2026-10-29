import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Gamepad2,
  Headphones,
  Users,
} from 'lucide-react';
import { ClubHero } from '@/components/club-hero';
import { ClubBooking } from '@/components/club-booking';
import { JoinDialog } from '@/components/join-dialog';
import { EventRegisterButton } from '@/components/event-register-button';
import { Reveal } from '@/components/motion/reveal';
import { databaseConfigured } from '@/lib/db';
import { getPublicZones, getPublicEvents } from '@/lib/public-data';
import { FEATURED_FOOD, ZONE_LOOK } from '@/lib/data/club';
import { MENU } from '@/lib/data/menu';
import { TIERS } from '@/lib/data/tiers';
import { SITE } from '@/lib/site';
import { fromDateKey, inrDigits } from '@/lib/utils';

export { dynamic } from '@/lib/render-mode';

function Heading({
  eyebrow,
  children,
  description,
}: {
  eyebrow: string;
  children: React.ReactNode;
  description: string;
}) {
  return (
    <Reveal className="club-section-head">
      <div>
        <div className="club-eyebrow">{eyebrow}</div>
        <h2>{children}</h2>
      </div>
      <p>{description}</p>
    </Reveal>
  );
}
function Photo({
  name,
  alt,
  sizes = '(min-width: 900px) 33vw, (min-width: 640px) 50vw, 100vw',
}: {
  name: string;
  alt: string;
  sizes?: string;
}) {
  return <Image src={`/images/club/${name}.webp`} alt={alt} fill sizes={sizes} />;
}

export default async function HomePage() {
  const [zones, events] = await Promise.all([getPublicZones(), getPublicEvents()]);
  const featuredZones = Object.keys(ZONE_LOOK).flatMap((id) => {
    const zone = zones.find((z) => z.id === id);
    return zone ? [zone] : [];
  });
  const eventFormats = [
    {
      name: 'Rivalry Night',
      frequency: 'Weekly',
      description:
        'Squad-versus-squad console battles. Friendly competition, serious bragging rights.',
      event: events.find((e) => /FC|Tekken|FIFA/i.test(e.game)),
    },
    {
      name: 'Time Attack',
      frequency: 'Race night',
      description: 'Race the clock, set your best lap and own the leaderboard.',
      event: events.find((e) => /Assetto|racing/i.test(e.game)),
    },
    {
      name: 'Community Cup',
      frequency: 'Monthly',
      description:
        'Organised brackets, spectator energy and a community worth showing up for.',
      event: events.find((e) => e.category === 'monthly' && !/Assetto/i.test(e.game)),
    },
  ];
  return (
    <div className="club-home">
      <ClubHero zoneCount={6} />
      <div
        className="club-ticker"
        aria-label="Your squad. Your rules. Race the grid. Step into VR. Stay for the food."
      >
        <div className="club-ticker__track" aria-hidden="true">
          {[0, 1, 2, 3].map((n) => (
            <div key={n}>
              <span>Your squad. Your rules.</span>
              <b>✳</b>
              <span>Race the grid</span>
              <b>✳</b>
              <span>Step into VR</span>
              <b>✳</b>
              <span>Stay for the food</span>
              <b>✳</b>
            </div>
          ))}
        </div>
      </div>

      <section className="club-section" id="zones">
        <div className="club-wrap">
          <Heading
            eyebrow="Pick your player mode"
            description="Go head-to-head, chase a lap record, explore another reality or grab a controller. Find your favourite zone—or try them all in one visit."
          >
            Six zones.
            <br />
            <em>Zero boring.</em>
          </Heading>
          <Reveal className="club-zones" stagger=".club-zone">
            {featuredZones.map((zone, index) => {
              const look = ZONE_LOOK[zone.id];
              return (
                <article className="club-zone" key={zone.id}>
                  <Link
                    href={`/zones/${zone.id}`}
                    className="club-zone__photo"
                    aria-label={`Explore ${look.name}`}
                  >
                    <Photo name={look.image} alt={look.name} />
                    <span className="club-zone__number">0{index + 1}</span>
                    <span className="club-photo-arrow">
                      <ArrowUpRight size={20} />
                    </span>
                  </Link>
                  <div className="club-zone__body">
                    <div className="club-zone__title">
                      <h3>
                        <Link href={`/zones/${zone.id}`}>{look.name}</Link>
                      </h3>
                      <span>
                        ₹{inrDigits(zone.price_per_hour)}
                        <small>/hr</small>
                      </span>
                    </div>
                    <p>{look.description}</p>
                    <div className="club-tags">
                      {look.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <Link className="club-text-link" href={`/book?zone=${zone.id}`}>
                      Find a session <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
            <article className="club-zone">
              <div className="club-zone__photo">
                <Photo name="arcade" alt="Neon-lit retro arcade machines" />
                <span className="club-zone__number">06</span>
                <span className="club-zone__badge">At the counter</span>
              </div>
              <div className="club-zone__body">
                <div className="club-zone__title">
                  <h3>Arcade Corner</h3>
                  <span>Pay per play</span>
                </div>
                <p>
                  Quick rounds, old-school nostalgia and the kind of rematch that lasts
                  all evening.
                </p>
                <div className="club-tags">
                  <span>Retro games</span>
                  <span>All skill levels</span>
                </div>
                <a
                  className="club-text-link"
                  href={`${SITE.whatsappUrl}?text=${encodeURIComponent('Hi GameOn, I would like to check Arcade Corner availability and prices.')}`}
                >
                  Ask about arcade play <ArrowUpRight size={14} />
                </a>
              </div>
            </article>
          </Reveal>
          <div className="club-under-grid">
            <p>
              Hourly rates are live from our booking inventory. Arcade availability and
              per-play prices are confirmed at the counter.
            </p>
            <Link href="/zones/streaming-pod">
              Creating something? Explore the Streaming Pod <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="club-section club-section--surface" id="experiences">
        <div className="club-wrap">
          <Heading
            eyebrow="More than a gaming café"
            description="Gaming gets the group together. Thoughtful experiences, good hospitality and reasons to return turn one visit into a ritual."
          >
            Make a night
            <br />
            of <em>it.</em>
          </Heading>
          <div className="club-experiences">
            <Reveal className="club-feature-main">
              <Photo
                name="immersion"
                alt="An immersive gaming setup with multiple illuminated displays"
                sizes="(min-width: 900px) 55vw, 100vw"
              />
              <div className="club-feature-main__shade" />
              <div className="club-feature-copy">
                <div className="club-eyebrow">01 / The signature</div>
                <h3>
                  The full
                  <br />
                  immersion.
                </h3>
                <p>
                  From VR worlds to a dedicated flight-simulation experience, discover
                  something that makes your usual night out feel ordinary.
                </p>
                <Link href="/book?zone=vr-arena" className="club-btn">
                  Book an experience <ArrowUpRight size={16} />
                </Link>
              </div>
            </Reveal>
            <Reveal className="club-feature-side" stagger=".club-mini-feature">
              {[
                {
                  image: 'arcade',
                  eyebrow: '02 / The community',
                  title: 'Leaderboard life',
                  text: 'Weekly challenges, friendly rivalries, tournament nights and bragging rights.',
                  href: '/events',
                },
                {
                  image: 'racing',
                  eyebrow: '03 / Your occasion',
                  title: 'Your people. Your event.',
                  text: 'Birthdays, squad takeovers, college gatherings and corporate team experiences.',
                  href: `${SITE.whatsappUrl}?text=${encodeURIComponent('Hi GameOn, I would like to plan a private group event.')}`,
                },
                {
                  image: 'social',
                  eyebrow: '04 / The social side',
                  title: 'Stay for one more',
                  text: 'A relaxed café menu designed for breaks, refuels and post-game debriefs.',
                  href: '/menu',
                },
              ].map((item) => (
                <Link key={item.title} href={item.href} className="club-mini-feature">
                  <div className="club-mini-feature__photo">
                    <Photo name={item.image} alt={item.title} sizes="140px" />
                  </div>
                  <div>
                    <div className="club-eyebrow">{item.eyebrow}</div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <ArrowUpRight className="club-mini-feature__arrow" size={18} />
                </Link>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="club-section" id="cafe">
        <div className="club-wrap">
          <Heading
            eyebrow="Power up between rounds"
            description="From quick bites between matches to a proper sit-down with your crew, the café is part of the experience—not an afterthought."
          >
            Good game.
            <br />
            <em>Great food.</em>
          </Heading>
          <Reveal className="club-food-grid" stagger=".club-food-card">
            {FEATURED_FOOD.map((item) => {
              const categoryItems = MENU.filter((m) => m.category === item.category);
              const minimum = Math.min(
                ...categoryItems.flatMap((m) => (m.price === null ? [] : [m.price])),
              );
              return (
                <Link
                  href={`/menu?category=${item.category}`}
                  key={item.name}
                  className="club-food-card"
                >
                  <div className="club-food-card__photo">
                    <Photo
                      name={item.image}
                      alt={item.name}
                      sizes="(min-width: 900px) 25vw, 50vw"
                    />
                    <span className="club-photo-arrow">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                  <div className="club-food-card__body">
                    <span className="club-food-price">
                      {item.category} from ₹{minimum}
                    </span>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </Reveal>
          <div className="club-under-grid">
            <p>
              Imagery is illustrative. Explore the full menu for individual dishes, prices
              and dietary information. Order at the counter.
            </p>
            <Link href="/menu">
              Explore the full menu <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="club-section club-section--members" id="membership">
        <div className="club-wrap">
          <Heading
            eyebrow="The more you play"
            description="Drop in when the mood hits, or become part of the community. Find your level and make more time for the things you love."
          >
            The better
            <br />
            it <em>gets.</em>
          </Heading>
          <Reveal className="club-plans" stagger=".club-plan">
            {TIERS.map((tier) => (
              <article
                className={`club-plan ${tier.popular ? 'club-plan--popular' : ''}`}
                key={tier.id}
              >
                {tier.popular && <span className="club-ribbon">Community favourite</span>}
                <span className="club-plan__index">
                  {tier.id === 'walk-in'
                    ? '01 / Drop in'
                    : tier.id === 'bronze'
                      ? '02 / Get started'
                      : tier.id === 'silver'
                        ? '03 / Find your rhythm'
                        : '04 / All in'}
                </span>
                <h3>{tier.name}</h3>
                <div
                  className={`club-plan__price ${tier.id === 'walk-in' ? 'club-plan__price--walkin' : ''}`}
                >
                  {tier.id === 'walk-in' ? (
                    'Pay as you play'
                  ) : (
                    <>
                      ₹{inrDigits(tier.price)}
                      <small> / month</small>
                    </>
                  )}
                </div>
                <p>{tier.summary}</p>
                <ul>
                  {tier.highlights.slice(0, 4).map((perk) => (
                    <li key={perk.text}>
                      <Check size={13} />
                      <span>
                        {perk.strong && <strong>{perk.strong} </strong>}
                        {perk.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {tier.id === 'walk-in' ? (
                  <Link href="/book" className="club-btn club-btn--outline">
                    Choose walk-in <ArrowUpRight size={15} />
                  </Link>
                ) : (
                  <JoinDialog
                    defaultTier={tier.id}
                    trigger={
                      <button
                        type="button"
                        className={`club-btn ${tier.popular ? '' : 'club-btn--outline'}`}
                      >
                        {tier.id === 'gold' ? 'Go Gold' : `Get ${tier.name}`}{' '}
                        <ArrowUpRight size={15} />
                      </button>
                    }
                  />
                )}
              </article>
            ))}
          </Reveal>
          <div className="club-under-grid">
            <p>
              Register your interest here. Pay at the counter when your membership is
              activated.
            </p>
            <Link href="/membership">
              Compare all benefits <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="club-section" id="events">
        <div className="club-wrap">
          <Heading
            eyebrow="Play together. Compete together."
            description="Regular competitive nights, casual challenges and private group experiences. This is where a room full of players becomes a community."
          >
            The next
            <br />
            <em>Big match.</em>
          </Heading>
          <Reveal className="club-events" stagger=".club-event">
            {eventFormats.map((format, i) => {
              const event = format.event;
              return (
                <article className="club-event" key={format.name}>
                  <div className="club-event__date">
                    <b>
                      {event
                        ? fromDateKey(event.date).getDate().toString().padStart(2, '0')
                        : `0${i + 1}`}
                    </b>
                    <span>
                      {event
                        ? fromDateKey(event.date).toLocaleDateString('en-IN', {
                            month: 'short',
                          })
                        : format.frequency}
                    </span>
                  </div>
                  <div className="club-event__copy">
                    <span className="club-event__frequency">{format.frequency}</span>
                    <h3>{format.name}</h3>
                    <p>{format.description}</p>
                    {event && (
                      <div className="club-event__live">
                        {event.title} · {Math.max(0, event.slots - event.registered)}{' '}
                        places left
                      </div>
                    )}
                  </div>
                  {event ? (
                    <EventRegisterButton
                      eventId={event.id}
                      title={event.title}
                      date={event.date}
                      full={event.registered >= event.slots}
                      className="club-btn club-btn--outline"
                    />
                  ) : (
                    <Link href="/events" className="club-btn club-btn--outline">
                      See dates <ArrowUpRight size={14} />
                    </Link>
                  )}
                </article>
              );
            })}
            <article className="club-event">
              <div className="club-event__date">
                <Users size={30} />
                <span>Anytime</span>
              </div>
              <div className="club-event__copy">
                <span className="club-event__frequency">Make it yours</span>
                <h3>Private Takeover</h3>
                <p>
                  Birthdays, college groups, team days and custom packages. Bring the
                  crew; we’ll bring the game.
                </p>
              </div>
              <a
                href={`${SITE.whatsappUrl}?text=${encodeURIComponent('Hi GameOn, I would like to plan a Private Takeover.')}`}
                className="club-btn club-btn--outline"
              >
                Plan an event <ArrowUpRight size={14} />
              </a>
            </article>
          </Reveal>
          <div className="club-under-grid">
            <p>
              Registrations use the live event calendar. Full events offer a waitlist
              enquiry.
            </p>
            <Link href="/events">
              The complete calendar <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="club-section club-booking" id="book">
        <div className="club-wrap">
          <Heading
            eyebrow="Your next session starts here"
            description="Choose your zone, find a free time and bring your people. Real availability. Instant confirmation. Pay when you arrive."
          >
            Lock in
            <br />
            your <em>playtime.</em>
          </Heading>
          <div className="club-booking-layout">
            {databaseConfigured() ? (
              <ClubBooking zones={zones} />
            ) : (
              <div className="club-booking-form">
                <h3>Let’s get you playing.</h3>
                <p>
                  Online reservations will be available soon. Contact us to plan your
                  session.
                </p>
                <a className="club-btn club-btn--ink" href={SITE.whatsappUrl}>
                  Book on WhatsApp <ArrowUpRight size={16} />
                </a>
              </div>
            )}
            <Reveal className="club-booking-aside">
              <div className="club-eyebrow">Not just a place to play</div>
              <h3>
                Come for the game.
                <br />
                Stay for the people.
              </h3>
              <p>
                Whether you’re booking a first-time VR session, a night with friends, a
                tournament entry or a company team day, we’ll help you make a night of it.
              </p>
              <div className="club-booking-perks">
                <span>
                  <Gamepad2 size={20} /> All skill levels welcome
                </span>
                <span>
                  <Headphones size={20} /> Staff on hand to get you started
                </span>
                <span>
                  <Users size={20} /> Made for your crew
                </span>
              </div>
              <div className="club-info-line">
                <strong>Opening hours</strong>
                <span>10 AM – 10 PM, every day</span>
              </div>
              <div className="club-info-line">
                <strong>Find us</strong>
                <a href={SITE.mapsUrl}>
                  Powai, Mumbai <ArrowUpRight size={13} />
                </a>
              </div>
              <Link href="/book" className="club-booking-full">
                Prefer a step-by-step booking? <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
