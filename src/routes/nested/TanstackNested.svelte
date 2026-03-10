<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { profileSchema, skillSchema, type ProfileData, type Skill } from '$lib/schemas';
	import { Button, Input, Label, Select } from '$lib/components/ui';

	interface Props {
		initialData: ProfileData;
	}

	let { initialData }: Props = $props();

	let editingIndex = $state<number | null>(null);

	const parentForm = createForm(() => ({
		defaultValues: initialData,
		validators: {
			onBlur: profileSchema
		},
		onSubmit: async ({ value }) => {
			console.log('[TanStack Form Client] Nested submitted:', value);
		}
	}));

	const childForm = createForm(() => ({
		defaultValues: { name: '', level: 'beginner' as Skill['level'] },
		validators: {
			onSubmit: skillSchema
		},
		onSubmit: async ({ value }) => {
			if (editingIndex !== null) {
				const skills = parentForm.getFieldValue('skills');
				const updated = [...skills];
				updated[editingIndex] = value;
				parentForm.setFieldValue('skills', updated);
				editingIndex = null;
			} else {
				parentForm.pushFieldValue('skills', value);
			}
			childForm.reset();
		}
	}));

	function editSkill(index: number) {
		const skills = parentForm.getFieldValue('skills');
		editingIndex = index;
		childForm.setFieldValue('name', skills[index].name);
		childForm.setFieldValue('level', skills[index].level);
	}

	function cancelEdit() {
		editingIndex = null;
		childForm.reset();
	}

	function removeSkill(index: number) {
		parentForm.removeFieldValue('skills', index);
		if (editingIndex === index) cancelEdit();
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		e.stopPropagation();
		parentForm.handleSubmit();
	}}
	class="space-y-4"
>
	<parentForm.Field name="gender">
		{#snippet children(field)}
			<div class="space-y-2">
				<Label for="ts-gender">Gender</Label>
				<Select id="ts-gender" bind:value={field.state.value}>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="other">Other</option>
				</Select>
				{#if field.state.meta.isTouched && field.state.meta.errors.length > 0}
					<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
				{/if}
			</div>
		{/snippet}
	</parentForm.Field>

	<parentForm.Field name="age">
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
	</parentForm.Field>

	<parentForm.Field name="skills" mode="array">
		{#snippet children(skillsField)}
			<div class="space-y-3">
				<Label>Skills</Label>

				{#if skillsField.state.value.length === 0}
					<p class="text-sm text-muted">No skills added yet.</p>
				{:else}
					<ul class="space-y-2">
						{#each skillsField.state.value as skill, i}
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

				{#if skillsField.state.meta.errors.length > 0}
					<p class="text-sm text-destructive">{skillsField.state.meta.errors[0]}</p>
				{/if}

				<div class="border-2 border-dashed rounded p-4 space-y-3">
					<h4 class="font-medium text-sm">
						{editingIndex !== null ? `Edit Skill #${editingIndex + 1}` : 'Add New Skill'}
					</h4>

					<childForm.Field name="name">
						{#snippet children(field)}
							<div class="space-y-2">
								<Label for="ts-child-name">Skill Name</Label>
								<Input
									id="ts-child-name"
									value={field.state.value}
									onblur={field.handleBlur}
									oninput={(e) => field.handleChange(e.currentTarget.value)}
								/>
								{#if field.state.meta.errors.length > 0}
									<p class="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
								{/if}
							</div>
						{/snippet}
					</childForm.Field>

					<childForm.Field name="level">
						{#snippet children(field)}
							<div class="space-y-2">
								<Label for="ts-child-level">Level</Label>
								<Select id="ts-child-level" bind:value={field.state.value}>
									<option value="beginner">Beginner</option>
									<option value="experienced">Experienced</option>
									<option value="professional">Professional</option>
									<option value="expert">Expert</option>
								</Select>
							</div>
						{/snippet}
					</childForm.Field>

					<div class="flex gap-2">
						<Button type="button" variant="outline" onclick={() => childForm.handleSubmit()}>
							{editingIndex !== null ? 'Update Skill' : 'Add Skill'}
						</Button>
						{#if editingIndex !== null}
							<Button type="button" variant="ghost" onclick={cancelEdit}>Cancel</Button>
						{/if}
					</div>
				</div>
			</div>
		{/snippet}
	</parentForm.Field>

	<parentForm.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
		{#snippet children(state)}
			<Button type="submit" disabled={!state.canSubmit || state.isSubmitting}>
				{state.isSubmitting ? 'Submitting...' : 'Save Profile'}
			</Button>
		{/snippet}
	</parentForm.Subscribe>
</form>
