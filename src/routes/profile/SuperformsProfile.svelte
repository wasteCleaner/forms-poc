<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { profileSchema, skillSchema, type ProfileData, type Skill } from '$lib/schemas';
	import { Button, Input, Label, Select } from '$lib/components/ui';

	interface Props {
		data: SuperValidated<ProfileData>;
	}

	let { data }: Props = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance, submitting } = superForm(data, {
		validators: zodClient(profileSchema),
		dataType: 'json'
	});

	let showModal = $state(false);
	let editingIndex = $state<number | null>(null);
	let skillName = $state('');
	let skillLevel = $state<Skill['level']>('beginner');

	function openAddModal() {
		editingIndex = null;
		skillName = '';
		skillLevel = 'beginner';
		showModal = true;
	}

	function openEditModal(index: number) {
		editingIndex = index;
		skillName = $form.skills[index].name;
		skillLevel = $form.skills[index].level;
		showModal = true;
	}

	function saveSkill() {
		const skill = { name: skillName, level: skillLevel };
		const result = skillSchema.safeParse(skill);

		if (!result.success) {
			return;
		}

		if (editingIndex !== null) {
			$form.skills[editingIndex] = skill;
		} else {
			$form.skills = [...$form.skills, skill];
		}

		showModal = false;
	}

	function removeSkill(index: number) {
		$form.skills = $form.skills.filter((_, i) => i !== index);
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

	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<Label>Skills</Label>
			<Button type="button" variant="outline" size="sm" onclick={openAddModal}>Add Skill</Button>
		</div>

		{#if $form.skills.length === 0}
			<p class="text-sm text-muted">No skills added yet.</p>
		{:else}
			<ul class="space-y-2">
				{#each $form.skills as skill, i}
					<li class="flex items-center justify-between border rounded p-2">
						<div>
							<span class="font-medium">{skill.name}</span>
							<span class="text-muted text-sm ml-2">({skill.level})</span>
						</div>
						<div class="flex gap-2">
							<Button type="button" variant="ghost" size="sm" onclick={() => openEditModal(i)}>
								Edit
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								class="text-destructive"
								onclick={() => removeSkill(i)}
							>
								Remove
							</Button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		{#if $errors.skills?._errors}
			<p class="text-sm text-destructive">{$errors.skills._errors[0]}</p>
		{/if}
	</div>

	<Button type="submit" disabled={$submitting}>
		{$submitting ? 'Submitting...' : 'Save Profile'}
	</Button>
</form>

{#if showModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-background border rounded-lg p-6 w-96 space-y-4">
			<h3 class="text-lg font-semibold">
				{editingIndex !== null ? 'Edit Skill' : 'Add Skill'}
			</h3>

			<div class="space-y-2">
				<Label for="skill-name">Skill Name</Label>
				<Input id="skill-name" bind:value={skillName} />
			</div>

			<div class="space-y-2">
				<Label for="skill-level">Level</Label>
				<Select id="skill-level" bind:value={skillLevel}>
					<option value="beginner">Beginner</option>
					<option value="experienced">Experienced</option>
					<option value="professional">Professional</option>
					<option value="expert">Expert</option>
				</Select>
			</div>

			<div class="flex gap-2 justify-end">
				<Button type="button" variant="outline" onclick={() => (showModal = false)}>Cancel</Button>
				<Button type="button" onclick={saveSkill}>Save</Button>
			</div>
		</div>
	</div>
{/if}
