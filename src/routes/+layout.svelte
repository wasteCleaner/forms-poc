<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="min-h-screen">
	<nav class="border-b p-4">
		<div class="flex gap-4">
			<a href="/" class="font-semibold hover:underline">Home</a>
			<a href="/login" class="hover:underline">Login</a>
			<a href="/profile" class="hover:underline">Profile</a>
		</div>
	</nav>
	{@render children()}
</div>
