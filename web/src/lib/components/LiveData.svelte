<script lang="ts">
	import { nuiState } from "$lib/stores/nuiState";

	const clock = nuiState<{ hour: number; minute: number } | null>(
		"setClock",
		null,
	);
	const street = nuiState("setStreet", "");

	const pad = (value: number) => value.toString().padStart(2, "0");
</script>

<section class="border-t border-line px-6 py-4">
	<h2 class="text-sm font-semibold">Live from the game</h2>
	<p class="text-xs text-ink-soft">
		Sent with SendNUIMessage, kept while this panel is closed
	</p>
	<dl class="mt-3 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1">
		<dt class="text-xs font-medium text-ink-soft">Time</dt>
		<dd
			class="text-right text-xl font-semibold tabular-nums font-stretch-75%"
		>
			{clock.current
				? `${pad(clock.current.hour)}:${pad(clock.current.minute)}`
				: "Waiting for the game"}
		</dd>
		<dt class="text-xs font-medium text-ink-soft">Street</dt>
		<dd class="truncate text-right text-sm font-medium">
			{street.current || "Waiting for the game"}
		</dd>
	</dl>
</section>
