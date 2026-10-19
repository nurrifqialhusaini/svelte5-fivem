import { onDestroy } from "svelte";
import { SvelteMap } from "svelte/reactivity";

export type NuiEventHandler<T = any> = (data: T) => void;
export interface NuiMessage<T = unknown> {
	action: string;
	data: T;
}

const eventListeners = new Map<string, NuiEventHandler[]>();

export const lastNuiData = new SvelteMap<string, unknown>();

const eventListener = (event: MessageEvent<NuiMessage>) => {
	if (typeof event.data?.action !== "string") return;

	const { action, data } = event.data;
	lastNuiData.set(action, data);

	const handlers = eventListeners.get(action);

	if (handlers) {
		handlers.forEach((handler) => handler(data));
	}
};

window.addEventListener("message", eventListener);

/**
 * Same as `useNuiEvent` but can be used outside components (stores, `.svelte.ts` files)
 * @param action The specific `action` that should be listened for.
 * @param handler The callback function that will handle data relayed by this function
 * @returns Function to remove the listener
 *
 * @example
 * const stop = onNuiEvent<number>('setMoney', (money) => {
 *   wallet.money = money
 * })
 **/
export function onNuiEvent<T = unknown>(
	action: string,
	handler: NuiEventHandler<T>,
): () => void {
	const handlers = eventListeners.get(action) || [];
	handlers.push(handler);
	eventListeners.set(action, handlers);

	return () => {
		const handlers = eventListeners.get(action) || [];

		eventListeners.set(
			action,
			handlers.filter((h) => h !== handler),
		);
	};
}

/**
 * A function that manage events listeners for receiving data from the client scripts
 * @param action The specific `action` that should be listened for.
 * @param handler The callback function that will handle data relayed by this function
 *
 * @example
 * useNuiEvent<{visibility: true, wasVisible: 'something'}>('setVisible', (data) => {
 *   // whatever logic you want
 * })
 *
 **/
export function useNuiEvent<T = unknown>(
	action: string,
	handler: NuiEventHandler<T>,
) {
	onDestroy(onNuiEvent(action, handler));
}
