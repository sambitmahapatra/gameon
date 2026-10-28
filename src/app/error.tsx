'use client';

import { useEffect } from 'react';

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
    <div className="section section--tight">
      <div className="wrap flex min-h-[62dvh] max-w-[640px] flex-col justify-center gap-6">
        <div>
          <div className="eyebrow">Something went wrong</div>
          <h1 className="mt-4">Something broke on our end</h1>
          <p className="sub mt-4">
            Try again in a moment. If it keeps happening, message us on WhatsApp and we
            will book you in by hand.
          </p>
        </div>

        {error.digest ? (
          <p className="mono text-fg-dim">Reference {error.digest}</p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn--primary btn--lg">
            Try again
          </button>
          <a href="/" className="btn btn--ghost btn--lg">
            Back to the floor
          </a>
        </div>
      </div>
    </div>
  );
}
