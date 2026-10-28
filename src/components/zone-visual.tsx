import Image from 'next/image';

import { cn } from '@/lib/utils';

type ZoneVisualProps = {
  accent: string | null;
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * Placeholder-first artwork: a gradient tinted with the zone's accent, overlaid
 * with a faint grid. When a real photo lands in /public/images/zones it takes
 * over, and the gradient stays behind it as the load-in colour.
 */
export function ZoneVisual({ accent, src, alt, className, priority }: ZoneVisualProps) {
  const tint = accent ?? '#00E5FF';

  return (
    <div className={cn('relative overflow-hidden bg-deep', className)}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(120% 110% at 15% 10%, ${tint}55, transparent 60%),
            radial-gradient(90% 80% at 90% 90%, ${tint}22, transparent 70%),
            linear-gradient(160deg, #141B2D 10%, #0A0E17 85%)`,
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
          priority={priority}
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : null}
    </div>
  );
}
