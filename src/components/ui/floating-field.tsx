'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type FloatingFieldProps = {
  id: string;
  label: string;
  error?: string;
  /** Rendered to the left of the input, e.g. the fixed +91 prefix. */
  prefix?: React.ReactNode;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Text field whose label starts inside the control and floats up on focus or
 * once there is a value (V2 fix 4g). The label is a real <label>, so clicking
 * it focuses the input and screen readers announce it normally.
 */
export const FloatingField = React.forwardRef<HTMLInputElement, FloatingFieldProps>(
  (
    { id, label, error, prefix, hint, className, onFocus, onBlur, onChange, ...props },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [filled, setFilled] = React.useState(
      Boolean(props.defaultValue ?? props.value ?? ''),
    );

    const lifted = focused || filled;

    return (
      <div className="flex flex-col gap-1.5">
        <div
          className={cn(
            'relative flex items-stretch rounded-button border bg-deep/60 transition-colors',
            error ? 'border-destructive/60' : focused ? 'border-cyan/60' : 'border-input',
          )}
        >
          {prefix ? (
            <span className="flex items-center rounded-l-button border-r border-input bg-elevated px-3.5 font-mono text-meta text-muted-foreground">
              {prefix}
            </span>
          ) : null}

          <div className="relative flex-1">
            <label
              htmlFor={id}
              className={cn(
                'pointer-events-none absolute left-3.5 origin-left text-muted-foreground transition-all duration-200 ease-out',
                lifted
                  ? 'top-1.5 text-[0.6875rem] text-cyan'
                  : 'top-1/2 -translate-y-1/2 text-meta',
              )}
            >
              {label}
            </label>
            <input
              id={id}
              ref={ref}
              className={cn(
                'h-14 w-full bg-transparent px-3.5 pb-1.5 pt-5 text-body text-foreground outline-none placeholder:text-transparent focus-visible:ring-0',
                prefix ? 'rounded-r-button' : 'rounded-button',
                className,
              )}
              onFocus={(event) => {
                setFocused(true);
                onFocus?.(event);
              }}
              onBlur={(event) => {
                setFocused(false);
                setFilled(event.target.value.length > 0);
                onBlur?.(event);
              }}
              onChange={(event) => {
                setFilled(event.target.value.length > 0);
                onChange?.(event);
              }}
              {...props}
            />
          </div>
        </div>

        {error ? (
          <p className="text-meta text-red-400">{error}</p>
        ) : hint ? (
          <p className="text-meta text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  },
);
FloatingField.displayName = 'FloatingField';
