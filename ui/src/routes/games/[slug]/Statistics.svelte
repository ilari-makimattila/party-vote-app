<script>
	import { onMount } from 'svelte';

	export let gameId;
	let poller;
	let items = [];

	const pollStats = async (gameId) => {
		if (!gameId) {
			items = [];
		} else {
			const response = await fetch(`/games/${gameId}`);
			const data = await response.json();

			console.log(data.game);
			items = [...data.game.items].sort(
				(a, b) =>
					b.votes.reduce((acc, i) => acc + i.vote, 0) - a.votes.reduce((acc, i) => acc + i.vote, 0)
			);
		}
		poller = setTimeout(() => pollStats(gameId), 2000);
	};
	onMount(async () => {
		if (!poller) {
			await pollStats(gameId);
		}
	});
</script>

<section class="statistics">
	<h2>Statistics</h2>
	<ul>
		{#each items as item}
			{#if item.votes.length > 0}
				<li>
					{item.name}
					{JSON.stringify(item.votes)}
					{item.votes.reduce((acc, i) => acc + i.vote, 0) / item.votes.length}
				</li>
			{/if}
		{/each}
	</ul>
</section>
