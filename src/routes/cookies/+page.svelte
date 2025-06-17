<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Textarea } from "$lib/components/ui/textarea";
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from "$lib/components/ui/table";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
	} from "$lib/components/ui/card";
	import { onMount } from "svelte";
	import {
		Dialog,
		DialogContent,
		DialogTrigger,
	} from "$lib/components/ui/dialog";
	import EntryModal from "./entry-modal.svelte";

	let firstCookie = "";
	let secondCookie = "";
	let firstCookieKeys: string[] = [];
	let secondCookieKeys: string[] = [];
	let commonKeys: string[] = [];
	let uniqueFirstKeys: string[] = [];
	let uniqueSecondKeys: string[] = [];

	let selectedKey = "";
	let firstCookieValue = "";
	let secondCookieValue = "";

	function parseCookie(cookieStr: string): string[] {
		try {
			return cookieStr
				.split(";")
				.map((pair) => pair.trim().split("=")[0])
				.filter((key) => key.length > 0);
		} catch (e) {
			return [];
		}
	}

	function compareCookies() {
		firstCookieKeys = parseCookie(firstCookie);
		secondCookieKeys = parseCookie(secondCookie);

		commonKeys = firstCookieKeys.filter((key) =>
			secondCookieKeys.includes(key),
		);
		uniqueFirstKeys = firstCookieKeys.filter(
			(key) => !secondCookieKeys.includes(key),
		);
		uniqueSecondKeys = secondCookieKeys.filter(
			(key) => !firstCookieKeys.includes(key),
		);
	}
</script>

<div class="container mx-auto p-4 space-y-6">
	<h1 class="text-3xl font-bold mb-6">Cookie Comparison Tool</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<Card>
			<CardHeader>
				<CardTitle>First Cookie</CardTitle>
				<CardDescription>Paste your first cookie string here</CardDescription>
			</CardHeader>
			<CardContent>
				<Textarea
					bind:value={firstCookie}
					placeholder="Paste your first cookie here..."
					class="min-h-[150px]"
				/>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Second Cookie</CardTitle>
				<CardDescription>Paste your second cookie string here</CardDescription>
			</CardHeader>
			<CardContent>
				<Textarea
					bind:value={secondCookie}
					placeholder="Paste your second cookie here..."
					class="min-h-[150px]"
				/>
			</CardContent>
		</Card>
	</div>

	<div class="flex justify-center">
		<Button onclick={compareCookies} variant="default" size="lg">
			Compare Cookies
		</Button>
	</div>

	{#if firstCookieKeys.length > 0 || secondCookieKeys.length > 0}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Common Keys</CardTitle>
					<CardDescription>Keys present in both cookies</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea class="h-[300px]">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Key</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each commonKeys as key}
									<TableRow>
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<Dialog>
											<DialogTrigger
												class="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 w-full"
												onclick={() => {
													const firstValue =
														firstCookie
															.split(";")
															.find((pair) => pair.trim().startsWith(key))
															?.split("=")[1] || "";
													const secondValue =
														secondCookie
															.split(";")
															.find((pair) => pair.trim().startsWith(key))
															?.split("=")[1] || "";
													selectedKey = key;
													firstCookieValue = firstValue;
													secondCookieValue = secondValue;
												}}
											>
												<TableCell>
													{key}
												</TableCell>
											</DialogTrigger>
											<DialogContent
												class="w-full min-w-[70vw] lg:min-w-[80vw]  p-6 space-y-6 max-h-[80vh] overflow-y-auto"
											>
												<EntryModal
													{key}
													{firstCookieValue}
													{secondCookieValue}
												/>
											</DialogContent>
										</Dialog>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					</ScrollArea>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Unique to First Cookie</CardTitle>
					<CardDescription>Keys only in first cookie</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea class="h-[300px]">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Key</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each uniqueFirstKeys as key}
									<TableRow>
										<TableCell>{key}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					</ScrollArea>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Unique to Second Cookie</CardTitle>
					<CardDescription>Keys only in second cookie</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea class="h-[300px]">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Key</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each uniqueSecondKeys as key}
									<TableRow>
										<TableCell>{key}</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	{/if}
</div>
