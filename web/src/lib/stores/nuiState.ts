import { lastNuiData } from "$lib/hooks/useNuiEvent";
import type { NuiMessages, Unlisted } from "$lib/nui";

/**
 * Get the last data sent for an action, still received while the UI is hidden
 * @param action The specific `action` from SendNUIMessage
 * @param initial Value used before the first message arrives
 *
 * @example
 * // Lua: SendNUIMessage({ action = 'setMoney', data = 500 })
 * const money = nuiState('setMoney', 0)
 * <p>${money.current}</p>
 **/
export function nuiState<K extends keyof NuiMessages, I = NuiMessages[K]>(
	action: K,
	initial: I,
): { readonly current: NuiMessages[K] | I };
export function nuiState<T, N extends string = string>(
	action: Unlisted<N, NuiMessages>,
	initial: T,
): { readonly current: T };
export function nuiState(action: string, initial: unknown) {
	return {
		get current() {
			return lastNuiData.has(action) ? lastNuiData.get(action) : initial;
		},
	};
}
