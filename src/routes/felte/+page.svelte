<script lang="ts">
  import { createForm } from 'felte';
  import { validator } from '@felte/validator-zod';
  import { enhance } from '$app/forms';
  import { loginSchema, editUserSchema } from '$lib/schemas';
  import {
    UserRegion,
    USState,
    ContactChannel,
    AuthMethod
  } from '$lib/types';
  import { AVAILABLE_GAMES } from '$lib/data';
  import type { ActionData } from './$types';

  let { form: actionForm }: { form: ActionData } = $props();

  // --- Login Form ---
  const { form: lForm, data: lData, errors: lErrors } = createForm({
    extend: validator({ schema: loginSchema }),
    initialValues: {
        method: AuthMethod.Password,
        rememberMe: false
    }
  });

  // --- Edit User Form ---
  const { form: eForm, data: eData, errors: eErrors, addField, removeField, setFields } = createForm({
    extend: validator({ schema: editUserSchema }),
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
      }
    }
  });

  function onRegionChange(event: Event) {
    const region = (event.target as HTMLSelectElement).value as UserRegion;
    $eData.region = region;

    // Reset/Init fields for the new region
    if (region === UserRegion.EU) {
        setFields('eu', { gdprConsent: false, vatId: '', nationalId: '' });
        setFields('us', undefined); setFields('uk', undefined); setFields('other', undefined);
    } else if (region === UserRegion.US) {
        setFields('us', { state: USState.CA, zipPlus4: '', ssnLast4: '', taxResidencyConfirmed: false });
        setFields('eu', undefined); setFields('uk', undefined); setFields('other', undefined);
    } else if (region === UserRegion.UK) {
        setFields('uk', { county: '', postcode: '', ninLast4: '' });
        setFields('eu', undefined); setFields('us', undefined); setFields('other', undefined);
    } else if (region === UserRegion.Other) {
        setFields('other', { notes: '', timezone: '' });
        setFields('eu', undefined); setFields('us', undefined); setFields('uk', undefined);
    }
  }

  function addGame() {
    addField('favoriteGames', { id: AVAILABLE_GAMES[0].id, pinned: false, favoriteSince: '' });
  }

  function removeGame(index: number) {
      removeField(`favoriteGames.${index}`);
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

    <form use:lForm use:enhance method="POST" action="?/login" class="space-y-4">
      <input type="hidden" name="method" value={AuthMethod.Password} />

      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
        />
        {#if $lErrors.email}<span class="text-red-600 text-xs">{$lErrors.email}</span>{/if}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
        />
        {#if $lErrors.password}<span class="text-red-600 text-xs">{$lErrors.password}</span>{/if}
      </div>

      <div class="flex items-center">
        <input
          type="checkbox"
          name="rememberMe"
          class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
        <label class="ml-2 block text-sm text-gray-900">Remember me</label>
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

    <form use:eForm use:enhance method="POST" action="?/editUser" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium">Email</label>
          <input type="email" name="email" class="border p-2 w-full rounded" />
          {#if $eErrors.email}<span class="text-red-600 text-xs">{$eErrors.email}</span>{/if}
        </div>

        <div>
          <label class="block text-sm font-medium">Display Name</label>
          <input type="text" name="displayName" class="border p-2 w-full rounded" />
          {#if $eErrors.displayName}<span class="text-red-600 text-xs">{$eErrors.displayName}</span>{/if}
        </div>

        <div>
          <label class="block text-sm font-medium">Locale</label>
          <input type="text" name="locale" class="border p-2 w-full rounded" />
           {#if $eErrors.locale}<span class="text-red-600 text-xs">{$eErrors.locale}</span>{/if}
        </div>
      </div>

      <div class="border-t pt-4">
        <h3 class="text-lg font-medium mb-2">Contact</h3>
        <div class="grid grid-cols-1 gap-2">
             <label>
                Channel
                <select name="contact.channel" class="border p-2 w-full rounded">
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
        <label class="block text-sm font-medium">Region</label>
        <select
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
                <div class="space-y-2">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" name="eu.gdprConsent" />
                        <span class="text-sm">GDPR Consent</span>
                    </label>
                    {#if $eErrors.eu?.gdprConsent}<span class="text-red-600 text-xs">{$eErrors.eu.gdprConsent}</span>{/if}

                    <label class="block text-sm">VAT ID</label>
                    <input type="text" name="eu.vatId" class="border p-1 w-full rounded" />

                    <label class="block text-sm">National ID</label>
                    <input type="text" name="eu.nationalId" class="border p-1 w-full rounded" />
                </div>
            {:else if $eData.region === UserRegion.US}
                 <div class="space-y-2">
                    <label class="block text-sm">State</label>
                    <select name="us.state" class="border p-1 w-full rounded">
                        {#each Object.values(USState) as state}
                            <option value={state}>{state}</option>
                        {/each}
                    </select>
                    <label class="block text-sm">Zip+4</label>
                    <input type="text" name="us.zipPlus4" class="border p-1 w-full rounded" />
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" name="us.taxResidencyConfirmed" />
                        <span class="text-sm">Tax Residency Confirmed</span>
                    </label>
                 </div>
            {:else if $eData.region === UserRegion.UK}
                 <div class="space-y-2">
                    <label class="block text-sm">Postcode</label>
                    <input type="text" name="uk.postcode" class="border p-1 w-full rounded" />
                    {#if $eErrors.uk?.postcode}<span class="text-red-600 text-xs">{$eErrors.uk.postcode}</span>{/if}
                    <label class="block text-sm">County</label>
                    <input type="text" name="uk.county" class="border p-1 w-full rounded" />
                 </div>
            {/if}
        </div>
      </div>

      <!-- Favorite Games -->
      <div class="border-t pt-4">
        <h3 class="text-lg font-medium mb-2">Favorite Games</h3>
        <div class="space-y-2">
            {#each $eData.favoriteGames as game, i}
                <div class="flex items-center gap-2 border p-2 rounded bg-gray-50">
                    <select name={`favoriteGames.${i}.id`} class="w-full p-1 border rounded">
                         {#each AVAILABLE_GAMES as g}
                            <option value={g.id}>{g.title}</option>
                        {/each}
                    </select>
                    <input type="date" name={`favoriteGames.${i}.favoriteSince`} class="p-1 border rounded text-sm" />
                    <label class="flex items-center space-x-1">
                        <input type="checkbox" name={`favoriteGames.${i}.pinned`} />
                        <span class="text-xs">Pinned</span>
                    </label>
                    <button type="button" onclick={() => removeGame(i)} class="text-red-600 text-sm">Remove</button>
                </div>
                {#if $eErrors.favoriteGames?.[i]?.id}<span class="text-red-600 text-xs block">{$eErrors.favoriteGames[i].id}</span>{/if}
            {/each}
        </div>
        <button type="button" onclick={addGame} class="mt-2 text-sm text-indigo-600 font-medium">
            + Add Game
        </button>
      </div>

      <button type="submit" class="w-full py-2 bg-green-600 text-white rounded">Save Changes</button>
    </form>
  </section>
</div>
