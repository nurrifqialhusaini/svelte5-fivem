<script lang="ts">
	import Dashboard from "$lib/Dashboard.svelte";
	import VisibilityProvider from "$lib/providers/VisibilityProvider.svelte";
	import { debugData } from "$lib/utils/debugData";

	// mock data for browser
	debugData<unknown>([
		{ action: "setClock", data: { hour: 14, minute: 5 } },
		{ action: "setStreet", data: "Elysian Fields Fwy" },
	]);
</script>

<VisibilityProvider>
	<!-- you can put your code or component in here -->
	<Dashboard />
</VisibilityProvider>
