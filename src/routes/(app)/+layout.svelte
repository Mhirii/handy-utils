<script lang="ts">
	import MainSidebar from "$lib/components/main-sidebar.svelte";
	import type { Snippet } from "svelte";
	import type { LayoutData } from "./$types";
	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	console.log("data");
	console.log(data);
</script>

<MainSidebar {data}>
	{@render children()}
</MainSidebar>
