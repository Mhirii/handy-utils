<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import SiteHeader from "$lib/components/site-header.svelte";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import { Scrollbar } from "$lib/components/ui/scroll-area";
	let { children } = $props();
</script>

<Sidebar.Provider class="flex flex-col" open={false}>
	<SiteHeader />
	<div class="flex flex-1">
		<AppSidebar />
		<Sidebar.Inset>
			<ScrollArea class="h-full">
				{@render children()}
				<Scrollbar orientation="vertical" />
			</ScrollArea>
		</Sidebar.Inset>
	</div>
</Sidebar.Provider>
