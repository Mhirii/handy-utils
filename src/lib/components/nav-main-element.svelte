<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { SidebarElement } from "$lib/types/sidebar_elements";
	import Cookie from "@lucide/svelte/icons/cookie";
	import {
		BookOpen,
		Code,
		Settings2Icon,
		FileCodeCorner,
		type LucideIcon,
	} from "@lucide/svelte";

	let {
		item,
	}: {
		item: SidebarElement;
	} = $props();

	const iconsMap: Record<string, LucideIcon> = {
		Cookie,
		Code,
		BookOpen,
		Settings2Icon,
		FileCodeCorner,
	};
</script>

<Sidebar.MenuItem>
	<Sidebar.MenuButton
		tooltipContent={item.title}
		aria-disabled={item.needAuth && item.disabled}
	>
		{#snippet child({ props })}
			<a href={item.url} {...props}>
				{#if iconsMap?.[item.icon]}
					{@const Icon = iconsMap[item.icon]}
					<Icon />
				{/if}
				<span>{item.title}</span>
			</a>
		{/snippet}
	</Sidebar.MenuButton>
</Sidebar.MenuItem>
