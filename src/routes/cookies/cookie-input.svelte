<script lang="ts">
import { Textarea } from "$lib/components/ui/textarea";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "$lib/components/ui/card";
import { Button } from "$lib/components/ui/button";
import { ClipboardPaste } from "@lucide/svelte";

export let cookie: string;
export let index: string;
let pasted = "";

function getCookie(input: string): string | null {
	const cookieLine = input
		.split("\n")
		.find((line) => line.startsWith("Cookie:"));
	return cookieLine ? cookieLine.replace("Cookie: ", "") : null;
}
$: if (cookie.includes("# REQUEST")) cookie = getCookie(cookie) || cookie;
</script>

<Card>
	<CardHeader class="flex flex-row items-center justify-between">
		<div>
			<CardTitle class="capitalize">{index} Cookie</CardTitle>
			<CardDescription>Paste your {index} cookie here</CardDescription>
		</div>
		<Button
			variant="ghost"
			size="icon"
			onclick={async () => {
				try {
					pasted = await navigator.clipboard.readText();
					const c = getCookie(pasted);
					if (c) cookie = c;
				} catch (err) {
					console.error("Failed to read clipboard:", err);
				}
			}}><ClipboardPaste /></Button
		>
	</CardHeader>
	<CardContent>
		<Textarea
			bind:value={cookie}
			placeholder="Paste your cookie here..."
			class="min-h-[150px]"
		/>
	</CardContent>
</Card>
