import Link from 'next/link';
import { ScrollHeading } from '@/components/scroll-heading';
import { cn } from '@/lib/utils';

type FeatureBlockProps = {
  eyebrow: string;
  heading: string;
  body: string;
  specs: string[];
  cta: { href: string; label: string };
  art: React.ReactNode;
  /** Which side the art sits on at ≥900px. */
  imageSide?: 'left' | 'right';
};

/**
 * One signature-experience row. `imageSide: 'right'` adds the reference's
 * `--rev` modifier, which reorders the text column rather than the art, so
 * the art keeps its DOM position and the reading order stays sensible on
 * mobile (art, then words).
 */
export function FeatureBlock({
  eyebrow,
  heading,
  body,
  specs,
  cta,
  art,
  imageSide = 'left',
}: FeatureBlockProps) {
  return (
    <div className={cn('feature', imageSide === 'right' && 'feature--rev')}>
      <div className="feature__art">{art}</div>

      <div className="feature__text">
        <div className="eyebrow">{eyebrow}</div>
        <ScrollHeading text={heading} />
        <p>{body}</p>
        <div className="feature__specs">
          {specs.map((spec) => (
            <span className="feature__spec" key={spec}>
              {spec}
            </span>
          ))}
        </div>
        <Link href={cta.href} className="feature__cta">
          {cta.label}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
