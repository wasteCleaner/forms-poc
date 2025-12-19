<script lang="ts">
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { type Writable, type Readable } from 'svelte/store';
  import {
    UserRegion,
    USState,
    ContactChannel,
    GamePlatform,
    AuthMethod,
    type EditUserFormState
  } from '$lib/types';
  import type { LoginSchema, EditUserSchema } from '$lib/schemas';
  import { AVAILABLE_GAMES } from '$lib/data';

  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const initialLoginForm = data.loginForm as SuperValidated<LoginSchema>;
  const initialEditUserForm = data.editUserForm as SuperValidated<EditUserSchema>;

  // --- Login Form ---
  const { form: lForm, errors: lErrors, enhance: lEnhance, message: lMessage } = superForm<LoginSchema>(initialLoginForm);

  // --- Edit User Form ---
  const { form: eForm, errors: eErrors, enhance: eEnhance, message: eMessage } = superForm<EditUserSchema>(initialEditUserForm, {
    dataType: 'json'
  });

  // Typed proxies for form and errors to handle discriminated unions cleanly
  const proxyForm = eForm as Writable<EditUserFormState>;
  const proxyErrors = eErrors as Readable<Record<string, any>>;

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
      $eForm = { ...base, region: UserRegion.EU, eu: { gdprConsent: false, vatId: '', nationalId: '' } };
    } else if (region === UserRegion.US) {
      $eForm = { ...base, region: UserRegion.US, us: { state: USState.CA, zipPlus4: '', ssnLast4: '', taxResidencyConfirmed: false } };
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
      { id: AVAILABLE_GAMES[0].id, pinned: false, favoriteSince: '', key: Math.random().toString(36).substring(7) }
    ];
  }

  function removeGame(index: number) {
    $eForm.favoriteGames = $eForm.favoriteGames.filter((_, i) => i !== index);
  }
</script>

<div class="p-8 max-w-4xl mx-auto space-y-12">
  <h1 class="text-3xl font-bold mb-4">Superforms POC</h1>

  <!-- LOGIN FORM -->
  <section class="border p-6 rounded-lg shadow-sm bg-white">
    <h2 class="text-xl font-semibold mb-4">Login Form</h2>

    {#if $lMessage}
      <div class="mb-4 p-3 rounded {$lMessage.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
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
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
        />
        {#if $lErrors.email}<span class="text-red-600 text-xs">{$lErrors.email}</span>{/if}
      </div>

      <div>
        <label for="l-password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="l-password"
          type="password"
          name="password"
          bind:value={$lForm.password}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
        />
        {#if $lErrors.password}<span class="text-red-600 text-xs">{$lErrors.password}</span>{/if}
      </div>

      <div class="flex items-center">
        <input
          id="l-rememberMe"
          type="checkbox"
          name="rememberMe"
          bind:checked={$lForm.rememberMe}
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label for="l-rememberMe" class="ml-2 block text-sm text-gray-900">Remember me</label>
      </div>

      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign In
      </button>
    </form>
  </section>

  <!-- EDIT USER FORM -->
  <section class="border p-6 rounded-lg shadow-sm bg-white">
    <h2 class="text-xl font-semibold mb-4">Edit User Form</h2>

    {#if $eMessage}
      <div class="mb-4 p-3 rounded bg-green-100 text-green-800">
        {$eMessage}
      </div>
    {/if}

    <form method="POST" action="?/editUser" use:eEnhance class="space-y-6">
      <!-- Base Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="e-email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="e-email"
            type="email"
            bind:value={$eForm.email}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
          {#if $eErrors.email}<span class="text-red-600 text-xs">{$eErrors.email}</span>{/if}
        </div>

        <div>
          <label for="e-displayName" class="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            id="e-displayName"
            type="text"
            bind:value={$eForm.displayName}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
          {#if $eErrors.displayName}<span class="text-red-600 text-xs">{$eErrors.displayName}</span>{/if}
        </div>

        <div>
          <label for="e-locale" class="block text-sm font-medium text-gray-700">Locale</label>
          <input
            id="e-locale"
            type="text"
            bind:value={$eForm.locale}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
           {#if $eErrors.locale}<span class="text-red-600 text-xs">{$eErrors.locale}</span>{/if}
        </div>
      </div>

      <div class="border-t pt-4">
        <h3 class="text-lg font-medium mb-2">Contact Preferences</h3>
        <div class="grid grid-cols-1 gap-2">
            <div>
                <label for="e-contact-channel" class="block text-sm font-medium text-gray-700">Channel</label>
                <select id="e-contact-channel" bind:value={$eForm.contact.channel} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
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
        <h3 class="text-lg font-medium mb-2">Region Details</h3>
        <div>
            <label for="e-region" class="block text-sm font-medium text-gray-700">Region</label>
            <select
                id="e-region"
                value={$eForm.region}
                onchange={onRegionChange}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            >
                {#each Object.values(UserRegion) as region}
                    <option value={region}>{region}</option>
                {/each}
            </select>
        </div>

        <div class="mt-4 p-4 bg-gray-50 rounded">
            {#if $proxyForm.region === UserRegion.EU}
                 {#if $proxyForm.eu}
                    <div class="space-y-2">
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" bind:checked={$proxyForm.eu!.gdprConsent} />
                            <span class="text-sm">GDPR Consent</span>
                        </label>
                        {#if $proxyErrors.eu?.gdprConsent}<span class="text-red-600 text-xs">{$proxyErrors.eu.gdprConsent}</span>{/if}

                        <label for="eu-vatId" class="block text-sm">VAT ID</label>
                        <input id="eu-vatId" type="text" bind:value={$proxyForm.eu!.vatId} class="border p-1 w-full rounded" />

                        <label for="eu-nationalId" class="block text-sm">National ID</label>
                        <input id="eu-nationalId" type="text" bind:value={$proxyForm.eu!.nationalId} class="border p-1 w-full rounded" />
                    </div>
                 {/if}
            {:else if $proxyForm.region === UserRegion.US}
                 {#if $proxyForm.us}
                    <div class="space-y-2">
                        <label for="us-state" class="block text-sm">State</label>
                        <select id="us-state" bind:value={$proxyForm.us!.state} class="border p-1 w-full rounded">
                            {#each Object.values(USState) as state}
                                <option value={state}>{state}</option>
                            {/each}
                        </select>
                        <label for="us-zipPlus4" class="block text-sm">Zip+4</label>
                        <input id="us-zipPlus4" type="text" bind:value={$proxyForm.us!.zipPlus4} class="border p-1 w-full rounded" />

                        <label class="flex items-center space-x-2 mt-2">
                            <input type="checkbox" bind:checked={$proxyForm.us!.taxResidencyConfirmed} />
                            <span class="text-sm">Tax Residency Confirmed</span>
                        </label>
                    </div>
                 {/if}
            {:else if $proxyForm.region === UserRegion.UK}
                 {#if $proxyForm.uk}
                    <div class="space-y-2">
                        <label for="uk-postcode" class="block text-sm">Postcode</label>
                        <input id="uk-postcode" type="text" bind:value={$proxyForm.uk!.postcode} class="border p-1 w-full rounded" />
                        {#if $proxyErrors.uk?.postcode}<span class="text-red-600 text-xs">{$proxyErrors.uk.postcode}</span>{/if}

                        <label for="uk-county" class="block text-sm">County</label>
                        <input id="uk-county" type="text" bind:value={$proxyForm.uk!.county} class="border p-1 w-full rounded" />
                    </div>
                 {/if}
            {:else if $proxyForm.region === UserRegion.Other}
                 {#if $proxyForm.other}
                    <div class="space-y-2">
                        <label for="other-notes" class="block text-sm">Notes</label>
                        <textarea id="other-notes" bind:value={$proxyForm.other!.notes} class="border p-1 w-full rounded"></textarea>
                    </div>
                 {/if}
            {/if}
        </div>
      </div>

      <!-- Favorite Games -->
      <div class="border-t pt-4">
        <h3 class="text-lg font-medium mb-2">Favorite Games</h3>
        <div class="space-y-2">
            {#each $eForm.favoriteGames as game, i (game.key)}
                <div class="flex items-center gap-2 border p-2 rounded bg-gray-50">
                    <div class="flex-1">
                        <select bind:value={game.id} class="w-full p-1 border rounded">
                            {#each AVAILABLE_GAMES as g}
                                <option value={g.id}>{g.title} ({g.platform})</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <input type="date" bind:value={game.favoriteSince} class="p-1 border rounded text-sm" placeholder="Since" />
                    </div>
                    <label class="flex items-center space-x-1">
                        <input type="checkbox" bind:checked={game.pinned} />
                        <span class="text-xs">Pinned</span>
                    </label>
                    <button type="button" onclick={() => removeGame(i)} class="text-red-600 text-sm hover:underline">Remove</button>
                </div>
                 {#if $proxyErrors.favoriteGames?.[i]?.id}<span class="text-red-600 text-xs block">{$proxyErrors.favoriteGames[i].id}</span>{/if}
            {/each}
        </div>
        <button type="button" onclick={addGame} class="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            + Add Game
        </button>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  </section>
</div>
