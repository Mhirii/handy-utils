<script lang="ts">
	import type { Component } from "svelte";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import type { SidebarElement } from "$lib/types/sidebar_elements";
	import NavMainElement from "./nav-main-element.svelte";

	let {
		items,
	}: {
		items: SidebarElement[];
	} = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as item (item.title)}
			<NavMainElement {item} />
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
