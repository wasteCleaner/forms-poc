<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { enhance } from '$app/forms';
	import type { Readable } from 'svelte/store';
	import { loginSchema, editUserSchema } from '$lib/schemas';
	import {
		UserRegion,
		USState,
		ContactChannel,
		AuthMethod,
		type EditUserFormState
	} from '$lib/types';
	import { AVAILABLE_GAMES } from '$lib/data';
	import type { ActionData } from './$types';

	let { form: actionForm }: { form: ActionData } = $props();

	// --- Login Form ---
	const { form: lForm, errors: lErrors } = createForm({
		extend: validator({ schema: loginSchema }),
		initialValues: {
			method: AuthMethod.Password,
			email: '',
			password: '',
			rememberMe: false
		}
	});

	// --- Edit User Form ---
	const {
		form: eForm,
		data: eData,
		errors: eErrorsStore,
		setFields
	} = createForm<EditUserFormState>({
		extend: validator({ schema: editUserSchema }),
		initialValues: {
			email: '',
			displayName: '',
			locale: 'en-US',
			region: UserRegion.EU,
			contact: {
				channel: ContactChannel.Email,
				marketingOptIn: false,
				productUpdatesOptIn: false
			},
			favoriteGames: [],
			eu: {
				gdprConsent: false,
				vatId: '',
				nationalId: ''
			},
			us: { state: USState.CA, zipPlus4: '', ssnLast4: '', taxResidencyConfirmed: false },
			uk: { county: '', postcode: '', ninLast4: '' },
			other: { notes: '', timezone: '' }
		}
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const eErrors = eErrorsStore as Readable<Record<string, any>>;

	function onRegionChange(event: Event) {
		const region = (event.target as HTMLSelectElement).value as UserRegion;
		$eData.region = region;

		// Reset/Init fields for the new region
		if (region === UserRegion.EU) {
			setFields('eu', { gdprConsent: false, vatId: '', nationalId: '' });
			setFields('us', undefined);
			setFields('uk', undefined);
			setFields('other', undefined);
		} else if (region === UserRegion.US) {
			setFields('us', {
				state: USState.CA,
				zipPlus4: '',
				ssnLast4: '',
				taxResidencyConfirmed: false
			});
			setFields('eu', undefined);
			setFields('uk', undefined);
			setFields('other', undefined);
		} else if (region === UserRegion.UK) {
			setFields('uk', { county: '', postcode: '', ninLast4: '' });
			setFields('eu', undefined);
			setFields('us', undefined);
			setFields('other', undefined);
		} else if (region === UserRegion.Other) {
			setFields('other', { notes: '', timezone: '' });
			setFields('eu', undefined);
			setFields('us', undefined);
			setFields('uk', undefined);
		}
	}

	function addGame() {
		$eData.favoriteGames = [
			...$eData.favoriteGames,
			{
				id: AVAILABLE_GAMES[0].id,
				pinned: false,
				favoriteSince: '',
				key: Math.random().toString(36).substring(7)
			}
		];
	}

	function removeGame(index: number) {
		$eData.favoriteGames = $eData.favoriteGames.filter((_, i) => i !== index);
	}
</script>

<div class="mx-auto max-w-4xl space-y-12 p-8">
	<h1 class="mb-4 text-3xl font-bold">Felte POC</h1>

	<!-- LOGIN FORM -->
	<section class="rounded-lg border bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-xl font-semibold">Login Form</h2>

		{#if actionForm?.error}
			<div class="mb-4 rounded bg-red-100 p-3 text-red-800">
				{actionForm.error}
			</div>
		{/if}
		{#if actionForm?.success}
			<div class="mb-4 rounded bg-green-100 p-3 text-green-800">
				{actionForm.message || 'Login successful!'}
			</div>
		{/if}

		<form use:lForm use:enhance method="POST" action="?/login" class="space-y-4">
			<input type="hidden" name="method" value={AuthMethod.Password} />

			<div>
				<label for="l-email" class="block text-sm font-medium text-gray-700">Email</label>
				<input
					id="l-email"
					type="email"
					name="email"
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
				/>
				{#if $lErrors.email}<span class="text-xs text-red-600">{$lErrors.email}</span>{/if}
			</div>

			<div>
				<label for="l-password" class="block text-sm font-medium text-gray-700">Password</label>
				<input
					id="l-password"
					type="password"
					name="password"
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
				/>
				{#if $lErrors.password}<span class="text-xs text-red-600">{$lErrors.password}</span>{/if}
			</div>

			<div class="flex items-center">
				<input
					id="l-rememberMe"
					type="checkbox"
					name="rememberMe"
					class="h-4 w-4 rounded border-gray-300 text-indigo-600"
				/>
				<label for="l-rememberMe" class="ml-2 block text-sm text-gray-900">Remember me</label>
			</div>

			<button type="submit" class="rounded bg-indigo-600 px-4 py-2 text-white"> Sign In </button>
		</form>
	</section>

	<!-- EDIT USER FORM -->
	<section class="rounded-lg border bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-xl font-semibold">Edit User Form</h2>

		<form use:eForm use:enhance method="POST" action="?/editUser" class="space-y-6">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="e-email" class="block text-sm font-medium">Email</label>
					<input id="e-email" type="email" name="email" class="w-full rounded border p-2" />
					{#if $eErrors.email}<span class="text-xs text-red-600">{$eErrors.email}</span>{/if}
				</div>

				<div>
					<label for="e-displayName" class="block text-sm font-medium">Display Name</label>
					<input
						id="e-displayName"
						type="text"
						name="displayName"
						class="w-full rounded border p-2"
					/>
					{#if $eErrors.displayName}<span class="text-xs text-red-600">{$eErrors.displayName}</span
						>{/if}
				</div>

				<div>
					<label for="e-locale" class="block text-sm font-medium">Locale</label>
					<input id="e-locale" type="text" name="locale" class="w-full rounded border p-2" />
					{#if $eErrors.locale}<span class="text-xs text-red-600">{$eErrors.locale}</span>{/if}
				</div>
			</div>

			<div class="border-t pt-4">
				<h3 class="mb-2 text-lg font-medium">Contact</h3>
				<div class="grid grid-cols-1 gap-2">
					<label>
						Channel
						<select name="contact.channel" class="w-full rounded border p-2">
							<option value={ContactChannel.Email}>Email</option>
							<option value={ContactChannel.Phone}>Phone</option>
						</select>
					</label>
					<div class="flex gap-4">
						<label class="flex items-center space-x-2">
							<input type="checkbox" name="contact.marketingOptIn" />
							<span class="text-sm">Marketing</span>
						</label>
						<label class="flex items-center space-x-2">
							<input type="checkbox" name="contact.productUpdatesOptIn" />
							<span class="text-sm">Product Updates</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Region -->
			<div class="border-t pt-4">
				<label for="e-region" class="block text-sm font-medium">Region</label>
				<select
					id="e-region"
					name="region"
					onchange={onRegionChange}
					class="w-full rounded border p-2"
				>
					{#each Object.values(UserRegion) as region (region)}
						<option value={region}>{region}</option>
					{/each}
				</select>

				<div class="mt-4 rounded bg-gray-50 p-4">
					{#if $eData.region === UserRegion.EU}
						<div class="space-y-2">
							<label class="flex items-center space-x-2">
								<input type="checkbox" name="eu.gdprConsent" />
								<span class="text-sm">GDPR Consent</span>
							</label>
							{#if $eErrors.eu?.gdprConsent}<span class="text-xs text-red-600"
									>{$eErrors.eu.gdprConsent}</span
								>{/if}

							<label for="eu-vatId" class="block text-sm">VAT ID</label>
							<input id="eu-vatId" type="text" name="eu.vatId" class="w-full rounded border p-1" />

							<label for="eu-nationalId" class="block text-sm">National ID</label>
							<input
								id="eu-nationalId"
								type="text"
								name="eu.nationalId"
								class="w-full rounded border p-1"
							/>
						</div>
					{:else if $eData.region === UserRegion.US}
						<div class="space-y-2">
							<label for="us-state" class="block text-sm">State</label>
							<select id="us-state" name="us.state" class="w-full rounded border p-1">
								{#each Object.values(USState) as state (state)}
									<option value={state}>{state}</option>
								{/each}
							</select>
							<label for="us-zipPlus4" class="block text-sm">Zip+4</label>
							<input
								id="us-zipPlus4"
								type="text"
								name="us.zipPlus4"
								class="w-full rounded border p-1"
							/>
							<label class="flex items-center space-x-2">
								<input type="checkbox" name="us.taxResidencyConfirmed" />
								<span class="text-sm">Tax Residency Confirmed</span>
							</label>
						</div>
					{:else if $eData.region === UserRegion.UK}
						<div class="space-y-2">
							<label for="uk-postcode" class="block text-sm">Postcode</label>
							<input
								id="uk-postcode"
								type="text"
								name="uk.postcode"
								class="w-full rounded border p-1"
							/>
							{#if $eErrors.uk?.postcode}<span class="text-xs text-red-600"
									>{$eErrors.uk.postcode}</span
								>{/if}
							<label for="uk-county" class="block text-sm">County</label>
							<input
								id="uk-county"
								type="text"
								name="uk.county"
								class="w-full rounded border p-1"
							/>
						</div>
					{/if}
				</div>
			</div>

			<!-- Favorite Games -->
			<div class="border-t pt-4">
				<h3 class="mb-2 text-lg font-medium">Favorite Games</h3>
				<div class="space-y-2">
					{#each $eData.favoriteGames as game, i (game.key)}
						<div class="flex items-center gap-2 rounded border bg-gray-50 p-2">
							<select name={`favoriteGames.${i}.id`} class="w-full rounded border p-1">
								{#each AVAILABLE_GAMES as g (g.id)}
									<option value={g.id}>{g.title}</option>
								{/each}
							</select>
							<input
								type="date"
								name={`favoriteGames.${i}.favoriteSince`}
								class="rounded border p-1 text-sm"
							/>
							<label class="flex items-center space-x-1">
								<input type="checkbox" name={`favoriteGames.${i}.pinned`} />
								<span class="text-xs">Pinned</span>
							</label>
							<button type="button" onclick={() => removeGame(i)} class="text-sm text-red-600"
								>Remove</button
							>
						</div>
						{#if $eErrors.favoriteGames?.[i]?.id}<span class="block text-xs text-red-600"
								>{$eErrors.favoriteGames[i].id}</span
							>{/if}
					{/each}
				</div>
				<button type="button" onclick={addGame} class="mt-2 text-sm font-medium text-indigo-600">
					+ Add Game
				</button>
			</div>

			<button type="submit" class="w-full rounded bg-green-600 py-2 text-white">Save Changes</button
			>
		</form>
	</section>
</div>
