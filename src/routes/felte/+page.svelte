<script lang="ts">
  import { createForm } from 'felte';
  import { validator } from '@felte/validator-zod';
  import { enhance } from '$app/forms';
  import { get } from 'svelte/store';
  import { loginSchema, editUserSchema } from '$lib/schemas';
  import {
    UserRegion,
    USState,
    ContactChannel,
    AuthMethod,
    type EditUserFormState,
    type EUUserFields,
    type USUserFields,
    type UKUserFields,
    type OtherRegionUserFields
  } from '$lib/types';
  import { AVAILABLE_GAMES } from '$lib/data';
  import type { ActionData } from './$types';

  let { form: actionForm }: { form: ActionData } = $props();

  // --- Login Form ---
  const { form: lForm, data: lData, errors: lErrors } = createForm({
    extend: validator({ schema: loginSchema }),
    initialValues: {
        method: AuthMethod.Password,
        email: '',
        password: '',
        rememberMe: false
    }
  });

  // --- Edit User Form ---
  const { form: eForm, data: eData, errors: eErrors, setFields } = createForm<EditUserFormState>({
    extend: validator({ schema: editUserSchema as any }),
    initialValues: {
      email: '',
      displayName: '',
      locale: 'en-US',
      region: UserRegion.EU,
      contact: {
        channel: ContactChannel.Email,
        marketingOptIn: false,
        productUpdatesOptIn: false,
      },
      favoriteGames: [],
      eu: {
        gdprConsent: false,
        vatId: '',
        nationalId: '',
      },
    }
  });

  type RegionCache = {
    [UserRegion.EU]?: EUUserFields;
    [UserRegion.US]?: USUserFields;
    [UserRegion.UK]?: UKUserFields;
    [UserRegion.Other]?: OtherRegionUserFields;
  };

  let regionCache: RegionCache = {};

  function onRegionChange(event: Event) {
    const region = (event.target as HTMLSelectElement).value as UserRegion;

    // Cache current region data before switching
    // $eData.region holds the PREVIOUS region because we don't bind select value
    const current = get(eData);

    if (current.region === UserRegion.EU && current.eu) {
        regionCache[UserRegion.EU] = { ...current.eu };
    } else if (current.region === UserRegion.US && current.us) {
        regionCache[UserRegion.US] = { ...current.us };
    } else if (current.region === UserRegion.UK && current.uk) {
        regionCache[UserRegion.UK] = { ...current.uk };
    } else if (current.region === UserRegion.Other && current.other) {
        regionCache[UserRegion.Other] = { ...current.other };
    }

    // Create new data object with new region
    let newData = { ...current, region };

    // Reset/Init fields for the new region using cache if available
    if (region === UserRegion.EU) {
        newData.eu = regionCache[UserRegion.EU] || { gdprConsent: false, vatId: '', nationalId: '' };
        delete newData.us;
        delete newData.uk;
        delete newData.other;
    } else if (region === UserRegion.US) {
        newData.us = regionCache[UserRegion.US] || { state: USState.CA, zipPlus4: '', ssnLast4: '', taxResidencyConfirmed: false };
        delete newData.eu;
        delete newData.uk;
        delete newData.other;
    } else if (region === UserRegion.UK) {
        newData.uk = regionCache[UserRegion.UK] || { county: '', postcode: '', ninLast4: '' };
        delete newData.eu;
        delete newData.us;
        delete newData.other;
    } else if (region === UserRegion.Other) {
        newData.other = regionCache[UserRegion.Other] || { notes: '', timezone: '' };
        delete newData.eu;
        delete newData.us;
        delete newData.uk;
    }

    // Direct store assignment to force update
    $eData = newData;
  }

  function addGame() {
    const currentGames = get(eData).favoriteGames;
    const newGames = [
      ...currentGames,
      { id: AVAILABLE_GAMES[0].id, pinned: false, favoriteSince: '' as const, key: crypto.randomUUID() }
    ];
    $eData = { ...get(eData), favoriteGames: newGames };
  }

  function removeGame(index: number) {
    const currentGames = get(eData).favoriteGames;
    const newGames = currentGames.filter((_, i) => i !== index);
    $eData = { ...get(eData), favoriteGames: newGames };
  }
</script>

<div class="p-8 max-w-4xl mx-auto space-y-12">
  <h1 class="text-3xl font-bold mb-4">Felte POC</h1>

  <!-- LOGIN FORM -->
  <section class="border p-6 rounded-lg shadow-sm bg-white">
    <h2 class="text-xl font-semibold mb-4">Login Form</h2>

    {#if actionForm?.error}
      <div class="mb-4 p-3 rounded bg-red-100 text-red-800">
        {actionForm.error}
      </div>
    {/if}
    {#if actionForm?.success}
       <div class="mb-4 p-3 rounded bg-green-100 text-green-800">
        Login successful!
      </div>
    {/if}

    <form use:lForm method="POST" action="?/login" class="space-y-4">
      <input type="hidden" name="method" value={AuthMethod.Password} />

      <div>
        <label for="l-email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="l-email"
          type="email"
          name="email"
          bind:value={$lData.email}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
        />
        {#if $lErrors.email}<span class="text-red-600 text-xs">{$lErrors.email}</span>{/if}
      </div>

      <div>
        <label for="l-password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="l-password"
          type="password"
          name="password"
          bind:value={$lData.password}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
        />
        {#if $lErrors.password}<span class="text-red-600 text-xs">{$lErrors.password}</span>{/if}
      </div>

      <div class="flex items-center">
        <input
          id="l-rememberMe"
          type="checkbox"
          name="rememberMe"
          bind:checked={$lData.rememberMe}
          class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
        <label for="l-rememberMe" class="ml-2 block text-sm text-gray-900">Remember me</label>
      </div>

      <button
        type="submit"
        class="py-2 px-4 bg-indigo-600 text-white rounded"
      >
        Sign In
      </button>
    </form>
  </section>

  <!-- EDIT USER FORM -->
  <section class="border p-6 rounded-lg shadow-sm bg-white">
    <h2 class="text-xl font-semibold mb-4">Edit User Form</h2>

    <form use:eForm method="POST" action="?/editUser" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="e-email" class="block text-sm font-medium">Email</label>
          <input id="e-email" type="email" name="email" bind:value={$eData.email} class="border p-2 w-full rounded" />
          {#if $eErrors.email}<span class="text-red-600 text-xs">{$eErrors.email}</span>{/if}
        </div>

        <div>
          <label for="e-displayName" class="block text-sm font-medium">Display Name</label>
          <input id="e-displayName" type="text" name="displayName" bind:value={$eData.displayName} class="border p-2 w-full rounded" />
          {#if $eErrors.displayName}<span class="text-red-600 text-xs">{$eErrors.displayName}</span>{/if}
        </div>

        <div>
          <label for="e-locale" class="block text-sm font-medium">Locale</label>
          <input id="e-locale" type="text" name="locale" bind:value={$eData.locale} class="border p-2 w-full rounded" />
           {#if $eErrors.locale}<span class="text-red-600 text-xs">{$eErrors.locale}</span>{/if}
        </div>
      </div>

      <div class="border-t pt-4">
        <h3 class="text-lg font-medium mb-2">Contact</h3>
        <div class="grid grid-cols-1 gap-2">
             <label>
                Channel
                <select name="contact.channel" bind:value={$eData.contact.channel} class="border p-2 w-full rounded">
                    <option value={ContactChannel.Email}>Email</option>
                    <option value={ContactChannel.Phone}>Phone</option>
                </select>
             </label>
             <div class="flex gap-4">
                <label class="flex items-center space-x-2">
                    <input type="checkbox" name="contact.marketingOptIn" bind:checked={$eData.contact.marketingOptIn} />
                    <span class="text-sm">Marketing</span>
                </label>
                <label class="flex items-center space-x-2">
                    <input type="checkbox" name="contact.productUpdatesOptIn" bind:checked={$eData.contact.productUpdatesOptIn} />
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
            class="border p-2 w-full rounded"
        >
            {#each Object.values(UserRegion) as region}
                <option value={region}>{region}</option>
            {/each}
        </select>

        <div class="mt-4 p-4 bg-gray-50 rounded">
            {#if $eData.region === UserRegion.EU}
                 {#if $eData.eu}
                    <div class="space-y-2">
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" name="eu.gdprConsent" bind:checked={$eData.eu.gdprConsent} />
                            <span class="text-sm">GDPR Consent</span>
                        </label>
                        {#if ($eErrors as any).eu?.gdprConsent}<span class="text-red-600 text-xs">{($eErrors as any).eu.gdprConsent}</span>{/if}

                        <label for="eu-vatId" class="block text-sm">VAT ID</label>
                        <input id="eu-vatId" type="text" name="eu.vatId" bind:value={$eData.eu.vatId} class="border p-1 w-full rounded" />

                        <label for="eu-nationalId" class="block text-sm">National ID</label>
                        <input id="eu-nationalId" type="text" name="eu.nationalId" bind:value={$eData.eu.nationalId} class="border p-1 w-full rounded" />
                    </div>
                 {/if}
            {:else if $eData.region === UserRegion.US}
                 {#if $eData.us}
                    <div class="space-y-2">
                        <label for="us-state" class="block text-sm">State</label>
                        <select id="us-state" name="us.state" bind:value={$eData.us.state} class="border p-1 w-full rounded">
                            {#each Object.values(USState) as state}
                                <option value={state}>{state}</option>
                            {/each}
                        </select>
                        <label for="us-zipPlus4" class="block text-sm">Zip+4</label>
                        <input id="us-zipPlus4" type="text" name="us.zipPlus4" bind:value={$eData.us.zipPlus4} class="border p-1 w-full rounded" />

                        <label for="us-ssnLast4" class="block text-sm">SSN Last 4</label>
                        <input id="us-ssnLast4" type="text" name="us.ssnLast4" bind:value={$eData.us.ssnLast4} class="border p-1 w-full rounded" />

                        <label class="flex items-center space-x-2">
                            <input type="checkbox" name="us.taxResidencyConfirmed" bind:checked={$eData.us.taxResidencyConfirmed} />
                            <span class="text-sm">Tax Residency Confirmed</span>
                        </label>
                    </div>
                 {/if}
            {:else if $eData.region === UserRegion.UK}
                 {#if $eData.uk}
                    <div class="space-y-2">
                        <label for="uk-postcode" class="block text-sm">Postcode</label>
                        <input id="uk-postcode" type="text" name="uk.postcode" bind:value={$eData.uk.postcode} class="border p-1 w-full rounded" />
                        {#if ($eErrors as any).uk?.postcode}<span class="text-red-600 text-xs">{($eErrors as any).uk.postcode}</span>{/if}

                        <label for="uk-county" class="block text-sm">County</label>
                        <input id="uk-county" type="text" name="uk.county" bind:value={$eData.uk.county} class="border p-1 w-full rounded" />

                        <label for="uk-ninLast4" class="block text-sm">NIN Last 4</label>
                        <input id="uk-ninLast4" type="text" name="uk.ninLast4" bind:value={$eData.uk.ninLast4} class="border p-1 w-full rounded" />
                    </div>
                 {/if}
            {:else if $eData.region === UserRegion.Other}
                 {#if $eData.other}
                    <div class="space-y-2">
                        <label for="other-notes" class="block text-sm">Notes</label>
                        <textarea id="other-notes" name="other.notes" bind:value={$eData.other.notes} class="border p-1 w-full rounded"></textarea>

                        <label for="other-timezone" class="block text-sm">Timezone</label>
                        <input id="other-timezone" type="text" name="other.timezone" bind:value={$eData.other.timezone} class="border p-1 w-full rounded" />
                    </div>
                 {/if}
            {/if}
        </div>
      </div>

      <!-- Favorite Games -->
      <div class="border-t pt-4">
        <h3 class="text-lg font-medium mb-2">Favorite Games</h3>
        <div class="space-y-2">
            {#each $eData.favoriteGames as game, i (game.key || i)}
                <div class="flex items-center gap-2 border p-2 rounded bg-gray-50" data-testid="game-item">
                    <select name={`favoriteGames[${i}].id`} bind:value={game.id} class="w-full p-1 border rounded">
                         {#each AVAILABLE_GAMES as g}
                            <option value={g.id}>{g.title} ({g.platform})</option>
                        {/each}
                    </select>
                    <input type="date" name={`favoriteGames[${i}].favoriteSince`} bind:value={game.favoriteSince} class="p-1 border rounded text-sm" />
                    <label class="flex items-center space-x-1">
                        <input type="checkbox" name={`favoriteGames[${i}].pinned`} bind:checked={game.pinned} />
                        <span class="text-xs">Pinned</span>
                    </label>
                    <button type="button" onclick={() => removeGame(i)} class="text-red-600 text-sm">Remove</button>
                </div>
                {#if ($eErrors as any).favoriteGames?.[i]?.id}<span class="text-red-600 text-xs block">{($eErrors as any).favoriteGames[i].id}</span>{/if}
            {/each}
        </div>
        <button type="button" onclick={addGame} class="mt-2 text-sm text-indigo-600 font-medium hover:text-indigo-800">
            + Add Game
        </button>
      </div>

      <button type="submit" class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Changes</button>
    </form>
  </section>
</div>
