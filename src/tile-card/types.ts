// Tile Card Types
// Based on https://www.home-assistant.io/dashboards/tile/

// ============================================
// TILE CARD CONFIGURATION
// ============================================

export type TileCardColor = 
  | 'state'
  | 'primary'
  | 'accent'
  | 'disabled'
  | 'red'
  | 'pink'
  | 'purple'
  | 'deep-purple'
  | 'indigo'
  | 'blue'
  | 'light-blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'light-green'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'deep-orange'
  | 'brown'
  | 'grey'
  | 'blue-grey'
  | 'black'
  | 'white';

export type StateContentType =
  | 'state'
  | 'last_changed'
  | 'last_updated'
  | string; // Any entity attribute

export type FeaturesPosition = 'bottom' | 'inline';

// ============================================
// ACTIONS
// ============================================

export type TileActionType =
  | 'more-info'
  | 'toggle'
  | 'perform-action'
  | 'navigate'
  | 'url'
  | 'assist'
  | 'fire-dom-event'
  | 'none';

export interface TileAction {
  action: TileActionType;
  navigation_path?: string;
  /** Replace the current page in browser history when navigating. */
  navigation_replace?: boolean;
  url_path?: string;
  /** Action to perform, e.g. "light.turn_on" (replaces the deprecated `service`). */
  perform_action?: string;
  data?: Record<string, unknown>;
  target?: {
    entity_id?: string | string[];
    device_id?: string | string[];
    area_id?: string | string[];
  };
  /** Assist pipeline id (defaults to last_used). */
  pipeline_id?: string;
  /** Start listening immediately when the assist dialog opens. */
  start_listening?: boolean;
  /** Require confirmation before running the action. */
  confirmation?: boolean | { text?: string };
}

// ============================================
// FEATURES
// ============================================

export type FeatureType =
  // Alarm
  | 'alarm-modes'
  // Climate
  | 'climate-hvac-modes'
  | 'climate-fan-modes'
  | 'climate-preset-modes'
  | 'climate-swing-modes'
  | 'climate-swing-horizontal-modes'
  | 'target-temperature'
  // Cover
  | 'cover-open-close'
  | 'cover-position'
  | 'cover-position-favorite'
  | 'cover-tilt'
  | 'cover-tilt-position'
  | 'cover-tilt-favorite'
  // Fan
  | 'fan-speed'
  | 'fan-direction'
  | 'fan-oscillate'
  | 'fan-preset-modes'
  // Light
  | 'light-brightness'
  | 'light-color-temp'
  | 'light-color-favorites'
  // Lock
  | 'lock-commands'
  | 'lock-open-door'
  // Media Player
  | 'media-player-playback'
  | 'media-player-volume-slider'
  | 'media-player-volume-buttons'
  | 'media-player-sound-mode'
  | 'media-player-source'
  // Humidifier
  | 'humidifier-toggle'
  | 'humidifier-modes'
  | 'target-humidity'
  // Vacuum
  | 'vacuum-commands'
  // Lawn Mower
  | 'lawn-mower-commands'
  // Valve
  | 'valve-open-close'
  | 'valve-position'
  | 'valve-position-favorite'
  // Water Heater
  | 'water-heater-operation-modes'
  // General
  | 'toggle'
  | 'button'
  | 'select-options'
  | 'numeric-input'
  | 'date-set'
  | 'counter-actions'
  | 'update-actions'
  // Sensors
  | 'bar-gauge'
  | 'trend-graph'
  // Weather
  | 'temperature-forecast'
  | 'precipitation-forecast'
  // Area
  | 'area-controls';

export type FeatureStyle = 'dropdown' | 'icons' | 'buttons' | 'slider';

// Base feature interface
export interface BaseFeature {
  type: FeatureType;
}

// Alarm modes
export interface AlarmModesFeature extends BaseFeature {
  type: 'alarm-modes';
  modes: ('armed_home' | 'armed_away' | 'armed_night' | 'armed_vacation' | 'armed_custom_bypass' | 'disarmed')[];
}

// Climate features
export interface ClimateHvacModesFeature extends BaseFeature {
  type: 'climate-hvac-modes';
  style?: 'dropdown' | 'icons';
  hvac_modes: ('auto' | 'heat_cool' | 'heat' | 'cool' | 'dry' | 'fan_only' | 'off')[];
}

export interface ClimateFanModesFeature extends BaseFeature {
  type: 'climate-fan-modes';
  style?: 'dropdown' | 'icons';
  fan_modes: string[];
}

export interface ClimatePresetModesFeature extends BaseFeature {
  type: 'climate-preset-modes';
  style?: 'dropdown' | 'icons';
  preset_modes: string[];
}

export interface ClimateSwingModesFeature extends BaseFeature {
  type: 'climate-swing-modes';
  style?: 'dropdown' | 'icons';
  swing_modes?: string[];
}

export interface ClimateSwingHorizontalModesFeature extends BaseFeature {
  type: 'climate-swing-horizontal-modes';
  style?: 'dropdown' | 'icons';
  swing_horizontal_modes?: string[];
}

export interface TargetTemperatureFeature extends BaseFeature {
  type: 'target-temperature';
}

// Cover features
export interface CoverOpenCloseFeature extends BaseFeature {
  type: 'cover-open-close';
}

export interface CoverPositionFeature extends BaseFeature {
  type: 'cover-position';
}

export interface CoverPositionFavoriteFeature extends BaseFeature {
  type: 'cover-position-favorite';
}

export interface CoverTiltFeature extends BaseFeature {
  type: 'cover-tilt';
}

export interface CoverTiltPositionFeature extends BaseFeature {
  type: 'cover-tilt-position';
}

export interface CoverTiltFavoriteFeature extends BaseFeature {
  type: 'cover-tilt-favorite';
}

// Fan features
export interface FanSpeedFeature extends BaseFeature {
  type: 'fan-speed';
}

export interface FanDirectionFeature extends BaseFeature {
  type: 'fan-direction';
}

export interface FanOscillateFeature extends BaseFeature {
  type: 'fan-oscillate';
}

export interface FanPresetModesFeature extends BaseFeature {
  type: 'fan-preset-modes';
  style?: 'dropdown' | 'icons';
  preset_modes: string[];
}

// Light features
export interface LightBrightnessFeature extends BaseFeature {
  type: 'light-brightness';
}

export interface LightColorTempFeature extends BaseFeature {
  type: 'light-color-temp';
}

export interface LightColorFavoritesFeature extends BaseFeature {
  type: 'light-color-favorites';
}

// Lock features
export interface LockCommandsFeature extends BaseFeature {
  type: 'lock-commands';
}

export interface LockOpenDoorFeature extends BaseFeature {
  type: 'lock-open-door';
}

// Media player features
export type MediaPlayerControl = 'on_off' | 'shuffle' | 'previous' | 'play_pause_stop' | 'next' | 'repeat';

export interface MediaPlayerPlaybackFeature extends BaseFeature {
  type: 'media-player-playback';
  controls?: MediaPlayerControl[];
}

export interface MediaPlayerVolumeSliderFeature extends BaseFeature {
  type: 'media-player-volume-slider';
  show_mute_button?: boolean;
}

export interface MediaPlayerVolumeButtonsFeature extends BaseFeature {
  type: 'media-player-volume-buttons';
  step?: number;
  show_mute_button?: boolean;
}

export interface MediaPlayerSoundModeFeature extends BaseFeature {
  type: 'media-player-sound-mode';
  sound_modes?: string[];
}

export interface MediaPlayerSourceFeature extends BaseFeature {
  type: 'media-player-source';
  sources?: string[];
}

// Humidifier features
export interface HumidifierToggleFeature extends BaseFeature {
  type: 'humidifier-toggle';
}

export interface HumidifierModesFeature extends BaseFeature {
  type: 'humidifier-modes';
  style?: 'dropdown' | 'icons';
  modes: string[];
}

export interface TargetHumidityFeature extends BaseFeature {
  type: 'target-humidity';
}

// Vacuum features
export interface VacuumCommandsFeature extends BaseFeature {
  type: 'vacuum-commands';
  commands: ('start_pause' | 'stop' | 'clean_spot' | 'locate' | 'return_home')[];
}

// Lawn mower features
export interface LawnMowerCommandsFeature extends BaseFeature {
  type: 'lawn-mower-commands';
  commands: ('start_pause' | 'dock')[];
}

// Valve features
export interface ValveOpenCloseFeature extends BaseFeature {
  type: 'valve-open-close';
}

export interface ValvePositionFeature extends BaseFeature {
  type: 'valve-position';
}

export interface ValvePositionFavoriteFeature extends BaseFeature {
  type: 'valve-position-favorite';
}

// Water heater features
export interface WaterHeaterOperationModesFeature extends BaseFeature {
  type: 'water-heater-operation-modes';
  operation_modes: string[];
}

// General features
export interface ToggleFeature extends BaseFeature {
  type: 'toggle';
}

export interface ButtonFeature extends BaseFeature {
  type: 'button';
  action_name?: string;
  data?: Record<string, unknown>;
}

export interface SelectOptionsFeature extends BaseFeature {
  type: 'select-options';
  options?: string[];
}

export interface NumericInputFeature extends BaseFeature {
  type: 'numeric-input';
  style?: 'slider' | 'buttons';
}

export interface DateSetFeature extends BaseFeature {
  type: 'date-set';
}

export interface CounterActionsFeature extends BaseFeature {
  type: 'counter-actions';
  actions: ('increment' | 'decrement' | 'reset')[];
}

export interface UpdateActionsFeature extends BaseFeature {
  type: 'update-actions';
  backup?: 'ask' | 'yes' | 'no';
}

// Sensor features
export interface BarGaugeFeature extends BaseFeature {
  type: 'bar-gauge';
  min?: number;
  max?: number;
}

export interface TrendGraphFeature extends BaseFeature {
  type: 'trend-graph';
  hours_to_show?: number;
  detail?: boolean;
}

// Weather features
export type ForecastType = 'daily' | 'hourly' | 'twice_daily';

export interface TemperatureForecastFeature extends BaseFeature {
  type: 'temperature-forecast';
  forecast_type?: ForecastType;
  days_to_show?: number;
  hours_to_show?: number;
  color?: string;
  show_labels?: boolean;
}

export interface PrecipitationForecastFeature extends BaseFeature {
  type: 'precipitation-forecast';
  forecast_type?: ForecastType;
  precipitation_type?: 'precipitation' | 'precipitation_probability';
  days_to_show?: number;
  hours_to_show?: number;
  color?: string;
  show_labels?: boolean;
}

// Area features
export interface AreaControlsFeature extends BaseFeature {
  type: 'area-controls';
  controls: ('light' | 'fan' | 'switch')[];
}

// Union type for all features
export type TileFeature =
  | AlarmModesFeature
  | ClimateHvacModesFeature
  | ClimateFanModesFeature
  | ClimatePresetModesFeature
  | ClimateSwingModesFeature
  | ClimateSwingHorizontalModesFeature
  | TargetTemperatureFeature
  | CoverOpenCloseFeature
  | CoverPositionFeature
  | CoverPositionFavoriteFeature
  | CoverTiltFeature
  | CoverTiltPositionFeature
  | CoverTiltFavoriteFeature
  | FanSpeedFeature
  | FanDirectionFeature
  | FanOscillateFeature
  | FanPresetModesFeature
  | LightBrightnessFeature
  | LightColorTempFeature
  | LightColorFavoritesFeature
  | LockCommandsFeature
  | LockOpenDoorFeature
  | MediaPlayerPlaybackFeature
  | MediaPlayerVolumeSliderFeature
  | MediaPlayerVolumeButtonsFeature
  | MediaPlayerSoundModeFeature
  | MediaPlayerSourceFeature
  | HumidifierToggleFeature
  | HumidifierModesFeature
  | TargetHumidityFeature
  | VacuumCommandsFeature
  | LawnMowerCommandsFeature
  | ValveOpenCloseFeature
  | ValvePositionFeature
  | ValvePositionFavoriteFeature
  | WaterHeaterOperationModesFeature
  | ToggleFeature
  | ButtonFeature
  | SelectOptionsFeature
  | NumericInputFeature
  | DateSetFeature
  | CounterActionsFeature
  | UpdateActionsFeature
  | BarGaugeFeature
  | TrendGraphFeature
  | TemperatureForecastFeature
  | PrecipitationForecastFeature
  | AreaControlsFeature;

// ============================================
// MAIN TILE CARD CONFIG
// ============================================

export interface TileCardConfig {
  entity: string;
  name?: string;
  icon?: string;
  color?: TileCardColor | string; // Can be color name or hex
  show_entity_picture?: boolean;
  vertical?: boolean;
  hide_state?: boolean;
  state_content?: StateContentType[];
  tap_action?: TileAction;
  hold_action?: TileAction;
  double_tap_action?: TileAction;
  icon_tap_action?: TileAction;
  icon_hold_action?: TileAction;
  icon_double_tap_action?: TileAction;
  features?: TileFeature[];
  features_position?: FeaturesPosition;
  /** Card sizing in HA sections-view grids. */
  grid_options?: {
    rows?: number;
    columns?: number | 'full';
  };
}

export interface SavedTileRecord {
  id: string;
  name: string;
  folder: string;
  tags: string[];
  yaml: string;
  config: TileCardConfig;
  createdAt: number;
  updatedAt: number;
}

// Default configuration
export const DEFAULT_TILE_CONFIG: TileCardConfig = {
  entity: '',
  color: 'state',
  show_entity_picture: false,
  vertical: false,
  hide_state: false,
  state_content: ['state'],
  features_position: 'bottom',
  features: [],
};
