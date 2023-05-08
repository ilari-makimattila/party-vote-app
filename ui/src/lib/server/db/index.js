import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';

const db = new Database(DB_PATH, { verbose: console.log });

export function getGame(gameId) {
	const game = db.prepare('SELECT * FROM games WHERE game_id = ?').get(gameId);
	const items = db
		.prepare(
			'SELECT gi.*, giv.user_id, giv.game_item_vote FROM game_items gi LEFT JOIN game_item_votes giv ON gi.game_item_id = giv.game_item_id WHERE gi.game_id = ?'
		)
		.all(gameId);
	return {
		name: game.game_name,
		items: Object.values(
			items.reduce((acc, item) => {
				if (!acc[item.game_item_id]) {
					acc[item.game_item_id] = {
						id: item.game_item_id,
						name: item.game_item_name,
						description: item.game_item_description,
						votes: []
					};
				}
				if (item.user_id !== null && item.game_item_vote !== null) {
					acc[item.game_item_id].votes.push({ userId: item.user_id, vote: item.game_item_vote });
				}
				return acc;
			}, {})
		)
	};
}

export function saveVote(gameItemId, userId, vote) {
	db.prepare(
		'INSERT INTO game_item_votes (game_item_id, user_id, game_item_vote) VALUES (?, ?, ?)'
	).run(gameItemId, userId, vote);
}
