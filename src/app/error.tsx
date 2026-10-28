'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GameOn]', error);
  }, [error]);

  return (
    <div className="shell flex min-h-[70dvh] max-w-2xl flex-col justify-center gap-6 py-24">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="text-h1">Something broke on our end</h1>
      <p className="max-w-prose text-body text-muted-foreground">
        Try again in a moment. If it keeps happening, message us on WhatsApp and we will
        book you in by hand.
      </p>
      {error.digest ? (
        <p className="font-mono text-meta text-muted-foreground">
          Reference {error.digest}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-4 pt-2">
        <Button onClick={reset} size="lg">
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="/">Back to the floor</a>
        </Button>
      </div>
    </div>
  );
}
