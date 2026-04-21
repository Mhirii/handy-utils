<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Badge } from "$lib/components/ui/badge";
	import * as Popover from "$lib/components/ui/popover";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import {
		Search,
		Plus,
		Code,
		Funnel,
		X,
		Tag,
		ChevronDown,
		ChevronLeft,
		ChevronRight,
		ChevronsLeft,
		ChevronsRight,
		LogInIcon,
	} from "@lucide/svelte";
	import SnippetCard from "$lib/components/snippet-card.svelte";
	import CreateSnippetDialog from "$lib/components/create-snippet-dialog.svelte";
	import EditSnippetDialog from "$lib/components/edit-snippet-dialog.svelte";
	import { type PageData } from "./$types";

	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { Jellyfish } from "svelte-loading-spinners";

	let createDialogOpen = $state(false);
	let editDialogOpen = $state(false);
	let editingSnippet = $state<any | null>(null);
	let languageSearch = $state("");
	let tagsSearch = $state("");
	let loadedSnippets: any[] = $state([]);

	let loading = $state(true);
	let { data }: { data: PageData } = $props();
	data.snippets.then(() => (loading = false));

	const filteredLanguages = $derived(
		data.languagesPromise.then((languages) =>
			languages.filter((lang) =>
				lang.id.toLowerCase().includes(languageSearch.toLowerCase()),
			),
		),
	);

	const filteredAvailableTags = $derived(
		data.tagsPromise.then((tags) =>
			tags.filter((tag) =>
				tag.name.toLowerCase().includes(tagsSearch.toLowerCase()),
			),
		),
	);

	const totalPages = $derived(
		data.totalCount.then((totalCount) =>
			Math.max(1, Math.ceil(totalCount / data.pageSize)),
		),
	);

	function updateUrl(params: Record<string, string | null>) {
		const url = new URL(page.url);
		for (const [key, value] of Object.entries(params)) {
			if (value === null || value === "") {
				url.searchParams.delete(key);
			} else {
				url.searchParams.set(key, value);
			}
		}
		url.searchParams.delete("page");
		goto(url.toString(), { keepFocus: true });
	}

	function setSearch(value: string) {
		updateUrl({ q: value || null });
	}

	function setLanguage(lang: string | null) {
		updateUrl({ language: lang || null });
	}

	function setTags(tags: string[]) {
		updateUrl({ tags: tags.length > 0 ? tags.join(",") : null });
	}
	function handleSnippetDelete(snippetId: number) {
		loadedSnippets = loadedSnippets.filter((s) => s.id !== snippetId);
	}

	function handleSnippetEdit(snippet: any) {
		editingSnippet = snippet;
		editDialogOpen = true;
	}

	function handleSnippetUpdate() {
		// Refresh snippets after update
		editDialogOpen = false;
		data.snippets.then((snippets) => {
			loadedSnippets = snippets;
		});
	}

	$effect(() => {
		data.snippets.then((snippets) => {
			loadedSnippets = snippets;
		});
	});

	function setTagsMatchMode(mode: "any" | "all") {
		updateUrl({ tagsMatchMode: mode });
	}

	function toggleTag(tag: string) {
		const current = data.filters.tags;
		const updated = current.includes(tag)
			? current.filter((t: string) => t !== tag)
			: [...current, tag];
		setTags(updated);
	}

	function clearFilters() {
		goto(page.url.pathname, { keepFocus: true });
	}

	function goToPage(pageNum: number) {
		const url = new URL(page.url);
		url.searchParams.set("page", String(pageNum));
		goto(url.toString(), { keepFocus: true });
	}

	let searchInput = $state(data.filters.search);
</script>

<svelte:head>
	<title>Snippet Manager</title>
	<meta
		name="description"
		content="Store, manage, and quickly retrieve your saved code snippets."
	/>
	<meta
		name="keywords"
		content="snippet manager, code snippets, code snippet manager, programming snippets, developer tools, code storage, snippet organization"
	/>
</svelte:head>

<div class="flex flex-col h-full">
	<header class="flex flex-col gap-4 p-6 pb-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div
					class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10"
				>
					{#if loading}
						<Jellyfish size="20" color="var(--primary)" />
					{:else}
						<Code class="w-5 h-5 text-primary" />
					{/if}
				</div>
				<div>
					<h1 class="text-2xl font-bold tracking-tight">Snippets</h1>
					{#await data.totalCount}
						<Skeleton class="w-28 h-5" />
					{:then totalCount}
						<p class="text-sm text-muted-foreground">
							{totalCount} snippets
						</p>
					{/await}
				</div>
			</div>
			{#if data.userId}
				<Button
					onclick={() => (createDialogOpen = true)}
					disabled={loading}
				>
					<Plus class="w-4 h-4" />
					New Snippet
				</Button>
			{:else}
				<Button disabled>
					<Plus class="w-4 h-4" />
					New Snippet
				</Button>
			{/if}
		</div>

		<div class="flex flex-col gap-3 sm:flex-row">
			<div class="relative flex-1">
				<Search
					class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
				/>
				<Input
					class="pl-9"
					placeholder="Search snippets..."
					bind:value={searchInput}
					oninput={() => setSearch(searchInput)}
					disabled={loading}
				/>
			</div>
			<div class="flex gap-2 flex-wrap sm:flex-nowrap">
				<Popover.Root>
					<Popover.Trigger>
						<Button
							variant="outline"
							class="gap-2 min-w-[140px]"
							disabled={loading}
						>
							<Funnel class="w-4 h-4" />
							Language
							{#if data.filters.language}
								<Badge
									variant="secondary"
									class="ml-1 px-1.5 py-0.5 text-xs capitalize"
								>
									{data.filters.language}
								</Badge>
							{:else}
								<ChevronDown class="w-3.5 h-3.5 ml-auto" />
							{/if}
						</Button>
					</Popover.Trigger>
					{#await filteredLanguages then languages}
						<Popover.Content class="w-64 p-0" align="end">
							<div class="p-2 border-b">
								<Input
									placeholder="Search languages..."
									bind:value={languageSearch}
									class="h-8"
								/>
							</div>
							<div class="max-h-[240px] overflow-y-auto p-1">
								<button
									class="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors"
									onclick={() => {
										setLanguage(null);
										languageSearch = "";
									}}
								>
									All Languages
								</button>
								{#each languages as lang}
									<button
										class="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors capitalize"
										onclick={() => setLanguage(lang.id)}
									>
										{lang.id}
									</button>
								{/each}
							</div>
						</Popover.Content>
					{/await}
				</Popover.Root>

				<Popover.Root>
					<Popover.Trigger>
						<Button
							variant="outline"
							class="gap-2 min-w-[140px]"
							disabled={loading}
						>
							<Tag class="w-4 h-4" />
							Tags
							{#if data.filters.tags.length > 0}
								<Badge
									variant="secondary"
									class="ml-1 px-1.5 py-0.5 text-xs"
								>
									{data.filters.tags.length}
								</Badge>
							{:else}
								<ChevronDown class="w-3.5 h-3.5 ml-auto" />
							{/if}
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-72 p-0" align="end">
						<div class="p-2 border-b space-y-2">
							<Input
								placeholder="Search tags..."
								bind:value={tagsSearch}
								class="h-8"
							/>
							{#if data.filters.tags.length > 1}
								<div class="flex gap-1">
									<button
										class="flex-1 text-xs py-1 px-2 rounded-sm transition-colors {data
											.filters.tagsMatchMode === 'any'
											? 'bg-primary text-primary-foreground'
											: 'bg-muted hover:bg-muted/80'}"
										onclick={() => setTagsMatchMode("any")}
									>
										Any
									</button>
									<button
										class="flex-1 text-xs py-1 px-2 rounded-sm transition-colors {data
											.filters.tagsMatchMode === 'all'
											? 'bg-primary text-primary-foreground'
											: 'bg-muted hover:bg-muted/80'}"
										onclick={() => setTagsMatchMode("all")}
									>
										All
									</button>
								</div>
							{/if}
						</div>
						<div class="max-h-[200px] overflow-y-auto p-1">
							{#await filteredAvailableTags}
								<Skeleton class="w-full h-8" />
							{:then filteredAvailableTags}
								{#if filteredAvailableTags.length === 0}
									<p
										class="text-sm text-muted-foreground px-2 py-4 text-center"
									>
										No tags found
									</p>
								{:else}
									{#each filteredAvailableTags as tag}
										<label
											class="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors cursor-pointer"
										>
											<Checkbox
												checked={data.filters.tags.includes(
													tag.name,
												)}
												onCheckedChange={() =>
													toggleTag(tag.name)}
											/>
											<span>{tag.name}</span>
										</label>
									{/each}
								{/if}
							{/await}
						</div>
					</Popover.Content>
				</Popover.Root>

				{#if data.filters.search || data.filters.language || data.filters.tags.length > 0}
					<Button variant="ghost" size="icon" onclick={clearFilters}>
						<X class="w-4 h-4" />
					</Button>
				{/if}
			</div>
		</div>

		{#if data.filters.tags.length > 0}
			<div class="flex flex-wrap gap-1.5 items-center">
				{#if data.filters.tags.length > 1}
					<span class="text-xs text-muted-foreground mr-1">
						{data.filters.tagsMatchMode === "all"
							? "All tags"
							: "Any tag"}:
					</span>
				{/if}
				{#each data.filters.tags as tag}
					<Badge variant="secondary" class="gap-1 pr-1.5">
						{tag}
						<button
							class="ml-0.5 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
							onclick={() => toggleTag(tag)}
						>
							<X class="w-3 h-3" />
						</button>
					</Badge>
				{/each}
			</div>
		{/if}
	</header>

	<Separator />

	<main class="flex-1 overflow-auto p-6 pt-4">
		{#await data.snippets}
			<div
				class="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
			>
				<Skeleton class="rounded-xl py-6 h-96" />
				<Skeleton class="rounded-xl py-6 h-96" />
				<Skeleton class="rounded-xl py-6 h-96" />
			</div>
		{:then snippets}
			{#if snippets.length === 0}
				<div
					class="flex flex-col items-center justify-center h-[50vh] text-center"
				>
					<div
						class="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4"
					>
						<Code class="w-8 h-8 text-muted-foreground" />
					</div>
					<h3 class="text-lg font-semibold mb-1">
						No snippets found
					</h3>
					<p class="text-sm text-muted-foreground max-w-sm">
						{#if data.filters.search || data.filters.language || data.filters.tags.length > 0}
							Try adjusting your search or filters to find what
							you're looking for.
						{:else if data.userId}
							Create your first snippet to get started building
							your collection.
						{:else}
							There seems to be no publicly published snippets
							yet. You can login to create your first snippet.
						{/if}
					</p>
					{#if !data.filters.search && !data.filters.language && data.filters.tags.length === 0}
						{#if data.userId}
							<Button
								class="mt-4"
								onclick={() => (createDialogOpen = true)}
							>
								<Plus class="w-4 h-4" />
								Create Snippet
							</Button>
						{:else}
							<Button
								onclick={() => goto("/auth/login")}
								class="mt-4"
							>
								<LogInIcon />
								Login to Create Snippets
							</Button>
						{/if}
					{/if}
				</div>
			{:else}
				<div
					class="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
				>
					{#each loadedSnippets as snippet (snippet.id)}
						<SnippetCard
							{snippet}
							onDelete={() => handleSnippetDelete(snippet.id)}
							onEdit={() => handleSnippetEdit(snippet)}
						/>
					{/each}
				</div>

				{#await Promise.all([data.totalCount, totalPages])}
					<Skeleton class="w-full h-8" />
				{:then [totalCount, resolvedTotalPages]}
					<div
						class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t"
					>
						<div
							class="flex items-center gap-2 text-sm text-muted-foreground"
						>
							<span>Total: {totalCount} snippets</span>
						</div>
						<div class="flex items-center gap-1">
							<span class="text-sm text-muted-foreground mr-2">
								Page {data.page} of {resolvedTotalPages}
							</span>
							<Button
								variant="outline"
								size="icon"
								class="h-8 w-8"
								disabled={data.page <= 1}
								onclick={() => goToPage(1)}
							>
								<ChevronsLeft class="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								class="h-8 w-8"
								disabled={data.page <= 1}
								onclick={() => goToPage(data.page - 1)}
							>
								<ChevronLeft class="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								class="h-8 w-8"
								disabled={data.page >= resolvedTotalPages}
								onclick={() => goToPage(data.page + 1)}
							>
								<ChevronRight class="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								class="h-8 w-8"
								disabled={data.page >= resolvedTotalPages}
								onclick={() => goToPage(resolvedTotalPages)}
							>
								<ChevronsRight class="w-4 h-4" />
							</Button>
						</div>
					</div>
				{/await}
			{/if}
		{/await}
	</main>
</div>

{#if data.userId}
	{#await data.languagesPromise}
		<div></div>
	{:then languages}
		<CreateSnippetDialog
			bind:open={createDialogOpen}
			{languages}
			form={data.form}
		/>
		{#if editingSnippet}
			<EditSnippetDialog
				bind:open={editDialogOpen}
				{languages}
				snippet={editingSnippet}
				form={data.form}
			/>
		{/if}
	{/await}
{/if}
