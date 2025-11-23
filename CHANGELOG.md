# Changelog

All notable changes to this project will be documented in this file.

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
