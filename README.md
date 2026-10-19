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
> On CEF 103 the v2 UI loads, but colors, gradients and some layouts break because Tailwind CSS 4 relies on modern CSS (`@property`, `color-mix()`, `oklch()`). The example panel also uses `backdrop-blur`, which turns the area behind it black on CEF 103. Stay on v1.x until CEF 144 reaches the channel you use.

## What's new in v2

- **Svelte 5.57, Tailwind CSS 4, Vite 8, TypeScript 6.** No more `tailwind.config.js` or `postcss.config.js`, Tailwind is configured in CSS.
- **`nuiState`**, read the last data sent for an action from any component, even if it was sent while the UI was hidden. See [Sending data in realtime](#sending-data-in-realtime).
- **`nuiSync`**, a value shared both ways between the UI and Lua. Works with `bind:value`, changes are sent to Lua automatically.
- **`nuiAction`**, calls a NUI callback and keeps `data`, `loading` and `error` for you.
- **Typed actions**, list your actions once in `src/lib/nui.ts` and get autocomplete and type checks in every helper.
- **`onNuiEvent`**, the same as `useNuiEvent` but usable outside components, in stores and `.svelte.ts` files.
- **Safer message listener**, messages that do not come from `SendNUIMessage` (devtools, browser extensions) are ignored, and a handler that throws no longer stops the other handlers.
- **Manifest uses `cerulean`.** CEF 144 can block secure-context features for `adamant`, `bodacious` and `__resource.lua`.
- **New example UI** using `@starting-style` (Tailwind's `starting:` variant), variable fonts and `Tween` from `svelte/motion`.
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
      nui.ts                            Your actions and callbacks, for types and autocomplete
      Dashboard.svelte                  Example UI, replace it with your own
      components/                       Example components (Counter, LiveData, Coords, Footer)
      hooks/useNuiEvent.ts              useNuiEvent, onNuiEvent
      providers/VisibilityProvider.svelte
      stores/VisibilityStore.ts         visibilityStore
      stores/nuiState.ts                nuiState
      stores/nuiSync.ts                 nuiSync
      stores/nuiAction.svelte.ts        nuiAction
      utils/fetchNui.ts                 fetchNui
      utils/debugData.ts                debugData
      utils/misc.ts                     isEnvBrowser
```

## Utilities

### Typed actions (new)

List the messages Lua sends and the callbacks Lua registers in `src/lib/nui.ts`:

```ts
export interface NuiMessages {
	// SendNUIMessage({ action = 'setMoney', data = 500 })
	setMoney: number;
}

export interface NuiCallbacks {
	// RegisterNUICallback('buyItem', function(data, cb) cb({ ok = true }) end)
	buyItem: { data: { item: string }; response: { ok: boolean } };
}
```

`nuiState`, `nuiSync`, `useNuiEvent`, `onNuiEvent`, `fetchNui` and `nuiAction` then autocomplete these names and check the data, so a typo or a wrong payload shows up in `bun run check` instead of in game.

Actions you do not list keep working without types, and so does passing the type yourself (`fetchNui<Coords>("getClientData")`), so v1 code needs no change.

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

### nuiSync (new)

A value shared both ways: it reads like `nuiState`, and when you change it the new value goes to the NUI callback with the same name as `{ value }`. It keeps its value when the UI is closed and opened again.

```lua
local volume = 50

RegisterCommand('openSettings', function()
    SendNUIMessage({ action = 'setVolume', data = volume })
    -- show the UI
end)

RegisterNUICallback('setVolume', function(data, cb)
    volume = tonumber(data and data.value) or volume
    cb({})
end)
```

```svelte
<script lang="ts">
	import { nuiSync } from "$lib/stores/nuiSync";

	const volume = nuiSync("setVolume", 50);
</script>

<input type="range" bind:value={volume.current} />
```

Changes made quickly one after another (dragging a slider, clicking fast) are sent once, 100 ms after the last change. Change the wait with `nuiSync("setVolume", 50, { delay: 300 })`.

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

### nuiAction (new)

`fetchNui` with the usual state already handled. It never throws: if Lua does not answer, `error` is set instead.

```svelte
<script lang="ts">
	import { nuiAction } from "$lib/stores/nuiAction.svelte";

	const coords = nuiAction("getClientData", {
		mock: { x: -1037, y: -2737, z: 14 }, // used in the browser
	});
</script>

<button onclick={() => coords.run()} disabled={coords.loading}>
	{coords.loading ? "Getting position…" : "Get position"}
</button>

{#if coords.error}
	<p>{coords.error}</p>
{:else if coords.data}
	<p>{coords.data.x}, {coords.data.y}, {coords.data.z}</p>
{/if}
```

- `run(payload?)` sends the payload to Lua and returns the answer (or `undefined` when it failed).
- `reset()` clears `data` and `error`.
- If you call `run()` again before the first answer arrives, only the newest answer is kept.
- In the browser without a `mock`, `error` tells you the mock is missing instead of waiting forever.

### debugData

Fakes a `SendNUIMessage` while developing in the browser. It triggers `useNuiEvent`, `onNuiEvent`, `nuiState` and `nuiSync` as if Lua sent it, and does nothing in game.

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
| Ask Lua for data and show the answer (with loading and error) | `nuiAction`, see `Coords.svelte` |
| Keep a value in sync both ways (settings, counters, sliders) | `nuiSync`, see `Counter.svelte` |
| Call Lua from your own code and handle the promise yourself | `fetchNui` |

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

- **Messages sent before the page loads are lost.** Right after the resource starts the NUI page may not be loaded yet, and there is no JavaScript running to receive anything. A value that rarely changes (like a street name) then only shows up once it changes again. Clear the last sent value when the UI opens so it goes out again, like `lastMinute, lastStreet = nil, nil` in the `svelte:show` command of `client/client.lua`.
- **Let the player move while the UI is open.** `SetNuiFocus(true, true)` blocks all game input, so values like the street name cannot change while the UI is open. Call `SetNuiFocusKeepInput(true)` after it and disable the controls that conflict with the cursor (camera, attack, pause menu) every frame, see the `svelte:show` command in `client/client.lua`. Reset it with `SetNuiFocusKeepInput(false)` when closing. Keep in mind that typing in an `<input>` also moves the player in this mode.
- **`backdrop-blur` in NUI.** Results differ between the browser and in game:

  | | Browser | CEF 103 | CEF 144 |
  | --- | --- | --- | --- |
  | `backdrop-blur-*` | Blurred | Turns black | Transparent, not blurred |

  Make sure your panel is still readable without the blur.
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

Your existing `useNuiEvent`, `fetchNui` and `debugData` calls do not need any change. Move to `nuiState`, `nuiSync` and `nuiAction` whenever it is convenient.

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
