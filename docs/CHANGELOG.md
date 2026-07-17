# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] - 2026-07-17

### Breaking changes

- **Focused Button Builder integration**: Removed the Bubble Card and Tile Card builders and their Home Assistant sidebar panels. Version 3 registers one `Button Builder` panel at `/button-builder` and focuses exclusively on `custom:button-card`. Bubble Card, Tile Card, and other builders are planned as separate integrations so each can evolve and release independently.
- **Panel URL changed**: The former `/button-card-builder`, `/bubble-card-builder`, and `/tile-card-builder` panel routes are replaced by `/button-builder`. Restart Home Assistant after upgrading so the old panels are removed and the new panel is registered.

### Added

- **State-aware design workflow**: ON and OFF appearance editing, state copy/reset tools, legacy state-color migration, and synchronized preview/YAML generation.
- **Theme system**: Choose which appearance controls remain global, save reusable themes, and move controls between theme and per-state scopes without visual jumps.
- **Redesigned workbench**: Searchable category navigation, advanced-mode filtering, resizable desktop configuration panel, collapsible YAML workspace, and improved mobile navigation.
- **Expanded preset gallery**: Curated backdrop pairings, improved preset thumbnails, reusable custom style presets, and automatic dark-state styling.
- **Extended visual effects**: Aurora, comet, energy charge, neon current, liquid and mesh gradients, plasma, particles, radar/sonar, glitch, frost, heat haze, state morph, progress border, threshold pulse, and more.
- **Effect intensity**: State-aware 25–200% controls adjust each supported effect's defining reach, movement, distortion, corner deformation, ring travel, glow, or border width. Preview and generated YAML share the same amplitude variables.
- **Home Assistant AI Tasks**: Magic Builder can use configured Home Assistant AI providers without reading or storing their credentials, while direct Gemini remains available.
- **Preview tooling**: Dashboard background support, custom image backdrops, a blur-test pattern, layout sizing, zoom controls, and improved state simulation.

### Changed

- **YAML generation and import**: Reworked merged ON/OFF state output, animation keyframes, marquee/progress effects, generated-style round trips, and legacy configuration migration.
- **Picker reliability**: Entity and icon dropdowns render through portals to avoid clipping inside the redesigned workbench.
- **Runtime assets**: Removed the Tailwind CDN dependency from the Home Assistant panel; all required styles ship in the compiled HACS package.
- **Cache busting**: The Home Assistant panel URL continues to derive its cache key from the integration manifest version.

### Upgrade notes

1. Update through HACS and restart Home Assistant.
2. Remove any manually pinned sidebar references to the former builder routes.
3. Open the new **Button Builder** panel and hard-refresh once if an older bundle is cached.
4. Bubble Card and Tile Card configurations already copied to dashboards continue to work; only their visual builders were removed from this integration. Their builders are planned to return as separate integrations.

## [2.2.10] - 2026-03-27

### Fixed
- **HACS metadata validation**: Removed the unsupported `filename` field from `hacs.json` for standard source-code releases so HACS validation accepts the repository metadata.

## [2.2.9] - 2026-03-02

### Fixed
- **hassfest compliance**: Added `CONFIG_SCHEMA` using `cv.config_entry_only_config_schema` to `__init__.py` and added `http` to `dependencies` in `manifest.json` to pass Home Assistant's hassfest validation.
- **hacs.json**: Removed unsupported `images` key.

## [2.2.8] - 2026-03-02

### Changed
- **Brand icons now self-hosted**: Added `brand/` directory inside the integration (`custom_components/button_builder/brand/`) containing `icon.png`, `logo.png`, `dark_icon.png`, and `dark_logo.png`. Starting with Home Assistant 2026.3.0, custom integrations can ship their own brand images directly — no separate brands repository submission required.

## [2.2.7] - 2025-07-21

### Fixed
- **Card Background Color Picker**: Background color and default text color in the Colors & Theming section now correctly update the base card style instead of being routed to state-specific appearance overrides. Previously, picking a background color after disabling Auto Color had no visible effect because the change was stored as an on-state conditional rather than the base card background.

## [1.1.0] - 2025-11-23

### Added
- **Home Assistant Entity Polling**: EntitySelector component with searchable dropdown
- **Template Support**: Dynamic name, label, and icon templates using JavaScript
- **Enhanced Actions**: Service call data, navigation paths, conditional field visibility
- **Confirmation Dialogs**: Require confirmation before executing actions
- **Button Lock**: Lock buttons with custom PIN/code
- **Custom Fields**: Add unlimited custom fields with text or templates
- **Conditional Display**: Show/hide buttons based on entity state conditions
- **Animation Speed Control**: Custom duration for card and icon animations
- **Advanced Typography**: Letter spacing and line height controls
- **Tooltip Support**: Add hover tooltips to buttons
- **Show Units Toggle**: Display entity measurement units
- **Card Opacity**: Global opacity control for entire card
- **Hold Time**: Customizable long-press duration
- **Haptic Feedback**: Mobile vibration feedback option
- **Icon Spin**: Continuous icon rotation with speed control
- **Extra Styles**: Raw CSS injection field for ultimate customization
- **Conditional Operators**: equals, not_equals, above, below, contains
- **fire-dom-event Action**: New action type for custom events

### Enhanced
- **ConfigPanel**: Reorganized into 14 logical sections with conditional fields
- **YAML Generator**: Full support for all new features including templates and custom fields
- **Types**: 30+ new configuration properties with full TypeScript support
- **Animation System**: State-based triggers with customizable speeds
- **Action System**: Service data JSON, navigation paths for all action types

### Improved
- **UI Organization**: Better section grouping and collapsible panels
- **Field Visibility**: Conditional rendering based on selected options
- **Error Handling**: Graceful fallbacks for entity loading
- **Development**: Mock entities for testing without Home Assistant

## [1.0.0] - 2025-11-23

### Added
- Initial release
- Visual button card designer with live preview
- AI-powered button generation using Gemini
- Full support for custom:button-card configuration options
- YAML export functionality
- Glassmorphism and modern styling effects
- Animation support (10+ animation types)
- Layout presets
- Color customization with opacity controls
- Auto color inheritance from entities
- Home Assistant sidebar panel integration
- HACS integration support
