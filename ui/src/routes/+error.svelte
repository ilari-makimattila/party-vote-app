<script>
	import { page } from '$app/stores';
</script>

<div class="m-auto mt-10">
	<h1 class="text-5xl text-red-800 font-extrabold text-center">{$page.status}</h1>
	<h3 class="text-3xl text-center">{$page.error.message}</h3>
</div>
