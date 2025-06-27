<script lang="ts">
	import CalculatorIcon from "@lucide/svelte/icons/calculator";
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import SmileIcon from "@lucide/svelte/icons/smile";
	import UserIcon from "@lucide/svelte/icons/user";
	import * as Command from "$lib/components/ui/command/index.js";
	import { Button } from "./ui/button";
	import type { Component } from "svelte";
	import { Code, Cookie } from "@lucide/svelte";

	let open = $state(false);

	type CommandEntry = {
		name: string;
		href: string;
		icon: Component;
	};
	let toolEntries: CommandEntry[] = [
		{
			name: "Cookie Tools",
			href: "/cookies",
			icon: Cookie,
		},
		{
			name: "Base64 Tools",
			href: "/base64",
			icon: Code,
		},
	];

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Button
	variant="outline"
	onclick={() => {
		open = !open;
	}}
>
	<p class="text-muted-foreground text-sm">
		Press
		<kbd
			class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100"
		>
			<span class="text-xs">⌘</span>J
		</kbd>
	</p>
	<Command.Dialog bind:open>
		<Command.Input placeholder="Type a command or search..." />
		<Command.List>
			<Command.Empty>No results found.</Command.Empty>
			<Command.Group heading="Tools">
				{#each toolEntries as tool}
					<a href={tool.href} onclick={() => (open = false)}>
						<Command.Item>
							<tool.icon class="mr-2 size-4" />
							<span>{tool.name}</span>
						</Command.Item>
					</a>
				{/each}
			</Command.Group>
			<Command.Separator />
			<Command.Group heading="Settings">
				<Command.Item>
					<UserIcon class="mr-2 size-4" />
					<span>Profile</span>
					<Command.Shortcut>⌘P</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<SettingsIcon class="mr-2 size-4" />
					<span>Settings</span>
					<Command.Shortcut>⌘S</Command.Shortcut>
				</Command.Item>
			</Command.Group>
		</Command.List>
	</Command.Dialog>
</Button>
