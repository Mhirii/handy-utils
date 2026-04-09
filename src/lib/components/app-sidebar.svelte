<script lang="ts" module>
	import CommandIcon from "@lucide/svelte/icons/command";
</script>

<script lang="ts">
	import type { ComponentProps } from "svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import type { SidebarElement } from "$lib/types/sidebar_elements";
	import type { NavUserType, UserPromise } from "$lib/types/user";
	import { Button } from "./ui/button";
	import { LogInIcon, LockIcon } from "@lucide/svelte";
	import { goto } from "$app/navigation";
	let {
		elements,
		user,
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		elements: SidebarElement[];
		user?: UserPromise | undefined;
	} = $props();

	const sidebar = Sidebar.useSidebar();
</script>

<Sidebar.Root
	class="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
	{...restProps}
	collapsible={"icon"}
	variant={"floating"}
>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<div
								class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<CommandIcon class="size-4" />
							</div>
							<div
								class="grid flex-1 text-left text-sm leading-tight"
							>
								<span class="truncate font-medium"
									>Acme Inc</span
								>
								<span class="truncate text-xs">Enterprise</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={elements} />
	</Sidebar.Content>
	<Sidebar.Footer>
		{#if user}
			<NavUser {user} />
		{:else}
			<Button onclick={() => goto("/auth/login")}>
				{#if sidebar.open}
					Login
				{:else}
					<LogInIcon />
				{/if}
			</Button>
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>
