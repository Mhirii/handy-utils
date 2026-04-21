<script lang="ts">
	import { onMount, tick } from "svelte";
	import mermaid from "mermaid";

	interface Props {
		code: string;
		onError?: (error: string) => void;
		onSuccess?: () => void;
	}

	let { code, onError, onSuccess }: Props = $props();

	let container: HTMLDivElement;
	let renderId = 0;

	// Initialize mermaid once
	onMount(() => {
		mermaid.initialize({
			startOnLoad: false,
			theme: "default",
			securityLevel: "strict",
		});
	});

	// Reactive effect to re-render when code changes
	$effect(() => {
		const currentCode = code;
		const currentId = ++renderId;

		if (!container || !currentCode.trim()) {
			container &&
				(container.innerHTML =
					'<div class="text-muted-foreground text-sm italic">Start typing to see the preview...</div>');
			return;
		}

		// Debounce slightly for performance
		const timeout = setTimeout(async () => {
			if (currentId !== renderId) return; // Stale render

			try {
				// Validate syntax first
				const valid = await mermaid.parse(currentCode);
				if (!valid) throw new Error("Invalid syntax");

				// Generate unique ID for this render
				const id = `mermaid-${Date.now()}`;
				const { svg } = await mermaid.render(id, currentCode);

				if (currentId !== renderId) return;

				container.innerHTML = svg;
				onSuccess?.();
			} catch (err) {
				if (currentId !== renderId) return;
				const message =
					err instanceof Error
						? err.message
						: "Failed to render diagram";
				container.innerHTML = `<div class="text-destructive text-sm">Unable to render: ${message}</div>`;
				onError?.(message);
			}
		}, 150);

		return () => clearTimeout(timeout);
	});
</script>

<div
	bind:this={container}
	class="mermaid-preview flex items-center justify-center min-h-[200px]"
>
	<div class="text-muted-foreground text-sm italic">Loading preview...</div>
</div>

<style>
	:global(.mermaid-preview svg) {
		max-width: 100%;
		height: auto;
	}
</style>
