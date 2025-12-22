import { superValidate, message, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema, editUserSchema, type EditUserSchema, type LoginSchema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import { UserRegion, ContactChannel } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const loginForm = (await superValidate(zod(loginSchema as any))) as SuperValidated<LoginSchema>;

	// Initialize Edit User form with default values for EU region
	// This ensures the form starts in a valid initial state for the UI
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const editUserForm = (await superValidate(zod(editUserSchema as any), {
		defaults: {
			email: '',
			displayName: '',
			locale: 'en-US',
			region: UserRegion.EU,
			contact: {
				channel: ContactChannel.Email,
				marketingOptIn: false,
				productUpdatesOptIn: false
			},
			favoriteGames: [],
			eu: {
				gdprConsent: false,
				vatId: '',
				nationalId: ''
			}
		} as EditUserSchema
	})) as SuperValidated<EditUserSchema>;

	return { loginForm, editUserForm };
};

export const actions: Actions = {
	login: async ({ request }) => {
		const form = (await superValidate(
			request,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			zod(loginSchema as any)
		)) as SuperValidated<LoginSchema>;

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		if (email === 'test@test.com' && password === '123321') {
			return message(form, 'Login successful!');
		} else {
			return message(form, 'Invalid credentials', { status: 401 });
		}
	},

	editUser: async ({ request }) => {
		const form = (await superValidate(
			request,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			zod(editUserSchema as any)
		)) as SuperValidated<EditUserSchema>;

		if (!form.valid) {
			return fail(400, { form });
		}

		return message(form, 'User updated successfully!');
	}
};
