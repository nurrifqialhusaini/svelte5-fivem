<script lang="ts">
	import { nuiState } from "$lib/stores/nuiState";
	import { fetchNui } from "$lib/utils/fetchNui";

	// last value from client.lua, sent again every time the UI opens
	const saved = nuiState("setCount", 0);
	let count = $derived(saved.current);

	const update = (value: number) => {
		count = value;
		fetchNui("setCount", { count: value }, { data: {} });
	};
	const increment = () => update(count + 1);
	const decrement = () => update(count - 1);
</script>

<section class="flex items-center justify-between gap-4 px-6 py-4 divider-t">
	<div>
		<h2 class="text-sm font-semibold">Counter</h2>
		<p class="text-xs text-ink-soft">Saved in client.lua with fetchNui</p>
	</div>
	<div
		class="flex items-center rounded-xl bg-black/30 p-1 inset-ring inset-ring-white/10"
	>
		<button
			type="button"
			onclick={decrement}
			aria-label="Decrease"
			class="grid size-8 place-items-center rounded-lg text-ink-soft focus-ring hover:bg-white/10 hover:text-ink active:bg-white/15"
		>
			<svg viewBox="0 0 16 16" class="size-4" aria-hidden="true">
				<path d="M3 8h10" stroke="currentColor" stroke-width="1.75" />
			</svg>
		</button>
		<output
			aria-live="polite"
			class="w-12 text-center text-xl font-semibold tabular-nums font-stretch-75%"
		>
			{count}
		</output>
		<button
			type="button"
			onclick={increment}
			aria-label="Increase"
			class="grid size-8 place-items-center rounded-lg text-ink-soft focus-ring hover:bg-white/10 hover:text-ink active:bg-white/15"
		>
			<svg viewBox="0 0 16 16" class="size-4" aria-hidden="true">
				<path
					d="M3 8h10M8 3v10"
					stroke="currentColor"
					stroke-width="1.75"
				/>
			</svg>
		</button>
	</div>
</section>
