// Bubble Card Constants & Defaults

import { 
  BubbleButtonConfig, 
  BubbleSubButton,
  BubbleAction,
  BubbleCardType,
  BubbleButtonType,
  BubbleCardLayout 
} from './types';

// ============================================
// DEFAULT ACTION
// ============================================

export const DEFAULT_ACTION: BubbleAction = {
  action: 'more-info',
};

// ============================================
// DEFAULT SUB-BUTTON
// ============================================

export const DEFAULT_SUB_BUTTON: BubbleSubButton = {
  id: '',
  entity: '',
  name: '',
  icon: '',
  show_background: true,
  show_state: false,
  show_name: false,
  show_icon: true,
  show_last_changed: false,
  show_last_updated: false,
  show_attribute: false,
  attribute: '',
};

// ============================================
// DEFAULT BUTTON CONFIG
// ============================================

export const DEFAULT_BUBBLE_BUTTON_CONFIG: BubbleButtonConfig = {
  card_type: 'button',
  entity: '',
  button_type: 'switch',
  name: '',
  icon: '',
  force_icon: false,
  
  // Visibility
  show_name: true,
  show_icon: true,
  show_state: false,
  show_last_changed: false,
  show_last_updated: false,
  show_attribute: false,
  attribute: '',
  scrolling_effect: true,
  use_accent_color: false,
  
  // Layout
  card_layout: 'normal',
  rows: 1,
  
  // Actions - undefined means use defaults
  tap_action: undefined,
  double_tap_action: undefined,
  hold_action: undefined,
  
  // Sub-buttons
  sub_button: [],
  
  // Slider options
  min_value: 0,
  max_value: 100,
  step: 1,
  tap_to_slide: false,
  relative_slide: false,
  read_only_slider: false,
  slider_live_update: false,
  allow_light_slider_to_0: false,
  light_transition: false,
  light_transition_time: 500,
  
  // Styles
  styles: '',
};

// ============================================
// CARD TYPE OPTIONS
// ============================================

export const CARD_TYPE_OPTIONS: { value: BubbleCardType; label: string; description: string }[] = [
  { value: 'button', label: 'Button', description: 'Versatile button with switch, slider, state, or name modes' },
  { value: 'separator', label: 'Separator', description: 'Divider for organizing your dashboard sections' },
  { value: 'pop-up', label: 'Pop-up', description: 'Converts a vertical stack into a pop-up overlay' },
  { value: 'cover', label: 'Cover', description: 'Control blinds, shutters, and other cover entities' },
  { value: 'media-player', label: 'Media Player', description: 'Control media players with playback controls' },
  { value: 'climate', label: 'Climate', description: 'Control thermostats and climate entities' },
  { value: 'select', label: 'Select', description: 'Dropdown menu for input_select entities' },
  { value: 'calendar', label: 'Calendar', description: 'Display calendar events' },
  { value: 'horizontal-buttons-stack', label: 'Horizontal Buttons Stack', description: 'Scrollable footer buttons for navigation' },
  { value: 'empty-column', label: 'Empty Column', description: 'Fill empty space in horizontal stacks' },
];

// ============================================
// BUTTON TYPE OPTIONS
// ============================================

export const BUTTON_TYPE_OPTIONS: { value: BubbleButtonType; label: string; description: string }[] = [
  { value: 'switch', label: 'Switch', description: 'Toggle entities on/off, background changes with state' },
  { value: 'slider', label: 'Slider', description: 'Control brightness, volume, or other ranges' },
  { value: 'state', label: 'State', description: 'Display sensor info, opens more-info on press' },
  { value: 'name', label: 'Name/Text', description: 'Display text without entity, add custom actions' },
];

// ============================================
// CARD LAYOUT OPTIONS
// ============================================

export const CARD_LAYOUT_OPTIONS: { value: BubbleCardLayout; label: string; description: string }[] = [
  { value: 'normal', label: 'Normal', description: 'Standard layout' },
  { value: 'large', label: 'Large', description: 'Bigger card, optimized for section view' },
  { value: 'large-2-rows', label: 'Large (2 Rows)', description: 'Large with 2 rows of sub-buttons' },
  { value: 'large-sub-buttons-grid', label: 'Sub-buttons Grid', description: 'Sub-buttons in a grid layout' },
];

// ============================================
// ACTION TYPE OPTIONS
// ============================================

export const ACTION_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'more-info', label: 'More Info' },
  { value: 'toggle', label: 'Toggle' },
  { value: 'call-service', label: 'Call Service' },
  { value: 'navigate', label: 'Navigate' },
  { value: 'url', label: 'Open URL' },
  { value: 'fire-dom-event', label: 'Fire DOM Event' },
  { value: 'none', label: 'None' },
];

// ============================================
// COMMON ICONS
// ============================================

export const COMMON_BUBBLE_ICONS = [
  'mdi:lightbulb',
  'mdi:lightbulb-outline',
  'mdi:lamp',
  'mdi:ceiling-light',
  'mdi:floor-lamp',
  'mdi:led-strip-variant',
  'mdi:power',
  'mdi:power-plug',
  'mdi:power-socket',
  'mdi:fan',
  'mdi:air-conditioner',
  'mdi:thermostat',
  'mdi:thermometer',
  'mdi:home',
  'mdi:home-outline',
  'mdi:door',
  'mdi:door-open',
  'mdi:window-closed',
  'mdi:window-open',
  'mdi:garage',
  'mdi:gate',
  'mdi:blinds',
  'mdi:roller-shade',
  'mdi:curtains',
  'mdi:lock',
  'mdi:lock-open',
  'mdi:shield-home',
  'mdi:cctv',
  'mdi:motion-sensor',
  'mdi:speaker',
  'mdi:cast',
  'mdi:television',
  'mdi:play',
  'mdi:pause',
  'mdi:stop',
  'mdi:skip-next',
  'mdi:skip-previous',
  'mdi:volume-high',
  'mdi:volume-low',
  'mdi:volume-off',
  'mdi:robot-vacuum',
  'mdi:washing-machine',
  'mdi:dishwasher',
  'mdi:fridge',
  'mdi:coffee',
  'mdi:water',
  'mdi:water-pump',
  'mdi:sprinkler',
  'mdi:battery',
  'mdi:battery-charging',
  'mdi:car',
  'mdi:ev-station',
  'mdi:weather-sunny',
  'mdi:weather-cloudy',
  'mdi:weather-rainy',
  'mdi:calendar',
  'mdi:clock',
  'mdi:cog',
  'mdi:information',
];

// ============================================
// STORAGE KEY
// ============================================

export const BUBBLE_STORAGE_KEY = 'bubble-card-builder-config';

// ============================================
// CSS VARIABLE DEFAULTS
// ============================================

export const DEFAULT_CSS_VARIABLES = {
  '--bubble-border-radius': '32px',
  '--bubble-main-background-color': 'var(--ha-card-background)',
  '--bubble-secondary-background-color': 'rgba(255, 255, 255, 0.1)',
  '--bubble-accent-color': 'var(--primary-color)',
  '--bubble-icon-border-radius': '50%',
  '--bubble-icon-background-color': 'var(--bubble-secondary-background-color)',
  '--bubble-sub-button-border-radius': '32px',
  '--bubble-sub-button-background-color': 'var(--bubble-secondary-background-color)',
};

// ============================================
// SLIDER ENTITY SUPPORT
// ============================================

export const SLIDER_SUPPORTED_DOMAINS = [
  'light',
  'media_player',
  'cover',
  'fan',
  'climate',
  'input_number',
  'number',
];

export const SLIDER_DOMAIN_ATTRIBUTES: Record<string, { attribute: string; min: number; max: number }> = {
  light: { attribute: 'brightness', min: 0, max: 255 },
  media_player: { attribute: 'volume_level', min: 0, max: 1 },
  cover: { attribute: 'current_position', min: 0, max: 100 },
  fan: { attribute: 'percentage', min: 0, max: 100 },
  climate: { attribute: 'temperature', min: 16, max: 30 },
  input_number: { attribute: 'state', min: 0, max: 100 },
  number: { attribute: 'state', min: 0, max: 100 },
};
