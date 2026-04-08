<script lang="ts">
	import { onMount } from "svelte";
	import {
		Dialog,
		DialogContent,
		DialogTrigger,
		DialogTitle,
		DialogDescription,
		DialogFooter,
	} from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import {
		ClipboardCopy,
		Undo2,
		Plus,
		Trash2,
		Save,
		RefreshCcw,
		PenIcon,
	} from "@lucide/svelte";

	// Props
	export let cookieString: string = "";
	export let otherCookieMap: Map<string, string> = new Map();
	export let onSave: (cookieString: string) => void = () => {};

	// Internal state
	let open = false;
	let pairs: { key: string; value: string }[] = [];
	let initialPairs: { key: string; value: string }[] = [];
	let history: { key: string; value: string }[][] = [];
	let canUndo = false;
	let copyMsg: Record<string, string> = {};

	// Parse cookie string into pairs
	function parseCookie(str: string): { key: string; value: string }[] {
		return str
			.split(";")
			.map((pair) => pair.trim())
			.filter(Boolean)
			.map((pair) => {
				const [key, ...rest] = pair.split("=");
				return { key, value: rest.join("=") };
			})
			.filter(({ key }) => key.length > 0);
	}

	// Serialize pairs into cookie string
	function serializeCookie(pairs: { key: string; value: string }[]): string {
		return pairs
			.filter(({ key }) => key.trim().length > 0)
			.map(({ key, value }) => `${key}=${value}`)
			.join("; ");
	}

	// Open modal and initialize state
	function openEditor() {
		pairs = parseCookie(cookieString);
		initialPairs = JSON.parse(JSON.stringify(pairs));
		history = [];
		canUndo = false;
		open = true;
	}

	// Save changes
	function save() {
		const str = serializeCookie(pairs);
		onSave(str);
		open = false;
	}

	// Add new row
	function addPair() {
		pushHistory();
		pairs = [...pairs, { key: "", value: "" }];
	}

	// Remove row
	function removePair(idx: number) {
		pushHistory();
		pairs = pairs.filter((_, i) => i !== idx);
	}

	// Edit key/value
	function updatePair(idx: number, field: "key" | "value", val: string) {
		pushHistory();
		pairs = pairs.map((pair, i) =>
			i === idx ? { ...pair, [field]: val } : pair,
		);
	}

	// Undo
	function undo() {
		if (history.length > 0) {
			pairs = history.pop()!;
			canUndo = history.length > 0;
		}
	}

	// Reset to initial
	function reset() {
		pushHistory();
		pairs = JSON.parse(JSON.stringify(initialPairs));
	}

	// Copy value from other cookie
	async function copyFromOther(idx: number, key: string) {
		if (otherCookieMap.has(key)) {
			pushHistory();
			pairs = pairs.map((pair, i) =>
				i === idx
					? { ...pair, value: otherCookieMap.get(key) ?? "" }
					: pair,
			);
			copyMsg[key] = "Copied!";
			setTimeout(() => (copyMsg[key] = ""), 1200);
		}
	}

	// Copy value to clipboard
	async function copyToClipboard(text: string, key: string) {
		try {
			await navigator.clipboard.writeText(text);
			copyMsg[key] = "Copied!";
			setTimeout(() => (copyMsg[key] = ""), 1200);
		} catch {
			copyMsg[key] = "Failed!";
		}
	}

	// Push current state to history for undo
	function pushHistory() {
		history.push(JSON.parse(JSON.stringify(pairs)));
		canUndo = true;
		// Limit history size for memory
		if (history.length > 30) history.shift();
	}
</script>

<Dialog bind:open>
	<DialogTrigger>
		<slot name="trigger">
			<Button variant="ghost" onclick={openEditor}>
				<PenIcon />
			</Button>
		</slot>
	</DialogTrigger>
	<DialogContent
		class="max-w-5xl w-full p-0 rounded-2xl shadow-xl border border-muted bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-card dark:via-muted dark:to-card"
	>
		<form on:submit|preventDefault={save}>
			<div class="p-0 sm:p-8 space-y-7">
				<div
					class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b pb-4 mb-4"
				>
					<DialogTitle
						class="text-2xl font-bold tracking-tight flex-1 text-primary"
						>Edit Cookie</DialogTitle
					>
					<DialogDescription
						class="text-base text-muted-foreground flex-1"
					>
						<span class="block"
							>Edit, add, or remove key-value pairs.</span
						>
						<span class="inline-block mt-1"
							>You can also copy values from the other cookie.</span
						>
					</DialogDescription>
				</div>
				<ScrollArea
					class="max-h-[50vh] overflow-auto rounded-xl border bg-background p-2"
				>
					<div class="flex flex-col gap-2">
						<div
							class="hidden sm:grid grid-cols-[2fr_4fr_auto] gap-2 px-2 pb-1 text-xs font-semibold text-muted-foreground"
						>
							<div>Key</div>
							<div>Value</div>
							<div class="justify-self-end"></div>
						</div>
						{#each pairs as pair, idx}
							<div
								class="grid grid-cols-1 sm:grid-cols-[2fr_4fr_auto] gap-2 items-stretch bg-muted rounded-lg px-2 py-2"
							>
								<Input
									class="w-full font-mono text-[15px] min-w-0"
									style="min-width:0;"
									value={pair.key}
									oninput={(e) =>
										updatePair(idx, "key", e.target.value)}
									placeholder="Key"
								/>
								<div
									class="flex flex-col sm:flex-row gap-2 sm:gap-0 items-stretch sm:items-center w-full min-w-0"
								>
									<Input
										class="w-full font-mono text-[15px] min-w-0"
										style="min-width:0;"
										value={pair.value}
										oninput={(e) =>
											updatePair(
												idx,
												"value",
												e.target.value,
											)}
										placeholder="Value"
									/>
								</div>
								<div
									class="flex flex-row gap-1 items-center justify-end h-full"
								>
									<Button
										type="button"
										variant="outline"
										size="icon"
										title="Copy value"
										onclick={() =>
											copyToClipboard(
												pair.value,
												`val-${idx}`,
											)}
									>
										<ClipboardCopy size={15} />
									</Button>
									{#if otherCookieMap.has(pair.key)}
										<Button
											type="button"
											variant="ghost"
											size="icon"
											title="Copy value from other cookie"
											onclick={() =>
												copyFromOther(idx, pair.key)}
										>
											<ClipboardCopy size={15} />
										</Button>
									{/if}
									<Button
										type="button"
										variant="destructive"
										size="icon"
										title="Remove"
										onclick={() => removePair(idx)}
									>
										<Trash2 size={16} />
									</Button>
								</div>
							</div>
							<div class="flex flex-row gap-2 px-2">
								{#if copyMsg[`val-${idx}`]}
									<span class="text-xs text-green-600"
										>{copyMsg[`val-${idx}`]}</span
									>
								{/if}
								{#if copyMsg[pair.key]}
									<span class="text-xs text-blue-600"
										>{copyMsg[pair.key]}</span
									>
								{/if}
							</div>
						{/each}
					</div>
				</ScrollArea>
				<div class="flex flex-wrap gap-2 pt-2">
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onclick={addPair}
					>
						<Plus size={16} class="mr-1" /> Add Row
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onclick={undo}
						disabled={!canUndo}
						title="Undo"
					>
						<Undo2 size={16} class="mr-1" /> Undo
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onclick={reset}
						title="Reset to original"
					>
						<RefreshCcw size={16} class="mr-1" /> Reset
					</Button>
				</div>
			</div>
			<DialogFooter
				class="flex justify-end gap-2 p-4 border-t bg-muted rounded-b-2xl"
			>
				<Button
					type="button"
					variant="ghost"
					onclick={() => (open = false)}
				>
					Cancel
				</Button>
				<Button type="submit" variant="default">
					<Save size={16} class="mr-1" /> Save
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>

<style>
	th,
	td {
		vertical-align: middle;
	}
	tr.bg-muted {
		background: var(--muted);
	}
	.rounded-xl {
		border-radius: 1rem;
	}
	.rounded-2xl {
		border-radius: 1.25rem;
	}
	.shadow-xl {
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
	}
	.shadow-inner {
		box-shadow: inset 0 2px 8px 0 rgba(0, 0, 0, 0.04);
	}
	.transition {
		transition: background 0.15s;
	}
	.hover\:bg-accent:hover {
		background: var(--accent);
	}
	.bg-muted\/70 {
		background: color-mix(in srgb, var(--muted) 70%, transparent);
	}
	.bg-white\/90 {
		background: color-mix(in srgb, white 90%, transparent);
	}
	.dark\:bg-card\/90 {
		background: color-mix(in srgb, var(--card) 90%, transparent);
	}
	@media (max-width: 640px) {
		.max-w-2xl {
			max-width: 98vw !important;
		}
		.sm\:p-8 {
			padding: 1.25rem !important;
		}
		.overflow-x-auto {
			width: 100%;
			overflow-x: auto;
		}
		table {
			min-width: 420px;
		}
		.flex-row {
			flex-direction: column !important;
			align-items: stretch !important;
			gap: 0.5rem !important;
		}
		.w-1\/3,
		.w-1\/2,
		.w-12,
		.min-w-\[120px\],
		.min-w-\[160px\] {
			width: 100% !important;
			min-width: 0 !important;
		}
		td,
		th {
			padding-left: 0.5rem !important;
			padding-right: 0.5rem !important;
		}
	}
</style>
