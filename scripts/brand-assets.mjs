import fs from 'node:fs/promises';
import sharp from 'sharp';

await fs.copyFile('public/logo-mark.svg', 'public/logo.svg');
await fs.copyFile('public/logo-mark.svg', 'public/favicon.svg');
await sharp('public/logo-mark.svg')
  .resize(180, 180)
  .png()
  .toFile('public/apple-touch-icon.png');
await sharp('public/logo-mark.svg').resize(512, 512).png().toFile('public/logo.png');
const icons = await Promise.all(
  [16, 32].map(async (size) => {
    const bytes = await sharp('public/logo-mark.svg').resize(size, size).png().toBuffer();
    await fs.writeFile(`public/favicon-${size}.png`, bytes);
    return { size, bytes };
  }),
);
const header = Buffer.alloc(6 + icons.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icons.length, 4);
let offset = header.length;
icons.forEach(({ size, bytes }, index) => {
  const p = 6 + index * 16;
  header[p] = size;
  header[p + 1] = size;
  header.writeUInt16LE(1, p + 4);
  header.writeUInt16LE(32, p + 6);
  header.writeUInt32LE(bytes.length, p + 8);
  header.writeUInt32LE(offset, p + 12);
  offset += bytes.length;
});
await fs.writeFile(
  'public/favicon.ico',
  Buffer.concat([header, ...icons.map((i) => i.bytes)]),
);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="glow"><stop stop-color="#00F0FF" stop-opacity=".5"/><stop offset="1" stop-color="#06080F" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="#06080F"/><circle cx="900" cy="315" r="300" fill="url(#glow)"/><g fill="none" stroke="#00F0FF" opacity=".4"><ellipse cx="900" cy="315" rx="240" ry="100"/><ellipse cx="900" cy="315" rx="240" ry="100" transform="rotate(60 900 315)"/><ellipse cx="900" cy="315" rx="240" ry="100" transform="rotate(-60 900 315)"/></g><circle cx="900" cy="315" r="35" fill="#00F0FF"/><g fill="#FF2E9A"><circle cx="690" cy="220" r="14"/><circle cx="1050" cy="475" r="19"/></g><g fill="#A78BFA"><circle cx="1030" cy="150" r="15"/><circle cx="735" cy="450" r="13"/></g><g fill="#FFB84D"><circle cx="895" cy="80" r="12"/><circle cx="920" cy="550" r="12"/></g><path d="m117 152-38 32 38 32 30-26h-32m6-38 28 25-28 24" fill="none" stroke="#00F0FF" stroke-width="6"/><text x="70" y="340" fill="#00F0FF" font-family="Segoe UI,Arial,sans-serif" font-weight="800" font-size="110" letter-spacing="-6">GameOn</text><text x="76" y="410" fill="#ECEEF4" font-family="Segoe UI,Arial,sans-serif" font-size="42" font-style="italic">Enter another world.</text><text x="78" y="535" fill="#8891A8" font-family="Segoe UI,Arial,sans-serif" font-size="22" letter-spacing="3">POWAI · MUMBAI</text></svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-image.png');
console.log('Logo, favicon pack and 1200×630 social image generated');
