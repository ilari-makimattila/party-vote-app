import { json } from '@sveltejs/kit';
import { getGame, getUser } from '$lib/server/db';

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

export async function getGameData(user, gameId, currentIdx) {
	const game = getGame(gameId);
	let currentVote = null;
	game.voteOptions = voteOptions;
	let currentItem = null;
	if (user) {
		console.log('Current idx', currentIdx);
		console.log(game.items);
		currentIdx =
			currentIdx !== null
				? Number(currentIdx)
				: game.items.findIndex(
						(item) => !item.votes || !item.votes.find((vote) => vote.userId === user.id)
				  );
		console.log('Current idx', currentIdx);
		currentItem = game.items[currentIdx];
		if (currentItem) {
			currentVote = currentItem.votes.find((vote) => vote.userId === user.id);
		}
	}
	return { game, user, currentItem, previous: Math.max(0, currentIdx - 1), currentVote };
}

/** @type {import('./$types').RequestHandler} */
export async function GET(evt) {
	const params = evt.params;
	const currentIdx = evt.url.searchParams.get('item');
	const user = getUser(evt.cookies.get('auth'));
	return json(await getGameData(user, params.slug, currentIdx));
}
