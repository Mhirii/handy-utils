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

<main class="container mx-auto px-4 py-16 space-y-12">
	<div class="text-center space-y-4">
		<h1 class="text-4xl font-bold tracking-tight">Cookie Analysis Tools</h1>
		<p class="text-xl text-muted-foreground">
			Powerful tools to analyze and compare cookies
		</p>
	</div>

	<div class="flex flex-row gap-4 justify-center">
		<Card class="w-full max-w-md h-auto justify-between">
			<CardHeader>
				<CardTitle>Cookie Comparison Tool</CardTitle>
				<CardDescription>
					Compare different cookies to analyze their similarities and
					differences
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button variant="default" class="w-full">
					<a href="/cookies" class="w-full">Launch Tool</a>
				</Button>
			</CardContent>
		</Card>
		<Card class="w-full max-w-md h-auto justify-between">
			<CardHeader>
				<CardTitle>Base64 Decoding/Encoding Tool</CardTitle>
				<CardDescription>
					Decode Base64 to plain text and vice versa
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button variant="default" class="w-full">
					<a href="/base64" class="w-full">Launch Tool</a>
				</Button>
			</CardContent>
		</Card>
	</div>
</main>
