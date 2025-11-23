
export interface ButtonStyle {
  fontSize: string;
  fontWeight: string;
  textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

export type AnimationType = 'none' | 'flash' | 'pulse' | 'jiggle' | 'marquee' | 'spin' | 'blink' | 'shake' | 'bounce' | 'rotate';
export type AnimationTrigger = 'always' | 'on' | 'off';

export interface CustomField {
  name: string;
  type: 'text' | 'template';
  value: string;
  styles?: string;
}

export interface Confirmation {
  enabled: boolean;
  text: string;
  exemptions?: string[];
}

export interface ButtonConfig {
  // Core
  entity: string;
  name: string;
  label: string;
  icon: string;
  entityPicture: string;
  
  // Templates (for dynamic values)
  nameTemplate: string;
  labelTemplate: string;
  iconTemplate: string;
  
  // Toggles
  showName: boolean;
  showIcon: boolean;
  showState: boolean;
  showLabel: boolean;
  showLastChanged: boolean;
  showEntityPicture: boolean;
  showUnits: boolean;
  
  // Layout & Dimensions
  size: string; // Icon size
  layout: 'vertical' | 'icon_name_state2nd' | 'icon_name_state' | 'icon_state_name2nd' | 'icon_state' | 'name_state' | 'icon_label';
  aspectRatio: string; // e.g. "1/1", "4/3"
  height: string;
  padding: string;
  borderRadius: string;
  
  // Borders
  borderWidth: string;
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove';
  borderColor: string;
  borderColorAuto: boolean;
  
  // Styles
  colorType: 'card' | 'icon' | 'blank-card' | 'label-card';
  colorAuto: boolean; // Sets color: auto (uses entity color)
  backgroundColor: string;
  backgroundColorOpacity: number; // 0-100
  color: string; // Default Global Text Color
  
  // Glass / Depth
  backdropBlur: string; // e.g. '0px', '10px'
  shadowSize: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'inner';
  shadowColor: string;
  shadowOpacity: number;
  
  // Element Specific Colors (Overrides)
  iconColor: string;
  iconColorAuto: boolean;
  nameColor: string;
  nameColorAuto: boolean;
  stateColor: string;
  stateColorAuto: boolean;
  labelColor: string;
  labelColorAuto: boolean;
  
  // Typography
  fontSize: string;
  fontWeight: 'normal' | 'bold' | 'lighter' | 'bolder';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing: string;
  lineHeight: string;
  
  // State Styles
  stateOnColor: string;
  stateOnOpacity: number; // 0-100
  stateOffColor: string;
  stateOffOpacity: number; // 0-100
  
  // Animations
  cardAnimation: AnimationType;
  cardAnimationTrigger: AnimationTrigger;
  cardAnimationSpeed: string;
  iconAnimation: AnimationType;
  iconAnimationTrigger: AnimationTrigger;
  iconAnimationSpeed: string;

  // Actions
  tapAction: string;
  holdAction: string;
  doubleTapAction: string;
  
  // Action Data
  tapActionData: string; // JSON string for service data
  holdActionData: string;
  doubleTapActionData: string;
  
  // Navigation/URL for actions
  tapActionNavigation: string;
  holdActionNavigation: string;
  doubleTapActionNavigation: string;
  
  // Confirmation
  confirmation: Confirmation;
  
  // Lock
  lock: boolean;
  lockCode: string;
  
  // Tooltip
  tooltip: string;
  
  // Custom Fields
  customFields: CustomField[];
  
  // Advanced
  cardOpacity: number; // Overall card opacity
  holdTime: number; // Time in ms to trigger hold action
  triggerAction: string; // Entity state that triggers actions
  hapticFeedback: boolean;
  
  // Spin/Rotation
  spin: boolean; // If icon should spin (for fans, etc)
  spinDuration: string;
  
  // Extra Styles (raw CSS)
  extraStyles: string;
  
  // Conditions
  conditionalEntity: string; // Entity to check for conditional display
  conditionalState: string; // State to match for display
  conditionalOperator: 'equals' | 'not_equals' | 'above' | 'below' | 'contains';
}

export const DEFAULT_CONFIG: ButtonConfig = {
  entity: 'light.living_room',
  name: 'Living Room',
  label: 'Temperature: 24°C',
  icon: 'mdi:sofa',
  entityPicture: '',
  
  nameTemplate: '',
  labelTemplate: '',
  iconTemplate: '',
  
  showName: true,
  showIcon: true,
  showState: false,
  showLabel: false,
  showLastChanged: false,
  showEntityPicture: false,
  showUnits: false,
  
  size: '40%',
  layout: 'vertical',
  aspectRatio: '',
  height: 'auto',
  padding: '10%',
  borderRadius: '12px',
  
  borderWidth: '0px',
  borderStyle: 'none',
  borderColor: '',
  borderColorAuto: false,
  
  colorType: 'card',
  colorAuto: false,
  backgroundColor: '#1c1c1c',
  backgroundColorOpacity: 100,
  color: '#ffffff',
  
  backdropBlur: '0px',
  shadowSize: 'none',
  shadowColor: '#000000',
  shadowOpacity: 30,
  
  iconColor: '',
  iconColorAuto: false,
  nameColor: '',
  nameColorAuto: false,
  stateColor: '',
  stateColorAuto: false,
  labelColor: '',
  labelColorAuto: false,
  
  fontSize: '14px',
  fontWeight: 'bold',
  textTransform: 'capitalize',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  
  stateOnColor: '#f1c40f',
  stateOnOpacity: 100,
  stateOffColor: '#4a4a4a',
  stateOffOpacity: 100,
  
  cardAnimation: 'none',
  cardAnimationTrigger: 'always',
  cardAnimationSpeed: '2s',
  iconAnimation: 'none',
  iconAnimationTrigger: 'on',
  iconAnimationSpeed: '2s',
  
  tapAction: 'toggle',
  holdAction: 'more-info',
  doubleTapAction: 'none',
  
  tapActionData: '',
  holdActionData: '',
  doubleTapActionData: '',
  
  tapActionNavigation: '',
  holdActionNavigation: '',
  doubleTapActionNavigation: '',
  
  confirmation: {
    enabled: false,
    text: 'Are you sure?',
    exemptions: [],
  },
  
  lock: false,
  lockCode: '',
  
  tooltip: '',
  
  customFields: [],
  
  cardOpacity: 100,
  holdTime: 500,
  triggerAction: '',
  hapticFeedback: false,
  
  spin: false,
  spinDuration: '2s',
  
  extraStyles: '',
  
  conditionalEntity: '',
  conditionalState: '',
  conditionalOperator: 'equals',
};
