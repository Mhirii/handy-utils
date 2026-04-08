<script>
	import Card from "$lib/components/ui/card/card.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Button from "$lib/components/ui/button/button.svelte";

	let email = "";
	let password = "";
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
		<Card>
			<div class="px-6 pt-2 text-center">
				<h1 class="text-2xl font-bold">Welcome back</h1>
				<p class="mt-1 text-muted-foreground text-sm">
					Log in to your account
				</p>
			</div>
			<div class="px-6 pt-4 pb-6">
				<form class="flex flex-col gap-4" autocomplete="off">
					<div class="flex flex-col gap-1">
						<Label for="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@devmail.com"
							bind:value={email}
							required
						/>
					</div>
					<div class="flex flex-col gap-1">
						<div class="flex items-center">
							<Label for="password">Password</Label>
							<a
								href="#"
								class="ml-auto text-xs text-primary underline-offset-4 hover:underline"
								>Forgot?</a
							>
						</div>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							bind:value={password}
							required
						/>
					</div>
					<Button type="submit" class="mt-2 w-full" disabled>
						Login
					</Button>
				</form>
				<div class="my-4 flex items-center justify-center w-full">
					<span class="text-xs text-muted-foreground">
						or continue with
					</span>
				</div>
				<div class="flex flex-col gap-2">
					<Button
						type="button"
						variant="outline"
						class="w-full"
						disabled
					>
						Github
					</Button>
					<Button
						type="button"
						variant="outline"
						class="w-full"
						disabled
					>
						Google
					</Button>
				</div>
			</div>
		</Card>
		<div class="text-center text-sm text-muted-foreground">
			Don’t have an account?
			<a
				href="#"
				class="text-primary font-medium underline-offset-4 hover:underline"
				>Sign up</a
			>
		</div>
	</div>
</div>
