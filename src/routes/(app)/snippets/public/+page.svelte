<script lang="ts">
	import ComingSoon from "$lib/components/coming-soon.svelte";
	import { Mail, ArrowRight, Zap } from "@lucide/svelte";
	import { onMount } from "svelte";

	let isVisible = $state(false);

	onMount(() => {
		isVisible = true;
	});
</script>

<ComingSoon
	data={{
		desc: "Something extraordinary is brewing. We're crafting an experience that will transform how you work with snippets.",
		release: "a few weeks",
	}}
/>
