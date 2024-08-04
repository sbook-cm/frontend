import type { PageServerLoad, Actions } from './$types';
import { Session, User } from '$lib/db.js';

export const load: PageServerLoad = async ({ cookies }) => {
  //cookies.set("sessionid", "ken-morel86e7909f", { path: '/' });
  try {
    const session = await Session.fromID(cookies.get('sessionid'));
    return { session: session._data, user: session.user._data };
  } catch(e) {
    return { session: null, user: null };
  }
};

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    try {
      const user = await User.fromLogin(email, password);
      cookies.set('sessionid', await user.createSession().id, { path: '/' });
      return { success: true };
    } catch {
      return { success: false };
    }
  },
} satisfies Actions;

