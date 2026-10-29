/** Single source of truth for contact details and outbound links. */
export const SITE = {
  name: 'GameOn',
  title: 'GameOn — Play Beyond Ordinary',
  description:
    'A gaming social club built around play, community and great food. Console battles, racing rigs, VR worlds and a cockpit in the clouds. Find your next session at GameOn.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  address: 'Hiranandani Gardens, Powai, Mumbai 400076',
  phone: '+912249607890',
  phoneDisplay: '+91 22 4960 7890',
  email: 'play@gameon.cafe',
  hours: 'Open 10 AM to 10 PM, daily',
  mapsUrl: 'https://maps.google.com/?q=Hiranandani+Gardens+Powai+Mumbai',
  whatsappUrl: 'https://wa.me/912249607890',
  instagramUrl: 'https://instagram.com/gameon.powai',
  youtubeUrl: 'https://youtube.com/@gameon.powai',
} as const;
