<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import { visibilityStore as visibility } from "$lib/stores/VisibilityStore";
	import { useNuiEvent } from "$lib/hooks/useNuiEvent";
	import { fetchNui } from "$lib/utils/fetchNui";

	let { children }: { children: Snippet } = $props();

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
	{@render children()}
{/if}
