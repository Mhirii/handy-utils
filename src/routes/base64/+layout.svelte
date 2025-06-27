<script lang="ts">
	let { children } = $props();
</script>

<main class="mx-auto p-4 space-y-6 h-[100vh]">
	{@render children()}
</main>
