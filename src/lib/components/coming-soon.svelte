<script lang="ts">
	import { Mail, ArrowRight, Zap } from "@lucide/svelte";
	import { onMount } from "svelte";

	let isVisible = $state(false);

	let { data }: { data: { desc?: string; release?: string } } = $props();

	onMount(() => {
		isVisible = true;
	});
</script>

<div
	class="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center px-4 py-12"
>
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"
		></div>
		<div
			class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"
			style="animation-delay: 1s;"
		></div>
	</div>

	<!-- Content container -->
	<div class="relative z-10 w-full max-w-2xl mx-auto">
		<!-- Main content -->
		<div class="text-center space-y-8">
			<!-- Icon -->
			<div
				class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 transition-all duration-700 ease-out"
				class:opacity-100={isVisible}
				class:opacity-0={!isVisible}
				class:scale-100={isVisible}
				class:scale-75={!isVisible}
			>
				<Zap class="w-8 h-8 text-primary" strokeWidth={1.5} />
			</div>

			<!-- Heading -->
			<div
				class="space-y-4 transition-all duration-700 ease-out"
				class:opacity-100={isVisible}
				class:opacity-0={!isVisible}
				class:translate-y-0={isVisible}
				class:translate-y-4={!isVisible}
				style="transition-delay: 0.1s"
			>
				<h1
					class="text-4xl md:text-6xl font-bold tracking-tight text-foreground"
				>
					Coming Soon
				</h1>
				<p
					class="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
				>
					{data?.desc || "Something extraordinary is brewing."}
				</p>
			</div>

			<!-- Description -->
			<div
				class="transition-all duration-700 ease-out"
				class:opacity-100={isVisible}
				class:opacity-0={!isVisible}
				class:translate-y-0={isVisible}
				class:translate-y-4={!isVisible}
				style="transition-delay: 0.2s"
			>
				<p class="text-sm md:text-base text-muted-foreground/80">
					Get early access to exclusive features and be the first to
					know when we launch
				</p>
			</div>

			<!-- Call-to-action buttons -->
			<div
				class="flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 ease-out"
				class:opacity-100={isVisible}
				class:opacity-0={!isVisible}
				class:translate-y-0={isVisible}
				class:translate-y-4={!isVisible}
				style="transition-delay: 0.3s"
			>
				<a
					href="#"
					class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95"
				>
					<Mail class="w-4 h-4" />
					Notify Me
					<ArrowRight class="w-4 h-4" />
				</a>
				<a
					href="#"
					class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-input bg-background hover:bg-muted text-foreground font-medium transition-all duration-300 hover:scale-105 active:scale-95"
				>
					Learn More
				</a>
			</div>

			<!-- Status indicator -->
			{#if data?.release}
				<div
					class="transition-all duration-700 ease-out"
					class:opacity-100={isVisible}
					class:opacity-0={!isVisible}
					class:translate-y-0={isVisible}
					class:translate-y-4={!isVisible}
					style="transition-delay: 0.4s"
				>
					<div
						class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-muted-foreground/10 text-sm text-muted-foreground"
					>
						<span
							class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
						></span>
						<span>Launching in {data?.release}</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
