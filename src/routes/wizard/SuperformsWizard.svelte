<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { wizardSchema, type WizardData } from '$lib/schemas';
	import { Button, Input, Label } from '$lib/components/ui';

	interface Props {
		data: SuperValidated<WizardData>;
	}

	let { data }: Props = $props();

	const { form, errors, enhance, submitting } = superForm(data, {
		validators: zod4Client(wizardSchema),
		dataType: 'json'
	});

	let currentStep = $state(0);
	const steps = ['Person Details', 'Address', 'Bank Details', 'Summary'];
</script>

<form method="POST" action="?/superforms" use:enhance class="space-y-4">
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
			<div class="flex gap-2"><dt class="font-medium w-32">First Name:</dt><dd>{$form.firstName}</dd></div>
			<div class="flex gap-2"><dt class="font-medium w-32">Last Name:</dt><dd>{$form.lastName}</dd></div>
			<div class="flex gap-2"><dt class="font-medium w-32">Email:</dt><dd>{$form.email}</dd></div>
			<div class="flex gap-2"><dt class="font-medium w-32">Zip Code:</dt><dd>{$form.zipCode}</dd></div>
			<div class="flex gap-2"><dt class="font-medium w-32">Country:</dt><dd>{$form.country}</dd></div>
			<div class="flex gap-2"><dt class="font-medium w-32">Street:</dt><dd>{$form.street}</dd></div>
			<div class="flex gap-2"><dt class="font-medium w-32">Home Number:</dt><dd>{$form.homeNumber}</dd></div>
			<div class="flex gap-2"><dt class="font-medium w-32">IBAN:</dt><dd>{$form.iban}</dd></div>
			<div class="flex gap-2"><dt class="font-medium w-32">BIC:</dt><dd>{$form.bic}</dd></div>
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
