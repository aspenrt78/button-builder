# Button Builder v3.0.0

Button Builder 3 is a breaking, focused redesign of the Home Assistant visual editor for `custom:button-card`.

## Highlights

- A single **Button Builder** sidebar panel replaces the former Button, Bubble, and Tile builder panels.
- ON/OFF appearances are edited independently and exported as coherent button-card state entries.
- Global appearance controls can be promoted into reusable themes.
- The preset gallery has curated backdrop pairings, custom style presets, and improved thumbnails.
- More than two dozen visual effects now support state-aware 25–200% intensity. Intensity changes the effect itself—shape deformation, glow reach, ring travel, particle movement, distortion, or border width—not just its color.
- Magic Builder can use Home Assistant AI Task providers or a direct Gemini API key.
- The preview includes dashboard/custom backdrops, a dedicated blur-test pattern, layout sizing, zoom, and improved state simulation.
- YAML import/export now preserves the redesigned state and effect model.

## Breaking changes

- Bubble Card Builder and Tile Card Builder are no longer included.
- `/button-card-builder`, `/bubble-card-builder`, and `/tile-card-builder` are replaced by `/button-builder`.
- Home Assistant must be restarted after updating so panel registration is refreshed.

Existing Bubble Card and Tile Card YAML already installed on dashboards is not changed. This release only removes those visual editors from Button Builder. Bubble Card, Tile Card, and other builders are planned as separate integrations, allowing them to be installed, updated, and released independently.

## Upgrade

1. Update Button Builder through HACS.
2. Restart Home Assistant.
3. Open **Button Builder** in the sidebar.
4. Hard-refresh the browser once if Home Assistant displays an older cached interface.

`custom:button-card` remains a separate required frontend dependency.
