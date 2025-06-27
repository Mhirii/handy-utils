<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
	} from "$lib/components/ui/card";
	import { ClipboardPaste, ClipboardCopy, Download } from "@lucide/svelte";
	import { Textarea } from "$lib/components/ui/textarea";
	import type { Writable } from "svelte/store";

	let {
		title,
		desc,
		readonly,
		textAreaPlaceholder,
		value,
	}: {
		title: string;
		desc: string;
		readonly: boolean;
		value: Writable<string>;
		textAreaPlaceholder: string;
	} = $props();

	let val = $state("");
	value.subscribe((v) => (val = v));

	async function pasteFromClipboard() {
		try {
			const v = await navigator.clipboard.readText();
			value.update((oldVal) => (oldVal = v));
			val = v;
		} catch (err) {
			console.error("Failed to read clipboard:", err);
		}
	}
	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}
	async function downloadFile(output: string) {
		const blob = new Blob([output], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "output.txt";
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<Card class="">
	<CardHeader class="flex flex-row items-center justify-between">
		<div>
			<CardTitle>{title}</CardTitle>
			<CardDescription>
				{desc}
			</CardDescription>
		</div>
		<div class="flex gap-2">
			{#if readonly}
				<Button
					variant="ghost"
					size="icon"
					onclick={() => copyToClipboard(val)}
					title="Copy to clipboard"
				>
					<ClipboardCopy />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onclick={() => downloadFile(val)}
					title="Download file"
				>
					<Download />
				</Button>
			{:else}
				<Button
					variant="ghost"
					size="icon"
					onclick={pasteFromClipboard}
					title="Paste from clipboard"
				>
					<ClipboardPaste />
				</Button>
			{/if}
		</div>
	</CardHeader>
	<CardContent class="h-full">
		{#if readonly}
			<Textarea
				bind:value={val}
				{readonly}
				placeholder={textAreaPlaceholder}
				class="min-h-[200px] h-full"
			/>
		{:else}
			<Textarea
				oninput={(e) => {
					//@ts-ignore
					value.update((v) => (v = e?.target?.value || ""));
				}}
				bind:value={val}
				placeholder={textAreaPlaceholder}
				class="min-h-[200px] h-full"
			/>
		{/if}
	</CardContent>
</Card>
