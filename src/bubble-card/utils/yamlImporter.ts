import YAML from 'yaml';
import { BubbleCardType, BubbleConfig } from '../types';
import { CARD_TYPE_OPTIONS } from '../constants';

const VALID_CARD_TYPES = new Set<string>(CARD_TYPE_OPTIONS.map(option => option.value));

export interface ParsedBubbleYaml {
  card_type: BubbleCardType;
  [key: string]: unknown;
}

export const parseBubbleCardYaml = (yamlString: string): ParsedBubbleYaml => {
  const parsed = YAML.parse(yamlString);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid YAML structure. Paste a single bubble-card configuration.');
  }

  const cardType = (parsed as Record<string, unknown>).card_type;
  if (typeof cardType !== 'string' || !VALID_CARD_TYPES.has(cardType)) {
    throw new Error(
      cardType
        ? `Unknown card_type "${String(cardType)}".`
        : 'Missing card_type. Bubble Card YAML must include a card_type field.'
    );
  }

  return parsed as ParsedBubbleYaml;
};

// Optional nested-action keys that have no entry in the defaults (adding `{}`
// defaults would make the generator emit empty mappings) but should survive import.
const OPTIONAL_OBJECT_KEYS = ['button_action', 'open_action', 'close_action', 'event_action', 'tap_action', 'double_tap_action', 'hold_action'];

/**
 * Whitelist-merge: only keys present in the defaults for the card type are
 * imported, coerced to the default's primitive type. Known optional action
 * objects are passed through even when absent from the defaults.
 */
export const mergeBubbleConfig = <T extends BubbleConfig>(defaults: T, raw: Record<string, unknown>): T => {
  const result: Record<string, unknown> = { ...defaults };

  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (!(key in raw)) continue;
    const value = raw[key];
    if (value === undefined || value === null) continue;

    if (typeof defaultValue === 'boolean') {
      result[key] = Boolean(value);
    } else if (typeof defaultValue === 'number') {
      result[key] = Number(value);
    } else if (typeof defaultValue === 'string') {
      result[key] = String(value);
    } else if (Array.isArray(defaultValue)) {
      if (Array.isArray(value)) result[key] = value;
    } else if (typeof defaultValue === 'object' && defaultValue !== null) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = { ...defaultValue, ...(value as Record<string, unknown>) };
      }
    } else {
      result[key] = value;
    }
  }

  for (const key of OPTIONAL_OBJECT_KEYS) {
    if (key in result && result[key] !== undefined) continue;
    const value = raw[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = value;
    }
  }

  return result as T;
};
