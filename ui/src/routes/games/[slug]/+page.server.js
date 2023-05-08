import { getGame } from '$lib/server/db';
import { saveVote } from '../../../lib/server/db';

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

	const user = {
		id: 1
	};

	const currentIdx = game.items.findIndex(
		(item) => !item.votes || !item.votes.find((vote) => vote.userId === user.id)
	);
	const currentItem = game.items[currentIdx];

	console.log('server data', { game, items: game.items, user, currentItem });
	return { game, user, currentItem };
}

/** @type {import('./$types').Actions} */
export const actions = {
	vote: async (evt) => {
		const data = await evt.request.formData();
		const itemId = data.get('item');
		const vote = data.get('vote');

		console.log('vote', { itemId, vote });
		saveVote(itemId, 1, vote);
	}
};
