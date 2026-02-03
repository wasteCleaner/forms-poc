<script lang="ts">
	import { enhance } from '$app/forms';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { loginSchema, type LoginData } from '$lib/schemas';
	import { Button, Input, Label } from '$lib/components/ui';

	let success = $state(false);

	const { form, errors, isSubmitting } = createForm<LoginData>({
		extend: [validator({ schema: loginSchema as any })]
	});
</script>

<form
	use:form
	method="POST"
	action="?/felte"
	class="space-y-4"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success' && result.data?.felteSuccess) {
				success = true;
			}
		};
	}}
>
	{#if success}
		<div class="text-green-500 font-medium">Login successful</div>
	{/if}
	<div class="space-y-2">
		<Label for="felte-email">Email</Label>
		<Input id="felte-email" type="email" name="email" />
		{#if $errors.email}
			<p class="text-sm text-destructive">{$errors.email[0]}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="felte-password">Password</Label>
		<Input id="felte-password" type="password" name="password" />
		{#if $errors.password}
			<p class="text-sm text-destructive">{$errors.password[0]}</p>
		{/if}
	</div>

	<Button type="submit" disabled={$isSubmitting}>
		{$isSubmitting ? 'Submitting...' : 'Login'}
	</Button>
</form>
