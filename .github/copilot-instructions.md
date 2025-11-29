# Button Builder - AI Agent Instructions

## Project Overview
Button Builder is a **Home Assistant custom integration** that provides a visual UI for designing `custom:button-card` YAML configurations. It's a React/TypeScript frontend embedded in HA via iframe panel.

## Architecture

### Dual-Layer Structure
1. **Frontend (React/Vite)**: `App.tsx`, `components/`, `services/`, `utils/`
2. **HA Integration (Python)**: `custom_components/button_builder/` - registers sidebar panel

### Key Data Flow
```
User Input → ConfigPanel → ButtonConfig state → yamlGenerator.ts → YAML Output
                              ↓
                         PreviewCard (live preview)
```

### Critical Files
- **`types.ts`**: `ButtonConfig` interface (~100+ properties) - the single source of truth
- **`App.tsx`**: Main state management, preset handling, import/export
- **`utils/yamlGenerator.ts`**: Converts `ButtonConfig` → button-card YAML (1300+ lines)
- **`presets.ts`**: 80+ style presets with `Partial<ButtonConfig>` configs
- **`services/geminiService.ts`**: AI generation with structured schema output

## Development Workflow

### Commands
```bash
npm run dev      # Local dev server at localhost:3000
npm run build    # Build to custom_components/button_builder/www/
```

### Version Bump Checklist (CRITICAL)
When releasing, update version in **BOTH**:
1. `package.json` → `"version"`
2. `custom_components/button_builder/manifest.json` → `"version"`

Cache busting uses `manifest.json` version + timestamp, so mismatched versions cause stale cache issues.

### Release Process
```bash
npm run build
git add -A && git commit -m "message"
git tag vX.Y.Z && git push origin main --tags
gh release create vX.Y.Z --title "vX.Y.Z" --notes "..." --latest
```

## Code Patterns

### State Management
- `isApplyingPresetRef` uses `useRef` (not `useState`) to avoid React batching race conditions
- `setConfig` wrapper auto-clears `activePreset` when user modifies config manually
- Config persists to `localStorage` with key `button-builder-config`

### Adding New ButtonConfig Properties
1. Add to `ButtonConfig` interface in `types.ts`
2. Add default value to `DEFAULT_CONFIG` in `types.ts`
3. Add UI control in `components/ConfigPanel.tsx`
4. Handle in `utils/yamlGenerator.ts` to output correct YAML
5. Add to AI schema in `services/geminiService.ts` if AI should generate it

### Preset Structure
```typescript
// presets.ts
{
  name: 'Preset Name',
  description: 'Short description',
  category: 'minimal' | 'glass' | 'neon' | 'gradient' | 'animated' | '3d' | 'cyberpunk' | 'retro' | 'nature' | 'icon-styles' | 'custom',
  config: Partial<ButtonConfig>  // Only override properties, rest use defaults
}
```

### YAML Generation Pattern
```typescript
// yamlGenerator.ts - only output non-default values
if (config.propertyName !== DEFAULT_CONFIG.propertyName) {
  yaml += `property_name: ${config.propertyName}\n`;
}
```

## Common Pitfalls

1. **Removing props/state**: Search ALL `.tsx` files for references before removing - leftover references cause runtime crashes (not caught by build)
2. **HA caching**: After HACS update, users need: Restart HA + hard refresh browser (Ctrl+Shift+R)
3. **Panel registration**: Uses 2-second delay in `__init__.py` to ensure HA frontend is ready
4. **Tailwind in production**: Uses CDN (`cdn.tailwindcss.com`) - expected console warning

## Testing in Home Assistant

The panel runs inside HA's iframe sandbox. To test locally with HA APIs:
- Panel URL: `/button_builder/panel.html?v={version}`
- Static assets served from `/button_builder/`
- Auth token read from `localStorage.hassTokens`

## File Relationships
```
ButtonConfig (types.ts)
    ├── ConfigPanel.tsx (UI inputs)
    ├── PreviewCard.tsx (live preview)
    ├── yamlGenerator.ts (YAML output)
    ├── geminiService.ts (AI schema)
    └── presets.ts (preset configs)
```
