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

<div class="flex min-h-screen justify-end p-4 sm:p-8">
	<main
		class="flex w-full max-w-sm flex-col self-center rounded-[1.25rem] border border-line bg-glass text-ink shadow-[0_24px_60px_-24px_oklch(0.1_0.03_260/0.7)] backdrop-blur-2xl backdrop-saturate-150 transition-[opacity,translate] duration-300 ease-out starting:translate-x-8 starting:opacity-0 motion-reduce:transition-none"
	>
		<header class="px-6 pt-6 pb-5">
			<h1
				class="text-[1.75rem] leading-[1.05] font-semibold tracking-tight font-stretch-125%"
			>
				Svelte 5 boilerplate
			</h1>
			<p class="mt-2 text-sm text-pretty text-ink-soft">
				A NUI starter for FiveM. Run the dev server and this panel
				reloads in game as you edit web/src.
			</p>
			<ul class="mt-4 flex flex-wrap gap-2">
				{#each stack as item (item.name)}
					<li
						class="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/5 py-1 pr-3 pl-1.5 text-xs font-medium"
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
