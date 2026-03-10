import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { wizardSchema } from '$lib/schemas';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(wizardSchema));
	return { form };
};

export const actions: Actions = {
	superforms: async ({ request }) => {
		const form = await superValidate(request, zod4(wizardSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log('[Superforms] Wizard submitted:', form.data);
		return { form, success: true };
	},

	tanstack: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			firstName: formData.get('firstName') as string,
			lastName: formData.get('lastName') as string,
			email: formData.get('email') as string,
			zipCode: formData.get('zipCode') as string,
			country: formData.get('country') as string,
			street: formData.get('street') as string,
			homeNumber: formData.get('homeNumber') as string,
			iban: formData.get('iban') as string,
			bic: formData.get('bic') as string
		};

		const result = wizardSchema.safeParse(data);

		if (!result.success) {
			return fail(400, {
				tanstackErrors: result.error.flatten().fieldErrors,
				tanstackData: data
			});
		}

		console.log('[TanStack Form] Wizard submitted:', result.data);
		return { tanstackSuccess: true };
	}
};
