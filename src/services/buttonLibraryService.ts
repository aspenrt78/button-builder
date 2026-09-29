import { ButtonConfig, DEFAULT_CONFIG, SavedButtonRecord, StateAppearanceConfig } from '../types';
import { getHass } from './homeAssistantService';

export const BUTTON_LIBRARY_KEY = 'button_builder_library';
export const BUTTON_LIBRARY_VERSION = 1;

type SharedButtonGroups = Record<string, unknown>;

export interface SharedButtonLayer {
  groups: SharedButtonGroups;
  when?: { type: 'button_active' | 'button_off' };
  hidden?: boolean;
  label?: string;
}

export interface SharedButtonPreset {
  slug: string;
  name: string;
  kind: 'button';
  note?: string;
  layers: SharedButtonLayer[];
  button_builder: {
    record_version: 1;
    record: SavedButtonRecord;
  };
}

export interface ButtonLibraryEnvelope {
  button_builder_library: 1;
  migration_complete: true;
  presets: Record<string, SharedButtonPreset | Record<string, unknown>>;
}

export interface ParsedButtonLibrary {
  recognized: boolean;
  authoritative: boolean;
  records: SavedButtonRecord[];
}

const STYLE_GROUP_KEYS = {
  background: ['button_style'],
  border: ['button_border_enabled', 'button_border_width', 'button_border_color', 'button_border_color_mode', 'button_border_sides'],
  glow: ['button_glow_enabled', 'button_glow_color', 'button_glow_color_mode', 'button_glow_intensity', 'button_glow_condition', 'button_glow_blur', 'button_glow_spread', 'button_glow_opacity'],
  shadow: ['button_shadow_enabled', 'button_shadow_color', 'button_shadow_x', 'button_shadow_y', 'button_shadow_blur', 'button_shadow_spread', 'button_shadow_opacity'],
  text: ['button_font_size', 'button_name_weight', 'button_name_color', 'button_name_color_mode', 'button_name_wrap', 'button_icon_gap'],
  icon: ['button_icon', 'button_icon_size', 'button_icon_color', 'button_icon_color_mode'],
  sizing: ['button_border_radius', 'button_height', 'button_max_width'],
} as const;

type StyleGroupName = keyof typeof STYLE_GROUP_KEYS;

const clone = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
};

const finiteNumber = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const cssPixels = (value: unknown, fallback: number): number => {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text || text === 'auto' || text.endsWith('%')) return fallback;
  const parsed = Number.parseFloat(text);
  if (!Number.isFinite(parsed)) return fallback;
  if (text.endsWith('rem')) return Math.round(parsed * 16);
  if (text.endsWith('em')) return Math.round(parsed * 16);
  return Math.round(parsed);
};

const cssColor = (value: unknown, fallback: string): string => {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || fallback;
};

const buttonWeight = (value: ButtonConfig['fontWeight']): string => {
  if (value === 'lighter') return '300';
  if (value === 'normal') return '400';
  if (value === 'bold' || value === 'bolder') return '700';
  return '600';
};

const shadowMetrics = (size: ButtonConfig['shadowSize']) => {
  switch (size) {
    case 'sm': return { enabled: true, x: 0, y: 1, blur: 2, spread: 0 };
    case 'md': return { enabled: true, x: 0, y: 4, blur: 6, spread: -1 };
    case 'lg': return { enabled: true, x: 0, y: 10, blur: 15, spread: -3 };
    case 'xl': return { enabled: true, x: 0, y: 20, blur: 25, spread: -5 };
    default: return { enabled: false, x: 0, y: 4, blur: 12, spread: 0 };
  }
};

const buildSharedGroups = (config: ButtonConfig): SharedButtonGroups => {
  const borderWidth = Math.max(0, cssPixels(config.borderWidth, 0));
  const borderEnabled = config.borderStyle !== 'none' && borderWidth > 0;
  const shadow = shadowMetrics(config.shadowSize);
  const glowEnabled = config.cardAnimation === 'glow';
  const glowIntensity = Math.max(0.25, Math.min(2, finiteNumber(config.effectIntensity, 100) / 100));
  const backgroundOpacity = Math.max(0, Math.min(100, finiteNumber(config.backgroundColorOpacity, 100)));
  const iconSize = String(config.size || '').trim().endsWith('px') ? cssPixels(config.size, 0) : 0;
  const iconColorMode = config.iconColorAuto ? 'match' : config.iconColor ? 'fixed' : 'none';
  const nameColorMode = config.nameColorAuto ? 'match' : config.nameColor ? 'fixed' : 'inherit';

  return {
    button_style: backgroundOpacity <= 5 ? 'transparent' : config.gradientEnabled ? 'tinted' : 'solid',

    button_border_enabled: borderEnabled,
    button_border_width: borderWidth || 1,
    button_border_color: cssColor(config.borderColor, '#2196F3'),
    button_border_color_mode: config.borderColorAuto ? 'match' : borderEnabled ? 'fixed' : 'none',
    button_border_sides: ['top', 'bottom', 'left', 'right'],

    button_glow_enabled: glowEnabled,
    button_glow_color: cssColor(config.iconColor || config.borderColor || config.backgroundColor, '#2196F3'),
    button_glow_color_mode: glowEnabled ? 'match' : 'none',
    button_glow_intensity: glowIntensity,
    button_glow_condition: config.cardAnimationTrigger === 'on' ? 'when_active' : 'always',
    button_glow_blur: Math.round(12 * glowIntensity),
    button_glow_spread: Math.round(2 * glowIntensity),
    button_glow_opacity: 0.5,

    button_shadow_enabled: shadow.enabled,
    button_shadow_color: cssColor(config.shadowColor, '#000000'),
    button_shadow_x: shadow.x,
    button_shadow_y: shadow.y,
    button_shadow_blur: shadow.blur,
    button_shadow_spread: shadow.spread,
    button_shadow_opacity: Math.max(0, Math.min(1, finiteNumber(config.shadowOpacity, 30) / 100)),

    button_font_size: Math.max(8, cssPixels(config.fontSize, 14)),
    button_name_weight: buttonWeight(config.fontWeight),
    button_name_color: cssColor(config.nameColor, ''),
    button_name_color_mode: nameColorMode,
    button_name_wrap: true,
    button_icon_gap: 8,

    button_icon: config.icon || '',
    button_icon_size: iconSize,
    button_icon_color: cssColor(config.iconColor, '#2196F3'),
    button_icon_color_mode: iconColorMode,

    button_border_radius: String(config.borderRadius || '').trim().endsWith('%')
      ? 50
      : Math.max(0, cssPixels(config.borderRadius, 8)),
    button_height: Math.max(1, cssPixels(config.height, 44)),
    button_max_width: 0,
  };
};

const pickGroup = (groups: SharedButtonGroups, groupName: StyleGroupName): SharedButtonGroups => {
  const picked: SharedButtonGroups = {};
  STYLE_GROUP_KEYS[groupName].forEach((key) => {
    if (groups[key] !== undefined) picked[key] = clone(groups[key]);
  });
  return picked;
};

const changedGroups = (base: SharedButtonGroups, next: SharedButtonGroups): SharedButtonGroups => {
  const changed: SharedButtonGroups = {};
  (Object.keys(STYLE_GROUP_KEYS) as StyleGroupName[]).forEach((groupName) => {
    const baseGroup = pickGroup(base, groupName);
    const nextGroup = pickGroup(next, groupName);
    if (JSON.stringify(baseGroup) !== JSON.stringify(nextGroup)) Object.assign(changed, nextGroup);
  });
  return changed;
};

const mergedAppearanceConfig = (
  config: ButtonConfig,
  appearance: Partial<StateAppearanceConfig>,
): ButtonConfig => ({ ...config, ...appearance } as ButtonConfig);

export const buildSharedButtonLayers = (record: SavedButtonRecord): SharedButtonLayer[] => {
  const baseGroups = buildSharedGroups(record.config);
  const layers: SharedButtonLayer[] = [{ groups: baseGroups }];

  const onGroups = changedGroups(baseGroups, buildSharedGroups(mergedAppearanceConfig(record.config, record.onStateAppearance || {})));
  if (Object.keys(onGroups).length) {
    layers.push({ groups: onGroups, when: { type: 'button_active' }, label: 'ON / active' });
  }

  const offGroups = changedGroups(baseGroups, buildSharedGroups(mergedAppearanceConfig(record.config, record.offStateAppearance || {})));
  if (Object.keys(offGroups).length) {
    layers.push({ groups: offGroups, when: { type: 'button_off' }, label: 'OFF' });
  }

  return layers;
};

const normalizeRecord = (value: unknown): SavedButtonRecord | null => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Partial<SavedButtonRecord> & Record<string, unknown>;
  if (typeof record.id !== 'string' || !record.id) return null;
  const legacyCondition = record.legacyPresetCondition ?? record.presetCondition;
  const legacyOffPreset = record.legacyOffStatePresetId ?? record.offStatePresetId;
  const legacyOnPreset = record.legacyOnStatePresetId ?? record.onStatePresetId;
  return {
    id: record.id,
    name: typeof record.name === 'string' ? record.name : 'Saved Button',
    folder: typeof record.folder === 'string' ? record.folder : '',
    tags: Array.isArray(record.tags) ? record.tags.filter((tag): tag is string => typeof tag === 'string') : [],
    yaml: typeof record.yaml === 'string' ? record.yaml : '',
    config: { ...DEFAULT_CONFIG, ...(record.config && typeof record.config === 'object' ? record.config : {}) },
    useAutoDarkMode: record.useAutoDarkMode !== false,
    activePresetId: typeof record.activePresetId === 'string' ? record.activePresetId : null,
    legacyPresetCondition: legacyCondition === 'on' || legacyCondition === 'off' ? legacyCondition : 'always',
    legacyOffStatePresetId: typeof legacyOffPreset === 'string' ? legacyOffPreset : null,
    legacyOnStatePresetId: typeof legacyOnPreset === 'string' ? legacyOnPreset : null,
    onStateAppearance: record.onStateAppearance && typeof record.onStateAppearance === 'object' ? record.onStateAppearance : {},
    offStateAppearance: record.offStateAppearance && typeof record.offStateAppearance === 'object' ? record.offStateAppearance : {},
    createdAt: typeof record.createdAt === 'number' ? record.createdAt : Date.now(),
    updatedAt: typeof record.updatedAt === 'number' ? record.updatedAt : Date.now(),
  };
};

export const parseLocalButtonRecords = (value: unknown): SavedButtonRecord[] => {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeRecord).filter((record): record is SavedButtonRecord => record !== null);
};

export const parseButtonLibrary = (value: unknown): ParsedButtonLibrary => {
  if (!value || typeof value !== 'object') return { recognized: false, authoritative: false, records: [] };
  const envelope = value as Record<string, unknown>;

  if (envelope.button_builder_library === BUTTON_LIBRARY_VERSION && envelope.presets && typeof envelope.presets === 'object') {
    const records = Object.values(envelope.presets as Record<string, unknown>)
      .map((preset) => {
        if (!preset || typeof preset !== 'object') return null;
        const native = (preset as Record<string, unknown>).button_builder;
        if (!native || typeof native !== 'object') return null;
        return normalizeRecord((native as Record<string, unknown>).record);
      })
      .filter((record): record is SavedButtonRecord => record !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    return {
      recognized: true,
      authoritative: envelope.migration_complete === true,
      records,
    };
  }

  const legacyRecords = envelope.records;
  if (legacyRecords && typeof legacyRecords === 'object') {
    const values = Array.isArray(legacyRecords) ? legacyRecords : Object.values(legacyRecords as Record<string, unknown>);
    return { recognized: true, authoritative: false, records: parseLocalButtonRecords(values) };
  }

  return { recognized: false, authoritative: false, records: [] };
};

export const buildButtonLibraryEnvelope = (
  records: SavedButtonRecord[],
  existingValue?: unknown,
): ButtonLibraryEnvelope => {
  const existingPresets = existingValue && typeof existingValue === 'object'
    && (existingValue as Record<string, unknown>).presets
    && typeof (existingValue as Record<string, unknown>).presets === 'object'
    ? (existingValue as { presets: Record<string, Record<string, unknown>> }).presets
    : {};
  const presets: Record<string, SharedButtonPreset | Record<string, unknown>> = {};

  Object.entries(existingPresets).forEach(([slug, preset]) => {
    if (!preset || typeof preset !== 'object' || !('button_builder' in preset)) presets[slug] = clone(preset);
  });

  records.forEach((record) => {
    const cleanRecord = clone(record);
    const slug = record.id;
    presets[slug] = {
      slug,
      name: record.name,
      kind: 'button',
      note: [record.folder ? `Folder: ${record.folder}` : '', record.tags.length ? `Tags: ${record.tags.join(', ')}` : '']
        .filter(Boolean)
        .join(' · ') || undefined,
      layers: buildSharedButtonLayers(record),
      button_builder: {
        record_version: 1,
        record: cleanRecord,
      },
    };
  });

  return {
    button_builder_library: BUTTON_LIBRARY_VERSION,
    migration_complete: true,
    presets,
  };
};

const hassConnection = (): any | null => getHass()?.connection || null;

export const hasSystemButtonLibraryConnection = (): boolean => {
  const hass = getHass();
  return Boolean(hass?.connection && hass?.user?.is_admin !== false);
};

export const readSystemButtonLibrary = async (): Promise<unknown> => {
  const connection = hassConnection();
  if (!connection?.sendMessagePromise) throw new Error('Home Assistant connection unavailable');
  const response = await connection.sendMessagePromise({
    type: 'frontend/get_system_data',
    key: BUTTON_LIBRARY_KEY,
  });
  return response?.value ?? null;
};

export const writeSystemButtonLibrary = async (value: ButtonLibraryEnvelope): Promise<void> => {
  const connection = hassConnection();
  if (!connection?.sendMessagePromise) throw new Error('Home Assistant connection unavailable');
  await connection.sendMessagePromise({
    type: 'frontend/set_system_data',
    key: BUTTON_LIBRARY_KEY,
    value,
  });
};

export const subscribeSystemButtonLibrary = (
  onChange: (value: unknown) => void,
): Promise<() => void> | null => {
  const connection = hassConnection();
  if (!connection?.subscribeMessage) return null;
  return connection.subscribeMessage(
    (message: { value?: unknown }) => onChange(message?.value ?? null),
    { type: 'frontend/subscribe_system_data', key: BUTTON_LIBRARY_KEY },
  );
};
