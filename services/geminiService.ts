
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
    entity: { type: Type.STRING, description: "Home Assistant entity ID" },
    name: { type: Type.STRING },
    label: { type: Type.STRING },
    icon: { type: Type.STRING },
    
    showName: { type: Type.BOOLEAN },
    showIcon: { type: Type.BOOLEAN },
    showState: { type: Type.BOOLEAN },
    showLabel: { type: Type.BOOLEAN },
    showLastChanged: { type: Type.BOOLEAN },
    showEntityPicture: { type: Type.BOOLEAN },
    
    size: { type: Type.STRING },
    layout: { 
      type: Type.STRING, 
      enum: ['vertical', 'icon_name_state2nd', 'icon_name_state', 'icon_state_name2nd', 'icon_state', 'name_state', 'icon_label'] 
    },
    aspectRatio: { type: Type.STRING, description: "Format like 1/1 or 2/1" },
    
    colorType: { type: Type.STRING, enum: ['card', 'icon', 'blank-card', 'label-card'] },
    colorAuto: { type: Type.BOOLEAN, description: "Set to true if the card should inherit light color" },
    backgroundColor: { type: Type.STRING },
    backgroundColorOpacity: { type: Type.NUMBER, description: "0-100" },
    color: { type: Type.STRING },

    iconColor: { type: Type.STRING },
    iconColorAuto: { type: Type.BOOLEAN },
    nameColor: { type: Type.STRING },
    nameColorAuto: { type: Type.BOOLEAN },
    stateColor: { type: Type.STRING },
    stateColorAuto: { type: Type.BOOLEAN },
    labelColor: { type: Type.STRING },
    labelColorAuto: { type: Type.BOOLEAN },
    
    padding: { type: Type.STRING },
    borderRadius: { type: Type.STRING },
    height: { type: Type.STRING },
    fontSize: { type: Type.STRING },
    fontWeight: { type: Type.STRING, enum: ['normal', 'bold', 'lighter', 'bolder'] },
    textTransform: { type: Type.STRING, enum: ['none', 'uppercase', 'lowercase', 'capitalize'] },
    
    borderWidth: { type: Type.STRING },
    borderStyle: { type: Type.STRING, enum: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove'] },
    borderColor: { type: Type.STRING },
    borderColorAuto: { type: Type.BOOLEAN },

    backdropBlur: { type: Type.STRING, enum: ['0px', '2px', '5px', '10px', '20px'] },
    shadowSize: { type: Type.STRING, enum: ['none', 'sm', 'md', 'lg', 'xl', 'inner'] },
    shadowColor: { type: Type.STRING },
    shadowOpacity: { type: Type.NUMBER },

    stateOnColor: { type: Type.STRING },
    stateOnOpacity: { type: Type.NUMBER },
    stateOffColor: { type: Type.STRING },
    stateOffOpacity: { type: Type.NUMBER },
    
    cardAnimation: { type: Type.STRING, enum: ['none', 'flash', 'pulse', 'jiggle', 'marquee', 'spin', 'blink', 'shake', 'bounce', 'rotate'] },
    cardAnimationTrigger: { type: Type.STRING, enum: ['always', 'on', 'off'] },
    iconAnimation: { type: Type.STRING, enum: ['none', 'flash', 'pulse', 'jiggle', 'marquee', 'spin', 'blink', 'shake', 'bounce', 'rotate'] },
    iconAnimationTrigger: { type: Type.STRING, enum: ['always', 'on', 'off'] },
    
    tapAction: { type: Type.STRING },
    holdAction: { type: Type.STRING },
    doubleTapAction: { type: Type.STRING }
  },
  required: ["entity", "name", "icon", "backgroundColor", "color"]
};

export const generateButtonConfig = async (prompt: string): Promise<Partial<ButtonConfig>> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API_KEY_REQUIRED");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `You are a UI designer expert specializing in Home Assistant button-card configurations. Your job is to create beautiful, modern, and functional button card designs based on user descriptions.

CONTEXT:
- You're generating configuration for the custom:button-card component in Home Assistant
- The output will be used to control smart home devices (lights, switches, fans, sensors, etc.)
- Users want visually appealing buttons that fit modern dashboard aesthetics

DESIGN PRINCIPLES:
1. **Modern Aesthetics**: Default to clean, contemporary designs with good contrast
2. **Color Harmony**: Use complementary colors, avoid clashing combinations
3. **Readability**: Ensure text is readable against backgrounds (use light text on dark, dark on light)
4. **Subtlety**: Prefer subtle effects over garish ones unless explicitly requested

STYLE GUIDELINES:
- "Glassmorphism/Glass": Semi-transparent background (opacity 20-40), backdropBlur: "10px" or "20px", subtle border, soft shadow
- "Neon/Cyberpunk": Vibrant colors (#00ffff, #ff00ff, #00ff00), dark background, strong shadows with color
- "Minimal/Clean": Solid colors, no border, no shadow, simple layout
- "Neumorphism": Soft shadows, muted colors, inner shadows for depth
- "Gradient": Use stateOnColor and stateOffColor for gradient-like effects
- "Animated/Dynamic": Add appropriate animations (pulse for active states, spin for fans, blink for alerts)

ENTITY INFERENCE:
- If user mentions "light" → entity: "light.{room}_light", icon: "mdi:lightbulb"
- If user mentions "fan" → entity: "fan.{room}_fan", icon: "mdi:fan", consider spin animation when on
- If user mentions "switch" → entity: "switch.{name}", icon: "mdi:toggle-switch"
- If user mentions "sensor/temperature" → entity: "sensor.{name}_temperature", icon: "mdi:thermometer", showState: true
- If user mentions "door/garage" → entity: "cover.garage_door", icon: "mdi:garage"
- If user mentions "lock" → entity: "lock.{name}", icon: "mdi:lock"
- If user mentions "climate/AC/thermostat" → entity: "climate.{name}", icon: "mdi:thermostat"

COLOR AUTO FEATURES:
- Set colorAuto: true when user wants the button to match a light's current color
- Use iconColorAuto, nameColorAuto, stateColorAuto, labelColorAuto for granular control
- This makes buttons dynamically reflect the actual state of colored lights

ANIMATIONS:
- "pulse": Gentle pulsing, good for active/important states
- "spin": Rotating, perfect for fans or loading states
- "blink": Flashing, for alerts or warnings
- "shake": Attention-grabbing, for errors or important notifications
- "bounce": Playful, for confirmations
- "marquee": Text scrolling effect, for long labels

USER REQUEST: "${prompt}"

Generate a configuration that best matches this request. Be creative but practical. If details are vague, make sensible design choices.`;

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
