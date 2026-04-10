<script lang="ts">
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
		ExternalLink,
		Tag,
	} from "@lucide/svelte";

	interface Snippet {
		id: string;
		title: string;
		description: string;
		code: string;
		language: string;
		tags: string[];
		isPublic: boolean;
		created_at: string;
		updated_at: string;
	}

	let searchQuery = $state("");
	let selectedLanguage = $state<string | null>(null);
	let selectedTags = $state<string[]>([]);
	let showPublicOnly = $state(false);

	let createDialogOpen = $state(false);
	let copiedId = $state<string | null>(null);

	let newSnippet = $state({
		title: "",
		description: "",
		code: "",
		language: "javascript",
		tags: "",
		isPublic: false,
	});

	const languages = [
		"javascript",
		"typescript",
		"python",
		"rust",
		"go",
		"java",
		"c++",
		"csharp",
		"ruby",
		"php",
		"swift",
		"kotlin",
		"sql",
		"bash",
		"html",
		"css",
	];

	const allTags = [
		"utils",
		"api",
		"hooks",
		"components",
		"algorithms",
		"config",
		"auth",
		"database",
		"testing",
		"optimization",
	];

	let snippets = $state<Snippet[]>([
		{
			id: "1",
			title: "Debounce Function",
			description:
				"A utility function to limit the rate at which a function can fire. Useful for search inputs and resize handlers.",
			code: `function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  };
}`,
			language: "typescript",
			tags: ["utils", "hooks"],
			isPublic: true,
			created_at: "2024-03-15T10:30:00Z",
			updated_at: "2024-03-15T10:30:00Z",
		},
		{
			id: "2",
			title: "Fetch with Retry",
			description:
				"Enhanced fetch wrapper with automatic retry logic for failed network requests.",
			code: `async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  delay = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries reached');
}`,
			language: "typescript",
			tags: ["utils", "api"],
			isPublic: true,
			created_at: "2024-03-10T14:20:00Z",
			updated_at: "2024-03-12T09:15:00Z",
		},
		{
			id: "3",
			title: "useLocalStorage Hook",
			description:
				"React hook for persisting state in localStorage with automatic serialization.",
			code: `function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}`,
			language: "typescript",
			tags: ["hooks", "utils"],
			isPublic: false,
			created_at: "2024-02-28T16:45:00Z",
			updated_at: "2024-02-28T16:45:00Z",
		},
		{
			id: "4",
			title: "Binary Search",
			description:
				"Efficient O(log n) search algorithm for sorted arrays.",
			code: `function binarySearch<T>(arr: T[], target: T): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
			language: "typescript",
			tags: ["algorithms"],
			isPublic: true,
			created_at: "2024-02-20T08:00:00Z",
			updated_at: "2024-02-25T11:30:00Z",
		},
		{
			id: "5",
			title: "Deep Clone Object",
			description:
				"Utility to create a deep copy of an object, handling circular references.",
			code: `function deepClone<T>(obj: T, seen = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);

  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);

  for (const key of Object.keys(obj)) {
    (clone as any)[key] = deepClone((obj as any)[key], seen);
  }

  return clone;
}`,
			language: "typescript",
			tags: ["utils"],
			isPublic: true,
			created_at: "2024-01-15T13:20:00Z",
			updated_at: "2024-01-15T13:20:00Z",
		},
		{
			id: "6",
			title: "JWT Decode",
			description: "Simple JWT token decoder without verification.",
			code: `function decodeJWT(token: string): { header: any; payload: any } | null {
  try {
    const [header, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return { header: JSON.parse(atob(header)), payload: decoded };
  } catch {
    return null;
  }
}`,
			language: "javascript",
			tags: ["auth", "utils"],
			isPublic: false,
			created_at: "2024-03-05T09:00:00Z",
			updated_at: "2024-03-05T09:00:00Z",
		},
	]);

	const filteredSnippets = $derived(
		snippets.filter((snippet) => {
			const matchesSearch =
				searchQuery === "" ||
				snippet.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				snippet.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				snippet.code.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesLanguage =
				selectedLanguage === null ||
				snippet.language === selectedLanguage;

			const matchesTags =
				selectedTags.length === 0 ||
				selectedTags.some((tag) => snippet.tags.includes(tag));

			const matchesPublic = !showPublicOnly || snippet.isPublic;

			return (
				matchesSearch && matchesLanguage && matchesTags && matchesPublic
			);
		}),
	);

	const availableTags = $derived(
		[...new Set(snippets.flatMap((s) => s.tags))].sort(),
	);

	const availableLanguages = $derived(
		[...new Set(snippets.map((s) => s.language))].sort(),
	);

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

	function copyCode(id: string, code: string) {
		navigator.clipboard.writeText(code);
		copiedId = id;
		setTimeout(() => {
			copiedId = null;
		}, 2000);
	}

	function clearFilters() {
		searchQuery = "";
		selectedLanguage = null;
		selectedTags = [];
		showPublicOnly = false;
	}

	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	function createSnippet() {
		const newSnippetObj: Snippet = {
			id: Date.now().toString(),
			title: newSnippet.title,
			description: newSnippet.description,
			code: newSnippet.code,
			language: newSnippet.language,
			tags: newSnippet.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
			isPublic: newSnippet.isPublic,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
		snippets = [newSnippetObj, ...snippets];
		createDialogOpen = false;
		newSnippet = {
			title: "",
			description: "",
			code: "",
			language: "javascript",
			tags: "",
			isPublic: false,
		};
	}

	function deleteSnippet(id: string) {
		snippets = snippets.filter((s) => s.id !== id);
	}
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
						{filteredSnippets.length} of {snippets.length} snippets
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
					<div class="grid gap-4 py-4">
						<div class="grid gap-2">
							<Label for="title">Title</Label>
							<Input
								id="title"
								placeholder="Debounce Function"
								bind:value={newSnippet.title}
							/>
						</div>
						<div class="grid gap-2">
							<Label for="description">Description</Label>
							<Textarea
								id="description"
								placeholder="A brief description of what this snippet does..."
								bind:value={newSnippet.description}
								class="min-h-[80px]"
							/>
						</div>
						<div class="grid gap-2">
							<Label for="language">Language</Label>
							<select
								id="language"
								class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								bind:value={newSnippet.language}
							>
								{#each languages as lang}
									<option value={lang}>{lang}</option>
								{/each}
							</select>
						</div>
						<div class="grid gap-2">
							<Label for="tags">Tags (comma-separated)</Label>
							<Input
								id="tags"
								placeholder="utils, hooks, api"
								bind:value={newSnippet.tags}
							/>
						</div>
						<div class="grid gap-2">
							<Label for="code">Code</Label>
							<Textarea
								id="code"
								placeholder="Paste your code here..."
								bind:value={newSnippet.code}
								class="min-h-[200px] font-mono text-sm"
							/>
						</div>
						<div class="flex items-center gap-2">
							<Checkbox
								id="isPublic"
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
							onclick={() => (createDialogOpen = false)}
						>
							Cancel
						</Button>
						<Button
							onclick={createSnippet}
							disabled={!newSnippet.title || !newSnippet.code}
						>
							Create Snippet
						</Button>
					</Dialog.Footer>
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
					bind:value={searchQuery}
				/>
			</div>
			<div class="flex gap-2 flex-wrap sm:flex-nowrap">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="outline" class="gap-2">
							<Filter class="w-4 h-4" />
							Language
							{#if selectedLanguage}
								<Badge
									variant="secondary"
									class="ml-1 px-1.5 py-0.5 text-xs"
								>
									{selectedLanguage}
								</Badge>
							{:else}
								<ChevronDown class="w-3.5 h-3.5" />
							{/if}
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-48">
						<DropdownMenu.Item
							onclick={() => (selectedLanguage = null)}
						>
							All Languages
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						{#each availableLanguages as lang}
							<DropdownMenu.Item
								onclick={() => (selectedLanguage = lang)}
							>
								<span class="capitalize">{lang}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="outline" class="gap-2">
							<Tag class="w-4 h-4" />
							Tags
							{#if selectedTags.length > 0}
								<Badge
									variant="secondary"
									class="ml-1 px-1.5 py-0.5 text-xs"
								>
									{selectedTags.length}
								</Badge>
							{:else}
								<ChevronDown class="w-3.5 h-3.5" />
							{/if}
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-48">
						{#each availableTags as tag}
							<DropdownMenu.CheckboxItem
								checked={selectedTags.includes(tag)}
								onCheckedChange={() => toggleTag(tag)}
							>
								{tag}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>

				<Button
					variant={showPublicOnly ? "secondary" : "outline"}
					class="gap-2"
					onclick={() => (showPublicOnly = !showPublicOnly)}
				>
					<Globe class="w-4 h-4" />
					<span class="hidden sm:inline">Public</span>
				</Button>

				{#if searchQuery || selectedLanguage || selectedTags.length > 0 || showPublicOnly}
					<Button variant="ghost" size="icon" onclick={clearFilters}>
						<X class="w-4 h-4" />
					</Button>
				{/if}
			</div>
		</div>

		{#if selectedTags.length > 0}
			<div class="flex flex-wrap gap-1.5">
				{#each selectedTags as tag}
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
		{#if filteredSnippets.length === 0}
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
					{#if searchQuery || selectedLanguage || selectedTags.length > 0}
						Try adjusting your search or filters to find what you're
						looking for.
					{:else}
						Create your first snippet to get started building your
						collection.
					{/if}
				</p>
				{#if !searchQuery && !selectedLanguage && selectedTags.length === 0}
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
				{#each filteredSnippets as snippet (snippet.id)}
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
										{formatDate(snippet.created_at)}
									</span>
									<span class="flex items-center gap-1">
										<Clock class="w-3 h-3" />
										{formatRelativeTime(snippet.updated_at)}
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
		{/if}
	</main>
</div>
