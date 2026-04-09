<script lang="ts">
	import MainSidebar from "$lib/components/main-sidebar.svelte";
	import type { Snippet } from "svelte";
	import type { LayoutData } from "./$types";
	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<MainSidebar data={{ navElements: data.navElements, user: data.userPromise }}>
	{@render children()}
</MainSidebar>
