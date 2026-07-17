# HACS Integration Setup

Button Builder is packaged as a standard Home Assistant custom integration.

## Included integration files

- `custom_components/button_builder/manifest.json`
- `custom_components/button_builder/config_flow.py`
- `custom_components/button_builder/__init__.py`
- Translations and self-hosted brand assets
- Compiled frontend files under `custom_components/button_builder/www/`
- Root `hacs.json` metadata
- HACS and hassfest validation workflow

## Local development

```powershell
npm install
npm run dev
```

The development server runs at `http://localhost:3000`.

## Production build

```powershell
npx tsc --noEmit
npm run build
```

The build writes `index.js`, `index.css`, and `index.html` into the integration's `www` directory. Home Assistant loads the compiled app through `panel.html`.

## Home Assistant test

1. Copy `custom_components/button_builder` into the Home Assistant configuration directory.
2. Restart Home Assistant.
3. Add Button Builder from **Settings → Devices & services**.
4. Open **Button Builder** in the sidebar.
5. Verify preview, YAML import/export, state switching, presets, themes, and at least one generated effect.

## Version 3 scope

The integration now contains only the `custom:button-card` builder. Bubble Card, Tile Card, and other builders are planned as separate integrations so each can be installed and released independently.

## Release requirements

- Package, lockfile, and manifest versions match.
- Changelog and release notes describe breaking changes.
- Production assets are rebuilt from the tagged source.
- TypeScript, Python, JSON, HACS, and hassfest checks pass.
- The release commit is tagged with the same `vX.Y.Z` version and published as a GitHub release.
