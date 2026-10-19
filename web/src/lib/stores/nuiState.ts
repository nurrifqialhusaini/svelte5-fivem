import { lastNuiData } from "$lib/hooks/useNuiEvent";

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
export function nuiState<T>(action: string, initial: T): { readonly current: T } {
	return {
		get current() {
			return lastNuiData.has(action)
				? (lastNuiData.get(action) as T)
				: initial;
		},
	};
}
