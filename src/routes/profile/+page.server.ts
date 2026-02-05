import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { profileSchema, type ProfileData } from '$lib/schemas';

const initialData = {
	gender: 'male' as const,
	age: 25,
	skills: [
		{ name: 'JavaScript', level: 'professional' as const },
		{ name: 'TypeScript', level: 'experienced' as const }
	]
};

export const load: PageServerLoad = async () => {
	const form = await superValidate(initialData, zod(profileSchema as any) as any) as unknown as import('sveltekit-superforms').SuperValidated<ProfileData>;
	return {
		form,
		initialData
	};
};

export const actions: Actions = {
	superforms: async ({ request }) => {
		const form = await superValidate(request, zod(profileSchema as any) as any) as unknown as import('sveltekit-superforms').SuperValidated<ProfileData>;

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log('[Superforms] Profile submitted:', form.data);
		return { form, success: true };
	},

	felte: async ({ request }) => {
		const formData = await request.formData();
		const json = formData.get('__felte_data__') as string;

		if (!json) {
			return fail(400, { felteErrors: { _: ['Invalid form data'] } });
		}

		const data = JSON.parse(json);
		const result = profileSchema.safeParse(data);

		if (!result.success) {
			return fail(400, {
				felteErrors: result.error.flatten().fieldErrors,
				felteData: data
			});
		}

		console.log('[Felte] Profile submitted:', result.data);
		return { felteSuccess: true };
	}
};
