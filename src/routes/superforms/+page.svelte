<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { Writable, Readable } from 'svelte/store';
	import {
		UserRegion,
		USState,
		ContactChannel,
		AuthMethod,
		type EditUserFormState
	} from '$lib/types';
	import type { LoginSchema, EditUserSchema } from '$lib/schemas';
	import { AVAILABLE_GAMES } from '$lib/data';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// svelte-ignore state_referenced_locally
	const initialLoginForm = data.loginForm as SuperValidated<LoginSchema>;
	// svelte-ignore state_referenced_locally
	const initialEditUserForm = data.editUserForm as SuperValidated<EditUserSchema>;

	// --- Login Form ---
	const {
		form: lForm,
		errors: lErrors,
		enhance: lEnhance,
		message: lMessage
	} = superForm<LoginSchema>(initialLoginForm);

	// --- Edit User Form ---
	const editUserForm = superForm<EditUserSchema>(initialEditUserForm, {
		dataType: 'json'
	});
	const {
		form: eFormStore,
		errors: eErrorsStore,
		enhance: eEnhance,
		message: eMessage
	} = editUserForm;
	const eForm = eFormStore as Writable<EditUserFormState>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const eErrors = eErrorsStore as Readable<Record<string, any>>;

	// Helper to handle region switching and initializing defaults for that region
	function onRegionChange(event: Event) {
		const region = (event.target as HTMLSelectElement).value as UserRegion;

		const current = $eForm;
		const base = {
			email: current.email,
			displayName: current.displayName,
			locale: current.locale,
			contact: current.contact,
			favoriteGames: current.favoriteGames,
			address: current.address
		};

		if (region === UserRegion.EU) {
			$eForm = {
				...base,
				region: UserRegion.EU,
				eu: { gdprConsent: false, vatId: '', nationalId: '' }
			};
		} else if (region === UserRegion.US) {
			$eForm = {
				...base,
				region: UserRegion.US,
				us: { state: USState.CA, zipPlus4: '', ssnLast4: '', taxResidencyConfirmed: false }
			};
		} else if (region === UserRegion.UK) {
			$eForm = { ...base, region: UserRegion.UK, uk: { county: '', postcode: '', ninLast4: '' } };
		} else if (region === UserRegion.Other) {
			$eForm = { ...base, region: UserRegion.Other, other: { notes: '', timezone: '' } };
		}
	}

	function addGame() {
		// Add a new game entry
		$eForm.favoriteGames = [
			...$eForm.favoriteGames,
			{
				id: AVAILABLE_GAMES[0].id,
				pinned: false,
				favoriteSince: '',
				key: Math.random().toString(36).substring(7)
			}
		];
	}

	function removeGame(index: number) {
		$eForm.favoriteGames = $eForm.favoriteGames.filter((_, i) => i !== index);
	}
</script>

<div class="mx-auto max-w-4xl space-y-12 p-8">
	<h1 class="mb-4 text-3xl font-bold">Superforms POC</h1>

	<!-- LOGIN FORM -->
	<section class="rounded-lg border bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-xl font-semibold">Login Form</h2>

		{#if $lMessage}
			<div
				class="mb-4 rounded p-3 {$lMessage.includes('success')
					? 'bg-green-100 text-green-800'
					: 'bg-red-100 text-red-800'}"
			>
				{$lMessage}
			</div>
		{/if}

		<form method="POST" action="?/login" use:lEnhance class="space-y-4">
			<input type="hidden" name="method" value={AuthMethod.Password} />

			<div>
				<label for="l-email" class="block text-sm font-medium text-gray-700">Email</label>
				<input
					id="l-email"
					type="email"
					name="email"
					bind:value={$lForm.email}
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				/>
				{#if $lErrors.email}<span class="text-xs text-red-600">{$lErrors.email}</span>{/if}
			</div>

			<div>
				<label for="l-password" class="block text-sm font-medium text-gray-700">Password</label>
				<input
					id="l-password"
					type="password"
					name="password"
					bind:value={$lForm.password}
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				/>
				{#if $lErrors.password}<span class="text-xs text-red-600">{$lErrors.password}</span>{/if}
			</div>

			<div class="flex items-center">
				<input
					id="l-rememberMe"
					type="checkbox"
					name="rememberMe"
					bind:checked={$lForm.rememberMe}
					class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
				/>
				<label for="l-rememberMe" class="ml-2 block text-sm text-gray-900">Remember me</label>
			</div>

			<button
				type="submit"
				class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
			>
				Sign In
			</button>
		</form>
	</section>

	<!-- EDIT USER FORM -->
	<section class="rounded-lg border bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-xl font-semibold">Edit User Form</h2>

		{#if $eMessage}
			<div class="mb-4 rounded bg-green-100 p-3 text-green-800">
				{$eMessage}
			</div>
		{/if}

		<form method="POST" action="?/editUser" use:eEnhance class="space-y-6">
			<!-- Base Fields -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="e-email" class="block text-sm font-medium text-gray-700">Email</label>
					<input
						id="e-email"
						type="email"
						bind:value={$eForm.email}
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
					{#if $eErrors.email}<span class="text-xs text-red-600">{$eErrors.email}</span>{/if}
				</div>

				<div>
					<label for="e-displayName" class="block text-sm font-medium text-gray-700"
						>Display Name</label
					>
					<input
						id="e-displayName"
						type="text"
						bind:value={$eForm.displayName}
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
					{#if $eErrors.displayName}<span class="text-xs text-red-600">{$eErrors.displayName}</span
						>{/if}
				</div>

				<div>
					<label for="e-locale" class="block text-sm font-medium text-gray-700">Locale</label>
					<input
						id="e-locale"
						type="text"
						bind:value={$eForm.locale}
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
					{#if $eErrors.locale}<span class="text-xs text-red-600">{$eErrors.locale}</span>{/if}
				</div>
			</div>

			<div class="border-t pt-4">
				<h3 class="mb-2 text-lg font-medium">Contact Preferences</h3>
				<div class="grid grid-cols-1 gap-2">
					<div>
						<label for="e-contact-channel" class="block text-sm font-medium text-gray-700"
							>Channel</label
						>
						<select
							id="e-contact-channel"
							bind:value={$eForm.contact.channel}
							class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
						>
							<option value={ContactChannel.Email}>Email</option>
							<option value={ContactChannel.Phone}>Phone</option>
						</select>
					</div>
					<div class="flex items-center space-x-4">
						<label class="flex items-center space-x-2">
							<input type="checkbox" bind:checked={$eForm.contact.marketingOptIn} />
							<span class="text-sm">Marketing</span>
						</label>
						<label class="flex items-center space-x-2">
							<input type="checkbox" bind:checked={$eForm.contact.productUpdatesOptIn} />
							<span class="text-sm">Product Updates</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Region Specifics -->
			<div class="border-t pt-4">
				<h3 class="mb-2 text-lg font-medium">Region Details</h3>
				<div>
					<label for="e-region" class="block text-sm font-medium text-gray-700">Region</label>
					<select
						id="e-region"
						value={$eForm.region}
						onchange={onRegionChange}
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
					>
						{#each Object.values(UserRegion) as region (region)}
							<option value={region}>{region}</option>
						{/each}
					</select>
				</div>

				<div class="mt-4 rounded bg-gray-50 p-4">
					{#if $eForm.region === UserRegion.EU}
						{#if 'eu' in $eForm}
							<div class="space-y-2">
								<label class="flex items-center space-x-2">
									<input type="checkbox" bind:checked={$eForm.eu!.gdprConsent} />
									<span class="text-sm">GDPR Consent</span>
								</label>
								{#if $eErrors.eu?.gdprConsent}<span class="text-xs text-red-600"
										>{$eErrors.eu.gdprConsent}</span
									>{/if}

								<label for="eu-vatId" class="block text-sm">VAT ID</label>
								<input
									id="eu-vatId"
									type="text"
									bind:value={$eForm.eu!.vatId}
									class="w-full rounded border p-1"
								/>

								<label for="eu-nationalId" class="block text-sm">National ID</label>
								<input
									id="eu-nationalId"
									type="text"
									bind:value={$eForm.eu!.nationalId}
									class="w-full rounded border p-1"
								/>
							</div>
						{/if}
					{:else if $eForm.region === UserRegion.US}
						{#if 'us' in $eForm}
							<div class="space-y-2">
								<label for="us-state" class="block text-sm">State</label>
								<select
									id="us-state"
									bind:value={$eForm.us!.state}
									class="w-full rounded border p-1"
								>
									{#each Object.values(USState) as state (state)}
										<option value={state}>{state}</option>
									{/each}
								</select>
								<label for="us-zipPlus4" class="block text-sm">Zip+4</label>
								<input
									id="us-zipPlus4"
									type="text"
									bind:value={$eForm.us!.zipPlus4}
									class="w-full rounded border p-1"
								/>

								<label class="mt-2 flex items-center space-x-2">
									<input type="checkbox" bind:checked={$eForm.us!.taxResidencyConfirmed} />
									<span class="text-sm">Tax Residency Confirmed</span>
								</label>
							</div>
						{/if}
					{:else if $eForm.region === UserRegion.UK}
						{#if 'uk' in $eForm}
							<div class="space-y-2">
								<label for="uk-postcode" class="block text-sm">Postcode</label>
								<input
									id="uk-postcode"
									type="text"
									bind:value={$eForm.uk!.postcode}
									class="w-full rounded border p-1"
								/>
								{#if $eErrors.uk?.postcode}<span class="text-xs text-red-600"
										>{$eErrors.uk.postcode}</span
									>{/if}

								<label for="uk-county" class="block text-sm">County</label>
								<input
									id="uk-county"
									type="text"
									bind:value={$eForm.uk!.county}
									class="w-full rounded border p-1"
								/>
							</div>
						{/if}
					{:else if $eForm.region === UserRegion.Other}
						{#if 'other' in $eForm}
							<div class="space-y-2">
								<label for="other-notes" class="block text-sm">Notes</label>
								<textarea
									id="other-notes"
									bind:value={$eForm.other!.notes}
									class="w-full rounded border p-1"
								></textarea>
							</div>
						{/if}
					{/if}
				</div>
			</div>

			<!-- Favorite Games -->
			<div class="border-t pt-4">
				<h3 class="mb-2 text-lg font-medium">Favorite Games</h3>
				<div class="space-y-2">
					{#each $eForm.favoriteGames as game, i (game.key)}
						<div class="flex items-center gap-2 rounded border bg-gray-50 p-2">
							<div class="flex-1">
								<select
									name={`favoriteGames[${i}].id`}
									bind:value={game.id}
									class="w-full rounded border p-1"
								>
									{#each AVAILABLE_GAMES as g (g.id)}
										<option value={g.id}>{g.title} ({g.platform})</option>
									{/each}
								</select>
							</div>
							<div>
								<input
									name={`favoriteGames[${i}].favoriteSince`}
									type="date"
									bind:value={game.favoriteSince}
									class="rounded border p-1 text-sm"
									placeholder="Since"
								/>
							</div>
							<label class="flex items-center space-x-1">
								<input
									name={`favoriteGames[${i}].pinned`}
									type="checkbox"
									bind:checked={game.pinned}
								/>
								<span class="text-xs">Pinned</span>
							</label>
							<button
								type="button"
								onclick={() => removeGame(i)}
								class="text-sm text-red-600 hover:underline">Remove</button
							>
						</div>
						{#if $eErrors.favoriteGames?.[i]?.id}<span class="block text-xs text-red-600"
								>{$eErrors.favoriteGames[i].id}</span
							>{/if}
					{/each}
				</div>
				<button
					type="button"
					onclick={addGame}
					class="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
				>
					+ Add Game
				</button>
			</div>

			<div class="pt-4">
				<button
					type="submit"
					class="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				>
					Save Changes
				</button>
			</div>
		</form>
	</section>
</div>
