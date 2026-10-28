'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { SITE } from '@/lib/site';
import { api } from '@/lib/utils';

type EventRegisterButtonProps = {
  eventId: string;
  title: string;
  date: string;
  full: boolean;
};

export function EventRegisterButton({
  eventId,
  title,
  date,
  full,
}: EventRegisterButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  if (full) {
    return (
      <Button variant="secondary" className="w-full" asChild>
        <a
          href={`${SITE.whatsappUrl}?text=${encodeURIComponent(
            `Add me to the waitlist for ${title} on ${date}`,
          )}`}
        >
          Join the waitlist
        </a>
      </Button>
    );
  }

  async function register() {
    setPending(true);
    try {
      const res = await fetch(api('/api/events'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });

      if (res.status === 409) {
        toast.error('That event just filled up. Join the waitlist on WhatsApp?');
        router.refresh();
        return;
      }

      if (!res.ok) {
        toast.error('Something broke on our end. Try again in a moment.');
        return;
      }

      toast.success(`You are in for ${title}. Check in 15 minutes before it starts.`);
      router.refresh();
    } catch {
      toast.error('We cannot reach the server. Check your connection.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={register} disabled={pending}>
      {pending ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
      Register
    </Button>
  );
}
