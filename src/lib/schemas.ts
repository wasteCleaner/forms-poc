import { z } from 'zod';
import { AuthMethod, UserRegion, ContactChannel, USState } from './types';

// Login Schema - focused on Password method as requested
export const loginSchema = z.object({
  method: z.literal(AuthMethod.Password),
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

// Edit User Schema
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');

const addressSchema = z.object({
  line1: z.string().min(1, 'Line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal Code is required'),
  country: z.string().min(2, 'Country code must be at least 2 chars'),
});

const contactSchema = z.object({
  channel: z.nativeEnum(ContactChannel),
  marketingOptIn: z.boolean(),
  productUpdatesOptIn: z.boolean(),
});

const favoriteGameSchema = z.object({
  id: z.string().min(1, 'Game ID is required'),
  favoriteSince: isoDateSchema.optional().or(z.literal('')),
  pinned: z.boolean().optional(),
});

const baseFields = {
  email: z.string().email(),
  displayName: z.string().min(1, 'Display Name is required'),
  locale: z.string().min(2, 'Locale must be at least 2 chars'),
  contact: contactSchema,
  favoriteGames: z.array(favoriteGameSchema).default([]),
  address: addressSchema.optional(),
};

const euFields = z.object({
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'GDPR consent is required for EU users',
  }),
  vatId: z.string().optional(),
  nationalId: z.string().optional(),
});

const usFields = z.object({
  state: z.nativeEnum(USState),
  zipPlus4: z.string().optional(),
  ssnLast4: z.string().optional(),
  taxResidencyConfirmed: z.boolean(),
});

const ukFields = z.object({
  county: z.string().optional(),
  postcode: z.string().min(1, 'Postcode is required'),
  ninLast4: z.string().optional(),
});

const otherFields = z.object({
  notes: z.string().optional(),
  timezone: z.string().optional(),
});

export const editUserSchema = z.discriminatedUnion('region', [
  z.object({ region: z.literal(UserRegion.EU), eu: euFields, ...baseFields }),
  z.object({ region: z.literal(UserRegion.US), us: usFields, ...baseFields }),
  z.object({ region: z.literal(UserRegion.UK), uk: ukFields, ...baseFields }),
  z.object({ region: z.literal(UserRegion.Other), other: otherFields, ...baseFields }),
]);

export type EditUserSchema = z.infer<typeof editUserSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
