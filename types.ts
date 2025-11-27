
export interface ButtonStyle {
  fontSize: string;
  fontWeight: string;
  textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

export type AnimationType = 'none' | 'flash' | 'pulse' | 'jiggle' | 'marquee' | 'spin' | 'blink' | 'shake' | 'bounce' | 'glow' | 'float' | 'swing' | 'rubberBand' | 'tada' | 'heartbeat' | 'flip' | 'wobble' | 'breathe' | 'ripple';
export type AnimationTrigger = 'always' | 'on' | 'off';
export type ActionType = 'none' | 'toggle' | 'more-info' | 'call-service' | 'perform-action' | 'navigate' | 'url' | 'assist' | 'fire-dom-event' | 'javascript' | 'multi-actions' | 'toast';
export type LockUnlockType = 'tap' | 'hold' | 'double_tap';
export type StateOperator = 'equals' | 'not_equals' | 'above' | 'below' | 'regex' | 'template' | 'default';

export interface CustomField {
  name: string;
  type: 'text' | 'template';
  value: string;
  styles?: string;
}

export interface Variable {
  name: string;
  value: string;
}

export interface Confirmation {
  enabled: boolean;
  text: string;
  exemptions?: string[];
}

export interface LockConfig {
  enabled: boolean;
  duration: number;
  unlock: LockUnlockType;
  lockIcon: string;
  unlockIcon: string;
  keepUnlockIcon: boolean;
  exemptions: string[];
}

export interface ProtectConfig {
  enabled: boolean;
  type: 'pin' | 'password';
  value: string;
  failureMessage: string;
  successMessage: string;
}

export interface TooltipConfig {
  enabled: boolean;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface ToastConfig {
  message: string;
  duration: number;
  dismissable: boolean;
}

export interface StateStyleConfig {
  id: string;
  operator: StateOperator;
  value: string;
  name: string;
  icon: string;
  color: string;
  entityPicture: string;
  label: string;
  stateDisplay: string;
  spin: boolean;
  styles: string;
  // Conditional Colors
  backgroundColor: string;
  iconColor: string;
  nameColor: string;
  labelColor: string;
  borderColor: string;
  // Conditional Animations
  cardAnimation: AnimationType;
  cardAnimationSpeed: string;
  iconAnimation: AnimationType;
  iconAnimationSpeed: string;
}

export interface ButtonConfig {
  // Core
  entity: string;
  name: string;
  label: string;
  labelEntity: string;
  labelAttribute: string;
  icon: string;
  entityPicture: string;
  stateDisplay: string;
  
  // Templates (for dynamic values)
  nameTemplate: string;
  labelTemplate: string;
  iconTemplate: string;
  stateDisplayTemplate: string;
  
  // Variables
  variables: Variable[];
  
  // Units override
  units: string;
  
  // Toggles
  showName: boolean;
  showIcon: boolean;
  showState: boolean;
  showLabel: boolean;
  showLastChanged: boolean;
  showEntityPicture: boolean;
  showUnits: boolean;
  showRipple: boolean;
  showLiveStream: boolean;
  liveStreamAspectRatio: string;
  
  // Layout & Dimensions
  size: string;
  layout: 'vertical' | 'icon_name_state2nd' | 'icon_name_state' | 'icon_state_name2nd' | 'icon_state' | 'name_state' | 'icon_label';
  aspectRatio: string;
  height: string;
  padding: string;
  borderRadius: string;
  cardSize: number;
  sectionMode: boolean;
  gridRows: number;
  gridColumns: number;
  
  // Borders
  borderWidth: string;
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove';
  borderColor: string;
  borderColorAuto: boolean;
  
  // Styles
  colorType: 'card' | 'icon' | 'blank-card' | 'label-card';
  colorAuto: boolean;
  backgroundColor: string;
  backgroundColorOpacity: number;
  color: string;
  
  // Gradient Background
  gradientEnabled: boolean;
  gradientType: 'linear' | 'radial' | 'conic';
  gradientAngle: number;
  gradientColor1: string;
  gradientColor2: string;
  gradientColor3: string;
  gradientColor3Enabled: boolean;
  
  // Glass / Depth
  backdropBlur: string;
  shadowSize: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'inner';
  shadowColor: string;
  shadowOpacity: number;
  
  // Element Specific Colors
  iconColor: string;
  iconColorAuto: boolean;
  nameColor: string;
  nameColorAuto: boolean;
  stateColor: string;
  stateColorAuto: boolean;
  labelColor: string;
  labelColorAuto: boolean;
  
  // Typography
  fontFamily: string;
  fontSize: string;
  fontWeight: 'normal' | 'bold' | 'lighter' | 'bolder';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing: string;
  lineHeight: string;
  numericPrecision: number;
  
  // State Styles
  stateOnColor: string;
  stateOnOpacity: number;
  stateOffColor: string;
  stateOffOpacity: number;
  stateStyles: StateStyleConfig[];
  
  // Animations
  cardAnimation: AnimationType;
  cardAnimationTrigger: AnimationTrigger;
  cardAnimationSpeed: string;
  iconAnimation: AnimationType;
  iconAnimationTrigger: AnimationTrigger;
  iconAnimationSpeed: string;
  rotate: boolean;

  // Card Actions
  tapAction: ActionType;
  tapActionData: string;
  tapActionNavigation: string;
  tapActionJavascript: string;
  tapActionToast: ToastConfig;
  
  holdAction: ActionType;
  holdActionData: string;
  holdActionNavigation: string;
  holdActionJavascript: string;
  holdActionRepeat: number;
  holdActionRepeatLimit: number;
  holdActionToast: ToastConfig;
  
  doubleTapAction: ActionType;
  doubleTapActionData: string;
  doubleTapActionNavigation: string;
  doubleTapActionJavascript: string;
  doubleTapActionToast: ToastConfig;
  
  // Momentary Actions (press/release)
  pressAction: ActionType;
  pressActionData: string;
  pressActionNavigation: string;
  pressActionJavascript: string;
  
  releaseAction: ActionType;
  releaseActionData: string;
  releaseActionNavigation: string;
  releaseActionJavascript: string;
  
  // Icon-specific Actions
  iconTapAction: ActionType;
  iconTapActionData: string;
  iconTapActionNavigation: string;
  iconTapActionJavascript: string;
  
  iconHoldAction: ActionType;
  iconHoldActionData: string;
  iconHoldActionNavigation: string;
  iconHoldActionJavascript: string;
  
  iconDoubleTapAction: ActionType;
  iconDoubleTapActionData: string;
  iconDoubleTapActionNavigation: string;
  iconDoubleTapActionJavascript: string;
  
  // Icon Momentary Actions
  iconPressAction: ActionType;
  iconPressActionData: string;
  iconPressActionNavigation: string;
  
  iconReleaseAction: ActionType;
  iconReleaseActionData: string;
  iconReleaseActionNavigation: string;
  
  // Action sounds
  tapActionSound: string;
  holdActionSound: string;
  doubleTapActionSound: string;
  
  // Confirmation
  confirmation: Confirmation;
  
  // Lock
  lock: LockConfig;
  
  // Protect (per-action PIN/password)
  protect: ProtectConfig;
  
  // Tooltip
  tooltip: TooltipConfig;
  
  // Custom Fields
  customFields: CustomField[];
  
  // Advanced
  cardOpacity: number;
  updateTimer: number;
  hidden: boolean;
  hiddenTemplate: string;
  disableKeyboard: boolean;
  spinner: boolean;
  groupExpand: boolean;
  template: string;
  
  // Spin/Rotation
  spin: boolean;
  spinDuration: string;
  
  // Extra Styles (raw CSS)
  extraStyles: string;
  entityPictureStyles: string;
  gridStyles: string;
  imgCellStyles: string;
  lockStyles: string;
  tooltipStyles: string;
  
  // Advanced Trigger Options
  triggerEntity: string;
  triggersUpdate: string[];
  
  // Live Stream
  liveStreamFitMode: string;
  
  // Timing
  holdTime: number;
  
  // Haptic
  hapticFeedback: boolean;
  
  // Spinner Template
  spinnerTemplate: string;
  
  // Conditional Display
  conditionalEntity: string;
  conditionalState: string;
  conditionalOperator: string;
}

export const DEFAULT_TOAST_CONFIG: ToastConfig = {
  message: '',
  duration: 3000,
  dismissable: true,
};

export const DEFAULT_LOCK_CONFIG: LockConfig = {
  enabled: false,
  duration: 5,
  unlock: 'tap',
  lockIcon: 'mdi:lock-outline',
  unlockIcon: 'mdi:lock-open-outline',
  keepUnlockIcon: false,
  exemptions: [],
};

export const DEFAULT_PROTECT_CONFIG: ProtectConfig = {
  enabled: false,
  type: 'pin',
  value: '',
  failureMessage: 'Invalid code',
  successMessage: '',
};

export const DEFAULT_TOOLTIP_CONFIG: TooltipConfig = {
  enabled: false,
  content: '',
  position: 'top',
};

export const DEFAULT_CONFIG: ButtonConfig = {
  entity: 'light.living_room',
  name: 'Living Room',
  label: '',
  labelEntity: '',
  labelAttribute: '',
  icon: 'mdi:sofa',
  entityPicture: '',
  stateDisplay: '',
  
  nameTemplate: '',
  labelTemplate: '',
  iconTemplate: '',
  stateDisplayTemplate: '',
  
  variables: [],
  units: '',
  
  showName: true,
  showIcon: true,
  showState: false,
  showLabel: false,
  showLastChanged: false,
  showEntityPicture: false,
  showUnits: false,
  showRipple: true,
  showLiveStream: false,
  liveStreamAspectRatio: '',
  
  size: '40%',
  layout: 'vertical',
  aspectRatio: '',
  height: 'auto',
  padding: '10%',
  borderRadius: '12px',
  cardSize: 3,
  sectionMode: false,
  gridRows: 2,
  gridColumns: 6,
  
  borderWidth: '0px',
  borderStyle: 'none',
  borderColor: '',
  borderColorAuto: false,
  
  colorType: 'card',
  colorAuto: false,
  backgroundColor: '#1c1c1c',
  backgroundColorOpacity: 100,
  color: '#ffffff',
  
  // Gradient defaults
  gradientEnabled: false,
  gradientType: 'linear',
  gradientAngle: 135,
  gradientColor1: '#667eea',
  gradientColor2: '#764ba2',
  gradientColor3: '#f093fb',
  gradientColor3Enabled: false,
  
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
  
  fontFamily: '',
  fontSize: '14px',
  fontWeight: 'bold',
  textTransform: 'capitalize',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  numericPrecision: -1,
  
  stateOnColor: '#f1c40f',
  stateOnOpacity: 100,
  stateOffColor: '#4a4a4a',
  stateOffOpacity: 100,
  stateStyles: [],
  
  cardAnimation: 'none',
  cardAnimationTrigger: 'always',
  cardAnimationSpeed: '2s',
  iconAnimation: 'none',
  iconAnimationTrigger: 'on',
  iconAnimationSpeed: '2s',
  rotate: false,

  // Card Actions
  tapAction: 'toggle',
  tapActionData: '',
  tapActionNavigation: '',
  tapActionJavascript: '',
  tapActionToast: { ...DEFAULT_TOAST_CONFIG },
  
  holdAction: 'more-info',
  holdActionData: '',
  holdActionNavigation: '',
  holdActionJavascript: '',
  holdActionRepeat: 0,
  holdActionRepeatLimit: 0,
  holdActionToast: { ...DEFAULT_TOAST_CONFIG },
  
  doubleTapAction: 'none',
  doubleTapActionData: '',
  doubleTapActionNavigation: '',
  doubleTapActionJavascript: '',
  doubleTapActionToast: { ...DEFAULT_TOAST_CONFIG },
  
  // Momentary Actions
  pressAction: 'none',
  pressActionData: '',
  pressActionNavigation: '',
  pressActionJavascript: '',
  
  releaseAction: 'none',
  releaseActionData: '',
  releaseActionNavigation: '',
  releaseActionJavascript: '',
  
  // Icon Actions
  iconTapAction: 'none',
  iconTapActionData: '',
  iconTapActionNavigation: '',
  iconTapActionJavascript: '',
  
  iconHoldAction: 'none',
  iconHoldActionData: '',
  iconHoldActionNavigation: '',
  iconHoldActionJavascript: '',
  
  iconDoubleTapAction: 'none',
  iconDoubleTapActionData: '',
  iconDoubleTapActionNavigation: '',
  iconDoubleTapActionJavascript: '',
  
  iconPressAction: 'none',
  iconPressActionData: '',
  iconPressActionNavigation: '',
  
  iconReleaseAction: 'none',
  iconReleaseActionData: '',
  iconReleaseActionNavigation: '',
  
  tapActionSound: '',
  holdActionSound: '',
  doubleTapActionSound: '',
  
  confirmation: {
    enabled: false,
    text: 'Are you sure?',
    exemptions: [],
  },
  
  lock: { ...DEFAULT_LOCK_CONFIG },
  protect: { ...DEFAULT_PROTECT_CONFIG },
  tooltip: { ...DEFAULT_TOOLTIP_CONFIG },
  
  customFields: [],
  
  cardOpacity: 100,
  updateTimer: 0,
  hidden: false,
  hiddenTemplate: '',
  disableKeyboard: false,
  spinner: false,
  groupExpand: false,
  template: '',
  
  spin: false,
  spinDuration: '2s',
  
  extraStyles: '',
  entityPictureStyles: '',
  gridStyles: '',
  imgCellStyles: '',
  lockStyles: '',
  tooltipStyles: '',
  
  // Advanced Trigger Options
  triggerEntity: '',
  triggersUpdate: [],
  
  // Live Stream
  liveStreamFitMode: '',
  
  // Timing
  holdTime: 500,
  
  // Haptic
  hapticFeedback: false,
  
  // Spinner Template
  spinnerTemplate: '',
  
  // Conditional Display
  conditionalEntity: '',
  conditionalState: '',
  conditionalOperator: 'equals',
};
