<script lang="ts">
	import Tailwind from "../assets/tailwind.svg";
	import Svelte from "../assets/svelte.svg";
	import Vite from "../assets/vite.svg";
	import Counter from "./components/Counter.svelte";
	import Coords from "./components/Coords.svelte";
	import Footer from "./components/Footer.svelte";
</script>

<div class="flex items-center h-screen justify-center">
	<div class="flex flex-col w-2/6 h-fit bg-slate-900 rounded-lg shadow-lg">
		<div
			class="flex flex-col justify-center items-center text-white gap-[0.1rem] mt-4"
		>
			<h1 class="text-xl font-bold">Svelte5 Boilerplate</h1>
			<p class="text-sm">With TailwindCSS 3</p>
		</div>
		<div
			class="flex flex-row justify-center items-center text-white gap-10 mt-4"
		>
			<a href="https://vitejs.dev/" target="_blank" rel="noreferrer">
				<img src={Vite} alt="Vite" width="70" />
			</a>
			<a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
				<img src={Tailwind} alt="TailwindCSS" width="70" />
			</a>
			<a href="https://svelte.dev/" target="_blank" rel="noreferrer">
				<img src={Svelte} alt="Svelte" width="70" />
			</a>
		</div>
		<div
			class="flex flex-col justify-center items-center text-white gap-5 mt-10"
		>
			<Counter />
			<Coords />
			<Footer />
		</div>
	</div>
</div>
