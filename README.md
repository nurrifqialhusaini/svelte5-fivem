<h1 align="center">Svelte 5 FiveM Boilerplate</h1>

A NUI starter for FiveM built with Svelte 5, Tailwind CSS 4 and Vite 8, for the CfxLua runtime.

Improved from [Overextended](https://github.com/overextended/fivem-typescript-boilerplate), [Slyker](https://github.com/Slyker/svelte5-fivem-template) and [sleepyexe](https://github.com/sleepyexe/svelte-fivem).

## Which version should I use?

FiveM is moving its embedded browser (CEF) from v103 to v144. Tailwind CSS 4 and Vite 8 need the newer browser, so pick the version that matches the FiveM channel your players run.

| Boilerplate | FiveM channel | CEF | Svelte | Tailwind CSS | Vite |
| --- | --- | --- | --- | --- | --- |
| v1.x | Release | 103 | 5 | 3 | 5 |
| v2.x | Canary (Release soon) | 144 | 5 | 4 | 8 |

> [!WARNING]
> On CEF 103 the v2 UI loads, but colors, gradients and some layouts break because Tailwind CSS 4 relies on modern CSS (`@property`, `color-mix()`, `oklch()`). Stay on v1.x until CEF 144 reaches the channel you use.

## What's new in v2

- **Svelte 5.57, Tailwind CSS 4, Vite 8, TypeScript 6.** No more `tailwind.config.js` or `postcss.config.js`, Tailwind is configured in CSS.
- **`nuiState`**, read the last data sent for an action from any component, even if it was sent while the UI was hidden. See [Sending data in realtime](#sending-data-in-realtime).
- **`onNuiEvent`**, the same as `useNuiEvent` but usable outside components, in stores and `.svelte.ts` files.
- **Safer message listener**, messages that do not come from `SendNUIMessage` (devtools, browser extensions) are ignored instead of throwing.
- **Manifest uses `cerulean`.** CEF 144 can block secure-context features for `adamant`, `bodacious` and `__resource.lua`.
- **New example UI** using `backdrop-blur`, `@starting-style` (Tailwind's `starting:` variant), variable fonts and `Tween` from `svelte/motion`.
- **Svelte 5 syntax everywhere.** `onclick` instead of `on:click`, `{@render children()}` instead of `<slot />`, `$state` instead of plain `let`.

Everything from v1 still works: `useNuiEvent`, `fetchNui`, `debugData`, `visibilityStore`, the `setVisible` action and the `hideUI` callback have the same names and behave the same way.

## Requirements

- [bun](https://bun.sh/) (recommended over npm, yarn or pnpm)
- Node.js 20.19+ or 22.12+ (required by Vite 8)
- FiveM on the Canary channel while CEF 144 is not on Release yet

_You should be comfortable with modern web development. If you are not yet, Svelte might not be for you just yet._

## Getting started

1. Clone the repository (or use the template option) into your `resources` folder.
2. Install the dependencies:

   ```sh
   cd web
   bun i
   ```

3. Build the UI:

   ```sh
   bun run build
   ```

4. Add `ensure svelte5-fivem` (or your folder name) to your `server.cfg`, join the server and type `svelte:show` in the F8 console.

### Project structure

```
client/client.lua                       Lua side: commands, NUI callbacks, example data loop
server/server.lua
fxmanifest.lua                          ui_page points at web/build (or the dev server)
web/
  src/
    App.svelte                          Root component, wrap your UI in VisibilityProvider
    app.css                             Tailwind import and theme tokens (@theme)
    lib/
      Dashboard.svelte                  Example UI, replace it with your own
      components/                       Example components (Counter, LiveData, Coords, Footer)
      hooks/useNuiEvent.ts              useNuiEvent, onNuiEvent
      providers/VisibilityProvider.svelte
      stores/VisibilityStore.ts         visibilityStore
      stores/nuiState.ts                nuiState
      utils/fetchNui.ts                 fetchNui
      utils/debugData.ts                debugData
      utils/misc.ts                     isEnvBrowser
```

## Utilities

### VisibilityProvider and visibilityStore

`VisibilityProvider` only renders its children while the UI is visible. It listens for the `setVisible` action and closes the UI when the player presses `ESC` (it calls the `hideUI` callback so Lua can drop focus).

```lua
-- client.lua
SendNUIMessage({ action = 'setVisible', data = true })
SetNuiFocus(true, true)
```

To close the UI from a button, use `visibilityStore`:

```svelte
<script lang="ts">
	import { visibilityStore as visibility } from "$lib/stores/VisibilityStore";
	import { fetchNui } from "$lib/utils/fetchNui";

	const close = () => {
		visibility.hide();
		fetchNui("hideUI");
	};
</script>

<button onclick={close}>Close</button>
```

`visibilityStore` has `show()`, `hide()` and `toggle(value?)`. Read it with `$visibility`.

### useNuiEvent

Runs a handler every time Lua sends a message with a given action. Call it during component setup, the listener is removed when the component is destroyed.

```lua
SendNUIMessage({ action = 'setName', data = 'Franklin' })
```

```svelte
<script lang="ts">
	import { useNuiEvent } from "$lib/hooks/useNuiEvent";

	let name = $state("");

	useNuiEvent<string>("setName", (data) => {
		name = data;
	});
</script>

<p>{name}</p>
```

### onNuiEvent (new)

The same as `useNuiEvent`, but not tied to a component. Use it in stores and `.svelte.ts` files. It returns a function that removes the listener.

```ts
// src/lib/stores/wallet.svelte.ts
import { onNuiEvent } from "$lib/hooks/useNuiEvent";

class Wallet {
	money = $state(0);
}

export const wallet = new Wallet();

onNuiEvent<number>("setMoney", (money) => {
	wallet.money = money;
});
```

### nuiState (new)

Returns the last data Lua sent for an action. Messages are stored from the moment the page loads, including while the UI is hidden, so a component that mounts later shows the latest value right away. Read it with `.current`.

```lua
SendNUIMessage({ action = 'setMoney', data = 500 })
```

```svelte
<script lang="ts">
	import { nuiState } from "$lib/stores/nuiState";

	const money = nuiState("setMoney", 0);
</script>

<p>${money.current}</p>
```

The second argument is used until the first message for that action arrives. The Lua side does not change, any `SendNUIMessage` can be read this way.

### fetchNui

A small wrapper around `fetch` for calling `RegisterNUICallback` handlers in Lua. Lua must always answer with `cb(...)`, at least `cb({})`.

```lua
RegisterNUICallback('getClientData', function(_, cb)
    local coords = GetEntityCoords(PlayerPedId())
    cb({ x = coords.x, y = coords.y, z = coords.z })
end)
```

```svelte
<script lang="ts">
	import { fetchNui } from "$lib/utils/fetchNui";

	type Coords = { x: number; y: number; z: number };
	let coords: Coords | null = $state(null);

	const getCoords = () => {
		fetchNui<Coords>("getClientData", undefined, {
			data: { x: -1037, y: -2737, z: 14 },
			delay: 400,
		}).then((data) => {
			coords = data;
		});
	};
</script>

<button onclick={getCoords}>Get position</button>
```

The third argument is mock data returned in the browser. In the browser `fetchNui` never resolves without it, so pass a mock for anything you want to test outside the game.

### debugData

Fakes a `SendNUIMessage` while developing in the browser. It triggers `useNuiEvent`, `onNuiEvent` and `nuiState` as if Lua sent it, and does nothing in game.

```svelte
<script lang="ts">
	import { debugData } from "$lib/utils/debugData";

	debugData([
		{ action: "setVisible", data: true },
		{ action: "setMoney", data: 500 },
	]);
</script>
```

### isEnvBrowser

Returns `true` when the page runs in a regular browser instead of the game. Useful for development-only logic.

## Sending data in realtime

A common problem with v1: data sent before `setVisible` was lost, and data disappeared every time the UI was closed. Two things caused it:

1. Components inside `VisibilityProvider` are not mounted while the UI is hidden, so their `useNuiEvent` is not listening yet and the message is dropped.
2. Closing the UI destroys those components, so their state resets. When the UI opens again it starts empty until Lua sends the data again.

To work around it, v1 projects had to put every `useNuiEvent` in `App.svelte` or `VisibilityProvider` and copy each value into a store by hand.

### Before (v1)

```svelte
<!-- App.svelte: every listener lives here, outside the visibility check -->
<script lang="ts">
	import { useNuiEvent } from "$lib/hooks/useNuiEvent";
	import { money, job, gameTime } from "$lib/stores/hud";

	useNuiEvent<number>("setMoney", (v) => money.set(v));
	useNuiEvent<string>("setJob", (v) => job.set(v));
	useNuiEvent<{ hour: number; minute: number }>("setGameTime", (v) => gameTime.set(v));
</script>
```

```ts
// stores/hud.ts: one store per value
import { writable } from "svelte/store";

export const money = writable(0);
export const job = writable("");
export const gameTime = writable({ hour: 0, minute: 0 });
```

```svelte
<!-- Hud.svelte -->
<script lang="ts">
	import { money, job } from "$lib/stores/hud";
</script>

<p>{$job}: ${$money}</p>
```

### After (v2)

```svelte
<!-- Hud.svelte: no App.svelte listener, no store file -->
<script lang="ts">
	import { nuiState } from "$lib/stores/nuiState";

	const money = nuiState("setMoney", 0);
	const job = nuiState("setJob", "");
</script>

<p>{job.current}: ${money.current}</p>
```

The Lua side stays exactly the same.

### Which one should I use?

| You want to | Use |
| --- | --- |
| Show a value that Lua keeps up to date (money, job, time, HUD data) | `nuiState` |
| React to something that happens once (a toast, a sound, opening a page) | `useNuiEvent` |
| Handle messages in a store or `.svelte.ts` file | `onNuiEvent` |
| Ask Lua for data and wait for the answer | `fetchNui` |

`nuiState` only keeps the latest message per action, so use `useNuiEvent` for events where every message matters, like a kill feed.

### Tips

- **Only send what changed.** `SendNUIMessage` in a `Wait(0)` loop sends a message every frame. Keep the last value and compare it first:

  ```lua
  CreateThread(function()
      local lastMinute

      while true do
          local minute = GetClockMinutes()
          if minute ~= lastMinute then
              lastMinute = minute
              SendNUIMessage({
                  action = 'setClock',
                  data = { hour = GetClockHours(), minute = minute }
              })
          end
          Wait(500)
      end
  end)
  ```

- **Messages sent before the page loads are lost.** Right after the resource starts the NUI page may not be loaded yet, and there is no JavaScript running to receive anything. Send initial data a little later, or when the UI opens for the first time.
- **Empty Lua tables are sent as arrays.** `{}` arrives as `[]` in JavaScript, so check for both if a table can be empty.

## Migrating from v1

1. **Dependencies.** Replace the `devDependencies` in `web/package.json` with the ones from this repository, delete `node_modules` and the lockfile, then run `bun i`.
2. **Tailwind.** Delete `tailwind.config.js` and `postcss.config.js`, add the Vite plugin and change `app.css`:

   ```ts
   // vite.config.ts
   import tailwindcss from "@tailwindcss/vite";

   export default defineConfig({
   	plugins: [tailwindcss(), svelte()],
   	// ...
   });
   ```

   ```css
   /* app.css, before */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   /* app.css, after */
   @import "tailwindcss";
   ```

   Custom colors, fonts and other `theme.extend` values move into an `@theme` block in `app.css`. Tailwind 4 also changes a few defaults: buttons use `cursor: default` and borders use `currentColor`. See the [Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide) for renamed utilities.

3. **TypeScript.** Add `@types/node` and `"types": ["node"]` to `tsconfig.node.json`, and remove `baseUrl` from `tsconfig.json` (deprecated in TypeScript 6, `paths` works without it).
4. **Svelte syntax.** Replace `on:click` with `onclick` and `<slot />` with `{@render children()}`. The old syntax still compiles, but it is deprecated.
5. **Manifest.** Change `fx_version 'bodacious'` to `fx_version 'cerulean'`.
6. **Check CEF 144 changes in your own code:**
   - `alert()` and `confirm()` no longer work in NUI.
   - `document.execCommand('copy')` needs the element to be focused first (`element.focus()`).
   - `DOMNodeInserted` and `DOMSubtreeModified` were removed, use `MutationObserver`.
   - The CSS `zoom` property follows the standard now, layouts that relied on the old behavior may shift.
   - `new URL()` throws on forbidden characters such as `<`, `>` and `|`.

Your existing `useNuiEvent`, `fetchNui` and `debugData` calls do not need any change. Move to `nuiState` whenever it is convenient.

## Development workflow

### Live preview in game

In `fxmanifest.lua`, point `ui_page` at the Vite dev server:

```lua
ui_page 'http://localhost:5173/'
-- ui_page 'web/build/index.html'
```

Run the dev server, then `ensure` the resource once:

```sh
bun run dev
```

Changes in `web/src` now show up in game without rebuilding or restarting the resource (unless something errors). Check the terminal for the port, and switch `ui_page` back to `web/build/index.html` when you are done.

### In the browser

`bun run dev` also works in a normal browser. The UI is visible by default, a background screenshot from `web/background` is shown behind it, and `debugData` / `fetchNui` mocks stand in for the game.

### Production build

```sh
bun run build
```

The optimized files are written to `web/build`, which `fxmanifest.lua` already includes.

### Other scripts

| Command | What it does |
| --- | --- |
| `bun run check` | Type checks Svelte and TypeScript files |
| `bun run format` | Formats the code with Prettier |
| `bun run preview` | Serves the production build locally |
