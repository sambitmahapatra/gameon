import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const config = JSON.parse(await fs.readFile('mobile/toolchain.json', 'utf8'));
const root = path.resolve('.cache/android-tools');
await fs.mkdir(root, { recursive: true });
await Promise.all(
  config.downloads.map(async (file) => {
    const target = path.join(root, file.file);
    let bytes;
    try {
      bytes = await fs.readFile(target);
    } catch {}
    if (
      !bytes ||
      createHash(file.algorithm).update(bytes).digest('hex') !== file.checksum
    ) {
      const response = await fetch(file.url);
      if (!response.ok) throw Error(file.file + ': ' + response.status);
      bytes = Buffer.from(await response.arrayBuffer());
      if (createHash(file.algorithm).update(bytes).digest('hex') !== file.checksum)
        throw Error(file.file + ': checksum mismatch');
      await fs.writeFile(target, bytes);
    }
    console.log(file.file + ': verified');
  }),
);
const result = spawnSync(
  'powershell.exe',
  ['-NoProfile', '-File', path.resolve('scripts/unpack-mobile-tools.ps1')],
  { stdio: 'inherit' },
);
if (result.status !== 0) throw Error('Failed to unpack the Android tools');
console.log('Portable Android toolchain ready under .cache/android-tools.');
