<script lang="ts">
	import type { PageData } from './$types';
	import SuperformsProfile from './SuperformsProfile.svelte';
	import FelteProfile from './FelteProfile.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="grid grid-cols-2 min-h-[calc(100vh-65px)]">
	<div class="border-r p-6">
		<h2 class="text-lg font-semibold mb-4">Superforms</h2>
		<SuperformsProfile data={data.form} />
	</div>
	<div class="p-6">
		<h2 class="text-lg font-semibold mb-4">Felte</h2>
		<FelteProfile initialData={data.initialData} />
	</div>
</div>
