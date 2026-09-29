# What's New

## Version 3.1.0

Version 3.1 moves saved button designs into Home Assistant's shared system
storage. Libraries now synchronize across browsers and sessions, update live,
and expose compatible layered button-style presets that other cards can read.
Existing browser-saved designs migrate automatically the first time an
administrator opens the updated builder.

Button Builder is now an administrator-only panel, matching Home Assistant's
permissions for editing dashboards and writing shared system data. Standalone
development continues to use browser storage as a fallback.

Update through HACS and restart Home Assistant. Open Button Builder once in the
browser that holds your existing saved designs to migrate them, then hard-refresh
the panel if an older frontend bundle remains cached.

## Version 3.0.4

Version 3.0.4 adds a persistent light interface mode to Button Builder. Use the
Light/Dark control in the desktop toolbar or mobile menu to switch the complete
builder interface, including dialogs and the icon picker. The card preview
continues to show the colors configured for the button itself.

Update through HACS, restart Home Assistant, and hard-refresh the Button Builder
panel if an older frontend bundle remains cached.

## Version 3.0.3

Version 3.0.3 fixes animated backgrounds supplied by style presets. Holographic,
Lava Lamp, Scanner, Liquid Gradient, Plasma, and related presets now retain
their animation when Button Builder merges ON and OFF state appearances.

Update through HACS (or replace the manual integration files), restart Home
Assistant, and hard-refresh the Button Builder panel if an older frontend
bundle remains cached.

## Version 3.0

Version 3 introduces:

- Independent ON and OFF appearance editing
- Reusable themes and custom style presets
- Curated preset and dashboard-backdrop pairings
- More than two dozen effects with effect-specific intensity controls
- Home Assistant AI Task providers and direct Gemini generation
- YAML import/export and a dashboard-aware preview workbench

### Important upgrade change

The former `/button-card-builder`, `/bubble-card-builder`, and
`/tile-card-builder` routes were replaced by a single `/button-builder` panel.
Restart Home Assistant after upgrading so it removes the old panel
registrations. Remove any manually pinned sidebar links that still point to an
old route.

Version 3 focuses this integration on `custom:button-card`. Existing Bubble
Card and Tile Card YAML on dashboards is unaffected; only those visual editors
were removed from Button Builder.

For the full history, see the
[project changelog](https://github.com/aspenrt78/button-builder/blob/main/docs/CHANGELOG.md)
and [GitHub releases](https://github.com/aspenrt78/button-builder/releases).
