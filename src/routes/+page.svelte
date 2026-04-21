<script>
	import CommandMenu from "$lib/components/command-menu.svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import tools from "$lib/tools";
	import { cn } from "$lib/utils";
	import { ChevronRightIcon, LockIcon } from "@lucide/svelte";

	let _tools = tools;
	if (tools.length % 3 !== 0) {
		_tools.push({
			title: "More Tools Coming",
			url: "/",
			desc: "Stay tuned for exciting new features and utilities.",
			icon: LockIcon,
			disabled: true,
		});
	}
</script>

<svelte:head>
	<title>Handy Utils</title>
	<meta
		name="description"
		content="A curated collection of lightweight, privacy-focused developer tools designed to streamline your daily workflow. Optional sign-ups, no tracking—just utilities."
	/>
</svelte:head>

<span class="hidden">
	<CommandMenu />
</span>
<main class="min-h-screen bg-background relative overflow-hidden">
	<div
		class="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"
	></div>

	<div
		class="absolute left-1/4 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]"
	></div>
	<div
		class="absolute right-1/4 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]"
	></div>

	<div class="container mx-auto px-4 py-16 md:py-24 max-w-7xl relative">
		<header class="text-center space-y-6 mb-16">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
			>
				<span
					class="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"
				>
				</span>
				<span
					class="inline-flex items-center gap-1 text-sm font-medium"
				>
					<span class="line-through text-muted-foreground/70">
						All
					</span>
					<span class="text-xs font-bold text-sidebar-primary"
						>Most</span
					>
					<span class="">tools run locally & securely</span>
				</span>
			</div>

			<h1
				class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground"
			>
				Handy <span
					class="bg-gradient-to-r from-primary to-sidebar-primary bg-clip-text text-transparent"
					>Utils</span
				>
			</h1>

			<p
				class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
			>
				A curated collection of lightweight, privacy-focused developer
				tools designed to streamline your daily workflow.
				<br />
				Optional sign-ups, no tracking—just utilities.
			</p>
		</header>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each tools as tool}
				<Card
					class={cn(
						"group flex flex-col h-full border border-border/40  backdrop-blur-sm transition-all duration-300",
						tool.disabled
							? "hidden md:flex bg-muted/20 opacity-80"
							: "bg-card/60  hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1",
					)}
				>
					<CardHeader class="flex-1 pb-4">
						<div
							class={cn(
								"w-12 h-12 rounded-xl  flex items-center justify-center mb-4 border",
								tool.disabled
									? "bg-muted/50 text-muted-foreground border-border/50"
									: "bg-gradient-to-br from-primary/20 to-primary/5 text-primary border-primary/20",
							)}
						>
							<svelte:component this={tool.icon} />
						</div>
						<CardTitle
							class={cn(
								"text-xl font-semibold tracking-tight",
								tool.disabled ? "text-muted-foreground" : "",
							)}
						>
							{tool.title}
						</CardTitle>
						<CardDescription
							class={cn(
								"mt-2 leading-relaxed",
								tool.disabled ? "text-muted-foreground" : "",
							)}>{tool.desc}</CardDescription
						>
					</CardHeader>
					<CardContent class="pt-0">
						<a
							href={tool.url}
							class="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
						>
							<!-- class="w-full group-hover:bg-primary group-hover:text-primary-foreground border-1 border-transparent hover:bg-sidebar-primary/20 hover:border-sidebar-primary hover:text-primary transition-all duration-200 font-medium" -->
							<Button
								variant={tool.disabled
									? "outline"
									: "secondary"}
								class={cn(
									"w-full ",
									tool.disabled
										? "font-medium cursor-not-allowed opacity-60"
										: "group-hover:bg-primary group-hover:text-primary-foreground border-1 border-transparent",
								)}
								disabled={tool.disabled}
							>
								{tool.disabled ? "Coming Soon" : "Launch Tool"}
								<ChevronRightIcon />
							</Button>
						</a>
					</CardContent>
				</Card>
			{/each}
			<!-- <Card
				class="group flex flex-col h-full border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
			>
				<CardHeader class="flex-1 pb-4">
					<div
						class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 text-primary border border-primary/20"
					>
						<CookieIcon />
					</div>
					<CardTitle class="text-xl font-semibold tracking-tight"
						>Cookie Comparison</CardTitle
					>
					<CardDescription class="mt-2 leading-relaxed"
						>Compare different cookies to analyze their similarities
						and differences.</CardDescription
					>
				</CardHeader>
				<CardContent class="pt-0">
					<a
						href="/cookies"
						class="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
					>
						<Button
							variant="secondary"
							class="w-full group-hover:bg-primary group-hover:text-primary-foreground border-1 border-transparent
							hover:bg-sidebar-primary/20 hover:border-sidebar-primary hover:text-primary transition-all duration-200 font-medium"
						>
							Launch Tool
							<ChevronRightIcon />
						</Button>
					</a>
				</CardContent>
			</Card>

			<Card
				class="group flex flex-col h-full border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
			>
				<CardHeader class="flex-1 pb-4">
					<div
						class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 text-primary border border-primary/20"
					>
						<CodeIcon />
					</div>
					<CardTitle class="text-xl font-semibold tracking-tight"
						>Base64 Converter</CardTitle
					>
					<CardDescription class="mt-2 leading-relaxed"
						>Easily encode strings to or decode from Base64 format
						in real-time.</CardDescription
					>
				</CardHeader>
				<CardContent class="pt-0">
					<a
						href="/base64"
						class="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
					>
						<Button
							variant="secondary"
							class="w-full group-hover:bg-primary group-hover:text-primary-foreground border-1 border-transparent
							hover:bg-sidebar-primary/20 hover:border-sidebar-primary hover:text-primary transition-all duration-200 font-medium"
						>
							Launch Tool
							<ChevronRightIcon />
						</Button>
					</a>
				</CardContent>
			</Card>

			<Card
				class="group flex flex-col h-full border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
			>
				<CardHeader class="flex-1 pb-4">
					<div
						class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 text-primary border border-primary/20"
					>
						<FileCodeCorner />
					</div>
					<CardTitle class="text-xl font-semibold tracking-tight"
						>Snippet Manager</CardTitle
					>
					<CardDescription class="mt-2 leading-relaxed"
						>Store, manage, and quickly retrieve your saved code
						snippets.</CardDescription
					>
				</CardHeader>
				<CardContent class="pt-0">
					<a
						href="/snippets"
						class="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
					>
						<Button
							variant="secondary"
							class="w-full group-hover:bg-primary group-hover:text-primary-foreground border-1 border-transparent
							hover:bg-sidebar-primary/20 hover:border-sidebar-primary hover:text-primary transition-all duration-200 font-medium"
						>
							Launch Tool
							<ChevronRightIcon />
						</Button>
					</a>
				</CardContent>
			</Card>

			<Card
				class="group flex flex-col h-full border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
			>
				<CardHeader class="flex-1 pb-4">
					<div
						class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 text-primary border border-primary/20"
					>
						<WholeWord />
					</div>
					<CardTitle class="text-xl font-semibold tracking-tight"
						>Token Calculator</CardTitle
					>
					<CardDescription class="mt-2 leading-relaxed"
						>Calculate token count and estimate pricing for various
						AI models.</CardDescription
					>
				</CardHeader>
				<CardContent class="pt-0">
					<a
						href="/tokens"
						class="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
					>
						<Button
							variant="secondary"
							class="w-full group-hover:bg-primary group-hover:text-primary-foreground border-1 border-transparent
							hover:bg-sidebar-primary/20 hover:border-sidebar-primary hover:text-primary transition-all duration-200 font-medium"
						>
							Launch Tool
							<ChevronRightIcon />
						</Button>
					</a>
				</CardContent>
			</Card>

			<Card
				class="group flex flex-col h-full border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
			>
				<CardHeader class="flex-1 pb-4">
					<div
						class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 text-primary border border-primary/20"
					>
						<ComponentIcon />
					</div>
					<CardTitle class="text-xl font-semibold tracking-tight"
						>Mermaid Diagram</CardTitle
					>
					<CardDescription class="mt-2 leading-relaxed"
						>Create beautiful diagrams using the Mermaid syntax with
						live preview.</CardDescription
					>
				</CardHeader>
				<CardContent class="pt-0">
					<a
						href="/mermaid"
						class="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
					>
						<Button
							variant="secondary"
							class="w-full group-hover:bg-primary group-hover:text-primary-foreground border-1 border-transparent
							hover:bg-sidebar-primary/20 hover:border-sidebar-primary hover:text-primary transition-all duration-200 font-medium"
						>
							Launch Tool
							<ChevronRightIcon />
						</Button>
					</a>
				</CardContent>
			</Card>

			<Card
				class="group flex flex-col h-full border border-border/40 bg-muted/20 backdrop-blur-sm opacity-80 transition-all duration-300"
			>
				<CardHeader class="flex-1 pb-4">
					<div
						class="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4 text-muted-foreground border border-border/50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><rect
								x="3"
								y="11"
								width="18"
								height="11"
								rx="2"
								ry="2"
							/><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg
						>
					</div>
					<CardTitle
						class="text-xl font-semibold tracking-tight text-muted-foreground"
						>More Tools Coming</CardTitle
					>
					<CardDescription
						class="mt-2 leading-relaxed text-muted-foreground"
						>Stay tuned for exciting new features and utilities.</CardDescription
					>
				</CardHeader>
				<CardContent class="pt-0">
					<Button
						variant="outline"
						disabled
						class="w-full font-medium cursor-not-allowed opacity-60"
					>
						Coming Soon
					</Button>
				</CardContent>
			</Card> -->
		</div>

		<footer class="mt-20 pt-8 border-t border-border/50 text-center">
			<p class="text-sm text-muted-foreground">
				&copy; {new Date().getFullYear()} Handy Utils. Open-source & privacy-first.
			</p>
			<div class="flex justify-center gap-4 mt-4">
				<a
					href="https://github.com/mhirii/handy-utils"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground hover:text-primary transition-colors text-sm"
				>
					GitHub
				</a>
				<span class="text-muted-foreground/50">•</span>
				<a
					href="/"
					class="text-muted-foreground hover:text-primary transition-colors text-sm"
				>
					Documentation
				</a>
			</div>
		</footer>
	</div>
</main>
