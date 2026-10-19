<script lang="ts">
	import Tailwind from "../assets/tailwind.svg";
	import Svelte from "../assets/svelte.svg";
	import Vite from "../assets/vite.svg";
	import Counter from "./components/Counter.svelte";
	import Coords from "./components/Coords.svelte";
	import LiveData from "./components/LiveData.svelte";
	import Footer from "./components/Footer.svelte";

	const stack = [
		{ name: "Svelte 5", logo: Svelte },
		{ name: "Tailwind CSS 4", logo: Tailwind },
		{ name: "Vite 8", logo: Vite },
	];
</script>

<div class="flex min-h-screen justify-end p-4 scheme-dark sm:p-8">
	<div
		class="relative isolate w-full max-w-sm self-center transition-[opacity,translate] duration-300 ease-out starting:translate-x-8 starting:opacity-0 motion-reduce:transition-none"
	>
		<!-- blurred shadow, backdrop-blur can't blur the game -->
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-black/45 blur-2xl"
		></div>
		<main
			class="@container flex w-full flex-col rounded-[1.25rem] bg-linear-to-b/oklch from-glass to-glass/80 text-ink backdrop-blur-xl backdrop-saturate-150 inset-ring inset-ring-white/10 inset-shadow-2xs inset-shadow-white/15 text-shadow-sm text-shadow-black/60"
		>
			<header class="px-6 pt-6 pb-5">
				<h1
					class="text-[1.75rem] leading-[1.05] font-semibold tracking-tight font-stretch-125% text-shadow-md"
				>
					Svelte 5 boilerplate
				</h1>
				<p class="mt-2 text-sm text-pretty text-ink-soft">
					A starter template for building FiveM NUI. Edit web/src and
					see your changes live, in game or in the browser.
				</p>
				<ul class="mt-4 flex flex-wrap gap-2">
					{#each stack as item (item.name)}
						<li
							class="inline-flex items-center gap-1.5 rounded-full bg-black/25 py-1 pr-3 pl-1.5 text-xs font-medium inset-ring inset-ring-white/10"
						>
							<img src={item.logo} alt="" class="size-4" />
							{item.name}
						</li>
					{/each}
				</ul>
			</header>
			<Counter />
			<LiveData />
			<Coords />
			<Footer />
		</main>
	</div>
</div>
