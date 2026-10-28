import { cn, inrDigits } from '@/lib/utils';

type PriceProps = {
  amount: number;
  /** e.g. '/hour', '/month' */
  suffix?: string;
  className?: string;
};

/**
 * The rupee symbol sits a little smaller and quieter than the digits, so the
 * number leads and the currency does not compete with it (V2 fix 5).
 */
export function Price({ amount, suffix, className }: PriceProps) {
  return (
    <span className={cn('font-mono tabular-nums', className)}>
      <span className="text-[0.85em] text-muted-foreground">₹</span>
      {inrDigits(amount)}
      {suffix ? <span className="text-muted-foreground">{suffix}</span> : null}
    </span>
  );
}
