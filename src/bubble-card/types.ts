// Bubble Card Types
// Based on https://github.com/Clooos/Bubble-Card

// ============================================
// CARD TYPES
// ============================================

export type BubbleCardType = 
  | 'button'
  | 'separator'
  | 'pop-up'
  | 'cover'
  | 'media-player'
  | 'climate'
  | 'select'
  | 'calendar'
  | 'horizontal-buttons-stack'
  | 'empty-column';

export type BubbleButtonType = 'switch' | 'slider' | 'state' | 'name';

export type BubbleCardLayout = 'normal' | 'large' | 'large-2-rows' | 'large-sub-buttons-grid';

// ============================================
// ACTIONS
// ============================================

export type BubbleActionType = 
  | 'more-info'
  | 'toggle'
  | 'call-service'
  | 'navigate'
  | 'url'
  | 'fire-dom-event'
  | 'none';

export interface BubbleAction {
  action: BubbleActionType;
  navigation_path?: string;
  url_path?: string;
  service?: string;
  data?: Record<string, unknown>;
  service_data?: Record<string, unknown>;
  target?: {
    entity_id?: string | string[];
    device_id?: string | string[];
    area_id?: string | string[];
  };
  confirmation?: {
    text?: string;
    exemptions?: Array<{ user: string }>;
  };
}

// ============================================
// SUB-BUTTONS
// ============================================

export interface BubbleSubButton {
  id: string; // For React key
  entity?: string;
  name?: string;
  icon?: string;
  show_background?: boolean;
  show_state?: boolean;
  show_name?: boolean;
  show_icon?: boolean;
  show_last_changed?: boolean;
  show_last_updated?: boolean;
  show_attribute?: boolean;
  attribute?: string;
  select_attribute?: string;
  tap_action?: BubbleAction;
  double_tap_action?: BubbleAction;
  hold_action?: BubbleAction;
}

// ============================================
// MAIN CONFIG - BUTTON CARD
// ============================================

export interface BubbleButtonConfig {
  // Required
  card_type: 'button';
  
  // Entity & Display
  entity?: string;
  button_type: BubbleButtonType;
  name?: string;
  icon?: string;
  force_icon?: boolean;
  
  // Visibility
  show_name?: boolean;
  show_icon?: boolean;
  show_state?: boolean;
  show_last_changed?: boolean;
  show_last_updated?: boolean;
  show_attribute?: boolean;
  attribute?: string;
  scrolling_effect?: boolean;
  use_accent_color?: boolean;
  
  // Layout
  card_layout?: BubbleCardLayout;
  rows?: number;
  
  // Actions
  tap_action?: BubbleAction;
  double_tap_action?: BubbleAction;
  hold_action?: BubbleAction;
  button_action?: {
    tap_action?: BubbleAction;
    double_tap_action?: BubbleAction;
    hold_action?: BubbleAction;
  };
  
  // Sub-buttons
  sub_button?: BubbleSubButton[];
  
  // Slider options (when button_type is 'slider')
  min_value?: number;
  max_value?: number;
  step?: number;
  tap_to_slide?: boolean;
  relative_slide?: boolean;
  read_only_slider?: boolean;
  slider_live_update?: boolean;
  allow_light_slider_to_0?: boolean;
  light_transition?: boolean;
  light_transition_time?: number;
  
  // Custom styles
  styles?: string;
}

// ============================================
// MAIN CONFIG - SEPARATOR
// ============================================

export interface BubbleSeparatorConfig {
  card_type: 'separator';
  name?: string;
  icon?: string;
  card_layout?: BubbleCardLayout;
  rows?: number;
  sub_button?: BubbleSubButton[];
  styles?: string;
}

// ============================================
// MAIN CONFIG - POP-UP
// ============================================

export interface BubblePopUpConfig {
  card_type: 'pop-up';
  hash: string; // Required - e.g., '#kitchen'
  
  // Header (uses button options)
  entity?: string;
  name?: string;
  icon?: string;
  
  // Pop-up specific
  auto_close?: number;
  close_on_click?: boolean;
  close_by_clicking_outside?: boolean;
  width_desktop?: string;
  margin?: string;
  margin_top_mobile?: string;
  margin_top_desktop?: string;
  bg_color?: string;
  bg_opacity?: number;
  bg_blur?: number;
  shadow_opacity?: number;
  hide_backdrop?: boolean;
  background_update?: boolean;
  show_header?: boolean;
  
  // Trigger
  trigger_entity?: string;
  trigger_state?: string;
  trigger_close?: boolean;
  
  // Actions
  open_action?: BubbleAction;
  close_action?: BubbleAction;
  
  styles?: string;
}

// ============================================
// MAIN CONFIG - COVER
// ============================================

export interface BubbleCoverConfig {
  card_type: 'cover';
  entity: string;
  name?: string;
  force_icon?: boolean;
  show_name?: boolean;
  show_icon?: boolean;
  show_state?: boolean;
  show_last_changed?: boolean;
  show_last_updated?: boolean;
  show_attribute?: boolean;
  attribute?: string;
  scrolling_effect?: boolean;
  
  // Cover-specific icons
  icon_open?: string;
  icon_close?: string;
  icon_up?: string;
  icon_down?: string;
  
  // Custom services
  open_service?: string;
  stop_service?: string;
  close_service?: string;
  
  // Actions
  tap_action?: BubbleAction;
  double_tap_action?: BubbleAction;
  hold_action?: BubbleAction;
  button_action?: {
    tap_action?: BubbleAction;
    double_tap_action?: BubbleAction;
    hold_action?: BubbleAction;
  };
  
  card_layout?: BubbleCardLayout;
  rows?: number;
  sub_button?: BubbleSubButton[];
  styles?: string;
}

// ============================================
// MAIN CONFIG - MEDIA PLAYER
// ============================================

export interface BubbleMediaPlayerConfig {
  card_type: 'media-player';
  entity: string;
  name?: string;
  icon?: string;
  force_icon?: boolean;
  show_name?: boolean;
  show_icon?: boolean;
  show_state?: boolean;
  show_last_changed?: boolean;
  show_last_updated?: boolean;
  show_attribute?: boolean;
  attribute?: string;
  scrolling_effect?: boolean;
  
  // Media player specific
  min_volume?: number;
  max_volume?: number;
  cover_background?: boolean;
  
  // Hide options
  hide?: {
    play_pause_button?: boolean;
    volume_button?: boolean;
    previous_button?: boolean;
    next_button?: boolean;
    power_button?: boolean;
  };
  
  // Actions
  tap_action?: BubbleAction;
  double_tap_action?: BubbleAction;
  hold_action?: BubbleAction;
  button_action?: {
    tap_action?: BubbleAction;
    double_tap_action?: BubbleAction;
    hold_action?: BubbleAction;
  };
  
  card_layout?: BubbleCardLayout;
  rows?: number;
  sub_button?: BubbleSubButton[];
  styles?: string;
}

// ============================================
// MAIN CONFIG - CLIMATE
// ============================================

export interface BubbleClimateConfig {
  card_type: 'climate';
  entity: string;
  name?: string;
  icon?: string;
  force_icon?: boolean;
  show_name?: boolean;
  show_icon?: boolean;
  show_state?: boolean;
  
  // Climate specific
  hide_target_temp_low?: boolean;
  hide_target_temp_high?: boolean;
  state_color?: boolean;
  step?: number;
  min_temp?: number;
  max_temp?: number;
  
  // Actions
  tap_action?: BubbleAction;
  double_tap_action?: BubbleAction;
  hold_action?: BubbleAction;
  button_action?: {
    tap_action?: BubbleAction;
    double_tap_action?: BubbleAction;
    hold_action?: BubbleAction;
  };
  
  card_layout?: BubbleCardLayout;
  rows?: number;
  sub_button?: BubbleSubButton[];
  styles?: string;
}

// ============================================
// MAIN CONFIG - SELECT
// ============================================

export interface BubbleSelectConfig {
  card_type: 'select';
  entity: string;
  name?: string;
  icon?: string;
  force_icon?: boolean;
  show_name?: boolean;
  show_icon?: boolean;
  show_state?: boolean;
  show_last_changed?: boolean;
  show_last_updated?: boolean;
  show_attribute?: boolean;
  attribute?: string;
  scrolling_effect?: boolean;
  
  // Actions
  tap_action?: BubbleAction;
  double_tap_action?: BubbleAction;
  hold_action?: BubbleAction;
  
  card_layout?: BubbleCardLayout;
  rows?: number;
  sub_button?: BubbleSubButton[];
  styles?: string;
}

// ============================================
// MAIN CONFIG - CALENDAR
// ============================================

export interface BubbleCalendarConfig {
  card_type: 'calendar';
  entities: Array<{
    entity: string;
    color?: string;
  }>;
  days?: number;
  limit?: number;
  show_end?: boolean;
  show_progress?: boolean;
  scrolling_effect?: boolean;
  
  // Actions
  event_action?: {
    tap_action?: BubbleAction;
    double_tap_action?: BubbleAction;
    hold_action?: BubbleAction;
  };
  tap_action?: BubbleAction;
  double_tap_action?: BubbleAction;
  hold_action?: BubbleAction;
  
  card_layout?: BubbleCardLayout;
  rows?: number;
  sub_button?: BubbleSubButton[];
  styles?: string;
}

// ============================================
// MAIN CONFIG - HORIZONTAL BUTTONS STACK
// ============================================

export interface BubbleHorizontalButton {
  link: string; // e.g., '#kitchen' or '/lovelace/room'
  name?: string;
  icon?: string;
  entity?: string;
  pir_sensor?: string;
}

export interface BubbleHorizontalButtonsStackConfig {
  card_type: 'horizontal-buttons-stack';
  buttons: BubbleHorizontalButton[]; // We'll convert to 1_link, 1_name, etc.
  auto_order?: boolean;
  margin?: string;
  width_desktop?: string;
  is_sidebar_hidden?: boolean;
  rise_animation?: boolean;
  highlight_current_view?: boolean;
  hide_gradient?: boolean;
  styles?: string;
}

// ============================================
// EMPTY COLUMN
// ============================================

export interface BubbleEmptyColumnConfig {
  card_type: 'empty-column';
}

// ============================================
// UNION TYPE
// ============================================

export type BubbleConfig = 
  | BubbleButtonConfig
  | BubbleSeparatorConfig
  | BubblePopUpConfig
  | BubbleCoverConfig
  | BubbleMediaPlayerConfig
  | BubbleClimateConfig
  | BubbleSelectConfig
  | BubbleCalendarConfig
  | BubbleHorizontalButtonsStackConfig
  | BubbleEmptyColumnConfig;

// ============================================
// PRESET TYPE
// ============================================

export type BubblePresetCategory = 
  | 'basic'
  | 'slider'
  | 'state'
  | 'sub-buttons'
  | 'media'
  | 'climate'
  | 'cover'
  | 'custom';

export interface BubblePreset {
  name: string;
  description: string;
  category: BubblePresetCategory;
  cardType: BubbleCardType;
  config: Partial<BubbleConfig>;
}

// ============================================
// CSS VARIABLES (for reference)
// ============================================

export interface BubbleCSSVariables {
  // Global
  '--bubble-border-radius'?: string;
  '--bubble-main-background-color'?: string;
  '--bubble-secondary-background-color'?: string;
  '--bubble-accent-color'?: string;
  '--bubble-icon-border-radius'?: string;
  '--bubble-icon-background-color'?: string;
  '--bubble-sub-button-border-radius'?: string;
  '--bubble-sub-button-background-color'?: string;
  '--bubble-box-shadow'?: string;
  '--bubble-border'?: string;
  
  // Button specific
  '--bubble-button-main-background-color'?: string;
  '--bubble-button-border-radius'?: string;
  '--bubble-button-icon-border-radius'?: string;
  '--bubble-button-icon-background-color'?: string;
  '--bubble-light-white-color'?: string;
  '--bubble-light-color'?: string;
  '--bubble-button-box-shadow'?: string;
}
