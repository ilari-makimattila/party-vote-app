<script>
	/** @type {import('./$types').PageData} */
	export let data;
	export let game = data.game;
	export let currentItem = data.currentItem;
	export let currentVote = null;

	console.log(game.items);
</script>

<h1>{game.name}</h1>

<section class="vote">
	<div>
		<h2>{currentItem.name}</h2>
		<h3>{currentItem.description}</h3>
		<form method="POST" action="?/vote">
			<fieldset>
				{#each game.voteOptions as value, valueIdx}
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
			<button type="submit" name="item" value={currentItem.id} disabled={currentVote === null}
				>Next</button
			>
			<!--button type="button" on:click={saveVote} disabled={currentVote === null}>Next</button-->
		</form>
	</div>
</section>
