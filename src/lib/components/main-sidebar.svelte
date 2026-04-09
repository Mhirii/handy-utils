<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import SiteHeader from "$lib/components/site-header.svelte";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import { Scrollbar } from "$lib/components/ui/scroll-area";
	import type { SidebarElement } from "$lib/types/sidebar_elements";
	import type { Snippet } from "svelte";
	import type { UserPromise } from "$lib/types/user";
	let {
		children,
		data,
	}: {
		children: Snippet;
		data: { navElements: SidebarElement[]; user?: UserPromise };
	} = $props();
</script>

<Sidebar.Provider class="flex flex-col" open={false}>
	<SiteHeader user={data.user} />
	<div class="flex flex-1">
		<AppSidebar elements={data.navElements} user={data.user} />
		<Sidebar.Inset>
			<ScrollArea class="h-full">
				{@render children()}
				<Scrollbar orientation="vertical" />
			</ScrollArea>
		</Sidebar.Inset>
	</div>
</Sidebar.Provider>
