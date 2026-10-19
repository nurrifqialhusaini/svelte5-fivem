import { onDestroy } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import type { NuiMessages, Unlisted } from "$lib/nui";

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
		for (const handler of handlers) {
			// one broken handler should not stop the others
			try {
				handler(data);
			} catch (e) {
				console.error(`[nui] handler for "${action}" failed`, e);
			}
		}
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
export function onNuiEvent<K extends keyof NuiMessages>(
	action: K,
	handler: NuiEventHandler<NuiMessages[K]>,
): () => void;
export function onNuiEvent<T = unknown, N extends string = string>(
	action: Unlisted<N, NuiMessages>,
	handler: NuiEventHandler<T>,
): () => void;
export function onNuiEvent(
	action: string,
	handler: NuiEventHandler,
): () => void {
	const handlers = eventListeners.get(action) || [];
	handlers.push(handler);
	eventListeners.set(action, handlers);

	return () => {
		const handlers = (eventListeners.get(action) || []).filter(
			(h) => h !== handler,
		);

		if (handlers.length) eventListeners.set(action, handlers);
		else eventListeners.delete(action);
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
export function useNuiEvent<K extends keyof NuiMessages>(
	action: K,
	handler: NuiEventHandler<NuiMessages[K]>,
): void;
export function useNuiEvent<T = unknown, N extends string = string>(
	action: Unlisted<N, NuiMessages>,
	handler: NuiEventHandler<T>,
): void;
export function useNuiEvent(action: string, handler: NuiEventHandler) {
	onDestroy(onNuiEvent(action, handler));
}
