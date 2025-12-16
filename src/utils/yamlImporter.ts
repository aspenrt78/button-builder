import YAML from 'yaml';
import { ButtonConfig, DEFAULT_CONFIG, StateStyleConfig, Variable, CustomField, ToastConfig, DEFAULT_TOAST_CONFIG, DEFAULT_LOCK_CONFIG, DEFAULT_PROTECT_CONFIG, DEFAULT_TOOLTIP_CONFIG } from '../types';

/**
 * Parses button-card YAML and converts it to a ButtonConfig object
 */
export const parseButtonCardYaml = (yamlString: string): Partial<ButtonConfig> => {
  // Parse YAML
  const parsed = YAML.parse(yamlString);
  
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid YAML structure');
  }
  
  const config: Partial<ButtonConfig> = {};
  
  // Core fields - direct mapping with template detection
  if (parsed.entity) config.entity = String(parsed.entity);
  if (parsed.name !== undefined) {
    const nameStr = String(parsed.name);
    if (nameStr.includes('[[[')) {
      config.nameTemplate = nameStr;
    } else {
      config.name = nameStr;
    }
  }
  if (parsed.icon) {
    const iconStr = String(parsed.icon);
    if (iconStr.includes('[[[')) {
      config.iconTemplate = iconStr;
    } else {
      config.icon = iconStr;
    }
  }
  if (parsed.label !== undefined) {
    const labelStr = String(parsed.label);
    if (labelStr.includes('[[[')) {
      config.labelTemplate = labelStr;
    } else {
      config.label = labelStr;
    }
  }
  if (parsed.entity_picture) config.entityPicture = String(parsed.entity_picture);
  if (parsed.state_display) {
    const stateStr = String(parsed.state_display);
    if (stateStr.includes('[[[')) {
      config.stateDisplayTemplate = stateStr;
    } else {
      config.stateDisplay = stateStr;
    }
  }
  if (parsed.size) config.size = String(parsed.size);
  if (parsed.units) config.units = String(parsed.units);
  if (parsed.template) config.template = String(parsed.template);
  
  // Layout options
  if (parsed.layout) config.layout = parsed.layout;
  if (parsed.color_type) config.colorType = parsed.color_type;
  if (parsed.aspect_ratio) config.aspectRatio = String(parsed.aspect_ratio);
  if (parsed.card_size !== undefined) config.cardSize = Number(parsed.card_size);
  
  // Show options
  if (parsed.show_name !== undefined) config.showName = Boolean(parsed.show_name);
  if (parsed.show_icon !== undefined) config.showIcon = Boolean(parsed.show_icon);
  if (parsed.show_state !== undefined) config.showState = Boolean(parsed.show_state);
  if (parsed.show_label !== undefined) config.showLabel = Boolean(parsed.show_label);
  if (parsed.show_entity_picture !== undefined) config.showEntityPicture = Boolean(parsed.show_entity_picture);
  if (parsed.show_last_changed !== undefined) config.showLastChanged = Boolean(parsed.show_last_changed);
  if (parsed.show_units !== undefined) config.showUnits = Boolean(parsed.show_units);
  if (parsed.show_ripple !== undefined) config.showRipple = Boolean(parsed.show_ripple);
  if (parsed.show_live_stream !== undefined) config.showLiveStream = Boolean(parsed.show_live_stream);
  
  // Live stream options
  if (parsed.live_stream_aspect_ratio) config.liveStreamAspectRatio = String(parsed.live_stream_aspect_ratio);
  if (parsed.live_stream_fit) config.liveStreamFitMode = String(parsed.live_stream_fit);
  
  // Advanced options
  if (parsed.numeric_precision !== undefined) config.numericPrecision = Number(parsed.numeric_precision);
  if (parsed.hold_time !== undefined) config.holdTime = Number(parsed.hold_time);
  if (parsed.update_timer !== undefined) config.updateTimer = Number(parsed.update_timer);
  if (parsed.hidden !== undefined) {
    if (typeof parsed.hidden === 'string' && parsed.hidden.includes('[[[')) {
      config.hidden = true;
      config.hiddenTemplate = parsed.hidden;
    } else {
      config.hidden = Boolean(parsed.hidden);
    }
  }
  if (parsed.spinner !== undefined) {
    if (typeof parsed.spinner === 'string' && parsed.spinner.includes('[[[')) {
      config.spinner = true;
      config.spinnerTemplate = parsed.spinner;
    } else {
      config.spinner = Boolean(parsed.spinner);
    }
  }
  if (parsed.group_expand !== undefined) config.groupExpand = Boolean(parsed.group_expand);
  if (parsed.haptic !== undefined) config.hapticFeedback = String(parsed.haptic);
  if (parsed.disable_keyboard !== undefined) config.disableKeyboard = Boolean(parsed.disable_keyboard);
  
  // Section mode / Grid
  if (parsed.section_mode !== undefined) config.sectionMode = Boolean(parsed.section_mode);
  if (parsed.grid_options) {
    if (parsed.grid_options.rows !== undefined) {
      // Handle 'auto' as 0
      config.gridRows = parsed.grid_options.rows === 'auto' ? 0 : Number(parsed.grid_options.rows);
    }
    if (parsed.grid_options.columns !== undefined) config.gridColumns = Number(parsed.grid_options.columns);
  }
  
  // Color options
  if (parsed.color) {
    if (parsed.color === 'auto') {
      config.colorAuto = true;
    } else {
      config.color = String(parsed.color);
    }
  }
  
  // Trigger options
  if (parsed.trigger_entity) config.triggerEntity = String(parsed.trigger_entity);
  if (parsed.triggers_update && Array.isArray(parsed.triggers_update)) {
    config.triggersUpdate = parsed.triggers_update.map(String);
  }
  
  // Variables
  if (parsed.variables && typeof parsed.variables === 'object') {
    config.variables = Object.entries(parsed.variables).map(([name, value]) => ({
      name,
      value: String(value)
    }));
  }
  
  // Actions
  parseAction(parsed, 'tap_action', config, 'tapAction');
  parseAction(parsed, 'hold_action', config, 'holdAction');
  parseAction(parsed, 'double_tap_action', config, 'doubleTapAction');
  parseAction(parsed, 'press_action', config, 'pressAction');
  parseAction(parsed, 'release_action', config, 'releaseAction');
  parseAction(parsed, 'icon_tap_action', config, 'iconTapAction');
  parseAction(parsed, 'icon_hold_action', config, 'iconHoldAction');
  parseAction(parsed, 'icon_double_tap_action', config, 'iconDoubleTapAction');
  parseAction(parsed, 'icon_press_action', config, 'iconPressAction');
  parseAction(parsed, 'icon_release_action', config, 'iconReleaseAction');
  
  // Hold action repeat
  if (parsed.hold_action?.repeat !== undefined) config.holdActionRepeat = Number(parsed.hold_action.repeat);
  if (parsed.hold_action?.repeat_limit !== undefined) config.holdActionRepeatLimit = Number(parsed.hold_action.repeat_limit);
  
  // Confirmation
  if (parsed.confirmation) {
    config.confirmation = {
      enabled: true,
      text: parsed.confirmation.text || 'Are you sure?',
      exemptions: parsed.confirmation.exemptions?.map((e: any) => e.user || e) || []
    };
  }
  
  // Lock
  if (parsed.lock) {
    config.lock = {
      ...DEFAULT_LOCK_CONFIG,
      enabled: parsed.lock.enabled !== false,
      duration: parsed.lock.duration ?? DEFAULT_LOCK_CONFIG.duration,
      unlock: parsed.lock.unlock ?? DEFAULT_LOCK_CONFIG.unlock,
      lockIcon: parsed.lock.lock_icon ?? DEFAULT_LOCK_CONFIG.lockIcon,
      unlockIcon: parsed.lock.unlock_icon ?? DEFAULT_LOCK_CONFIG.unlockIcon,
      keepUnlockIcon: parsed.lock.keep_unlock_icon ?? DEFAULT_LOCK_CONFIG.keepUnlockIcon,
      exemptions: parsed.lock.exemptions?.map((e: any) => e.user || e) || []
    };
  }
  
  // Protect
  if (parsed.protect) {
    config.protect = {
      ...DEFAULT_PROTECT_CONFIG,
      enabled: true,
      type: parsed.protect.type ?? 'pin',
      value: parsed.protect.code ?? '',
      failureMessage: parsed.protect.failure_message ?? DEFAULT_PROTECT_CONFIG.failureMessage,
      successMessage: parsed.protect.success_message ?? ''
    };
  }
  
  // Tooltip
  if (parsed.tooltip) {
    config.tooltip = {
      ...DEFAULT_TOOLTIP_CONFIG,
      enabled: true,
      content: parsed.tooltip.content ?? '',
      position: parsed.tooltip.position ?? 'top'
    };
  }
  
  // Custom Fields
  if (parsed.custom_fields && typeof parsed.custom_fields === 'object') {
    config.customFields = Object.entries(parsed.custom_fields).map(([name, value]) => ({
      name,
      type: typeof value === 'string' && value.includes('[[[') ? 'template' : 'text',
      value: String(value),
      styles: undefined // Styles would need to be parsed from styles.custom_fields
    }));
  }
  
  // Styles parsing
  if (parsed.styles) {
    parseStyles(parsed.styles, config);
  }
  
  // State parsing (on/off colors and custom states)
  if (parsed.state && Array.isArray(parsed.state)) {
    parseStateConfig(parsed.state, config);
  }
  
  // Conditions (for conditional display)
  if (parsed.conditions && Array.isArray(parsed.conditions) && parsed.conditions.length > 0) {
    const firstCondition = parsed.conditions[0];
    if (firstCondition.entity) config.conditionalEntity = String(firstCondition.entity);
    if (firstCondition.state !== undefined) config.conditionalState = String(firstCondition.state);
    if (firstCondition.operator) config.conditionalOperator = String(firstCondition.operator);
  }
  
  return config;
};

/**
 * Parse an action from YAML into config
 */
function parseAction(
  parsed: any,
  yamlKey: string,
  config: Partial<ButtonConfig>,
  configPrefix: string
): void {
  const action = parsed[yamlKey];
  if (!action) return;
  
  // Type assertion for dynamic property access
  const cfg = config as any;
  
  if (action.action) {
    cfg[configPrefix] = action.action;
  }
  
  // Service data
  if (action.service || action.service_data || action.target) {
    const serviceData: any = {};
    if (action.service) serviceData.service = action.service;
    if (action.service_data) serviceData.service_data = action.service_data;
    if (action.target) serviceData.target = action.target;
    cfg[`${configPrefix}Data`] = JSON.stringify(serviceData, null, 2);
  }
  
  // Navigation
  if (action.navigation_path) {
    cfg[`${configPrefix}Navigation`] = action.navigation_path;
  }
  if (action.url_path) {
    cfg[`${configPrefix}Navigation`] = action.url_path;
  }
  
  // JavaScript
  if (action.code) {
    cfg[`${configPrefix}Javascript`] = action.code;
  }
  
  // Toast
  if (action.action === 'toast' && action.message) {
    cfg[`${configPrefix}Toast`] = {
      message: action.message,
      duration: action.duration ?? 3000,
      dismissable: action.dismissable !== false
    };
  }
  
  // Haptic/Sound
  if (action.haptic) {
    const soundKey = configPrefix.replace('Action', 'ActionSound');
    cfg[soundKey] = action.haptic;
  }
}

/**
 * Parse styles section
 */
function parseStyles(styles: any, config: Partial<ButtonConfig>): void {
  // Card styles
  if (styles.card && Array.isArray(styles.card)) {
    const extraStyles: string[] = [];
    
    for (const style of styles.card) {
      if (typeof style === 'string') {
        const parsed = parseStyleString(style);
        if (parsed) {
          mapCardStyle(parsed.property, parsed.value, config, extraStyles);
        }
      } else if (typeof style === 'object') {
        // Handle object format like { 'background-color': 'red' }
        for (const [prop, val] of Object.entries(style)) {
          mapCardStyle(prop, String(val), config, extraStyles);
        }
      }
    }
    
    if (extraStyles.length > 0) {
      config.extraStyles = extraStyles.join('\n');
    }
  }
  
  // Icon styles
  if (styles.icon && Array.isArray(styles.icon)) {
    for (const style of styles.icon) {
      if (typeof style === 'string') {
        const parsed = parseStyleString(style);
        if (parsed) {
          if (parsed.property === 'color') {
            if (parsed.value.includes('var(--button-card-light-color)')) {
              config.iconColorAuto = true;
            } else {
              config.iconColor = parsed.value;
            }
          } else if (parsed.property === 'animation' && parsed.value.includes('rotate')) {
            config.spin = true;
            // Try to extract duration
            const durationMatch = parsed.value.match(/(\d+(?:\.\d+)?s)/);
            if (durationMatch) {
              config.spinDuration = durationMatch[1];
            }
          }
        }
      }
    }
  }
  
  // Name styles
  if (styles.name && Array.isArray(styles.name)) {
    for (const style of styles.name) {
      if (typeof style === 'string') {
        const parsed = parseStyleString(style);
        if (parsed && parsed.property === 'color') {
          if (parsed.value.includes('var(--button-card-light-color)')) {
            config.nameColorAuto = true;
          } else {
            config.nameColor = parsed.value;
          }
        }
      }
    }
  }
  
  // Label styles
  if (styles.label && Array.isArray(styles.label)) {
    for (const style of styles.label) {
      if (typeof style === 'string') {
        const parsed = parseStyleString(style);
        if (parsed && parsed.property === 'color') {
          if (parsed.value.includes('var(--button-card-light-color)')) {
            config.labelColorAuto = true;
          } else {
            config.labelColor = parsed.value;
          }
        }
      }
    }
  }
  
  // State styles
  if (styles.state && Array.isArray(styles.state)) {
    for (const style of styles.state) {
      if (typeof style === 'string') {
        const parsed = parseStyleString(style);
        if (parsed && parsed.property === 'color') {
          if (parsed.value.includes('var(--button-card-light-color)')) {
            config.stateColorAuto = true;
          } else {
            config.stateColor = parsed.value;
          }
        }
      }
    }
  }
  
  // Entity picture styles
  if (styles.entity_picture && Array.isArray(styles.entity_picture)) {
    config.entityPictureStyles = styles.entity_picture
      .filter((s: any) => typeof s === 'string')
      .join('\n');
  }
  
  // Grid styles
  if (styles.grid && Array.isArray(styles.grid)) {
    config.gridStyles = styles.grid
      .filter((s: any) => typeof s === 'string')
      .join('\n');
  }
  
  // Custom field styles
  if (styles.custom_fields && typeof styles.custom_fields === 'object') {
    // Update existing custom fields with their styles
    if (config.customFields) {
      for (const field of config.customFields) {
        if (styles.custom_fields[field.name] && Array.isArray(styles.custom_fields[field.name])) {
          field.styles = styles.custom_fields[field.name]
            .filter((s: any) => typeof s === 'string')
            .join('\n');
        }
      }
    }
  }
  
  // Lock styles
  if (styles.lock && Array.isArray(styles.lock)) {
    config.lockStyles = styles.lock
      .filter((s: any) => typeof s === 'string')
      .join('\n');
  }
  
  // Tooltip styles
  if (styles.tooltip && Array.isArray(styles.tooltip)) {
    config.tooltipStyles = styles.tooltip
      .filter((s: any) => typeof s === 'string')
      .join('\n');
  }
  
  // Img cell styles
  if (styles.img_cell && Array.isArray(styles.img_cell)) {
    config.imgCellStyles = styles.img_cell
      .filter((s: any) => typeof s === 'string')
      .join('\n');
  }
}

/**
 * Parse a CSS style string like "background-color: red"
 */
function parseStyleString(style: string): { property: string; value: string } | null {
  const colonIndex = style.indexOf(':');
  if (colonIndex === -1) return null;
  
  const property = style.substring(0, colonIndex).trim();
  const value = style.substring(colonIndex + 1).trim();
  
  return { property, value };
}

/**
 * Map a card style to config properties
 */
function mapCardStyle(
  property: string,
  value: string,
  config: Partial<ButtonConfig>,
  extraStyles: string[]
): void {
  switch (property) {
    case 'background':
      // Check if it's a gradient
      if (value.includes('gradient')) {
        config.gradientEnabled = true;
        
        // Detect gradient type
        if (value.includes('linear-gradient')) {
          config.gradientType = 'linear';
          // Extract angle: linear-gradient(135deg, ...)
          const angleMatch = value.match(/linear-gradient\((\d+)deg/);
          if (angleMatch) {
            config.gradientAngle = parseInt(angleMatch[1]);
          }
        } else if (value.includes('radial-gradient')) {
          config.gradientType = 'radial';
        } else if (value.includes('conic-gradient')) {
          config.gradientType = 'conic';
          // Extract angle: conic-gradient(from 45deg, ...)
          const angleMatch = value.match(/from (\d+)deg/);
          if (angleMatch) {
            config.gradientAngle = parseInt(angleMatch[1]);
          }
        }
        
        // Extract colors - match hex colors or color names
        const colorMatches = value.match(/#[0-9a-fA-F]{6}|rgb\([^)]+\)|rgba\([^)]+\)/g);
        if (colorMatches) {
          if (colorMatches.length >= 1) config.gradientColor1 = colorMatches[0];
          if (colorMatches.length >= 2) config.gradientColor2 = colorMatches[1];
          if (colorMatches.length >= 3) {
            config.gradientColor3Enabled = true;
            config.gradientColor3 = colorMatches[2];
          }
        }
      }
      break;
      
    case 'background-color':
      // Try to extract hex color from rgba or direct hex
      const hexMatch = value.match(/#[0-9a-fA-F]{6}/);
      if (hexMatch) {
        config.backgroundColor = hexMatch[0];
      }
      // Try to extract opacity from rgba
      const rgbaMatch = value.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (rgbaMatch) {
        config.backgroundColorOpacity = Math.round(parseFloat(rgbaMatch[1]) * 100);
      }
      break;
      
    case 'border-radius':
      config.borderRadius = value;
      break;
      
    case 'padding':
      config.padding = value;
      break;
      
    case 'color':
      config.color = value;
      break;
      
    case 'font-family':
      config.fontFamily = value;
      break;
      
    case 'font-size':
      config.fontSize = value;
      break;
      
    case 'font-weight':
      if (['normal', 'bold', 'lighter', 'bolder'].includes(value)) {
        config.fontWeight = value as any;
      }
      break;
      
    case 'text-transform':
      if (['none', 'uppercase', 'lowercase', 'capitalize'].includes(value)) {
        config.textTransform = value as any;
      }
      break;
      
    case 'letter-spacing':
      config.letterSpacing = value;
      break;
      
    case 'line-height':
      config.lineHeight = value;
      break;
      
    case 'height':
      config.height = value;
      break;
      
    case 'aspect-ratio':
      config.aspectRatio = value;
      break;
      
    case 'opacity':
      config.cardOpacity = Math.round(parseFloat(value) * 100);
      break;
      
    case 'border':
      // Parse border: 1px solid #fff
      const borderMatch = value.match(/^(\d+\w*)\s+(solid|dashed|dotted|double|groove|none)\s+(.+)$/);
      if (borderMatch) {
        config.borderWidth = borderMatch[1];
        config.borderStyle = borderMatch[2] as any;
        config.borderColor = borderMatch[3];
      } else if (value === 'none') {
        config.borderStyle = 'none';
      }
      break;
      
    case 'backdrop-filter':
      const blurMatch = value.match(/blur\(([^)]+)\)/);
      if (blurMatch) {
        config.backdropBlur = blurMatch[1];
      }
      break;
      
    case 'box-shadow':
      // Try to detect shadow size
      if (value.includes('inset')) {
        config.shadowSize = 'inner';
      } else if (value.includes('20px 25px')) {
        config.shadowSize = 'xl';
      } else if (value.includes('10px 15px')) {
        config.shadowSize = 'lg';
      } else if (value.includes('4px 6px')) {
        config.shadowSize = 'md';
      } else if (value.includes('1px 2px')) {
        config.shadowSize = 'sm';
      }
      break;
      
    case 'animation':
      // Parse animation name
      if (value.includes('flash')) config.cardAnimation = 'flash';
      else if (value.includes('pulse')) config.cardAnimation = 'pulse';
      else if (value.includes('jiggle')) config.cardAnimation = 'jiggle';
      else if (value.includes('shake')) config.cardAnimation = 'shake';
      else if (value.includes('bounce')) config.cardAnimation = 'bounce';
      else if (value.includes('blink')) config.cardAnimation = 'blink';
      else if (value.includes('spin') || value.includes('rotate')) config.cardAnimation = 'spin';
      else if (value.includes('glow')) config.cardAnimation = 'glow';
      else if (value.includes('float')) config.cardAnimation = 'float';
      else if (value.includes('swing')) config.cardAnimation = 'swing';
      else if (value.includes('rubberBand') || value.includes('rubber')) config.cardAnimation = 'rubberBand';
      else if (value.includes('tada')) config.cardAnimation = 'tada';
      else if (value.includes('heartbeat')) config.cardAnimation = 'heartbeat';
      else if (value.includes('flip')) config.cardAnimation = 'flip';
      else if (value.includes('wobble')) config.cardAnimation = 'wobble';
      else if (value.includes('breathe')) config.cardAnimation = 'breathe';
      else if (value.includes('ripple')) config.cardAnimation = 'ripple';
      
      // Try to extract speed
      const speedMatch = value.match(/(\d+(?:\.\d+)?s)/);
      if (speedMatch) {
        config.cardAnimationSpeed = speedMatch[1];
      }
      break;
      
    default:
      // Store unrecognized styles in extraStyles
      extraStyles.push(`${property}: ${value}`);
      break;
  }
}

/**
 * Parse state configuration (on/off and custom states)
 */
function parseStateConfig(states: any[], config: Partial<ButtonConfig>): void {
  const customStates: StateStyleConfig[] = [];
  
  for (const state of states) {
    if (!state) continue;
    
    const stateValue = state.value;
    
    // Handle on/off states for basic colors
    if (stateValue === 'on' || stateValue === 'off') {
      if (state.styles?.card) {
        for (const style of state.styles.card) {
          if (typeof style === 'string') {
            const parsed = parseStyleString(style);
            if (parsed && parsed.property === 'background-color') {
              const hexMatch = parsed.value.match(/#[0-9a-fA-F]{6}/);
              if (stateValue === 'on') {
                if (hexMatch) config.stateOnColor = hexMatch[0];
                const rgbaMatch = parsed.value.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
                if (rgbaMatch) config.stateOnOpacity = Math.round(parseFloat(rgbaMatch[1]) * 100);
              } else {
                if (hexMatch) config.stateOffColor = hexMatch[0];
                const rgbaMatch = parsed.value.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
                if (rgbaMatch) config.stateOffOpacity = Math.round(parseFloat(rgbaMatch[1]) * 100);
              }
            }
          }
        }
      }
      continue; // Skip adding on/off to custom states
    }
    
    // Custom state
    const customState: StateStyleConfig = {
      id: crypto.randomUUID(),
      operator: 'equals',
      value: String(stateValue ?? ''),
      name: state.name ?? '',
      icon: state.icon ?? '',
      color: state.color ?? '',
      entityPicture: state.entity_picture ?? '',
      label: state.label ?? '',
      stateDisplay: state.state_display ?? '',
      spin: state.spin ?? false,
      styles: '',
      backgroundColor: '',
      iconColor: '',
      nameColor: '',
      stateColor: '',
      labelColor: '',
      borderColor: '',
      cardAnimation: 'none',
      cardAnimationSpeed: '2s',
      iconAnimation: 'none',
      iconAnimationSpeed: '2s'
    };
    
    // Determine operator
    if (state.operator === 'default') {
      customState.operator = 'default';
    } else if (state.operator === '>') {
      customState.operator = 'above';
    } else if (state.operator === '<') {
      customState.operator = 'below';
    } else if (state.operator === '!=') {
      customState.operator = 'not_equals';
    } else if (state.operator === 'regex') {
      customState.operator = 'regex';
    } else if (typeof stateValue === 'string' && stateValue.includes('[[[')) {
      customState.operator = 'template';
    }
    
    // Parse state styles
    if (state.styles) {
      if (state.styles.card) {
        for (const style of state.styles.card) {
          if (typeof style === 'string') {
            const parsed = parseStyleString(style);
            if (parsed) {
              if (parsed.property === 'background-color') {
                customState.backgroundColor = parsed.value;
              } else if (parsed.property === 'border-color') {
                customState.borderColor = parsed.value;
              } else if (parsed.property === 'animation') {
                // Parse animation type
                if (parsed.value.includes('flash')) customState.cardAnimation = 'flash';
                else if (parsed.value.includes('pulse')) customState.cardAnimation = 'pulse';
                // ... add other animations as needed
                
                const speedMatch = parsed.value.match(/(\d+(?:\.\d+)?s)/);
                if (speedMatch) customState.cardAnimationSpeed = speedMatch[1];
              }
            }
          }
        }
      }
      
      if (state.styles.icon) {
        for (const style of state.styles.icon) {
          if (typeof style === 'string') {
            const parsed = parseStyleString(style);
            if (parsed && parsed.property === 'color') {
              customState.iconColor = parsed.value;
            }
          }
        }
      }
      
      if (state.styles.name) {
        for (const style of state.styles.name) {
          if (typeof style === 'string') {
            const parsed = parseStyleString(style);
            if (parsed && parsed.property === 'color') {
              customState.nameColor = parsed.value;
            }
          }
        }
      }
      
      if (state.styles.state) {
        for (const style of state.styles.state) {
          if (typeof style === 'string') {
            const parsed = parseStyleString(style);
            if (parsed && parsed.property === 'color') {
              customState.stateColor = parsed.value;
            }
          }
        }
      }
      
      if (state.styles.label) {
        for (const style of state.styles.label) {
          if (typeof style === 'string') {
            const parsed = parseStyleString(style);
            if (parsed && parsed.property === 'color') {
              customState.labelColor = parsed.value;
            }
          }
        }
      }
    }
    
    customStates.push(customState);
  }
  
  if (customStates.length > 0) {
    config.stateStyles = customStates;
  }
}

/**
 * Validate and sanitize imported config
 */
export const validateImportedConfig = (config: Partial<ButtonConfig>): Partial<ButtonConfig> => {
  const validated = { ...config };
  
  // Ensure layout is valid
  const validLayouts = ['vertical', 'icon_name_state2nd', 'icon_name_state', 'icon_state_name2nd', 'icon_state', 'name_state', 'icon_label'];
  if (validated.layout && !validLayouts.includes(validated.layout)) {
    delete validated.layout;
  }
  
  // Ensure colorType is valid
  const validColorTypes = ['card', 'icon', 'blank-card', 'label-card'];
  if (validated.colorType && !validColorTypes.includes(validated.colorType)) {
    delete validated.colorType;
  }
  
  // Ensure opacity values are in range
  if (validated.backgroundColorOpacity !== undefined) {
    validated.backgroundColorOpacity = Math.max(0, Math.min(100, validated.backgroundColorOpacity));
  }
  if (validated.cardOpacity !== undefined) {
    validated.cardOpacity = Math.max(0, Math.min(100, validated.cardOpacity));
  }
  
  return validated;
};
