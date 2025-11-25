
import { ButtonConfig, AnimationType, CustomField, StateStyleConfig, LockConfig, TooltipConfig, ProtectConfig, ToastConfig } from "../types";

// Helper to convert hex + opacity (0-100) to RGBA string
const hexToRgba = (hex: string, opacity: number) => {
  if (!hex) return 'transparent';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

const getShadowCSS = (size: string, color: string, opacity: number) => {
  if (size === 'none') return null;
  const rgba = hexToRgba(color, opacity);
  switch (size) {
    case 'sm': return `box-shadow: 0 1px 2px 0 ${rgba}`;
    case 'md': return `box-shadow: 0 4px 6px -1px ${rgba}, 0 2px 4px -1px ${rgba}`;
    case 'lg': return `box-shadow: 0 10px 15px -3px ${rgba}, 0 4px 6px -2px ${rgba}`;
    case 'xl': return `box-shadow: 0 20px 25px -5px ${rgba}, 0 10px 10px -5px ${rgba}`;
    case 'inner': return `box-shadow: inset 0 2px 4px 0 ${rgba}`;
    default: return null;
  }
};

const getAnimationCSS = (type: AnimationType, speed: string = '2s') => {
  switch (type) {
    case 'flash': return `animation: cba-flash ${speed} ease infinite`;
    case 'pulse': return `animation: cba-pulse ${speed} infinite`;
    case 'jiggle': return `animation: cba-jiggle 0.3s ease infinite`;
    case 'shake': return `animation: cba-shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite`;
    case 'bounce': return `animation: cba-bounce 1s infinite`;
    case 'blink': return `animation: cba-blink 1s infinite`;
    case 'rotate':
    case 'spin': return `animation: cba-rotate ${speed} linear infinite`;
    case 'glow': return `animation: cba-glow ${speed} ease-in-out infinite`;
    case 'float': return `animation: cba-float ${speed} ease-in-out infinite`;
    case 'swing': return `animation: cba-swing ${speed} ease-in-out infinite`;
    case 'rubberBand': return `animation: cba-rubberBand 1s ease infinite`;
    case 'tada': return `animation: cba-tada 1s ease infinite`;
    case 'heartbeat': return `animation: cba-heartbeat 1.5s ease-in-out infinite`;
    case 'flip': return `animation: cba-flip ${speed} ease-in-out infinite`;
    case 'wobble': return `animation: cba-wobble 1s ease infinite`;
    case 'breathe': return `animation: cba-breathe ${speed} ease-in-out infinite`;
    case 'ripple': return `animation: cba-ripple 1.5s ease-out infinite`;
    default: return null;
  }
};

// Helper to generate action YAML
const generateActionYaml = (
  actionType: string,
  actionData: string,
  actionNavigation: string,
  actionJavascript?: string,
  actionToast?: ToastConfig,
  repeatMs?: number,
  repeatLimit?: number
): string => {
  let yaml = `  action: ${actionType}\n`;
  
  if (actionType === 'call-service' && actionData) {
    try {
      const data = JSON.parse(actionData);
      yaml += `  service: ${data.service || ''}\n`;
      if (data.service_data) {
        yaml += `  service_data:\n`;
        Object.entries(data.service_data).forEach(([key, value]) => {
          yaml += `    ${key}: ${JSON.stringify(value)}\n`;
        });
      }
      if (data.target) {
        yaml += `  target:\n`;
        Object.entries(data.target).forEach(([key, value]) => {
          yaml += `    ${key}: ${JSON.stringify(value)}\n`;
        });
      }
    } catch (e) {
      yaml += `  # Invalid JSON in action_data\n`;
    }
  }
  
  if (actionType === 'navigate' && actionNavigation) {
    yaml += `  navigation_path: ${actionNavigation}\n`;
  }
  
  if (actionType === 'url' && actionNavigation) {
    yaml += `  url_path: ${actionNavigation}\n`;
  }
  
  if (actionType === 'javascript' && actionJavascript) {
    yaml += `  code: |\n    ${actionJavascript.split('\n').join('\n    ')}\n`;
  }
  
  if (actionType === 'toast' && actionToast) {
    yaml += `  message: "${actionToast.message}"\n`;
    if (actionToast.duration !== 3000) {
      yaml += `  duration: ${actionToast.duration}\n`;
    }
    if (actionToast.dismissable === false) {
      yaml += `  dismissable: false\n`;
    }
  }
  
  if (repeatMs && repeatMs > 0) {
    yaml += `  repeat: ${repeatMs}\n`;
    if (repeatLimit && repeatLimit > 0) {
      yaml += `  repeat_limit: ${repeatLimit}\n`;
    }
  }
  
  return yaml;
};

export const generateYaml = (config: ButtonConfig): string => {
  // Helper to generate color style line
  const getColorLine = (color: string, auto: boolean) => {
    if (auto) return `    - color: var(--button-card-light-color)`;
    if (color) return `    - color: ${color}`;
    return null;
  };
  
  // Resolve border color for styles
  const borderColor = config.borderColorAuto ? 'var(--button-card-light-color)' : config.borderColor;
  const borderStyle = config.borderStyle !== 'none' ? `border: ${config.borderWidth} ${config.borderStyle} ${borderColor || 'var(--primary-text-color)'}` : 'border: none';

  // Resolve Backgrounds
  const bgColor = hexToRgba(config.backgroundColor, config.backgroundColorOpacity);
  const onColor = hexToRgba(config.stateOnColor, config.stateOnOpacity);
  const offColor = hexToRgba(config.stateOffColor, config.stateOffOpacity);

  // Resolve Shadow
  const shadowCSS = getShadowCSS(config.shadowSize, config.shadowColor, config.shadowOpacity);

  // --- Base Card Styles ---
  const cardStyles = [
    config.height !== 'auto' ? `height: ${config.height}` : null,
    config.aspectRatio ? `aspect-ratio: ${config.aspectRatio}` : null,
    `background-color: ${bgColor}`,
    config.cardOpacity < 100 ? `opacity: ${config.cardOpacity / 100}` : null,
    `border-radius: ${config.borderRadius}`,
    `padding: ${config.padding}`,
    `color: ${config.color}`,
    `font-size: ${config.fontSize}`,
    `text-transform: ${config.textTransform}`,
    `font-weight: ${config.fontWeight}`,
    config.letterSpacing !== 'normal' ? `letter-spacing: ${config.letterSpacing}` : null,
    config.lineHeight !== 'normal' ? `line-height: ${config.lineHeight}` : null,
    borderStyle,
    config.backdropBlur !== '0px' ? `backdrop-filter: blur(${config.backdropBlur})` : null,
    shadowCSS,
  ].filter(Boolean);

  // --- Base Icon Styles ---
  const iconStyles: string[] = [];
  if (config.iconColorAuto) iconStyles.push(`color: var(--button-card-light-color)`);
  else if (config.iconColor) iconStyles.push(`color: ${config.iconColor}`);
  
  if (config.spin || config.rotate) {
    iconStyles.push(`animation: cba-rotate ${config.spinDuration} linear infinite`);
  }

  // --- Apply ALWAYS Animations ---
  if (config.cardAnimation !== 'none' && config.cardAnimationTrigger === 'always') {
    const anim = getAnimationCSS(config.cardAnimation, config.cardAnimationSpeed);
    if (anim) cardStyles.push(anim);
  }
  if (config.iconAnimation !== 'none' && config.iconAnimationTrigger === 'always') {
    const anim = getAnimationCSS(config.iconAnimation, config.iconAnimationSpeed);
    if (anim) iconStyles.push(anim);
  }

  // --- Build YAML ---
  let yaml = `type: custom:button-card
entity: ${config.entity}
`;

  // Trigger Entity
  if (config.triggerEntity) {
    yaml += `trigger_entity: ${config.triggerEntity}\n`;
  }

  // Triggers Update (array of entities)
  if (config.triggersUpdate && config.triggersUpdate.length > 0) {
    yaml += `triggers_update:\n`;
    config.triggersUpdate.forEach(entity => {
      yaml += `  - ${entity}\n`;
    });
  }

  // Units override
  if (config.units) {
    yaml += `units: "${config.units}"\n`;
  }

  // Core fields with templates
  if (config.nameTemplate) {
    yaml += `name: ${config.nameTemplate}\n`;
  } else {
    yaml += `name: ${config.name}\n`;
  }

  if (config.iconTemplate) {
    yaml += `icon: ${config.iconTemplate}\n`;
  } else {
    yaml += `icon: ${config.icon}\n`;
  }

  // Label
  if (config.labelTemplate) {
    yaml += `label: ${config.labelTemplate}\n`;
  } else if (config.labelEntity) {
    // Generate template to display another entity's value
    if (config.labelAttribute) {
      yaml += `label: "[[[ return states['${config.labelEntity}'].attributes.${config.labelAttribute} ]]]"\n`;
    } else {
      yaml += `label: "[[[ return states['${config.labelEntity}'].state ]]]"\n`;
    }
  } else if (config.label) {
    yaml += `label: "${config.label}"\n`;
  }

  // Entity Picture
  if (config.entityPicture) {
    yaml += `entity_picture: ${config.entityPicture}\n`;
  }

  // State Display
  if (config.stateDisplayTemplate) {
    yaml += `state_display: ${config.stateDisplayTemplate}\n`;
  } else if (config.stateDisplay) {
    yaml += `state_display: "${config.stateDisplay}"\n`;
  }

  // Variables
  if (config.variables && config.variables.length > 0) {
    yaml += `variables:\n`;
    config.variables.forEach(v => {
      yaml += `  ${v.name}: ${v.value}\n`;
    });
  }

  // Show options
  yaml += `show_name: ${config.showName}
show_icon: ${config.showIcon}
show_state: ${config.showState}
show_label: ${config.showLabel}
show_entity_picture: ${config.showEntityPicture}
show_last_changed: ${config.showLastChanged}
show_units: ${config.showUnits}
`;

  // New show options
  if (config.showRipple === false) {
    yaml += `show_ripple: false\n`;
  }
  if (config.showLiveStream) {
    yaml += `show_live_stream: true\n`;
    if (config.liveStreamAspectRatio) {
      yaml += `live_stream_aspect_ratio: ${config.liveStreamAspectRatio}\n`;
    }
    if (config.liveStreamFitMode) {
      yaml += `live_stream_fit: ${config.liveStreamFitMode}\n`;
    }
  }

  yaml += `size: ${config.size}
layout: ${config.layout}
color_type: ${config.colorType}
`;

  if (config.colorAuto) {
    yaml += `color: auto\n`;
  }
  
  if (config.aspectRatio) {
    yaml += `aspect_ratio: ${config.aspectRatio}\n`;
  }

  // Card Size
  if (config.cardSize !== 3) {
    yaml += `card_size: ${config.cardSize}\n`;
  }

  // Section Mode / Grid Options
  if (config.sectionMode) {
    yaml += `section_mode: true\n`;
    yaml += `grid_options:\n`;
    yaml += `  rows: ${config.gridRows}\n`;
    yaml += `  columns: ${config.gridColumns}\n`;
  }

  // Numeric Precision
  if (config.numericPrecision >= 0) {
    yaml += `numeric_precision: ${config.numericPrecision}\n`;
  }

  // Hidden
  if (config.hidden) {
    if (config.hiddenTemplate) {
      yaml += `hidden: ${config.hiddenTemplate}\n`;
    } else {
      yaml += `hidden: true\n`;
    }
  }

  // Spinner
  if (config.spinner) {
    if (config.spinnerTemplate) {
      yaml += `spinner: ${config.spinnerTemplate}\n`;
    } else {
      yaml += `spinner: true\n`;
    }
  }

  // Group Expand
  if (config.groupExpand) {
    yaml += `group_expand: true\n`;
  }

  // Tooltip (object-style)
  if (config.tooltip.enabled && config.tooltip.content) {
    yaml += `tooltip:\n`;
    yaml += `  content: "${config.tooltip.content}"\n`;
    if (config.tooltip.position !== 'top') {
      yaml += `  position: ${config.tooltip.position}\n`;
    }
  }

  // Lock (full config)
  if (config.lock.enabled) {
    yaml += `lock:\n`;
    yaml += `  enabled: true\n`;
    if (config.lock.duration !== 5) {
      yaml += `  duration: ${config.lock.duration}\n`;
    }
    if (config.lock.unlock !== 'tap') {
      yaml += `  unlock: ${config.lock.unlock}\n`;
    }
    if (config.lock.lockIcon !== 'mdi:lock-outline') {
      yaml += `  lock_icon: ${config.lock.lockIcon}\n`;
    }
    if (config.lock.unlockIcon !== 'mdi:lock-open-outline') {
      yaml += `  unlock_icon: ${config.lock.unlockIcon}\n`;
    }
    if (config.lock.keepUnlockIcon) {
      yaml += `  keep_unlock_icon: true\n`;
    }
    if (config.lock.exemptions && config.lock.exemptions.length > 0) {
      yaml += `  exemptions:\n`;
      config.lock.exemptions.forEach(e => {
        yaml += `    - user: ${e}\n`;
      });
    }
  }

  // Hold Time
  if (config.holdTime !== 500) {
    yaml += `hold_time: ${config.holdTime}\n`;
  }

  // Update Timer
  if (config.updateTimer > 0) {
    yaml += `update_timer: ${config.updateTimer}\n`;
  }

  // Template
  if (config.template) {
    yaml += `template: ${config.template}\n`;
  }

  // Haptic
  if (config.hapticFeedback) {
    yaml += `haptic: true\n`;
  }

  // Disable Keyboard
  if (config.disableKeyboard) {
    yaml += `disable_keyboard: true\n`;
  }

  // Actions - Tap
  yaml += `tap_action:\n`;
  yaml += generateActionYaml(
    config.tapAction,
    config.tapActionData,
    config.tapActionNavigation,
    config.tapActionJavascript,
    config.tapActionToast
  );
  if (config.tapActionSound) {
    yaml += `  haptic: ${config.tapActionSound}\n`;
  }

  // Actions - Hold
  yaml += `hold_action:\n`;
  yaml += generateActionYaml(
    config.holdAction,
    config.holdActionData,
    config.holdActionNavigation,
    config.holdActionJavascript,
    config.holdActionToast,
    config.holdActionRepeat,
    config.holdActionRepeatLimit
  );
  if (config.holdActionSound) {
    yaml += `  haptic: ${config.holdActionSound}\n`;
  }

  // Actions - Double Tap
  yaml += `double_tap_action:\n`;
  yaml += generateActionYaml(
    config.doubleTapAction,
    config.doubleTapActionData,
    config.doubleTapActionNavigation,
    config.doubleTapActionJavascript,
    config.doubleTapActionToast
  );
  if (config.doubleTapActionSound) {
    yaml += `  haptic: ${config.doubleTapActionSound}\n`;
  }

  // Momentary Actions - Press
  if (config.pressAction !== 'none') {
    yaml += `press_action:\n`;
    yaml += generateActionYaml(
      config.pressAction,
      config.pressActionData,
      config.pressActionNavigation,
      config.pressActionJavascript
    );
  }

  // Momentary Actions - Release
  if (config.releaseAction !== 'none') {
    yaml += `release_action:\n`;
    yaml += generateActionYaml(
      config.releaseAction,
      config.releaseActionData,
      config.releaseActionNavigation,
      config.releaseActionJavascript
    );
  }

  // Icon Actions
  if (config.iconTapAction !== 'none') {
    yaml += `icon_tap_action:\n`;
    yaml += generateActionYaml(
      config.iconTapAction,
      config.iconTapActionData,
      config.iconTapActionNavigation,
      config.iconTapActionJavascript
    );
  }

  if (config.iconHoldAction !== 'none') {
    yaml += `icon_hold_action:\n`;
    yaml += generateActionYaml(
      config.iconHoldAction,
      config.iconHoldActionData,
      config.iconHoldActionNavigation,
      config.iconHoldActionJavascript
    );
  }

  if (config.iconDoubleTapAction !== 'none') {
    yaml += `icon_double_tap_action:\n`;
    yaml += generateActionYaml(
      config.iconDoubleTapAction,
      config.iconDoubleTapActionData,
      config.iconDoubleTapActionNavigation,
      config.iconDoubleTapActionJavascript
    );
  }

  // Icon Momentary Actions
  if (config.iconPressAction !== 'none') {
    yaml += `icon_press_action:\n`;
    yaml += generateActionYaml(
      config.iconPressAction,
      config.iconPressActionData,
      config.iconPressActionNavigation
    );
  }

  if (config.iconReleaseAction !== 'none') {
    yaml += `icon_release_action:\n`;
    yaml += generateActionYaml(
      config.iconReleaseAction,
      config.iconReleaseActionData,
      config.iconReleaseActionNavigation
    );
  }

  // Confirmation
  if (config.confirmation.enabled) {
    yaml += `confirmation:\n`;
    yaml += `  text: "${config.confirmation.text}"\n`;
    if (config.confirmation.exemptions && config.confirmation.exemptions.length > 0) {
      yaml += `  exemptions:\n`;
      config.confirmation.exemptions.forEach(e => {
        yaml += `    - user: ${e}\n`;
      });
    }
  }

  // Protect (PIN/Password)
  if (config.protect.enabled) {
    yaml += `protect:\n`;
    yaml += `  type: ${config.protect.type}\n`;
    yaml += `  code: "${config.protect.value}"\n`;
    if (config.protect.failureMessage) {
      yaml += `  failure_message: "${config.protect.failureMessage}"\n`;
    }
    if (config.protect.successMessage) {
      yaml += `  success_message: "${config.protect.successMessage}"\n`;
    }
  }

  // Custom Fields
  if (config.customFields.length > 0) {
    yaml += `custom_fields:\n`;
    config.customFields.forEach(field => {
      yaml += `  ${field.name}: "${field.value}"\n`;
    });
  }

  // Conditional Display
  if (config.conditionalEntity && config.conditionalState) {
    yaml += `conditions:\n`;
    yaml += `  - entity: ${config.conditionalEntity}\n`;
    yaml += `    state: ${config.conditionalState}\n`;
    if (config.conditionalOperator !== 'equals') {
      yaml += `    operator: ${config.conditionalOperator}\n`;
    }
  }
  
  // --- Extra Styles (Keyframes) ---
  let extraStyles = '';
  // Marquee special keyframes
  if (config.cardAnimation === 'marquee') {
    extraStyles += `  @keyframes cba-marquee-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
  }
  // Add generic keyframes if any animation is used
  const needsGenericKeyframes = (config.cardAnimation !== 'none' && config.cardAnimation !== 'marquee') || config.iconAnimation !== 'none' || config.spin || config.rotate;
  if (needsGenericKeyframes) {
     extraStyles += `  @keyframes cba-flash {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0.5; }
  }
  @keyframes cba-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes cba-jiggle {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(1deg); }
    50% { transform: rotate(0deg); }
    75% { transform: rotate(-1deg); }
    100% { transform: rotate(0deg); }
  }
  @keyframes cba-shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
  }
  @keyframes cba-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes cba-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes cba-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes cba-glow {
    0%, 100% { box-shadow: 0 0 5px currentColor, 0 0 10px currentColor; }
    50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
  }
  @keyframes cba-swing {
    0%, 100% { transform: rotate(0deg); transform-origin: top center; }
    25% { transform: rotate(15deg); }
    75% { transform: rotate(-15deg); }
  }
  @keyframes cba-heartbeat {
    0%, 100% { transform: scale(1); }
    14% { transform: scale(1.3); }
    28% { transform: scale(1); }
    42% { transform: scale(1.3); }
    70% { transform: scale(1); }
  }
  @keyframes cba-rubber {
    0% { transform: scale(1, 1); }
    30% { transform: scale(1.25, 0.75); }
    40% { transform: scale(0.75, 1.25); }
    50% { transform: scale(1.15, 0.85); }
    65% { transform: scale(0.95, 1.05); }
    75% { transform: scale(1.05, 0.95); }
    100% { transform: scale(1, 1); }
  }
  @keyframes cba-fade {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes cba-slide-up {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes cba-slide-down {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }
  @keyframes cba-tada {
    0%, 100% { transform: scale(1) rotate(0deg); }
    10%, 20% { transform: scale(0.9) rotate(-3deg); }
    30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
    40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
  }
  @keyframes cba-wobble {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    15% { transform: translateX(-5px) rotate(-5deg); }
    30% { transform: translateX(4px) rotate(3deg); }
    45% { transform: translateX(-3px) rotate(-3deg); }
    60% { transform: translateX(2px) rotate(2deg); }
    75% { transform: translateX(-1px) rotate(-1deg); }
  }
  @keyframes cba-flip {
    0% { transform: perspective(400px) rotateY(0); }
    40% { transform: perspective(400px) rotateY(170deg); }
    50% { transform: perspective(400px) rotateY(190deg); }
    80% { transform: perspective(400px) rotateY(360deg); }
    100% { transform: perspective(400px) rotateY(360deg); }
  }
`;
  }

  if (extraStyles) {
    yaml += `extra_styles: |\n${extraStyles}`;
  }

  // --- Styles Section (Always) ---
  yaml += `styles:
  card:
${cardStyles.map(s => `    - ${s}`).join('\n')}
`;

  // Extra styles from textarea
  if (config.extraStyles) {
    yaml += `    # Custom Extra Styles\n`;
    config.extraStyles.split('\n').forEach(line => {
      if (line.trim()) {
        yaml += `    - ${line.trim()}\n`;
      }
    });
  }

  if (iconStyles.length > 0) {
     yaml += `  icon:
${iconStyles.map(s => `    - ${s}`).join('\n')}
`;
  }

  // Name Styles
  const nameColorLine = getColorLine(config.nameColor, config.nameColorAuto);
  yaml += `  name:
    - font-weight: bold
${nameColorLine || ''}
`;

  // Label Styles
  const labelColorLine = getColorLine(config.labelColor, config.labelColorAuto);
  if (labelColorLine) {
    yaml += `  label:
${labelColorLine}
`;
  }

  // State Styles (Text)
  const stateColorLine = getColorLine(config.stateColor, config.stateColorAuto);
  if (stateColorLine) {
    yaml += `  state:
${stateColorLine}
`;
  }

  // Entity Picture Styles
  if (config.entityPictureStyles) {
    yaml += `  entity_picture:\n`;
    config.entityPictureStyles.split('\n').forEach(line => {
      if (line.trim()) {
        yaml += `    - ${line.trim()}\n`;
      }
    });
  }

  // Grid Styles
  if (config.gridStyles) {
    yaml += `  grid:\n`;
    config.gridStyles.split('\n').forEach(line => {
      if (line.trim()) {
        yaml += `    - ${line.trim()}\n`;
      }
    });
  }

  // Custom Field Styles
  const fieldsWithStyles = config.customFields.filter(f => f.styles);
  if (fieldsWithStyles.length > 0) {
    yaml += `  custom_fields:\n`;
    fieldsWithStyles.forEach(field => {
      yaml += `    ${field.name}:\n`;
      field.styles!.split('\n').forEach(line => {
        if (line.trim()) {
          yaml += `      - ${line.trim()}\n`;
        }
      });
    });
  }

  // Lock Styles
  if (config.lock.enabled && config.lockStyles) {
    yaml += `  lock:\n`;
    config.lockStyles.split('\n').forEach(line => {
      if (line.trim()) {
        yaml += `    - ${line.trim()}\n`;
      }
    });
  }

  // Tooltip Styles
  if (config.tooltip.enabled && config.tooltipStyles) {
    yaml += `  tooltip:\n`;
    config.tooltipStyles.split('\n').forEach(line => {
      if (line.trim()) {
        yaml += `    - ${line.trim()}\n`;
      }
    });
  }

  // --- Resolve onColor/offColor for state logic ---
  const onColorResolved = hexToRgba(config.stateOnColor, config.stateOnOpacity);
  const offColorResolved = hexToRgba(config.stateOffColor, config.stateOffOpacity);

  // --- Conditional State Logic ---
  const getStateLogic = (stateVal: 'on' | 'off', bgColor: string) => {
     const stateCardStyles = [`background-color: ${bgColor}`];
     const stateIconStyles: string[] = [];
     
     // Conditional Card Animation
     if (config.cardAnimation !== 'none' && config.cardAnimationTrigger === stateVal) {
         const anim = getAnimationCSS(config.cardAnimation, config.cardAnimationSpeed);
         if (anim) stateCardStyles.push(anim);
     }
     
     // Conditional Icon Animation
     if (config.iconAnimation !== 'none' && config.iconAnimationTrigger === stateVal) {
         const anim = getAnimationCSS(config.iconAnimation, config.iconAnimationSpeed);
         if (anim) stateIconStyles.push(anim);
     }
     
     // Marquee Special Handling
     let marqueePseudo = '';
     if (config.cardAnimation === 'marquee' && (config.cardAnimationTrigger === stateVal || config.cardAnimationTrigger === 'always')) {
       marqueePseudo = `        - overflow: hidden
        - position: relative
        - "::before":
            - content: '""'
            - position: absolute
            - inset: -4px
            - z-index: -1
            - background: conic-gradient(transparent 20%, var(--button-card-light-color, ${config.borderColor || '#FFC107'}))
            - animation: cba-marquee-spin ${config.cardAnimationSpeed || '4s'} linear infinite`;
     }

     return `  - value: '${stateVal}'
    styles:
      card:
${stateCardStyles.map(s => `        - ${s}`).join('\n')}
${marqueePseudo}
${stateIconStyles.length > 0 ? `      icon:
${stateIconStyles.map(s => `        - ${s}`).join('\n')}` : ''}`;
  };

  yaml += `state:
${getStateLogic('on', onColorResolved)}
${getStateLogic('off', offColorResolved)}
`;

  // Custom State Styles / Conditionals
  if (config.stateStyles && config.stateStyles.length > 0) {
    config.stateStyles.forEach(stateStyle => {
      yaml += `  - `;
      
      // Operator
      if (stateStyle.operator === 'default') {
        yaml += `operator: default\n`;
      } else if (stateStyle.operator === 'template') {
        yaml += `value: ${stateStyle.value}\n`;
      } else if (stateStyle.operator === 'regex') {
        yaml += `operator: regex\n`;
        yaml += `    value: "${stateStyle.value}"\n`;
      } else if (stateStyle.operator === 'above') {
        yaml += `operator: '>'\n`;
        yaml += `    value: ${stateStyle.value}\n`;
      } else if (stateStyle.operator === 'below') {
        yaml += `operator: '<'\n`;
        yaml += `    value: ${stateStyle.value}\n`;
      } else if (stateStyle.operator === 'not_equals') {
        yaml += `operator: '!='\n`;
        yaml += `    value: '${stateStyle.value}'\n`;
      } else {
        yaml += `value: '${stateStyle.value}'\n`;
      }
      
      // Basic Overrides
      if (stateStyle.name) {
        yaml += `    name: "${stateStyle.name}"\n`;
      }
      if (stateStyle.icon) {
        yaml += `    icon: ${stateStyle.icon}\n`;
      }
      if (stateStyle.color) {
        yaml += `    color: "${stateStyle.color}"\n`;
      }
      if (stateStyle.entityPicture) {
        yaml += `    entity_picture: ${stateStyle.entityPicture}\n`;
      }
      if (stateStyle.label) {
        yaml += `    label: "${stateStyle.label}"\n`;
      }
      if (stateStyle.stateDisplay) {
        yaml += `    state_display: "${stateStyle.stateDisplay}"\n`;
      }
      if (stateStyle.spin) {
        yaml += `    spin: true\n`;
      }
      
      // Build styles for conditional colors and animations
      const conditionalCardStyles: string[] = [];
      const conditionalIconStyles: string[] = [];
      const conditionalNameStyles: string[] = [];
      const conditionalLabelStyles: string[] = [];
      
      // Conditional Colors
      if (stateStyle.backgroundColor) {
        conditionalCardStyles.push(`background-color: ${stateStyle.backgroundColor}`);
      }
      if (stateStyle.borderColor) {
        conditionalCardStyles.push(`border-color: ${stateStyle.borderColor}`);
      }
      if (stateStyle.iconColor) {
        conditionalIconStyles.push(`color: ${stateStyle.iconColor}`);
      }
      if (stateStyle.nameColor) {
        conditionalNameStyles.push(`color: ${stateStyle.nameColor}`);
      }
      if (stateStyle.labelColor) {
        conditionalLabelStyles.push(`color: ${stateStyle.labelColor}`);
      }
      
      // Conditional Animations
      if (stateStyle.cardAnimation && stateStyle.cardAnimation !== 'none') {
        const cardAnimCSS = getAnimationCSS(stateStyle.cardAnimation, stateStyle.cardAnimationSpeed || '2s');
        if (cardAnimCSS) {
          conditionalCardStyles.push(cardAnimCSS);
        }
      }
      if (stateStyle.iconAnimation && stateStyle.iconAnimation !== 'none') {
        const iconAnimCSS = getAnimationCSS(stateStyle.iconAnimation, stateStyle.iconAnimationSpeed || '2s');
        if (iconAnimCSS) {
          conditionalIconStyles.push(iconAnimCSS);
        }
      }
      
      // Output styles section if any conditional styles exist
      const hasConditionalStyles = conditionalCardStyles.length > 0 || conditionalIconStyles.length > 0 || 
                                   conditionalNameStyles.length > 0 || conditionalLabelStyles.length > 0 || 
                                   stateStyle.styles;
      
      if (hasConditionalStyles) {
        yaml += `    styles:\n`;
        
        if (conditionalCardStyles.length > 0) {
          yaml += `      card:\n`;
          conditionalCardStyles.forEach(s => {
            yaml += `        - ${s}\n`;
          });
        }
        if (conditionalIconStyles.length > 0) {
          yaml += `      icon:\n`;
          conditionalIconStyles.forEach(s => {
            yaml += `        - ${s}\n`;
          });
        }
        if (conditionalNameStyles.length > 0) {
          yaml += `      name:\n`;
          conditionalNameStyles.forEach(s => {
            yaml += `        - ${s}\n`;
          });
        }
        if (conditionalLabelStyles.length > 0) {
          yaml += `      label:\n`;
          conditionalLabelStyles.forEach(s => {
            yaml += `        - ${s}\n`;
          });
        }
        
        // Additional raw styles from textarea
        if (stateStyle.styles) {
          stateStyle.styles.split('\n').forEach(line => {
            if (line.trim()) {
              yaml += `      ${line.trim()}\n`;
            }
          });
        }
      }
    });
  }

  return yaml;
};
