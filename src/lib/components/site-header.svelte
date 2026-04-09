<script lang="ts">
	import SidebarIcon from "@lucide/svelte/icons/sidebar";
	import SearchForm from "./search-form.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { toggleMode, mode } from "mode-watcher";
	import Breadcrumbs from "./breadcrumbs.svelte";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import {
		BadgeCheckIcon,
		BellIcon,
		LogOutIcon,
		SunIcon,
		MoonIcon,
		LogInIcon,
	} from "@lucide/svelte";
	import CommandMenu from "./command-menu.svelte";
	import type { UserPromise } from "$lib/types/user";
	import { Skeleton } from "./ui/skeleton";
	import { goto } from "$app/navigation";

	const sidebar = Sidebar.useSidebar();

	let {
		user,
	}: {
		user?: UserPromise | undefined;
	} = $props();
</script>

<header
	class="bg-background sticky top-0 z-50 flex w-full items-center border-b"
>
	<div
		class="h-(--header-height) flex w-full items-center gap-2 px-4 md:pl-2 justify-between"
	>
		<div class="flex items-center gap-2">
			<Button
				class="size-8 md:px-6"
				variant="ghost"
				size="icon"
				onclick={sidebar.toggle}
			>
				<SidebarIcon />
			</Button>
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumbs />
		</div>
		<div class="flex-1 flex items-center gap-2 justify-end">
			<!-- <SearchForm class="w-full sm:ml-auto sm:w-auto" /> -->
			<CommandMenu {user} />

			<DropdownMenu.Root>
				{#if user}
					<DropdownMenu.Trigger>
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
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
						side={sidebar.isMobile ? "bottom" : "bottom"}
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
											alt={u?.name?.first_name ||
												u?.display}
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
							<DropdownMenu.Item
								class="capitalize"
								onclick={toggleMode}
							>
								{#if mode.current === "dark"}
									<MoonIcon />
								{:else}
									<SunIcon />
								{/if}
								{mode.current} theme
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<BadgeCheckIcon />
								Account
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
				{:else}
					<Button onclick={() => goto("/auth/login")}>
						Login
						<LogInIcon />
					</Button>
				{/if}
			</DropdownMenu.Root>
		</div>
	</div>
</header>
