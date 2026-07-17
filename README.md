<div align="center">
<img width="200" alt="Button Builder" src="https://raw.githubusercontent.com/aspenrt78/button-builder/main/bbthumb.png" />
<img width="600" alt="Button Builder Banner" src="https://raw.githubusercontent.com/aspenrt78/button-builder/main/.github/header.jpg" />
</div>

# 🎨 Button Builder for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/aspenrt78/button-builder.svg)](https://github.com/aspenrt78/button-builder/releases)
[![License](https://img.shields.io/github/license/aspenrt78/button-builder.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/aspenrt78)

---

## 👋 Hey there!

So here's the deal — I built **Button Builder** because I got tired of hand-writing YAML for [custom:button-card](https://github.com/custom-cards/button-card). Don't get me wrong, button-card is amazing, but staring at indentation errors at 2am isn't my idea of a good time.

Button Builder gives you a **visual UI** for designing buttons. Pick your style, set up tap actions, choose icons, define states, tweak colors, add animations — all the fun stuff — and the app spits out the YAML for you. Copy it, paste it into your dashboard, and *boom*: your button looks exactly how you imagined.

Oh, and there's an **AI-powered button creator** too. Just describe what you want — something like *"Give me a button that glows red when the garage is open and pulses blue when it's closed"* — and it'll try to build that YAML for you. Sometimes it nails it. Sometimes it creates a Frankenstein monster. But honestly? That's half the fun.

---

## ⚠️ A Few Honest Disclaimers

- **This thing is nowhere near finished.** I'm sure it's carrying more bugs than a backyard garden.
- **I've literally never coded a day in my life.** Every single line of this project was built through back-and-forth sessions with AI tools. Yes, really.
- **It takes real time (and money) to build** — especially the AI features. If you end up liking the idea and want to support it, my [Buy Me a Coffee](https://www.buymeacoffee.com/aspenrt78) is open and very much appreciated. Totally optional, of course.

---

## 🙏 What I Actually Need Right Now

- **Feedback** — Tell me what works and what doesn't
- **Suggestions** — Features you'd love to see
- **Bug reports** — Things will break, I promise
- **Tips & tricks** — I'm learning as I go
- **Pull requests** — Especially from actual developers who won't cry reading my AI-generated code

If you're into dashboards, custom controls, or you just like experimenting with new toys in Home Assistant, give this a shot and let me know what breaks.

Happy automating — and thanks in advance to anyone willing to play with this thing! 🚀

---

## Version 3 upgrade notice

Version 3 replaces the former Button, Bubble, and Tile sidebar panels with one **Button Builder** panel at `/button-builder`. After updating from v2, restart Home Assistant so it removes the old panel registrations and registers the new route.

Bubble Card, Tile Card, and other builders are planned as separate integrations. Existing YAML already installed on dashboards continues to work; this change only removes those editors from this integration. See the [v3.0.0 release notes](docs/RELEASE_NOTES_3.0.0.md) for the complete migration guide.

## ✨ Features

Button Builder designs cards for [custom:button-card](https://github.com/custom-cards/button-card), which must be installed separately through HACS.

> [!IMPORTANT]
> Version 3 focuses this integration on `custom:button-card`. Bubble Card, Tile Card, and other builders are planned as separate integrations so they can be installed and released independently. Existing YAML already used on dashboards is unaffected.

- 🎯 **State-Aware Visual Editor**: Design ON and OFF appearances independently with a synchronized live preview
- 🤖 **AI-Powered Design**: Use Home Assistant AI Tasks or a direct Gemini API key to generate designs from natural language
- 💾 **Save & Library**: Save designs with folders and tags, search, duplicate, export backups, undo/redo
- 🧩 **Themes & Presets**: Choose global controls, save themes, browse curated style/backdrop pairings, and save custom styles
- 🎨 **Full Style Control**: Colors, gradients, opacity, borders, shadows, glassmorphism effects
- ⚡ **Advanced Effects**: More than two dozen visual effects with state-aware speed, trigger, and 25–200% intensity
- 📐 **Layout Options**: Multiple layout presets for icon, name, state, and label positioning
- 📥 **YAML Import**: Paste existing card YAML to edit it visually
- 📋 **YAML Export**: Copy generated YAML directly to your Home Assistant configuration
- 🔧 **Full Option Coverage**: Comprehensive support for custom:button-card options
- 🖼️ **Dashboard-Aware Preview**: Dashboard/custom backdrops, a blur-test pattern, zoom, and layout sizing
- 📱 **Responsive Workbench**: Resizable desktop panels and dedicated phone navigation

## 📦 Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Integrations"
3. Click the "+" button
4. Search for "Button Builder"
5. Click "Download"
6. Restart Home Assistant
7. Go to Settings → Devices & Services → Add Integration → Search "Button Builder"
8. The **Button Builder** panel appears in your sidebar

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/aspenrt78/button-builder/releases)
2. Extract the `button_builder` folder from the archive
3. Copy it to your Home Assistant `custom_components` directory:
   ```
   config/
   └── custom_components/
       └── button_builder/
   ```
4. Restart Home Assistant
5. Go to Settings → Devices & Services → Add Integration → Search "Button Builder"
6. The **Button Builder** panel appears in your sidebar

## 🚀 Usage

### Basic Workflow

1. Click **Button Builder** in your Home Assistant sidebar
2. Use the left panel to configure your button:
   - Set entity ID, name, icon, and label
   - Choose layout and visibility options
   - Customize colors, borders, shadows, and typography
   - Add animations and configure tap actions
3. View the live preview in the center canvas
4. Copy the generated YAML from the right panel
5. Paste into your Lovelace dashboard configuration

### AI Magic Builder

1. Click the "Magic Build" button in the top right
2. Choose **Home Assistant AI** to use an existing AI Task provider without exposing its credentials, or choose **Gemini** for a direct browser-stored API key.
3. If using Gemini for the first time, enter your API key:
   - Click the link to [Google AI Studio](https://aistudio.google.com/apikey)
   - Create a free API key (takes 30 seconds)
   - Paste it into the app — it's kept only for your current browser session, never sent anywhere except Google's API
4. Describe your ideal button in plain English:
   - Example: *"A futuristic cyan button for a bedroom fan that glows when on"*
   - Example: *"Glassmorphism style button for living room lights with purple accent"*
   - Example: *"Minimal dark button for garage door with red color when open"*
5. Click "Generate Design"
6. Fine-tune the generated configuration using the visual editor if needed

> **Note**: Your API key is stored in your browser's localStorage and never leaves your device. You can manage or remove it by clicking the key icon in the Magic Builder dialog.

### Prerequisites

**Important**: This tool generates YAML for the [custom:button-card](https://github.com/custom-cards/button-card) integration. You must install button-card separately through HACS or manually.

**For AI Features**: Configure a Home Assistant AI Task provider or supply a direct Gemini API key. AI is optional; the visual editor works without it.

## 🎨 Design Features

### Styling Options
- **Colors**: Background, text, icon, name, state, label colors with opacity control
- **Auto Colors**: Automatically inherit entity colors (lights, switches, etc.)
- **Glassmorphism**: Backdrop blur effects with transparency
- **Shadows**: Multiple shadow sizes with custom colors and opacity
- **Borders**: Solid, dashed, dotted, double, and groove styles
- **Typography**: Font size, weight, and text transform options

### Layout Presets
- Vertical (icon + name)
- Icon + Name + State
- Icon + State + Name (2nd line)
- Icon + Label
- Name + State
- And more...

### Animations
Choose from motion and visual effects for the card and icon:
- Core motion: flash, pulse, spin, shake, bounce, float, swing, wobble, breathe, and ripple
- Visual effects: liquid and mesh gradients, energy charge, neon current, plasma, particles, radar/sonar, glitch, frost, heat haze, state morph, and more
- Trigger effects by state or continuously, set their duration, and adjust defining intensity from 25–200%

### Actions
- **Tap Action**: toggle, more-info, call-service, navigate, url, none
- **Hold Action**: Long-press actions
- **Double Tap Action**: Quick double-tap actions

## 🛠️ Development

### Run Locally

**Prerequisites**: Node.js 18+ and npm

1. Clone the repository:
   ```bash
   git clone https://github.com/aspenrt78/button-builder.git
   cd button-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. ~~Set up your Gemini API key (optional, for AI features):~~
   ~~- Create a `.env.local` file~~
   ~~- Add: `GEMINI_API_KEY=your_api_key_here`~~
   
   *Note: API keys are now entered directly in the app UI — no environment setup needed!*

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

The built files will be output to `custom_components/button_builder/www/`

## 📁 Project Structure

```
button-builder/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── shared/             # Shared UI (library, save modal, history)
│   └── assets/             # Images & assets
├── docs/                   # Documentation
├── scripts/                # Build & deploy scripts
├── wiki/                   # GitHub wiki pages
├── custom_components/      # Home Assistant integration
│   └── button_builder/
│       └── www/            # Built frontend files
└── brands_submission/      # HACS brand assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- Built with React, TypeScript, and Vite
- AI powered by Google Gemini
- Designed for [custom:button-card](https://github.com/custom-cards/button-card) by [@RomRider](https://github.com/RomRider)
- Icons by [Lucide](https://lucide.dev)

## 🐛 Issues & Support

If you encounter any issues or have questions, please [open an issue](https://github.com/aspenrt78/button-builder/issues) on GitHub.

---

## ☕ Support the Project

If you find this tool useful, consider buying me a coffee! It helps keep the project maintained and motivates new features.

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg?style=for-the-badge&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/aspenrt78)

---

<div align="center">
Made with ❤️ for the Home Assistant community
</div>
