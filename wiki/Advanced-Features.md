# Advanced Features

## Magic Builder (AI)

Generate button configurations using natural language descriptions.

### Setup
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **Magic Build** in Button Builder
3. Enter your API key (stored locally in your browser)

### Usage
Describe your button in plain English:
- "A glowing cyan button for my bedroom fan that pulses when on"
- "Minimal dark button for garage door with large icon"
- "Glassmorphism style media player with album art"

## Custom Fonts

Use any Google Font:

1. Visit [fonts.google.com](https://fonts.google.com)
2. Select a font → Get embed code → Copy the URL
3. In Typography section:
   - **Font Name**: Exact font name (e.g., `Orbitron`)
   - **Google Fonts URL**: The embed URL

## Templates (JavaScript)

Use JavaScript templates for dynamic values:

### Name Template
```javascript
[[[ return entity.state === 'on' ? 'Active' : 'Inactive' ]]]
```

### Label Template
```javascript
[[[ return entity.attributes.temperature + '°C' ]]]
```

### Icon Template
```javascript
[[[ return entity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off' ]]]
```

## Variables

Define reusable values for templates:

| Variable | Value |
|----------|-------|
| `my_color` | `#ff5500` |
| `threshold` | `50` |

Use in templates:
```javascript
[[[ return variables.my_color ]]]
```

## State Styles

Create conditional styling based on entity state:

1. Add a State Style rule
2. Set **Operator**: equals, not_equals, above, below, regex
3. Set **Value**: The state to match
4. Configure styling for that state

### Operators

| Operator | Description | Example |
|----------|-------------|---------|
| equals | Exact match | `on`, `playing` |
| not_equals | Does not match | `!= off` |
| above | Greater than (numeric) | `> 50` |
| below | Less than (numeric) | `< 20` |
| regex | Pattern match | `play.*` |
| template | JavaScript condition | `[[[ return ... ]]]` |

## Trigger Entity

Use a different entity to trigger state changes than the main entity:

Useful for:
- Buttons that control one entity but show state of another
- Multi-entity controls

## Extra Styles (Raw CSS)

Add custom CSS that isn't available in the UI:

```yaml
card:
  - background: linear-gradient(45deg, red, blue)
  - transform: skewX(-5deg)
icon:
  - filter: drop-shadow(0 0 10px gold)
```

## Import YAML

Import existing button-card configurations:

1. Click **Import** in header
2. Paste your existing YAML
3. Button Builder parses and loads the settings
4. Modify as needed in the visual editor
