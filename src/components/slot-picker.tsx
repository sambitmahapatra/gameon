'use client';

import { useRef } from 'react';

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

/**
 * 4 columns on mobile, 6 on desktop. Open slots take a brand border on hover,
 * booked ones are struck through, the selected one is filled.
 *
 * The entrance animates *from* a scaled-down state once the slots arrive, so
 * a failed animation still leaves every slot visible and clickable.
 */
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

      const tween = gsap.from(buttons, {
        opacity: 0,
        scale: 0.94,
        duration: 0.28,
        ease: 'power2.out',
        stagger: { amount: 0.25 },
      });

      return () => tween.kill();
    },
    { scope, dependencies: [reduced, loading, slots] },
  );

  function ripple(event: React.MouseEvent<HTMLButtonElement>) {
    if (reduced) return;

    const button = event.currentTarget;
    const box = button.getBoundingClientRect();
    const dot = document.createElement('span');

    dot.className =
      'pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40 motion-safe:animate-ripple';
    dot.style.left = `${event.clientX - box.left}px`;
    dot.style.top = `${event.clientY - box.top}px`;

    button.append(dot);
    window.setTimeout(() => dot.remove(), 650);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-2.5 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="skeleton h-11" />
        ))}
      </div>
    );
  }

  const selectable = slots.filter(
    (slot) => slot.booked === 0 && (!minTime || slot.time >= minTime),
  );

  if (!slots.length || !selectable.length) {
    return (
      <div className="panel panel--flat px-5 py-10 text-center">
        <p>No slots left today. Try tomorrow.</p>
        <p className="mt-1.5 text-meta text-fg-muted">
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
              'mono relative h-11 overflow-hidden rounded-button border transition-colors duration-200',
              selected
                ? 'border-brand bg-brand font-medium text-brand-foreground'
                : 'border-line bg-elevated text-fg hover:border-brand',
              disabled &&
                'cursor-not-allowed border-line bg-surface text-fg-dim line-through opacity-50 hover:border-line',
            )}
          >
            {prettyTime(slot.time)}
          </button>
        );
      })}
    </div>
  );
}
