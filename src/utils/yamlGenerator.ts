
import { ButtonConfig, AnimationType, CustomField, StateStyleConfig, LockConfig, TooltipConfig, ProtectConfig, ToastConfig, ThresholdColorConfig } from "../types";
import { getToggleFallbackService, supportsToggleAction, supportsLiveStream } from "./entityCapabilities";

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

// Helper to generate threshold color template
const generateThresholdColorTemplate = (config: ThresholdColorConfig): string => {
  if (!config.enabled) return '';
  
  const entityId = config.entity || 'entity';
  const valueSource = config.attribute 
    ? `states['${entityId}'].attributes.${config.attribute}`
    : entityId === 'entity' 
      ? `entity.state` 
      : `states['${entityId}'].state`;
  
  if (config.mode === 'ascending') {
    // Low values = green, high values = red
    return `|
      [[[
        var val = parseFloat(${valueSource});
        if (isNaN(val)) return 'inherit';
        if (val <= ${config.greenThreshold}) return '${config.greenColor}';
        if (val <= ${config.yellowThreshold}) return '${config.yellowColor}';
        return '${config.redColor}';
      ]]]`;
  } else {
    // High values = green, low values = red (descending)
    return `|
      [[[
        var val = parseFloat(${valueSource});
        if (isNaN(val)) return 'inherit';
        if (val >= ${config.greenThreshold}) return '${config.greenColor}';
        if (val >= ${config.yellowThreshold}) return '${config.yellowColor}';
        return '${config.redColor}';
      ]]]`;
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
    if (auto) return `    - color: var(--button-card-light-color)\n`;
    if (color) return `    - color: ${color}\n`;
    return null;
  };
  
  // Resolve border color for styles
  const borderColor = config.borderColorAuto ? 'var(--button-card-light-color)' : config.borderColor;
  const borderStyle = config.borderStyle !== 'none' ? `border: ${config.borderWidth} ${config.borderStyle} ${borderColor || 'var(--primary-text-color)'}` : 'border: none';

  // Resolve Backgrounds
  const bgColor = config.backgroundColor ? hexToRgba(config.backgroundColor, config.backgroundColorOpacity) : '';

  // Resolve Shadow
  const shadowCSS = getShadowCSS(config.shadowSize, config.shadowColor, config.shadowOpacity);

  // Resolve Gradient
  const getGradientCSS = () => {
    if (!config.gradientEnabled) return null;
    const colors = config.gradientColor3Enabled 
      ? `${config.gradientColor1}, ${config.gradientColor2}, ${config.gradientColor3}`
      : `${config.gradientColor1}, ${config.gradientColor2}`;
    
    switch (config.gradientType) {
      case 'linear':
        return `background: linear-gradient(${config.gradientAngle}deg, ${colors})`;
      case 'radial':
        return `background: radial-gradient(circle, ${colors})`;
      case 'conic':
        return `background: conic-gradient(from ${config.gradientAngle}deg, ${colors}, ${config.gradientColor1})`;
      default:
        return null;
    }
  };
  const gradientCSS = getGradientCSS();

  // --- Base Card Styles ---
  const cardStyles = [
    config.height !== 'auto' ? `height: ${config.height}` : null,
    config.aspectRatio ? `aspect-ratio: ${config.aspectRatio}` : null,
    gradientCSS ? gradientCSS : (bgColor ? `background-color: ${bgColor}` : null),
    config.cardOpacity < 100 ? `opacity: ${config.cardOpacity / 100}` : null,
    `border-radius: ${config.borderRadius}`,
    `padding: ${config.padding}`,
    `color: ${config.color}`,
    // Use custom font if specified, otherwise use fontFamily dropdown
    (config.customFontName && config.customFontUrl) 
      ? `font-family: '${config.customFontName}', sans-serif`
      : (config.fontFamily ? `font-family: ${config.fontFamily}` : null),
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
  // If alwaysAnimate is enabled, output animations regardless of trigger
  if (config.cardAnimation !== 'none' && (config.alwaysAnimateCard || config.cardAnimationTrigger === 'always')) {
    const anim = getAnimationCSS(config.cardAnimation, config.cardAnimationSpeed);
    if (anim) cardStyles.push(anim);
  }
  if (config.iconAnimation !== 'none' && (config.alwaysAnimateIcon || config.iconAnimationTrigger === 'always')) {
    const anim = getAnimationCSS(config.iconAnimation, config.iconAnimationSpeed);
    if (anim) iconStyles.push(anim);
  }

  // --- Build YAML ---
  let yaml = `type: custom:button-card\n`;
  
  // Only include entity if set
  if (config.entity) {
    yaml += `entity: ${config.entity}\n`;
  }

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

  // Core fields with templates - only output if has value
  if (config.nameTemplate) {
    yaml += `name: ${config.nameTemplate}\n`;
  } else if (config.name) {
    yaml += `name: ${config.name}\n`;
  }

  if (config.iconTemplate) {
    yaml += `icon: ${config.iconTemplate}\n`;
  } else if (config.icon) {
    yaml += `icon: ${config.icon}\n`;
  }

  // Icon size - only if not default
  if (config.size && config.size !== '40%') {
    yaml += `size: ${config.size}\n`;
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

  // Show options - only include if true (false is default, so omit for cleaner YAML)
  // Automatically disable options if their content is not set
  const hasLabelContent = !!(config.labelTemplate || config.labelEntity || config.label);
  const hasEntityPicture = !!config.entityPicture;
  const hasUnits = !!config.units;
  const hasEntity = !!config.entity;
  
  const showLabel = hasLabelContent ? config.showLabel : false;
  const showEntityPicture = hasEntityPicture ? config.showEntityPicture : false;
  const showUnits = hasUnits ? config.showUnits : false;
  const showState = hasEntity ? config.showState : false;
  const showLastChanged = hasEntity ? config.showLastChanged : false;
  
  // Only output show options that are true
  if (config.showName) yaml += `show_name: true\n`;
  if (config.showIcon) yaml += `show_icon: true\n`;
  if (showState) yaml += `show_state: true\n`;
  if (showLabel) yaml += `show_label: true\n`;
  if (showEntityPicture) yaml += `show_entity_picture: true\n`;
  if (showLastChanged) yaml += `show_last_changed: true\n`;
  if (showUnits) yaml += `show_units: true\n`;

  // New show options
  if (config.showRipple === false) {
    yaml += `show_ripple: false\n`;
  }
  if (config.showLiveStream && supportsLiveStream(config.entity)) {
    yaml += `show_live_stream: true\n`;
    if (config.liveStreamAspectRatio) {
      yaml += `live_stream_aspect_ratio: ${config.liveStreamAspectRatio}\n`;
    }
    if (config.liveStreamFitMode) {
      yaml += `live_stream_fit: ${config.liveStreamFitMode}\n`;
    }
  }

  // Only output layout if not default
  if (config.layout && config.layout !== 'vertical') {
    yaml += `layout: ${config.layout}\n`;
  }
  
  // Only output color_type if not default
  if (config.colorType && config.colorType !== 'icon') {
    yaml += `color_type: ${config.colorType}\n`;
  }

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

  // Section Mode
  if (config.sectionMode) {
    yaml += `section_mode: true\n`;
  }

  // Grid Options - always output
  yaml += `grid_options:\n`;
  yaml += `  columns: ${config.gridColumns}\n`;
  yaml += `  rows: ${config.gridRows === 0 ? 'auto' : config.gridRows}\n`;

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

  // Disable Keyboard
  if (config.disableKeyboard) {
    yaml += `disable_keyboard: true\n`;
  }

  // Normalize actions for entity domains that don't support toggle.
  const normalizeAction = (
    actionType: string,
    actionData: string
  ): { actionType: string; actionData: string } => {
    const fallbackService = getToggleFallbackService(config.entity);
    if (actionType === 'toggle' && fallbackService && config.entity) {
      return {
        actionType: 'call-service',
        actionData: JSON.stringify({
          service: fallbackService,
          target: { entity_id: config.entity }
        })
      };
    }
    if (actionType === 'toggle' && config.entity && !supportsToggleAction(config.entity)) {
      return {
        actionType: 'more-info',
        actionData: ''
      };
    }
    return { actionType, actionData };
  };

  const normalizedTap = normalizeAction(config.tapAction, config.tapActionData);
  const normalizedHold = normalizeAction(config.holdAction, config.holdActionData);
  const normalizedDoubleTap = normalizeAction(config.doubleTapAction, config.doubleTapActionData);
  const normalizedPress = normalizeAction(config.pressAction, config.pressActionData);
  const normalizedRelease = normalizeAction(config.releaseAction, config.releaseActionData);
  const normalizedIconTap = normalizeAction(config.iconTapAction, config.iconTapActionData);
  const normalizedIconHold = normalizeAction(config.iconHoldAction, config.iconHoldActionData);
  const normalizedIconDoubleTap = normalizeAction(config.iconDoubleTapAction, config.iconDoubleTapActionData);
  const normalizedIconPress = normalizeAction(config.iconPressAction, config.iconPressActionData);
  const normalizedIconRelease = normalizeAction(config.iconReleaseAction, config.iconReleaseActionData);

  // Actions - Tap
  yaml += `tap_action:\n`;
  yaml += generateActionYaml(
    normalizedTap.actionType,
    normalizedTap.actionData,
    config.tapActionNavigation,
    config.tapActionJavascript,
    config.tapActionToast
  );
  // Haptic: use per-action if set, otherwise use global haptic
  const tapHaptic = config.tapActionSound || config.hapticFeedback;
  if (tapHaptic) {
    yaml += `  haptic: ${tapHaptic}\n`;
  }

  // Actions - Hold
  yaml += `hold_action:\n`;
  yaml += generateActionYaml(
    normalizedHold.actionType,
    normalizedHold.actionData,
    config.holdActionNavigation,
    config.holdActionJavascript,
    config.holdActionToast,
    config.holdActionRepeat,
    config.holdActionRepeatLimit
  );
  const holdHaptic = config.holdActionSound || config.hapticFeedback;
  if (holdHaptic) {
    yaml += `  haptic: ${holdHaptic}\n`;
  }

  // Actions - Double Tap
  yaml += `double_tap_action:\n`;
  yaml += generateActionYaml(
    normalizedDoubleTap.actionType,
    normalizedDoubleTap.actionData,
    config.doubleTapActionNavigation,
    config.doubleTapActionJavascript,
    config.doubleTapActionToast
  );
  const doubleTapHaptic = config.doubleTapActionSound || config.hapticFeedback;
  if (doubleTapHaptic) {
    yaml += `  haptic: ${doubleTapHaptic}\n`;
  }

  // Momentary Actions - Press
  if (config.pressAction !== 'none') {
    yaml += `press_action:\n`;
    yaml += generateActionYaml(
      normalizedPress.actionType,
      normalizedPress.actionData,
      config.pressActionNavigation,
      config.pressActionJavascript
    );
  }

  // Momentary Actions - Release
  if (config.releaseAction !== 'none') {
    yaml += `release_action:\n`;
    yaml += generateActionYaml(
      normalizedRelease.actionType,
      normalizedRelease.actionData,
      config.releaseActionNavigation,
      config.releaseActionJavascript
    );
  }

  // Icon Actions
  if (config.iconTapAction !== 'none') {
    yaml += `icon_tap_action:\n`;
    yaml += generateActionYaml(
      normalizedIconTap.actionType,
      normalizedIconTap.actionData,
      config.iconTapActionNavigation,
      config.iconTapActionJavascript
    );
  }

  if (config.iconHoldAction !== 'none') {
    yaml += `icon_hold_action:\n`;
    yaml += generateActionYaml(
      normalizedIconHold.actionType,
      normalizedIconHold.actionData,
      config.iconHoldActionNavigation,
      config.iconHoldActionJavascript
    );
  }

  if (config.iconDoubleTapAction !== 'none') {
    yaml += `icon_double_tap_action:\n`;
    yaml += generateActionYaml(
      normalizedIconDoubleTap.actionType,
      normalizedIconDoubleTap.actionData,
      config.iconDoubleTapActionNavigation,
      config.iconDoubleTapActionJavascript
    );
  }

  // Icon Momentary Actions
  if (config.iconPressAction !== 'none') {
    yaml += `icon_press_action:\n`;
    yaml += generateActionYaml(
      normalizedIconPress.actionType,
      normalizedIconPress.actionData,
      config.iconPressActionNavigation
    );
  }

  if (config.iconReleaseAction !== 'none') {
    yaml += `icon_release_action:\n`;
    yaml += generateActionYaml(
      normalizedIconRelease.actionType,
      normalizedIconRelease.actionData,
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
      if (field.type === 'entity' && field.entity) {
        // Entity-based field - generate template automatically
        const entityId = field.entity;
        const attr = field.attribute;
        const prefix = field.prefix || '';
        const suffix = field.suffix || '';
        const icon = field.icon;
        
        let template = '[[[';
        if (icon) {
          template += `\n    var icon = '<ha-icon icon="${icon}" style="width:14px;height:14px;margin-right:4px;"></ha-icon>';`;
        }
        if (attr) {
          template += `\n    var val = states['${entityId}'].attributes.${attr};`;
        } else {
          template += `\n    var val = states['${entityId}'].state;`;
        }
        if (icon) {
          template += `\n    return icon + '${prefix}' + val + '${suffix}';`;
        } else {
          template += `\n    return '${prefix}' + val + '${suffix}';`;
        }
        template += '\n  ]]]';
        
        yaml += `  ${field.name}: |\n    ${template}\n`;
      } else if (field.value.includes('[[[') && field.value.includes(']]]')) {
        // Template with JS syntax
        yaml += `  ${field.name}: |\n    ${field.value}\n`;
      } else {
        yaml += `  ${field.name}: "${field.value}"\n`;
      }
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
  
  // --- Extra Styles (Keyframes and Custom Fonts) ---
  let extraStyles = '';
  
  // Custom Font @import (must be at the top of extra_styles)
  if (config.customFontName && config.customFontUrl) {
    // Handle both full @import statements and just URLs
    const fontUrl = config.customFontUrl.trim();
    if (fontUrl.startsWith('@import')) {
      extraStyles += `  ${fontUrl}\n`;
    } else if (fontUrl.startsWith('http')) {
      extraStyles += `  @import url('${fontUrl}');\n`;
    }
  }
  
  // Marquee special keyframes
  if (config.cardAnimation === 'marquee') {
    extraStyles += `  @keyframes cba-marquee-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
  }
  // Add generic keyframes if any animation is used
  // Also check if extraStyles contains animation references (for presets like Holographic, Lava Lamp)
  const extraStylesHasAnimation = config.extraStyles && (
    config.extraStyles.includes('holo-shift') || 
    config.extraStyles.includes('lava-shift') ||
    config.extraStyles.includes('animation:')
  );
  const needsGenericKeyframes = (config.cardAnimation !== 'none' && config.cardAnimation !== 'marquee') || config.iconAnimation !== 'none' || config.spin || config.rotate || extraStylesHasAnimation;
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
  @keyframes cba-breathe {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.03); opacity: 0.9; }
  }
  @keyframes cba-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes cba-ripple {
    0% { box-shadow: 0 0 0 0 currentColor; }
    100% { box-shadow: 0 0 0 20px transparent; }
  }
  @keyframes cba-rubberBand {
    0% { transform: scale(1, 1); }
    30% { transform: scale(1.25, 0.75); }
    40% { transform: scale(0.75, 1.25); }
    50% { transform: scale(1.15, 0.85); }
    65% { transform: scale(0.95, 1.05); }
    75% { transform: scale(1.05, 0.95); }
    100% { transform: scale(1, 1); }
  }
  @keyframes lava-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes holo-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;
  }

  if (extraStyles) {
    yaml += `extra_styles: |\n${extraStyles}`;
  }

  // Helper to format CSS style for YAML (quote values with special chars)
  const formatStyleForYaml = (style: string): string => {
    const colonIndex = style.indexOf(':');
    if (colonIndex > 0) {
      const prop = style.substring(0, colonIndex).trim();
      const value = style.substring(colonIndex + 1).trim();
      // Quote values containing parentheses, commas, or other special chars
      if (value.includes('(') || value.includes(',') || value.includes('#')) {
        return `${prop}: '${value}'`;
      }
    }
    return style;
  };

  // --- Styles Section (only if there are styles) ---
  const hasCardStyles = cardStyles.length > 0 || config.extraStyles;
  const hasIconStyles = iconStyles.length > 0 || (config.thresholdColor.enabled && config.thresholdColor.applyToIcon);
  const nameColorLine = getColorLine(config.nameColor, config.nameColorAuto);
  const labelColorLine = getColorLine(config.labelColor, config.labelColorAuto);
  const stateColorLine = getColorLine(config.stateColor, config.stateColorAuto);
  const hasNameStyles = nameColorLine || (config.fontWeight && config.fontWeight !== 'normal') || (config.thresholdColor.enabled && config.thresholdColor.applyToName);
  const hasLabelStyles = !!labelColorLine || (config.thresholdColor.enabled && config.thresholdColor.applyToLabel);
  const hasStateStyles = !!stateColorLine || (config.thresholdColor.enabled && config.thresholdColor.applyToState);
  const hasEntityPictureStyles = !!config.entityPictureStyles;
  const hasGridStyles = !!config.gridStyles || config.customGridEnabled;
  const fieldsWithStyles = config.customFields.filter(f => f.styles || f.gridArea);
  const hasLockStyles = config.lock.enabled && config.lockStyles;
  const hasTooltipStyles = config.tooltip.enabled && config.tooltipStyles;
  const hasImgCellStyles = !!config.imgCellStyles;
  const thresholdColorTemplate = generateThresholdColorTemplate(config.thresholdColor);
  
  const hasAnyStyles = hasCardStyles || hasIconStyles || hasNameStyles || hasLabelStyles || 
                       hasStateStyles || hasEntityPictureStyles || hasGridStyles || 
                       fieldsWithStyles.length > 0 || hasLockStyles || hasTooltipStyles || hasImgCellStyles;

  if (hasAnyStyles) {
    yaml += `styles:\n`;
    
    if (hasCardStyles) {
      yaml += `  card:\n`;
      cardStyles.forEach(s => {
        yaml += `    - ${formatStyleForYaml(s)}\n`;
      });
      // Marquee special handling for alwaysAnimate or trigger='always'
      if (config.cardAnimation === 'marquee' && (config.alwaysAnimateCard || config.cardAnimationTrigger === 'always')) {
        yaml += `    - overflow: hidden\n`;
        yaml += `    - position: relative\n`;
        yaml += `    - "::before":\n`;
        yaml += `        - content: '""'\n`;
        yaml += `        - position: absolute\n`;
        yaml += `        - inset: -4px\n`;
        yaml += `        - border-radius: inherit\n`;
        yaml += `        - background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)\n`;
        yaml += `        - background-size: 200% 200%\n`;
        yaml += `        - animation: cba-marquee-spin ${config.cardAnimationSpeed || '4s'} linear infinite\n`;
      }
      // Extra styles from textarea
      if (config.extraStyles) {
        yaml += `    # Custom Extra Styles\n`;
        config.extraStyles.split('\n').forEach(line => {
          if (line.trim()) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
              const prop = line.substring(0, colonIndex).trim();
              const value = line.substring(colonIndex + 1).trim();
              yaml += `    - ${prop}: '${value}'\n`;
            } else {
              yaml += `    - ${line.trim()}\n`;
            }
          }
        });
      }
    }

    if (hasIconStyles) {
      yaml += `  icon:\n`;
      iconStyles.forEach(s => {
        yaml += `    - ${formatStyleForYaml(s)}\n`;
      });
      // Threshold color for icon
      if (config.thresholdColor.enabled && config.thresholdColor.applyToIcon && thresholdColorTemplate) {
        yaml += `    - color: ${thresholdColorTemplate}\n`;
      }
    }

    // Name Styles - only if there's actual styling
    if (hasNameStyles) {
      yaml += `  name:\n`;
      if (config.fontWeight && config.fontWeight !== 'normal') {
        yaml += `    - font-weight: ${config.fontWeight}\n`;
      }
      if (config.thresholdColor.enabled && config.thresholdColor.applyToName && thresholdColorTemplate) {
        yaml += `    - color: ${thresholdColorTemplate}\n`;
      } else if (nameColorLine) {
        yaml += nameColorLine;
      }
    }

    // Label Styles
    if (hasLabelStyles) {
      yaml += `  label:\n`;
      if (config.thresholdColor.enabled && config.thresholdColor.applyToLabel && thresholdColorTemplate) {
        yaml += `    - color: ${thresholdColorTemplate}\n`;
      } else {
        yaml += labelColorLine;
      }
    }

    // State Styles (Text)
    if (hasStateStyles) {
      yaml += `  state:\n`;
      if (config.thresholdColor.enabled && config.thresholdColor.applyToState && thresholdColorTemplate) {
        yaml += `    - color: ${thresholdColorTemplate}\n`;
      } else {
        yaml += stateColorLine;
      }
    }

    // Entity Picture Styles
    if (hasEntityPictureStyles) {
      yaml += `  entity_picture:\n`;
      config.entityPictureStyles.split('\n').forEach(line => {
        if (line.trim()) {
          yaml += `    - ${line.trim()}\n`;
        }
      });
    }

    // Grid Styles
    if (hasGridStyles) {
      yaml += `  grid:\n`;
      // Custom grid template areas
      if (config.customGridEnabled) {
        yaml += `    - grid-template-areas: ${config.customGridTemplateAreas}\n`;
        if (config.customGridTemplateColumns) {
          yaml += `    - grid-template-columns: ${config.customGridTemplateColumns}\n`;
        }
        if (config.customGridTemplateRows) {
          yaml += `    - grid-template-rows: ${config.customGridTemplateRows}\n`;
        }
      }
      // Additional raw grid styles
      if (config.gridStyles) {
        config.gridStyles.split('\n').forEach(line => {
          if (line.trim()) {
            yaml += `    - ${line.trim()}\n`;
          }
        });
      }
    }

    // Custom Field Styles (including grid-area positioning)
    if (fieldsWithStyles.length > 0) {
      yaml += `  custom_fields:\n`;
      fieldsWithStyles.forEach(field => {
        yaml += `    ${field.name}:\n`;
        // Add grid-area if specified
        if (field.gridArea) {
          yaml += `      - grid-area: ${field.gridArea}\n`;
        }
        // Add other styles
        if (field.styles) {
          field.styles.split('\n').forEach(line => {
            if (line.trim()) {
              yaml += `      - ${line.trim()}\n`;
            }
          });
        }
      });
    }

    // Lock Styles
    if (hasLockStyles) {
      yaml += `  lock:\n`;
      config.lockStyles.split('\n').forEach(line => {
        if (line.trim()) {
          yaml += `    - ${line.trim()}\n`;
        }
      });
    }

    // Tooltip Styles
    if (hasTooltipStyles) {
      yaml += `  tooltip:\n`;
      config.tooltipStyles.split('\n').forEach(line => {
        if (line.trim()) {
          yaml += `    - ${line.trim()}\n`;
        }
      });
    }

    // Img Cell Styles
    if (hasImgCellStyles) {
      yaml += `  img_cell:\n`;
      config.imgCellStyles.split('\n').forEach(line => {
        if (line.trim()) {
          yaml += `    - ${line.trim()}\n`;
        }
      });
    }
  }

  // --- Conditional State Logic ---
  const getStateLogic = (stateVal: 'on' | 'off') => {
     // Background color is now handled by state appearance, not hardcoded on/off colors
     const stateCardStyles: string[] = [];
     const stateIconStyles: string[] = [];
     
     // Handle stateOnColor / stateOffColor for background
     const stateColor = stateVal === 'on' ? config.stateOnColor : config.stateOffColor;
     const stateOpacity = stateVal === 'on' ? config.stateOnOpacity : config.stateOffOpacity;
     if (stateColor) {
       if (stateOpacity !== undefined && stateOpacity < 100) {
         stateCardStyles.push(`background-color: ${hexToRgba(stateColor, stateOpacity)}`);
       } else {
         stateCardStyles.push(`background-color: ${stateColor}`);
       }
     }
     
     // Conditional Card Animation (skip if alwaysAnimateCard is enabled - handled globally)
     if (!config.alwaysAnimateCard && config.cardAnimation !== 'none' && config.cardAnimationTrigger === stateVal) {
         const anim = getAnimationCSS(config.cardAnimation, config.cardAnimationSpeed);
         if (anim) stateCardStyles.push(anim);
     }
     
     // Conditional Icon Animation (skip if alwaysAnimateIcon is enabled - handled globally)
     if (!config.alwaysAnimateIcon && config.iconAnimation !== 'none' && config.iconAnimationTrigger === stateVal) {
         const anim = getAnimationCSS(config.iconAnimation, config.iconAnimationSpeed);
         if (anim) stateIconStyles.push(anim);
     }
     
     // Marquee Special Handling
     let marqueePseudo = '';
     if (!config.alwaysAnimateCard && config.cardAnimation === 'marquee' && (config.cardAnimationTrigger === stateVal || config.cardAnimationTrigger === 'always')) {
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

     // Only return state entry if there are actual styles to output
     if (stateCardStyles.length === 0 && stateIconStyles.length === 0 && !marqueePseudo) {
       return '';
     }

     return `  - value: '${stateVal}'
    styles:
${stateCardStyles.length > 0 || marqueePseudo ? `      card:
${stateCardStyles.map(s => `        - ${formatStyleForYaml(s)}`).join('\n')}
${marqueePseudo}` : ''}${stateIconStyles.length > 0 ? `      icon:
${stateIconStyles.map(s => `        - ${formatStyleForYaml(s)}`).join('\n')}` : ''}`;
  };

  const onStateLogic = getStateLogic('on');
  const offStateLogic = getStateLogic('off');
  
  // Output state section if we have state logic OR state styles (conditionals)
  const hasStateConditionals = config.stateStyles && config.stateStyles.length > 0;
  
  if (onStateLogic || offStateLogic || hasStateConditionals) {
    yaml += `state:
`;
    if (onStateLogic) yaml += onStateLogic + '\n';
    if (offStateLogic) yaml += offStateLogic + '\n';
  }
  
  // Custom State Styles / Conditionals
  if (hasStateConditionals) {
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
      const conditionalStateStyles: string[] = [];
      const conditionalLabelStyles: string[] = [];
      
      // Conditional Colors
      // Handle gradient if enabled, otherwise use backgroundColor
      if (stateStyle.gradientEnabled) {
        const gradientOpacity = (stateStyle.gradientOpacity ?? 100) / 100;
        
        // Convert hex to rgba with opacity
        const toRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        
        const color1 = toRgba(stateStyle.gradientColor1 || '#667eea', gradientOpacity);
        const color2 = toRgba(stateStyle.gradientColor2 || '#764ba2', gradientOpacity);
        const color3 = toRgba(stateStyle.gradientColor3 || '#f093fb', gradientOpacity);
        
        const colors = stateStyle.gradientColor3Enabled 
          ? `${color1}, ${color2}, ${color3}`
          : `${color1}, ${color2}`;
        
        let gradientBg = '';
        switch (stateStyle.gradientType) {
          case 'linear':
            gradientBg = `background: linear-gradient(${stateStyle.gradientAngle}deg, ${colors})`;
            break;
          case 'radial':
            gradientBg = `background: radial-gradient(circle, ${colors})`;
            break;
          case 'conic':
            gradientBg = `background: conic-gradient(from ${stateStyle.gradientAngle}deg, ${colors}, ${color1})`;
            break;
        }
        if (gradientBg) {
          conditionalCardStyles.push(gradientBg);
        }
      } else if (stateStyle.backgroundColor) {
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
      if (stateStyle.stateColor) {
        conditionalStateStyles.push(`color: ${stateStyle.stateColor}`);
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
      
      // Parse extra styles and add to card styles
      // These are CSS properties like "background: linear-gradient(...)" or "animation: ..."
      if (stateStyle.styles) {
        stateStyle.styles.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && trimmed.includes(':')) {
            conditionalCardStyles.push(trimmed);
          }
        });
      }
      
      // Output styles section if any conditional styles exist
      const hasConditionalStyles = conditionalCardStyles.length > 0 || conditionalIconStyles.length > 0 || 
                                   conditionalNameStyles.length > 0 || conditionalStateStyles.length > 0 || 
                                   conditionalLabelStyles.length > 0;
      
      if (hasConditionalStyles) {
        yaml += `    styles:\n`;
        
        if (conditionalCardStyles.length > 0) {
          yaml += `      card:\n`;
          conditionalCardStyles.forEach(s => {
            yaml += `        - ${formatStyleForYaml(s)}\n`;
          });
        }
        if (conditionalIconStyles.length > 0) {
          yaml += `      icon:\n`;
          conditionalIconStyles.forEach(s => {
            yaml += `        - ${formatStyleForYaml(s)}\n`;
          });
        }
        if (conditionalNameStyles.length > 0) {
          yaml += `      name:\n`;
          conditionalNameStyles.forEach(s => {
            yaml += `        - ${formatStyleForYaml(s)}\n`;
          });
        }
        if (conditionalStateStyles.length > 0) {
          yaml += `      state:\n`;
          conditionalStateStyles.forEach(s => {
            yaml += `        - ${formatStyleForYaml(s)}\n`;
          });
        }
        if (conditionalLabelStyles.length > 0) {
          yaml += `      label:\n`;
          conditionalLabelStyles.forEach(s => {
            yaml += `        - ${formatStyleForYaml(s)}\n`;
          });
        }
      }
    });
  }

  return yaml;
};

// Helper to format styles for YAML (handle colons and special characters properly)
const formatStyleForYaml = (style: string): string => {
  // If it contains a colon, we need to quote it or format it properly
  if (style.includes(':')) {
    const colonIndex = style.indexOf(':');
    const prop = style.substring(0, colonIndex).trim();
    const value = style.substring(colonIndex + 1).trim();
    // Quote values that contain special YAML characters (commas, parentheses, etc.)
    if (value.includes(',') || value.includes('(') || value.includes(')') || value.includes('#') || value.includes("'")) {
      // Escape any single quotes in the value and wrap in single quotes
      const escapedValue = value.replace(/'/g, "''");
      return `${prop}: '${escapedValue}'`;
    }
    return `${prop}: ${value}`;
  }
  return style;
};

/**
 * Generate a global button_card_templates YAML that can be added to the dashboard
 * to make all buttons inherit this theme
 */
export const generateGlobalTemplate = (config: ButtonConfig, templateName: string = 'custom_theme'): string => {
  let yaml = `# Button Card Global Template
# Generated by Button Builder
#
# HOW TO USE:
# 1. Open your dashboard in Edit mode
# 2. Click the 3-dot menu → Raw configuration editor
# 3. Paste this ENTIRE block at the TOP of the file (before "views:")
# 4. Save and exit the editor
# 5. Use "template: ${templateName}" in any button-card
#
# If you already have button_card_templates:, just add the template
# definition (${templateName}: ...) under your existing templates.

button_card_templates:
  ${templateName}:
`;

  // Add show_* options
  const showOptions: string[] = [];
  if (config.showName !== undefined) showOptions.push(`    show_name: ${config.showName}`);
  if (config.showIcon !== undefined) showOptions.push(`    show_icon: ${config.showIcon}`);
  if (config.showState !== undefined) showOptions.push(`    show_state: ${config.showState}`);
  if (config.showLabel !== undefined) showOptions.push(`    show_label: ${config.showLabel}`);
  
  if (showOptions.length > 0) {
    yaml += showOptions.join('\n') + '\n';
  }

  // Generate base styles section
  const cardStyles: string[] = [];
  const iconStyles: string[] = [];
  const nameStyles: string[] = [];
  const labelStyles: string[] = [];

  // Border radius (always useful)
  if (config.borderRadius && config.borderRadius !== '12px') {
    cardStyles.push(`border-radius: ${config.borderRadius}`);
  } else {
    cardStyles.push('border-radius: 12px');
  }

  // Borders
  if (config.borderStyle !== 'none' && config.borderWidth && config.borderColor) {
    cardStyles.push(`border: ${config.borderWidth} ${config.borderStyle} ${config.borderColor}`);
  }

  // Glass/blur effects (applied to both states)
  if (config.backdropBlur && config.backdropBlur !== '0px') {
    cardStyles.push(`backdrop-filter: blur(${config.backdropBlur})`);
    cardStyles.push(`'-webkit-backdrop-filter': blur(${config.backdropBlur})`);
  }

  // Background for non-light entities or base style
  if (!config.gradientEnabled && config.backgroundColor && config.backgroundColorOpacity !== undefined) {
    cardStyles.push(`background: ${hexToRgba(config.backgroundColor, config.backgroundColorOpacity)}`);
  } else if (config.gradientEnabled && config.gradientColor1 && config.gradientColor2) {
    const gradient = `linear-gradient(${config.gradientAngle || 135}deg, ${config.gradientColor1}, ${config.gradientColor2})`;
    cardStyles.push(`background: '${gradient}'`);
  }

  // Shadow
  const shadowCSS = getShadowCSS(config.shadowSize, config.shadowColor, config.shadowOpacity);
  if (shadowCSS) {
    cardStyles.push(shadowCSS);
  }

  // Icon styles
  if (!config.iconColorAuto && config.iconColor) {
    iconStyles.push(`color: ${config.iconColor}`);
  }

  // Name styles
  if (config.nameColor) {
    nameStyles.push(`color: ${config.nameColor}`);
  }
  if (config.fontFamily && config.fontFamily !== 'inherit') {
    nameStyles.push(`font-family: ${config.fontFamily}`);
  }
  if (config.fontSize) {
    nameStyles.push(`font-size: ${config.fontSize}`);
  }
  if (config.fontWeight && config.fontWeight !== 'normal') {
    nameStyles.push(`font-weight: ${config.fontWeight}`);
  }
  if (config.textTransform && config.textTransform !== 'none') {
    nameStyles.push(`text-transform: ${config.textTransform}`);
  }
  if (config.letterSpacing && config.letterSpacing !== 'normal') {
    nameStyles.push(`letter-spacing: ${config.letterSpacing}`);
  }

  // Label styles
  if (config.labelColor) {
    labelStyles.push(`color: ${config.labelColor}`);
  }

  // Extra styles from config (e.g., Lava Lamp, Holographic presets)
  if (config.extraStyles) {
    config.extraStyles.split('\n').forEach(line => {
      if (line.trim()) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const prop = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          cardStyles.push(`${prop}: ${value}`);
        }
      }
    });
  }

  // Build the styles section
  const hasStyles = cardStyles.length > 0 || iconStyles.length > 0 || nameStyles.length > 0 || labelStyles.length > 0;
  if (hasStyles) {
    yaml += `    styles:\n`;
    
    if (cardStyles.length > 0) {
      yaml += `      card:\n`;
      cardStyles.forEach(s => {
        yaml += `        - ${formatStyleForYaml(s)}\n`;
      });
    }
    
    if (iconStyles.length > 0) {
      yaml += `      icon:\n`;
      iconStyles.forEach(s => {
        yaml += `        - ${formatStyleForYaml(s)}\n`;
      });
    }
    
    if (nameStyles.length > 0) {
      yaml += `      name:\n`;
      nameStyles.forEach(s => {
        yaml += `        - ${formatStyleForYaml(s)}\n`;
      });
    }
    
    if (labelStyles.length > 0) {
      yaml += `      label:\n`;
      labelStyles.forEach(s => {
        yaml += `        - ${formatStyleForYaml(s)}\n`;
      });
    }
  }

  // Add state-specific styles if configured in the UI
  if (config.stateStyles && config.stateStyles.length > 0) {
    yaml += `    state:\n`;
    config.stateStyles.forEach(stateStyle => {
      yaml += `      - value: '${stateStyle.value}'\n`;
      if (stateStyle.operator && stateStyle.operator !== '==' as any) {
        yaml += `        operator: '${stateStyle.operator}'\n`;
      }
      
      const stateCardStyles: string[] = [];
      const stateIconStyles: string[] = [];
      
      if (stateStyle.backgroundColor) {
        stateCardStyles.push(`background-color: ${stateStyle.backgroundColor}`);
      }
      if (stateStyle.iconColor) {
        stateIconStyles.push(`color: ${stateStyle.iconColor}`);
      }
      
      if (stateCardStyles.length > 0 || stateIconStyles.length > 0) {
        yaml += `        styles:\n`;
        if (stateCardStyles.length > 0) {
          yaml += `          card:\n`;
          stateCardStyles.forEach(s => {
            yaml += `            - ${formatStyleForYaml(s)}\n`;
          });
        }
        if (stateIconStyles.length > 0) {
          yaml += `          icon:\n`;
          stateIconStyles.forEach(s => {
            yaml += `            - ${formatStyleForYaml(s)}\n`;
          });
        }
      }
    });
  }

  // Add extra_styles with @keyframes if needed for animations
  let extraStylesContent = '';
  
  // Check if extraStyles references animations that need keyframes
  if (config.extraStyles) {
    if (config.extraStyles.includes('lava-shift')) {
      extraStylesContent += `      @keyframes lava-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
`;
    }
    if (config.extraStyles.includes('holo-shift')) {
      extraStylesContent += `      @keyframes holo-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
`;
    }
  }
  
  // Add card animations keyframes
  if (config.cardAnimation && config.cardAnimation !== 'none') {
    if (config.cardAnimation === 'pulse') {
      extraStylesContent += `      @keyframes cba-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
`;
    } else if (config.cardAnimation === 'flash') {
      extraStylesContent += `      @keyframes cba-flash {
        0%, 50%, 100% { opacity: 1; }
        25%, 75% { opacity: 0.5; }
      }
`;
    } else if (config.cardAnimation === 'bounce') {
      extraStylesContent += `      @keyframes cba-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
`;
    }
  }
  
  if (extraStylesContent) {
    yaml += `    extra_styles: |\n${extraStylesContent}`;
  }

  // Add usage example with light entity dynamic glow suggestion
  yaml += `
# ─────────────────────────────────────────────────────────
# USAGE EXAMPLE:
# ─────────────────────────────────────────────────────────
# type: custom:button-card
# entity: light.living_room
# template: ${templateName}
# name: Living Room
# icon: mdi:lightbulb
#
# ─────────────────────────────────────────────────────────
# TIP: For lights with dynamic glow based on color, you can
# extend this template with state-based JavaScript templates:
#
# button_card_templates:
#   ${templateName}_glow:
#     template: ${templateName}
#     state:
#       - value: 'on'
#         styles:
#           card:
#             - box-shadow: |
#                 [[[
#                   const rgb = entity.attributes.rgb_color;
#                   const bri = (entity.attributes.brightness ?? 255) / 255;
#                   const alpha = Math.max(0.25, Math.min(0.95, bri));
#                   return rgb
#                     ? \`0 0 24px 8px rgba(\${rgb[0]},\${rgb[1]},\${rgb[2]},\${alpha})\`
#                     : \`0 0 24px 8px rgba(255,223,70,\${alpha})\`;
#                 ]]]
#       - value: 'off'
#         styles:
#           card:
#             - box-shadow: none
`;

  return yaml;
};
