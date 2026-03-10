import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Invalid email'),
	password: z.string().min(8, 'Min 8 characters')
});

export const skillSchema = z.object({
	name: z.string().min(1, 'Required'),
	level: z.enum(['beginner', 'experienced', 'professional', 'expert'])
});

export const profileSchema = z.object({
	gender: z.enum(['male', 'female', 'other']),
	age: z.number().min(0).max(120),
	skills: z.array(skillSchema)
});

export const wizardSchema = z.object({
	firstName: z.string().min(1, 'Required'),
	lastName: z.string().min(1, 'Required'),
	email: z.string().email('Invalid email'),
	zipCode: z.string().min(1, 'Required'),
	country: z.string().min(1, 'Required'),
	street: z.string().min(1, 'Required'),
	homeNumber: z.string().min(1, 'Required'),
	iban: z.string().min(1, 'Required'),
	bic: z.string().min(1, 'Required')
});

// Types inferred from schemas
export type LoginData = z.infer<typeof loginSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type WizardData = z.infer<typeof wizardSchema>;
