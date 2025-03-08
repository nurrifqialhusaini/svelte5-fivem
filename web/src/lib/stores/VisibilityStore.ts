import { writable } from "svelte/store";
import { isEnvBrowser } from "$lib/utils/misc";

const visibility = writable(isEnvBrowser());

export const visibilityStore = {
	subscribe: visibility.subscribe,
	show: () => visibility.set(true),
	hide: () => visibility.set(false),
	toggle: (value?: boolean) =>
		visibility.update((v) => (value !== undefined ? value : !v)),
};
