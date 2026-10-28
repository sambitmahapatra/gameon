import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  sub?: string;
  className?: string;
  id?: string;
};

export function SectionHeading({ eyebrow, title, sub, className, id }: SectionHeadingProps) {
  return (
    <div className={cn('flex max-w-prose flex-col gap-3', className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="text-h1">
        {title}
      </h2>
      {sub ? <p className="text-body text-muted-foreground text-pretty">{sub}</p> : null}
    </div>
  );
}
