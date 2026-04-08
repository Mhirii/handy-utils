<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	let { children } = $props();
</script>

<ModeWatcher />
<div class="[--header-height:calc(--spacing(14))]">
	{@render children()}
</div>
