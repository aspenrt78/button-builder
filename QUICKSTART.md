# Quick Start Guide

This guide will help you get Button Card Architect up and running in minutes.

## 🚀 Quick Installation

### Option 1: HACS (Easiest)
1. Open HACS → Integrations → "+" → Search "Button Card Architect" → Download
2. Restart Home Assistant
3. Find "Button Architect" in your sidebar

### Option 2: Manual (5 minutes)
1. Download the [latest release](https://github.com/aspenrt78/button-builder/releases)
2. Extract and copy `custom_components/button_card_architect` to your HA config folder
3. Restart Home Assistant

## 📋 Before You Start

**Required:**
- ✅ [custom:button-card](https://github.com/custom-cards/button-card) installed (via HACS)

**Optional:**
- 🤖 [Gemini API Key](https://aistudio.google.com/app/apikey) (for AI features - free tier available)

## 🎨 Your First Button

### Method 1: Visual Design (No API Key Needed)

1. Click **"Button Architect"** in your sidebar
2. In the **Core Configuration** section:
   - **Entity ID**: `light.living_room` (use your actual entity)
   - **Name**: `Living Room`
   - **Icon**: `mdi:lightbulb`
3. Explore the sections:
   - **Colors & Theming**: Change background and text colors
   - **Layout & Dimensions**: Adjust size and layout
   - **Glass & Depth**: Add blur and shadows for glassmorphism
   - **Animations**: Add pulse, flash, or spin effects
4. Watch the **live preview** update as you design
5. Copy the **YAML** from the right panel
6. Paste into your Lovelace dashboard

### Method 2: AI Magic Builder (Requires API Key)

1. Click **"Magic Build"** button (top right)
2. Enter a description like:
   - *"Cyan glassmorphism button for bedroom lights with soft glow"*
   - *"Minimal dark button for garage door, red when open"*
3. Click **"Generate Design"**
4. AI creates a complete design instantly
5. Fine-tune with the visual editor if needed
6. Copy YAML and paste to dashboard

## 📝 Example Configurations

### Glassmorphism Light Button
```yaml
type: custom:button-card
entity: light.living_room
name: Living Room
icon: mdi:lightbulb
color_type: card
color: auto
styles:
  card:
    - background-color: rgba(255, 255, 255, 0.1)
    - backdrop-filter: blur(10px)
    - border-radius: 16px
    - box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37)
```

### Animated Fan Button
```yaml
type: custom:button-card
entity: fan.bedroom
name: Bedroom Fan
icon: mdi:fan
state:
  - value: 'on'
    icon: mdi:fan
    styles:
      icon:
        - animation: spin 2s linear infinite
```

## 🎯 Tips & Tricks

### 1. Use Auto Colors
- Enable **"Auto Color"** or **"Match Entity"** to inherit colors from lights/switches
- Perfect for lights that change color

### 2. Glassmorphism Effect
- Set background opacity to 10-30%
- Add backdrop blur (10-20px)
- Add subtle shadow with low opacity

### 3. State-Based Styling
- Configure different colors for ON/OFF states
- Use animations that trigger on state change
- Example: Red when garage door is open

### 4. Layout Options
- **Vertical**: Icon on top, name below (default)
- **Icon + State**: Horizontal layout
- **Icon + Label**: Great for displaying sensor values

### 5. Marquee Border Effect
- Set card animation to "marquee"
- Trigger: "on" for state-based rotation
- Creates a rotating border effect

## 🔧 Troubleshooting

**Panel not showing?**
- Restart Home Assistant
- Check logs: Configuration → Logs

**AI not working?**
- Verify your API key is correct
- Check you have internet connection
- Free tier has rate limits - wait a few minutes

**Preview not updating?**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Button not working in dashboard?**
- Ensure custom:button-card is installed
- Check entity ID is correct
- Verify YAML syntax

## 📚 Learn More

- [Full Documentation](README.md)
- [Detailed Installation Guide](INSTALLATION.md)
- [Report Issues](https://github.com/aspenrt78/button-builder/issues)

## 🎉 You're Ready!

Start designing beautiful button cards for your Home Assistant dashboard. Have fun! 🚀
