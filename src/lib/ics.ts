import { SITE } from './site';

type IcsInput = {
  id: string;
  zoneName: string;
  /** 'YYYY-MM-DD' */
  date: string;
  /** 'HH:MM' */
  time: string;
  partySize: number;
};

function stamp(date: string, time: string, addHours = 0) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const local = new Date(y!, (m ?? 1) - 1, d ?? 1, (hh ?? 0) + addHours, mm ?? 0);
  // UTC basic format: 20261028T143000Z
  return `${local.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

/** A single VEVENT the browser can download without a server round trip. */
export function buildIcs(input: IcsInput): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GameOn//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${input.id}@gameon.cafe`,
    `DTSTAMP:${stamp(input.date, input.time)}`,
    `DTSTART:${stamp(input.date, input.time)}`,
    `DTEND:${stamp(input.date, input.time, 1)}`,
    `SUMMARY:GameOn — ${input.zoneName}`,
    `DESCRIPTION:Booking ${input.id} for ${input.partySize} at GameOn Powai. Show the QR code at the counter.`,
    `LOCATION:${SITE.address}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT60M',
    'ACTION:DISPLAY',
    'DESCRIPTION:GameOn session in an hour',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}
