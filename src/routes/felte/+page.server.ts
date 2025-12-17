import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  login: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    // Simulate backend validation
    if (email === 'test@test.com' && password === '123321') {
       return { success: true };
    }
    return fail(401, { error: 'Invalid credentials', email });
  },

  editUser: async () => {
     // Simulate success
     return { success: true };
  }
};
