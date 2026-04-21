<script lang="ts">
	import { onMount } from "svelte";
	import mermaid from "mermaid";
	import { domToPng } from "modern-screenshot";

	interface Props {
		code: string;
		onError?: (error: string) => void;
		onSuccess?: () => void;
	}

	let { code, onError, onSuccess }: Props = $props();

	let container: HTMLDivElement;
	let renderId = 0;

	onMount(() => {
		mermaid.initialize({
			startOnLoad: false,
			theme: "default",
			securityLevel: "strict",
		});
	});

	$effect(() => {
		const currentCode = code;
		const currentId = ++renderId;

		if (!container || !currentCode.trim()) {
			if (container)
				container.innerHTML =
					'<div class="text-muted-foreground text-sm italic">Start typing to see the preview...</div>';
			return;
		}

		const timeout = setTimeout(async () => {
			if (currentId !== renderId) return;

			try {
				const valid = await mermaid.parse(currentCode);
				if (!valid) throw new Error("Invalid syntax");

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

	export async function downloadPng() {
		if (!container) return;

		const svgEl = container.querySelector("svg");
		if (!svgEl) return;

		const dataUrl = await domToPng(svgEl, {
			scale: 2,
			backgroundColor: "#ffffff",
		});

		const link = document.createElement("a");
		link.download = `mermaid-diagram-${Date.now()}.png`;
		link.href = dataUrl;
		link.click();
	}
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
