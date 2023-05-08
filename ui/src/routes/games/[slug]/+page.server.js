import { redirect } from '@sveltejs/kit';
import { getGame, saveVote, createUser, getUser } from '$lib/server/db';

const voteOptions = [
	{
		label: 'Hate It!',
		value: 0
	},
	{
		label: 'meh...',
		value: 2
	},
	{
		label: 'Love It!',
		value: 5
	}
];

/** @type {import('./$types').PageServerLoad} */
export function load(evt) {
	const params = evt.params;
	const game = getGame(params.slug);
	game.voteOptions = voteOptions;
	console.log(game);

	const user = getUser(evt.cookies.get('auth'));

	let currentItem = null;
	if (user) {
		const currentIdx = game.items.findIndex(
			(item) => !item.votes || !item.votes.find((vote) => vote.userId === user.id)
		);
		currentItem = game.items[currentIdx];
	}
	console.log('server data', { game, items: game.items, user, currentItem });
	return { game, user, currentItem };
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
			maxAge: 60 * 60 * 24 * 360 * 10
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
