import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { profileSchema } from '$lib/schemas';

const initialData = {
	gender: 'male' as const,
	age: 25,
	skills: [
		{ name: 'JavaScript', level: 'professional' as const },
		{ name: 'TypeScript', level: 'experienced' as const }
	]
};

export const load: PageServerLoad = async () => {
	const form = await superValidate(initialData, zod4(profileSchema));
	return {
		form,
		initialData
	};
};

export const actions: Actions = {
	superforms: async ({ request }) => {
		const form = await superValidate(request, zod4(profileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log('[Superforms] Profile submitted:', form.data);
		return { form, success: true };
	},

	tanstack: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			gender: formData.get('gender') as string,
			age: Number(formData.get('age')),
			skills: JSON.parse(formData.get('skills') as string || '[]')
		};

		const result = profileSchema.safeParse(data);

		if (!result.success) {
			return fail(400, {
				tanstackErrors: result.error.flatten().fieldErrors,
				tanstackData: data
			});
		}

		console.log('[TanStack Form] Profile submitted:', result.data);
		return { tanstackSuccess: true };
	}
};
