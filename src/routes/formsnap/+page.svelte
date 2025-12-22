<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { Writable } from 'svelte/store';
	import { Field, Control, Label, FieldErrors } from 'formsnap';
	import {
		UserRegion,
		USState,
		ContactChannel,
		AuthMethod,
		type EditUserFormState
	} from '$lib/types';
	import { AVAILABLE_GAMES } from '$lib/data';
	import type { LoginSchema, EditUserSchema } from '$lib/schemas';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// svelte-ignore state_referenced_locally
	const initialLoginForm = data.loginForm as SuperValidated<LoginSchema>;
	// svelte-ignore state_referenced_locally
	const initialEditUserForm = data.editUserForm as SuperValidated<EditUserSchema>;

	// --- Login Form ---
	const loginForm = superForm<LoginSchema>(initialLoginForm);
	const { form: lForm, enhance: lEnhance, message: lMessage } = loginForm;

	// --- Edit User Form ---
	const editUserForm = superForm<EditUserSchema>(initialEditUserForm, {
		dataType: 'json'
	});
	const { form: eFormStore, enhance: eEnhance, message: eMessage } = editUserForm;
	const eForm = eFormStore as Writable<EditUserFormState>;

	function onRegionChange(event: Event) {
		const region = (event.target as HTMLSelectElement).value as UserRegion;

		// Preserve base fields when switching regions
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
	<h1 class="mb-4 text-3xl font-bold">Formsnap POC</h1>

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

			<Field form={loginForm} name="email">
				<Control>
					{#snippet children({ props })}
						<Label class="block text-sm font-medium text-gray-700">Email</Label>
						<input
							{...props}
							type="email"
							bind:value={$lForm.email}
							class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
						/>
					{/snippet}
				</Control>
				<FieldErrors class="text-xs text-red-600" />
			</Field>

			<Field form={loginForm} name="password">
				<Control>
					{#snippet children({ props })}
						<Label class="block text-sm font-medium text-gray-700">Password</Label>
						<input
							{...props}
							type="password"
							bind:value={$lForm.password}
							class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
						/>
					{/snippet}
				</Control>
				<FieldErrors class="text-xs text-red-600" />
			</Field>

			<Field form={loginForm} name="rememberMe">
				<Control>
					{#snippet children({ props })}
						<div class="flex items-center">
							<input
								{...props}
								type="checkbox"
								bind:checked={$lForm.rememberMe}
								class="h-4 w-4 rounded border-gray-300 text-indigo-600"
							/>
							<Label class="ml-2 block text-sm text-gray-900">Remember me</Label>
						</div>
					{/snippet}
				</Control>
			</Field>

			<button type="submit" class="rounded bg-indigo-600 px-4 py-2 text-white">Sign In</button>
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
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Field form={editUserForm} name="email">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium">Email</Label>
							<input
								{...props}
								type="email"
								bind:value={$eForm.email}
								class="w-full rounded border p-2"
							/>
						{/snippet}
					</Control>
					<FieldErrors class="text-xs text-red-600" />
				</Field>

				<Field form={editUserForm} name="displayName">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium">Display Name</Label>
							<input
								{...props}
								type="text"
								bind:value={$eForm.displayName}
								class="w-full rounded border p-2"
							/>
						{/snippet}
					</Control>
					<FieldErrors class="text-xs text-red-600" />
				</Field>

				<Field form={editUserForm} name="locale">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium">Locale</Label>
							<input
								{...props}
								type="text"
								bind:value={$eForm.locale}
								class="w-full rounded border p-2"
							/>
						{/snippet}
					</Control>
					<FieldErrors class="text-xs text-red-600" />
				</Field>
			</div>

			<!-- Contact -->
			<div class="space-y-2 border-t pt-4">
				<Field form={editUserForm} name="contact.channel">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium">Channel</Label>
							<select
								{...props}
								bind:value={$eForm.contact.channel}
								class="w-full rounded border p-2"
							>
								<option value={ContactChannel.Email}>Email</option>
								<option value={ContactChannel.Phone}>Phone</option>
							</select>
						{/snippet}
					</Control>
				</Field>

				<div class="flex gap-4">
					<Field form={editUserForm} name="contact.marketingOptIn">
						<Control>
							{#snippet children({ props })}
								<label class="flex items-center space-x-2">
									<input {...props} type="checkbox" bind:checked={$eForm.contact.marketingOptIn} />
									<span class="text-sm">Marketing</span>
								</label>
							{/snippet}
						</Control>
					</Field>
					<Field form={editUserForm} name="contact.productUpdatesOptIn">
						<Control>
							{#snippet children({ props })}
								<label class="flex items-center space-x-2">
									<input
										{...props}
										type="checkbox"
										bind:checked={$eForm.contact.productUpdatesOptIn}
									/>
									<span class="text-sm">Product Updates</span>
								</label>
							{/snippet}
						</Control>
					</Field>
				</div>
			</div>

			<!-- Region -->
			<div class="border-t pt-4">
				<Field form={editUserForm} name="region">
					<Control>
						{#snippet children({ props })}
							<Label class="block text-sm font-medium">Region</Label>
							<select
								{...props}
								value={$eForm.region}
								onchange={onRegionChange}
								class="w-full rounded border p-2"
							>
								{#each Object.values(UserRegion) as region (region)}
									<option value={region}>{region}</option>
								{/each}
							</select>
						{/snippet}
					</Control>
				</Field>

				<div class="mt-4 rounded bg-gray-50 p-4">
					{#if $eForm.region === UserRegion.EU && 'eu' in $eForm}
						<Field form={editUserForm} name="eu.gdprConsent">
							<Control>
								{#snippet children({ props })}
									<label class="flex items-center space-x-2">
										<input {...props} type="checkbox" bind:checked={$eForm.eu!.gdprConsent} />
										<span class="text-sm">GDPR Consent</span>
									</label>
								{/snippet}
							</Control>
							<FieldErrors class="text-xs text-red-600" />
						</Field>
						<Field form={editUserForm} name="eu.vatId">
							<Control>
								{#snippet children({ props })}
									<Label class="block text-sm">VAT ID</Label>
									<input
										{...props}
										type="text"
										bind:value={$eForm.eu!.vatId}
										class="w-full rounded border p-1"
									/>
								{/snippet}
							</Control>
						</Field>
					{:else if $eForm.region === UserRegion.US && 'us' in $eForm}
						<Field form={editUserForm} name="us.state">
							<Control>
								{#snippet children({ props })}
									<Label class="block text-sm">State</Label>
									<select
										{...props}
										bind:value={$eForm.us!.state}
										class="w-full rounded border p-1"
									>
										{#each Object.values(USState) as state (state)}
											<option value={state}>{state}</option>
										{/each}
									</select>
								{/snippet}
							</Control>
						</Field>
						<Field form={editUserForm} name="us.zipPlus4">
							<Control>
								{#snippet children({ props })}
									<Label class="block text-sm">Zip+4</Label>
									<input
										{...props}
										type="text"
										bind:value={$eForm.us!.zipPlus4}
										class="w-full rounded border p-1"
									/>
								{/snippet}
							</Control>
						</Field>
					{:else if $eForm.region === UserRegion.UK && 'uk' in $eForm}
						<Field form={editUserForm} name="uk.postcode">
							<Control>
								{#snippet children({ props })}
									<Label class="block text-sm">Postcode</Label>
									<input
										{...props}
										type="text"
										bind:value={$eForm.uk!.postcode}
										class="w-full rounded border p-1"
									/>
								{/snippet}
							</Control>
							<FieldErrors class="text-xs text-red-600" />
						</Field>
					{/if}
				</div>
			</div>

			<!-- Array Field -->
			<div class="border-t pt-4">
				<h3 class="mb-2 text-lg font-medium">Favorite Games</h3>
				<div class="space-y-2">
					{#each $eForm.favoriteGames as game, i (game.key)}
						<div class="flex items-center gap-2 rounded border bg-gray-50 p-2">
							<div class="flex-1">
								<Field form={editUserForm} name={`favoriteGames[${i}].id`}>
									<Control>
										{#snippet children({ props })}
											<select {...props} bind:value={game.id} class="w-full rounded border p-1">
												{#each AVAILABLE_GAMES as g (g.id)}
													<option value={g.id}>{g.title}</option>
												{/each}
											</select>
										{/snippet}
									</Control>
									<FieldErrors class="text-xs text-red-600" />
								</Field>
							</div>

							<div>
								<Field form={editUserForm} name={`favoriteGames[${i}].favoriteSince`}>
									<Control>
										{#snippet children({ props })}
											<input
												{...props}
												type="date"
												bind:value={game.favoriteSince}
												class="rounded border p-1 text-sm"
											/>
										{/snippet}
									</Control>
								</Field>
							</div>

							<button type="button" onclick={() => removeGame(i)} class="text-sm text-red-600"
								>Remove</button
							>
						</div>
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
