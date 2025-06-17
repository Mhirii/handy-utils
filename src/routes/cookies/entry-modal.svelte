<!-- when use clicks on the key cell of "keys present in both cookies, a modal will open, with this component inside it, this component should present the value from the frist cookie in the left side and the value from the second cookie on the right side"  -->

<script lang="ts">
	export let firstCookieValue: string;
	export let secondCookieValue: string;
	export let key: string;
</script>

<div class="w-full p-6 space-y-6 w-full max-h-[80vh] overflow-y-auto">
	<div class="text-lg font-semibold mb-4">Cookie Value Comparison of {key}</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-2">
			<div class="text-sm font-medium text-muted-foreground">
				First Cookie Value
			</div>
			<div class="p-4 rounded-lg border bg-card text-card-foreground">
				<pre class="whitespace-pre-wrap break-words">{firstCookieValue}</pre>
			</div>
		</div>

		<div class="space-y-2">
			<div class="text-sm font-medium text-muted-foreground">
				Second Cookie Value
			</div>
			<div class="p-4 rounded-lg border bg-card text-card-foreground">
				<pre class="whitespace-pre-wrap break-words">{secondCookieValue}</pre>
			</div>
		</div>
	</div>
</div>
