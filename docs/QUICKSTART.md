# Quick Start Guide

## Install

1. Install [`custom:button-card`](https://github.com/custom-cards/button-card).
2. Install **Button Builder** from **HACS → Integrations**.
3. Restart Home Assistant and add the Button Builder integration.
4. Open **Button Builder** from the sidebar.

## Build your first button

1. Select an entity such as `light.living_room`.
2. Open **Appearance → Style Presets** and choose a starting style.
3. Use the ON/OFF state switch to edit each binary-state appearance independently.
4. Choose **Theme options** if some appearance controls should stay global across both states.
5. Adjust layout, colors, glass effects, animation, and effect intensity.
6. Check the live preview, then open the YAML panel and copy the result.
7. Add a **Manual** card to a Home Assistant dashboard and paste the YAML.

## Effect intensity

Supported visual effects expose a 25–200% intensity slider. It adjusts the defining amplitude of the selected effect, including liquid corner deformation, glow reach, ripple travel, particle movement, glitch displacement, haze distortion, and animated border width. A value of 100% preserves the original effect.

## Previewing glass blur

Backdrop blur requires a translucent card and visible detail behind it:

1. Lower the card background opacity.
2. Open the preview palette.
3. Select **Blur Test Pattern**, a dashboard background, or a custom image.
4. Increase **Backdrop Blur** under the Glass appearance controls.

## Magic Builder

1. Open **Magic Build**.
2. Choose a Home Assistant AI Task provider or direct Gemini.
3. Describe the button you want.
4. Apply the result and fine-tune it in the visual editor.

## Version 3 note

Button Builder v3 focuses on `custom:button-card`. Bubble Card, Tile Card, and other builders are planned as separate integrations. Existing YAML already installed on dashboards is unaffected.

## Troubleshooting

- Restart Home Assistant after installing or upgrading.
- Hard-refresh the browser if the panel looks stale.
- Confirm `custom:button-card` is installed when generated cards do not render.
- See the complete [installation guide](INSTALLATION.md) and [v3 release notes](RELEASE_NOTES_3.0.0.md).
