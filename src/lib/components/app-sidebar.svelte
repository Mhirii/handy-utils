<script lang="ts" module>
	import SquareTerminalIcon from "@lucide/svelte/icons/square-terminal";
	import BotIcon from "@lucide/svelte/icons/bot";
	import BookOpenIcon from "@lucide/svelte/icons/book-open";
	import Settings2Icon from "@lucide/svelte/icons/settings-2";
	import CommandIcon from "@lucide/svelte/icons/command";
	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg",
		},
		navMain: [
			{
				title: "Cookie Tools",
				url: "/cookies",
				icon: Cookie,
				isActive: true,
			},
			{
				title: "Base64 Tools",
				url: "/base64",
				icon: Code,
			},
			{
				title: "Documentation",
				url: "#",
				icon: BookOpenIcon,
			},
			{
				title: "Settings",
				url: "#",
				icon: Settings2Icon,
			},
		],
	};
</script>

<script lang="ts">
	import type { ComponentProps } from "svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import { Code, Cookie } from "@lucide/svelte";
	import type { SidebarElement } from "$lib/types/sidebar_elements";
	let {
		elements,
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		elements: SidebarElement[];
	} = $props();
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
		<NavUser user={data.user} />
	</Sidebar.Footer>
</Sidebar.Root>
