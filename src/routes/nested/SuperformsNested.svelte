<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { profileSchema, skillSchema, type ProfileData, type Skill } from '$lib/schemas';
	import { Button, Input, Label, Select } from '$lib/components/ui';

	interface Props {
		data: SuperValidated<ProfileData>;
	}

	let { data }: Props = $props();

	const { form, errors, enhance, submitting } = superForm(data, {
		validators: zod4Client(profileSchema),
		dataType: 'json'
	});

	let childName = $state('');
	let childLevel = $state<Skill['level']>('beginner');
	let childErrors = $state<Record<string, string[]>>({});
	let editingIndex = $state<number | null>(null);

	function validateAndSave() {
		const result = skillSchema.safeParse({ name: childName, level: childLevel });
		if (!result.success) {
			childErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
			return;
		}
		childErrors = {};

		if (editingIndex !== null) {
			$form.skills[editingIndex] = result.data;
			editingIndex = null;
		} else {
			$form.skills = [...$form.skills, result.data];
		}
		childName = '';
		childLevel = 'beginner';
	}

	function editSkill(index: number) {
		editingIndex = index;
		childName = $form.skills[index].name;
		childLevel = $form.skills[index].level;
		childErrors = {};
	}

	function cancelEdit() {
		editingIndex = null;
		childName = '';
		childLevel = 'beginner';
		childErrors = {};
	}

	function removeSkill(index: number) {
		$form.skills = $form.skills.filter((_, i) => i !== index);
		if (editingIndex === index) cancelEdit();
	}
</script>

<form method="POST" action="?/superforms" use:enhance class="space-y-4">
	<div class="space-y-2">
		<Label for="sf-gender">Gender</Label>
		<Select id="sf-gender" name="gender" bind:value={$form.gender}>
			<option value="male">Male</option>
			<option value="female">Female</option>
			<option value="other">Other</option>
		</Select>
		{#if $errors.gender}
			<p class="text-sm text-destructive">{$errors.gender[0]}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="sf-age">Age</Label>
		<Input id="sf-age" type="number" name="age" bind:value={$form.age} />
		{#if $errors.age}
			<p class="text-sm text-destructive">{$errors.age[0]}</p>
		{/if}
	</div>

	<div class="space-y-3">
		<Label>Skills</Label>
		{#if $form.skills.length === 0}
			<p class="text-sm text-muted">No skills added yet.</p>
		{:else}
			<ul class="space-y-2">
				{#each $form.skills as skill, i}
					<li class="flex items-center justify-between border rounded p-2">
						<button type="button" class="text-left flex-1" onclick={() => editSkill(i)}>
							<span class="font-medium">{skill.name}</span>
							<span class="text-muted text-sm ml-2">({skill.level})</span>
						</button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							class="text-destructive"
							onclick={() => removeSkill(i)}
						>
							Remove
						</Button>
					</li>
				{/each}
			</ul>
		{/if}

		{#if $errors.skills?._errors}
			<p class="text-sm text-destructive">{$errors.skills._errors[0]}</p>
		{/if}

		<!-- Child form: separate validation via skillSchema.safeParse() -->
		<div class="border-2 border-dashed rounded p-4 space-y-3">
			<h4 class="font-medium text-sm">
				{editingIndex !== null ? `Edit Skill #${editingIndex + 1}` : 'Add New Skill'}
			</h4>

			<div class="space-y-2">
				<Label for="sf-child-name">Skill Name</Label>
				<Input id="sf-child-name" bind:value={childName} />
				{#if childErrors.name}
					<p class="text-sm text-destructive">{childErrors.name[0]}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="sf-child-level">Level</Label>
				<Select id="sf-child-level" bind:value={childLevel}>
					<option value="beginner">Beginner</option>
					<option value="experienced">Experienced</option>
					<option value="professional">Professional</option>
					<option value="expert">Expert</option>
				</Select>
				{#if childErrors.level}
					<p class="text-sm text-destructive">{childErrors.level[0]}</p>
				{/if}
			</div>

			<div class="flex gap-2">
				<Button type="button" variant="outline" onclick={validateAndSave}>
					{editingIndex !== null ? 'Update Skill' : 'Add Skill'}
				</Button>
				{#if editingIndex !== null}
					<Button type="button" variant="ghost" onclick={cancelEdit}>Cancel</Button>
				{/if}
			</div>
		</div>
	</div>

	<Button type="submit" disabled={$submitting}>
		{$submitting ? 'Submitting...' : 'Save Profile'}
	</Button>
</form>
