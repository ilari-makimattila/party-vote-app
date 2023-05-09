<script>
	import { onMount } from 'svelte';

	export let gameId;
	let poller;
	let items = [];
	let voteCount = 0;
	let mostLoved;
	let mostLovedVotes = 0;
	let mostHated;
	let mostHatedVotes = 0;
	let max = 0;

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
			max = items[0].votes.reduce((acc, i) => acc + i.vote, 0);
			voteCount = items.reduce((a, i) => a + i.votes.length, 0);
			for (const item of items) {
				const loves = item.votes.filter((v) => v.vote == 2).length;
				const hates = item.votes.filter((v) => v.vote == -2).length;
				if (loves > mostLovedVotes) {
					mostLovedVotes = loves;
					mostLoved = item;
				}
				if (hates > mostHatedVotes) {
					mostHatedVotes = hates;
					mostHated = item;
				}
			}
		}
		poller = setTimeout(() => pollStats(gameId), 2000);
	};
	onMount(async () => {
		if (!poller) {
			await pollStats(gameId);
		}
	});
</script>

<section
	class="block m-2 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
>
	<h2 class="text-xl">Statistics</h2>
	{#if mostLoved}
		<h3>
			<span>Most loved:</span> <span>{mostLoved.name}</span> <span>({mostLovedVotes} loves)</span>
		</h3>
	{/if}
	{#if mostHated}
		<h3>
			<span>Most hated:</span> <span>{mostHated.name}</span> <span>({mostHatedVotes} hates)</span>
		</h3>
	{/if}
	<ul>
		{#each items as item}
			{#if item.votes.length > 0}
				<li>
					<div class="flex flex-row">
						<span class="basis-4/5">{item.name}</span>
						<span class="basis-1/5 text-right"
							>{(item.votes.reduce((acc, i) => acc + i.vote, 0) / item.votes.length).toFixed(
								2
							)}</span
						>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
						{#if item.votes.reduce((acc, i) => acc + i.vote, 0) / max > 0}
							<div
								class="bg-blue-600 h-2.5 rounded-full"
								style="margin-left: 50%; width: {((item.votes.reduce((acc, i) => acc + i.vote, 0) /
									max) *
									100) /
									2}%"
							/>
						{:else}
							<div
								class="bg-red-600 h-2.5 rounded-full rotate-180 origin-left"
								style="margin-left: 50%; width: {50 +
									((item.votes.reduce((acc, i) => acc + i.vote, 0) / max) * 100) / 2}%"
							/>
						{/if}
					</div>
				</li>
			{/if}
		{/each}
	</ul>
</section>
