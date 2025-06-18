<script lang="ts">
	import { Button } from "$lib/components/ui/button";
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
	import {
		Dialog,
		DialogContent,
		DialogTrigger,
	} from "$lib/components/ui/dialog";
	import EntryModal from "./entry-modal.svelte";
	import SingleEntryModal from "./single-entry-modal.svelte";
	import CookieInput from "./cookie-input.svelte";

	let error = "";

	function parseCookie(cookieStr: string): Map<string, string> {
		const map = new Map<string, string>();
		try {
			cookieStr
				.split(";")
				.map((pair) => pair.trim())
				.forEach((pair) => {
					const [key, value] = pair.split("=");
					map.set(key, value);
				});
			return map;
		} catch (e) {
			error =
				(typeof e === "object" &&
					!!e &&
					"message" in e &&
					(typeof e?.message === "string" ? e?.message : `${e?.message}`)) ||
				"Error parsing cookie";
			return map;
		}
	}

	let firstCookie = "";
	let secondCookie = "";
	let firstCookieMap = new Map<string, string>();
	let secondCookieMap = new Map<string, string>();
	let commonMap = new Map<string, string>();

	let firstCookieKeys: string[] = Array.from(firstCookieMap.keys());
	let secondCookieKeys: string[] = Array.from(secondCookieMap.keys());
	let commonKeys: string[] = [];
	let uniqueFirstKeys: string[] = [];
	let uniqueSecondKeys: string[] = [];

	let selectedKey = "";
	let firstCookieValue = "";
	let secondCookieValue = "";

	function compareCookies() {
		firstCookieMap = parseCookie(firstCookie);
		secondCookieMap = parseCookie(secondCookie);

		firstCookieKeys = Array.from(firstCookieMap.keys());
		secondCookieKeys = Array.from(secondCookieMap.keys());

		commonKeys = firstCookieKeys.filter((key) =>
			secondCookieKeys.includes(key),
		);
		commonMap = new Map<string, string>();
		for (const key of commonKeys) {
			const val = firstCookieMap.get(key);
			if (val) commonMap.set(key, val);
		}
		uniqueFirstKeys = firstCookieKeys.filter(
			(key) => !secondCookieKeys.includes(key),
		);
		uniqueSecondKeys = secondCookieKeys.filter(
			(key) => !firstCookieKeys.includes(key),
		);
	}

	$: if (firstCookie || secondCookie) {
		compareCookies();
	}
</script>

<div class="container mx-auto p-4 space-y-6">
	<h1 class="text-3xl font-bold mb-6">Cookie Comparison Tool</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<CookieInput bind:cookie={firstCookie} index="first" />
		<CookieInput bind:cookie={secondCookie} index="second" />
	</div>

	<div class="flex justify-center">
		<Button onclick={compareCookies} variant="default" size="lg">
			Compare Cookies
		</Button>
	</div>

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
												const firstValue = firstCookieMap.get(key) || "";
												const secondValue = secondCookieMap.get(key) || "";
												selectedKey = key;
												firstCookieValue = firstValue;
												secondCookieValue = secondValue;
											}}
										>
											<TableCell class="w-full flex justify-between">
												<p>
													{key}
												</p>
												<!-- {#if firstCookieValue === secondCookieValue} -->
												<!-- 	<Badge variant="default">Same</Badge> -->
												<!-- {/if} -->
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
									<Dialog>
										<DialogTrigger
											class="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 w-full"
											onclick={() => {}}
										>
											<TableCell>
												{key}
											</TableCell>
										</DialogTrigger>
										<DialogContent
											class="w-full min-w-[70vw] lg:min-w-[80vw]  p-6 space-y-6 max-h-[80vh] overflow-y-auto"
										>
											<SingleEntryModal
												{key}
												CookieValue={firstCookieMap.get(key)!}
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
									<Dialog>
										<DialogTrigger
											class="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 w-full"
											onclick={() => {}}
										>
											<TableCell>
												{key}
											</TableCell>
										</DialogTrigger>
										<DialogContent
											class="w-full min-w-[70vw] lg:min-w-[80vw]  p-6 space-y-6 max-h-[80vh] overflow-y-auto"
										>
											<SingleEntryModal
												{key}
												CookieValue={secondCookieMap.get(key)!}
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
	</div>
</div>
