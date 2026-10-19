<script lang="ts">
	import { fetchNui } from "$lib/utils/fetchNui";
	import { visibilityStore as visibility } from "$lib/stores/VisibilityStore";

	const closeDialog = () => {
		visibility.toggle(false);
		fetchNui("hideUI");
	};
</script>

<footer class="px-6 pt-4 pb-5 divider-t">
	<div class="flex items-center justify-between gap-3">
		<button
			type="button"
			onclick={closeDialog}
			class="rounded-xl bg-black/25 px-4 py-2 text-sm font-medium inset-ring inset-ring-white/15 focus-ring hover:bg-white/10"
		>
			Close
		</button>
		<span class="text-xs text-ink-soft">
			or press
			<kbd
				class="ml-1 rounded-md bg-black/30 inset-ring inset-ring-white/15 px-1.5 py-0.5 font-sans text-[0.6875rem] text-ink"
				>Esc</kbd
			>
		</span>
	</div>
	<p class="mt-4 text-[0.6875rem] leading-relaxed text-ink-soft">
		Maintained by
		<a
			href="https://github.com/nurrifqialhusaini"
			target="_blank"
			rel="noreferrer"
			class="text-ink underline decoration-line underline-offset-2 focus-ring hover:decoration-ink"
			>Nur Rifqi Alhusaini</a
		>. Based on work by
		<a
			href="https://github.com/overextended/fivem-typescript-boilerplate"
			target="_blank"
			rel="noreferrer"
			class="text-ink underline decoration-line underline-offset-2 focus-ring hover:decoration-ink"
			>Overextended</a
		>,
		<a
			href="https://github.com/Slyker/svelte5-fivem-template"
			target="_blank"
			rel="noreferrer"
			class="text-ink underline decoration-line underline-offset-2 focus-ring hover:decoration-ink"
			>Slyker</a
		>
		and
		<a
			href="https://github.com/sleepyexe/svelte-fivem"
			target="_blank"
			rel="noreferrer"
			class="text-ink underline decoration-line underline-offset-2 focus-ring hover:decoration-ink"
			>sleepyexe</a
		>.
	</p>
</footer>
