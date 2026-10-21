/**
 * Messages sent from Lua with SendNUIMessage, by action.
 * Listing them here gives nuiState, nuiSync, useNuiEvent and onNuiEvent autocomplete and types.
 * Actions that are not listed still work, they are just not typed.
 *
 * @example
 * // Lua: SendNUIMessage({ action = 'setMoney', data = 500 })
 * setMoney: number;
 */
export interface NuiMessages {
	setVisible: boolean;
}

/**
 * Callbacks registered in Lua with RegisterNUICallback.
 * `data` is what the UI sends, `response` is what Lua passes to cb().
 * Used by fetchNui and nuiAction.
 *
 * @example
 * // Lua: RegisterNUICallback('buyItem', function(data, cb) cb({ ok = true }) end)
 * buyItem: { data: { item: string }; response: { ok: boolean } };
 */
export interface NuiCallbacks {
	hideUI: { data: undefined; response: unknown };
	getClientData: {
		data: undefined;
		response: { x: number; y: number; z: number };
	};
}

/** Any action name that is not listed in `Map`, used so listed actions always get their types checked */
export type Unlisted<N extends string, Map> = N extends keyof Map ? never : N;
