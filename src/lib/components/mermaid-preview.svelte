<script lang="ts">
	import { onMount } from "svelte";
	import mermaid from "mermaid";
	import { domToPng } from "modern-screenshot";
	import ScrollArea from "./ui/scroll-area/scroll-area.svelte";

	export interface MermaidPreviewActions {
		downloadPng: () => Promise<void>;
	}

	interface Props {
		code: string;
		onError?: (error: string) => void;
		onSuccess?: () => void;
	}

	let { code, onError, onSuccess }: Props = $props();

	let container: HTMLDivElement;
	let svgContent = $state<string | null>(null);
	let errorMessage = $state<string | null>(null);
	let isLoading = $state(false);
	let renderCounter = 0;

	onMount(() => {
		mermaid.initialize({
			startOnLoad: false,
			theme: "default",
			securityLevel: "strict",
			fontFamily: "inherit",
			logLevel: "error",
		});
	});

	$effect(() => {
		const trimmed = code?.trim();
		if (!trimmed) {
			svgContent = null;
			errorMessage = null;
			isLoading = false;
			return;
		}

		const currentId = ++renderCounter;
		isLoading = true;

		const timeoutId = setTimeout(async () => {
			if (currentId !== renderCounter) return;

			try {
				await mermaid.parse(trimmed);
				const id = `mermaid-${crypto.randomUUID()}`;
				const { svg } = await mermaid.render(id, trimmed);

				if (currentId !== renderCounter) return;

				svgContent = svg;
				errorMessage = null;
				onSuccess?.();
			} catch (err) {
				if (currentId !== renderCounter) return;
				const message =
					err instanceof Error
						? err.message
						: "Unknown rendering error";
				errorMessage = message;
				svgContent = null;
				onError?.(message);
			} finally {
				if (currentId === renderCounter) isLoading = false;
			}
		}, 150);

		return () => clearTimeout(timeoutId);
	});

	async function downloadPng() {
		if (!container || !svgContent) return;
		const svgEl = container.querySelector("svg");
		if (!svgEl) {
			onError?.("SVG element not found in container");
			return;
		}

		try {
			const dataUrl = await domToPng(svgEl, {
				scale: 2,
				backgroundColor: "#ffffff",
				quality: 1.0,
			});
			const link = document.createElement("a");
			link.download = `mermaid-diagram-${Date.now()}.png`;
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error("PNG generation failed:", err);
			onError?.("Failed to generate PNG. Check console for details.");
		}
	}

	export { downloadPng };
</script>

<div
	bind:this={container}
	class="relative flex min-h-[200px] items-center justify-center h-full w-full"
	role="img"
	aria-label="Mermaid diagram preview"
>
	<ScrollArea class="w-full overflow-auto p-2 h-full">
		{#if isLoading}
			<div class="flex flex-col items-center gap-2">
				<div
					class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
				/>
				<span class="text-xs text-muted-foreground">Rendering...</span>
			</div>
		{:else if svgContent}
			<div class="w-full overflow-auto p-2 h-full">
				{@html svgContent}
			</div>
		{:else if errorMessage}
			<div class="flex flex-col items-center gap-1 text-center p-4">
				<span class="text-destructive font-medium"
					>Unable to render</span
				>
				<span class="text-xs text-muted-foreground">{errorMessage}</span
				>
			</div>
		{:else}
			<div class="text-muted-foreground text-sm italic">
				Start typing Mermaid syntax to see preview...
			</div>
		{/if}
	</ScrollArea>
</div>

<style>
	:global([role="img"] svg) {
		max-width: 100%;
		height: auto;
		display: block;
	}
</style>
