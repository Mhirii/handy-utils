<script lang="ts">
	import MainSidebar from "$lib/components/main-sidebar.svelte";
	let { children } = $props();
</script>

<MainSidebar>
	{@render children()}
</MainSidebar>
