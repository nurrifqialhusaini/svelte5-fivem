<script lang="ts">
	import { onMount } from "svelte";
	import { visibilityStore as visibility } from "$lib/stores/VisibilityStore";
	import { useNuiEvent } from "$lib/hooks/useNuiEvent";
	import { fetchNui } from "$lib/utils/fetchNui";

	onMount(() => {
		const keyHandler = (e: KeyboardEvent) => {
			if ($visibility && e.code === "Escape") {
				fetchNui("hideUI");
				visibility.hide();
			}
		};

		window.addEventListener("keydown", keyHandler);
		return () => window.removeEventListener("keydown", keyHandler);
	});

	useNuiEvent<boolean>("setVisible", (visible) => {
		visibility.toggle(visible);
	});
</script>

{#if $visibility}
	<slot />
{/if}
