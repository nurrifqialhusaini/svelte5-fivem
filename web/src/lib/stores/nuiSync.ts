import { lastNuiData } from "$lib/hooks/useNuiEvent";
import { fetchNui } from "$lib/utils/fetchNui";
import type { NuiMessages, Unlisted } from "$lib/nui";

/**
 * Two-way value between the UI and Lua. Reads like `nuiState`, and every change
 * is sent to the NUI callback with the same name as `{ value }`.
 * Fast changes (sliders, holding a button) are sent once, after `delay` ms.
 * @param action Used for both SendNUIMessage and RegisterNUICallback
 * @param initial Value used before Lua sends one
 *
 * @example
 * // Lua: SendNUIMessage({ action = 'setVolume', data = 50 })
 * //      RegisterNUICallback('setVolume', function(data, cb) volume = data.value cb({}) end)
 * const volume = nuiSync('setVolume', 50)
 * <input type="range" bind:value={volume.current} />
 **/
export function nuiSync<K extends keyof NuiMessages>(
	action: K,
	initial: NuiMessages[K],
	options?: { delay?: number },
): { current: NuiMessages[K] };
export function nuiSync<T, N extends string = string>(
	action: Unlisted<N, NuiMessages>,
	initial: T,
	options?: { delay?: number },
): { current: T };
export function nuiSync(
	action: string,
	initial: unknown,
	{ delay = 100 }: { delay?: number } = {},
) {
	let timer: ReturnType<typeof setTimeout> | undefined;

	return {
		get current() {
			return lastNuiData.has(action) ? lastNuiData.get(action) : initial;
		},
		set current(value) {
			// the same cache Lua messages go to, so every reader updates and it survives closing the UI
			lastNuiData.set(action, value);

			clearTimeout(timer);
			timer = setTimeout(() => {
				fetchNui(action, { value }, { data: {} }).catch(() => {});
			}, delay);
		},
	};
}
