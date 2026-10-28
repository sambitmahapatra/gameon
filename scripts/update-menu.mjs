import fs from 'node:fs';
const brief = fs.readFileSync('docs/GameOn_Codex_Enhancement_Prompt.md', 'utf8');
const photos = JSON.parse(fs.readFileSync('scripts/image-prompts.json')).filter(
  (j) => j.file.startsWith('menu/') && !j.file.endsWith('hero.webp'),
);
const categories = [
  { id: 'snacks', label: 'Snacks', note: 'One-handed, built for mid-match' },
  { id: 'mains', label: 'Mains', note: 'Order between rounds, eat at your rig' },
  { id: 'drinks', label: 'Drinks', note: 'Caffeine, sugar, and cold things' },
  { id: 'combos', label: 'Combos', note: 'Built for a 90-minute session' },
];
let n = 0;
const items = categories.flatMap((c) => {
  const section = brief.split(`#### ${c.label}`)[1].split('####')[0];
  return section
    .split('\n')
    .filter(
      (l) => l.startsWith('| ') && !l.startsWith('| Item') && !l.startsWith('| Combo'),
    )
    .map((row) => {
      const cells = row
        .split('|')
        .slice(1, -1)
        .map((s) => s.trim());
      const hasVeg = cells.length === 4;
      const price = Number(cells[hasVeg ? 2 : 1].replace(/[^0-9]/g, ''));
      const name = cells[0];
      const veg = hasVeg
        ? cells[1].includes('🟢')
        : c.id === 'drinks' || name === "Streamer's Fuel";
      return {
        name,
        slug: photos[n++].file.replace('menu/', '').replace('.webp', ''),
        description: cells.at(-1),
        price,
        veg,
        category: c.id,
      };
    });
});
if (items.length !== 22 || items.some((i) => !i.price))
  throw new Error('Menu parsing failed');
fs.writeFileSync(
  'src/lib/data/menu.ts',
  `export type MenuCategory = 'snacks' | 'mains' | 'drinks' | 'combos';\nexport type MenuItem = { name: string; slug: string; description: string; price: number; veg: boolean; category: MenuCategory };\nexport const MENU_CATEGORIES: { id: MenuCategory; label: string; note: string }[] = ${JSON.stringify(categories, null, 2)};\nexport const MENU: MenuItem[] = ${JSON.stringify(items, null, 2)};\n`,
);
console.log('Updated 22 menu items');
