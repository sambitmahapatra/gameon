'use client';

import { useMemo, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { BookingDetail, Zone } from '@/lib/types';
import { api, prettyTime } from '@/lib/utils';

type BookingsTableProps = {
  bookings: BookingDetail[];
  zones: Zone[];
  adminKey: string;
};

const CSV_COLUMNS = [
  'id',
  'zone_name',
  'date',
  'time',
  'name',
  'phone',
  'party_size',
  'status',
  'created_at',
] as const;

export function BookingsTable({ bookings, zones, adminKey }: BookingsTableProps) {
  const [rows, setRows] = useState(bookings);
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [pending, setPending] = useState<BookingDetail | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        if (zoneFilter !== 'all' && row.zone_id !== zoneFilter) return false;
        if (statusFilter !== 'all' && row.status !== statusFilter) return false;
        if (from && row.date < from) return false;
        if (to && row.date > to) return false;
        return true;
      }),
    [rows, zoneFilter, statusFilter, from, to],
  );

  function exportCsv() {
    const header = CSV_COLUMNS.join(',');
    const body = filtered
      .map((row) =>
        CSV_COLUMNS.map((column) => {
          const value = String(row[column] ?? '');
          return value.includes(',') || value.includes('"')
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(','),
      )
      .join('\n');

    const url = URL.createObjectURL(
      new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `gameon-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function cancel(booking: BookingDetail) {
    setCancelling(true);
    try {
      const res = await fetch(api(`/api/bookings/${booking.id}`), { method: 'DELETE' });
      if (!res.ok) {
        const payload = (await res.json()) as { error?: string };
        toast.error(
          payload.error ?? 'Something broke on our end. Try again in a moment.',
        );
        return;
      }
      setRows((current) =>
        current.map((row) =>
          row.id === booking.id ? { ...row, status: 'cancelled' as const } : row,
        ),
      );
      toast.success(`${booking.id} cancelled. The slot is free again.`);
      setPending(null);
    } catch {
      toast.error('We cannot reach the server. Check your connection.');
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="from">From</Label>
          <Input
            id="from"
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="zone">Zone</Label>
          <Select value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger id="zone" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All zones</SelectItem>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="secondary" onClick={exportCsv} className="ml-auto">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-12 text-center">
                  <p className="text-body text-foreground">No bookings yet.</p>
                  <p className="mt-1.5 text-meta text-muted-foreground">
                    Share the site to start taking reservations.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-cyan">{booking.id}</TableCell>
                  <TableCell>{booking.zone_name}</TableCell>
                  <TableCell className="font-mono">{booking.date}</TableCell>
                  <TableCell className="font-mono">{prettyTime(booking.time)}</TableCell>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {booking.phone}
                  </TableCell>
                  <TableCell className="font-mono">{booking.party_size}</TableCell>
                  <TableCell>
                    <Badge
                      variant={booking.status === 'confirmed' ? 'success' : 'neutral'}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === 'confirmed' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPending(booking)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-meta text-muted-foreground">
        Showing {filtered.length} of {rows.length} bookings. Admin key in use:{' '}
        <span className="font-mono">{adminKey.replace(/.(?=.{3})/g, '•')}</span>
      </p>

      <Dialog open={Boolean(pending)} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel {pending?.id}?</DialogTitle>
            <DialogDescription>
              {pending
                ? `${pending.name} booked ${pending.zone_name} on ${pending.date} at ${prettyTime(
                    pending.time,
                  )}. Cancelling frees the slot immediately.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setPending(null)}
              disabled={cancelling}
            >
              Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={() => pending && cancel(pending)}
              disabled={cancelling}
            >
              {cancelling ? <Loader2 className="size-4 animate-spin" /> : null}
              Cancel booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
