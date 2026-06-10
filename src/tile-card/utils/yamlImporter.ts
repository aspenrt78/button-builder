// Tile Card YAML Importer
// Parses Home Assistant tile card YAML back into a TileCardConfig

import YAML from 'yaml';
import type { TileCardConfig, TileAction, TileActionType, TileFeature, FeatureType, StateContentType } from '../types';
import { DEFAULT_TILE_CONFIG } from '../types';

const VALID_ACTIONS: TileActionType[] = ['more-info', 'toggle', 'perform-action', 'navigate', 'url', 'assist', 'fire-dom-event', 'none'];

const KNOWN_FEATURE_TYPES: FeatureType[] = [
  'alarm-modes',
  'climate-hvac-modes', 'climate-fan-modes', 'climate-preset-modes',
  'climate-swing-modes', 'climate-swing-horizontal-modes', 'target-temperature',
  'cover-open-close', 'cover-position', 'cover-position-favorite',
  'cover-tilt', 'cover-tilt-position', 'cover-tilt-favorite',
  'fan-speed', 'fan-direction', 'fan-oscillate', 'fan-preset-modes',
  'light-brightness', 'light-color-temp', 'light-color-favorites',
  'lock-commands', 'lock-open-door',
  'media-player-playback', 'media-player-volume-slider', 'media-player-volume-buttons',
  'media-player-sound-mode', 'media-player-source',
  'humidifier-toggle', 'humidifier-modes', 'target-humidity',
  'vacuum-commands', 'lawn-mower-commands',
  'valve-open-close', 'valve-position', 'valve-position-favorite',
  'water-heater-operation-modes',
  'toggle', 'button', 'select-options', 'numeric-input', 'date-set', 'counter-actions', 'update-actions',
  'bar-gauge', 'trend-graph',
  'temperature-forecast', 'precipitation-forecast',
  'area-controls',
];

const ENTITY_ID_RE = /^[a-z_]+\.[a-z0-9_]+$/;

// state_content special values used hyphens in older builds; HA uses underscores.
const normalizeStateContent = (value: string): string => {
  if (value === 'last-changed') return 'last_changed';
  if (value === 'last-updated') return 'last_updated';
  return value;
};

const parseTargetIds = (value: unknown): string | string[] | undefined => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const ids = value.filter((v): v is string => typeof v === 'string');
    if (ids.length === 0) return undefined;
    return ids.length === 1 ? ids[0] : ids;
  }
  return undefined;
};

const parseAction = (raw: unknown): TileAction | undefined => {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, unknown>;
  let action = String(obj.action || '');
  // HA renamed call-service to perform-action (2024.8); normalize legacy configs.
  if (action === 'call-service') action = 'perform-action';
  if (!VALID_ACTIONS.includes(action as TileActionType)) return undefined;

  const result: TileAction = { action: action as TileActionType };
  if (typeof obj.navigation_path === 'string') result.navigation_path = obj.navigation_path;
  if (typeof obj.navigation_replace === 'boolean') result.navigation_replace = obj.navigation_replace;
  if (typeof obj.url_path === 'string') result.url_path = obj.url_path;
  // Accept both the legacy `service:` key and the newer `perform_action:` key.
  if (typeof obj.perform_action === 'string') {
    result.perform_action = obj.perform_action;
  } else if (typeof obj.service === 'string') {
    result.perform_action = obj.service;
  }
  if (typeof obj.pipeline_id === 'string') result.pipeline_id = obj.pipeline_id;
  if (typeof obj.start_listening === 'boolean') result.start_listening = obj.start_listening;
  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    result.data = obj.data as Record<string, unknown>;
  }
  if (obj.target && typeof obj.target === 'object') {
    const target = obj.target as Record<string, unknown>;
    const parsedTarget: NonNullable<TileAction['target']> = {};
    const entityId = parseTargetIds(target.entity_id);
    const deviceId = parseTargetIds(target.device_id);
    const areaId = parseTargetIds(target.area_id);
    if (entityId !== undefined) parsedTarget.entity_id = entityId;
    if (deviceId !== undefined) parsedTarget.device_id = deviceId;
    if (areaId !== undefined) parsedTarget.area_id = areaId;
    if (Object.keys(parsedTarget).length > 0) result.target = parsedTarget;
  }
  if (obj.confirmation === true) {
    result.confirmation = true;
  } else if (obj.confirmation && typeof obj.confirmation === 'object' && !Array.isArray(obj.confirmation)) {
    const confirmation = obj.confirmation as Record<string, unknown>;
    result.confirmation = typeof confirmation.text === 'string' ? { text: confirmation.text } : true;
  }
  return result;
};

const parseFeature = (raw: unknown): TileFeature | undefined => {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, unknown>;
  let type = String(obj.type || '');
  // The date feature was documented as `date` in older builds; HA uses `date-set`.
  if (type === 'date') type = 'date-set';
  if (!KNOWN_FEATURE_TYPES.includes(type as FeatureType)) return undefined;

  // Keep all recognized keys; the generator only emits known ones so a
  // shallow copy keyed on a valid type is safe.
  const feature = { ...obj, type } as unknown as TileFeature;
  return feature;
};

/**
 * Parse tile card YAML into a TileCardConfig.
 * Throws with a user-readable message when the YAML is invalid or not a tile card.
 */
export function parseTileCardYaml(yamlString: string): TileCardConfig {
  let parsed: unknown;
  try {
    parsed = YAML.parse(yamlString);
  } catch (e) {
    throw new Error(`YAML syntax error: ${e instanceof Error ? e.message : String(e)}`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Expected a single tile card configuration (a YAML mapping).');
  }

  const obj = parsed as Record<string, unknown>;
  if (obj.type !== undefined && obj.type !== 'tile') {
    throw new Error(`This is a "${obj.type}" card, not a tile card.`);
  }

  const config: TileCardConfig = { ...DEFAULT_TILE_CONFIG, features: [] };

  if (typeof obj.entity === 'string' && ENTITY_ID_RE.test(obj.entity)) {
    config.entity = obj.entity;
  }
  if (obj.name !== undefined) config.name = String(obj.name);
  if (typeof obj.icon === 'string') config.icon = obj.icon;
  if (typeof obj.color === 'string') config.color = obj.color;
  if (typeof obj.show_entity_picture === 'boolean') config.show_entity_picture = obj.show_entity_picture;
  if (typeof obj.vertical === 'boolean') config.vertical = obj.vertical;
  if (typeof obj.hide_state === 'boolean') config.hide_state = obj.hide_state;

  if (typeof obj.state_content === 'string') {
    config.state_content = [normalizeStateContent(obj.state_content) as StateContentType];
  } else if (Array.isArray(obj.state_content)) {
    config.state_content = obj.state_content
      .filter((v): v is string => typeof v === 'string')
      .map(normalizeStateContent);
  }

  config.tap_action = parseAction(obj.tap_action);
  config.hold_action = parseAction(obj.hold_action);
  config.double_tap_action = parseAction(obj.double_tap_action);
  config.icon_tap_action = parseAction(obj.icon_tap_action);
  config.icon_hold_action = parseAction(obj.icon_hold_action);
  config.icon_double_tap_action = parseAction(obj.icon_double_tap_action);

  if (Array.isArray(obj.features)) {
    config.features = obj.features
      .map(parseFeature)
      .filter((f): f is TileFeature => f !== undefined);
  }

  if (obj.features_position === 'bottom' || obj.features_position === 'inline') {
    config.features_position = obj.features_position;
  }

  if (obj.grid_options && typeof obj.grid_options === 'object') {
    const grid = obj.grid_options as Record<string, unknown>;
    const gridOptions: NonNullable<TileCardConfig['grid_options']> = {};
    if (typeof grid.rows === 'number') gridOptions.rows = grid.rows;
    if (typeof grid.columns === 'number' || grid.columns === 'full') {
      gridOptions.columns = grid.columns as number | 'full';
    }
    if (Object.keys(gridOptions).length > 0) config.grid_options = gridOptions;
  }

  return config;
}
