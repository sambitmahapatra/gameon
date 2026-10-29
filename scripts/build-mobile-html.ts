import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { ZONE_SEED } from '../src/lib/data/venue';
import { ZONE_LOOK } from '../src/lib/data/club';
import { MENU, MENU_CATEGORIES } from '../src/lib/data/menu';
import { TIERS } from '../src/lib/data/tiers';
import { SITE } from '../src/lib/site';

async function main() {
  const root = process.cwd(),
    output = path.join(root, 'GameON application');
  const assets = new Map<string, Promise<string>>();
  async function photo(file: string, width = 640) {
    const key = file + width;
    if (!assets.has(key))
      assets.set(
        key,
        (async () => {
          const data = await sharp(path.join(root, 'public', file))
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 68 })
            .toBuffer();
          return 'data:image/webp;base64,' + data.toString('base64');
        })(),
      );
    return assets.get(key)!;
  }
  type OfflineZone = {
    id: string;
    name: string;
    description: string;
    price: number | null;
    capacity: number | null;
    tag: string;
    games: string[];
    image: string;
  };
  const zones: OfflineZone[] = await Promise.all(
    ZONE_SEED.map(async (z) => ({
      id: z.id,
      name: ZONE_LOOK[z.id]?.name ?? z.name,
      description: ZONE_LOOK[z.id]?.description ?? z.description,
      price: z.price_per_hour,
      capacity: z.capacity,
      tag: ZONE_LOOK[z.id]?.tags[0] ?? 'Create & stream',
      games: ZONE_LOOK[z.id]?.tags ?? ['Broadcast-ready', 'Cameras & lighting'],
      image: await photo(
        ZONE_LOOK[z.id]
          ? `images/club/${ZONE_LOOK[z.id].image}.webp`
          : `images/zones/${z.id}.webp`,
      ),
    })),
  );
  zones.push({
    id: 'arcade-corner',
    name: 'Arcade Corner',
    description:
      'Quick rounds, old-school nostalgia and the kind of rematch that lasts all evening. Check available games and per-play prices at the counter.',
    price: null,
    capacity: null,
    tag: 'Retro play',
    games: ['Retro games', 'Pay per play'],
    image: await photo('images/club/arcade.webp'),
  });
  const menu = await Promise.all(
    MENU.map(async (item) => ({
      ...item,
      image: await photo(
        (item.image ?? `/images/menu/${item.slug}.webp`).replace(/^\//, ''),
        280,
      ),
    })),
  );
  const catalog = {
    version: 1,
    date: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }),
    zones,
    menu,
    categories: MENU_CATEGORIES,
    tiers: TIERS,
    site: { address: SITE.address, phone: SITE.phone, mapsUrl: SITE.mapsUrl },
    hero: await photo('images/club/hero.webp', 900),
  };
  let style = await readFile('mobile/gameon/app.css', 'utf8');
  style = style
    .replace(
      '__DISPLAY_FONT__',
      'data:font/ttf;base64,' +
        (await readFile('public/fonts/barlow-condensed-800.ttf')).toString('base64'),
    )
    .replace(
      '__BODY_FONT__',
      'data:font/ttf;base64,' +
        (await readFile('public/fonts/dm-sans-variable.ttf')).toString('base64'),
    );
  const core = await readFile('mobile/gameon/core.js', 'utf8'),
    app = await readFile('mobile/gameon/app.js', 'utf8');
  const script =
    'const CATALOG = ' +
    JSON.stringify(catalog).replace(/</g, '\\u003c') +
    ';\n' +
    core +
    '\n' +
    app;
  const hash = createHash('sha256').update(script).digest('base64');
  const csp = `default-src 'none'; img-src data:; font-src data:; style-src 'unsafe-inline'; script-src 'sha256-${hash}'; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'`;
  const licenses = await Promise.all(
    ['barlow-condensed-OFL.txt', 'dm-sans-OFL.txt'].map((name) =>
      readFile('public/fonts/' + name, 'utf8'),
    ),
  );
  let html = await readFile('mobile/gameon/index.html', 'utf8');
  html = html
    .replace('__CSP__', csp)
    .replace('__STYLE__', () => style)
    .replace('__SCRIPT__', () => script);
  html +=
    '\n<!-- Bundled font licenses (SIL OFL):\n' +
    licenses.join('\n\n').replace(/--/g, '—') +
    '\nImages: local assets from the GameOn redesign. See docs/REDESIGN_IMPLEMENTATION.md for source IDs. -->\n';
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'GameOn App.html'), html);
  await mkdir('.cache/mobile-build/assets', { recursive: true });
  await writeFile('.cache/mobile-build/assets/index.html', html);
  await writeFile('.cache/mobile-build/catalog.json', JSON.stringify(catalog));
  console.log(
    `Standalone offline HTML: ${path.join(output, 'GameOn App.html')} (${(Buffer.byteLength(html) / 1048576).toFixed(2)} MiB)`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
