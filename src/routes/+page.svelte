<script lang="ts">
	import { Button } from '$lib/components/ui';
</script>

<div class="max-w-2xl mx-auto p-8">
	<h1 class="text-3xl font-bold mb-4">Forms POC</h1>
	<p class="text-muted mb-6">
		Comparing <strong>sveltekit-superforms</strong> and <strong>TanStack Form</strong> form libraries
		for SvelteKit.
	</p>

	<div class="space-y-4">
		<div class="border rounded-lg p-4">
			<h2 class="text-xl font-semibold mb-2">Login Form</h2>
			<p class="text-muted mb-3">Simple email/password validation</p>
			<a href="/login">
				<Button>View Login Demo</Button>
			</a>
		</div>

		<div class="border rounded-lg p-4">
			<h2 class="text-xl font-semibold mb-2">Profile Form</h2>
			<p class="text-muted mb-3">Complex form with dynamic skills array</p>
			<a href="/profile">
				<Button>View Profile Demo</Button>
			</a>
		</div>

		<div class="border rounded-lg p-4">
			<h2 class="text-xl font-semibold mb-2">Nested Form</h2>
			<p class="text-muted mb-3">Child form with independent validation syncing to parent</p>
			<a href="/nested">
				<Button>View Nested Demo</Button>
			</a>
		</div>

		<div class="border rounded-lg p-4">
			<h2 class="text-xl font-semibold mb-2">Wizard Form</h2>
			<p class="text-muted mb-3">Multi-step wizard with free navigation</p>
			<a href="/wizard">
				<Button>View Wizard Demo</Button>
			</a>
		</div>
	</div>
</div>
