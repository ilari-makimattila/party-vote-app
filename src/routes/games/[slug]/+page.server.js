import { redirect } from '@sveltejs/kit';
import { saveVote, createUser, getUser } from '$lib/server/db';
import { getGameData } from './+server';

/** @type {import('./$types').PageServerLoad} */
export function load(evt) {
	const params = evt.params;
	const currentIdx = evt.url.searchParams.get('item');
	const user = getUser(evt.cookies.get('auth'));
	return getGameData(user, params.slug, currentIdx);
}

/** @type {import('./$types').Actions} */
export const actions = {
	register: async (evt) => {
		const data = await evt.request.formData();
		const name = data.get('name');
		console.log(data, name);
		const user = createUser(name);
		console.log(user);
		evt.cookies.set('auth', user.hash, {
			path: '/',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 360 * 10,
			secure: false
		});
		throw redirect(303, evt.url.pathname);
	},
	vote: async (evt) => {
		const user = getUser(evt.cookies.get('auth'));
		if (user) {
			const data = await evt.request.formData();
			const itemId = data.get('item');
			const vote = data.get('vote');

			console.log('vote', { itemId, vote });
			saveVote(itemId, user.id, vote);
			throw redirect(303, evt.url.pathname);
		}
	}
};
