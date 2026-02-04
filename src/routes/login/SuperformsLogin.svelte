<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema, type LoginData } from '$lib/schemas';
	import { Button, Input, Label } from '$lib/components/ui';

	interface Props {
		data: SuperValidated<LoginData>;
	}

	let { data }: Props = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance, submitting } = superForm(data, {
		validators: zodClient(loginSchema)
	});
</script>

<form method="POST" action="?/superforms" use:enhance class="space-y-4">
	<div class="space-y-2">
		<Label for="sf-email">Email</Label>
		<Input id="sf-email" type="email" name="email" bind:value={$form.email} />
		{#if $errors.email}
			<p class="text-sm text-destructive">{$errors.email[0]}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="sf-password">Password</Label>
		<Input id="sf-password" type="password" name="password" bind:value={$form.password} />
		{#if $errors.password}
			<p class="text-sm text-destructive">{$errors.password[0]}</p>
		{/if}
	</div>

	<Button type="submit" disabled={$submitting}>
		{$submitting ? 'Submitting...' : 'Login'}
	</Button>
</form>
