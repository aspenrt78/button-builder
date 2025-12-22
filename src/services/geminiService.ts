
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ButtonConfig, DEFAULT_CONFIG } from "../types";

const API_KEY_STORAGE_KEY = 'button-builder-gemini-api-key';

export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setApiKey = (key: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

export const hasApiKey = (): boolean => {
  const key = getApiKey();
  return !!key && key.length > 0;
};

const buttonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    // Core
    entity: { type: Type.STRING, description: "Home Assistant entity ID (e.g., light.living_room, switch.fan)" },
    name: { type: Type.STRING, description: "Display name for the button" },
    label: { type: Type.STRING, description: "Secondary text/label shown on the button" },
    icon: { type: Type.STRING, description: "MDI icon (e.g., mdi:lightbulb, mdi:fan)" },
    
    // Show toggles
    showName: { type: Type.BOOLEAN },
    showIcon: { type: Type.BOOLEAN },
    showState: { type: Type.BOOLEAN, description: "Show the entity state value" },
    showLabel: { type: Type.BOOLEAN },
    showLastChanged: { type: Type.BOOLEAN, description: "Show when entity last changed" },
    showEntityPicture: { type: Type.BOOLEAN },
    
    // Layout & Dimensions
    size: { type: Type.STRING, description: "Icon size (e.g., 40%, 50px)" },
    layout: { 
      type: Type.STRING, 
      enum: ['vertical', 'icon_name_state2nd', 'icon_name_state', 'icon_state_name2nd', 'icon_state', 'name_state', 'icon_label'],
      description: "Button layout arrangement"
    },
    aspectRatio: { type: Type.STRING, description: "Card aspect ratio (e.g., 1/1, 2/1, 16/9)" },
    height: { type: Type.STRING, description: "Card height (e.g., auto, 100px)" },
    padding: { type: Type.STRING, description: "Card padding (e.g., 10%, 15px)" },
    borderRadius: { type: Type.STRING, description: "Corner radius (e.g., 12px, 50%)" },
    
    // Colors & Styles
    colorType: { type: Type.STRING, enum: ['card', 'icon', 'blank-card', 'label-card'] },
    colorAuto: { type: Type.BOOLEAN, description: "Inherit color from entity (great for RGB lights)" },
    backgroundColor: { type: Type.STRING, description: "Background color hex (e.g., #1c1c1c)" },
    backgroundColorOpacity: { type: Type.NUMBER, description: "Background opacity 0-100" },
    color: { type: Type.STRING, description: "Primary text/icon color" },

    // Gradient Background
    gradientEnabled: { type: Type.BOOLEAN, description: "Enable gradient background" },
    gradientType: { type: Type.STRING, enum: ['linear', 'radial', 'conic'] },
    gradientAngle: { type: Type.NUMBER, description: "Gradient angle in degrees (0-360)" },
    gradientColor1: { type: Type.STRING, description: "First gradient color" },
    gradientColor2: { type: Type.STRING, description: "Second gradient color" },
    gradientColor3: { type: Type.STRING, description: "Optional third gradient color" },
    gradientColor3Enabled: { type: Type.BOOLEAN },

    // Element Colors
    iconColor: { type: Type.STRING },
    iconColorAuto: { type: Type.BOOLEAN, description: "Icon inherits entity color" },
    nameColor: { type: Type.STRING },
    nameColorAuto: { type: Type.BOOLEAN },
    stateColor: { type: Type.STRING },
    stateColorAuto: { type: Type.BOOLEAN },
    labelColor: { type: Type.STRING },
    labelColorAuto: { type: Type.BOOLEAN },
    
    // Typography
    fontFamily: { type: Type.STRING, description: "Font family name" },
    fontSize: { type: Type.STRING, description: "Font size (e.g., 14px, 1.2em)" },
    fontWeight: { type: Type.STRING, enum: ['normal', 'bold', 'lighter', 'bolder'] },
    textTransform: { type: Type.STRING, enum: ['none', 'uppercase', 'lowercase', 'capitalize'] },
    letterSpacing: { type: Type.STRING, description: "Letter spacing (e.g., normal, 1px, 0.1em)" },
    
    // Borders
    borderWidth: { type: Type.STRING, description: "Border width (e.g., 0px, 2px)" },
    borderStyle: { type: Type.STRING, enum: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove'] },
    borderColor: { type: Type.STRING },
    borderColorAuto: { type: Type.BOOLEAN },

    // Glass & Depth Effects
    backdropBlur: { type: Type.STRING, enum: ['0px', '2px', '5px', '10px', '20px'], description: "Glassmorphism blur effect" },
    shadowSize: { type: Type.STRING, enum: ['none', 'sm', 'md', 'lg', 'xl', 'inner'] },
    shadowColor: { type: Type.STRING },
    shadowOpacity: { type: Type.NUMBER, description: "Shadow opacity 0-100" },
    cardOpacity: { type: Type.NUMBER, description: "Overall card opacity 0-100" },

    // State Colors (for on/off states)
    stateOnColor: { type: Type.STRING, description: "Background color when entity is ON/open/active - USE THIS for state-based color changes!" },
    stateOnOpacity: { type: Type.NUMBER },
    stateOffColor: { type: Type.STRING, description: "Background color when entity is OFF/closed/inactive" },
    stateOffOpacity: { type: Type.NUMBER },
    
    // Animations
    cardAnimation: { 
      type: Type.STRING, 
      enum: ['none', 'flash', 'pulse', 'jiggle', 'marquee', 'spin', 'blink', 'shake', 'bounce', 'glow', 'float', 'swing', 'rubberBand', 'tada', 'heartbeat', 'flip', 'wobble', 'breathe', 'ripple'],
      description: "Card animation effect"
    },
    cardAnimationTrigger: { type: Type.STRING, enum: ['always', 'on', 'off'], description: "When to play animation" },
    cardAnimationSpeed: { type: Type.STRING, description: "Animation duration (e.g., 2s, 500ms)" },
    iconAnimation: { 
      type: Type.STRING, 
      enum: ['none', 'flash', 'pulse', 'jiggle', 'marquee', 'spin', 'blink', 'shake', 'bounce', 'glow', 'float', 'swing', 'rubberBand', 'tada', 'heartbeat', 'flip', 'wobble', 'breathe', 'ripple'],
      description: "Icon animation effect"
    },
    iconAnimationTrigger: { type: Type.STRING, enum: ['always', 'on', 'off'] },
    iconAnimationSpeed: { type: Type.STRING },
    spin: { type: Type.BOOLEAN, description: "Continuous spin (great for fans)" },
    
    // Actions
    tapAction: { 
      type: Type.STRING, 
      enum: ['none', 'toggle', 'more-info', 'call-service', 'navigate', 'url', 'assist'],
      description: "Action on tap"
    },
    holdAction: { 
      type: Type.STRING, 
      enum: ['none', 'toggle', 'more-info', 'call-service', 'navigate', 'url', 'assist'],
      description: "Action on hold"
    },
    doubleTapAction: { 
      type: Type.STRING, 
      enum: ['none', 'toggle', 'more-info', 'call-service', 'navigate', 'url', 'assist'],
      description: "Action on double tap"
    },
    tapActionNavigation: { type: Type.STRING, description: "Navigation path for navigate action" },
    holdActionNavigation: { type: Type.STRING },
    
    // Advanced Features
    hapticFeedback: { type: Type.BOOLEAN, description: "Enable haptic feedback on mobile" },
    tooltip: { 
      type: Type.OBJECT, 
      properties: {
        enabled: { type: Type.BOOLEAN },
        content: { type: Type.STRING },
        position: { type: Type.STRING, enum: ['top', 'bottom', 'left', 'right'] }
      },
      description: "Tooltip on hover"
    },
    
    // Extra CSS
    extraStyles: { type: Type.STRING, description: "Custom CSS styles (one per line, format: property: value)" }
  },
  required: ["entity", "name", "icon", "backgroundColor", "color", "iconColor"]
};

export const generateButtonConfig = async (prompt: string): Promise<Partial<ButtonConfig>> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API_KEY_REQUIRED");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `You are a UI designer expert creating Home Assistant button-card configurations. Your PRIMARY job is to generate VISUALLY STYLED buttons - always include colors, effects, and styling.

CRITICAL: You MUST always include these visual properties:
- backgroundColor: A hex color for the card background (e.g., "#1a1a2e", "#2d3436", "#1e3a5f")
- color: Primary text color (e.g., "#ffffff", "#ffd700", "#00ffff")
- iconColor: Icon color (e.g., "#ffd700", "#ff6b6b", "#4ecdc4")
- shadowSize: One of "none", "sm", "md", "lg", "xl" for depth
- borderRadius: Corner rounding (e.g., "12px", "16px", "20px")

IMPORTANT COLOR INTERPRETATION:
When users say "[COLOR] button" (e.g., "gold button", "red button", "blue button"), they mean the CARD BACKGROUND should be that color!
- "gold button" → backgroundColor should be gold (#d4af37, #ffd700, #c9a227)
- "red button" → backgroundColor should be red (#dc2626, #ef4444, #b91c1c)
- "blue button" → backgroundColor should be blue (#2563eb, #3b82f6, #1d4ed8)
- "green button" → backgroundColor should be green (#16a34a, #22c55e, #15803d)
- Use contrasting text/icon colors (dark text on light backgrounds, light on dark)

CONTEXT:
- Generating configuration for custom:button-card in Home Assistant
- Users want visually appealing buttons for modern dashboard aesthetics
- NEVER return a button without styling - always include colors!

DESIGN PRINCIPLES:
1. **Always Style**: Every button MUST have backgroundColor, color, and iconColor set
2. **Color Names = Background**: When user mentions a color for the button, apply it to backgroundColor
3. **Modern Aesthetics**: Clean, contemporary designs with good contrast
4. **Readability**: Dark text (#1a1a1a, #2d2d2d) on light backgrounds, light text (#ffffff, #f0f0f0) on dark backgrounds

STYLE PRESETS:
- **Glassmorphism/Glass**: Semi-transparent background (opacity 20-40), backdropBlur: "10px" or "20px", subtle border, soft shadow
- **Neon/Cyberpunk**: Vibrant colors (#00ffff, #ff00ff, #00ff00), dark background (#0a0a0a), colored shadows, glow animation
- **Minimal/Clean**: Solid colors, borderStyle: "none", shadowSize: "none", simple layout
- **Neumorphism**: Soft muted colors, shadowSize: "md", subtle depth
- **Gradient**: Set gradientEnabled: true, pick harmonious gradientColor1 and gradientColor2, gradientAngle for direction
- **Dark Mode**: Dark backgrounds (#1c1c1c, #0d0d0d), light text (#ffffff, #e0e0e0)
- **Animated**: Use cardAnimation or iconAnimation with appropriate trigger

ENTITY INFERENCE:
- "light" → entity: "light.{room}_light", icon: "mdi:lightbulb", colorAuto: true
- "fan" → entity: "fan.{room}_fan", icon: "mdi:fan", spin: true (when on), iconAnimationTrigger: "on"
- "switch" → entity: "switch.{name}", icon: "mdi:toggle-switch"
- "sensor/temperature" → entity: "sensor.{name}_temperature", icon: "mdi:thermometer", showState: true
- "door/garage" → entity: "cover.garage_door", icon: "mdi:garage"
- "lock" → entity: "lock.{name}", icon: "mdi:lock"
- "climate/AC" → entity: "climate.{name}", icon: "mdi:thermostat", showState: true
- "media/speaker" → entity: "media_player.{name}", icon: "mdi:speaker"
- "camera" → entity: "camera.{name}", icon: "mdi:cctv"
- "vacuum" → entity: "vacuum.{name}", icon: "mdi:robot-vacuum"

STATE-BASED COLOR CHANGES (IMPORTANT!):
When users want different colors based on state (on/off, open/closed, etc.), USE THESE:
- stateOnColor: Background color when ON/open/active (e.g., "#dc2626" for red when open)
- stateOffColor: Background color when OFF/closed/inactive (e.g., "#1a1a1a" for dark when closed)

EXAMPLES of state-based requests:
- "turns red when open" → stateOnColor: "#dc2626" (red), backgroundColor: "#1a1a1a" (dark default)
- "green when on, gray when off" → stateOnColor: "#16a34a", stateOffColor: "#4a4a4a"
- "warning red when active" → stateOnColor: "#ef4444"
- For garage doors/covers: ON = open, OFF = closed
- For lights/switches: ON = on, OFF = off

COLOR AUTO FEATURES:
- colorAuto: true - Button matches entity's current color (great for RGB lights!)
- iconColorAuto, nameColorAuto, stateColorAuto, labelColorAuto for granular control

ANIMATIONS (use appropriately):
- "pulse": Gentle pulsing - active/important states
- "spin": Rotating - fans, loading states (or use spin: true for continuous)
- "blink": Flashing - alerts, warnings
- "shake": Attention-grabbing - errors, important notifications  
- "bounce": Playful - confirmations
- "glow": Subtle glow - premium feel
- "heartbeat": Pulsing heartbeat - health/status indicators
- "breathe": Slow breathing - ambient indicators
- "wobble": Playful wobble - fun interactions
- "tada": Celebration - success states

GRADIENT EXAMPLES:
- Sunset: gradientColor1: "#ff6b6b", gradientColor2: "#feca57", gradientAngle: 135
- Ocean: gradientColor1: "#667eea", gradientColor2: "#764ba2", gradientAngle: 135
- Forest: gradientColor1: "#11998e", gradientColor2: "#38ef7d", gradientAngle: 45
- Fire: gradientColor1: "#f12711", gradientColor2: "#f5af19", gradientAngle: 180
- Ice: gradientColor1: "#00c6ff", gradientColor2: "#0072ff", gradientAngle: 90

COMMON ACTIONS:
- tapAction: "toggle" - most common for lights/switches
- tapAction: "more-info" - show entity details dialog
- holdAction: "more-info" - common pattern: tap toggles, hold shows info
- tapAction: "navigate", tapActionNavigation: "/lovelace/room" - navigate to dashboard

USER REQUEST: "${prompt}"

REMEMBER: You MUST include visual styling! Always set backgroundColor, color, iconColor, and relevant effects like shadowSize. A button without colors is incomplete.

Generate a fully styled configuration that matches this request. Be creative with colors and effects.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: buttonSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const generated = JSON.parse(text);
    return { ...DEFAULT_CONFIG, ...generated };
  } catch (error) {
    console.error("Failed to generate config:", error);
    throw error;
  }
};
