<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import * as Card from "$lib/components/ui/card";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Dialog from "$lib/components/ui/dialog";
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
	import { Highlight, HighlightAuto } from "svelte-highlight";
	import { toast } from "svelte-sonner";

	import theme from "svelte-highlight/styles/github-dark";
	import * as languages from "svelte-highlight/languages";
	import { ScrollArea } from "./ui/scroll-area";

	interface Snippet {
		id: number;
		title: string;
		description: string;
		code: string;
		language?: string;
		languageColor: string | null;
		tags: string[];
		isPublic: boolean;
		createdAt: string;
		updatedAt: string;
	}

	let { snippet, onDelete, onEdit }: { snippet: Snippet; onDelete?: () => void; onEdit?: () => void } = $props();

	let copiedId = $state<number | null>(null);
	let showDeleteDialog = $state(false);
	let isDeleting = $state(false);

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
		navigator.clipboard
			.writeText(code)
			.then(() => {
				copiedId = id;
				toast.success("Copied to clipboard");
				setTimeout(() => {
					copiedId = null;
				}, 2000);
			})
			.catch(() => {
				// Fallback: copy to clipboard using textarea
				const textarea = document.createElement("textarea");
				textarea.value = code;
				textarea.style.position = "fixed";
				textarea.style.opacity = "0";
				document.body.appendChild(textarea);
				textarea.select();
				try {
					document.execCommand("copy");
					copiedId = id;
					toast.success("Copied to clipboard");
					setTimeout(() => {
						copiedId = null;
					}, 2000);
				} catch {
					toast.error(
						"Failed to copy. Your browser may not support clipboard access.",
					);
				} finally {
					document.body.removeChild(textarea);
				}
			});
	}

	async function handleDelete() {
		isDeleting = true;
		try {
			const formData = new FormData();
			formData.append("snippetId", snippet.id.toString());

			const response = await fetch("?/delete", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (!response.ok || result.type!=='success') {
				console.log(response)
				console.log((result))
				toast.error(result.message || "Failed to delete snippet");
				return;
			}

			toast.success("Snippet deleted successfully");
			showDeleteDialog = false;

			// Call the optional callback to notify parent component
			onDelete?.();
		} catch (error) {
			toast.error("Failed to delete snippet");
			console.error("Delete error:", error);
		} finally {
			isDeleting = false;
		}
	}

	// @ts-ignore
	let lang = languages?.[snippet.language];
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
					<DropdownMenu.Item onclick={() => onEdit?.()}>
						<SquarePen class="w-4 h-4 mr-2" />
						Edit
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						class="text-destructive focus:text-destructive"
						onclick={() => (showDeleteDialog = true)}
					>
						<Trash2 class="w-4 h-4 mr-2" />
						Delete
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</Card.Header>

	<Card.Content class="flex-1 flex flex-col gap-3">
		<ScrollArea
			class="relative rounded-md bg-muted/50 overflow-hidden max-h-48"
		>
			{#if lang}
				<Highlight
					code={snippet.code}
					language={lang}
					class="text-xs leading-relaxed "
				/>
			{:else}
				<HighlightAuto
					code={snippet.code}
					class="text-xs leading-relaxed "
				/>
			{/if}
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
		</ScrollArea>

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

<Dialog.Root bind:open={showDeleteDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Snippet</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete "{snippet.title}"? This action cannot
				be undone.
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex justify-end gap-3">
			<Button
				variant="outline"
				onclick={() => (showDeleteDialog = false)}
				disabled={isDeleting}
			>
				Cancel
			</Button>
			<Button
				variant="destructive"
				onclick={handleDelete}
				disabled={isDeleting}
			>
				{isDeleting ? "Deleting..." : "Delete"}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>

<svelte:head>
	{@html theme}
</svelte:head>
