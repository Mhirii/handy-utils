<!-- when use clicks on the key cell of "keys present in both cookies, a modal will open, with this component inside it, this component should present the value from the frist cookie in the left side and the value from the second cookie on the right side"  -->

<script lang="ts">
export let firstCookieValue: string;
export let secondCookieValue: string;
export let key: string;

import { ClipboardCopy } from "@lucide/svelte";
import { Button } from "$lib/components/ui/button";

let copyMsgKey = "";
let copyMsgFirst = "";
let copyMsgSecond = "";

async function copyToClipboard(
	text: string,
	which: "key" | "first" | "second",
) {
	try {
		await navigator.clipboard.writeText(text);
		if (which === "key") {
			copyMsgKey = "Copied!";
			setTimeout(() => (copyMsgKey = ""), 1200);
		} else if (which === "first") {
			copyMsgFirst = "Copied!";
			setTimeout(() => (copyMsgFirst = ""), 1200);
		} else if (which === "second") {
			copyMsgSecond = "Copied!";
			setTimeout(() => (copyMsgSecond = ""), 1200);
		}
	} catch (err) {
		console.error(err);
		if (which === "key") copyMsgKey = "Failed!";
		if (which === "first") copyMsgFirst = "Failed!";
		if (which === "second") copyMsgSecond = "Failed!";
	}
}
</script>

<div class="w-full p-0 sm:p-6 space-y-8 max-h-[80vh] overflow-y-auto">
	<div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b pb-4 mb-4">
		<div class="flex-1 text-xl font-bold tracking-tight flex items-center gap-2">
			<span class="opacity-70 text-base font-normal">Comparing key:</span>
			<span class="font-mono px-2 py-1 rounded bg-muted border text-base sm:text-lg">{key}</span>
		</div>
		<Button
			variant="outline"
			size="sm"
			class="flex items-center gap-1"
			on:click={() => copyToClipboard(key, "key")}
			title="Copy key"
		>
			<ClipboardCopy size={16} />
			<span class="hidden sm:inline">Copy key</span>
		</Button>
		{#if copyMsgKey}
			<span class="text-xs text-green-600 ml-2">{copyMsgKey}</span>
		{/if}
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="flex flex-col gap-3">
			<div class="flex items-center gap-2 justify-between">
				<div class="text-sm font-semibold text-muted-foreground tracking-wide">
					First Cookie Value
				</div>
				<Button
					variant="ghost"
					size="icon"
					onclick={() => copyToClipboard(firstCookieValue, "first")}
					title="Copy first value"
					class="hover:bg-green-100"
				>
					<ClipboardCopy size={16} />
				</Button>
				{#if copyMsgFirst}
					<span class="text-xs text-green-600">{copyMsgFirst}</span>
				{/if}
			</div>
			<div class="rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-card dark:to-muted p-4 min-h-[64px] shadow-sm">
				<pre class="whitespace-pre-wrap break-words text-sm font-mono text-gray-800 dark:text-gray-100">{firstCookieValue}</pre>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<div class="flex items-center gap-2 justify-between">
				<div class="text-sm font-semibold text-muted-foreground tracking-wide">
					Second Cookie Value
				</div>
				<Button
					variant="ghost"
					size="icon"
					onclick={() => copyToClipboard(secondCookieValue, "second")}
					title="Copy second value"
					class="hover:bg-green-100"
				>
					<ClipboardCopy size={16} />
				</Button>
				{#if copyMsgSecond}
					<span class="text-xs text-green-600">{copyMsgSecond}</span>
				{/if}
			</div>
			<div class="rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-card dark:to-muted p-4 min-h-[64px] shadow-sm">
				<pre class="whitespace-pre-wrap break-words text-sm font-mono text-gray-800 dark:text-gray-100">{secondCookieValue}</pre>
			</div>
		</div>
	</div>
</div>
