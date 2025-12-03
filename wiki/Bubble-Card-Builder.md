# Bubble Card Builder

> **Beta Feature** - The Bubble Card Builder is new in v2.0.0. Please report any issues!

The Bubble Card Builder is a visual editor for creating [Bubble Card](https://github.com/Clooos/Bubble-Card) configurations. Bubble Card is a popular custom card that provides a modern, clean design with smooth animations.

## Switching Between Builders

At the top of Button Builder, you'll see a card type selector:
- **custom:button-card** - The original Button Card Builder
- **custom:bubble-card** - The new Bubble Card Builder (Beta)

Click on either to switch between builders.

## Supported Card Types

Bubble Card Builder supports all 10 Bubble Card types:

| Card Type | Description |
|-----------|-------------|
| **Button** | Versatile button with switch, slider, state, or name modes |
| **Separator** | Divider for organizing your dashboard sections |
| **Pop-up** | Converts a vertical stack into a pop-up overlay |
| **Cover** | Control blinds, shutters, and other cover entities |
| **Media Player** | Control media players with playback controls |
| **Climate** | Control thermostats and climate entities |
| **Select** | Dropdown menu for input_select entities |
| **Calendar** | Display calendar events |
| **Horizontal Buttons Stack** | Scrollable footer buttons for navigation |
| **Empty Column** | Fill empty space in horizontal stacks |

## Interface Overview

The Bubble Card Builder has three main panels:

| Panel | Description |
|-------|-------------|
| **Editor** (Left) | Card type selector and configuration options |
| **Preview** (Center) | Live preview of your card |
| **YAML** (Right) | Generated bubble-card YAML code |

## Creating a Bubble Card

### Step 1: Select Card Type

1. Choose your card type from the dropdown at the top of the editor
2. The configuration panel will update to show relevant options for that type

### Step 2: Configure the Card

Each card type has different options:

#### Button Options
- **Entity** - The entity to control
- **Button Type** - Switch, Slider, State, or Name
- **Name/Icon** - Customize appearance
- **Show Options** - Toggle name, icon, state visibility
- **Sub-buttons** - Add additional action buttons

#### Pop-up Options
- **Hash** - URL hash to trigger the pop-up (e.g., `#living-room`)
- **Auto Close** - Time in ms to auto-close
- **Width/Margin** - Size and positioning

#### Media Player Options
- **Entity** - Media player entity
- **Hide Controls** - Hide specific playback buttons
- **Volume Controls** - Show/hide volume slider

### Step 3: Apply Styles (Optional)

Use the Styles section to add custom CSS:
```yaml
styles: |
  .bubble-button-card-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
```

### Step 4: Copy the YAML

1. The YAML panel shows your generated configuration
2. Click **Copy** to copy to clipboard
3. Paste into your Home Assistant dashboard

## Button Types Explained

The Button card type has four different modes:

| Type | Description |
|------|-------------|
| **Switch** | Toggle entities on/off, background changes with state |
| **Slider** | Control brightness, volume, or other ranges |
| **State** | Display sensor info, opens more-info on press |
| **Name** | Display text without entity, add custom actions |

## Sub-buttons

Sub-buttons are small action buttons that appear on the right side of button cards:

1. Scroll to the **Sub-buttons** section
2. Click **Add Sub-button**
3. Configure each sub-button:
   - **Entity** - Entity to control
   - **Icon** - MDI icon
   - **Name** - Tooltip text
   - **Show Background** - Toggle background visibility

## Presets

Click the **Presets** button in the header to browse pre-made styles:

- Filter by **Category** (Glass, Neon, Gradient, etc.)
- Filter by **Card Type** to see relevant presets
- Click any preset to apply it instantly

## Tips

- **Preview Toggle**: Click the preview to toggle between states
- **Card Type First**: Select your card type before configuring - switching types resets options
- **CSS Variables**: Bubble Card uses CSS variables for theming - check the [Bubble Card docs](https://github.com/Clooos/Bubble-Card) for available variables

## Requirements

- Home Assistant 2024.1.0 or newer
- [Bubble Card](https://github.com/Clooos/Bubble-Card) installed via HACS

## Known Limitations

- YAML import for Bubble Card is not yet implemented
- Some advanced Bubble Card features may not be available in the visual editor yet
- The preview is an approximation - actual appearance may vary slightly in Home Assistant
