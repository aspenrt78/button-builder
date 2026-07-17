# Installation Guide

## Requirements

- Home Assistant 2024.1.0 or newer
- [`custom:button-card`](https://github.com/custom-cards/button-card), installed separately through HACS or manually
- A modern browser

AI design is optional. Magic Builder can use a Home Assistant AI Task provider or a direct Gemini API key entered in the app.

## HACS installation

1. Open **HACS → Integrations**.
2. Search for **Button Builder**.
3. Select **Download**.
4. Restart Home Assistant.
5. Open **Settings → Devices & services → Add integration**.
6. Search for and add **Button Builder**.
7. Open the new **Button Builder** sidebar panel.

## Manual installation

1. Download the latest source archive from the [GitHub releases page](https://github.com/aspenrt78/button-builder/releases).
2. Copy `custom_components/button_builder` into your Home Assistant configuration directory:

   ```text
   config/
   └── custom_components/
       └── button_builder/
   ```

3. Restart Home Assistant.
4. Add **Button Builder** from **Settings → Devices & services**.
5. Open **Button Builder** from the sidebar.

## Upgrading to version 3

Version 3 replaces `/button-card-builder`, `/bubble-card-builder`, and `/tile-card-builder` with one `/button-builder` panel.

1. Update through HACS or replace the manual integration files.
2. Restart Home Assistant so the old panels are removed and the new panel is registered.
3. Hard-refresh the browser once if an older frontend bundle remains cached.

Bubble Card, Tile Card, and other builders are planned as separate integrations. Existing card YAML already used on dashboards is not modified.

## AI providers

### Home Assistant AI Tasks

If Home Assistant exposes an AI Task provider, Magic Builder lists it automatically. Requests run through Home Assistant; Button Builder does not read or store that provider's credentials.

### Direct Gemini

Choose **Gemini API key (direct)** in Magic Builder and enter a key from [Google AI Studio](https://aistudio.google.com/apikey). The key is stored in that browser's local storage and can be removed from the Magic Builder key controls.

## Troubleshooting

### Panel not showing

- Confirm Home Assistant was restarted after installation or upgrade.
- Confirm the integration was added under **Settings → Devices & services**.
- Check Home Assistant logs for `button_builder` errors.
- Remove stale manually pinned sidebar links to the former v2 routes.

### Preview or panel appears stale

- Hard-refresh with Ctrl+Shift+R or Cmd+Shift+R.
- Confirm `custom_components/button_builder/manifest.json` reports the expected release version.

### Generated cards do not render

- Confirm `custom:button-card` is installed and registered as a Lovelace resource.
- Validate the entity ID and generated YAML in Home Assistant's manual card editor.

## Uninstallation

1. Remove Button Builder from **Settings → Devices & services**.
2. If installed manually, remove `custom_components/button_builder`.
3. Restart Home Assistant.
