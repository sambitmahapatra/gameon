import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * `shine` adds the diagonal sheen that sweeps across on hover (V2 fix 4f);
 * `overflow-hidden` keeps it inside the radius. The link variant opts out,
 * since there is no surface for a sheen to travel across.
 */
const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-button font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'shine bg-brand font-semibold text-brand-foreground hover:bg-brand/90 hover:shadow-glow active:translate-y-px',
        warm: 'shine bg-amber font-semibold text-brand-foreground hover:bg-amber/90 hover:shadow-glow active:translate-y-px',
        outline:
          'shine border border-brand/50 text-brand hover:border-brand hover:bg-brand/10 active:translate-y-px',
        secondary: 'shine bg-elevated text-foreground hover:bg-elevated/70',
        ghost: 'text-muted-foreground hover:bg-elevated hover:text-foreground',
        link: 'overflow-visible text-brand underline-offset-4 hover:underline',
        destructive:
          'shine bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-11 px-5 text-meta',
        sm: 'h-9 px-3.5 text-meta',
        lg: 'h-14 px-7 text-body',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
