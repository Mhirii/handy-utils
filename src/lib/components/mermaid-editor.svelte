<script lang="ts">
	import MermaidPreview, {
		type MermaidPreviewActions,
	} from "./mermaid-preview.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import {
		Alert,
		AlertTitle,
		AlertDescription,
	} from "$lib/components/ui/alert";
	import { Copy, Check, Download, Trash2, RotateCcw } from "@lucide/svelte";
	import { ScrollArea } from "./ui/scroll-area";

	interface Props {
		initialCode?: string;
		onCodeChange?: (code: string) => void;
	}

	let { initialCode = "", onCodeChange }: Props = $props();

	let code = $state(initialCode);
	let error = $state<string | null>(null);
	let previewRef = $state<MermaidPreviewActions | null>(null);
	let isCopied = $state(false);

	$effect(() => {
		onCodeChange?.(code);
	});

	function resetCode() {
		code = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`;
	}

	function clearCode() {
		code = "";
		error = null;
	}

	async function copyCode() {
		if (!code.trim()) return;
		try {
			await navigator.clipboard.writeText(code);
			isCopied = true;
			setTimeout(() => (isCopied = false), 2000);
		} catch {
			console.warn("Clipboard API unavailable");
		}
	}
</script>

<!-- Layout wrapper with proper flex constraints -->
<div class="flex h-full w-full flex-col gap-4 lg:flex-row">
	<!-- Editor Panel -->
	<div class="flex flex-1 flex-col gap-3 min-h-0">
		<div class="flex items-center justify-between">
			<Label for="mermaid-input" class="text-sm font-medium">
				Mermaid Syntax
			</Label>
			<div class="flex gap-2">
				<Button variant="outline" size="sm" onclick={resetCode}>
					<RotateCcw class="mr-1 h-3 w-3" /> Reset
				</Button>
				<Button variant="destructive" size="sm" onclick={clearCode}>
					<Trash2 class="mr-1 h-3 w-3" /> Clear
				</Button>
			</div>
		</div>

		<div class="relative flex-1 min-h-0">
			<ScrollArea class="h-full w-full overflow-auto">
				<!-- Pass layout classes via `class` prop -->
				<Textarea
					id="mermaid-input"
					bind:value={code}
					placeholder="Enter Mermaid code..."
					spellcheck={false}
					class="h-full min-h-[200px] w-full font-mono text-sm resize-none"
				/>
				<Button
					variant="ghost"
					size="icon"
					class="absolute right-2 top-2 h-7 w-7"
					onclick={copyCode}
				>
					{#if isCopied}
						<Check class="h-4 w-4" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</Button>
			</ScrollArea>
		</div>

		{#if error}
			<Alert variant="destructive">
				<AlertTitle>Error</AlertTitle>
				<AlertDescription class="font-mono text-xs"
					>{error}</AlertDescription
				>
			</Alert>
		{/if}
	</div>

	<!-- Preview Panel -->
	<div class="flex flex-1 flex-col gap-3 min-h-0">
		<div class="flex items-center justify-between">
			<span class="text-sm font-medium text-muted-foreground"
				>Preview</span
			>
			<Button
				variant="default"
				size="sm"
				disabled={!code.trim() || !!error}
				onclick={() => previewRef?.downloadPng()}
			>
				<Download class="mr-1 h-3 w-3" /> Download PNG
			</Button>
		</div>

		<div
			class="flex flex-1 items-center justify-center rounded-lg border border-input bg-muted p-4 overflow-auto min-h-0"
		>
			<MermaidPreview
				bind:this={previewRef}
				{code}
				onError={(e) => (error = e)}
				onSuccess={() => (error = null)}
			/>
		</div>
	</div>
</div>
