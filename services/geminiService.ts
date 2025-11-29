
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
    stateOnColor: { type: Type.STRING, description: "Background when entity is ON" },
    stateOnOpacity: { type: Type.NUMBER },
    stateOffColor: { type: Type.STRING, description: "Background when entity is OFF" },
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
  required: ["entity", "name", "icon"]
};

export const generateButtonConfig = async (prompt: string): Promise<Partial<ButtonConfig>> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API_KEY_REQUIRED");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `You are a UI designer expert specializing in Home Assistant button-card configurations. Create beautiful, modern, and functional button card designs based on user descriptions.

CONTEXT:
- Generating configuration for custom:button-card in Home Assistant
- Output controls smart home devices (lights, switches, fans, sensors, etc.)
- Users want visually appealing buttons for modern dashboard aesthetics

DESIGN PRINCIPLES:
1. **Modern Aesthetics**: Clean, contemporary designs with good contrast
2. **Color Harmony**: Complementary colors, avoid clashing combinations
3. **Readability**: Light text on dark backgrounds, dark on light
4. **Subtlety**: Prefer subtle effects unless explicitly requested for dramatic looks

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

Generate a configuration that best matches this request. Be creative but practical. Make sensible design choices for vague requests. Prefer modern, clean aesthetics.`;

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
