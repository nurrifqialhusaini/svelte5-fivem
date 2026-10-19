<script lang="ts">
	let count: number = $state(0);
	const increment = () => {
		count += 1;
	};
	const decrement = () => {
		count -= 1;
	};
</script>

<section
	class="flex items-center justify-between gap-4 border-t border-line px-6 py-4"
>
	<div>
		<h2 class="text-sm font-semibold">Counter</h2>
		<p class="text-xs text-ink-soft">Local state with $state</p>
	</div>
	<div class="flex items-center rounded-xl border border-line bg-black/20 p-1">
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
