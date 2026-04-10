<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import * as Card from "$lib/components/ui/card";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import {
		Calendar,
		Clock,
		Globe,
		Lock,
		Copy,
		Check,
		Ellipsis,
		Trash2,
		SquarePen,
	} from "@lucide/svelte";
	import { Highlight } from "svelte-highlight";

	import theme from "svelte-highlight/styles/github-dark";
	import * as languages from "svelte-highlight/languages";

	interface Snippet {
		id: number;
		title: string;
		description: string;
		code: string;
		language: string;
		languageColor: string | null;
		tags: string[];
		isPublic: boolean;
		createdAt: string;
		updatedAt: string;
	}

	let { snippet }: { snippet: Snippet } = $props();

	let copiedId = $state<number | null>(null);

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

	function copyCode(id: number, code: string) {
		navigator.clipboard.writeText(code);
		copiedId = id;
		setTimeout(() => {
			copiedId = null;
		}, 2000);
	}

	// @ts-ignore
	const lang = languages?.[snippet.language];
</script>

<Card.Root
	class="group relative flex flex-col overflow-hidden transition-all hover:shadow-md"
>
	<Card.Header>
		<div class="flex items-start justify-between gap-2">
			<div class="flex-1 min-w-0">
				<Card.Title class="truncate text-lg">{snippet.title}</Card.Title
				>
				{#if snippet.description}
					<Card.Description class="line-clamp-2">
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
						<Ellipsis class="w-4 h-4" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item>
						<SquarePen class="w-4 h-4 mr-2" />
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
		<div class="relative rounded-md bg-muted/50 overflow-hidden">
			<Highlight
				code={snippet.code}
				language={lang}
				class="text-xs overflow-x-auto max-h-48 leading-relaxed "
			/>
			<div class="absolute top-2 right-2">
				<Button
					variant="secondary"
					size="icon"
					class="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
					onclick={() => copyCode(snippet.id, snippet.code)}
				>
					{#if copiedId === snippet.id}
						<Check class="w-3.5 h-3.5 text-green-600" />
					{:else}
						<Copy class="w-3.5 h-3.5" />
					{/if}
				</Button>
			</div>
		</div>

		<div class="flex flex-wrap gap-1.5">
			<Badge
				variant="outline"
				style="background-color:{snippet.languageColor || '#ccc'};"
				class="text-xs text-black"
			>
				{snippet.language}
			</Badge>
			{#each snippet.tags.slice(0, 3) as tag}
				<Badge variant="secondary">{tag}</Badge>
			{/each}
			{#if snippet.tags.length > 3}
				<Badge variant="outline" class="text-muted-foreground">
					+{snippet.tags.length - 3}
				</Badge>
			{/if}
		</div>
	</Card.Content>

	<Card.Footer>
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

<svelte:head>
	{@html theme}
</svelte:head>
