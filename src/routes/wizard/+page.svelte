<script lang="ts">
	import type { PageData } from './$types';
	import SuperformsWizard from './SuperformsWizard.svelte';
	import TanstackWizard from './TanstackWizard.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="grid grid-cols-2 min-h-[calc(100vh-65px)]">
	<div class="border-r p-6">
		<h2 class="text-lg font-semibold mb-4">Superforms</h2>
		<SuperformsWizard data={data.form} />
	</div>
	<div class="p-6">
		<h2 class="text-lg font-semibold mb-4">TanStack Form</h2>
		<TanstackWizard />
	</div>
</div>
