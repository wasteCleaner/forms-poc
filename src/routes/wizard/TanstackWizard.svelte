<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { wizardSchema, type WizardData } from '$lib/schemas';
	import { Button, Input, Label } from '$lib/components/ui';

	const defaultValues: WizardData = {
		firstName: '',
		lastName: '',
		email: '',
		zipCode: '',
		country: '',
		street: '',
		homeNumber: '',
		iban: '',
		bic: ''
	};

	const form = createForm(() => ({
		defaultValues,
		validators: {
			onSubmit: wizardSchema
		},
		onSubmit: async ({ value }) => {
			console.log('[TanStack Form Client] Wizard submitted:', value);
		}
	}));

	let currentStep = $state(0);
	const steps = ['Person Details', 'Address', 'Bank Details', 'Summary'];
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit();
	}}
	class="space-y-4"
>
	<div class="flex gap-2 mb-6">
		{#each steps as step, i}
			<button
				type="button"
				onclick={() => (currentStep = i)}
				class="px-3 py-1 text-sm rounded {currentStep === i
					? 'font-bold border-b-2 border-primary'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				{i + 1}. {step}
			</button>
		{/each}
	</div>

	{#if currentStep === 0}
		<div class="space-y-4">
			<form.Field name="firstName">
				{#snippet children(field)}
					<div class="space-y-2">
						<Label for="ts-firstName">First Name</Label>
						<Input
							id="ts-firstName"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
						/>
						{#if field.state.meta.errors.length > 0}
							<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
						{/if}
					</div>
				{/snippet}
			</form.Field>
			<form.Field name="lastName">
				{#snippet children(field)}
					<div class="space-y-2">
						<Label for="ts-lastName">Last Name</Label>
						<Input
							id="ts-lastName"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
						/>
						{#if field.state.meta.errors.length > 0}
							<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
						{/if}
					</div>
				{/snippet}
			</form.Field>
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
						{#if field.state.meta.errors.length > 0}
							<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
						{/if}
					</div>
				{/snippet}
			</form.Field>
		</div>
	{/if}

	{#if currentStep === 1}
		<div class="space-y-4">
			<form.Field name="zipCode">
				{#snippet children(field)}
					<div class="space-y-2">
						<Label for="ts-zipCode">Zip Code</Label>
						<Input
							id="ts-zipCode"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
						/>
						{#if field.state.meta.errors.length > 0}
							<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
						{/if}
					</div>
				{/snippet}
			</form.Field>
			<form.Field name="country">
				{#snippet children(field)}
					<div class="space-y-2">
						<Label for="ts-country">Country</Label>
						<Input
							id="ts-country"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
						/>
						{#if field.state.meta.errors.length > 0}
							<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
						{/if}
					</div>
				{/snippet}
			</form.Field>
			<form.Field name="street">
				{#snippet children(field)}
					<div class="space-y-2">
						<Label for="ts-street">Street</Label>
						<Input
							id="ts-street"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
						/>
						{#if field.state.meta.errors.length > 0}
							<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
						{/if}
					</div>
				{/snippet}
			</form.Field>
			<form.Field name="homeNumber">
				{#snippet children(field)}
					<div class="space-y-2">
						<Label for="ts-homeNumber">Home Number</Label>
						<Input
							id="ts-homeNumber"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
						/>
						{#if field.state.meta.errors.length > 0}
							<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
						{/if}
					</div>
				{/snippet}
			</form.Field>
		</div>
	{/if}

	{#if currentStep === 2}
		<div class="space-y-4">
			<form.Field name="iban">
				{#snippet children(field)}
					<div class="space-y-2">
						<Label for="ts-iban">IBAN</Label>
						<Input
							id="ts-iban"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
						/>
						{#if field.state.meta.errors.length > 0}
							<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
						{/if}
					</div>
				{/snippet}
			</form.Field>
			<form.Field name="bic">
				{#snippet children(field)}
					<div class="space-y-2">
						<Label for="ts-bic">BIC</Label>
						<Input
							id="ts-bic"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
						/>
						{#if field.state.meta.errors.length > 0}
							<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
						{/if}
					</div>
				{/snippet}
			</form.Field>
		</div>
	{/if}

	{#if currentStep === 3}
		<form.Subscribe selector={(state) => state.values}>
			{#snippet children(values)}
				<dl class="space-y-2 text-sm">
					<div class="flex gap-2"><dt class="font-medium w-32">First Name:</dt><dd>{values.firstName}</dd></div>
					<div class="flex gap-2"><dt class="font-medium w-32">Last Name:</dt><dd>{values.lastName}</dd></div>
					<div class="flex gap-2"><dt class="font-medium w-32">Email:</dt><dd>{values.email}</dd></div>
					<div class="flex gap-2"><dt class="font-medium w-32">Zip Code:</dt><dd>{values.zipCode}</dd></div>
					<div class="flex gap-2"><dt class="font-medium w-32">Country:</dt><dd>{values.country}</dd></div>
					<div class="flex gap-2"><dt class="font-medium w-32">Street:</dt><dd>{values.street}</dd></div>
					<div class="flex gap-2"><dt class="font-medium w-32">Home Number:</dt><dd>{values.homeNumber}</dd></div>
					<div class="flex gap-2"><dt class="font-medium w-32">IBAN:</dt><dd>{values.iban}</dd></div>
					<div class="flex gap-2"><dt class="font-medium w-32">BIC:</dt><dd>{values.bic}</dd></div>
				</dl>
			{/snippet}
		</form.Subscribe>
	{/if}

	<div class="flex justify-between mt-6">
		{#if currentStep > 0}
			<Button type="button" variant="outline" onclick={() => currentStep--}>Previous</Button>
		{:else}
			<div></div>
		{/if}
		{#if currentStep < 3}
			<Button type="button" onclick={() => currentStep++}>Continue</Button>
		{:else}
			<form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
				{#snippet children(state)}
					<Button type="submit" disabled={!state.canSubmit || state.isSubmitting}>
						{state.isSubmitting ? 'Submitting...' : 'Finish'}
					</Button>
				{/snippet}
			</form.Subscribe>
		{/if}
	</div>
</form>
