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
	import hljs from "highlight.js";
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import {
		newSnippetSchema,
		type NewSnippetSchema,
	} from "../../routes/(app)/snippets/schema";
	import * as Form from "$lib/components/ui/form/index.js";
	import { CONSTANTS } from "drizzle-orm";
	import FormButton from "./ui/form/form-button.svelte";

	interface Language {
		id: string;
		extension: string;
		color: string;
	}

	let {
		open = $bindable(),
		languages,
		form,
	}: {
		open: boolean;
		languages: Language[];
		form: SuperValidated<Infer<NewSnippetSchema>>;
	} = $props();

	// let newSnippet = $state({
	// 	title: "",
	// 	description: "",
	// 	code: "",
	// 	language: "",
	// 	tags: "",
	// 	isPublic: false,
	// });

	let langOpen = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let tagsError = $state<string | null>(null);

	function closeAndFocusTrigger() {
		langOpen = false;
		tick().then(() => triggerRef.focus());
	}

	const superform = superForm(form, {
		validators: zod4Client(newSnippetSchema),
	});
	const { form: formData, enhance } = superform;

	const MAX_TAGS = 10;
	const MAX_TAG_LENGTH = 30;
	const TAG_PATTERN = /^[a-zA-Z0-9_-]+$/;

	function validateTags(tagsString: string): string | null {
		if (!tagsString.trim()) return null;

		const tags = tagsString
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);

		if (tags.length > MAX_TAGS) {
			return `Maximum ${MAX_TAGS} tags allowed (you have ${tags.length})`;
		}

		for (const tag of tags) {
			if (tag.length > MAX_TAG_LENGTH) {
				return `Tag "${tag}" exceeds ${MAX_TAG_LENGTH} character limit`;
			}
			if (!TAG_PATTERN.test(tag)) {
				return `Tag "${tag}" contains invalid characters (use letters, numbers, hyphens, underscores)`;
			}
		}

		return null;
	}

	$effect(() => {
		tagsError = validateTags($formData.tags);
	});

	function handlePaste(event: ClipboardEvent) {
		let pastedText: string | undefined;

		if ("clipboardData" in event && event.clipboardData) {
			pastedText = event.clipboardData.getData("text");
		} else if ((event as any).originalEvent?.clipboardData) {
			// For some frameworks/browsers, clipboardData may be on originalEvent
			pastedText = (event as any).originalEvent.clipboardData.getData(
				"text",
			);
		} else {
			return;
		}

		if (!pastedText) return;

		const detected = hljs.highlightAuto(pastedText).language;
		if (detected) {
			const match = languages.find(
				(l) =>
					l.id.toLowerCase() === detected.toLowerCase() ||
					l.extension.toLowerCase().includes(detected.toLowerCase()),
			);
			if (match) {
				formData.update((d) => {
					d.language = match.id;
					return d;
				});
			}
		}
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
		<form method="POST" action="?/create" use:enhance>
			<div class="grid gap-4 py-4">
				<Form.Field form={superform} name="title" class="grid gap-2">
					<Form.Control>
						{#snippet children({ props })}
							<Label for="title">Title</Label>
							<Input
								{...props}
								bind:value={$formData.title}
								placeholder="Debounce Function"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field
					form={superform}
					name="description"
					class="grid gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Label for="description">Description</Label>
							<Textarea
								{...props}
								bind:value={$formData.description}
								placeholder="A brief description of what this snippet does..."
								class="min-h-[80px]"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field form={superform} name="code" class="grid gap-2">
					<Form.Control>
						{#snippet children({ props })}
							<Label for="code">Code</Label>
							<Textarea
								{...props}
								bind:value={$formData.code}
								placeholder="Paste your code here..."
								class="min-h-[200px] font-mono text-sm"
								onpaste={handlePaste}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field form={superform} name="language" class="grid gap-2">
					<Form.Control>
						{#snippet children({ props })}
							<Label for="language">Language</Label>
							<input
								{...props}
								type="hidden"
								name="language"
								value={$formData.language}
							/>
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
											{$formData.language ||
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
														{...props}
														onSelect={() => {
															formData.update(
																(d) => {
																	d.language =
																		lang.id;
																	return d;
																},
															);
															closeAndFocusTrigger();
														}}
													>
														<CheckIcon
															class={cn(
																"me-2 size-4",
																superform.capture()
																	.data
																	.language !==
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
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field form={superform} name="tags" class="grid gap-2">
					<Form.Control>
						{#snippet children({ props })}
							<Label for="tags">Tags (comma-separated)</Label>
							<Input
								{...props}
								placeholder="utils, hooks, api"
								bind:value={$formData.tags}
							/>
							{#if tagsError}
								<p class="text-xs text-destructive mt-1">
									{tagsError}
								</p>
							{/if}
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field
					form={superform}
					name="isPublic"
					class="flex items-center gap-2"
				>
					<Form.Control>
						{#snippet children({ props })}
							<Checkbox
								{...props}
								bind:checked={$formData.isPublic}
							/>
							<Label
								for="isPublic"
								class="text-sm font-normal cursor-pointer"
							>
								Make this snippet public
							</Label>
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
				<Dialog.Footer>
					<Form.Button
						variant="outline"
						type="reset"
						onclick={() => (open = false)}
					>
						Cancel
					</Form.Button>
					<Form.Button
						type="submit"
						disabled={!$formData.title ||
							!$formData.code ||
							tagsError !== null}
					>
						Create Snippet
					</Form.Button>
				</Dialog.Footer>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
