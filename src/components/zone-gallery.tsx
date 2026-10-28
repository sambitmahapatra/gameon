import { ZoneArt } from '@/components/zone-art';
import { BrandPhoto } from '@/components/brand-photo';

/**
 * Four more looks at the same room. Each tile reuses the zone's composition
 * at a different crop and scale, which keeps every zone on-brand without four
 * more hand-drawn scenes to maintain. The wrapper clips, so the transformed
 * art fills its tile.
 */
const VARIANTS = [
  { label: 'the floor', transform: 'scale(1.6) translate(8%, 6%)' },
  { label: 'the rig', transform: 'scale(2.2) translate(-6%, -4%)' },
  { label: 'the lighting', transform: 'scale(1.35) rotate(-3deg)' },
  { label: 'the detail', transform: 'scale(2.8) translate(4%, -8%)' },
];

export function ZoneGallery({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {VARIANTS.map((variant, index) => (
        <div
          key={variant.label}
          className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-line bg-elevated shadow-card"
          role="img"
          aria-label={`${name} — ${variant.label}`}
        >
          <div
            className="absolute inset-0 origin-center"
            style={{ transform: variant.transform }}
          >
            <BrandPhoto
              src={`/images/zones/${slug}.webp`}
              alt={`${name} zone at GameOn`}
              width={1920}
              height={1080}
              sizes="(min-width: 768px) 25vw, 50vw"
              fallback={<ZoneArt slug={slug} uid={`zg-${slug}-${index}`} />}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
