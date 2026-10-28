import { Skeleton } from '@/components/ui/skeleton';

/** The wizard's own shape: progress bar, then one step's worth of cards. */
export default function Loading() {
  return (
    <div className="section section--tight">
      <div className="wrap flex max-w-[1000px] flex-col gap-12">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-[min(24rem,80vw)]" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72 rounded-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
