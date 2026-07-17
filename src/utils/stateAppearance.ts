import { ButtonConfig, StateAppearanceConfig, StateStyleConfig, DEFAULT_STATE_APPEARANCE } from '../types';

// Keys that live on StateAppearanceConfig AND ButtonConfig with the same name and
// meaning. These are the appearance controls that can be edited per-state (ON/OFF)
// or promoted to a global "theme" control on the base config.
export const APPEARANCE_KEYS: (keyof StateAppearanceConfig)[] = [
  'backgroundColor', 'backgroundColorOpacity', 'color', 'colorAuto', 'cardOpacity',
  'iconColor', 'iconColorAuto', 'nameColor', 'nameColorAuto', 'stateColor', 'stateColorAuto',
  'labelColor', 'labelColorAuto', 'borderColor', 'borderColorAuto', 'borderWidth', 'borderStyle',
  'gradientEnabled', 'gradientType', 'gradientAngle', 'gradientColor1', 'gradientColor2',
  'gradientColor3', 'gradientColor3Enabled', 'gradientOpacity',
  'backdropBlur', 'shadowSize', 'shadowColor', 'shadowOpacity',
  'fontFamily', 'fontSize', 'fontWeight', 'textTransform', 'letterSpacing', 'lineHeight',
  'cardAnimation', 'cardAnimationSpeed', 'effectIntensity', 'iconAnimation', 'iconAnimationSpeed', 'extraStyles',
];

// A key's presence in a partial state buffer means the user (or a preset) chose
// that value explicitly. False, 100, "none", and an empty string are meaningful:
// they can disable or clear a value inherited from the shared base appearance.
const isSetValue = (_key: keyof StateAppearanceConfig, value: unknown): boolean =>
  value !== undefined && value !== null;

// True when a partial appearance buffer contains at least one real override.
export const hasAppearanceOverrides = (appearance: Partial<StateAppearanceConfig>): boolean =>
  Object.entries(appearance).some(([key, value]) => isSetValue(key as keyof StateAppearanceConfig, value));

// Compose a complete StateAppearanceConfig from a base seed (preset-derived) and a
// manual override buffer. Precedence: base -> manual (manual wins only when "set").
export const mergeStateAppearance = (
  base: Partial<StateAppearanceConfig>,
  manual: Partial<StateAppearanceConfig>,
): StateAppearanceConfig => {
  const result = { ...DEFAULT_STATE_APPEARANCE, ...base } as Record<string, unknown>;
  (Object.keys(manual) as (keyof StateAppearanceConfig)[]).forEach(key => {
    const value = manual[key];
    if (isSetValue(key, value)) {
      result[key as string] = value;
    }
  });
  return result as unknown as StateAppearanceConfig;
};

// Pull the appearance subset out of a (partial) ButtonConfig, e.g. from a preset's
// config, so it can be written into an ON/OFF appearance buffer.
export const extractAppearance = (config: Partial<ButtonConfig>): Partial<StateAppearanceConfig> => {
  const out: Partial<StateAppearanceConfig> = {};
  APPEARANCE_KEYS.forEach(key => {
    const value = (config as Record<string, unknown>)[key as string];
    if (value !== undefined) {
      (out as Record<string, unknown>)[key as string] = value;
    }
  });
  return out;
};

// Migrate legacy state styling into the per-state model:
//  - stateOnColor/stateOffColor -> ON/OFF appearance backgroundColor (+opacity)
//  - spin/rotate global icon toggle -> iconAnimation: 'spin'
// The legacy fields on config are cleared so nothing re-emits them. Non-destructive
// to any values already present in the appearance buffers.
export const migrateLegacyStateColors = (
  config: ButtonConfig,
  onApp: Partial<StateAppearanceConfig>,
  offApp: Partial<StateAppearanceConfig>,
): {
  config: ButtonConfig;
  onApp: Partial<StateAppearanceConfig>;
  offApp: Partial<StateAppearanceConfig>;
} => {
  const nextConfig = { ...config };
  const nextOn = { ...onApp };
  const nextOff = { ...offApp };

  if (config.stateOnColor && !nextOn.backgroundColor) {
    nextOn.backgroundColor = config.stateOnColor;
    if (config.stateOnOpacity !== undefined && nextOn.backgroundColorOpacity === undefined) {
      nextOn.backgroundColorOpacity = config.stateOnOpacity;
    }
  }
  if (config.stateOffColor && !nextOff.backgroundColor) {
    nextOff.backgroundColor = config.stateOffColor;
    if (config.stateOffOpacity !== undefined && nextOff.backgroundColorOpacity === undefined) {
      nextOff.backgroundColorOpacity = config.stateOffOpacity;
    }
  }
  // Clear the legacy colors so nothing re-emits them (the generator no longer reads
  // these fields; the opacity fields are left as-is since they're inert without a color).
  nextConfig.stateOnColor = '';
  nextConfig.stateOffColor = '';

  // Unify the old global icon-spin toggle into the animation system.
  if ((config.spin || config.rotate) && (!config.iconAnimation || config.iconAnimation === 'none')) {
    nextConfig.iconAnimation = 'spin';
    if (config.spinDuration) nextConfig.iconAnimationSpeed = config.spinDuration;
    if (config.iconAnimationTrigger !== 'on' && config.iconAnimationTrigger !== 'off') {
      nextConfig.iconAnimationTrigger = 'always';
    }
  }
  nextConfig.spin = false;
  nextConfig.rotate = false;

  return { config: nextConfig, onApp: nextOn, offApp: nextOff };
};

// Build the base-config seed used for a state that has no explicit override buffer:
// the appearance the base config currently carries (used so per-state merges inherit
// the shared/theme look).
export const appearanceFromConfig = (config: ButtonConfig): Partial<StateAppearanceConfig> =>
  extractAppearance(config);

// Convert a merged StateAppearanceConfig into a StateStyleConfig with a synthetic
// `state-appearance-{on|off}` id. Used to drive the live preview (which resolves
// per-state styling from config.stateStyles). The YAML generator emits from the
// merged appearances directly and skips these synthetic entries.
export const appearanceToStateStyle = (
  app: StateAppearanceConfig,
  stateValue: 'on' | 'off',
): StateStyleConfig => ({
  id: `state-appearance-${stateValue}`,
  operator: 'equals',
  value: stateValue,
  name: '',
  icon: '',
  color: app.color || '',
  entityPicture: '',
  label: '',
  stateDisplay: '',
  spin: false,
  styles: app.extraStyles || '',
  backgroundColor: app.backgroundColor || '',
  backgroundColorOpacity: app.backgroundColorOpacity ?? 100,
  iconColor: app.iconColorAuto ? '' : (app.iconColor || ''),
  nameColor: app.nameColorAuto ? '' : (app.nameColor || ''),
  stateColor: app.stateColorAuto ? '' : (app.stateColor || ''),
  labelColor: app.labelColorAuto ? '' : (app.labelColor || ''),
  borderColor: app.borderColor || '',
  cardOpacity: app.cardOpacity,
  borderWidth: app.borderWidth,
  borderStyle: app.borderStyle,
  backdropBlur: app.backdropBlur,
  shadowSize: app.shadowSize,
  shadowColor: app.shadowColor,
  shadowOpacity: app.shadowOpacity,
  fontFamily: app.fontFamily,
  fontSize: app.fontSize,
  fontWeight: app.fontWeight,
  textTransform: app.textTransform,
  letterSpacing: app.letterSpacing,
  lineHeight: app.lineHeight,
  cardAnimation: app.cardAnimation || 'none',
  cardAnimationSpeed: app.cardAnimationSpeed || '2s',
  effectIntensity: app.effectIntensity ?? 100,
  iconAnimation: app.iconAnimation || 'none',
  iconAnimationSpeed: app.iconAnimationSpeed || '2s',
  gradientEnabled: app.gradientEnabled || false,
  gradientType: app.gradientType || DEFAULT_STATE_APPEARANCE.gradientType,
  gradientAngle: app.gradientAngle ?? DEFAULT_STATE_APPEARANCE.gradientAngle,
  gradientColor1: app.gradientColor1 || DEFAULT_STATE_APPEARANCE.gradientColor1,
  gradientColor2: app.gradientColor2 || DEFAULT_STATE_APPEARANCE.gradientColor2,
  gradientColor3: app.gradientColor3 || DEFAULT_STATE_APPEARANCE.gradientColor3,
  gradientColor3Enabled: app.gradientColor3Enabled || false,
  gradientOpacity: app.gradientOpacity ?? DEFAULT_STATE_APPEARANCE.gradientOpacity,
});
