import { Skeleton } from '@/components/ui/skeleton';

/**
 * Shared loading shell, shaped like the real pages: an eyebrow, a heading, a
 * standfirst, then a card grid. Keeping the proportions close to the loaded
 * page means almost no layout shift when the content arrives.
 */
export function PageSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="section section--tight">
      <div className="wrap flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-[min(30rem,80vw)]" />
          <Skeleton className="h-4 w-[min(38rem,90vw)]" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: rows * 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton className="h-44 rounded-card" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
