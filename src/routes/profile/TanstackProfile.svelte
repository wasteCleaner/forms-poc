<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { profileSchema, skillSchema, type ProfileData, type Skill } from '$lib/schemas';
	import { Button, Input, Label, Select } from '$lib/components/ui';

	interface Props {
		initialData: ProfileData;
	}

	let { initialData }: Props = $props();

	const form = createForm(() => ({
		defaultValues: initialData,
		validators: {
			onBlur: profileSchema
		},
		onSubmit: async ({ value }) => {
			console.log('[TanStack Form Client] Profile submitted:', value);
		}
	}));

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
		const skills = form.getFieldValue('skills');
		editingIndex = index;
		skillName = skills[index].name;
		skillLevel = skills[index].level;
		showModal = true;
	}

	function saveSkill() {
		const skill = { name: skillName, level: skillLevel };
		const result = skillSchema.safeParse(skill);

		if (!result.success) {
			return;
		}

		const skills = form.getFieldValue('skills');

		if (editingIndex !== null) {
			const updated = [...skills];
			updated[editingIndex] = skill;
			form.setFieldValue('skills', updated);
		} else {
			form.pushFieldValue('skills', skill);
		}

		showModal = false;
	}

	function removeSkill(index: number) {
		form.removeFieldValue('skills', index);
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit();
	}}
	class="space-y-4"
>
	<form.Field name="gender">
		{#snippet children(field)}
			<div class="space-y-2">
				<Label for="ts-gender">Gender</Label>
				<Select
					id="ts-gender"
					bind:value={field.state.value}
				>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="other">Other</option>
				</Select>
				{#if field.state.meta.isTouched && field.state.meta.errors.length > 0}
					<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
				{/if}
			</div>
		{/snippet}
	</form.Field>

	<form.Field name="age">
		{#snippet children(field)}
			<div class="space-y-2">
				<Label for="ts-age">Age</Label>
				<Input
					id="ts-age"
					type="number"
					value={field.state.value}
					onblur={field.handleBlur}
					oninput={(e) => field.handleChange(Number(e.currentTarget.value))}
				/>
				{#if field.state.meta.isTouched && field.state.meta.errors.length > 0}
					<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
				{/if}
			</div>
		{/snippet}
	</form.Field>

	<form.Field name="skills" mode="array">
		{#snippet children(skillsField)}
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<Label>Skills</Label>
					<Button type="button" variant="outline" size="sm" onclick={openAddModal}>Add Skill</Button>
				</div>

				{#if skillsField.state.value.length === 0}
					<p class="text-sm text-muted">No skills added yet.</p>
				{:else}
					<ul class="space-y-2">
						{#each skillsField.state.value as skill, i}
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

				{#if skillsField.state.meta.errors.length > 0}
					<p class="text-sm text-destructive">{skillsField.state.meta.errors[0]}</p>
				{/if}
			</div>
		{/snippet}
	</form.Field>

	<form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
		{#snippet children(state)}
			<Button type="submit" disabled={!state.canSubmit || state.isSubmitting}>
				{state.isSubmitting ? 'Submitting...' : 'Save Profile'}
			</Button>
		{/snippet}
	</form.Subscribe>
</form>

{#if showModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-background border rounded-lg p-6 w-96 space-y-4">
			<h3 class="text-lg font-semibold">
				{editingIndex !== null ? 'Edit Skill' : 'Add Skill'}
			</h3>

			<div class="space-y-2">
				<Label for="ts-skill-name">Skill Name</Label>
				<Input id="ts-skill-name" bind:value={skillName} />
			</div>

			<div class="space-y-2">
				<Label for="ts-skill-level">Level</Label>
				<Select id="ts-skill-level" bind:value={skillLevel}>
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
