<!-- this page is for string manipulations, user adds some operations from dropdowns, -->
<!-- operations include split, join, replace, and more there is a input field where -->
<!-- user pastes string the result is displayed in a textarea with a copy Button -->
<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";

	let inputText = "";
	let outputText = "";
	let outputArray: string[] = [];
	let operations: { type: string; value: string }[] = [
		{ type: "split", value: "/" },
		{ type: "trim", value: "" },
	];
	let isArray = false;

	const operationTypes = [
		{ label: "Split", value: "split" },
		{ label: "Join", value: "join" },
		{ label: "Replace", value: "replace" },
		{ label: "To Upper Case", value: "toUpperCase" },
		{ label: "To Lower Case", value: "toLowerCase" },
		{ label: "Trim", value: "trim" },
	];

	function addOperation() {
		operations = [...operations, { type: "split", value: "" }];
	}

	function removeOperation(index: number) {
		operations = operations.filter((_, i) => i !== index);
		processText();
	}

	function processText() {
		let result = inputText;
		console.log("processing text");

		for (const op of operations) {
			switch (op.type) {
				case "split":
					result = result.split(op.value).join("\n");
					isArray = true;
					break;
				case "join":
					result = result.split("\n").join(op.value);
					isArray = false;
					break;
				case "replace":
					const [search, replace] = op.value.split("|");
					result = result.replaceAll(search || "", replace || "");
					break;
				case "toUpperCase":
					result = result.toUpperCase();
					break;
				case "toLowerCase":
					result = result.toLowerCase();
					break;
				case "trim":
					result = result.trim();
					outputArray?.map((i) => i.trim());
					break;
			}
		}

		outputText = result;
		return outputText;
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(outputText);
	}

	$: outputText = processText();
</script>

<div class="flex flex-col items-center justify-center h-full">
	<div
		class="flex flex-col items-center justify-center space-y-4 w-full max-w-3xl p-4"
	>
		<Textarea
			bind:value={inputText}
			placeholder="Paste your text here..."
			class="w-full h-32 p-2 border rounded-lg resize-y"
			onchange={processText}
		/>

		<div class="flex flex-col w-full gap-2">
			<Button
				onclick={addOperation}
				class=" px-4 py-2 rounded transition-colors"
			>
				Add Operation
			</Button>

			{#each operations as operation, i}
				<div class="flex gap-2 items-center">
					<select
						bind:value={operation.type}
						onchange={processText}
						class="w-[180px] px-3 py-2 rounded border"
					>
						{#each operationTypes as opType}
							<option value={opType.value}>{opType.label}</option>
						{/each}
					</select>

					{#if operation.type !== "toUpperCase" && operation.type !== "toLowerCase" && operation.type !== "trim"}
						<Input
							type="text"
							bind:value={operation.value}
							placeholder={operation.type === "replace"
								? "search|replace"
								: "value"}
							oninput={processText}
							class="flex-1"
						/>
					{/if}

					<Button
						variant="destructive"
						onclick={() => removeOperation(i)}
						class="px-3 py-2"
					>
						Remove
					</Button>
				</div>
			{/each}
		</div>

		<div class="w-full h-full relative">
			{#if typeof outputText === "string"}
				<Textarea
					readonly
					value={outputText}
					placeholder="Result will appear here..."
					class="w-full h-[300px] p-2 border rounded-lg resize-y"
				/>
				<Button
					onclick={copyToClipboard}
					class="absolute top-2 right-2px-3 py-1 rounded text-sm transition-colors"
				>
					Copy
				</Button>
			{:else if outputArray.length > 0}
				<div class="flex flex-col gap-2 p-2 border rounded-lg h-full">
					{#each outputArray as item, i}
						<Textarea
							readonly
							value={item}
							placeholder="Result will appear here..."
							class="w-full  p-2 border rounded-lg resize-y "
						/>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col gap-2 p-2 border rounded-lg">
					<Textarea
						readonly
						value={JSON.stringify(outputText)}
						placeholder="Result will appear here..."
						class="w-full h-32 p-2 border rounded-lg resize-y"
					/>
				</div>
			{/if}
		</div>
	</div>
</div>
