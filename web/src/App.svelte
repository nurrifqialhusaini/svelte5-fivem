<script lang="ts">
	import Dashboard from "$lib/Dashboard.svelte";
	import VisibilityProvider from "$lib/providers/VisibilityProviider.svelte";
</script>

<VisibilityProvider>
	<!-- you can put your code or component in here -->
	<Dashboard />
</VisibilityProvider>
