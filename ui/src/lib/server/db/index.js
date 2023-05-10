import { createHash, randomBytes } from 'node:crypto';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';

const db = new Database(env.DB_PATH, { verbose: console.log });

export function getGame(gameId) {
	const game = db.prepare('SELECT * FROM games WHERE game_id = ?').get(gameId);
	if (!game) {
		return null;
	}
	const items = db
		.prepare(
			'SELECT gi.*, giv.user_id, giv.game_item_vote FROM game_items gi LEFT JOIN game_item_votes giv ON gi.game_item_id = giv.game_item_id WHERE gi.game_id = ?'
		)
		.all(gameId);
	return {
		id: gameId,
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
	const count = db
		.prepare('SELECT count(*) AS count FROM game_item_votes WHERE game_item_id = ? AND user_id = ?')
		.get(gameItemId, userId);
	if (count.count == 0) {
		db.prepare(
			'INSERT INTO game_item_votes (game_item_id, user_id, game_item_vote) VALUES (?, ?, ?)'
		).run(gameItemId, userId, vote);
	} else {
		db.prepare(
			'UPDATE game_item_votes SET game_item_vote = ? WHERE game_item_id = ? AND user_id = ?'
		).run(vote, gameItemId, userId);
		console.log('votge updated');
	}
}

export function createUser(userName) {
	const userHash = createHash('sha256').update(randomBytes(1024)).update(userName).digest('hex');
	const user = db
		.prepare(
			'INSERT INTO users (user_id, user_name, user_hash) VALUES ((SELECT COALESCE(MAX(user_id), 0) + 1 FROM users), ?, ?) RETURNING user_id AS id, user_name AS name, user_hash AS hash'
		)
		.get(userName, userHash);
	return user;
}

export function getUser(hash) {
	if (!hash) {
		return null;
	}
	const user = db
		.prepare('SELECT user_id AS id, user_name AS name FROM users WHERE user_hash = ?')
		.get(hash);
	return user;
}
