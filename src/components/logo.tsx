import { cn } from '@/lib/utils';

/**
 * The mark from the approved reference: a rounded square with an abstract
 * "G|O" inside, stroked with an accent→magenta gradient.
 *
 * SVG gradient ids are global to the document, so each instance takes its own
 * `idPrefix` — two marks on one page with the same id would make the second
 * one inherit the first's gradient.
 */
export function LogoMark({
  idPrefix = 'mark',
  className,
}: {
  idPrefix?: string;
  className?: string;
}) {
  const gradientId = `lg-${idPrefix}`;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('logo__mark', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--magenta)" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="8"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
      />
      <path
        d="M 10 22 L 10 14 L 16 14 M 22 22 L 22 10"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({
  idPrefix = 'mark',
  className,
}: {
  idPrefix?: string;
  className?: string;
}) {
  return (
    <span className={cn('logo', className)}>
      <LogoMark idPrefix={idPrefix} />
      GameOn
    </span>
  );
}
