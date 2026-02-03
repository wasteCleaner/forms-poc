import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail, message, type SuperValidated } from 'sveltekit-superforms';
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
	const form = (await superValidate(initialData, zod(profileSchema as any))) as SuperValidated<ProfileData>;
	return {
		form,
		initialData
	};
};

export const actions: Actions = {
	superforms: async ({ request }) => {
		const form = (await superValidate(request, zod(profileSchema as any))) as SuperValidated<ProfileData>;

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log('[Superforms] Profile submitted:', form.data);
		return message(form, 'Profile saved');
	},

	felte: async ({ request }) => {
		const formData = await request.formData();
		const data: any = {
			gender: formData.get('gender'),
			age: formData.get('age'), // zod coerce will handle number conversion
			skills: []
		};

		const skillsMap = new Map<number, any>();

		for (const [key, value] of formData.entries()) {
			const match = key.match(/^skills\[(\d+)\]\.(name|level)$/);
			if (match) {
				const index = parseInt(match[1]);
				const field = match[2];
				if (!skillsMap.has(index)) {
					skillsMap.set(index, {});
				}
				skillsMap.get(index)[field] = value;
			}
		}

		// Convert map to array, sorted by index
		const sortedIndices = Array.from(skillsMap.keys()).sort((a, b) => a - b);
		data.skills = sortedIndices.map((i) => skillsMap.get(i));

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
