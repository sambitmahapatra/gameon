import fs from 'node:fs';

const brief = fs.readFileSync('docs/GameOn_Codex_Enhancement_Prompt.md', 'utf8');
const jobs = [];
for (const match of brief.matchAll(
  /#### [^\n]+`public\/images\/zones\/([^`]+)`\s*\n\s*> ([^\n]+)/g,
)) {
  jobs.push({ file: `zones/${match[1]}`, prompt: match[2] });
}
for (const match of brief.matchAll(/^- `([^`]+\.webp)` — "([^"]+)"/gm)) {
  jobs.push({
    file: `menu/${match[1]}`,
    prompt: `Premium hyperreal food photograph. Overhead or 45-degree photograph on a matte dark slate surface with subtle cyan rim lighting. Minimal plating, no clutter, a single garnish only. Dark moody background with soft gradient, shallow depth of field. No text, no watermarks. Square 1:1, 800x800. ${match[2]}`,
  });
}
for (const [slug, subject] of [
  [
    'vr-arena',
    'A full-height player in a wireless VR headset reaching into holographic space, silhouetted in a dark high-ceilinged free-roam VR arena with cyan LED strips, volumetric fog and warm monitor accents.',
  ],
  [
    'flight-sim',
    'Through the windows of a full Boeing 737 flight simulator cockpit, Mumbai skyline at dusk. Amber instrument panels in the foreground, blue ambient light. Dramatic immersive composition.',
  ],
  [
    'streaming-pod',
    'A streamer live on camera inside a soundproof broadcast pod. Microphone on boom arm, ring light, dual monitors, stream deck, acoustic foam. A small LIVE indicator on a monitor. Pink and cyan rim lighting.',
  ],
])
  jobs.push({
    file: `experiences/${slug}-hero.webp`,
    prompt: `Cinematic premium gaming lounge photograph. Hyperreal, moody color grading, dramatic portrait framing 4:5. No logos, no watermarks. ${subject}`,
  });
const cafe = brief.match(/### 3\.5[\s\S]*?\n> ([^\n]+)/);
jobs.push({ file: 'menu/hero.webp', prompt: cafe[1] });
fs.writeFileSync('scripts/image-prompts.json', JSON.stringify(jobs, null, 2) + '\n');
console.log(`${jobs.length} image prompts prepared`);
