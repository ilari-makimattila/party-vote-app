import { json, error } from '@sveltejs/kit';
import { getGame, getUser } from '$lib/server/db';

const voteOptions = [
	{
		label: 'Hate It!',
		value: -2
	},
	{
		label: 'meh...',
		value: -1
	},
	{
		label: "It's OK!",
		value: 1
	},
	{
		label: 'Love It!',
		value: 2
	}
];

export async function getGameData(user, gameId, currentIdx) {
	const game = getGame(gameId);
	if (!game) {
		throw error(404, {
			message: 'Game not found'
		});
	}
	let currentVote = null;
	game.voteOptions = voteOptions;
	let currentItem = null;
	if (user) {
		currentIdx =
			currentIdx !== null
				? Number(currentIdx)
				: game.items.findIndex(
						(item) => !item.votes || !item.votes.find((vote) => vote.userId === user.id)
				  );
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
	if (user) {
		return json(await getGameData(user, params.slug, currentIdx));
	}
}
