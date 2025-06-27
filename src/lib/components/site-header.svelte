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
	} from "@lucide/svelte";

	const sidebar = Sidebar.useSidebar();

	let user = {
		name: "John Doe",
		email: "john@example.com",
		avatar: "/avatars/shadcn.jpg",
	};
</script>

<header
	class="bg-background sticky top-0 z-50 flex w-full items-center border-b"
>
	<div class="h-(--header-height) flex w-full items-center gap-2 px-4 md:pl-2">
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
		<div class="flex-1 flex items-center gap-2">
			<SearchForm class="w-full sm:ml-auto sm:w-auto" />

			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root class="size-8 rounded-lg">
						<Avatar.Image src={user.avatar} alt={user.name} />
						<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
					side={sidebar.isMobile ? "bottom" : "bottom"}
					align="end"
					sideOffset={4}
				>
					<DropdownMenu.Label class="p-0 font-normal">
						<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							<Avatar.Root class="size-8 rounded-lg">
								<Avatar.Image src={user.avatar} alt={user.name} />
								<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
							</Avatar.Root>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-medium">{user.name}</span>
								<span class="truncate text-xs">{user.email}</span>
							</div>
						</div>
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item class="capitalize" onclick={toggleMode}>
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
			</DropdownMenu.Root>
		</div>
	</div>
</header>
