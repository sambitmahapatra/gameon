import { Skeleton } from '@/components/ui/skeleton';

/** Shared themed loading shell so every route fades in the same way. */
export function PageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="shell flex flex-col gap-10 py-16">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-[min(28rem,80vw)]" />
        <Skeleton className="h-4 w-[min(36rem,90vw)]" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows * 3 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-card" />
        ))}
      </div>
    </div>
  );
}
