export type TierId = 'walk-in' | 'bronze' | 'silver' | 'gold';

export type Tier = {
  id: TierId;
  name: string;
  price: number;
  cadence: string;
  summary: string;
  popular?: boolean;
  highlights: string[];
};

export const TIERS: Tier[] = [
  {
    id: 'walk-in',
    name: 'Walk-in',
    price: 0,
    cadence: 'pay per hour',
    summary: 'Turn up, play, leave. No commitment, standard hourly rates.',
    highlights: [
      'Any zone at list price',
      'Book up to 7 days ahead',
      'Café menu at list price',
    ],
  },
  {
    id: 'bronze',
    name: 'Bronze',
    price: 999,
    cadence: 'per month',
    summary: 'For the once-a-week player who wants a better rate.',
    highlights: ['8 hours included', '10% off extra hours', 'Book 14 days ahead'],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 2499,
    cadence: 'per month',
    summary: 'The regular plan: enough hours for two sessions a week.',
    popular: true,
    highlights: [
      '24 hours included',
      '20% off extra hours and café',
      'Two free tournament entries',
      'Priority booking 30 days ahead',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 4999,
    cadence: 'per month',
    summary: 'Unlimited off-peak play, with the lounge and concierge included.',
    highlights: [
      '60 hours included',
      '30% off everything else',
      'All tournaments included',
      'Lounge access and two guest passes',
    ],
  },
];

export type ComparisonRow = {
  feature: string;
  values: Record<TierId, string>;
};

/** 10 rows, in the order the spec lists them (3.3). */
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
