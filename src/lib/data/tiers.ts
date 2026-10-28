export type TierId = 'walk-in' | 'bronze' | 'silver' | 'gold';

/** A bullet with an optional bolded lead fragment, as the reference sets them. */
export type TierPerk = { strong?: string; text: string };

export type Tier = {
  id: TierId;
  name: string;
  price: number;
  /** Rendered small after the figure: '/hour', '/month'. */
  cadence: string;
  summary: string;
  popular?: boolean;
  cta: string;
  highlights: TierPerk[];
};

export const TIERS: Tier[] = [
  {
    id: 'walk-in',
    name: 'Walk-in',
    price: 350,
    cadence: '/hour',
    summary: 'Just show up. Any zone, if a slot is open.',
    cta: 'Reserve a slot',
    highlights: [
      { text: 'Hourly rate on every zone' },
      { text: 'Café and lounge access' },
      { text: 'Tournament entry on the day' },
      { text: 'Peripherals and headsets' },
    ],
  },
  {
    id: 'bronze',
    name: 'Bronze',
    price: 999,
    cadence: '/month',
    summary: 'For the weekend player who hates waiting.',
    cta: 'Become a Bronze member',
    highlights: [
      { strong: '8 hours', text: 'included each month' },
      { text: '10% off extra hours' },
      { text: '14-day booking window' },
      { text: '2 guest passes a month' },
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 2499,
    cadence: '/month',
    summary: 'Our sweet spot. The membership that pays for itself twice.',
    popular: true,
    cta: 'Become a Silver member',
    highlights: [
      { strong: '24 hours', text: 'included each month' },
      { text: '20% off extra hours' },
      { text: '30-day booking window' },
      { text: 'Free entry to monthly cup' },
      { text: 'Birthday hour on us' },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 4999,
    cadence: '/month',
    summary: 'You basically live here. We will know your order.',
    cta: 'Become a Gold member',
    highlights: [
      { strong: '60 hours', text: 'included each month' },
      { text: '30% off extra hours' },
      { text: 'Priority booking, any day' },
      { text: 'All tournaments, all free' },
      { text: 'Private lounge access' },
    ],
  },
];

export type ComparisonRow = {
  feature: string;
  values: Record<TierId, string>;
};

/** 12 rows, in the order V3 §4.6 lists them. */
export const COMPARISON: ComparisonRow[] = [
  {
    feature: 'Hours included each month',
    values: { 'walk-in': 'None', bronze: '8', silver: '24', gold: '60' },
  },
  {
    feature: 'Discount on extra hours',
    values: { 'walk-in': 'None', bronze: '10%', silver: '20%', gold: '30%' },
  },
  {
    feature: 'Booking window',
    values: { 'walk-in': '7 days', bronze: '14 days', silver: '30 days', gold: '30 days' },
  },
  {
    feature: 'Priority on peak slots',
    values: { 'walk-in': 'No', bronze: 'No', silver: 'Yes', gold: 'First refusal' },
  },
  {
    feature: 'Free tournament entries',
    values: { 'walk-in': 'None', bronze: '1 a month', silver: '2 a month', gold: 'All events' },
  },
  {
    feature: 'Lounge access',
    values: { 'walk-in': 'No', bronze: 'No', silver: 'Weekdays', gold: 'Always' },
  },
  {
    feature: 'Birthday hour',
    values: { 'walk-in': 'No', bronze: 'Yes', silver: 'Yes', gold: 'Yes, plus a guest' },
  },
  {
    feature: 'Loyalty points',
    values: { 'walk-in': '1x', bronze: '1.5x', silver: '2x', gold: '3x' },
  },
  {
    feature: 'Guest passes',
    values: { 'walk-in': 'None', bronze: 'None', silver: '1 a month', gold: '2 a month' },
  },
  {
    feature: 'Concierge and exclusive events',
    values: { 'walk-in': 'No', bronze: 'No', silver: 'Events only', gold: 'Both' },
  },
  {
    feature: 'Priority support',
    values: { 'walk-in': 'Counter', bronze: 'WhatsApp', silver: 'WhatsApp', gold: 'Direct line' },
  },
  {
    feature: 'Member merch',
    values: { 'walk-in': 'No', bronze: 'Sticker set', silver: 'Tee', gold: 'Tee and hoodie' },
  },
];

export const FAQ: { question: string; answer: string }[] = [
  {
    question: 'Can I pause a membership?',
    answer:
      'Yes, once per cycle for up to 30 days. Tell us at the counter or on WhatsApp and we freeze your hours where they are.',
  },
  {
    question: 'Do unused hours roll over?',
    answer:
      'Bronze and Silver carry up to a quarter of your monthly hours into the next month. Gold hours reset, because the allowance already covers daily play.',
  },
  {
    question: 'How does priority booking work?',
    answer:
      'Silver and Gold members see peak evening slots 48 hours before they open to everyone else. Gold members get first refusal on tournament-week slots.',
  },
  {
    question: 'Is the café discount on the whole bill?',
    answer:
      'It applies to food and non-alcoholic drinks for you and up to three people at your table, on the same bill.',
  },
  {
    question: 'What happens if I miss a booked slot?',
    answer:
      'We hold the rig for 15 minutes. After that the slot returns to the floor, and the hour comes off your allowance. Cancel on the confirmation page and it costs you nothing.',
  },
  {
    question: 'Can two people share one membership?',
    answer:
      'Memberships are personal, but Silver and Gold include guest passes so a friend can play at your rate while you are in-house.',
  },
];
