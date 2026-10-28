import * as React from 'react';

import { cn } from '@/lib/utils';

/** The sweep lives in globals.css as `.skeleton`, so it matches the inline ones. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton', className)} {...props} />;
}

export { Skeleton };
