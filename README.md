<div align="center">
<img width="1920" height="500" alt="Button Builder Banner" src="https://raw.githubusercontent.com/aspenrt78/button-builder/main/.github/header.jpg" />
</div>

# 🎨 Button Builder for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/aspenrt78/button-builder.svg)](https://github.com/aspenrt78/button-builder/releases)
[![License](https://img.shields.io/github/license/aspenrt78/button-builder.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/aspenrt78)

A visual designer for Home Assistant's [custom:button-card](https://github.com/custom-cards/button-card) integration. Design your buttons visually with live preview, or use AI to generate designs from natural language descriptions, then export the YAML configuration.

## ✨ Features

- 🎯 **Visual Editor**: Real-time preview as you configure your button cards
- 🤖 **AI-Powered Design**: Generate complete button configurations from natural language descriptions
- 🎨 **Full Style Control**: Colors, gradients, opacity, borders, shadows, glassmorphism effects
- ⚡ **Animations**: 10+ animation types (pulse, flash, spin, shake, bounce, etc.)
- 📐 **Layout Options**: Multiple layout presets for icon, name, state, and label positioning
- 📋 **YAML Export**: Copy generated YAML directly to your Home Assistant configuration
- 🔧 **All button-card Features**: Comprehensive support for custom:button-card options

## 📦 Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Integrations"
3. Click the "+" button
4. Search for "Button Builder"
5. Click "Download"
6. Restart Home Assistant
7. The "Button Architect" panel will appear in your sidebar

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/aspenrt78/button-builder/releases)
2. Extract the `button_card_architect` folder from the archive
3. Copy it to your Home Assistant `custom_components` directory:
   ```
   config/
   └── custom_components/
       └── button_card_architect/
   ```
4. Restart Home Assistant
5. The "Button Architect" panel will appear in your sidebar

## 🚀 Usage

### Basic Workflow

1. Click "Button Architect" in your Home Assistant sidebar
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
2. Describe your ideal button in plain English:
   - Example: *"A futuristic cyan button for a bedroom fan that glows when on"*
   - Example: *"Glassmorphism style button for living room lights with purple accent"*
   - Example: *"Minimal dark button for garage door with red color when open"*
3. Click "Generate Design"
4. The AI will create a complete button configuration matching your description
5. Fine-tune the design using the visual editor if needed

### Prerequisites

**Important**: This tool generates YAML for the [custom:button-card](https://github.com/custom-cards/button-card) integration. You must install button-card separately through HACS or manually.

**For AI Features**: Set up a Gemini API key:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Configure it in the integration settings or as an environment variable

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
Choose from 10+ animations for both the card and icon:
- Flash, Pulse, Jiggle, Marquee, Spin, Blink, Shake, Bounce, Rotate
- Trigger animations based on state (on/off) or run continuously

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

3. Set up your Gemini API key (optional, for AI features):
   - Create a `.env.local` file
   - Add: `GEMINI_API_KEY=your_api_key_here`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

The built files will be output to `custom_components/button_card_architect/www/`

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
