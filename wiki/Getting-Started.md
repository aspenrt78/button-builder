# Getting Started

## Interface overview

Button Builder has three working areas:

| Area | Purpose |
|---|---|
| Configuration | Searchable controls grouped by content, appearance, behavior, states, and advanced options |
| Preview | Live state simulation on a configurable dashboard backdrop |
| YAML | Generated `custom:button-card` configuration ready to copy |

## Create a button

1. Select a Home Assistant entity.
2. Open **Appearance → Style Presets** and choose a starting design.
3. For binary entities, switch between ON and OFF and customize each appearance.
4. Use **Theme options** to keep selected controls global across both states.
5. Configure actions and any advanced behavior.
6. Copy the generated YAML.
7. Paste it into a Home Assistant **Manual** dashboard card.

## Effect intensity

Supported visual effects provide a 25–200% intensity slider. The slider changes the defining visual amplitude: liquid corners stretch farther, rings travel farther, glow expands, particles move farther, and distortion becomes stronger. A value of 100% preserves the original effect.

## Preview tips

- Click the state control to simulate ON/OFF behavior.
- Use the palette menu to match the dashboard background.
- Select **Blur Test Pattern** and lower card background opacity to inspect backdrop blur.
- Use layout and zoom controls to test different card sizes.

## Version 3 builder scope

Bubble Card, Tile Card, and other builders are planned as separate integrations. They are no longer selected inside this integration.
