import { fetchNui } from "$lib/utils/fetchNui";
import { isEnvBrowser } from "$lib/utils/misc";
import type { NuiCallbacks, Unlisted } from "$lib/nui";

interface NuiActionOptions<R> {
	/** Returned in the browser instead of calling Lua */
	mock?: R;
	/** How long the mock takes in the browser (ms) */
	delay?: number;
}

class NuiAction<D, R> {
	data: R | undefined = $state.raw();
	error: string | null = $state(null);
	loading = $state(false);

	#name: string;
	#options: NuiActionOptions<R>;
	#request = 0;

	constructor(name: string, options: NuiActionOptions<R>) {
		this.#name = name;
		this.#options = options;
	}

	run = async (payload?: D): Promise<R | undefined> => {
		const request = ++this.#request;
		this.loading = true;
		this.error = null;

		try {
			if (isEnvBrowser() && this.#options.mock === undefined) {
				throw new Error(
					`No mock data for "${this.#name}" in the browser`,
				);
			}

			const result = await fetchNui<R>(this.#name, payload, {
				data: this.#options.mock as R,
				delay: this.#options.delay,
			});

			// an older run finished after a newer one, keep the newer result
			if (request !== this.#request) return result;
			this.data = result;
			return result;
		} catch (e) {
			if (request === this.#request) {
				this.error = e instanceof Error ? e.message : String(e);
			}
		} finally {
			if (request === this.#request) this.loading = false;
		}
	};

	reset = () => {
		this.#request++;
		this.data = undefined;
		this.error = null;
		this.loading = false;
	};
}

/**
 * Calls a NUI callback and keeps `data`, `loading` and `error` for you
 * @param name The callback registered with RegisterNUICallback
 * @param options `mock` and `delay` used in the browser
 *
 * @example
 * const coords = nuiAction('getClientData', { mock: { x: 0, y: 0, z: 0 } })
 * <button onclick={() => coords.run()} disabled={coords.loading}>Get</button>
 * {#if coords.data}{coords.data.x}{/if}
 **/
export function nuiAction<K extends keyof NuiCallbacks>(
	name: K,
	options?: NuiActionOptions<NuiCallbacks[K]["response"]>,
): NuiAction<NuiCallbacks[K]["data"], NuiCallbacks[K]["response"]>;
export function nuiAction<D = unknown, R = unknown, N extends string = string>(
	name: Unlisted<N, NuiCallbacks>,
	options?: NuiActionOptions<R>,
): NuiAction<D, R>;
export function nuiAction(
	name: string,
	options: NuiActionOptions<unknown> = {},
) {
	return new NuiAction(name, options);
}
