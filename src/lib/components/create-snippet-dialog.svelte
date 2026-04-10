<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Label } from "$lib/components/ui/label";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Popover from "$lib/components/ui/popover";
	import * as Command from "$lib/components/ui/command";
	import { ChevronsUpDownIcon, CheckIcon } from "@lucide/svelte";
	import { cn } from "$lib/utils";
	import { tick } from "svelte";

	interface Language {
		id: string;
		extension: string;
		color: string;
	}

	let {
		open = $bindable(),
		languages,
	}: {
		open: boolean;
		languages: Language[];
	} = $props();

	let newSnippet = $state({
		title: "",
		description: "",
		code: "",
		language: "",
		tags: "",
		isPublic: false,
	});

	let langOpen = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	function closeAndFocusTrigger() {
		langOpen = false;
		tick().then(() => triggerRef.focus());
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Create New Snippet</Dialog.Title>
			<Dialog.Description>
				Add a new code snippet to your collection. Fill in the details
				below.
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
					<Popover.Root bind:open={langOpen}>
						<Popover.Trigger bind:ref={triggerRef}>
							{#snippet child({ props })}
								<Button
									variant="outline"
									class="w-[200px] justify-between"
									{...props}
									role="combobox"
									aria-expanded={langOpen}
								>
									{newSnippet.language ||
										"Select a language..."}
									<ChevronsUpDownIcon
										class="ms-2 size-4 shrink-0 opacity-50"
									/>
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-[200px] p-0">
							<Command.Root>
								<Command.Input
									placeholder="Search languages..."
								/>
								<Command.List>
									<Command.Empty
										>No languages found.</Command.Empty
									>
									<Command.Group>
										{#each languages as lang}
											<Command.Item
												value={lang.id}
												onSelect={() => {
													newSnippet.language =
														lang.id;
													closeAndFocusTrigger();
												}}
											>
												<CheckIcon
													class={cn(
														"me-2 size-4",
														newSnippet.language !==
															lang.id &&
															"text-transparent",
													)}
												/>
												{lang.id}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
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
					onclick={() => (open = false)}
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
