# Project Structure

```
button-builder/
├── 📁 .github/
│   ├── copilot-instructions.md    # AI assistant instructions
│   └── workflows/
│       └── validate.yaml          # HACS validation workflow
│
├── 📁 src/                        # Source code
│   ├── 📁 components/             # React components
│   │   ├── ConfigPanel.tsx        # Left sidebar configuration panel
│   │   ├── ConfigPanelNav.tsx     # Config panel navigation
│   │   ├── ControlInput.tsx       # Reusable input components
│   │   ├── EntitySelector.tsx     # Entity selection component
│   │   ├── GridDesigner.tsx       # Visual grid layout designer
│   │   ├── IconPicker.tsx         # Visual icon picker
│   │   ├── MagicBuilder.tsx       # AI prompt modal
│   │   ├── PreviewCard.tsx        # Live button preview
│   │   └── YamlViewer.tsx         # YAML output viewer
│   │
│   ├── 📁 services/
│   │   ├── dashboardService.ts    # Dashboard API integration
│   │   ├── geminiService.ts       # Gemini AI integration
│   │   ├── homeAssistantService.ts # Home Assistant API
│   │   └── iconMapper.ts          # Icon mapping utilities
│   │
│   ├── 📁 utils/
│   │   ├── yamlGenerator.ts       # YAML generation logic
│   │   └── yamlImporter.ts        # YAML import/parsing
│   │
│   ├── 📁 bubble-card/            # Bubble Card builder (beta)
│   │   ├── BubbleCardApp.tsx      # Main Bubble Card app
│   │   ├── components/            # Bubble Card components
│   │   ├── utils/                 # Bubble Card utilities
│   │   ├── types.ts               # Bubble Card types
│   │   ├── constants.ts           # Bubble Card constants
│   │   └── presets.ts             # Bubble Card presets
│   │
│   ├── 📁 assets/                 # Images & static assets
│   │   └── logo.png
│   │
│   ├── 📄 App.tsx                 # Main app router
│   ├── 📄 ButtonCardApp.tsx       # Button Card main component
│   ├── 📄 index.tsx               # React entry point
│   ├── 📄 index.html              # HTML template
│   ├── 📄 index.css               # Global styles and animations
│   ├── 📄 types.ts                # TypeScript interfaces
│   ├── 📄 constants.ts            # UI constants and options
│   └── 📄 presets.ts              # Style presets library
│
├── 📁 docs/                       # Documentation
│   ├── CHANGELOG.md               # Version history
│   ├── CONTRIBUTING.md            # Contribution guidelines
│   ├── INSTALLATION.md            # Installation guide
│   ├── NEW_FEATURES.md            # New features documentation
│   ├── PROJECT_STRUCTURE.md       # This file
│   ├── QUICKSTART.md              # Quick start guide
│   └── SETUP_COMPLETE.md          # Setup completion guide
│
├── 📁 scripts/                    # Build & deploy scripts
│   ├── build.ps1                  # Build script for Windows
│   ├── deploy-files.ps1           # File deployment script
│   └── deploy-local.ps1           # Local deployment script
│
├── 📁 wiki/                       # GitHub wiki pages
│   ├── Home.md
│   ├── _Sidebar.md
│   └── ...
│
├── 📁 custom_components/          # Home Assistant integration
│   └── button_builder/
│       ├── __init__.py            # Integration setup and panel registration
│       ├── config_flow.py         # Configuration flow
│       ├── manifest.json          # Integration metadata
│       ├── strings.json           # String translations
│       ├── 📁 translations/       # Localization files
│       ├── 📁 icons/              # Integration icons
│       └── 📁 www/                # Built frontend assets (generated)
│           ├── panel.html         # Panel wrapper HTML
│           ├── index.js           # Compiled React app
│           └── index.css          # Compiled styles
│
├── 📁 brands_submission/          # HACS brand assets
│   └── custom_integrations/
│       └── button_builder/
│           ├── icon.png
│           ├── logo.png
│           ├── dark_icon.png
│           └── dark_logo.png
│
├── 📄 vite.config.ts              # Vite build configuration
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 package.json                # NPM dependencies and scripts
├── 📄 hacs.json                   # HACS integration metadata
├── 📄 README.md                   # Main documentation
├── 📄 LICENSE                     # MIT License
└── 📄 .gitignore                  # Git ignore rules
```

## Key Directories

### `/src/`
All source code lives here:

- **`components/`**: React components that make up the UI
- **`services/`**: Backend service integrations (AI, Home Assistant API)
- **`utils/`**: Utility functions (YAML generation, parsing)
- **`bubble-card/`**: Separate Bubble Card builder feature
- **`assets/`**: Static images and assets

### `/custom_components/button_builder/`
This is the Home Assistant integration. When installed, this entire folder goes into your HA `custom_components` directory.

- **`__init__.py`**: Registers the panel in Home Assistant's sidebar
- **`manifest.json`**: Defines integration metadata (name, version, dependencies)
- **`www/`**: Contains the built frontend (generated by `npm run build`)

### `/docs/`
Documentation files:

- **CHANGELOG.md**: Version history
- **INSTALLATION.md**: Detailed installation guide
- **QUICKSTART.md**: Quick start guide
- **CONTRIBUTING.md**: Contribution guidelines

### `/scripts/`
Build and deployment scripts:

- **build.ps1**: Windows build script
- **deploy-local.ps1**: Local deployment for testing

### `/wiki/`
GitHub wiki pages for user documentation.

### `/brands_submission/`
Brand assets for HACS integration listing (icon, logo, dark variants).

## Build Process

### Development
```bash
npm run dev
```
- Starts Vite dev server on port 3000
- Hot reload enabled
- Source files in `/src/`

### Production
```bash
npm run build
```
- Compiles React app with Vite
- Outputs to `custom_components/button_builder/www/`
- Bundles as `index.js` and `index.css`
- Ready for Home Assistant integration

## Data Flow

```
User Input (ConfigPanel)
    ↓
ButtonConfig State (ButtonCardApp.tsx)
    ↓
Live Preview (PreviewCard) + YAML Output (YamlViewer)
```

### AI Flow
```
User Prompt (MagicBuilder)
    ↓
Gemini API (geminiService)
    ↓
ButtonConfig (partial)
    ↓
Merged into App State
    ↓
Preview + YAML Update
```

## Configuration Object

The core `ButtonConfig` interface (in `types.ts`) defines all button properties:
- Core: entity, name, icon, label
- Layout: size, aspect ratio, padding
- Colors: background, text, element-specific colors
- Effects: blur, shadows, borders
- Animations: card and icon animations
- Actions: tap, hold, double-tap
- Custom Fields: grid-based layout with custom styling

This single object drives both the preview and YAML generation.

## Home Assistant Integration

When HA loads the integration:
1. `__init__.py` registers a static path `/button_builder/`
2. Registers an iframe panel in the sidebar
3. Panel loads `panel.html`
4. `panel.html` loads `index.js` (the compiled React app)
5. User designs buttons and copies YAML to dashboard

## File Naming Conventions

- **`.tsx`**: React components (TypeScript + JSX)
- **`.ts`**: TypeScript utilities and services
- **`.py`**: Python Home Assistant integration
- **`.json`**: Configuration and manifest files
- **`.md`**: Documentation in Markdown
- **`.yaml`**: GitHub workflows

## Adding New Features

### New Configuration Option
1. Add to `ButtonConfig` interface in `src/types.ts`
2. Add to `DEFAULT_CONFIG` constant
3. Add control in `src/components/ConfigPanel.tsx`
4. Update preview logic in `src/components/PreviewCard.tsx`
5. Update YAML generation in `src/utils/yamlGenerator.ts`

### New Component
1. Create `.tsx` file in `src/components/`
2. Import and use in appropriate parent component
3. Update types if needed

### New AI Feature
1. Update schema in `src/services/geminiService.ts`
2. Update prompt engineering
3. Test with various inputs

## Testing

### Local Development
- Run `npm run dev`
- Test all features in browser
- Check console for errors

### Home Assistant Testing
1. Build: `npm run build`
2. Copy `custom_components/button_builder` to HA config
3. Restart HA
4. Test in HA panel
5. Check HA logs for errors

## Release Checklist

- [ ] Update version in `package.json`
- [ ] Update version in `manifest.json`
- [ ] Update `CHANGELOG.md`
- [ ] Run `npm run build`
- [ ] Test in Home Assistant
- [ ] Commit all changes
- [ ] Create git tag: `git tag vX.Y.Z`
- [ ] Push with tags: `git push --tags`
- [ ] Create GitHub release
