<script lang="ts">
	import "../app.css";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import SiteHeader from "$lib/components/site-header.svelte";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import { ModeWatcher } from "mode-watcher";
	let { children } = $props();
</script>

<ModeWatcher />
<div class="[--header-height:calc(--spacing(14))]">
	<Sidebar.Provider class="flex flex-col" open={false}>
		<SiteHeader />
		<div class="flex flex-1">
			<AppSidebar />
			<Sidebar.Inset>
				{@render children()}
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
