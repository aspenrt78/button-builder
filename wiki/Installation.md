# Installation

## Prerequisites

1. **Home Assistant** - Version 2023.0 or newer
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

After installation, Button Builder appears in your Home Assistant sidebar. Click it to open the visual designer.

## Troubleshooting

### Integration Not Showing
- Make sure you restarted Home Assistant after installation
- Check the logs for any errors
- Verify the folder structure is correct: `config/custom_components/button_builder/`

### Entities Not Loading
- Button Builder needs to connect to Home Assistant's API
- Check that you're accessing HA through a valid URL (not an IP with mixed content issues)
- Try refreshing the page
