'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TIERS } from '@/lib/data/tiers';
import { type MemberInput, memberInputSchema } from '@/lib/validation';
import { api, inr } from '@/lib/utils';

const PAID_TIERS = TIERS.filter((tier) => tier.price > 0);

export function JoinDialog({
  defaultTier = 'silver',
  trigger,
}: {
  defaultTier?: MemberInput['tier'];
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<MemberInput>({
    resolver: zodResolver(memberInputSchema),
    defaultValues: { name: '', phone: '', tier: defaultTier },
    mode: 'onTouched',
  });

  async function onSubmit(values: MemberInput) {
    try {
      const res = await fetch(api('/api/members'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const payload = (await res.json()) as { error?: string };
        toast.error(payload.error ?? 'Something broke on our end. Try again in a moment.');
        return;
      }

      toast.success('You are on the list. Pay at the counter on your next visit.');
      setOpen(false);
      form.reset({ name: '', phone: '', tier: values.tier });
    } catch {
      toast.error('We cannot reach the server. Check your connection.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button size="lg">Become a member</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Become a member</DialogTitle>
          <DialogDescription>
            We hold your tier at the counter. Nothing is charged here, and you can switch tier
            on your first visit.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="member-name">Name</Label>
            <Input id="member-name" autoComplete="name" {...form.register('name')} />
            {form.formState.errors.name ? (
              <p className="text-meta text-red-300">{form.formState.errors.name.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="member-phone">Mobile number</Label>
            <div className="flex items-stretch">
              <span className="inline-flex items-center rounded-l-button border border-r-0 border-input bg-elevated px-3.5 font-mono text-meta text-muted-foreground">
                +91
              </span>
              <Input
                id="member-phone"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel-national"
                className="rounded-l-none"
                {...form.register('phone')}
              />
            </div>
            {form.formState.errors.phone ? (
              <p className="text-meta text-red-300">{form.formState.errors.phone.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="member-tier">Tier</Label>
            <Select
              value={form.watch('tier')}
              onValueChange={(value) =>
                form.setValue('tier', value as MemberInput['tier'], { shouldValidate: true })
              }
            >
              <SelectTrigger id="member-tier">
                <SelectValue placeholder="Pick a tier" />
              </SelectTrigger>
              <SelectContent>
                {PAID_TIERS.map((tier) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    {tier.name} — {inr(tier.price)} {tier.cadence}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={form.formState.isSubmitting}
            >
              Not now
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Join
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
