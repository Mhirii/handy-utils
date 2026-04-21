<script lang="ts">
	import Card from "$lib/components/ui/card/card.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import { formSchema, type FormSchema } from "./schema";
	import * as Form from "$lib/components/ui/form/index.js";
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from "sveltekit-superforms";

	import { zod4Client } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	import { Button } from "$lib/components/ui/button/index";

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } =
		$props();

	const form = superForm(data.form, {
		validators: zod4Client(formSchema),
		onResult: (e) => {
			if (e.result.type === "error" || e.result.type === "failure") {
				if ("data" in e.result && !!e.result.data?.error?.type) {
					console.log(e.result);
					toast.error(e.result.data.error.type, {
						description: e.result.data?.error?.message,
					});
				} else {
					toast.error("Something went wrong, please try again later");
				}
			}
		},
	});

	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login to your account" />
</svelte:head>

<Card>
	<div class="px-6 pt-2 text-center">
		<h1 class="text-2xl font-bold">Welcome back</h1>
		<p class="mt-1 text-muted-foreground text-sm">Log in to your account</p>
	</div>
	<div class="px-6 pt-4 pb-6">
		<form
			class="flex flex-col gap-4"
			autocomplete="off"
			method="POST"
			use:enhance
		>
			<Form.Field class="flex flex-col gap-1" {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Label for="email">Email</Label>
						<Input
							{...props}
							id="email"
							type="email"
							placeholder="you@email.com"
							bind:value={$formData.email}
							required
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field class="flex flex-col gap-1" {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex items-center">
							<Label for="password">Password</Label>
							<a
								href="#"
								class="ml-auto text-xs text-primary underline-offset-4 hover:underline"
								>Forgot?</a
							>
						</div>
						<Input
							{...props}
							id="password"
							type="password"
							placeholder="••••••••"
							bind:value={$formData.password}
							required
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button type="submit" class="mt-2 w-full">Login</Form.Button>
		</form>
		<div class="my-4 flex items-center justify-center w-full">
			<span class="text-xs text-muted-foreground">
				or continue with
			</span>
		</div>
		<div class="flex flex-col gap-2">
			<Button type="button" variant="outline" class="w-full" disabled>
				Github
			</Button>
			<Button type="button" variant="outline" class="w-full" disabled>
				Google
			</Button>
		</div>
	</div>
</Card>
<div class="text-center text-sm text-muted-foreground">
	Don’t have an account?
	<a
		href="/auth/signup"
		class="text-primary font-medium underline-offset-4 hover:underline"
	>
		Sign up
	</a>
</div>
