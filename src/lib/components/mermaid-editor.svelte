<script lang="ts">
	import MermaidPreview from "./mermaid-preview.svelte";

	let code = $state(`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`);

	let error = $state<string | null>(null);
	let previewRef = $state<ReturnType<typeof MermaidPreview> | null>(null);
</script>

{#snippet editorPanel()}
	<div class="flex flex-col h-full">
		<div class="flex items-center justify-between mb-2">
			<label
				for="mermaid-input"
				class="text-sm font-medium text-muted-foreground"
			>
				Mermaid Code
			</label>
			<div class="flex gap-2">
				<button
					class="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
					onclick={() => {
						code = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`;
					}}
				>
					Reset Example
				</button>
				<button
					class="px-3 py-1 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors"
					onclick={() => (code = "")}
				>
					Clear
				</button>
			</div>
		</div>
		<textarea
			id="mermaid-input"
			class="flex-1 w-full p-4 font-mono text-sm bg-muted rounded-lg border border-input resize-none focus:outline-none focus:ring-2 focus:ring-ring"
			spellcheck="false"
			bind:value={code}
		/>
		{#if error}
			<div
				class="mt-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20"
			>
				<strong>Error:</strong>
				{error}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet previewPanel()}
	<div class="flex flex-col h-full">
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-medium text-muted-foreground"
				>Preview</span
			>
			<button
				class="px-3 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={!!error || !code.trim()}
				onclick={() => previewRef?.downloadPng()}
			>
				Download PNG
			</button>
		</div>
		<div
			class="flex-1 bg-muted rounded-lg border border-input p-4 overflow-auto"
		>
			<MermaidPreview
				bind:this={previewRef}
				{code}
				onError={(e) => (error = e)}
				onSuccess={() => (error = null)}
			/>
		</div>
	</div>
{/snippet}

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
	{@render editorPanel()}
	{@render previewPanel()}
</div>
