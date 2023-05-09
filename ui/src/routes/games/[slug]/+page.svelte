<script>
	import Statistics from './Statistics.svelte';
	/** @type {import('./$types').PageData} */
	export let data;
	let currentVote;

	$: currentVote =
		currentVote != null ? currentVote : data.currentVote ? data.currentVote.vote : null;
</script>

<h1 class="text-xl text-center">{data.game.name}</h1>

{#if data.user && data.user.id}
	{#if data.currentItem}
		<section
			class="block m-2 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
		>
			<div>
				<div class="shadow rounded my-4 p-1 text-center">
					<h2 class="text-3xl">{data.currentItem.name}</h2>
					<h3 class="text-2xl">{data.currentItem.description}</h3>
				</div>
				<form method="POST" action="?/vote">
					<fieldset>
						<ul
							class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						>
							{#each data.game.voteOptions as value, valueIdx}
								<li
									class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
								>
									<div class="flex items-center pl-3">
										<input
											type="radio"
											class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
											name="vote"
											id="v-{valueIdx}"
											value={value.value}
											bind:group={currentVote}
										/>
										<label
											for="v-{valueIdx}"
											class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
											>{value.label}</label
										>
									</div>
								</li>
							{/each}
						</ul>
					</fieldset>

					<div class="flex flex-row items-justify-between pt-2 mt-2">
						{#if data.previous >= 0}
							<a
								href="?item={data.previous}"
								class="basis-1/2 py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
								>Previous</a
							>
						{/if}
						<button
							type="submit"
							name="item"
							class="basis-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
							value={data.currentItem.id}
							disabled={currentVote === null}>Next</button
						>
					</div>
				</form>
			</div>
		</section>
	{:else}
		<a href="?item={data.game.items.length - 1}">Back to votes</a>
	{/if}
	<Statistics gameId={data.game.id} />
{:else}
	<section
		class="block m-2 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
	>
		<form method="POST" action="?/register">
			<label for="name" class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Who are you?</label
			>
			<input
				type="text"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				name="name"
				id="name"
			/>
			<button
				type="submit"
				class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
				>Go</button
			>
		</form>
	</section>
{/if}
