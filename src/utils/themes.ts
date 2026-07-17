import { ButtonConfig, SavedTheme, StateAppearanceConfig } from '../types';

const THEMES_STORAGE_KEY = 'button-builder-themes';

// The appearance controls a user may promote to a global "theme" control. These are
// the "most commonly carried over" settings that usually form a button's shared look.
// `key` matches a StateAppearanceConfig / ButtonConfig field name.
export interface ThemeEligibleControl {
  key: keyof StateAppearanceConfig;
  label: string;
  // Related keys promoted together (e.g. a color and its opacity/gradient toggle),
  // so the theme captures a coherent unit.
  related?: (keyof StateAppearanceConfig)[];
}

export const THEME_ELIGIBLE_CONTROLS: ThemeEligibleControl[] = [
  { key: 'backgroundColor', label: 'Card Background', related: ['backgroundColorOpacity', 'gradientEnabled', 'gradientType', 'gradientAngle', 'gradientColor1', 'gradientColor2', 'gradientColor3', 'gradientColor3Enabled', 'gradientOpacity'] },
  { key: 'cardOpacity', label: 'Entire Card Opacity' },
  { key: 'color', label: 'Default Text Color', related: ['colorAuto'] },
  { key: 'backdropBlur', label: 'Backdrop Blur' },
  { key: 'shadowSize', label: 'Shadow', related: ['shadowColor', 'shadowOpacity'] },
  { key: 'borderStyle', label: 'Border', related: ['borderWidth', 'borderColor', 'borderColorAuto'] },
  { key: 'fontFamily', label: 'Font Family' },
  { key: 'fontSize', label: 'Font Size' },
  { key: 'fontWeight', label: 'Font Weight' },
  { key: 'textTransform', label: 'Text Transform' },
  { key: 'letterSpacing', label: 'Letter Spacing' },
  { key: 'lineHeight', label: 'Line Height' },
];

// Expand a set of chosen primary keys into the full key set (primary + related),
// which is what actually gets stored in config.themeKeys.
export const expandThemeKeys = (primaryKeys: string[]): string[] => {
  const set = new Set<string>();
  THEME_ELIGIBLE_CONTROLS.forEach(ctrl => {
    if (primaryKeys.includes(ctrl.key as string)) {
      set.add(ctrl.key as string);
      (ctrl.related || []).forEach(r => set.add(r as string));
    }
  });
  return Array.from(set);
};

// Which primary controls are currently active (in themeKeys), for pre-checking the chooser.
export const activePrimaryKeys = (themeKeys: string[]): string[] =>
  THEME_ELIGIBLE_CONTROLS.filter(ctrl => themeKeys.includes(ctrl.key as string)).map(ctrl => ctrl.key as string);

// Capture the current base-config values for the given theme keys.
export const buildThemeValues = (config: ButtonConfig, themeKeys: string[]): Partial<ButtonConfig> => {
  const out: Partial<ButtonConfig> = {};
  const src = config as unknown as Record<string, unknown>;
  themeKeys.forEach(key => {
    const value = src[key];
    if (value !== undefined) (out as Record<string, unknown>)[key] = value;
  });
  return out;
};

export const loadThemes = (): SavedTheme[] => {
  try {
    const saved = localStorage.getItem(THEMES_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((t: any) => t && typeof t === 'object' && typeof t.name === 'string' && Array.isArray(t.themeKeys))
      .map((t: any, i: number): SavedTheme => ({
        id: typeof t.id === 'string' && t.id ? t.id : `theme-${i}`,
        name: t.name.trim(),
        themeKeys: t.themeKeys.filter((k: unknown) => typeof k === 'string'),
        values: t.values && typeof t.values === 'object' ? t.values : {},
      }));
  } catch (e) {
    console.warn('Failed to load themes:', e);
    return [];
  }
};

export const persistThemes = (themes: SavedTheme[]): void => {
  try {
    localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(themes));
  } catch (e) {
    console.warn('Failed to save themes:', e);
  }
};
