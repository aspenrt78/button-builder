# Project Structure

Button Builder is a Home Assistant custom integration with a React/Vite frontend for designing `custom:button-card` YAML.

```text
button-builder/
├── src/
│   ├── components/        # Editor, preview, pickers, themes, and YAML UI
│   ├── services/          # Home Assistant, AI, dashboard, and icon services
│   ├── shared/            # Save/library/history UI
│   ├── utils/             # State model, themes, validation, YAML import/export
│   ├── ButtonCardApp.tsx  # Main application state and workbench
│   ├── presets.ts         # Built-in style presets
│   └── types.ts           # Canonical configuration schema and defaults
├── custom_components/button_builder/
│   ├── __init__.py        # Static path and sidebar panel registration
│   ├── config_flow.py     # Home Assistant integration setup
│   ├── manifest.json      # Integration metadata and release version
│   └── www/               # Compiled frontend committed for HACS
├── docs/                  # Project and release documentation
├── wiki/                  # Source copies of GitHub wiki pages
├── scripts/               # Local build/deployment helpers
├── hacs.json              # HACS repository metadata
├── package.json           # Frontend package and release version
└── vite.config.ts         # Development and production build configuration
```

## Runtime data flow

```text
ConfigPanel input
    → ButtonConfig + ON/OFF StateAppearance buffers
    → PreviewCard
    → YAML generator
```

Appearance controls are state-specific by default for binary entities. Keys selected in the theme system remain on the base configuration and are shared across states. The preview receives synthetic merged state styles; the YAML generator emits coherent ON/OFF `state:` entries.

## Effect system

`src/utils/effectIntensity.ts` defines which visual effects support intensity and produces their amplitude variables. The same variables are consumed by:

- `src/index.css` for the editor preview
- `src/utils/yamlGenerator.ts` for Home Assistant output
- `src/utils/yamlImporter.ts` for clean round trips

Preview and generated keyframes must remain synchronized.

## AI providers

- `homeAssistantAIService.ts` uses Home Assistant AI Task entities and structured output.
- `geminiService.ts` provides the direct Gemini browser-key option.

Both produce partial `ButtonConfig` values that are validated and merged into the editor.

## Build

```bash
npm install
npm run build
```

Vite writes the production files directly to `custom_components/button_builder/www/`. Those generated assets are part of a HACS release and must be rebuilt after source or version changes.

## Adding a configuration option

1. Update `ButtonConfig` and `DEFAULT_CONFIG` in `src/types.ts`.
2. Add the editor control in `src/components/ConfigPanel.tsx`.
3. Implement preview behavior when applicable.
4. Add YAML generation and import handling.
5. Add preset and AI-schema support when relevant.
6. Update documentation and parity tracking.

## Release checklist

1. Keep versions in `package.json`, `package-lock.json`, and `custom_components/button_builder/manifest.json` identical.
2. Update `docs/CHANGELOG.md` and release notes.
3. Run `npx tsc --noEmit`, `npm run build`, Python compilation, JSON validation, and `git diff --check`.
4. Confirm the compiled assets contain the release version.
5. Commit, create an annotated `vX.Y.Z` tag, push `main` and the tag, then create the GitHub release.
