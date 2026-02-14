<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { loginSchema } from '$lib/schemas';
	import { Button, Input, Label } from '$lib/components/ui';

	const form = createForm(() => ({
		defaultValues: {
			email: '',
			password: ''
		},
		validators: {
			onBlur: loginSchema
		},
		onSubmit: async ({ value }) => {
			console.log('[TanStack Form Client] Login submitted:', value);
		}
	}));

</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit();
	}}
	class="space-y-4"
>
	<form.Field name="email">
		{#snippet children(field)}
			<div class="space-y-2">
				<Label for="ts-email">Email</Label>
				<Input
					id="ts-email"
					type="email"
					value={field.state.value}
					onblur={field.handleBlur}
					oninput={(e) => field.handleChange(e.currentTarget.value)}
				/>
				{#if field.state.meta.isTouched && field.state.meta.errors.length > 0}
					<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
				{/if}
			</div>
		{/snippet}
	</form.Field>

	<form.Field name="password">
		{#snippet children(field)}
			<div class="space-y-2">
				<Label for="ts-password">Password</Label>
				<Input
					id="ts-password"
					type="password"
					value={field.state.value}
					onblur={field.handleBlur}
					oninput={(e) => field.handleChange(e.currentTarget.value)}
				/>
				{#if field.state.meta.isTouched && field.state.meta.errors.length > 0}
					<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
				{/if}
			</div>
		{/snippet}
	</form.Field>

	<form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
		{#snippet children(state)}
			<Button type="submit" disabled={!state.canSubmit || state.isSubmitting}>
				{state.isSubmitting ? 'Submitting...' : 'Login'}
			</Button>
		{/snippet}
	</form.Subscribe>
</form>
