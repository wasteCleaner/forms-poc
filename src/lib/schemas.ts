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

// Types inferred from schemas
export type LoginData = z.infer<typeof loginSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
