
import { ButtonConfig, AnimationType, CustomField } from "../types";

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
    default: return null;
  }
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
  
  if (config.spin) {
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
  } else if (config.label) {
    yaml += `label: "${config.label}"\n`;
  }

  // Entity Picture
  if (config.entityPicture) {
    yaml += `entity_picture: ${config.entityPicture}\n`;
  }

  // Show options
  yaml += `show_name: ${config.showName}
show_icon: ${config.showIcon}
show_state: ${config.showState}
show_label: ${config.showLabel}
show_entity_picture: ${config.showEntityPicture}
show_last_changed: ${config.showLastChanged}
show_units: ${config.showUnits}
size: ${config.size}
layout: ${config.layout}
color_type: ${config.colorType}
`;

  if (config.colorAuto) {
    yaml += `color: auto\n`;
  }
  
  if (config.aspectRatio) {
    yaml += `aspect_ratio: ${config.aspectRatio}\n`;
  }

  // Tooltip
  if (config.tooltip) {
    yaml += `tooltip: "${config.tooltip}"\n`;
  }

  // Lock
  if (config.lock) {
    yaml += `lock:\n  enabled: true\n`;
    if (config.lockCode) {
      yaml += `  code: "${config.lockCode}"\n`;
    }
  }

  // Hold Time
  if (config.holdTime !== 500) {
    yaml += `hold_time: ${config.holdTime}\n`;
  }

  // Haptic
  if (config.hapticFeedback) {
    yaml += `haptic: true\n`;
  }

  // Actions
  yaml += `tap_action:
  action: ${config.tapAction}
`;
  if (config.tapAction === 'call-service' && config.tapActionData) {
    try {
      const data = JSON.parse(config.tapActionData);
      yaml += `  service: ${data.service || ''}\n`;
      if (data.service_data) {
        yaml += `  service_data:\n`;
        Object.entries(data.service_data).forEach(([key, value]) => {
          yaml += `    ${key}: ${JSON.stringify(value)}\n`;
        });
      }
    } catch (e) {
      yaml += `  # Invalid JSON in tap_action_data\n`;
    }
  }
  if ((config.tapAction === 'navigate' || config.tapAction === 'url') && config.tapActionNavigation) {
    yaml += `  navigation_path: ${config.tapActionNavigation}\n`;
  }

  yaml += `hold_action:
  action: ${config.holdAction}
`;
  if (config.holdAction === 'call-service' && config.holdActionData) {
    try {
      const data = JSON.parse(config.holdActionData);
      yaml += `  service: ${data.service || ''}\n`;
      if (data.service_data) {
        yaml += `  service_data:\n`;
        Object.entries(data.service_data).forEach(([key, value]) => {
          yaml += `    ${key}: ${JSON.stringify(value)}\n`;
        });
      }
    } catch (e) {
      yaml += `  # Invalid JSON in hold_action_data\n`;
    }
  }
  if ((config.holdAction === 'navigate' || config.holdAction === 'url') && config.holdActionNavigation) {
    yaml += `  navigation_path: ${config.holdActionNavigation}\n`;
  }

  yaml += `double_tap_action:
  action: ${config.doubleTapAction}
`;
  if (config.doubleTapAction === 'call-service' && config.doubleTapActionData) {
    try {
      const data = JSON.parse(config.doubleTapActionData);
      yaml += `  service: ${data.service || ''}\n`;
      if (data.service_data) {
        yaml += `  service_data:\n`;
        Object.entries(data.service_data).forEach(([key, value]) => {
          yaml += `    ${key}: ${JSON.stringify(value)}\n`;
        });
      }
    } catch (e) {
      yaml += `  # Invalid JSON in double_tap_action_data\n`;
    }
  }
  if ((config.doubleTapAction === 'navigate' || config.doubleTapAction === 'url') && config.doubleTapActionNavigation) {
    yaml += `  navigation_path: ${config.doubleTapActionNavigation}\n`;
  }

  // Confirmation
  if (config.confirmation.enabled) {
    yaml += `confirmation:
  text: "${config.confirmation.text}"
`;
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
  const needsGenericKeyframes = (config.cardAnimation !== 'none' && config.cardAnimation !== 'marquee') || config.iconAnimation !== 'none' || config.spin;
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

  // --- Conditional State Logic ---
  const getStateLogic = (stateVal: 'on' | 'off', bgColor: string) => {
     const stateCardStyles = [`background-color: ${bgColor}`];
     const stateIconStyles = [];
     
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
            - animation: cba-marquee-spin 4s linear infinite`;
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
${getStateLogic('on', onColor)}
${getStateLogic('off', offColor)}
`;

  return yaml;
};
