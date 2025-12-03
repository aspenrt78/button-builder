# Getting Started

## Choosing a Builder

Button Builder now supports two card types:

| Builder | Card Type | Best For |
|---------|-----------|----------|
| **Button Card Builder** | `custom:button-card` | Highly customizable buttons with advanced styling |
| **Bubble Card Builder** | `custom:bubble-card` | Modern, clean cards with smooth animations |

Switch between builders using the **Card Type** selector at the top of the app.

---

## Button Card Builder

### Interface Overview

Button Builder has three main panels:

| Panel | Description |
|-------|-------------|
| **Editor** (Left) | Configuration options organized in collapsible sections |
| **Preview** (Center) | Live preview of your button |
| **YAML** (Right) | Generated button-card YAML code |

### Creating Your First Button

#### Step 1: Select an Entity

1. In the **Core Configuration** section, click the Entity dropdown
2. Search or browse your entities
3. Select an entity (e.g., `light.living_room`)
4. The name and icon will auto-fill based on the entity

#### Step 2: Choose a Style

1. Click **Presets** in the header
2. Browse categories: Minimal, Glass, Neon, Gradient, etc.
3. Click any preset to apply it instantly

#### Step 3: Customize

Adjust any settings you want:
- **Colors** - Background, icon, text colors
- **Layout** - Vertical, horizontal, icon positions
- **Visibility** - Show/hide name, state, icon, label

#### Step 4: Copy the YAML

1. Look at the YAML panel on the right
2. Click **Copy** to copy the generated code
3. Paste it into your Home Assistant dashboard

---

## Bubble Card Builder (Beta)

See the dedicated [[Bubble Card Builder]] page for detailed documentation.

### Quick Start

1. Switch to **custom:bubble-card** using the card type selector
2. Choose a **Card Type** (Button, Separator, Pop-up, etc.)
3. Configure the options for your chosen card type
4. Copy the generated YAML

---

## Using the Generated YAML

### In Dashboard UI

1. Go to your Home Assistant dashboard
2. Click the **⋮** menu → **Edit Dashboard**
3. Click **+ Add Card**
4. Scroll down and select **Manual**
5. Paste your copied YAML
6. Click **Save**

### In YAML Mode

If you edit dashboards in YAML mode, paste the button configuration directly into your view's `cards:` section.

## Tips

- **Preview Size**: Use the gear icon in the preview to adjust card size and see how it looks in different dashboard layouts
- **Click Preview**: Click the preview button to toggle between ON/OFF states
- **Canvas Color**: Change the preview background to match your dashboard theme
