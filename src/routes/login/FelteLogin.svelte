<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { enhance } from '$app/forms';
	import { loginSchema, type LoginData } from '$lib/schemas';
	import { Button, Input, Label } from '$lib/components/ui';

	const { form, errors, isSubmitting } = createForm<LoginData>({
		validate: validator({ schema: loginSchema as any })
	});
</script>

<form method="POST" action="?/felte" use:enhance use:form class="space-y-4">
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
