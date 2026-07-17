# Version 3 Features

## Focused integration

Button Builder now focuses exclusively on `custom:button-card` and registers one Home Assistant sidebar panel. Bubble Card, Tile Card, and other builders are planned as separate integrations with independent installation and release cycles.

## State-aware appearance

- Independent ON and OFF appearance editing for binary entities
- Copy and reset tools for the active state
- Automatic migration of legacy state colors and icon-spin settings
- One merged state model shared by the preview and YAML generator
- Theme controls that remain global across states

## Themes and presets

- Select which appearance controls belong to the global theme
- Save, load, and delete reusable themes
- Curated preset gallery with matching preview backdrops
- Custom style presets and automatic dark-state variants
- Improved thumbnail accuracy for glass, gradients, neon, badges, and animated effects

## Visual effects

The expanded visual-effect library includes animated borders, energy charge, neon current, scanner, shimmer, liquid and mesh gradients, plasma, particles, radar and sonar, status beacon, glitch, electric jolt, frost, heat haze, breathing glass, state morph, progress border, and threshold pulse.

Supported effects expose a state-aware 25–200% intensity control. Intensity modifies the defining effect amplitude—such as shape deformation, glow reach, ring travel, displacement, particle movement, or border width—rather than merely changing color.

## Preview workbench

- Resizable desktop configuration area and collapsible YAML panel
- Searchable category navigation with optional advanced controls
- Improved mobile navigation
- ON/OFF state simulation
- Dashboard, custom image, solid color, and blur-test backdrops
- Preview zoom and layout sizing
- Portal-based entity and icon pickers that avoid panel clipping

## AI generation

- Home Assistant AI Task provider support with structured output
- Direct Gemini API-key provider remains available
- Home Assistant provider credentials stay inside Home Assistant
- Expanded animation schema for generated designs

## YAML compatibility

- State-aware YAML generation
- Improved import and legacy migration
- Shared animation keyframes between the editor and generated cards
- Round-trip handling for generated effect variables
- Runtime-only controls are labeled clearly in the editor

See [CHANGELOG.md](CHANGELOG.md) and [RELEASE_NOTES_3.0.0.md](RELEASE_NOTES_3.0.0.md) for release and upgrade details.
