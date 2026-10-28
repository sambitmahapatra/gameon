'use client';

import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  sub?: string;
  className?: string;
  id?: string;
};

/**
 * Section headings reveal character by character, the eyebrow types itself in,
 * and the sub-line rises 10px behind them (V2 fix 4c). Framer Motion's
 * whileInView drives it, so it runs once per heading with no ScrollTrigger.
 *
 * The full title is kept as the accessible name: the per-character spans are
 * hidden from assistive tech.
 */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  className,
  id,
}: SectionHeadingProps) {
  const reduced = useFramerReducedMotion();
  const characters = [...title];

  return (
    <div className={cn('flex max-w-prose flex-col gap-3', className)}>
      {eyebrow ? (
        <motion.p
          className="eyebrow"
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.3 }}
        >
          {reduced ? (
            eyebrow
          ) : (
            <span aria-label={eyebrow}>
              {[...eyebrow].map((character, index) => (
                <motion.span
                  key={`${character}-${index}`}
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.01, delay: 0.2 + index * 0.03 }}
                  style={{ whiteSpace: character === ' ' ? 'pre' : undefined }}
                >
                  {character}
                </motion.span>
              ))}
            </span>
          )}
        </motion.p>
      ) : null}

      <h2 id={id} className="text-h1" aria-label={title}>
        {reduced
          ? title
          : characters.map((character, index) => (
              <motion.span
                key={`${character}-${index}`}
                aria-hidden="true"
                className="inline-block"
                initial={{ opacity: 0, y: '0.3em' }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: index * 0.02, ease: 'easeOut' }}
                style={{ whiteSpace: character === ' ' ? 'pre' : undefined }}
              >
                {character}
              </motion.span>
            ))}
      </h2>

      {sub ? (
        <motion.p
          className="text-pretty text-body text-muted-foreground"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
        >
          {sub}
        </motion.p>
      ) : null}
    </div>
  );
}
