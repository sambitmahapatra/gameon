'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function BrandPhoto({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  fallback,
  overlay = false,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  fallback?: React.ReactNode;
  overlay?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={cn(
        'brand-photo',
        loaded && 'is-loaded',
        failed && 'is-failed',
        overlay && 'brand-photo--art',
        className,
      )}
    >
      <div className="brand-photo__fallback" aria-hidden="true">
        {!loaded && fallback}
      </div>
      {!failed && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="brand-photo__image"
        />
      )}
      {failed && <span className="sr-only">{alt}</span>}
      {overlay && loaded && (
        <div className="brand-photo__art" aria-hidden="true">
          {fallback}
        </div>
      )}
    </div>
  );
}
