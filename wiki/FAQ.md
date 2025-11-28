# Frequently Asked Questions

## General

### What is Button Builder?
Button Builder is a visual designer for creating [button-card](https://github.com/custom-cards/button-card) configurations in Home Assistant. Instead of writing YAML by hand, you configure buttons through a graphical interface.

### Do I need button-card installed?
Yes! Button Builder generates YAML for the button-card custom card. Install button-card via HACS first.

### Does Button Builder replace button-card?
No. Button Builder is a configuration tool that outputs button-card YAML. The actual buttons on your dashboard are still rendered by button-card.

## Usage

### Why aren't my entities showing?
- Ensure Button Builder is properly connected to Home Assistant
- Try clicking the entity dropdown and waiting a moment for them to load
- Check browser console for errors
- Some entity domains are filtered by default; click "Show All" to see all entities

### Why doesn't my button look the same on the dashboard?
- Dashboard card sizes vary based on your layout (Masonry, Sections, etc.)
- Use the Preview Settings (gear icon) to simulate different dashboard layouts
- Aspect ratio and height settings affect sizing

### How do I make the button toggle my light?
By default, **Tap Action** is set to `toggle`. Just select your light entity and it will toggle on tap.

### How do I show the temperature on a button?
1. Set the main entity to your climate/sensor
2. Enable **Show State** in Visibility
3. Or use **Label Entity** to show another sensor's value

### Why isn't my label showing?
Make sure **Show Label** is enabled in the Visibility section. When you configure a label, Button Builder should prompt you to enable it.

## Styling

### How do I use a custom color?
Click the color swatch next to any color option to open the color picker, or type a hex code directly.

### How do I make the icon change color with the light?
Enable **Match Entity** next to Icon Color. When the light is on, the icon will use the light's color.

### Can I use any font?
Yes! Use the Custom Font option in Typography:
1. Get the Google Fonts URL from fonts.google.com
2. Enter the exact font name and URL

### How do I add a glow effect?
- Use a Neon preset, or
- Set Shadow Size to lg/xl with a bright Shadow Color, or
- Use the `glow` animation

## Actions

### How do I open more info on hold?
Set **Hold Action** to `more-info` (this is the default).

### How do I call a specific service?
1. Set action to `call-service`
2. In the Service Data field, enter:
```yaml
service: light.turn_on
data:
  entity_id: light.bedroom
  brightness: 128
```

### How do I navigate to another dashboard?
1. Set action to `navigate`
2. Enter the path: `/lovelace/living-room`

## Troubleshooting

### Button Builder won't load
- Clear browser cache
- Check Home Assistant logs for errors
- Verify the integration is installed correctly

### YAML has errors when pasted
- Make sure you're adding a "Manual" card, not putting it in existing card YAML
- Check for proper indentation
- Ensure button-card is installed

### Animations aren't working
- Some animations only trigger on specific states (on/off)
- Check the Animation Trigger setting
- Ensure the animation speed isn't set too slow

### Preview doesn't match dashboard
- Dashboard layouts affect card sizing
- Use Preview Settings to match your dashboard type
- Consider using aspect-ratio instead of fixed height

## Support

### Where can I report bugs?
[GitHub Issues](https://github.com/aspenrt78/button-builder/issues)

### Where is the button-card documentation?
[button-card GitHub](https://github.com/custom-cards/button-card)
