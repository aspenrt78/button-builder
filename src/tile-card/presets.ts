// Tile Card Presets — common starting points for tile cards

import type { TileCardConfig } from './types';
import { DEFAULT_TILE_CONFIG } from './types';

export interface TilePreset {
  name: string;
  description: string;
  category: 'lighting' | 'climate' | 'media' | 'security' | 'sensors' | 'home';
  config: Partial<TileCardConfig>;
}

export const TILE_PRESET_CATEGORIES: Array<{ value: TilePreset['category'] | 'all'; label: string }> = [
  { value: 'all', label: 'All Categories' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'climate', label: 'Climate' },
  { value: 'media', label: 'Media' },
  { value: 'security', label: 'Security' },
  { value: 'sensors', label: 'Sensors' },
  { value: 'home', label: 'Home' },
];

export const TILE_PRESETS: TilePreset[] = [
  {
    name: 'Dimmable Light',
    description: 'Light tile with a brightness slider feature',
    category: 'lighting',
    config: {
      entity: 'light.living_room',
      color: 'amber',
      tap_action: { action: 'toggle' },
      features: [{ type: 'light-brightness' }],
      features_position: 'bottom',
    },
  },
  {
    name: 'Light + Color Temp',
    description: 'Brightness and color temperature sliders',
    category: 'lighting',
    config: {
      entity: 'light.bedroom',
      color: 'amber',
      tap_action: { action: 'toggle' },
      features: [{ type: 'light-brightness' }, { type: 'light-color-temp' }],
      features_position: 'bottom',
    },
  },
  {
    name: 'Thermostat',
    description: 'Climate tile with HVAC modes and target temperature',
    category: 'climate',
    config: {
      entity: 'climate.living_room',
      color: 'orange',
      features: [
        { type: 'climate-hvac-modes', style: 'icons', hvac_modes: ['heat', 'cool', 'off'] },
        { type: 'target-temperature' },
      ],
      features_position: 'bottom',
    },
  },
  {
    name: 'Fan Speed',
    description: 'Fan tile with speed slider',
    category: 'climate',
    config: {
      entity: 'fan.bedroom',
      color: 'cyan',
      tap_action: { action: 'toggle' },
      features: [{ type: 'fan-speed' }],
      features_position: 'bottom',
    },
  },
  {
    name: 'Media Player',
    description: 'Playback controls with a volume slider',
    category: 'media',
    config: {
      entity: 'media_player.living_room',
      color: 'pink',
      state_content: ['state', 'media_title'],
      features: [
        { type: 'media-player-playback' },
        { type: 'media-player-volume-slider' },
      ],
      features_position: 'bottom',
    },
  },
  {
    name: 'Smart Lock',
    description: 'Lock tile with lock/unlock commands',
    category: 'security',
    config: {
      entity: 'lock.front_door',
      color: 'red',
      features: [{ type: 'lock-commands' }],
      features_position: 'bottom',
    },
  },
  {
    name: 'Alarm Panel',
    description: 'Alarm tile with arm home / arm away / disarm',
    category: 'security',
    config: {
      entity: 'alarm_control_panel.home',
      color: 'deep-orange',
      features: [{ type: 'alarm-modes', modes: ['armed_home', 'armed_away', 'disarmed'] }],
      features_position: 'bottom',
    },
  },
  {
    name: 'Garage Door',
    description: 'Cover tile with open/close buttons and position slider',
    category: 'security',
    config: {
      entity: 'cover.garage_door',
      color: 'blue-grey',
      features: [{ type: 'cover-open-close' }, { type: 'cover-position' }],
      features_position: 'bottom',
    },
  },
  {
    name: 'Temperature Trend',
    description: 'Sensor tile with a trend graph',
    category: 'sensors',
    config: {
      entity: 'sensor.living_room_temperature',
      color: 'teal',
      features: [{ type: 'trend-graph', hours_to_show: 24 }],
      features_position: 'bottom',
    },
  },
  {
    name: 'Battery Gauge',
    description: 'Sensor tile with a bar gauge (0–100)',
    category: 'sensors',
    config: {
      entity: 'sensor.phone_battery',
      color: 'green',
      features: [{ type: 'bar-gauge', min: 0, max: 100 }],
      features_position: 'bottom',
    },
  },
  {
    name: 'Vacuum',
    description: 'Vacuum tile with start/pause and return-home commands',
    category: 'home',
    config: {
      entity: 'vacuum.robot',
      color: 'indigo',
      features: [{ type: 'vacuum-commands', commands: ['start_pause', 'return_home'] }],
      features_position: 'bottom',
    },
  },
  {
    name: 'Vertical Tile',
    description: 'Compact vertical layout, icon above the name',
    category: 'home',
    config: {
      entity: 'switch.coffee_maker',
      color: 'brown',
      vertical: true,
      tap_action: { action: 'toggle' },
    },
  },
];

export const applyTilePreset = (preset: TilePreset): TileCardConfig => ({
  ...DEFAULT_TILE_CONFIG,
  ...structuredClone(preset.config),
});
