import { cn } from '@/lib/utils';
export function LogoMark({ className }: { idPrefix?: string; className?: string }) {
  return (
    <span className={cn('club-logo-mark', className)} aria-hidden="true">
      G<span>↗</span>
    </span>
  );
}
export function Logo({
  className,
}: {
  idPrefix?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn('club-logo', className)}>
      GAME<span>ON</span>
      <b>.</b>
    </span>
  );
}
