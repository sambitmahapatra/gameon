import { z } from 'zod';

/** Indian mobile number, with or without the +91 prefix the form adds. */
const phone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ''))
  .refine((value) => /^(\+91)?[6-9]\d{9}$/.test(value), {
    message: 'Enter a 10-digit Indian mobile number',
  })
  .transform((value) => (value.startsWith('+91') ? value : `+91${value}`));

export const bookingInputSchema = z.object({
  zoneId: z.string().min(1, 'Pick a zone'),
  slotId: z.coerce.number().int().positive('Pick a time'),
  name: z
    .string()
    .trim()
    .min(2, 'Tell us your name')
    .max(60, 'That name is too long for the counter screen'),
  phone,
  email: z
    .string()
    .trim()
    .email('That email does not look right')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  partySize: z.coerce.number().int().min(1).max(10),
});

export type BookingInput = z.infer<typeof bookingInputSchema>;

/** Step 3 of the wizard: the fields the person types, validated client-side. */
export const detailsSchema = z.object({
  name: bookingInputSchema.shape.name,
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a 10-digit mobile number'),
  email: bookingInputSchema.shape.email,
  partySize: z.coerce.number().int().min(1).max(10),
});

export type DetailsInput = z.infer<typeof detailsSchema>;

export const memberInputSchema = z.object({
  name: z.string().trim().min(2, 'Tell us your name').max(60),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a 10-digit mobile number'),
  tier: z.enum(['bronze', 'silver', 'gold']),
});

export type MemberInput = z.infer<typeof memberInputSchema>;

export const dateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');
