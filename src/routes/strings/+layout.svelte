<script lang="ts">
	let { children } = $props();
</script>

<main class=" p-4 space-y-6 h-[calc(100vh-var(--header-height)-4rem)]">
	{@render children()}
</main>
