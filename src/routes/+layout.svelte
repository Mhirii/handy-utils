<script lang="ts">
	import "../app.css";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import SiteHeader from "$lib/components/site-header.svelte";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import { ModeWatcher } from "mode-watcher";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import { Scrollbar } from "$lib/components/ui/scroll-area";
	let { children } = $props();
</script>

<ModeWatcher />
<div class="[--header-height:calc(--spacing(14))]">
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
</div>
