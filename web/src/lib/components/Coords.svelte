<script lang="ts">
	import { Tween, prefersReducedMotion } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import { fetchNui } from "$lib/utils/fetchNui";

	interface ReturnData {
		x: number;
		y: number;
		z: number;
	}

	// mock data for browser
	const mock: ReturnData = { x: -1037, y: -2737, z: 14 };

	let position: ReturnData | null = $state(null);
	let loading = $state(false);
	let error: string | null = $state(null);

	const x = new Tween(0, { easing: cubicOut });
	const y = new Tween(0, { easing: cubicOut });
	const z = new Tween(0, { easing: cubicOut });
	const rows = [
		{ axis: "X", tween: x },
		{ axis: "Y", tween: y },
		{ axis: "Z", tween: z },
	];

	const format = (value: number) =>
		Math.round(value).toString().replace("-", "−");

	const handleClientData = () => {
		loading = true;
		error = null;
		fetchNui<ReturnData>("getClientData", undefined, {
			data: mock,
			delay: 400,
		})
			.then((returnData) => {
				position = returnData;
				const duration = prefersReducedMotion.current ? 0 : 700;
				x.set(returnData.x, { duration });
				y.set(returnData.y, { duration });
				z.set(returnData.z, { duration });
			})
			.catch(() => {
				error =
					"The client script did not answer. Check that getClientData is registered in client.lua.";
			})
			.finally(() => {
				loading = false;
			});
	};

	const resetCoords = () => {
		position = null;
		for (const { tween } of rows) tween.set(0, { duration: 0 });
	};
</script>

<section class="@container px-6 py-5 divider-t">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h2 class="text-sm font-semibold">Player position</h2>
			<p class="text-xs text-ink-soft">
				Fetched from client.lua with fetchNui
			</p>
		</div>
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			class={[
				"size-6 transition-colors duration-300",
				position
					? "text-waypoint drop-shadow-md drop-shadow-waypoint/60"
					: "text-ink-soft/50",
			]}
		>
			<path
				fill="currentColor"
				d="M12 2a7.5 7.5 0 0 0-7.5 7.5C4.5 15 12 22 12 22s7.5-7 7.5-12.5A7.5 7.5 0 0 0 12 2Zm0 10.25a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5Z"
			/>
		</svg>
	</div>

	{#if position}
		<dl class="mt-3 grid grid-cols-[auto_1fr] items-baseline gap-x-4">
			{#each rows as { axis, tween } (axis)}
				<dt class="text-xs font-medium text-ink-soft">{axis}</dt>
				<dd
					class="text-right text-4xl leading-[1.1] @xs:text-[2.75rem] font-semibold tabular-nums font-stretch-75%"
				>
					{format(tween.current)}
				</dd>
			{/each}
		</dl>
	{:else if error}
		<p
			role="alert"
			class="mt-4 rounded-xl bg-red-500/20 inset-ring inset-ring-red-300/30 px-3 py-2.5 text-xs leading-relaxed text-red-100"
		>
			{error}
		</p>
	{:else}
		<p
			class="mt-4 rounded-xl border border-dashed border-white/20 bg-black/15 px-3 py-6 text-center text-xs text-ink-soft"
		>
			No position yet. Press Get position to ask the game.
		</p>
	{/if}

	<div class="mt-4 flex flex-col gap-2 @xs:flex-row">
		<button
			type="button"
			onclick={handleClientData}
			disabled={loading}
			class="flex-1 rounded-xl bg-waypoint px-4 py-2.5 text-sm font-semibold text-waypoint-ink shadow-lg shadow-waypoint/25 text-shadow-none focus-ring not-disabled:hover:brightness-110 active:translate-y-px disabled:opacity-60"
		>
			{loading ? "Getting position…" : "Get position"}
		</button>
		<button
			type="button"
			onclick={resetCoords}
			disabled={!position}
			class="rounded-xl bg-black/25 px-4 py-2.5 text-sm font-medium inset-ring inset-ring-white/15 focus-ring not-disabled:hover:bg-white/10 disabled:opacity-40"
		>
			Clear
		</button>
	</div>
</section>
