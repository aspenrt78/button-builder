# Shared Button Library

Button Builder stores saved designs in Home Assistant's built-in frontend system
store. The store is shared across the Home Assistant instance, persists in
`.storage`, and publishes live updates to subscribers.

## WebSocket contract

- Key: `button_builder_library`
- Read: `frontend/get_system_data`
- Write: `frontend/set_system_data` (administrator only)
- Subscribe: `frontend/subscribe_system_data`

The value uses a versioned envelope:

```json
{
  "button_builder_library": 1,
  "migration_complete": true,
  "presets": {
    "button-123": {
      "slug": "button-123",
      "name": "Neon Tile",
      "kind": "button",
      "layers": [
        {
          "groups": {
            "button_style": "solid",
            "button_border_enabled": true,
            "button_border_width": 1,
            "button_border_color": "#39d0ff",
            "button_border_color_mode": "fixed",
            "button_border_sides": ["top", "bottom", "left", "right"]
          }
        }
      ],
      "button_builder": {
        "record_version": 1,
        "record": {}
      }
    }
  }
}
```

## Interoperable fields

Each preset follows the shared button-style stack shape:

- `slug`: stable record identifier and preset key
- `name`: display name
- `kind`: always `button`
- `note`: optional folder/tag summary
- `layers`: ordered appearance layers
- `layers[].groups`: complete owned appearance groups
- `layers[].when`: optional `button_active` or `button_off` condition
- `layers[].label`: optional display label

Button Builder publishes the background, border, glow, shadow, text, icon, and
sizing groups. The shared background model describes the style mode
(`solid`, `tinted`, or `transparent`); destination cards retain their own display
color. The full Button Builder design remains available in the namespaced
`button_builder` payload and can be ignored by other consumers.

## Migration behavior

On the first administrator load, Button Builder copies records from the legacy
`button-builder-saved-buttons` browser key into the system library. Once the
envelope carries `migration_complete: true`, system storage is authoritative,
including when its preset collection is empty. Unknown presets without a
`button_builder` payload are preserved during Button Builder writes.

Standalone development and environments without an accessible Home Assistant
connection continue to use browser storage.
