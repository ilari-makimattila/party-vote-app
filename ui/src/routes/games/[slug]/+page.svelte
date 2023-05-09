<script>
	import Statistics from './Statistics.svelte';
	/** @type {import('./$types').PageData} */
	export let data;
	let currentVote;

	$: currentVote =
		currentVote != null ? currentVote : data.currentVote ? data.currentVote.vote : null;
	$: console.log(data.currentItem);
	$: console.log(currentVote);
</script>

<h1>{data.game.name}</h1>

{#if data.user.id}
	{#if data.currentItem}
		<section class="vote">
			<div>
				<h2>{data.currentItem.name}</h2>
				<h3>{data.currentItem.description}</h3>
				<form method="POST" action="?/vote">
					<fieldset>
						{#each data.game.voteOptions as value, valueIdx}
							<label for="v-{valueIdx}">{value.label}</label>
							<input
								type="radio"
								name="vote"
								id="v-{valueIdx}"
								value={value.value}
								bind:group={currentVote}
							/>
						{/each}
					</fieldset>
					{#if data.previous >= 0}
						<a href="?item={data.previous}">Previous</a>
					{/if}
					<button
						type="submit"
						name="item"
						value={data.currentItem.id}
						disabled={currentVote === null}>Next</button
					>
				</form>
			</div>
		</section>
	{:else}
		<a href="?item={data.game.items.length - 1}">Back to votes</a>
	{/if}
	<Statistics gameId={data.game.id} />
{:else}
	<section class="register">
		<form method="POST" action="?/register">
			<label for="name">Who are you?</label>
			<input type="text" name="name" id="name" />
			<button type="submit">Go</button>
		</form>
	</section>
{/if}
