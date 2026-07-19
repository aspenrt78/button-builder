---
name: verify
description: How to launch and visually verify the Button Builder frontend (Vite React app for a Home Assistant panel)
---

# Verifying Button Builder UI changes

## Launch

```powershell
npm run dev   # Vite dev server at http://localhost:3000/button_builder/ (run in background)
```

No HA instance needed — the app runs standalone; entity data falls back gracefully.

## Drive (headless browser)

No playwright in the project. Install `playwright-core` in the session scratchpad
(NOT the project) and point it at system Chrome:

```js
const { chromium } = require('playwright-core');
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
```

## Driving the config panel

- Show Name/Icon/State/Label toggles live under **Content → Visibility** (not the
  Content root or Layout).
- The YAML pane toggles via the top-right `YAML` button; extract its text by finding
  the smallest element containing `type: custom:button-card`.
- To exercise app modules in their real runtime, `page.evaluate` can dynamic-import
  them through Vite — note `vite.config` sets `root: 'src'`, so URLs are
  `/button_builder/utils/yamlGenerator.ts` (NO `src/` segment).
- Generated YAML can be validated in Node with the `yaml` package (same parser the
  importer uses).

## Gotchas

- A **"Theme options" modal auto-opens on load** and blocks all clicks. Dismiss it
  first: click the exact text `Start with no theme`.
- The app usually restores the last-open panel section from localStorage; nav is
  category tabs ("Content", "Appearance", …) then sub-tabs ("Style Presets", …).
- Preset gallery rows: thumbnail is rendered by `PresetExample` in
  `src/components/OptionExamples.tsx`; locate rows by exact preset name text and
  screenshot a clipped region around the bounding box.
- One 404 console error on load is pre-existing (unrelated asset), not a failure.
- `vite build` does NOT typecheck; run `npx tsc --noEmit` separately.
- React style objects: an explicitly-undefined longhand key (e.g. `backgroundImage`)
  after a shorthand (`background`) CLEARS that part of the shorthand in the DOM —
  strip undefined keys before rendering (see `definedStyles` in OptionExamples.tsx).
