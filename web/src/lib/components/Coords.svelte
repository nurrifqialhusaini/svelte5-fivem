<script lang="ts">
	import { fetchNui } from "$lib/utils/fetchNui";
	import { visibilityStore as visibility } from "$lib/stores/VisibilityStore";

	interface ReturnData {
		x: number;
		y: number;
		z: number;
	}

	let clientData: ReturnData | null = null;

	const handleClientData = () => {
		fetchNui("getClientData")
			.then((returnData) => {
				clientData = returnData;
			})
			.catch(() => {
				clientData = { x: 100, y: 100, z: 100 };
			});
	};

	const closeDialog = () => {
		visibility.toggle(false);
		fetchNui("hideUI");
	};
	const resetCoords = () => {
		clientData = null;
	};
</script>

<div class="flex flex-col min-w-full p-4 mt-4">
	<h2 class="font-semibold mb-4 text-center">
		Let test callback and get player coords
	</h2>
	<div class="bg-slate-500 p-1">
		Player coords: {clientData ? JSON.stringify(clientData) : ""}
	</div>
	<div class="flex flex-row gap-2 min-w-full mt-2">
		<button on:click={handleClientData} class="bg-green-800 p-1 w-full">
			Get client coords
		</button>
		<button on:click={resetCoords} class="bg-slate-800 p-1"
			>Reset Coords</button
		>
	</div>
	<div class="flex flex-col gap-2 min-w-full mt-2">
		<button on:click={closeDialog} class="bg-red-800 p-1 w-full">
			Close dialog
		</button>
		<span>Or press the escape key!</span>
	</div>
</div>
