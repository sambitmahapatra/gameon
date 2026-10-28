import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-meta font-medium',
  {
    variants: {
      variant: {
        default: 'border-brand/30 bg-brand/10 text-brand',
        warm: 'border-ember/30 bg-amber/10 text-ember',
        neutral: 'border-border bg-elevated text-muted-foreground',
        success: 'border-green/30 bg-green/10 text-green',
        danger: 'border-destructive/40 bg-destructive/10 text-red-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
