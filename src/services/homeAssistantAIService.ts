import { ButtonConfig, DEFAULT_CONFIG } from '../types';

export interface HomeAssistantAIProvider {
  entityId: string;
  name: string;
}

const getHass = (): any | null => {
  try {
    const parent = window.parent as any;
    if (parent?.hass) return parent.hass;
    return parent?.document?.querySelector?.('home-assistant')?.hass ?? null;
  } catch {
    return null;
  }
};

export const getHomeAssistantAIProviders = (): HomeAssistantAIProvider[] => {
  const hass = getHass();
  if (!hass?.states) return [];
  return Object.values(hass.states)
    .filter((state: any) => state?.entity_id?.startsWith('ai_task.'))
    .map((state: any) => ({
      entityId: state.entity_id,
      name: state.attributes?.friendly_name || state.entity_id,
    }))
    .sort((a: HomeAssistantAIProvider, b: HomeAssistantAIProvider) => a.name.localeCompare(b.name));
};

const text = (description: string, required = false) => ({ description, required, selector: { text: {} } });
const bool = (description: string) => ({ description, selector: { boolean: {} } });
const number = (description: string, min?: number, max?: number) => ({
  description,
  selector: { number: { ...(min === undefined ? {} : { min }), ...(max === undefined ? {} : { max }) } },
});

// AI Task structured output uses Home Assistant selectors. Keep this flat so all
// current AI Task providers can validate it consistently; nested configuration is
// filled from DEFAULT_CONFIG after generation.
const BUTTON_STRUCTURE = {
  entity: text('Home Assistant entity ID such as light.living_room', true),
  name: text('Visible button name', true),
  label: text('Optional secondary label'),
  icon: text('Material Design icon such as mdi:lightbulb', true),
  showName: bool('Whether to display the name'),
  showIcon: bool('Whether to display the icon'),
  showState: bool('Whether to display entity state'),
  showLabel: bool('Whether to display the label'),
  layout: text('One of vertical, icon_name_state2nd, icon_name_state, icon_state_name2nd, icon_state, name_state, icon_label'),
  aspectRatio: text('Card aspect ratio such as 1/1 or 2/1'),
  height: text('Card height such as auto or 100px'),
  padding: text('Card padding such as 12px or 10%'),
  size: text('Icon size such as 40% or 48px'),
  borderRadius: text('Corner radius such as 16px'),
  backgroundColor: text('Card background as a CSS color, preferably hex', true),
  backgroundColorOpacity: number('Background opacity from 0 to 100', 0, 100),
  color: text('Primary foreground CSS color', true),
  iconColor: text('Icon CSS color', true),
  nameColor: text('Name CSS color'),
  stateColor: text('State CSS color'),
  labelColor: text('Label CSS color'),
  gradientEnabled: bool('Enable a gradient background'),
  gradientType: text('One of linear, radial, conic'),
  gradientAngle: number('Gradient angle from 0 to 360', 0, 360),
  gradientColor1: text('First gradient CSS color'),
  gradientColor2: text('Second gradient CSS color'),
  fontFamily: text('CSS font family'),
  fontSize: text('Font size such as 14px'),
  fontWeight: text('One of normal, bold, lighter, bolder'),
  borderWidth: text('Border width such as 1px'),
  borderStyle: text('One of none, solid, dashed, dotted, double, groove'),
  borderColor: text('Border CSS color'),
  backdropBlur: text('Backdrop blur such as 0px, 5px, 10px, or 20px'),
  shadowSize: text('One of none, sm, md, lg, xl, inner'),
  shadowColor: text('Shadow CSS color'),
  shadowOpacity: number('Shadow opacity from 0 to 100', 0, 100),
  stateOnColor: text('Background color for on/open/active state'),
  stateOffColor: text('Background color for off/closed/inactive state'),
  cardAnimation: text('Animation such as none, pulse, glow, shake, bounce, breathe, spin'),
  cardAnimationTrigger: text('One of always, on, off'),
  cardAnimationSpeed: text('Animation duration such as 2s'),
  iconAnimation: text('Icon animation such as none, spin, pulse, glow'),
  iconAnimationTrigger: text('One of always, on, off'),
  iconAnimationSpeed: text('Icon animation duration such as 2s'),
  spin: bool('Continuously spin the icon when appropriate'),
  tapAction: text('One of none, toggle, more-info, call-service, navigate, url, assist'),
  holdAction: text('One of none, toggle, more-info, call-service, navigate, url, assist'),
  doubleTapAction: text('One of none, toggle, more-info, call-service, navigate, url, assist'),
  tapActionNavigation: text('Navigation path when tap action is navigate'),
  hapticFeedback: bool('Enable mobile haptic feedback'),
  extraStyles: text('Optional custom CSS declarations, one per line'),
};

const buildInstructions = (request: string) => `You are a visual designer for Home Assistant custom:button-card.
Generate a polished, usable button configuration matching the request below.

Always choose accessible contrast and include visible styling. A color named by the user describes the card background unless they explicitly say otherwise. Infer a sensible entity ID and MDI icon. For binary entities, use stateOnColor and stateOffColor when the request implies state-dependent appearance. Use animations sparingly and only when they support the requested purpose.

User request: ${request}`;

export const generateWithHomeAssistantAI = async (
  request: string,
  entityId?: string,
): Promise<Partial<ButtonConfig>> => {
  const hass = getHass();
  if (!hass?.callWS) throw new Error('Home Assistant AI is unavailable in this context.');

  const result = await hass.callWS({
    type: 'call_service',
    domain: 'ai_task',
    service: 'generate_data',
    service_data: {
      task_name: 'button_builder_generate',
      instructions: buildInstructions(request),
      structure: BUTTON_STRUCTURE,
      ...(entityId ? { entity_id: entityId } : {}),
    },
    return_response: true,
  });

  const data = result?.response?.data ?? result?.data ?? result?.response?.response?.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The Home Assistant AI provider returned no structured button configuration.');
  }
  return { ...DEFAULT_CONFIG, ...data } as Partial<ButtonConfig>;
};
