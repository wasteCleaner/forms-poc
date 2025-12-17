import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema, editUserSchema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import { AuthMethod, UserRegion, ContactChannel } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const loginForm = await superValidate(zod(loginSchema));

  // Initialize Edit User form with default values for EU region
  // This ensures the form starts in a valid initial state for the UI
  const editUserForm = await superValidate(zod(editUserSchema), {
    defaults: {
      email: '',
      displayName: '',
      locale: 'en-US',
      region: UserRegion.EU,
      contact: {
        channel: ContactChannel.Email,
        marketingOptIn: false,
        productUpdatesOptIn: false,
      },
      favoriteGames: [],
      eu: {
        gdprConsent: false,
        vatId: '',
        nationalId: '',
      },
      // Zod discriminated union types are distinct, but when passing defaults to superValidate
      // for a union, we essentially provide one valid shape.
    } as any // Cast to any because the union type inference for defaults can be tricky, but this matches the EU shape.
  });

  return { loginForm, editUserForm };
};

export const actions: Actions = {
  login: async ({ request }) => {
    const form = await superValidate(request, zod(loginSchema));

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
    const form = await superValidate(request, zod(editUserSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    return message(form, 'User updated successfully!');
  }
};
