<script lang="ts">
	let count: number = $state(0);
	const increment = () => {
		count += 1;
	};
	const decrement = () => {
		count -= 1;
	};
</script>

<div class="flex flex-col gap-2 justify-center items-center">
	<div class="">Count is {count}</div>
	<div class="flex flex-row gap-2">
		<button onclick={increment} class="button bg-green-800 p-1">
			increment
		</button>
		<button onclick={decrement} class="button bg-red-800 p-1">
			decrement
		</button>
	</div>
</div>
