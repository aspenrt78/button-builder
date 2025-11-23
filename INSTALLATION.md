# Installation Guide

## Prerequisites

### Required
- **Home Assistant** (version 2021.12 or newer)
- **custom:button-card** integration (Install via HACS or manually)
  - HACS: Search for "button-card" in Frontend section
  - Manual: https://github.com/custom-cards/button-card

### Optional
- **Gemini API Key** (for AI-powered design generation)
  - Get a free key at: https://aistudio.google.com/app/apikey

## Installation Methods

### Method 1: HACS (Recommended)

1. **Open HACS** in your Home Assistant instance
2. Click on **"Integrations"**
3. Click the **"+"** button in the bottom right
4. Search for **"Button Card Architect"**
5. Click **"Download"**
6. **Restart Home Assistant**
7. The **"Button Architect"** panel will appear in your sidebar

### Method 2: Manual Installation

1. **Download** the latest release from the [releases page](https://github.com/aspenrt78/button-builder/releases)

2. **Extract** the archive and locate the `custom_components/button_card_architect` folder

3. **Copy** the folder to your Home Assistant configuration directory:
   ```
   <config_directory>/custom_components/button_card_architect/
   ```

4. Your directory structure should look like:
   ```
   config/
   └── custom_components/
       └── button_card_architect/
           ├── __init__.py
           ├── manifest.json
           └── www/
               ├── panel.html
               ├── index.js
               └── index.css
   ```

5. **Restart Home Assistant**

6. The **"Button Architect"** panel will appear in your sidebar

## Configuration

### Setting Up Gemini API Key (Optional)

The AI Magic Builder feature requires a Gemini API key. This is optional - the visual editor works without it.

#### Option 1: Via Home Assistant Configuration

Add to your `configuration.yaml`:

```yaml
button_card_architect:
  gemini_api_key: "your_api_key_here"
```

#### Option 2: Via Environment Variable

Set the `GEMINI_API_KEY` environment variable before starting Home Assistant.

#### Option 3: In-App Configuration

Enter your API key in the app when prompted to use AI features.

## Verification

After installation and restart:

1. Check **Configuration** → **Logs** for any errors related to `button_card_architect`
2. Look for **"Button Architect"** in your sidebar (left navigation menu)
3. Click it to open the designer

## Troubleshooting

### Panel Not Showing

- Ensure you've restarted Home Assistant after installation
- Check the logs for errors: **Configuration** → **Logs**
- Verify the files are in the correct location

### AI Features Not Working

- Ensure you've entered a valid Gemini API key
- Check your internet connection
- Verify the API key has not exceeded rate limits

### Button Preview Not Updating

- Try refreshing your browser
- Clear your browser cache (Ctrl+Shift+R / Cmd+Shift+R)

## Updating

### Via HACS

HACS will notify you when updates are available. Click "Update" and restart Home Assistant.

### Manual Update

1. Download the new release
2. Replace the `button_card_architect` folder in `custom_components`
3. Restart Home Assistant

## Uninstallation

1. Remove the `custom_components/button_card_architect` folder
2. Restart Home Assistant
3. The panel will be removed from the sidebar

## Next Steps

- Read the [Usage Guide](README.md#-usage)
- Try the [AI Magic Builder](README.md#ai-magic-builder)
- Check out [example configurations](examples/)

## Support

- 🐛 [Report an issue](https://github.com/aspenrt78/button-builder/issues)
- 💬 [Discussions](https://github.com/aspenrt78/button-builder/discussions)
- 📖 [Full Documentation](README.md)
