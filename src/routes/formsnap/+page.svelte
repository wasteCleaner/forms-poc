<script lang="ts">
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
  import {
    UserRegion,
    USState,
    ContactChannel,
    AuthMethod
  } from '$lib/types';
  import { AVAILABLE_GAMES } from '$lib/data';
  import type { LoginSchema, EditUserSchema } from '$lib/schemas';
  import type { PageData } from './$types';

  import { zodClient } from 'sveltekit-superforms/adapters';
  import { loginSchema } from '$lib/schemas';

  let { data }: { data: PageData } = $props();

  // --- Login Form ---
  // svelte-ignore state_referenced_locally
  const loginForm = superForm<LoginSchema>(data.loginForm as SuperValidated<LoginSchema>, {
    validators: zodClient(loginSchema)
  });
  const { form: lForm, enhance: lEnhance, message: lMessage } = loginForm;

  // --- Edit User Form ---
  // svelte-ignore state_referenced_locally
  const editUserForm = superForm<EditUserSchema>(data.editUserForm as SuperValidated<EditUserSchema>, {
    dataType: 'json'
  });
  const { form: eForm, enhance: eEnhance, message: eMessage } = editUserForm;

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
    $eForm.favoriteGames = [
      ...$eForm.favoriteGames,
      { id: AVAILABLE_GAMES[0].id, pinned: false, favoriteSince: '' }
    ];
  }

  function removeGame(index: number) {
    $eForm.favoriteGames = $eForm.favoriteGames.filter((_, i) => i !== index);
  }
</script>

<div class="p-8 max-w-4xl mx-auto space-y-12">
  <h1 class="text-3xl font-bold mb-4">Formsnap POC</h1>

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

      <Field form={loginForm} name="email">
        <Control>
            {#snippet children({ props })}
                <Label class="block text-sm font-medium text-gray-700">Email</Label>
                <input
                  {...props}
                  type="email"
                  bind:value={$lForm.email}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                />
            {/snippet}
        </Control>
        <FieldErrors class="text-red-600 text-xs" />
      </Field>

      <Field form={loginForm} name="password">
        <Control>
            {#snippet children({ props })}
                <Label class="block text-sm font-medium text-gray-700">Password</Label>
                <input
                  {...props}
                  type="password"
                  bind:value={$lForm.password}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                />
            {/snippet}
        </Control>
        <FieldErrors class="text-red-600 text-xs" />
      </Field>

      <Field form={loginForm} name="rememberMe">
        <Control>
            {#snippet children({ props })}
                <div class="flex items-center">
                    <input
                        {...props}
                        type="checkbox"
                        bind:checked={$lForm.rememberMe}
                        class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <Label class="ml-2 block text-sm text-gray-900">Remember me</Label>
                </div>
            {/snippet}
        </Control>
      </Field>

      <button type="submit" class="py-2 px-4 bg-indigo-600 text-white rounded">Sign In</button>
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field form={editUserForm} name="email">
            <Control>
                {#snippet children({ props })}
                    <Label class="block text-sm font-medium">Email</Label>
                    <input {...props} type="email" bind:value={$eForm.email} class="border p-2 w-full rounded" />
                {/snippet}
            </Control>
            <FieldErrors class="text-red-600 text-xs" />
        </Field>

        <Field form={editUserForm} name="displayName">
            <Control>
                {#snippet children({ props })}
                    <Label class="block text-sm font-medium">Display Name</Label>
                    <input {...props} type="text" bind:value={$eForm.displayName} class="border p-2 w-full rounded" />
                {/snippet}
            </Control>
            <FieldErrors class="text-red-600 text-xs" />
        </Field>

        <Field form={editUserForm} name="locale">
             <Control>
                {#snippet children({ props })}
                    <Label class="block text-sm font-medium">Locale</Label>
                    <input {...props} type="text" bind:value={$eForm.locale} class="border p-2 w-full rounded" />
                {/snippet}
            </Control>
            <FieldErrors class="text-red-600 text-xs" />
        </Field>
      </div>

      <!-- Contact -->
      <div class="border-t pt-4 space-y-2">
         <Field form={editUserForm} name="contact.channel">
             <Control>
                {#snippet children({ props })}
                    <Label class="block text-sm font-medium">Channel</Label>
                    <select {...props} bind:value={$eForm.contact.channel} class="border p-2 w-full rounded">
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
                            <input {...props} type="checkbox" bind:checked={$eForm.contact.productUpdatesOptIn} />
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
                        class="border p-2 w-full rounded"
                    >
                        {#each Object.values(UserRegion) as region}
                            <option value={region}>{region}</option>
                        {/each}
                    </select>
                {/snippet}
            </Control>
        </Field>

        <div class="mt-4 p-4 bg-gray-50 rounded">
             {#if $eForm.region === UserRegion.EU && 'eu' in $eForm}
                <Field form={editUserForm} name="eu.gdprConsent">
                    <Control>
                        {#snippet children({ props })}
                            <label class="flex items-center space-x-2">
                                <input {...props} type="checkbox" bind:checked={($eForm as any).eu.gdprConsent} />
                                <span class="text-sm">GDPR Consent</span>
                            </label>
                        {/snippet}
                    </Control>
                    <FieldErrors class="text-red-600 text-xs" />
                </Field>
                <Field form={editUserForm} name="eu.vatId">
                    <Control>
                        {#snippet children({ props })}
                            <Label class="block text-sm">VAT ID</Label>
                            <input {...props} type="text" bind:value={($eForm as any).eu.vatId} class="border p-1 w-full rounded" />
                        {/snippet}
                    </Control>
                </Field>
             {:else if $eForm.region === UserRegion.US && 'us' in $eForm}
                <Field form={editUserForm} name="us.state">
                    <Control>
                        {#snippet children({ props })}
                            <Label class="block text-sm">State</Label>
                            <select {...props} bind:value={($eForm as any).us.state} class="border p-1 w-full rounded">
                                {#each Object.values(USState) as state}
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
                            <input {...props} type="text" bind:value={($eForm as any).us.zipPlus4} class="border p-1 w-full rounded" />
                        {/snippet}
                    </Control>
                </Field>
             {:else if $eForm.region === UserRegion.UK && 'uk' in $eForm}
                <Field form={editUserForm} name="uk.postcode">
                     <Control>
                        {#snippet children({ props })}
                            <Label class="block text-sm">Postcode</Label>
                            <input {...props} type="text" bind:value={($eForm as any).uk.postcode} class="border p-1 w-full rounded" />
                        {/snippet}
                    </Control>
                    <FieldErrors class="text-red-600 text-xs" />
                </Field>
             {/if}
        </div>
      </div>

      <!-- Array Field -->
      <div class="border-t pt-4">
        <h3 class="text-lg font-medium mb-2">Favorite Games</h3>
        <div class="space-y-2">
            {#each $eForm.favoriteGames as game, i}
                <div class="flex items-center gap-2 border p-2 rounded bg-gray-50">
                    <div class="flex-1">
                      <Field form={editUserForm} name={`favoriteGames[${i}].id`}>
                        <Control>
                            {#snippet children({ props })}
                                <select {...props} bind:value={game.id} class="w-full p-1 border rounded">
                                    {#each AVAILABLE_GAMES as g}
                                        <option value={g.id}>{g.title}</option>
                                    {/each}
                                </select>
                            {/snippet}
                        </Control>
                        <FieldErrors class="text-red-600 text-xs" />
                      </Field>
                    </div>

                    <div>
                     <Field form={editUserForm} name={`favoriteGames[${i}].favoriteSince`}>
                        <Control>
                             {#snippet children({ props })}
                                 <input {...props} type="date" bind:value={game.favoriteSince} class="p-1 border rounded text-sm" />
                             {/snippet}
                        </Control>
                     </Field>
                    </div>

                    <button type="button" onclick={() => removeGame(i)} class="text-red-600 text-sm">Remove</button>
                </div>
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
