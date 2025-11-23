
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ButtonConfig, DEFAULT_CONFIG } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a configuration for a Home Assistant custom:button-card based on: "${prompt}". 
      
      Assume modern, aesthetic design. 
      For "glassmorphism", use semi-transparent bg (opacity ~20-50), blur, and a subtle white/black shadow.
      For "minimal", use simple colors, no border.
      For "marquee" or "lighting", use animation: marquee.
      If the user mentions "color of the light" or "matching entity color", set colorAuto to true, or use {name}ColorAuto properties.
      
      Return ONLY the JSON object.`,
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
