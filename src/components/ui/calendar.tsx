'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col gap-4',
        month: 'flex flex-col gap-4',
        caption: 'relative flex items-center justify-center pt-1',
        caption_label: 'font-display text-body font-medium',
        nav: 'flex items-center gap-1',
        nav_button: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'size-8 bg-elevated/60',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse',
        head_row: 'flex',
        head_cell: 'w-9 text-[0.75rem] font-medium text-muted-foreground',
        row: 'mt-1.5 flex w-full',
        cell: 'relative p-0 text-center',
        day: cn(
          'inline-flex size-9 items-center justify-center rounded-button font-mono text-meta transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan',
        ),
        day_selected: 'bg-cyan font-semibold text-cyan-foreground hover:bg-cyan',
        day_today: 'border border-cyan/40 text-cyan',
        day_outside: 'text-muted-foreground/40',
        day_disabled: 'text-muted-foreground/30 line-through hover:bg-transparent',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="size-4" />,
        IconRight: () => <ChevronRight className="size-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
