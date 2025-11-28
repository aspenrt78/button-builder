# Configuration Options

## Core Configuration

| Option | Description |
|--------|-------------|
| **Entity ID** | The Home Assistant entity to control |
| **Name** | Display name on the button |
| **Icon** | MDI icon (e.g., `mdi:lightbulb`) |
| **State Display** | Custom text to show instead of entity state |
| **Entity Picture** | URL to an image to display instead of icon |
| **Units Override** | Custom unit suffix (e.g., °C, kW) |

### Label Configuration

Labels show secondary information below the name:

| Option | Description |
|--------|-------------|
| **Static Label** | Fixed text to display |
| **Label Entity** | Another entity whose state to show as label |
| **Attribute** | Specific attribute to display (e.g., `temperature`) |

## Layout & Dimensions

| Option | Description |
|--------|-------------|
| **Layout** | Arrangement of icon, name, state (vertical, horizontal, etc.) |
| **Aspect Ratio** | Card proportions (e.g., `1/1`, `2/1`) |
| **Card Height** | Fixed height in pixels |
| **Icon Size** | Icon size as percentage |
| **Border Radius** | Corner roundness |
| **Padding** | Internal spacing |

## Visibility Toggles

Control what elements appear on the button:

- **Show Name** - Display entity name
- **Show Icon** - Display icon
- **Show State** - Display current state (on/off, value)
- **Show Label** - Display label text
- **Show Last Changed** - Show when state last changed
- **Entity Picture** - Use picture instead of icon

## Colors & Theming

### Global Colors

| Option | Description |
|--------|-------------|
| **Color Type** | How colors are applied (card, icon, blank-card) |
| **Auto Color** | Inherit color from light entity |
| **Background** | Card background color and opacity |
| **Text Color** | Default text color |

### Element Colors

Each element can have its own color with "Match Entity" option:

- Icon Color
- Name Color  
- State Color
- Label Color

### Gradients

Enable gradient backgrounds with:
- **Type**: Linear, Radial, or Conic
- **Angle**: Direction (0-360°)
- **Colors**: 2-3 color stops

## Glass & Depth

| Option | Description |
|--------|-------------|
| **Backdrop Blur** | Frosted glass effect (0-20px) |
| **Shadow Size** | Drop shadow intensity |
| **Shadow Color** | Shadow color and opacity |

## Borders

| Option | Description |
|--------|-------------|
| **Border Width** | Thickness in pixels |
| **Border Style** | solid, dashed, dotted, double, groove |
| **Border Color** | Color with optional entity match |

## Typography

| Option | Description |
|--------|-------------|
| **Font Family** | Built-in fonts or system fonts |
| **Custom Font** | Google Fonts URL for custom fonts |
| **Font Size** | Text size |
| **Font Weight** | normal, bold, lighter, bolder |
| **Text Transform** | uppercase, lowercase, capitalize |
| **Letter Spacing** | Space between characters |
| **Line Height** | Vertical line spacing |

## Animations

### Card Animation
Animate the entire button card.

### Icon Animation  
Animate just the icon.

**Animation Types**: flash, pulse, jiggle, shake, bounce, spin, glow, float, swing, heartbeat, flip, wobble, breathe, ripple

**Triggers**: always, on (when entity is on), off (when entity is off)
