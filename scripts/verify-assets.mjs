import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const jobs = JSON.parse(await fs.readFile('scripts/image-prompts.json', 'utf8'));
const tiles = [];
for (const [index, job] of jobs.entries()) {
  const file = `public/images/${job.file}`;
  const stat = await fs.stat(file);
  const meta = await sharp(file).metadata();
  assert(stat.size < 200_000, `${file} exceeds 200KB`);
  const expected = job.file.startsWith('experiences/')
    ? [1200, 1500]
    : job.file.startsWith('menu/') && job.file !== 'menu/hero.webp'
      ? [800, 800]
      : [1920, 1080];
  assert.deepEqual([meta.width, meta.height], expected, `${file} dimensions`);
  const image = await sharp(file)
    .resize(240, 155, { fit: 'contain', background: '#06080f' })
    .toBuffer();
  tiles.push({
    input: image,
    left: (index % 6) * 256 + 8,
    top: Math.floor(index / 6) * 188,
  });
  const label = `<svg width="256" height="28"><text x="8" y="19" fill="#ECEEF4" font-family="Arial" font-size="12">${job.file.split('/').at(-1).replace('.webp', '')}</text></svg>`;
  tiles.push({
    input: Buffer.from(label),
    left: (index % 6) * 256,
    top: Math.floor(index / 6) * 188 + 155,
  });
}
await fs.mkdir('docs/enhancement', { recursive: true });
await sharp({
  create: {
    width: 1536,
    height: Math.ceil(jobs.length / 6) * 188,
    channels: 3,
    background: '#06080f',
  },
})
  .composite(tiles)
  .jpeg({ quality: 85 })
  .toFile('docs/enhancement/asset-contact-sheet.jpg');
console.log(`${jobs.length} WebP assets verified: dimensions and <200KB each`);
