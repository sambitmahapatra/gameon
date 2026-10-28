'use client';

import { useRef } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';
import type { Slot } from '@/lib/types';
import { cn, prettyTime } from '@/lib/utils';

type SlotPickerProps = {
  slots: Slot[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (slot: Slot) => void;
  /** Slots earlier than this time are closed off for today. */
  minTime?: string | null;
};

/** Spec 7.3 — 4 columns on mobile, 6 on desktop, cyan pulse as slots arrive. */
export function SlotPicker({
  slots,
  loading,
  selectedId,
  onSelect,
  minTime,
}: SlotPickerProps) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || loading || !scope.current || !slots.length) return;

      const buttons = gsap.utils.toArray<HTMLElement>(
        '[data-slot]:not([disabled])',
        scope.current,
      );
      if (!buttons.length) return;

      gsap.fromTo(
        buttons,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.28,
          ease: 'power2.out',
          stagger: { amount: 0.25, from: 'start' },
        },
      );
    },
    { scope, dependencies: [reduced, loading, slots] },
  );

  /** Cyan ripple from the click point (V2 fix 4g). */
  function ripple(event: React.MouseEvent<HTMLButtonElement>) {
    if (reduced) return;

    const button = event.currentTarget;
    const box = button.getBoundingClientRect();
    const dot = document.createElement('span');

    dot.className =
      'pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/40 motion-safe:animate-ripple';
    dot.style.left = `${event.clientX - box.left}px`;
    dot.style.top = `${event.clientY - box.top}px`;

    button.append(dot);
    window.setTimeout(() => dot.remove(), 650);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-2.5 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-11" />
        ))}
      </div>
    );
  }

  const selectable = slots.filter(
    (slot) => slot.booked === 0 && (!minTime || slot.time >= minTime),
  );

  if (!slots.length || !selectable.length) {
    return (
      <div className="rounded-card border border-dashed border-border px-5 py-10 text-center">
        <p className="text-body text-foreground">No slots left today. Try tomorrow.</p>
        <p className="mt-1.5 text-meta text-muted-foreground">
          Evenings fill up first, so mornings are usually wide open.
        </p>
      </div>
    );
  }

  return (
    <div ref={scope} className="grid grid-cols-4 gap-2.5 lg:grid-cols-6">
      {slots.map((slot) => {
        const past = Boolean(minTime && slot.time < minTime);
        const disabled = slot.booked === 1 || past;
        const selected = slot.id === selectedId;

        return (
          <button
            key={slot.id}
            type="button"
            data-slot
            disabled={disabled}
            aria-pressed={selected}
            onClick={(event) => {
              ripple(event);
              onSelect(slot);
            }}
            className={cn(
              'relative h-11 overflow-hidden rounded-button border font-mono text-meta transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-deep',
              selected
                ? 'border-cyan bg-cyan font-semibold text-cyan-foreground'
                : 'border-border bg-elevated text-foreground hover:border-cyan/70',
              disabled &&
                'cursor-not-allowed border-border bg-elevated/40 text-muted-foreground line-through opacity-40 hover:border-border',
            )}
          >
            {prettyTime(slot.time)}
          </button>
        );
      })}
    </div>
  );
}
