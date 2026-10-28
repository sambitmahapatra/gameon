import Image from 'next/image';
import { cn } from '@/lib/utils';

export function LogoMark({ className }: { idPrefix?: string; className?: string }) {
  return (
    <Image
      src="/logo-mark.svg"
      alt=""
      aria-hidden="true"
      width={32}
      height={32}
      className={cn('logo__mark', className)}
    />
  );
}
export function Logo({
  className,
  compact = false,
}: {
  idPrefix?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn('logo', className)}>
      <span className={compact ? 'min-[900px]:hidden' : 'hidden'}>
        <LogoMark />
      </span>
      <Image
        src="/logo-lockup.svg"
        alt="GameOn"
        width={156}
        height={52}
        sizes="156px"
        className={compact ? 'hidden min-[900px]:block' : undefined}
      />
      {compact && <span className="sr-only min-[900px]:hidden">GameOn</span>}
    </span>
  );
}
