# Actions & Interactions

Configure what happens when users interact with your button.

## Action Types

| Action | Description |
|--------|-------------|
| **none** | No action |
| **toggle** | Toggle entity on/off |
| **more-info** | Open entity details dialog |
| **call-service** | Call a Home Assistant service |
| **navigate** | Navigate to another dashboard/view |
| **url** | Open external URL |
| **assist** | Open voice assistant |

## Interaction Methods

### Tap Action
Triggered by a single tap/click.

**Default**: `toggle`

### Hold Action  
Triggered by pressing and holding.

**Default**: `more-info`

Options:
- **Repeat**: Execute action repeatedly while holding
- **Repeat Limit**: Maximum repeats

### Double Tap Action
Triggered by tapping twice quickly.

**Default**: `none`

### Press/Release Actions
Momentary actions triggered on press down and release up.

Useful for:
- PTT (push-to-talk) systems
- Momentary switches
- Gaming-style controls

## Configuring Actions

### Toggle (Default)
Simply toggles the entity between on/off states.

```yaml
tap_action:
  action: toggle
```

### Call Service
Execute any Home Assistant service:

**Service Data** format:
```yaml
service: light.turn_on
data:
  brightness: 255
  color_name: blue
```

### Navigate
Go to another view or dashboard:

**Navigation Path**: `/lovelace/bedroom` or `/config`

### URL
Open an external link:

**URL**: `https://example.com`

### JavaScript
Execute custom JavaScript (advanced):

```javascript
// Toggle and show notification
hass.callService('light', 'toggle', {entity_id: 'light.living_room'});
alert('Light toggled!');
```

## Icon-Specific Actions

You can configure separate actions for when users tap specifically on the icon:

- Icon Tap Action
- Icon Hold Action
- Icon Double Tap Action
- Icon Press/Release Actions

## Confirmation Dialog

Add a confirmation prompt before executing an action:

1. Enable **Confirmation**
2. Set **Confirmation Text**: "Are you sure?"
3. Optionally add **Exemptions** (users who skip confirmation)

## Lock Feature

Require an unlock action before the button works:

| Option | Description |
|--------|-------------|
| **Duration** | How long button stays unlocked (seconds) |
| **Unlock Method** | tap, hold, or double_tap |
| **Lock/Unlock Icons** | Custom icons for locked/unlocked states |

## Haptic Feedback

Enable vibration feedback on mobile devices when button is pressed.
