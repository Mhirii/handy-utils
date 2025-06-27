<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { page } from "$app/state";

	type breadcrumbEntry = {
		name: string;
		href: string;
		isLast: boolean;
	};

	let defaultEntries: breadcrumbEntry[] = [];

	function buildEntries(path: string) {
		let entries = [];
		let currentHref = "/";
		const pathParts = path?.split("/") ?? ["app"];
		for (let i = 1; i < pathParts.length; i++) {
			currentHref += `${pathParts[i]}`;
			if (i < pathParts.length - 1) {
				currentHref += "/";
			}
			entries.push({
				name: pathParts[i],
				href: currentHref,
				isLast: i === pathParts.length - 1,
			});
		}
		return [
			{ name: "Home", href: "/", isLast: entries.length === 0 },
			...entries,
		];
	}
	let entries = $derived.by(() => buildEntries(page.route.id || "/"));
</script>

<Breadcrumb.Root class="hidden sm:block">
	<Breadcrumb.List>
		{#each entries ?? defaultEntries as entry}
			<Breadcrumb.Item>
				<Breadcrumb.Link href={entry.href} class="capitalize">
					{entry.name}
				</Breadcrumb.Link>
			</Breadcrumb.Item>
			{#if !entry.isLast}
				<Breadcrumb.Separator />
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
