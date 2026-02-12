export interface EntityCapabilities {
  domain: string;
  supportsToggleAction: boolean;
  toggleFallbackService: string | null;
  supportsLiveStream: boolean;
  hasOnOffState: boolean;
}

const NON_TOGGLE_DOMAINS = new Set([
  'sensor',
  'binary_sensor',
  'person',
  'device_tracker',
  'weather',
  'sun',
  'zone',
  'calendar',
  'todo',
  'event',
  'update',
  'counter',
  'number',
  'select',
  'text',
  'input_number',
  'input_select',
  'input_text'
]);

const BINARY_STATE_DOMAINS = new Set([
  'light',
  'switch',
  'fan',
  'input_boolean',
  'automation',
  'script',
  'binary_sensor',
  'humidifier',
  'water_heater',
  'siren',
  'alarm_control_panel',
  'remote'
]);

export const getEntityDomain = (entityId: string): string => {
  if (!entityId || !entityId.includes('.')) return '';
  return entityId.split('.')[0];
};

export const getToggleFallbackService = (entityId: string): string | null => {
  const domain = getEntityDomain(entityId);
  switch (domain) {
    case 'button':
    case 'input_button':
      return `${domain}.press`;
    case 'scene':
      return 'scene.turn_on';
    case 'script':
      return 'script.turn_on';
    default:
      return null;
  }
};

export const supportsToggleAction = (entityId: string): boolean => {
  const domain = getEntityDomain(entityId);
  if (!domain) return true;
  if (getToggleFallbackService(entityId)) return false;
  return !NON_TOGGLE_DOMAINS.has(domain);
};

export const supportsLiveStream = (entityId: string): boolean => {
  return getEntityDomain(entityId) === 'camera';
};

export const hasOnOffState = (entityId: string, currentState?: string): boolean => {
  const normalizedState = (currentState || '').toLowerCase();
  if (normalizedState === 'on' || normalizedState === 'off') return true;
  const domain = getEntityDomain(entityId);
  return BINARY_STATE_DOMAINS.has(domain);
};

export const getEntityCapabilities = (entityId: string, currentState?: string): EntityCapabilities => {
  const domain = getEntityDomain(entityId);
  return {
    domain,
    supportsToggleAction: supportsToggleAction(entityId),
    toggleFallbackService: getToggleFallbackService(entityId),
    supportsLiveStream: supportsLiveStream(entityId),
    hasOnOffState: hasOnOffState(entityId, currentState),
  };
};

