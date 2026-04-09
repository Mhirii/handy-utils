<script lang="ts">
	import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
	import BellIcon from "@lucide/svelte/icons/bell";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import CreditCardIcon from "@lucide/svelte/icons/credit-card";
	import LogOutIcon from "@lucide/svelte/icons/log-out";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";

	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { NavUserType, UserPromise } from "$lib/types/user";
	import { Skeleton } from "./ui/skeleton";

	let {
		user,
	}: {
		user: UserPromise;
	} = $props();

	$effect(() => {
		console.log("user", user);
	});

	const sidebar = Sidebar.useSidebar();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="size-8 rounded-lg">
							{#await user}
								<Skeleton class="rounded-lg w-8 h-8" />
							{:then u}
								<Avatar.Image
									src={""}
									alt={u?.name?.first_name || u?.display}
								/>
								<Avatar.Fallback class="rounded-lg">
									{u?.display.charAt(0).toUpperCase()}
								</Avatar.Fallback>
							{/await}
						</Avatar.Root>
						<div
							class="grid flex-1 text-left text-sm leading-tight"
						>
							{#await user}
								<Skeleton class="w-full h-4" />
							{:then u}
								<span class="truncate font-medium">
									{u?.name?.first_name || u?.display}
								</span>
								<span class="truncate text-xs">
									{u?.emails[0]?.email}
								</span>
							{/await}
						</div>
						<ChevronsUpDownIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? "bottom" : "right"}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div
						class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
					>
						<Avatar.Root class="size-8 rounded-lg">
							{#await user}
								<Skeleton class="rounded-lg w-8 h-8" />
							{:then u}
								<Avatar.Image
									src={""}
									alt={u?.name?.first_name || u?.display}
								/>
								<Avatar.Fallback class="rounded-lg">
									{u?.display.charAt(0).toUpperCase()}
								</Avatar.Fallback>
							{/await}
						</Avatar.Root>
						<div
							class="grid flex-1 text-left text-sm leading-tight"
						>
							{#await user}
								<Skeleton class="w-full h-4" />
							{:then u}
								<span class="truncate font-medium">
									{u?.name?.first_name || u?.display}
								</span>
								<span class="truncate text-xs">
									{u?.emails[0]?.email}
								</span>
							{/await}
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<SparklesIcon />
						Upgrade to Pro
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<BadgeCheckIcon />
						Account
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CreditCardIcon />
						Billing
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<BellIcon />
						Notifications
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<LogOutIcon />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
