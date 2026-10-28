import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sources = JSON.parse(await fs.readFile('.cache/image-sources.json', 'utf8'));
for (const [file, source] of Object.entries(sources)) {
  const destination = path.join('public/images', file);
  if (!process.argv.includes('--force') && (await fs.stat(destination).catch(() => null)))
    continue;
  const size = file.startsWith('experiences/')
    ? [1200, 1500]
    : file.startsWith('menu/') && file !== 'menu/hero.webp'
      ? [800, 800]
      : [1920, 1080];
  let buffer;
  for (const quality of [78, 68, 58, 48, 38]) {
    buffer = await sharp(source)
      .resize(...size, { fit: 'cover' })
      .webp({ quality, effort: 6 })
      .toBuffer();
    if (buffer.length < 200_000) break;
  }
  if (buffer.length >= 200_000) throw new Error(`Image exceeds 200KB: ${file}`);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, buffer);
  console.log(`${file}: ${Math.round(buffer.length / 1024)}KB`);
}
