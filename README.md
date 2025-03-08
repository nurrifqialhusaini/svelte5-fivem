<h1 align="center">Svelte 5 FiveM Boilerplate</h1>

This repository improvement from [Overextended](https://github.com/overextended/fivem-typescript-boilerplate), [Slyker](https://github.com/Slyker/svelte5-fivem-template) and [sleepyexe](https://github.com/sleepyexe/svelte-fivem)

This version of the boilerplate is meant for the CfxLua runtime.

## Requirements
* [bun](https://bun.sh/) (Highly recommended over yarn, npm or pnpm)

*A basic understanding of the modern web development workflow. If you don't 
know this yet, Svelte might not be for you just yet.*

## Getting Started

First clone the repository or use the template option and place
it within your `resources` folder

### Installation

Install dependencies by navigating to the `web` folder within
a terminal of your choice and type `bun i`.

## Features

This boilerplate comes with some utilities and examples to work off of.

### Svelte Utils

Signatures are not included for these utilities as the type definitions
are sufficient enough.

**Toggling main frame visibility**
You can exit the UI frame using the `ESC` key, if you need to forcefully
hide it you can use `VisibilityStore`, visibility now being a state.
```svelte
<script lang="ts">
   import { visibilityStore as visibility } from "$lib/stores/VisibilityStore";
</script>

<button on:click={() => visibility.toggle(false)}>
  Exit
</button>
```

**useNuiEvent**

This is a custom function that is designed to intercept and handle
messages dispatched by the game scripts. This is the primary
way of creating passive listeners.


*Note: For now handlers can only be registered a single time. I haven't
come across a personal usecase for a cascading event system*

**Usage**
```svelte
<script lang="ts">
  let characterName: string;
  
  useNuiEvent<string>('myAction', (data) => {
    // the first argument to the handler function
    // is the data argument sent using SendNUIMessage
    
    // do whatever logic u want here
    characterName = data;
  })
</script>

<div>{characterName}</div>
```

**fetchNui**

This is a simple NUI focused wrapper around the standard `fetch` API.
This is the main way to accomplish active NUI data fetching 
or to trigger NUI callbacks in the game scripts.

When using this, you must always at least callback using `{}`
in the gamescripts.

*This can be heavily customized to your use case*

**Usage**
```svelte
<script lang="ts">
  let clientCoords: {x: number; y: number; z: number};

  fetchNui<{x: number; y: number; z: number}>('getClientData').then(retData => {
    console.log('Got return data from client scripts:', retData);
    clientCoords = retData
  }).catch(e => {
    console.log('Setting mock data due to error', e)
    clientCoords = {x: 500, y: 300: z: 200}
  })
</script>

<div>{clientCoords}</div>
```

**debugData**

This is a function allowing for mocking dispatched game script
actions in a browser environment. It will trigger `useNuiEvent` handlers
as if they were dispatched by the game scripts. **It will only fire if the current
environment is a regular browser and not CEF**

**Usage**
```ts
// This will target the useNuiEvent function registered with `setVisible`
// and pass them the data of `true`
<script lang="ts">
  debugData([
    {
      action: 'setVisible',
      data: true,
    }
  ])
<script
```

**Misc Utils**

These are small but useful included utilities.

* `isEnvBrowser()` - Will return a boolean indicating if the current 
  environment is a regular browser. (Useful for logic in development)

## Development Workflow

**Live Preview**
When developing in-game you can use the `fxmanifest` at `ui_page` for live preview without build or watch. You can go to `fxmanifest.lua` and see the line. For live preview use `ui_page 'http://localhost:5173/'` and when already done you can use `ui_page 'web/build/index.html'`

You no need to restart or ensure script when developing (except got error, hahaha). Use `svelte:show` for open the dialog.

For development in browser you can just run `dev` instead.

**Usage**
```sh
bun run dev
```

**Production Builds**

When you are done with development phase for your resource. You
must create a production build that is optimized and minimized.

You can do this by running the following:

```sh
bun run build
```