<script lang="ts">
	import * as Select from "$lib/components/ui/select";
	import * as Card from "$lib/components/ui/card";
	import { Separator } from "$lib/components/ui/separator/index";
	import { Textarea } from "$lib/components/ui/textarea";
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from "$lib/components/ui/table";
	import { WholeWord, Search } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { enhance } from "$app/forms";
	import Input from "$lib/components/ui/input/input.svelte";

	let { data, form } = $props();

	let selectedModel = $state("gpt-4o");
	let inputText = $state("");
	let searchQuery = $state("");
	let formElement: HTMLFormElement;
	let timer: ReturnType<typeof setTimeout>;
	let isCalculating = $state(false);

	// Group models by provider for the dropdown
	const groupedModels = data.aiModels.reduce(
		(acc, model) => {
			if (!acc[model.provider]) acc[model.provider] = [];
			acc[model.provider].push(model);
			return acc;
		},
		{} as Record<string, typeof data.aiModels>,
	);

	// Reactively filter models based on search query
	let filteredGroupedModels = $derived.by(() => {
		if (!searchQuery.trim()) return groupedModels;

		const lowerQuery = searchQuery.toLowerCase();
		const result: Record<string, typeof data.aiModels> = {};

		for (const [provider, models] of Object.entries(groupedModels)) {
			const filtered = models.filter(
				(m) =>
					m.name.toLowerCase().includes(lowerQuery) ||
					m.provider.toLowerCase().includes(lowerQuery),
			);
			if (filtered.length > 0) {
				result[provider] = filtered;
			}
		}
		return result;
	});

	let stats = $state({
		tokenCount: 0,
		wordCount: 0,
		charCount: 0,
		charCountNoSpaces: 0,
		costs: data.aiModels.map((m) => ({
			name: m.name,
			inputCost: "$0.0000",
			outputCost: "$0.0000",
		})),
	});

	$effect(() => {
		if (form) {
			stats = {
				tokenCount: form.tokenCount,
				wordCount: form.wordCount,
				charCount: form.charCount,
				charCountNoSpaces: form.charCountNoSpaces,
				costs: form.costs,
			};
			isCalculating = false;
		}
	});

	function triggerCalculation() {
		if (!inputText) {
			stats.tokenCount = 0;
			stats.wordCount = 0;
			stats.charCount = 0;
			stats.charCountNoSpaces = 0;
			stats.costs = data.aiModels.map((m) => ({
				name: m.name,
				inputCost: "$0.0000",
				outputCost: "$0.0000",
			}));
			return;
		}
		isCalculating = true;
		clearTimeout(timer);
		timer = setTimeout(() => {
			if (formElement) formElement.requestSubmit();
		}, 500);
	}

	onMount(() => {
		const storedText = localStorage.getItem("HT_TOKENS_STORED_TEXT");
		const storedModel = localStorage.getItem("HT_TOKENS_STORED_MODEL");
		if (storedText !== null) {
			inputText = storedText;
			triggerCalculation();
		}
		if (storedModel !== null) selectedModel = storedModel;
	});

	$effect(() => {
		if (typeof window !== "undefined") {
			if (inputText !== undefined)
				localStorage.setItem("HT_TOKENS_STORED_TEXT", inputText);
			if (selectedModel)
				localStorage.setItem("HT_TOKENS_STORED_MODEL", selectedModel);
		}
	});

	function getCost(modelName: string, isOutput: boolean = false): string {
		const modelCost = stats.costs.find((c) => c.name === modelName);
		if (!modelCost) return "N/A";
		return isOutput ? modelCost.outputCost : modelCost.inputCost;
	}
</script>

<form
	method="POST"
	action="?/calculate"
	bind:this={formElement}
	use:enhance={() => {
		return async ({ update }) => {
			update({ reset: false });
		};
	}}
	class="flex flex-col h-full"
>
	<input type="hidden" name="model" value={selectedModel} />

	<header
		class="flex flex-row gap-4 p-6 pb-4 w-full justify-between items-center"
	>
		<div class="flex items-center gap-3 w-full">
			<div
				class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10"
			>
				<WholeWord class="w-5 h-5 text-primary" />
			</div>
			<h1 class="text-2xl font-bold tracking-tight">
				Tokens {isCalculating ? "..." : ""}
			</h1>
		</div>

		<Select.Root
			type="single"
			bind:value={selectedModel}
			onValueChange={triggerCalculation}
			onOpenChange={(isOpen) => {
				if (!isOpen) searchQuery = "";
			}}
		>
			<Select.Trigger class="w-64 px-4 font-bold">
				{selectedModel || "Select Model"}
			</Select.Trigger>
			<Select.Content class="max-h-[400px] overflow-hidden flex flex-col">
				<div class="p-2 sticky top-0 bg-popover z-10 border-b">
					<div class="relative flex items-center">
						<Search
							class="absolute left-2 h-4 w-4 text-muted-foreground"
						/>
						<Input
							type="text"
							placeholder="Search models..."
							bind:value={searchQuery}
							onkeydown={(e) => e.stopPropagation()}
							class="flex h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						/>
					</div>
				</div>

				<div class="overflow-y-auto">
					{#each Object.entries(filteredGroupedModels) as [provider, models]}
						<Select.Group>
							<Select.Label class="font-bold text-primary"
								>{provider}</Select.Label
							>
							{#each models as model}
								<Select.Item value={model.name}
									>{model.name}</Select.Item
								>
							{/each}
						</Select.Group>
					{/each}
					{#if Object.keys(filteredGroupedModels).length === 0}
						<div
							class="p-4 text-center text-sm text-muted-foreground"
						>
							No models found.
						</div>
					{/if}
				</div>
			</Select.Content>
		</Select.Root>
	</header>

	<Separator />

	<main class="flex-1 overflow-auto p-6 pt-4 flex flex-col gap-6">
		<div class="flex flex-col gap-4">
			<h2 class="text-lg font-semibold">Input Text</h2>
			<Textarea
				name="text"
				bind:value={inputText}
				oninput={triggerCalculation}
				placeholder="Paste your text here to calculate token count..."
				class="w-full h-40"
			/>
		</div>

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<Card.Root>
				<Card.Header class="text-muted-foreground">
					<Card.Title class="text-foreground">Tokens</Card.Title>
				</Card.Header>
				<Card.Content
					class="text-2xl font-bold {isCalculating
						? 'opacity-50'
						: ''}"
				>
					{stats.tokenCount.toLocaleString()}
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="text-muted-foreground">
					<Card.Title class="text-foreground">Words</Card.Title>
				</Card.Header>
				<Card.Content class="text-2xl font-bold">
					{stats.wordCount.toLocaleString()}
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="text-muted-foreground">
					<Card.Title class="text-foreground">Characters</Card.Title>
				</Card.Header>
				<Card.Content class="text-2xl font-bold">
					{stats.charCount.toLocaleString()}
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="text-muted-foreground">
					<Card.Title class="text-foreground">Spaceless</Card.Title>
				</Card.Header>
				<Card.Content class="text-2xl font-bold">
					{stats.charCountNoSpaces.toLocaleString()}
				</Card.Content>
			</Card.Root>
		</div>

		<div class="flex flex-col gap-4">
			<h2 class="text-lg font-semibold">Pricing</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Provider</TableHead>
						<TableHead>Model</TableHead>
						<TableHead>Input Price (per 1M)</TableHead>
						<TableHead>Output Price (per 1M)</TableHead>
						<TableHead>Input Cost</TableHead>
						<TableHead>Output Cost</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each data.aiModels as model}
						<TableRow>
							<TableCell
								class="font-medium text-muted-foreground"
							>
								{model.provider}
							</TableCell>
							<TableCell class="font-bold">{model.name}</TableCell
							>
							<TableCell>${model.inputPrice}</TableCell>
							<TableCell>${model.outputPrice}</TableCell>
							<TableCell
								class={model.name === "Ollama (local)"
									? "text-muted-foreground"
									: ""}
							>
								{getCost(model.name, false)}
							</TableCell>
							<TableCell
								class={model.name === "Ollama (local)"
									? "text-muted-foreground"
									: ""}
							>
								{getCost(model.name, true)}
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>
	</main>
</form>
