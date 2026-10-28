'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CalendarPlus, Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { buildIcs } from '@/lib/ics';
import { SITE } from '@/lib/site';
import { api, prettyTime } from '@/lib/utils';

type ConfirmActionsProps = {
  id: string;
  zoneName: string;
  date: string;
  time: string;
  partySize: number;
  cancelled: boolean;
};

export function ConfirmActions({
  id,
  zoneName,
  date,
  time,
  partySize,
  cancelled,
}: ConfirmActionsProps) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [open, setOpen] = useState(false);

  function addToCalendar() {
    const ics = buildIcs({ id, zoneName, date, time, partySize });
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${id}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success('Calendar invite downloaded');
  }

  async function cancelBooking() {
    setCancelling(true);
    try {
      const res = await fetch(api(`/api/bookings/${id}`), { method: 'DELETE' });
      if (!res.ok) {
        const payload = (await res.json()) as { error?: string };
        toast.error(payload.error ?? 'Something broke on our end. Try again in a moment.');
        return;
      }
      toast.success('Booking cancelled. The slot is back on the floor.');
      setOpen(false);
      router.refresh();
    } catch {
      toast.error('We cannot reach the server. Check your connection.');
    } finally {
      setCancelling(false);
    }
  }

  const whatsapp = `${SITE.whatsappUrl}?text=${encodeURIComponent(
    `Hi GameOn, this is about booking ${id} (${zoneName}, ${date} at ${prettyTime(time)}).`,
  )}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-4">
        <Button onClick={addToCalendar} variant="outline" disabled={cancelled}>
          <CalendarPlus className="size-4" />
          Add to calendar
        </Button>
        <Button asChild variant="secondary">
          <a href={whatsapp}>
            <MessageCircle className="size-4" />
            WhatsApp us
          </a>
        </Button>
      </div>

      {cancelled ? null : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="h-auto self-start p-0 text-muted-foreground">
              Cancel this booking
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel booking {id}?</DialogTitle>
              <DialogDescription>
                The slot goes straight back on the floor, so someone else may take it. There
                is no charge either way.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={cancelling}>
                Keep it
              </Button>
              <Button variant="destructive" onClick={cancelBooking} disabled={cancelling}>
                {cancelling ? <Loader2 className="size-4 animate-spin" /> : null}
                Cancel booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
