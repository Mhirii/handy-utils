<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Label } from "$lib/components/ui/label";
	import { Badge } from "$lib/components/ui/badge";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import * as Popover from "$lib/components/ui/popover";
	import {
		Search,
		Plus,
		Code2,
		Calendar,
		Clock,
		Globe,
		Lock,
		ChevronDown,
		Filter,
		X,
		Copy,
		Check,
		MoreHorizontal,
		Trash2,
		Edit,
		Tag,
		ChevronLeft,
		ChevronRight,
		ChevronsLeft,
		ChevronsRight,
	} from "@lucide/svelte";

	interface Snippet {
		id: number;
		title: string;
		description: string;
		code: string;
		language: string;
		tags: string[];
		isPublic: boolean;
		createdAt: string;
		updatedAt: string;
	}

	interface PageData {
		snippets: Snippet[];
		languages: { id: string; extension: string; color: string }[];
		tags: { id: number; name: string }[];
		totalCount: number;
		page: number;
		pageSize: number;
		filters: {
			search: string;
			language: string;
			tags: string[];
			tagsMatchMode: "any" | "all";
		};
	}

	let createDialogOpen = $state(false);
	let copiedId = $state<number | null>(null);

	let languageSearch = $state("");
	let tagsSearch = $state("");

	let newSnippet = $state({
		title: "",
		description: "",
		code: "",
		language: "",
		tags: "",
		isPublic: false,
	});

	const filteredLanguages = $derived(
		(page.data as PageData).languages.filter((lang) =>
			lang.id.toLowerCase().includes(languageSearch.toLowerCase()),
		),
	);

	const filteredAvailableTags = $derived(
		(page.data as PageData).tags.filter((tag) =>
			tag.name.toLowerCase().includes(tagsSearch.toLowerCase()),
		),
	);

	const totalPages = $derived(
		Math.max(
			1,
			Math.ceil(
				(page.data as PageData).totalCount /
					(page.data as PageData).pageSize,
			),
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

	function setTagsMatchMode(mode: "any" | "all") {
		updateUrl({ tagsMatchMode: mode });
	}

	function toggleTag(tag: string) {
		const current = (page.data as PageData).filters.tags;
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

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	function formatRelativeTime(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return "just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return formatDate(dateString);
	}

	function getLanguageColor(lang: string): string {
		const colors: Record<string, string> = {
			javascript:
				"bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
			typescript:
				"bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
			python: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
			rust: "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
			go: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
			java: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
			"c++": "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
			csharp: "bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30",
		};
		return (
			colors[lang.toLowerCase()] ||
			"bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30"
		);
	}

	function copyCode(id: number, code: string) {
		navigator.clipboard.writeText(code);
		copiedId = id;
		setTimeout(() => {
			copiedId = null;
		}, 2000);
	}

	let searchInput = $state((page.data as PageData).filters.search);
</script>

<div class="flex flex-col h-full">
	<header class="flex flex-col gap-4 p-6 pb-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div
					class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10"
				>
					<Code2 class="w-5 h-5 text-primary" />
				</div>
				<div>
					<h1 class="text-2xl font-bold tracking-tight">Snippets</h1>
					<p class="text-sm text-muted-foreground">
						{(page.data as PageData).totalCount} snippets
					</p>
				</div>
			</div>
			<Dialog.Root bind:open={createDialogOpen}>
				<Dialog.Trigger>
					<Button>
						<Plus class="w-4 h-4" />
						New Snippet
					</Button>
				</Dialog.Trigger>
				<Dialog.Content
					class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
				>
					<Dialog.Header>
						<Dialog.Title>Create New Snippet</Dialog.Title>
						<Dialog.Description>
							Add a new code snippet to your collection. Fill in
							the details below.
						</Dialog.Description>
					</Dialog.Header>
					<form method="POST" action="?/create">
						<div class="grid gap-4 py-4">
							<div class="grid gap-2">
								<Label for="title">Title</Label>
								<Input
									id="title"
									name="title"
									placeholder="Debounce Function"
									bind:value={newSnippet.title}
								/>
							</div>
							<div class="grid gap-2">
								<Label for="description">Description</Label>
								<Textarea
									id="description"
									name="description"
									placeholder="A brief description of what this snippet does..."
									bind:value={newSnippet.description}
									class="min-h-[80px]"
								/>
							</div>
							<div class="grid gap-2">
								<Label for="language">Language</Label>
								<select
									id="language"
									name="language"
									class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									bind:value={newSnippet.language}
								>
									{#each (page.data as PageData).languages as lang}
										<option value={lang.id}
											>{lang.id}</option
										>
									{/each}
								</select>
							</div>
							<div class="grid gap-2">
								<Label for="tags">Tags (comma-separated)</Label>
								<Input
									id="tags"
									name="tags"
									placeholder="utils, hooks, api"
									bind:value={newSnippet.tags}
								/>
							</div>
							<div class="grid gap-2">
								<Label for="code">Code</Label>
								<Textarea
									id="code"
									name="code"
									placeholder="Paste your code here..."
									bind:value={newSnippet.code}
									class="min-h-[200px] font-mono text-sm"
								/>
							</div>
							<div class="flex items-center gap-2">
								<Checkbox
									id="isPublic"
									name="isPublic"
									bind:checked={newSnippet.isPublic}
								/>
								<Label
									for="isPublic"
									class="text-sm font-normal cursor-pointer"
								>
									Make this snippet public
								</Label>
							</div>
						</div>
						<Dialog.Footer>
							<Button
								variant="outline"
								type="button"
								onclick={() => (createDialogOpen = false)}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={!newSnippet.title || !newSnippet.code}
							>
								Create Snippet
							</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
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
				/>
			</div>
			<div class="flex gap-2 flex-wrap sm:flex-nowrap">
				<Popover.Root>
					<Popover.Trigger>
						<Button variant="outline" class="gap-2 min-w-[140px]">
							<Filter class="w-4 h-4" />
							Language
							{#if (page.data as PageData).filters.language}
								<Badge
									variant="secondary"
									class="ml-1 px-1.5 py-0.5 text-xs capitalize"
								>
									{(page.data as PageData).filters.language}
								</Badge>
							{:else}
								<ChevronDown class="w-3.5 h-3.5 ml-auto" />
							{/if}
						</Button>
					</Popover.Trigger>
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
							{#each filteredLanguages as lang}
								<button
									class="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors capitalize"
									onclick={() => setLanguage(lang.id)}
								>
									{lang.id}
								</button>
							{/each}
						</div>
					</Popover.Content>
				</Popover.Root>

				<Popover.Root>
					<Popover.Trigger>
						<Button variant="outline" class="gap-2 min-w-[140px]">
							<Tag class="w-4 h-4" />
							Tags
							{#if (page.data as PageData).filters.tags.length > 0}
								<Badge
									variant="secondary"
									class="ml-1 px-1.5 py-0.5 text-xs"
								>
									{(page.data as PageData).filters.tags
										.length}
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
							{#if (page.data as PageData).filters.tags.length > 1}
								<div class="flex gap-1">
									<button
										class="flex-1 text-xs py-1 px-2 rounded-sm transition-colors {(
											page.data as PageData
										).filters.tagsMatchMode === 'any'
											? 'bg-primary text-primary-foreground'
											: 'bg-muted hover:bg-muted/80'}"
										onclick={() => setTagsMatchMode("any")}
									>
										Any
									</button>
									<button
										class="flex-1 text-xs py-1 px-2 rounded-sm transition-colors {(
											page.data as PageData
										).filters.tagsMatchMode === 'all'
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
											checked={(
												page.data as PageData
											).filters.tags.includes(tag.name)}
											onCheckedChange={() =>
												toggleTag(tag.name)}
										/>
										<span>{tag.name}</span>
									</label>
								{/each}
							{/if}
						</div>
					</Popover.Content>
				</Popover.Root>

				{#if (page.data as PageData).filters.search || (page.data as PageData).filters.language || (page.data as PageData).filters.tags.length > 0}
					<Button variant="ghost" size="icon" onclick={clearFilters}>
						<X class="w-4 h-4" />
					</Button>
				{/if}
			</div>
		</div>

		{#if (page.data as PageData).filters.tags.length > 0}
			<div class="flex flex-wrap gap-1.5 items-center">
				{#if (page.data as PageData).filters.tags.length > 1}
					<span class="text-xs text-muted-foreground mr-1">
						{(page.data as PageData).filters.tagsMatchMode === "all"
							? "All tags"
							: "Any tag"}:
					</span>
				{/if}
				{#each (page.data as PageData).filters.tags as tag}
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
		{#if (page.data as PageData).snippets.length === 0}
			<div
				class="flex flex-col items-center justify-center h-[50vh] text-center"
			>
				<div
					class="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4"
				>
					<Code2 class="w-8 h-8 text-muted-foreground" />
				</div>
				<h3 class="text-lg font-semibold mb-1">No snippets found</h3>
				<p class="text-sm text-muted-foreground max-w-sm">
					{#if (page.data as PageData).filters.search || (page.data as PageData).filters.language || (page.data as PageData).filters.tags.length > 0}
						Try adjusting your search or filters to find what you're
						looking for.
					{:else}
						Create your first snippet to get started building your
						collection.
					{/if}
				</p>
				{#if !(page.data as PageData).filters.search && !(page.data as PageData).filters.language && (page.data as PageData).filters.tags.length === 0}
					<Button
						class="mt-4"
						onclick={() => (createDialogOpen = true)}
					>
						<Plus class="w-4 h-4" />
						Create Snippet
					</Button>
				{/if}
			</div>
		{:else}
			<div
				class="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
			>
				{#each (page.data as PageData).snippets as snippet (snippet.id)}
					<Card.Root
						class="group relative flex flex-col overflow-hidden transition-all hover:shadow-md"
					>
						<Card.Header class="pb-3">
							<div class="flex items-start justify-between gap-2">
								<div class="flex-1 min-w-0">
									<Card.Title class="truncate text-lg"
										>{snippet.title}</Card.Title
									>
									{#if snippet.description}
										<Card.Description
											class="line-clamp-2 mt-1.5"
										>
											{snippet.description}
										</Card.Description>
									{/if}
								</div>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<Button
											variant="ghost"
											size="icon"
											class="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-1"
										>
											<MoreHorizontal class="w-4 h-4" />
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										<DropdownMenu.Item>
											<Edit class="w-4 h-4 mr-2" />
											Edit
										</DropdownMenu.Item>
										<DropdownMenu.Separator />
										<DropdownMenu.Item
											class="text-destructive focus:text-destructive"
										>
											<Trash2 class="w-4 h-4 mr-2" />
											Delete
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</Card.Header>
						<Card.Content class="flex-1 flex flex-col gap-3">
							<div
								class="relative rounded-md bg-muted/50 overflow-hidden"
							>
								<pre
									class="p-3 text-xs overflow-x-auto max-h-32 leading-relaxed"><code
										class="font-mono"
										>{snippet.code.slice(0, 300)}{snippet
											.code.length > 300
											? "..."
											: ""}</code
									></pre>
								<div class="absolute top-2 right-2">
									<Button
										variant="secondary"
										size="icon"
										class="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
										onclick={() =>
											copyCode(snippet.id, snippet.code)}
									>
										{#if copiedId === snippet.id}
											<Check
												class="w-3.5 h-3.5 text-green-600"
											/>
										{:else}
											<Copy class="w-3.5 h-3.5" />
										{/if}
									</Button>
								</div>
							</div>

							<div class="flex flex-wrap gap-1.5">
								<Badge
									variant="outline"
									class={getLanguageColor(snippet.language)}
								>
									{snippet.language}
								</Badge>
								{#each snippet.tags.slice(0, 3) as tag}
									<Badge variant="secondary">{tag}</Badge>
								{/each}
								{#if snippet.tags.length > 3}
									<Badge
										variant="outline"
										class="text-muted-foreground"
									>
										+{snippet.tags.length - 3}
									</Badge>
								{/if}
							</div>
						</Card.Content>
						<Card.Footer class="pt-3 pb-4">
							<div
								class="flex items-center justify-between w-full text-xs text-muted-foreground"
							>
								<div class="flex items-center gap-3">
									<span class="flex items-center gap-1">
										<Calendar class="w-3 h-3" />
										{formatDate(snippet.createdAt)}
									</span>
									<span class="flex items-center gap-1">
										<Clock class="w-3 h-3" />
										{formatRelativeTime(snippet.updatedAt)}
									</span>
								</div>
								{#if snippet.isPublic}
									<span
										class="flex items-center gap-1 text-green-600 dark:text-green-400"
									>
										<Globe class="w-3 h-3" />
										Public
									</span>
								{:else}
									<span class="flex items-center gap-1">
										<Lock class="w-3 h-3" />
										Private
									</span>
								{/if}
							</div>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>

			<div
				class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t"
			>
				<div
					class="flex items-center gap-2 text-sm text-muted-foreground"
				>
					<span
						>Total: {(page.data as PageData).totalCount} snippets</span
					>
				</div>

				<div class="flex items-center gap-1">
					<span class="text-sm text-muted-foreground mr-2">
						Page {(page.data as PageData).page} of {totalPages}
					</span>
					<Button
						variant="outline"
						size="icon"
						class="h-8 w-8"
						disabled={(page.data as PageData).page <= 1}
						onclick={() => goToPage(1)}
					>
						<ChevronsLeft class="w-4 h-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						class="h-8 w-8"
						disabled={(page.data as PageData).page <= 1}
						onclick={() =>
							goToPage((page.data as PageData).page - 1)}
					>
						<ChevronLeft class="w-4 h-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						class="h-8 w-8"
						disabled={(page.data as PageData).page >= totalPages}
						onclick={() =>
							goToPage((page.data as PageData).page + 1)}
					>
						<ChevronRight class="w-4 h-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						class="h-8 w-8"
						disabled={(page.data as PageData).page >= totalPages}
						onclick={() => goToPage(totalPages)}
					>
						<ChevronsRight class="w-4 h-4" />
					</Button>
				</div>
			</div>
		{/if}
	</main>
</div>
