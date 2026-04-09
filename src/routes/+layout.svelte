<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	let { children } = $props();
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { Toaster } from "$lib/components/ui/sonner";
</script>

<Toaster />
<ModeWatcher />
<Tooltip.Provider>
	<div class="[--header-height:calc(--spacing(14))]">
		{@render children()}
	</div>
</Tooltip.Provider>
