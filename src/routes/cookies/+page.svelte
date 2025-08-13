<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import CookieInput from "./cookie-input.svelte";
	import CookieComparisonTable from "$lib/components/cookies/CookieComparisonTable.svelte";

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

	let firstCookieKeys: string[] = Array.from(firstCookieMap.keys());
	let secondCookieKeys: string[] = Array.from(secondCookieMap.keys());
	let commonKeys: string[] = [];
	let uniqueFirstKeys: string[] = [];
	let uniqueSecondKeys: string[] = [];

	function compareCookies() {
		firstCookieMap = parseCookie(firstCookie);
		secondCookieMap = parseCookie(secondCookie);

		firstCookieKeys = Array.from(firstCookieMap.keys());
		secondCookieKeys = Array.from(secondCookieMap.keys());

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

	$: if (firstCookie || secondCookie) {
		compareCookies();
	}
</script>

<div class="p-4 space-y-6">
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
		<CookieComparisonTable
			title="Common Keys"
			description="Keys present in both cookies"
			type="common"
			{firstCookieMap}
			{secondCookieMap}
			keys={commonKeys}
		/>
		<CookieComparisonTable
			title="Unique to First Cookie"
			description="Keys only in first cookie"
			type="uniqueFirst"
			{firstCookieMap}
			{secondCookieMap}
			keys={uniqueFirstKeys}
		/>
		<CookieComparisonTable
			title="Unique to Second Cookie"
			description="Keys only in second cookie"
			type="uniqueSecond"
			{firstCookieMap}
			{secondCookieMap}
			keys={uniqueSecondKeys}
		/>
	</div>
</div>
