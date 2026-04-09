<script>
	let { children } = $props();
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-muted p-4 md:p-8"
>
	<div class="flex w-full max-w-sm flex-col gap-6">
		<div
			class="flex items-center gap-2 self-center font-semibold text-lg tracking-tight"
		>
			<span
				class="rounded-md bg-primary px-2 py-1 text-primary-foreground"
				>dev</span
			>
			Handy Utils
		</div>
		{@render children?.()}
	</div>
</div>
