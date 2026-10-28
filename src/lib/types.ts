export type Zone = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price_per_hour: number;
  capacity: number;
  image: string | null;
  accent_hex: string | null;
};

export type Slot = {
  id: number;
  zone_id: string;
  date: string;
  time: string;
  booked: 0 | 1;
};

export type BookingStatus = 'confirmed' | 'cancelled';

export type Booking = {
  id: string;
  zone_id: string;
  slot_id: number;
  name: string;
  phone: string;
  email: string | null;
  party_size: number;
  status: BookingStatus;
  created_at: string;
};

/** Booking joined with its zone and slot — what the UI actually renders. */
export type BookingDetail = Booking & {
  zone_name: string;
  zone_accent: string | null;
  price_per_hour: number;
  date: string;
  time: string;
};

export type Member = {
  id: string;
  name: string;
  phone: string;
  tier: 'bronze' | 'silver' | 'gold';
  joined_at: string;
};

export type EventCategory = 'weekly' | 'monthly' | 'corporate';

export type GameEvent = {
  id: string;
  title: string;
  game: string;
  date: string;
  prize_pool: number;
  slots: number;
  registered: number;
  category: EventCategory;
};
