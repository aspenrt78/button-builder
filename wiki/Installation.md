# Installation

## Prerequisites

1. **Home Assistant** - Version 2024.1.0 or newer
2. **button-card** - Install via HACS first:
   - Open HACS → Frontend → Search "button-card" → Install

## Installation Methods

### Method 1: HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to **Integrations**
3. Click the **+** button
4. Search for "Button Builder"
5. Click **Download**
6. Restart Home Assistant
7. Go to **Settings → Devices & Services → Add Integration**
8. Search for "Button Builder"
9. Click to add

### Method 2: Manual Installation

1. Download the latest release from [GitHub](https://github.com/aspenrt78/button-builder/releases)
2. Extract and copy the `custom_components/button_builder` folder to your Home Assistant `config/custom_components/` directory
3. Restart Home Assistant
4. Go to **Settings → Devices & Services → Add Integration**
5. Search for "Button Builder" and add it

## Accessing Button Builder

After installation, Button Builder appears in your Home Assistant sidebar at
`/button-builder`. Click it to open the visual designer.

## Upgrading to version 3

Version 3 replaces `/button-card-builder`, `/bubble-card-builder`, and
`/tile-card-builder` with one `/button-builder` panel.

1. Update through HACS or replace the manual integration files.
2. Restart Home Assistant so the old panels are removed and the new panel is registered.
3. Remove manually pinned sidebar links to the old routes.
4. Hard-refresh the browser once if an older frontend bundle remains cached.

Existing Bubble Card and Tile Card YAML on dashboards is not changed by the
upgrade. Only those visual editors were removed from this integration.

## Troubleshooting

### Integration Not Showing
- Make sure you restarted Home Assistant after installation
- Make sure Button Builder was added under **Settings → Devices & Services**
- Check the logs for any errors
- Verify the folder structure is correct: `config/custom_components/button_builder/`
- Remove stale manually pinned links to the former v2 routes

### Panel or Preview Looks Outdated
- Hard-refresh with **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (macOS)
- Confirm `custom_components/button_builder/manifest.json` shows the expected release version

### Generated Cards Do Not Render
- Confirm `custom:button-card` is installed and registered as a Lovelace resource
- Validate the entity ID and generated YAML in Home Assistant's Manual card editor

### Entities Not Loading
- Button Builder needs to connect to Home Assistant's API
- Check that you're accessing HA through a valid URL (not an IP with mixed content issues)
- Try refreshing the page
