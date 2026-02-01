import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schemas';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(loginSchema));
	return { form };
};

export const actions: Actions = {
	superforms: async ({ request }) => {
		const form = await superValidate(request, zod4(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log('[Superforms] Login submitted:', form.data);
		return { form, success: true };
	},

	felte: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			email: formData.get('email') as string,
			password: formData.get('password') as string
		};

		const result = loginSchema.safeParse(data);

		if (!result.success) {
			return fail(400, {
				felteErrors: result.error.flatten().fieldErrors,
				felteData: data
			});
		}

		console.log('[Felte] Login submitted:', result.data);
		return { felteSuccess: true };
	}
};
