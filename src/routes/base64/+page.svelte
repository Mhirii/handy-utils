<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { writable } from "svelte/store";
	import Base64Input from "./base64-input.svelte";

	let input = writable("");
	let inputVal = "";
	let output = writable("");
	let outputVal = "";
	let isEncoding = $state(false);

	function processInput(input: string) {
		try {
			if (isEncoding) {
				return btoa(input);
			} else {
				return atob(input);
			}
		} catch (err) {
			return `Error: ${"message" in (err as any) ? (err as any).message : err}`;
		}
	}

	input.subscribe((v) => {
		output.set(processInput(v));
		inputVal = v;
	});
	output.subscribe((v) => {
		outputVal = v;
	});
</script>

<div class=" mx-auto p-4 space-y-6 h-full">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-3xl font-bold">Base64 Converter</h1>
		<Button variant="outline" onclick={() => (isEncoding = !isEncoding)}>
			Switch to {isEncoding ? "Decoding" : "Encoding"}
		</Button>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
		<Base64Input
			title={isEncoding ? "Plain Text" : "Base64"}
			desc={isEncoding ? "Text to encode" : "Base64 to decode"}
			readonly={false}
			textAreaPlaceholder={isEncoding
				? "Enter text to encode..."
				: "Enter base64 to decode..."}
			value={input}
		/>
		<Base64Input
			title={isEncoding ? "Base64" : "Plain Text"}
			desc={isEncoding ? "Encoded result" : "Decoded result"}
			readonly={true}
			textAreaPlaceholder={isEncoding
				? "Encoded output will appear here..."
				: "Decoded output will appear here..."}
			value={output}
		/>
	</div>
</div>
