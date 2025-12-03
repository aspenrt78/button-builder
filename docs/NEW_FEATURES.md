# 🎉 New Features Added

## Summary

Your Button Card Architect has been significantly enhanced with extensive customization options and Home Assistant integration features!

## ✨ New Features

### 1. **Home Assistant Entity Polling** 🔌
- **EntitySelector Component**: Dropdown with searchable entity list
- **Automatic Detection**: Detects when running inside Home Assistant
- **Mock Data**: Provides realistic mock entities for development
- **Real-time Fetching**: Polls HA API for available entities when deployed
- **Smart Search**: Filter entities by ID, name, or domain
- **Domain Colors**: Visual coding for different entity types (lights, switches, etc.)

### 2. **Template Support** 📝
- **Name Template**: Dynamic names using JavaScript templates
- **Label Template**: Dynamic labels with entity attribute access
- **Icon Template**: Conditional icons based on state
- **Syntax**: `[[[ return entity.state ]]]`
- **Use Cases**: 
  - Show temperature: `[[[ return entity.attributes.temperature + '°C' ]]]`
  - Conditional icons: `[[[ return entity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off' ]]]`

### 3. **Enhanced Actions** 🎯
- **Service Call Data**: JSON configuration for service calls
- **Navigation Paths**: Custom navigation/URL for all action types
- **Conditional Action Fields**: Show relevant fields based on action type
- **Supported Actions**:
  - `toggle` - Toggle entity state
  - `more-info` - Show entity more-info dialog
  - `call-service` - Call any HA service with data
  - `navigate` - Navigate to HA path
  - `url` - Open URL
  - `assist` - Open HA Assist
  - `fire-dom-event` - Fire custom DOM event
  - `none` - No action

### 4. **Confirmation & Security** 🔒
- **Confirmation Dialogs**: Require confirmation before actions
- **Custom Confirmation Text**: Personalized confirmation messages
- **Button Lock**: Require code to unlock button
- **Lock Code**: Custom PIN/code for locked buttons
- **Exemptions**: Conditional exemptions from confirmation

### 5. **Custom Fields** 🎨
- **Add Multiple Fields**: Unlimited custom fields
- **Text or Template**: Static text or dynamic templates
- **Custom Styling**: Per-field style customization
- **Use Cases**:
  - Additional sensor values
  - Status indicators
  - Custom labels or badges

### 6. **Conditional Display** ⚡
- **Entity-Based Conditions**: Show button based on entity state
- **Operators**:
  - `equals` (=) - Exact match
  - `not_equals` (≠) - Not equal
  - `above` (>) - Numeric comparison
  - `below` (<) - Numeric comparison
  - `contains` - String contains
- **Use Cases**:
  - Show garage button only when door is open
  - Display warning button when temperature is high

### 7. **Enhanced Animations** 🌀
- **Animation Speed Control**: Custom duration for each animation
- **Card Animation Speed**: Separate control for card animations
- **Icon Animation Speed**: Separate control for icon animations
- **State-Based Triggers**: Enhanced condition system
  - `always` - Run continuously
  - `on` - Only when entity is ON
  - `off` - Only when entity is OFF

### 8. **Advanced Typography** ✍️
- **Letter Spacing**: Control character spacing
- **Line Height**: Control line spacing
- **More Granular Control**: Fine-tune text appearance
- **CSS Values**: Support for px, em, rem, etc.

### 9. **Tooltip Support** 💬
- **Hover Text**: Add tooltips to buttons
- **Custom Messages**: Any text or template
- **Built-in HA Feature**: Native Home Assistant tooltip

### 10. **Additional Toggles** 👁️
- **Show Units**: Display entity measurement units
- **More Control**: Granular visibility options

### 11. **Advanced Settings** ⚙️
- **Card Opacity**: Global opacity for entire card (0-100%)
- **Hold Time**: Customize long-press duration (ms)
- **Haptic Feedback**: Enable vibration on mobile
- **Icon Spin**: Continuous icon rotation (for fans, etc.)
- **Spin Duration**: Control rotation speed
- **Extra Styles**: Raw CSS injection for ultimate customization

### 12. **Extra Styles Field** 🎨
- **Raw CSS Input**: Inject custom CSS directly
- **Multi-line Editor**: Textarea for complex styles
- **Direct YAML Output**: Styles added to YAML output
- **Ultimate Flexibility**: Override any style
- **Example**:
  ```yaml
  card:
    - background: linear-gradient(...)
  icon:
    - transform: rotate(45deg)
  ```

## 📊 Statistics

**New Configuration Options**: 30+
**New Components**: 2 (EntitySelector, Enhanced ConfigPanel)
**New Services**: 1 (HomeAssistantService)
**Enhanced Sections**: 14
**Lines of Code Added**: ~1,500+

## 🔄 Updated Components

### ConfigPanel
- 14 configuration sections (was 10)
- Entity selector integration
- Conditional field visibility
- Custom fields management UI
- Advanced settings panel

### Types (types.ts)
- `ButtonConfig` interface: 30+ new properties
- `CustomField` interface
- `Confirmation` interface
- Enhanced type safety

### YAML Generator
- Support for all new options
- Template handling
- Custom fields export
- Conditional display
- Enhanced action configuration
- Extra styles integration

### Constants
- New `CONDITIONAL_OPERATORS` array
- Updated `ACTION_OPTIONS` with `fire-dom-event`

## 🎯 Key Benefits

1. **Maximum Flexibility**: Nearly every button-card feature is now supported
2. **Entity Integration**: Seamless HA entity browsing and selection
3. **Professional Features**: Confirmations, locks, tooltips, conditions
4. **Power User Options**: Templates, custom fields, extra styles
5. **Better UX**: Conditional field visibility, organized sections
6. **Future-Proof**: Easy to extend with more features

## 🚀 Usage Examples

### Entity Polling
```typescript
// Automatically loads when component mounts
<EntitySelector 
  value={config.entity} 
  onChange={(v) => update('entity', v)} 
/>
```

### Template Example
```javascript
Name Template: [[[ return entity.attributes.friendly_name.toUpperCase() ]]]
Label Template: [[[ return entity.state + ' for ' + entity.attributes.duration ]]]
Icon Template: [[[ return entity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off' ]]]
```

### Custom Field Example
```yaml
custom_fields:
  temperature: "[[[ return entity.attributes.temperature + '°C' ]]]"
  humidity: "[[[ return entity.attributes.humidity + '%' ]]]"
```

### Conditional Display Example
```yaml
conditions:
  - entity: binary_sensor.garage_door
    state: open
    operator: equals
```

### Service Call Example
```json
{
  "service": "light.turn_on",
  "service_data": {
    "brightness": 255,
    "color_temp": 400
  }
}
```

## 📝 What's Generated in YAML

All new features are properly exported to button-card YAML:
- ✅ Templates (name, label, icon)
- ✅ Custom fields
- ✅ Conditions
- ✅ Confirmation dialogs
- ✅ Lock configuration
- ✅ Tooltips
- ✅ Show units
- ✅ Hold time
- ✅ Haptic feedback
- ✅ Animation speeds
- ✅ Typography (letter-spacing, line-height)
- ✅ Card opacity
- ✅ Icon spin
- ✅ Extra styles
- ✅ Enhanced actions with service data

## 🎨 UI Improvements

- **Collapsible Sections**: All settings organized in expandable sections
- **Conditional Fields**: Only show relevant fields (e.g., service data when action is call-service)
- **Visual Feedback**: Icons, colors, and hover states
- **Better Organization**: 14 logical sections
- **Improved Labels**: Clear, concise labels with context
- **Smart Defaults**: Sensible default values for all new options

## 🔧 Technical Improvements

- **Type Safety**: Full TypeScript support for all new features
- **Error Handling**: Graceful fallbacks for API failures
- **Mock Data**: Development-friendly entity mocking
- **Modular Code**: Clean separation of concerns
- **Performance**: Efficient entity loading and filtering

## 📦 Build Output

```
✓ Build successful!
custom_components/button_builder/www/index.js: 485.20 kB (gzipped: 118.86 kB)
```

Everything compiles cleanly with no errors! 🎉

## 🎓 Next Steps

1. **Test the Entity Selector**: Open the app and try selecting entities
2. **Experiment with Templates**: Try dynamic names and labels
3. **Add Custom Fields**: Create buttons with multiple data points
4. **Try Conditions**: Make buttons that only appear in certain states
5. **Use Confirmations**: Add safety to destructive actions
6. **Customize Further**: Use extra styles for advanced CSS

---

Your Button Card Architect is now a comprehensive, professional-grade tool with nearly complete button-card feature coverage! 🚀
