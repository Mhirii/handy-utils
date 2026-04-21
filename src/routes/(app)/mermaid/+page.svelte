<script lang="ts">
	import MermaidEditor from "$lib/components/mermaid-editor.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent } from "$lib/components/ui/card";
	import { ComponentIcon, Share2 } from "@lucide/svelte";
	import type { PageData } from "./$types";
	import { toast } from "svelte-sonner";
	import { Separator } from "$lib/components/ui/separator";

	let { data }: { data: PageData } = $props();
	let currentCode = $state(data.initialCode);

	// Safe client-side URL sync
	function encodeBase64Url(str: string): string {
		return btoa(unescape(encodeURIComponent(str)))
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");
	}

	$effect(() => {
		const encoded = currentCode ? encodeBase64Url(currentCode) : "";
		const url = new URL(window.location.href);
		encoded
			? url.searchParams.set("code", encoded)
			: url.searchParams.delete("code");
		history.replaceState({}, "", url.toString());
	});

	async function shareLink() {
		try {
			await navigator.clipboard.writeText(window.location.href);
			toast.info("Shareable link copied to clipboard!");
		} catch {
			console.warn("Clipboard API unavailable");
		}
	}
</script>

<svelte:head>
	<title>Mermaid Live Editor</title>
	<meta
		name="description"
		content="Live preview and editor for Mermaid.js diagrams"
	/>
</svelte:head>

<div class=" w-full flex h-full flex-col gap-4 pb-2">
	<header
		class="flex flex-row gap-4 p-6 pb-0 w-full justify-between items-center"
	>
		<div class="flex items-center gap-3 w-full">
			<div
				class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10"
			>
				<ComponentIcon class="w-5 h-5 text-primary" />
			</div>
			<h1 class="text-2xl font-bold tracking-tight">
				Mermaid Live Editor
			</h1>
		</div>
		<div class="flex items-center justify-between">
			<Button variant="outline" size="sm" onclick={shareLink}>
				<Share2 class="mr-1 h-4 w-4" /> Share Diagram
			</Button>
		</div>
	</header>

	<Separator />
	<!-- Card provides proper border/radius/shadow without breaking flex -->
	<Card class="flex flex-1 min-h-0 flex-col overflow-hidden mx-4 pt-0">
		<CardContent class="flex-1 p-4 min-h-0">
			<MermaidEditor
				initialCode={data.initialCode}
				onCodeChange={(c) => (currentCode = c)}
			/>
		</CardContent>
	</Card>
</div>
