import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const user = await db.getUserFromSession(cookies.get('sessionid'));
  return { user };
};

export const actions = {
  signin: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    const user = await db.getUser(email);
    cookies.set('sessionid', await db.createSession(user), { path: '/' });

    return { success: true };
  },
  signout: async (event) => {
    // TODO register the user
  },
} satisfies Actions;

