<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { wizardSchema, type WizardData } from '$lib/schemas';
	import { Button, Input, Label } from '$lib/components/ui';

	interface Props {
		data: SuperValidated<WizardData>;
	}

	let { data }: Props = $props();

	const { form, errors, enhance, submitting } = superForm(data, {
		dataType: 'json'
	});

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
			.some(([field]) => $errors[field as keyof typeof $errors]);
	}
</script>

<form method="POST" action="?/superforms" use:enhance class="space-y-4">
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
			<div class="space-y-2">
				<Label for="sf-firstName">First Name</Label>
				<Input id="sf-firstName" bind:value={$form.firstName} />
				{#if $errors.firstName}
					<p class="text-sm text-destructive">{$errors.firstName[0]}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Label for="sf-lastName">Last Name</Label>
				<Input id="sf-lastName" bind:value={$form.lastName} />
				{#if $errors.lastName}
					<p class="text-sm text-destructive">{$errors.lastName[0]}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Label for="sf-email">Email</Label>
				<Input id="sf-email" type="email" bind:value={$form.email} />
				{#if $errors.email}
					<p class="text-sm text-destructive">{$errors.email[0]}</p>
				{/if}
			</div>
		</div>
	{/if}

	{#if currentStep === 1}
		<div class="space-y-4">
			<div class="space-y-2">
				<Label for="sf-zipCode">Zip Code</Label>
				<Input id="sf-zipCode" bind:value={$form.zipCode} />
				{#if $errors.zipCode}
					<p class="text-sm text-destructive">{$errors.zipCode[0]}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Label for="sf-country">Country</Label>
				<Input id="sf-country" bind:value={$form.country} />
				{#if $errors.country}
					<p class="text-sm text-destructive">{$errors.country[0]}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Label for="sf-street">Street</Label>
				<Input id="sf-street" bind:value={$form.street} />
				{#if $errors.street}
					<p class="text-sm text-destructive">{$errors.street[0]}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Label for="sf-homeNumber">Home Number</Label>
				<Input id="sf-homeNumber" bind:value={$form.homeNumber} />
				{#if $errors.homeNumber}
					<p class="text-sm text-destructive">{$errors.homeNumber[0]}</p>
				{/if}
			</div>
		</div>
	{/if}

	{#if currentStep === 2}
		<div class="space-y-4">
			<div class="space-y-2">
				<Label for="sf-iban">IBAN</Label>
				<Input id="sf-iban" bind:value={$form.iban} />
				{#if $errors.iban}
					<p class="text-sm text-destructive">{$errors.iban[0]}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Label for="sf-bic">BIC</Label>
				<Input id="sf-bic" bind:value={$form.bic} />
				{#if $errors.bic}
					<p class="text-sm text-destructive">{$errors.bic[0]}</p>
				{/if}
			</div>
		</div>
	{/if}

	{#if currentStep === 3}
		<dl class="space-y-2 text-sm">
			<div class="flex gap-2">
				<dt class="font-medium w-32">First Name:</dt>
				<dd class={$errors.firstName ? 'text-destructive' : ''}>{$form.firstName || '—'}</dd>
				{#if $errors.firstName}<dd class="text-destructive text-xs ml-2">({$errors.firstName[0]})</dd>{/if}
			</div>
			<div class="flex gap-2">
				<dt class="font-medium w-32">Last Name:</dt>
				<dd class={$errors.lastName ? 'text-destructive' : ''}>{$form.lastName || '—'}</dd>
				{#if $errors.lastName}<dd class="text-destructive text-xs ml-2">({$errors.lastName[0]})</dd>{/if}
			</div>
			<div class="flex gap-2">
				<dt class="font-medium w-32">Email:</dt>
				<dd class={$errors.email ? 'text-destructive' : ''}>{$form.email || '—'}</dd>
				{#if $errors.email}<dd class="text-destructive text-xs ml-2">({$errors.email[0]})</dd>{/if}
			</div>
			<div class="flex gap-2">
				<dt class="font-medium w-32">Zip Code:</dt>
				<dd class={$errors.zipCode ? 'text-destructive' : ''}>{$form.zipCode || '—'}</dd>
				{#if $errors.zipCode}<dd class="text-destructive text-xs ml-2">({$errors.zipCode[0]})</dd>{/if}
			</div>
			<div class="flex gap-2">
				<dt class="font-medium w-32">Country:</dt>
				<dd class={$errors.country ? 'text-destructive' : ''}>{$form.country || '—'}</dd>
				{#if $errors.country}<dd class="text-destructive text-xs ml-2">({$errors.country[0]})</dd>{/if}
			</div>
			<div class="flex gap-2">
				<dt class="font-medium w-32">Street:</dt>
				<dd class={$errors.street ? 'text-destructive' : ''}>{$form.street || '—'}</dd>
				{#if $errors.street}<dd class="text-destructive text-xs ml-2">({$errors.street[0]})</dd>{/if}
			</div>
			<div class="flex gap-2">
				<dt class="font-medium w-32">Home Number:</dt>
				<dd class={$errors.homeNumber ? 'text-destructive' : ''}>{$form.homeNumber || '—'}</dd>
				{#if $errors.homeNumber}<dd class="text-destructive text-xs ml-2">({$errors.homeNumber[0]})</dd>{/if}
			</div>
			<div class="flex gap-2">
				<dt class="font-medium w-32">IBAN:</dt>
				<dd class={$errors.iban ? 'text-destructive' : ''}>{$form.iban || '—'}</dd>
				{#if $errors.iban}<dd class="text-destructive text-xs ml-2">({$errors.iban[0]})</dd>{/if}
			</div>
			<div class="flex gap-2">
				<dt class="font-medium w-32">BIC:</dt>
				<dd class={$errors.bic ? 'text-destructive' : ''}>{$form.bic || '—'}</dd>
				{#if $errors.bic}<dd class="text-destructive text-xs ml-2">({$errors.bic[0]})</dd>{/if}
			</div>
		</dl>
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
			<Button type="submit" disabled={$submitting}>
				{$submitting ? 'Submitting...' : 'Finish'}
			</Button>
		{/if}
	</div>
</form>
