<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { deserialize } from '$app/forms';
	import { type WizardData } from '$lib/schemas';
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

	let serverErrors = $state<Record<string, string[]>>({});

	const form = createForm(() => ({
		defaultValues,
		onSubmit: async ({ value }) => {
			serverErrors = {};
			const formData = new FormData();
			for (const [key, val] of Object.entries(value)) {
				formData.append(key, val);
			}

			const res = await fetch('?/tanstack', { method: 'POST', body: formData });
			const result = deserialize(await res.text());

			if (result.type === 'failure') {
				serverErrors = (result.data?.tanstackErrors as Record<string, string[]>) ?? {};
			} else {
				console.log('[TanStack Form Client] Wizard submitted successfully');
			}
		}
	}));

	let currentStep = $state(0);
	const steps = ['Person Details', 'Address', 'Bank Details', 'Summary'];

	const fieldStepMap: Record<string, number> = {
		firstName: 0, lastName: 0, email: 0,
		zipCode: 1, country: 1, street: 1, homeNumber: 1,
		iban: 2, bic: 2
	};

	function stepHasErrors(stepIndex: number): boolean {
		return Object.entries(fieldStepMap)
			.filter(([, step]) => step === stepIndex)
			.some(([field]) => serverErrors[field]?.length);
	}

	function fieldError(field: string): string | undefined {
		return serverErrors[field]?.[0];
	}
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
					: 'text-muted-foreground hover:text-foreground'}
					{stepHasErrors(i) ? ' text-destructive' : ''}"
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
						{#if fieldError('firstName')}
							<p class="text-sm text-destructive">{fieldError('firstName')}</p>
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
						{#if fieldError('lastName')}
							<p class="text-sm text-destructive">{fieldError('lastName')}</p>
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
						{#if fieldError('email')}
							<p class="text-sm text-destructive">{fieldError('email')}</p>
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
						{#if fieldError('zipCode')}
							<p class="text-sm text-destructive">{fieldError('zipCode')}</p>
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
						{#if fieldError('country')}
							<p class="text-sm text-destructive">{fieldError('country')}</p>
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
						{#if fieldError('street')}
							<p class="text-sm text-destructive">{fieldError('street')}</p>
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
						{#if fieldError('homeNumber')}
							<p class="text-sm text-destructive">{fieldError('homeNumber')}</p>
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
						{#if fieldError('iban')}
							<p class="text-sm text-destructive">{fieldError('iban')}</p>
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
						{#if fieldError('bic')}
							<p class="text-sm text-destructive">{fieldError('bic')}</p>
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
					<div class="flex gap-2">
						<dt class="font-medium w-32">First Name:</dt>
						<dd class={fieldError('firstName') ? 'text-destructive' : ''}>{values.firstName || '—'}</dd>
						{#if fieldError('firstName')}<dd class="text-destructive text-xs ml-2">({fieldError('firstName')})</dd>{/if}
					</div>
					<div class="flex gap-2">
						<dt class="font-medium w-32">Last Name:</dt>
						<dd class={fieldError('lastName') ? 'text-destructive' : ''}>{values.lastName || '—'}</dd>
						{#if fieldError('lastName')}<dd class="text-destructive text-xs ml-2">({fieldError('lastName')})</dd>{/if}
					</div>
					<div class="flex gap-2">
						<dt class="font-medium w-32">Email:</dt>
						<dd class={fieldError('email') ? 'text-destructive' : ''}>{values.email || '—'}</dd>
						{#if fieldError('email')}<dd class="text-destructive text-xs ml-2">({fieldError('email')})</dd>{/if}
					</div>
					<div class="flex gap-2">
						<dt class="font-medium w-32">Zip Code:</dt>
						<dd class={fieldError('zipCode') ? 'text-destructive' : ''}>{values.zipCode || '—'}</dd>
						{#if fieldError('zipCode')}<dd class="text-destructive text-xs ml-2">({fieldError('zipCode')})</dd>{/if}
					</div>
					<div class="flex gap-2">
						<dt class="font-medium w-32">Country:</dt>
						<dd class={fieldError('country') ? 'text-destructive' : ''}>{values.country || '—'}</dd>
						{#if fieldError('country')}<dd class="text-destructive text-xs ml-2">({fieldError('country')})</dd>{/if}
					</div>
					<div class="flex gap-2">
						<dt class="font-medium w-32">Street:</dt>
						<dd class={fieldError('street') ? 'text-destructive' : ''}>{values.street || '—'}</dd>
						{#if fieldError('street')}<dd class="text-destructive text-xs ml-2">({fieldError('street')})</dd>{/if}
					</div>
					<div class="flex gap-2">
						<dt class="font-medium w-32">Home Number:</dt>
						<dd class={fieldError('homeNumber') ? 'text-destructive' : ''}>{values.homeNumber || '—'}</dd>
						{#if fieldError('homeNumber')}<dd class="text-destructive text-xs ml-2">({fieldError('homeNumber')})</dd>{/if}
					</div>
					<div class="flex gap-2">
						<dt class="font-medium w-32">IBAN:</dt>
						<dd class={fieldError('iban') ? 'text-destructive' : ''}>{values.iban || '—'}</dd>
						{#if fieldError('iban')}<dd class="text-destructive text-xs ml-2">({fieldError('iban')})</dd>{/if}
					</div>
					<div class="flex gap-2">
						<dt class="font-medium w-32">BIC:</dt>
						<dd class={fieldError('bic') ? 'text-destructive' : ''}>{values.bic || '—'}</dd>
						{#if fieldError('bic')}<dd class="text-destructive text-xs ml-2">({fieldError('bic')})</dd>{/if}
					</div>
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
			<form.Subscribe selector={(state) => ({ isSubmitting: state.isSubmitting })}>
				{#snippet children(state)}
					<Button type="submit" disabled={state.isSubmitting}>
						{state.isSubmitting ? 'Submitting...' : 'Finish'}
					</Button>
				{/snippet}
			</form.Subscribe>
		{/if}
	</div>
</form>
