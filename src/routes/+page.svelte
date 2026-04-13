<script>
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
</script>

<main class="container mx-auto px-4 py-16 space-y-12 max-w-7xl">
	<div class="text-center space-y-4">
		<h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">
			Handy Utils
		</h1>
		<p class="text-xl text-muted-foreground max-w-2xl mx-auto">
			A collection of useful developer tools designed to streamline your
			workflow
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<Card
			class="flex flex-col transition-all hover:shadow-md hover:border-primary/50"
		>
			<CardHeader>
				<CardTitle>Cookie Comparison</CardTitle>
				<CardDescription>
					Compare different cookies to analyze their similarities and
					differences.
				</CardDescription>
			</CardHeader>
			<CardContent class="mt-auto">
				<Button variant="default" class="w-full p-0 overflow-hidden">
					<a
						href="/cookies"
						class="flex items-center justify-center w-full h-full px-4 py-2"
					>
						Launch Tool
					</a>
				</Button>
			</CardContent>
		</Card>

		<Card
			class="flex flex-col transition-all hover:shadow-md hover:border-primary/50"
		>
			<CardHeader>
				<CardTitle>Base64 Converter</CardTitle>
				<CardDescription>
					Easily encode strings to or decode from Base64 format.
				</CardDescription>
			</CardHeader>
			<CardContent class="mt-auto">
				<Button variant="default" class="w-full p-0 overflow-hidden">
					<a
						href="/base64"
						class="flex items-center justify-center w-full h-full px-4 py-2"
					>
						Launch Tool
					</a>
				</Button>
			</CardContent>
		</Card>

		<Card
			class="flex flex-col transition-all hover:shadow-md hover:border-primary/50"
		>
			<CardHeader>
				<CardTitle>Snippet Manager</CardTitle>
				<CardDescription>
					Store, manage, and quickly retrieve your saved code
					snippets.
				</CardDescription>
			</CardHeader>
			<CardContent class="mt-auto">
				<Button variant="default" class="w-full p-0 overflow-hidden">
					<a
						href="/snippets"
						class="flex items-center justify-center w-full h-full px-4 py-2"
					>
						Launch Tool
					</a>
				</Button>
			</CardContent>
		</Card>

		<Card
			class="flex flex-col transition-all hover:shadow-md hover:border-primary/50"
		>
			<CardHeader>
				<CardTitle>Token Calculator</CardTitle>
				<CardDescription>
					Calculate token count and estimate pricing for various AI
					models.
				</CardDescription>
			</CardHeader>
			<CardContent class="mt-auto">
				<Button variant="default" class="w-full p-0 overflow-hidden">
					<a
						href="/tokens"
						class="flex items-center justify-center w-full h-full px-4 py-2"
					>
						Launch Tool
					</a>
				</Button>
			</CardContent>
		</Card>
	</div>
</main>
