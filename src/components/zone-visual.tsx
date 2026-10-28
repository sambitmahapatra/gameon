import Image from 'next/image';

import { BLUR_DATA_URL } from '@/lib/images';
import { cn } from '@/lib/utils';

type ZoneVisualProps = {
  accent: string | null;
  src?: string | null;
  alt: string;
  className?: string;
  /** Tailwind `sizes` hint; defaults to the zone-card proportion. */
  sizes?: string;
  priority?: boolean;
  /** Set by the zone card so the photo zooms on hover of the whole card. */
  zoomOnHover?: boolean;
};

/**
 * A photo over an accent-tinted gradient mesh. The mesh is not a fallback of
 * last resort — it is always painted underneath, so a slow or blocked CDN
 * leaves a rich surface instead of a blank box, and the image fades in over it.
 *
 * Light mode adds a warm wash (--image-wash) so photos from different shoots
 * read as one set.
 */
export function ZoneVisual({
  accent,
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, 40vw',
  priority,
  zoomOnHover,
}: ZoneVisualProps) {
  const tint = accent ?? '#00E5FF';

  return (
    <div className={cn('relative overflow-hidden bg-elevated', className)}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(120% 110% at 15% 10%, ${tint}66, transparent 62%),
            radial-gradient(90% 80% at 88% 92%, ${tint}2E, transparent 70%),
            linear-gradient(160deg, hsl(var(--bg-surface)) 8%, hsl(var(--bg-elevated)) 88%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-faint opacity-20 [background-size:28px_28px]"
      />

      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className={cn(
            'object-cover transition-transform duration-700 ease-out',
            zoomOnHover && 'group-hover:scale-[1.1]',
          )}
        />
      ) : null}

      {/* Accent veil: ties the photo to the zone colour in both themes */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage: `linear-gradient(160deg, ${tint}1F, transparent 55%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundColor: 'hsl(var(--image-wash))',
          opacity: 'var(--image-wash-opacity)',
        }}
      />
    </div>
  );
}
