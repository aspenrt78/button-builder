
import { ButtonConfig, AnimationType, CustomField, StateStyleConfig, StateAppearanceConfig, LockConfig, TooltipConfig, ProtectConfig, ToastConfig, ThresholdColorConfig } from "../types";
import { getToggleFallbackService, supportsToggleAction, supportsLiveStream } from "./entityCapabilities";
import { getEffectIntensityStyles } from './effectIntensity';

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
    case 'progressBorder':
    case 'none':
    case 'marquee': return null;
    default: return `animation: cba-${type} ${speed} ease-in-out infinite`;
  }
};

// Marquee: inline styles can't target pseudo-elements, so the rotating rainbow
// border is driven by an animatable @property angle on a conic-gradient border.
const marqueeCardLines = (background: string, speed: string): string[] => [
  'border: var(--cba-marquee-width, 3px) solid transparent',
  `background: linear-gradient(${background}, ${background}) padding-box, conic-gradient(from var(--cba-marquee-angle), #22d3ee, #a855f7, #f43f5e, #facc15, #22d3ee) border-box`,
  `animation: cba-marquee-spin ${speed} linear infinite`,
];

const numericValueTemplate = "Math.max(0, Math.min(100, Number.parseFloat(entity?.state) || 0))";
const progressBorderBackground = (background: string) =>
  `background: [[[ const v = ${numericValueTemplate}; return 'linear-gradient(${background}, ${background}) padding-box, conic-gradient(#22c55e 0 ' + v + '%, rgba(148,163,184,.22) ' + v + '% 100%) border-box'; ]]]`;
const thresholdValueColor =
  `[[[ const v = ${numericValueTemplate}; return v >= 80 ? '#ef4444' : v >= 50 ? '#eab308' : '#22c55e'; ]]]`;

// Build the styles.card / icon / name / state / label bundles for a single merged
// state appearance (ON or OFF). Used to emit exactly one `- value: 'on'` and one
// `- value: 'off'` state entry for binary entities. `themeKeys` are appearance keys
// the user made global; they live in base styles.card and must NOT be re-emitted here.
export interface AppearanceStyleBundle {
  card: string[];
  icon: string[];
  name: string[];
  state: string[];
  label: string[];
}

const buildStateStylesFromAppearance = (
  app: StateAppearanceConfig,
  themeKeys: string[] = [],
): AppearanceStyleBundle => {
  const card: string[] = [];
  const icon: string[] = [];
  const name: string[] = [];
  const state: string[] = [];
  const label: string[] = [];
  const isGlobal = (key: keyof StateAppearanceConfig) => themeKeys.includes(key as string);

  // Background: gradient wins, else solid background color (with opacity).
  // Use `background:` shorthand so it overrides any base gradient.
  if (!isGlobal('backgroundColor') && !isGlobal('gradientEnabled')) {
    if (app.gradientEnabled) {
      const gOpacity = app.gradientOpacity ?? 100;
      const c1 = hexToRgba(app.gradientColor1 || '#667eea', gOpacity);
      const c2 = hexToRgba(app.gradientColor2 || '#764ba2', gOpacity);
      const c3 = hexToRgba(app.gradientColor3 || '#f093fb', gOpacity);
      const colors = app.gradientColor3Enabled ? `${c1}, ${c2}, ${c3}` : `${c1}, ${c2}`;
      switch (app.gradientType) {
        case 'linear': card.push(`background: linear-gradient(${app.gradientAngle}deg, ${colors})`); break;
        case 'radial': card.push(`background: radial-gradient(circle, ${colors})`); break;
        case 'conic': card.push(`background: conic-gradient(from ${app.gradientAngle}deg, ${colors}, ${c1})`); break;
      }
    } else if (app.backgroundColor) {
      const bgOpacity = app.backgroundColorOpacity ?? 100;
      const bgValue = bgOpacity < 100 ? hexToRgba(app.backgroundColor, bgOpacity) : app.backgroundColor;
      card.push(`background: ${bgValue}`);
    }
  }

  // Whole-card opacity
  if (!isGlobal('cardOpacity') && app.cardOpacity !== undefined && app.cardOpacity < 100) {
    card.push(`opacity: ${app.cardOpacity / 100}`);
  }

  // Border (width + style + color). Only emit when style is set for this state.
  if (!isGlobal('borderStyle') && app.borderStyle && app.borderStyle !== 'none') {
    const bColor = app.borderColorAuto
      ? 'var(--button-card-light-color)'
      : (app.borderColor || 'var(--primary-text-color)');
    const bWidth = !app.borderWidth || (Number.parseFloat(app.borderWidth) || 0) === 0 ? '1px' : app.borderWidth;
    card.push(`border: ${bWidth} ${app.borderStyle} ${bColor}`);
  } else if (!isGlobal('borderColor') && app.borderColor) {
    // Border color override without a per-state style change
    card.push(`border-color: ${app.borderColor}`);
  }

  // Glass / depth
  if (!isGlobal('backdropBlur') && app.backdropBlur && app.backdropBlur !== 'none' && app.backdropBlur !== '0px') {
    card.push(`backdrop-filter: blur(${app.backdropBlur})`);
  }
  if (!isGlobal('shadowSize') && app.shadowSize && app.shadowSize !== 'none') {
    const shadow = getShadowCSS(app.shadowSize, app.shadowColor || '#000000', app.shadowOpacity ?? 25);
    if (shadow) card.push(shadow);
  }

  // Default text color
  if (!isGlobal('color')) {
    if (app.colorAuto) card.push(`color: var(--button-card-light-color)`);
    else if (app.color) card.push(`color: ${app.color}`);
  }

  // Typography (card-level)
  if (!isGlobal('fontFamily') && app.fontFamily) card.push(`font-family: ${app.fontFamily}`);
  if (!isGlobal('fontSize') && app.fontSize) card.push(`font-size: ${app.fontSize}`);
  if (!isGlobal('textTransform') && app.textTransform && app.textTransform !== 'none') card.push(`text-transform: ${app.textTransform}`);
  if (!isGlobal('letterSpacing') && app.letterSpacing && app.letterSpacing !== 'normal') card.push(`letter-spacing: ${app.letterSpacing}`);
  if (!isGlobal('lineHeight') && app.lineHeight && app.lineHeight !== 'normal') card.push(`line-height: ${app.lineHeight}`);

  // Element colors
  if (!isGlobal('iconColor')) {
    if (app.iconColorAuto) icon.push(`color: var(--button-card-light-color)`);
    else if (app.iconColor) icon.push(`color: ${app.iconColor}`);
  }
  if (!isGlobal('nameColor')) {
    if (app.nameColorAuto) name.push(`color: var(--button-card-light-color)`);
    else if (app.nameColor) name.push(`color: ${app.nameColor}`);
  }
  if (!isGlobal('stateColor')) {
    if (app.stateColorAuto) state.push(`color: var(--button-card-light-color)`);
    else if (app.stateColor) state.push(`color: ${app.stateColor}`);
  }
  if (!isGlobal('labelColor')) {
    if (app.labelColorAuto) label.push(`color: var(--button-card-light-color)`);
    else if (app.labelColor) label.push(`color: ${app.labelColor}`);
  }
  // Name font-weight (name-level typography)
  if (!isGlobal('fontWeight') && app.fontWeight && app.fontWeight !== 'normal') {
    name.push(`font-weight: ${app.fontWeight}`);
  }

  // Per-state animations
  if (app.cardAnimation && app.cardAnimation !== 'none') {
    const anim = getAnimationCSS(app.cardAnimation, app.cardAnimationSpeed || '2s');
    if (anim) card.push(anim);
    card.push(...getEffectIntensityStyles(app.cardAnimation, app.effectIntensity));
    if (app.cardAnimation === 'progressBorder') {
      card.push('border: var(--cba-progress-width, 3px) solid transparent');
      card.push(progressBorderBackground(app.backgroundColor || '#10131c'));
    }
    if (app.cardAnimation === 'thresholdPulse') {
      card.push(`color: ${thresholdValueColor}`);
      card.push(`border-color: ${thresholdValueColor}`);
    }
  }
  if (app.iconAnimation && app.iconAnimation !== 'none') {
    const anim = getAnimationCSS(app.iconAnimation, app.iconAnimationSpeed || '2s');
    if (anim) icon.push(anim);
  }

  // Extra raw styles
  if (app.extraStyles) {
    app.extraStyles.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && trimmed.includes(':')) card.push(trimmed);
    });
  }

  return { card, icon, name, state, label };
};

const quoteYamlSingle = (value: string): string => `'${String(value).replace(/'/g, "''")}'`;

const escapeJsSingle = (value: string): string =>
  String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const normalizeTemplateValue = (rawValue: string): string => {
  const trimmed = (rawValue || '').trim();
  if (!trimmed) {
    return `[[[
  return false;
]]]`;
  }
  if (trimmed.includes('[[[')) {
    return trimmed;
  }
  if (trimmed.startsWith('return ')) {
    const statement = trimmed.endsWith(';') ? trimmed : `${trimmed};`;
    return `[[[
  ${statement}
]]]`;
  }
  return `[[[
  return ${trimmed};
]]]`;
};

const shouldUseTemplateCondition = (stateStyle: StateStyleConfig, cardEntityId: string): boolean => {
  const conditionEntity = (stateStyle.conditionEntity || '').trim();
  const conditionAttribute = (stateStyle.conditionAttribute || '').trim();
  const normalizedCardEntity = (cardEntityId || '').trim();
  const targetsOtherEntity = !!conditionEntity && conditionEntity !== normalizedCardEntity;
  return !!conditionAttribute || targetsOtherEntity;
};

const buildStateConditionTemplate = (stateStyle: StateStyleConfig, cardEntityId: string): string => {
  const conditionEntity = (stateStyle.conditionEntity || '').trim();
  const conditionAttribute = (stateStyle.conditionAttribute || '').trim();
  const normalizedCardEntity = (cardEntityId || '').trim();
  const hasExplicitConditionEntity = !!conditionEntity;
  const usesCardEntityContext = !hasExplicitConditionEntity || conditionEntity === normalizedCardEntity;
  const escapedConditionEntity = escapeJsSingle(conditionEntity);

  let sourceExpr = `''`;
  if (conditionAttribute) {
    const escapedAttribute = escapeJsSingle(conditionAttribute);
    sourceExpr = usesCardEntityContext
      ? `(entity.attributes && entity.attributes['${escapedAttribute}'] !== undefined ? entity.attributes['${escapedAttribute}'] : '')`
      : `(states['${escapedConditionEntity}'] && states['${escapedConditionEntity}'].attributes && states['${escapedConditionEntity}'].attributes['${escapedAttribute}'] !== undefined ? states['${escapedConditionEntity}'].attributes['${escapedAttribute}'] : '')`;
  } else {
    sourceExpr = usesCardEntityContext
      ? `entity.state`
      : `(states['${escapedConditionEntity}'] ? states['${escapedConditionEntity}'].state : '')`;
  }

  const rawValue = String(stateStyle.value ?? '');
  const escapedValue = escapeJsSingle(rawValue);

  let comparisonExpr = 'false';
  switch (stateStyle.operator) {
    case 'equals':
      comparisonExpr = `String(val) === '${escapedValue}'`;
      break;
    case 'not_equals':
      comparisonExpr = `String(val) !== '${escapedValue}'`;
      break;
    case 'above':
      comparisonExpr = `Number.parseFloat(String(val)) > Number.parseFloat('${escapedValue}')`;
      break;
    case 'above_equal':
      comparisonExpr = `Number.parseFloat(String(val)) >= Number.parseFloat('${escapedValue}')`;
      break;
    case 'below':
      comparisonExpr = `Number.parseFloat(String(val)) < Number.parseFloat('${escapedValue}')`;
      break;
    case 'below_equal':
      comparisonExpr = `Number.parseFloat(String(val)) <= Number.parseFloat('${escapedValue}')`;
      break;
    case 'regex':
      comparisonExpr = `new RegExp(${JSON.stringify(rawValue)}).test(String(val))`;
      break;
    default:
      comparisonExpr = 'false';
      break;
  }

  return `[[[
  const val = ${sourceExpr};
  return ${comparisonExpr};
]]]`;
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
  
  // Block scalar content must be indented deeper than the `- color:` key it is
  // attached to (emitted at 4-space list indent), hence the 8-space content indent.
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

// Optional per-action extras (toast, confirmation, sound, haptic, etc.)
interface ActionExtras {
  javascript?: string;
  toast?: ToastConfig;
  repeatMs?: number;
  repeatLimit?: number;
  confirmation?: boolean;
  confirmationText?: string;
  entityOverride?: string;
  navigationReplace?: boolean;
  sound?: string;
  haptic?: string;
  pipelineId?: string;
  startListening?: boolean;
}

// Helper to generate action YAML
const generateActionYaml = (
  actionType: string,
  actionData: string,
  actionNavigation: string,
  extras: ActionExtras = {}
): string => {
  // Core action lines built without indentation so they can be emitted flat, or
  // nested inside a multi-actions wrapper when a toast rides along.
  const core: string[] = [`action: ${actionType}`];

  if ((actionType === 'call-service' || actionType === 'perform-action') && actionData) {
    try {
      const data = JSON.parse(actionData);
      // perform-action uses perform_action key; call-service uses service key
      if (actionType === 'perform-action') {
        core.push(`perform_action: ${data.service || data.perform_action || ''}`);
      } else {
        core.push(`service: ${data.service || ''}`);
      }
      if (data.service_data || data.data) {
        const serviceData = data.service_data || data.data;
        core.push(actionType === 'perform-action' ? `data:` : `service_data:`);
        Object.entries(serviceData).forEach(([key, value]) => {
          core.push(`  ${key}: ${JSON.stringify(value)}`);
        });
      }
      if (data.target) {
        core.push(`target:`);
        Object.entries(data.target).forEach(([key, value]) => {
          core.push(`  ${key}: ${JSON.stringify(value)}`);
        });
      }
    } catch (e) {
      core.push(`# Invalid JSON in action_data`);
    }
  }

  if ((actionType === 'more-info' || actionType === 'toggle') && extras.entityOverride) {
    core.push(`entity: ${extras.entityOverride}`);
  }

  if (actionType === 'navigate' && actionNavigation) {
    core.push(`navigation_path: ${actionNavigation}`);
    if (extras.navigationReplace) {
      core.push(`navigation_replace: true`);
    }
  }

  if (actionType === 'url' && actionNavigation) {
    core.push(`url_path: ${actionNavigation}`);
  }

  if (actionType === 'assist') {
    if (extras.pipelineId && extras.pipelineId !== 'last_used') {
      core.push(`pipeline_id: ${extras.pipelineId}`);
    }
    if (extras.startListening) {
      core.push(`start_listening: true`);
    }
  }

  if (actionType === 'javascript' && extras.javascript) {
    // button-card evaluates `javascript` as a JS template — it must be wrapped in [[[ ]]]
    const code = extras.javascript.includes('[[[')
      ? extras.javascript
      : `[[[\n${extras.javascript}\n]]]`;
    core.push(`javascript: |`);
    code.split('\n').forEach(line => core.push(`  ${line}`));
  }

  // button-card only reads `toast:` when the action itself is `toast`, so a toast
  // attached to another action is emitted as a multi-actions sequence.
  const attachToast = actionType !== 'none' && !!extras.toast?.enabled && !!extras.toast?.message;

  let yaml = '';
  if (attachToast) {
    const toast = extras.toast!;
    yaml += `  action: multi-actions\n`;
    yaml += `  actions:\n`;
    yaml += `    - ${core[0]}\n`;
    core.slice(1).forEach(line => { yaml += `      ${line}\n`; });
    yaml += `    - action: toast\n`;
    yaml += `      toast:\n`;
    yaml += `        message: ${JSON.stringify(toast.message)}\n`;
    if (toast.duration !== 3000) {
      yaml += `        duration: ${toast.duration}\n`;
    }
    if (toast.dismissable === false) {
      yaml += `        dismissable: false\n`;
    }
  } else {
    core.forEach(line => { yaml += `  ${line}\n`; });
  }

  if (extras.repeatMs && extras.repeatMs > 0) {
    yaml += `  repeat: ${extras.repeatMs}\n`;
    if (extras.repeatLimit && extras.repeatLimit > 0) {
      yaml += `  repeat_limit: ${extras.repeatLimit}\n`;
    }
  }

  if (actionType !== 'none') {
    if (extras.confirmation) {
      // confirmation is an object in button-card; a bare boolean is not part of the schema
      yaml += `  confirmation:\n`;
      yaml += `    text: ${JSON.stringify(extras.confirmationText || 'Are you sure?')}\n`;
    }

    if (extras.sound) {
      yaml += `  sound: ${extras.sound}\n`;
    }

    if (extras.haptic) {
      yaml += `  haptic: ${extras.haptic}\n`;
    }
  }

  return yaml;
};

export const generateYaml = (
  config: ButtonConfig,
  stateAppearance?: { on: StateAppearanceConfig; off: StateAppearanceConfig } | null,
): string => {
  // Binary-state mode: the two merged ON/OFF appearances own all state-specific
  // styling. State-owned properties are stripped from base styles.card here and
  // emitted inside the merged `- value: 'on'` / `- value: 'off'` entries instead.
  const binaryStateMode = !!stateAppearance;
  const themeKeys = config.themeKeys || [];
  const isGlobalKey = (key: string) => themeKeys.includes(key);
  // In binaryStateMode, a state-owned property is emitted at base level only when
  // the user made it a global (theme) control; otherwise it lives in the state entries.
  const baseOwns = (key: string) => !binaryStateMode || isGlobalKey(key);

  // Helper to generate color style line
  const getColorLine = (color: string, auto: boolean) => {
    if (auto) return `    - color: var(--button-card-light-color)\n`;
    if (color) return `    - color: ${color}\n`;
    return null;
  };

  // Resolve border color for styles
  const borderColor = config.borderColorAuto ? 'var(--button-card-light-color)' : config.borderColor;
  // A visible border style with a 0/empty width renders as 1px (matches the preview)
  const baseBorderWidth = !config.borderWidth || (Number.parseFloat(config.borderWidth) || 0) === 0 ? '1px' : config.borderWidth;
  const borderStyle = config.borderStyle !== 'none' ? `border: ${baseBorderWidth} ${config.borderStyle} ${borderColor || 'var(--primary-text-color)'}` : 'border: none';

  // Resolve Backgrounds
  const bgColor = config.backgroundColor ? hexToRgba(config.backgroundColor, config.backgroundColorOpacity) : '';

  // Resolve Shadow
  const shadowCSS = getShadowCSS(config.shadowSize, config.shadowColor, config.shadowOpacity);

  // Resolve Gradient
  const getGradientCSS = () => {
    if (!config.gradientEnabled) return null;
    const gradientOpacity = config.gradientOpacity ?? 100;
    const color1 = hexToRgba(config.gradientColor1, gradientOpacity);
    const color2 = hexToRgba(config.gradientColor2, gradientOpacity);
    const color3 = hexToRgba(config.gradientColor3, gradientOpacity);
    const colors = config.gradientColor3Enabled
      ? `${color1}, ${color2}, ${color3}`
      : `${color1}, ${color2}`;
    
    switch (config.gradientType) {
      case 'linear':
        return `background: linear-gradient(${config.gradientAngle}deg, ${colors})`;
      case 'radial':
        return `background: radial-gradient(circle, ${colors})`;
      case 'conic':
        return `background: conic-gradient(from ${config.gradientAngle}deg, ${colors}, ${color1})`;
      default:
        return null;
    }
  };
  const gradientCSS = getGradientCSS();

  // --- Base Card Styles ---
  // State-neutral properties always emit at base level. State-owned properties
  // (background/opacity/color/typography/border/blur/shadow) emit here only when
  // baseOwns() is true: non-binary entities, or a theme/global control.
  const customFont = (config.customFontName && config.customFontUrl)
    ? `font-family: '${config.customFontName}', sans-serif`
    : (config.fontFamily ? `font-family: ${config.fontFamily}` : null);
  const cardStyles = [
    config.height !== 'auto' ? `height: ${config.height}` : null,
    // aspect-ratio is already emitted as a top-level YAML property; omit from styles.card
    baseOwns('backgroundColor') ? (gradientCSS ? gradientCSS : (bgColor ? `background-color: ${bgColor}` : null)) : null,
    baseOwns('cardOpacity') && config.cardOpacity < 100 ? `opacity: ${config.cardOpacity / 100}` : null,
    `border-radius: ${config.borderRadius}`,
    `padding: ${config.padding}`,
    // Only emit color in styles.card when not using color:auto (which is a top-level override)
    baseOwns('color') && !config.colorAuto ? `color: ${config.color}` : null,
    // Custom font URL takes priority and is not part of per-state typography.
    (config.customFontName && config.customFontUrl)
      ? customFont
      : (baseOwns('fontFamily') && config.fontFamily ? `font-family: ${config.fontFamily}` : null),
    baseOwns('fontSize') ? `font-size: ${config.fontSize}` : null,
    baseOwns('textTransform') ? `text-transform: ${config.textTransform}` : null,
    baseOwns('fontWeight') ? `font-weight: ${config.fontWeight}` : null,
    baseOwns('letterSpacing') && config.letterSpacing !== 'normal' ? `letter-spacing: ${config.letterSpacing}` : null,
    baseOwns('lineHeight') && config.lineHeight !== 'normal' ? `line-height: ${config.lineHeight}` : null,
    baseOwns('borderStyle') ? borderStyle : null,
    baseOwns('backdropBlur') && config.backdropBlur !== '0px' ? `backdrop-filter: blur(${config.backdropBlur})` : null,
    baseOwns('shadowSize') ? shadowCSS : null,
  ].filter((s): s is string => Boolean(s));

  // --- Base Icon Styles ---
  const iconStyles: string[] = [];
  if (baseOwns('iconColor')) {
    if (config.iconColorAuto) iconStyles.push(`color: var(--button-card-light-color)`);
    else if (config.iconColor) iconStyles.push(`color: ${config.iconColor}`);
  }

  if (config.spin || config.rotate) {
    iconStyles.push(`animation: cba-rotate ${config.spinDuration} linear infinite`);
  }

  // --- Apply ALWAYS Animations ---
  // If alwaysAnimate is enabled, output animations regardless of trigger.
  // In binaryStateMode, per-state animations live in the ON/OFF entries; only
  // "always" animations belong at base level.
  if (config.cardAnimation !== 'none' && (config.alwaysAnimateCard || config.cardAnimationTrigger === 'always')) {
    const anim = getAnimationCSS(config.cardAnimation, config.cardAnimationSpeed);
    if (anim) cardStyles.push(anim);
    cardStyles.push(...getEffectIntensityStyles(config.cardAnimation, config.effectIntensity));
    if (config.cardAnimation === 'progressBorder') {
      cardStyles.push('border: var(--cba-progress-width, 3px) solid transparent');
      cardStyles.push(progressBorderBackground(bgColor || '#10131c'));
    }
    if (config.cardAnimation === 'thresholdPulse') {
      cardStyles.push(`color: ${thresholdValueColor}`);
      cardStyles.push(`border-color: ${thresholdValueColor}`);
    }
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

  // Units override
  if (config.units) {
    yaml += `units: ${JSON.stringify(config.units)}\n`;
  }

  // Core fields with templates - only output if has value
  if (config.nameTemplate) {
    yaml += `name: ${config.nameTemplate}\n`;
  } else if (config.name) {
    // Quote the name to handle colons, hashes and other YAML special characters
    yaml += `name: "${config.name.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"\n`;
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
      yaml += `label: "[[[ return states['${config.labelEntity}'].attributes['${config.labelAttribute}'] ]]]"\n`;
    } else {
      yaml += `label: "[[[ return states['${config.labelEntity}'].state ]]]"\n`;
    }
  } else if (config.label) {
    yaml += `label: ${JSON.stringify(config.label)}\n`;
  }

  // Entity Picture
  if (config.entityPicture) {
    yaml += `entity_picture: ${config.entityPicture}\n`;
  }

  // State Display
  if (config.stateDisplayTemplate) {
    yaml += `state_display: ${config.stateDisplayTemplate}\n`;
  } else if (config.stateDisplay) {
    yaml += `state_display: ${JSON.stringify(config.stateDisplay)}\n`;
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
  const hasUnits = !!config.units;
  const hasEntity = !!config.entity;
  const canShowEntityPicture = hasEntity || !!config.entityPicture;
  
  const showLabel = hasLabelContent ? config.showLabel : false;
  const showEntityPicture = canShowEntityPicture ? config.showEntityPicture : false;
  const showUnits = hasUnits ? config.showUnits : false;
  const showState = hasEntity ? config.showState : false;
  const showLastChanged = hasEntity ? config.showLastChanged : false;
  
  // show_name/show_icon default to true in button-card — only emit when overriding to false
  if (!config.showName) yaml += `show_name: false\n`;
  if (!config.showIcon) yaml += `show_icon: false\n`;
  if (showState) yaml += `show_state: true\n`;
  if (showLabel) yaml += `show_label: true\n`;
  if (showEntityPicture) yaml += `show_entity_picture: true\n`;
  if (showLastChanged) yaml += `show_last_changed: true\n`;
  // button-card defaults show_units to true, so hiding units must be explicit
  if (showUnits) yaml += `show_units: true\n`;
  else if (showState && hasEntity && !config.showUnits) yaml += `show_units: false\n`;

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
      yaml += `live_stream_fit_mode: ${config.liveStreamFitMode}\n`;
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
    yaml += `color: ${config.colorAutoNoTemperature ? 'auto-no-temperature' : 'auto'}\n`;
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

  // Grid Options — only meaningful in sections views; emit when section mode is on
  // or the user changed the defaults.
  if (config.sectionMode || config.gridColumns !== 4 || config.gridRows !== 0) {
    yaml += `grid_options:\n`;
    yaml += `  columns: ${config.gridColumns}\n`;
    yaml += `  rows: ${config.gridRows === 0 ? 'auto' : config.gridRows}\n`;
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
    yaml += `  content: ${JSON.stringify(config.tooltip.content)}\n`;
    if (config.tooltip.position !== 'top') {
      yaml += `  placement: ${config.tooltip.position}\n`;
    }
    if (config.tooltip.delay > 0) {
      yaml += `  delay: ${config.tooltip.delay}\n`;
    }
    if (config.tooltip.hideDelay > 0) {
      yaml += `  hide_delay: ${config.tooltip.hideDelay}\n`;
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
  // (hold_time removed — not a valid button-card option)

  // Update Timer — the UI value is in seconds; button-card reads bare numbers as
  // milliseconds (min 100), so emit a duration string instead.
  if (config.updateTimer > 0) {
    yaml += `update_timer: ${config.updateTimer}s\n`;
  }

  // Triggers Update (entities that force a card re-render)
  if (config.triggersUpdate && config.triggersUpdate.length > 0) {
    yaml += `triggers_update:\n`;
    config.triggersUpdate.forEach(e => {
      yaml += `  - ${e}\n`;
    });
  }

  // Template
  if (config.template) {
    yaml += `template: ${config.template}\n`;
  }

  // Disable Keyboard
  if (config.disableKeyboard) {
    yaml += `disable_kbd: true\n`;
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

  // Momentary press/release actions replace tap/hold/double-tap in button-card.
  const hasMomentaryActions = config.pressAction !== 'none' || config.releaseAction !== 'none';
  const hasIconMomentaryActions = config.iconPressAction !== 'none' || config.iconReleaseAction !== 'none';
  if (hasMomentaryActions) {
    yaml += `# press/release actions replace tap/hold/double-tap on this card\n`;
  }

  // Actions - Tap
  if (!hasMomentaryActions) {
  yaml += `tap_action:\n`;
  yaml += generateActionYaml(
    normalizedTap.actionType,
    normalizedTap.actionData,
    config.tapActionNavigation,
    {
      javascript: config.tapActionJavascript,
      toast: config.tapActionToast,
      confirmation: config.tapActionConfirmation,
      confirmationText: config.tapActionConfirmationText,
      entityOverride: config.tapActionEntity,
      navigationReplace: config.tapActionNavigationReplace,
      pipelineId: config.tapActionPipelineId,
      startListening: config.tapActionStartListening,
      sound: config.tapActionSound,
      haptic: config.hapticFeedback,
    }
  );

  // Actions - Hold
  yaml += `hold_action:\n`;
  yaml += generateActionYaml(
    normalizedHold.actionType,
    normalizedHold.actionData,
    config.holdActionNavigation,
    {
      javascript: config.holdActionJavascript,
      toast: config.holdActionToast,
      repeatMs: config.holdActionRepeat,
      repeatLimit: config.holdActionRepeatLimit,
      confirmation: config.holdActionConfirmation,
      confirmationText: config.holdActionConfirmationText,
      entityOverride: config.holdActionEntity,
      navigationReplace: config.holdActionNavigationReplace,
      pipelineId: config.holdActionPipelineId,
      startListening: config.holdActionStartListening,
      sound: config.holdActionSound,
      haptic: config.hapticFeedback,
    }
  );

  // Actions - Double Tap
  yaml += `double_tap_action:\n`;
  yaml += generateActionYaml(
    normalizedDoubleTap.actionType,
    normalizedDoubleTap.actionData,
    config.doubleTapActionNavigation,
    {
      javascript: config.doubleTapActionJavascript,
      toast: config.doubleTapActionToast,
      confirmation: config.doubleTapActionConfirmation,
      confirmationText: config.doubleTapActionConfirmationText,
      entityOverride: config.doubleTapActionEntity,
      navigationReplace: config.doubleTapActionNavigationReplace,
      pipelineId: config.doubleTapActionPipelineId,
      startListening: config.doubleTapActionStartListening,
      sound: config.doubleTapActionSound,
      haptic: config.hapticFeedback,
    }
  );
  }

  // Momentary Actions - Press
  if (config.pressAction !== 'none') {
    yaml += `press_action:\n`;
    yaml += generateActionYaml(
      normalizedPress.actionType,
      normalizedPress.actionData,
      config.pressActionNavigation,
      { javascript: config.pressActionJavascript }
    );
  }

  // Momentary Actions - Release
  if (config.releaseAction !== 'none') {
    yaml += `release_action:\n`;
    yaml += generateActionYaml(
      normalizedRelease.actionType,
      normalizedRelease.actionData,
      config.releaseActionNavigation,
      { javascript: config.releaseActionJavascript }
    );
  }

  // Icon Actions (icon press/release replace icon tap/hold/double-tap)
  if (!hasIconMomentaryActions && config.iconTapAction !== 'none') {
    yaml += `icon_tap_action:\n`;
    yaml += generateActionYaml(
      normalizedIconTap.actionType,
      normalizedIconTap.actionData,
      config.iconTapActionNavigation,
      { javascript: config.iconTapActionJavascript }
    );
  }

  if (!hasIconMomentaryActions && config.iconHoldAction !== 'none') {
    yaml += `icon_hold_action:\n`;
    yaml += generateActionYaml(
      normalizedIconHold.actionType,
      normalizedIconHold.actionData,
      config.iconHoldActionNavigation,
      { javascript: config.iconHoldActionJavascript }
    );
  }

  if (!hasIconMomentaryActions && config.iconDoubleTapAction !== 'none') {
    yaml += `icon_double_tap_action:\n`;
    yaml += generateActionYaml(
      normalizedIconDoubleTap.actionType,
      normalizedIconDoubleTap.actionData,
      config.iconDoubleTapActionNavigation,
      { javascript: config.iconDoubleTapActionJavascript }
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
    yaml += `  text: ${JSON.stringify(config.confirmation.text || 'Are you sure?')}\n`;
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
    yaml += `  ${config.protect.type === 'password' ? 'password' : 'pin'}: ${JSON.stringify(config.protect.value)}\n`;
    if (config.protect.failureMessage) {
      yaml += `  failure_message: ${JSON.stringify(config.protect.failureMessage)}\n`;
    }
    if (config.protect.successMessage) {
      yaml += `  success_message: ${JSON.stringify(config.protect.successMessage)}\n`;
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
        const prefix = escapeJsSingle(field.prefix || '');
        const suffix = escapeJsSingle(field.suffix || '');
        const icon = field.icon;

        let template = '[[[';
        if (icon) {
          template += `\n  var icon = '<ha-icon icon="${icon}" style="width:14px;height:14px;margin-right:4px;"></ha-icon>';`;
        }
        if (attr) {
          template += `\n  var val = states['${entityId}'].attributes['${escapeJsSingle(attr)}'];`;
        } else {
          template += `\n  var val = states['${entityId}'].state;`;
        }
        if (icon) {
          template += `\n  return icon + '${prefix}' + val + '${suffix}';`;
        } else {
          template += `\n  return '${prefix}' + val + '${suffix}';`;
        }
        template += '\n]]]';

        yaml += `  ${field.name}: |\n`;
        template.split('\n').forEach(line => { yaml += `    ${line}\n`; });
      } else if (field.value.includes('[[[') && field.value.includes(']]]')) {
        // Template with JS syntax — indent every line so the block scalar stays intact
        yaml += `  ${field.name}: |\n`;
        field.value.split('\n').forEach(line => { yaml += `    ${line}\n`; });
      } else {
        yaml += `  ${field.name}: ${JSON.stringify(field.value)}\n`;
      }
    });
  }

  // Conditional Display — Home Assistant's per-card `visibility` conditions
  // (button-card has no `conditions` option of its own).
  if (config.conditionalEntity && config.conditionalState) {
    const op = config.conditionalOperator || 'equals';
    if (op === 'regex' || op === 'template') {
      yaml += `# Card visibility: '${op}' comparisons are not supported by Home Assistant visibility conditions; condition omitted.\n`;
    } else {
      yaml += `visibility:\n`;
      if (op === 'equals' || op === 'not_equals') {
        yaml += `  - condition: state\n`;
        yaml += `    entity: ${config.conditionalEntity}\n`;
        yaml += `    ${op === 'equals' ? 'state' : 'state_not'}: ${quoteYamlSingle(config.conditionalState)}\n`;
      } else {
        const numericKey = (op === 'above' || op === 'above_equal') ? 'above' : 'below';
        yaml += `  - condition: numeric_state\n`;
        yaml += `    entity: ${config.conditionalEntity}\n`;
        yaml += `    ${numericKey}: ${Number.parseFloat(config.conditionalState) || 0}\n`;
        if (op === 'above_equal' || op === 'below_equal') {
          yaml += `    # note: HA numeric_state compares exclusively; '=' boundary is approximated\n`;
        }
      }
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
  const hasMarqueeAnimation = config.cardAnimation === 'marquee'
    || stateAppearance?.on.cardAnimation === 'marquee'
    || stateAppearance?.off.cardAnimation === 'marquee';
  if (hasMarqueeAnimation) {
    extraStyles += `  @property --cba-marquee-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
  }
  @keyframes cba-marquee-spin {
    to { --cba-marquee-angle: 360deg; }
  }
`;
  }
  // Add generic keyframes if any animation is used
  // Also check if extraStyles contains animation references (for presets like Holographic, Lava Lamp)
  const extraStylesHasAnimation = !!config.extraStyles && (
    config.extraStyles.includes('holo-shift') ||
    config.extraStyles.includes('lava-shift') ||
    config.extraStyles.includes('animation:')
  );
  const stateStylesHasAnimation = (config.stateStyles || []).some(stateStyle =>
    (stateStyle.cardAnimation && stateStyle.cardAnimation !== 'none') ||
    (stateStyle.iconAnimation && stateStyle.iconAnimation !== 'none') ||
    (!!stateStyle.styles && (
      stateStyle.styles.includes('holo-shift') ||
      stateStyle.styles.includes('lava-shift') ||
      stateStyle.styles.includes('animation:')
    ))
  );
  const needsGenericKeyframes =
    (config.cardAnimation !== 'none' && config.cardAnimation !== 'marquee') ||
    config.iconAnimation !== 'none' ||
    (!!stateAppearance && [stateAppearance.on, stateAppearance.off].some(appearance =>
      (appearance.cardAnimation !== 'none' && appearance.cardAnimation !== 'marquee') ||
      appearance.iconAnimation !== 'none'
    )) ||
    config.spin ||
    config.rotate ||
    extraStylesHasAnimation ||
    stateStylesHasAnimation;
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
    0%, 100% { box-shadow: 0 0 var(--cba-glow-near, 5px) currentColor, 0 0 var(--cba-glow-mid, 10px) currentColor; }
    50% { box-shadow: 0 0 var(--cba-glow-far, 20px) currentColor, 0 0 var(--cba-glow-peak, 30px) currentColor; }
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
    100% { box-shadow: 0 0 0 var(--cba-ripple-reach, 20px) transparent; }
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
  @keyframes cba-auroraBorder { 0%,100% { box-shadow: 0 0 var(--cba-aurora-soft, 5px) #22d3ee, inset 0 0 var(--cba-aurora-inner, 4px) #8b5cf6; border-color: #22d3ee; } 33% { box-shadow: 0 0 var(--cba-aurora-peak, 14px) #8b5cf6, inset 0 0 var(--cba-aurora-inner-peak, 7px) #ec4899; border-color: #8b5cf6; } 66% { box-shadow: 0 0 var(--cba-aurora-mid, 10px) #34d399, inset 0 0 var(--cba-aurora-soft, 5px) #22d3ee; border-color: #34d399; } }
  @keyframes cba-cometBorder { 0%,100% { box-shadow: var(--cba-comet-x-neg, -8px) var(--cba-comet-y-neg, -5px) var(--cba-comet-blur, 10px) var(--cba-comet-spread, -5px) #fff, 0 0 var(--cba-comet-ambient, 7px) #22d3ee; } 25% { box-shadow: var(--cba-comet-x, 8px) var(--cba-comet-y-neg, -5px) var(--cba-comet-blur, 10px) var(--cba-comet-spread, -5px) #fff, 0 0 var(--cba-comet-ambient, 7px) #8b5cf6; } 50% { box-shadow: var(--cba-comet-x, 8px) var(--cba-comet-y, 5px) var(--cba-comet-blur, 10px) var(--cba-comet-spread, -5px) #fff, 0 0 var(--cba-comet-ambient, 7px) #ec4899; } 75% { box-shadow: var(--cba-comet-x-neg, -8px) var(--cba-comet-y, 5px) var(--cba-comet-blur, 10px) var(--cba-comet-spread, -5px) #fff, 0 0 var(--cba-comet-ambient, 7px) #22d3ee; } }
  @keyframes cba-energyCharge { 0% { box-shadow: inset 0 -2px 0 #22d3ee, 0 0 2px #22d3ee; filter: brightness(.85) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 75% { box-shadow: inset 0 var(--cba-charge-depth, -18px) var(--cba-charge-blur, 18px) var(--cba-charge-spread, -16px) #22d3ee, 0 0 var(--cba-charge-glow, 14px) #22d3ee; filter: brightness(1.15) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 82% { box-shadow: inset 0 var(--cba-charge-depth, -18px) var(--cba-charge-blur, 18px) var(--cba-charge-spread, -16px) #fff, 0 0 var(--cba-charge-flash, 24px) #fff; filter: brightness(1.5) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 100% { box-shadow: inset 0 -2px 0 #22d3ee, 0 0 2px #22d3ee; filter: brightness(.85) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } }
  @keyframes cba-neonCurrent { 0%,100% { border-color: #22d3ee; box-shadow: var(--cba-neon-offset, 5px) 0 var(--cba-neon-blur, 8px) #22d3ee, var(--cba-neon-offset-neg, -5px) 0 var(--cba-neon-blur, 8px) #a855f7; } 25% { border-color: #a855f7; box-shadow: 0 var(--cba-neon-offset, 5px) var(--cba-neon-blur, 8px) #a855f7, 0 var(--cba-neon-offset-neg, -5px) var(--cba-neon-blur, 8px) #f43f5e; } 50% { border-color: #f43f5e; box-shadow: var(--cba-neon-offset-neg, -5px) 0 var(--cba-neon-blur, 8px) #f43f5e, var(--cba-neon-offset, 5px) 0 var(--cba-neon-blur, 8px) #facc15; } 75% { border-color: #facc15; box-shadow: 0 var(--cba-neon-offset-neg, -5px) var(--cba-neon-blur, 8px) #facc15, 0 var(--cba-neon-offset, 5px) var(--cba-neon-blur, 8px) #22d3ee; } }
  @keyframes cba-scanner { 0% { background-position: 0 var(--cba-scanner-start, -120%); } 100% { background-position: 0 var(--cba-scanner-end, 220%); } }
  @keyframes cba-shimmer { 0% { background-position: var(--cba-shimmer-start, 180%) 0; } 100% { background-position: var(--cba-shimmer-end, -180%) 0; } }
  @keyframes cba-liquidGradient { 0%,100% { background-position: 0% 50%; border-radius: var(--cba-liquid-radius-a, 18px 12px 20px 10px); } 50% { background-position: 100% 50%; border-radius: var(--cba-liquid-radius-b, 11px 21px 12px 19px); } }
  @keyframes cba-meshGradient { 0%,100% { background-position: 0% 0%, 100% 100%, 50% 50%; } 50% { background-position: var(--cba-mesh-position, 100% 70%, 0% 30%, 80% 20%); } }
  @keyframes cba-plasma { 0%,100% { background-position: var(--cba-plasma-start, 0%) 50%; filter: hue-rotate(0deg) saturate(1.2) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 50% { background-position: var(--cba-plasma-end, 100%) 50%; filter: hue-rotate(var(--cba-plasma-hue, 100deg)) saturate(1.8) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } }
  @keyframes cba-starfield { 0% { background-position: 0 0, 12px 8px, 0 0; } 100% { background-position: var(--cba-starfield-end, 24px 40px, -18px 30px, 0 0); } }
  @keyframes cba-embers { 0% { background-position: 0 30px, 10px 45px, 0 0; } 100% { background-position: var(--cba-embers-end, 8px -35px, -5px -20px, 0 0); } }
  @keyframes cba-rain { 0% { background-position: var(--cba-rain-start, 0 -30px); } 100% { background-position: var(--cba-rain-end, -12px 45px); } }
  @keyframes cba-radarPulse { 0% { box-shadow: inset 0 0 0 0 rgba(34,211,238,.55); } 75%,100% { box-shadow: inset 0 0 0 var(--cba-radar-reach, 35px) rgba(34,211,238,0); } }
  @keyframes cba-sonarRings { 0% { box-shadow: 0 0 0 0 rgba(56,189,248,.7), 0 0 0 0 rgba(56,189,248,.4); } 100% { box-shadow: 0 0 0 var(--cba-sonar-near, 10px) transparent, 0 0 0 var(--cba-sonar-far, 20px) transparent; } }
  @keyframes cba-statusBeacon { 0%,100% { border-color: #22c55e; box-shadow: var(--cba-beacon-offset-neg, -7px) 0 var(--cba-beacon-blur, 12px) #22c55e; } 25% { box-shadow: 0 var(--cba-beacon-offset-neg, -7px) var(--cba-beacon-blur, 12px) #22c55e; } 50% { box-shadow: var(--cba-beacon-offset, 7px) 0 var(--cba-beacon-blur, 12px) #22c55e; } 75% { box-shadow: 0 var(--cba-beacon-offset, 7px) var(--cba-beacon-blur, 12px) #22c55e; } }
  @keyframes cba-glitch { 0%,88%,100% { transform: translate(0); filter: var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 90% { transform: translate(var(--cba-glitch-wide-neg, -3px), var(--cba-glitch-small, 1px)); filter: drop-shadow(var(--cba-glitch-shadow, 3px) 0 #f0f) drop-shadow(var(--cba-glitch-shadow-neg, -3px) 0 #0ff) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 93% { transform: translate(var(--cba-glitch-wide, 3px), var(--cba-glitch-small-neg, -1px)) skewX(var(--cba-glitch-skew, 3deg)); filter: var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 96% { transform: translate(var(--cba-glitch-small-neg, -1px),0); filter: drop-shadow(var(--cba-glitch-wide-neg, -3px) 0 #f0f) drop-shadow(var(--cba-glitch-wide, 3px) 0 #0ff) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } }
  @keyframes cba-electricJolt { 0%,78%,100% { box-shadow: 0 0 5px #38bdf8; transform: translate(0); } 80% { box-shadow: var(--cba-electric-x-neg, -8px) var(--cba-electric-y-neg, -5px) var(--cba-electric-glow, 18px) #fff, var(--cba-electric-x, 8px) var(--cba-electric-y, 4px) 12px #38bdf8; transform: translateX(var(--cba-electric-jolt-neg, -1px)); } 84% { box-shadow: var(--cba-electric-x, 8px) -3px var(--cba-electric-glow-peak, 20px) #fff; transform: translateX(var(--cba-electric-jolt, 2px)); } 88% { box-shadow: 0 0 7px #38bdf8; transform: translate(0); } }
  @keyframes cba-frost { 0%,100% { box-shadow: inset 0 0 var(--cba-frost-inner, 8px) rgba(186,230,253,.35), 0 0 var(--cba-frost-outer, 5px) #bae6fd; filter: brightness(.95) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 50% { box-shadow: inset 0 0 var(--cba-frost-inner-peak, 18px) rgba(255,255,255,.55), 0 0 var(--cba-frost-outer-peak, 14px) #7dd3fc; filter: brightness(1.2) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } }
  @keyframes cba-heatHaze { 0%,100% { transform: skewX(0) scale(1); filter: saturate(1) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 33% { transform: skewX(var(--cba-haze-skew, .7deg)) scale(var(--cba-haze-scale-up, 1.01)); filter: saturate(1.25) brightness(1.08) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 66% { transform: skewX(var(--cba-haze-skew-neg, -.7deg)) scale(var(--cba-haze-scale-down, .995)); filter: saturate(1.1) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } }
  @keyframes cba-breathingGlass { 0%,100% { filter: brightness(.9) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); box-shadow: inset 0 0 var(--cba-glass-inner, 8px) rgba(255,255,255,.08), 0 0 var(--cba-glass-outer, 4px) rgba(125,211,252,.25); } 50% { filter: brightness(1.16) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); box-shadow: inset 0 0 var(--cba-glass-inner-peak, 16px) rgba(255,255,255,.2), 0 0 var(--cba-glass-outer-peak, 14px) rgba(125,211,252,.55); } }
  @keyframes cba-magneticHover { 0%,100% { transform: perspective(240px) rotateX(0) rotateY(-2deg) translateY(0); } 50% { transform: perspective(240px) rotateX(2deg) rotateY(2deg) translateY(-4px); } }
  @keyframes cba-iconOrbit { 0% { transform: rotate(0deg) translateX(5px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(5px) rotate(-360deg); } }
  @keyframes cba-iconDraw { 0% { clip-path: inset(0 100% 0 0); opacity: .2; } 55%,100% { clip-path: inset(0 0 0 0); opacity: 1; } }
  @keyframes cba-stateMorph { 0%,100% { filter: hue-rotate(0deg) brightness(.85) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); border-radius: var(--cba-morph-radius-start, 10px); } 50% { filter: hue-rotate(var(--cba-morph-hue, 75deg)) brightness(1.2) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); border-radius: var(--cba-morph-radius-end, 22px); } }
  @keyframes cba-progressBorder { 0% { border-color: #ef4444; box-shadow: inset 8px 0 0 -6px #ef4444; } 50% { border-color: #eab308; box-shadow: inset 45px 0 0 -40px #eab308; } 100% { border-color: #22c55e; box-shadow: inset 90px 0 0 -82px #22c55e; } }
  @keyframes cba-thresholdPulse { 0%,100% { box-shadow: 0 0 var(--cba-threshold-glow, 3px) currentColor; filter: brightness(.9) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } 50% { box-shadow: 0 0 var(--cba-threshold-glow-peak, 18px) currentColor; filter: brightness(1.35) var(--cba-effect-filter, saturate(1) contrast(1) brightness(1)); } }
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

  // --- Styles Section (only if there are styles) ---
  const hasCardStyles = cardStyles.length > 0 || (baseOwns('backgroundColor') && config.extraStyles);
  const hasIconStyles = iconStyles.length > 0 || (config.thresholdColor.enabled && config.thresholdColor.applyToIcon);
  // Plain element colors move to the per-state entries in binaryStateMode; threshold
  // colors and name font-weight remain global.
  const nameColorLine = baseOwns('nameColor') ? getColorLine(config.nameColor, config.nameColorAuto) : null;
  const labelColorLine = baseOwns('labelColor') ? getColorLine(config.labelColor, config.labelColorAuto) : null;
  const stateColorLine = baseOwns('stateColor') ? getColorLine(config.stateColor, config.stateColorAuto) : null;
  const baseFontWeight = baseOwns('fontWeight') && config.fontWeight && config.fontWeight !== 'normal';
  const hasNameStyles = nameColorLine || baseFontWeight || (config.thresholdColor.enabled && config.thresholdColor.applyToName);
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
        marqueeCardLines(bgColor || '#1c1c1c', config.cardAnimationSpeed || '4s').forEach(line => {
          yaml += `    - ${formatStyleForYaml(line)}\n`;
        });
      }
      // Extra styles from textarea
      if (config.extraStyles) {
        yaml += `    # Custom Extra Styles\n`;
        config.extraStyles.split('\n').forEach(line => {
          if (line.trim()) {
            yaml += `    - ${formatStyleForYaml(line.trim())}\n`;
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
      if (baseFontWeight) {
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

  // --- Merged ON/OFF State Entries (binary entities) ---
  // For binary entities we emit exactly one `- value: 'on'` and one `- value: 'off'`
  // entry, each built from the fully-merged appearance (preset + manual) for that
  // state. They are rendered here but emitted after Advanced State-based Styling,
  // so a matching advanced condition wins via button-card's first-match ordering.
  const renderMergedStateEntry = (stateVal: 'on' | 'off'): string => {
    if (!stateAppearance) return '';
    const app = stateVal === 'on' ? stateAppearance.on : stateAppearance.off;
    const bundle = buildStateStylesFromAppearance(app, themeKeys);

    // OFF auto-dim: when nothing gives OFF a distinct background, dim it so ON != OFF.
    // Suppressed when Card Background is a theme/global control (base owns it) or the
    // card uses color:auto (button-card already differentiates via light color).
    if (
      stateVal === 'off' &&
      !isGlobalKey('backgroundColor') &&
      !config.colorAuto &&
      !bundle.card.some(s => s.startsWith('background') || s.startsWith('filter'))
    ) {
      bundle.card.push('filter: brightness(0.5)');
    }

    // Rotating conic border for a per-state marquee card animation
    if (app.cardAnimation === 'marquee') {
      bundle.card.push(...marqueeCardLines(app.backgroundColor || '#1c1c1c', app.cardAnimationSpeed || '4s'));
    }

    const hasCard = bundle.card.length > 0;
    if (!hasCard && bundle.icon.length === 0 && bundle.name.length === 0 &&
        bundle.state.length === 0 && bundle.label.length === 0) {
      return '';
    }

    const section = (indent: string, key: string, lines: string[]) => {
      if (lines.length === 0) return '';
      return `${indent}${key}:\n${lines.map(s => `${indent}  - ${formatStyleForYaml(s)}`).join('\n')}`;
    };

    let entry = `  - value: '${stateVal}'\n    styles:\n`;
    const parts: string[] = [];
    if (hasCard) parts.push(section('      ', 'card', bundle.card));
    if (bundle.icon.length) parts.push(section('      ', 'icon', bundle.icon));
    if (bundle.name.length) parts.push(section('      ', 'name', bundle.name));
    if (bundle.state.length) parts.push(section('      ', 'state', bundle.state));
    if (bundle.label.length) parts.push(section('      ', 'label', bundle.label));
    entry += parts.filter(Boolean).join('\n');
    return entry;
  };

  const onStateLogic = renderMergedStateEntry('on');
  const offStateLogic = renderMergedStateEntry('off');

  // The user's advanced Conditional Styles. Synthetic merged ON/OFF entries (used to
  // drive the live preview) are emitted via the stateAppearance path above, so exclude
  // them here to avoid duplicate state entries.
  const userConditionals = (config.stateStyles || []).filter(
    s => !String(s.id || '').startsWith('state-appearance-')
  );

  // Output state section if we have merged state entries OR advanced conditionals
  const hasStateConditionals = userConditionals.length > 0;

  if (onStateLogic || offStateLogic || hasStateConditionals) {
    yaml += `state:
`;
  }

  // Custom State Styles / Conditionals
  if (hasStateConditionals) {
    userConditionals.forEach(stateStyle => {
      yaml += `  -\n`;

      const usesCrossEntityCondition = shouldUseTemplateCondition(stateStyle, config.entity || '');
      const outputAsTemplate =
        stateStyle.operator === 'template' ||
        (stateStyle.operator !== 'default' && usesCrossEntityCondition);

      if (stateStyle.operator === 'default') {
        yaml += `    operator: default\n`;
      } else if (outputAsTemplate) {
        const templateValue = stateStyle.operator === 'template'
          ? normalizeTemplateValue(stateStyle.value)
          : buildStateConditionTemplate(stateStyle, config.entity || '');
        yaml += `    operator: template\n`;
        yaml += `    value: |\n`;
        templateValue.split('\n').forEach(line => {
          yaml += `      ${line}\n`;
        });
      } else if (stateStyle.operator === 'regex') {
        yaml += `    operator: regex\n`;
        yaml += `    value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      } else if (stateStyle.operator === 'above') {
        yaml += `    operator: '>'\n`;
        yaml += `    value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      } else if (stateStyle.operator === 'above_equal') {
        yaml += `    operator: '>='\n`;
        yaml += `    value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      } else if (stateStyle.operator === 'below') {
        yaml += `    operator: '<'\n`;
        yaml += `    value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      } else if (stateStyle.operator === 'below_equal') {
        yaml += `    operator: '<='\n`;
        yaml += `    value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      } else if (stateStyle.operator === 'not_equals') {
        yaml += `    operator: '!='\n`;
        yaml += `    value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      } else {
        yaml += `    value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      }
      
      // Basic Overrides
      if (stateStyle.name) {
        yaml += `    name: ${JSON.stringify(stateStyle.name)}\n`;
      }
      if (stateStyle.icon) {
        yaml += `    icon: ${JSON.stringify(stateStyle.icon)}\n`;
      }
      if (stateStyle.color) {
        yaml += `    color: ${JSON.stringify(stateStyle.color)}\n`;
      }
      if (stateStyle.entityPicture) {
        yaml += `    entity_picture: ${JSON.stringify(stateStyle.entityPicture)}\n`;
      }
      if (stateStyle.label) {
        yaml += `    label: ${JSON.stringify(stateStyle.label)}\n`;
      }
      if (stateStyle.stateDisplay) {
        yaml += `    state_display: ${JSON.stringify(stateStyle.stateDisplay)}\n`;
      }
      if (stateStyle.spin) {
        // button-card's per-state icon spin key is `rotate`
        yaml += `    rotate: true\n`;
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
        // Apply backgroundColorOpacity if set to something other than full opacity
        // Use `background:` (not `background-color:`) so it overrides any gradient set via `background:` shorthand in base styles
        const bgOpacity = stateStyle.backgroundColorOpacity !== undefined ? stateStyle.backgroundColorOpacity : 100;
        const bgValue = bgOpacity < 100 ? hexToRgba(stateStyle.backgroundColor, bgOpacity) : stateStyle.backgroundColor;
        conditionalCardStyles.push(`background: ${bgValue}`);
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
        conditionalCardStyles.push(...getEffectIntensityStyles(stateStyle.cardAnimation, stateStyle.effectIntensity));
        if (stateStyle.cardAnimation === 'progressBorder') {
          conditionalCardStyles.push('border: var(--cba-progress-width, 3px) solid transparent');
          conditionalCardStyles.push(progressBorderBackground(stateStyle.backgroundColor || bgColor || '#10131c'));
        }
        if (stateStyle.cardAnimation === 'thresholdPulse') {
          conditionalCardStyles.push(`color: ${thresholdValueColor}`);
          conditionalCardStyles.push(`border-color: ${thresholdValueColor}`);
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

  // button-card uses the first matching state entry. Advanced user-authored
  // conditions therefore come first, with the ordinary merged ON/OFF designs as
  // fallbacks after them.
  if (onStateLogic) yaml += onStateLogic + '\n';
  if (offStateLogic) yaml += offStateLogic + '\n';

  return yaml;
};

// Helper to format styles for YAML (handle colons and special characters properly)
const formatStyleForYaml = (style: string): string => {
  // If it contains a colon, we need to quote it or format it properly
  if (style.includes(':')) {
    const colonIndex = style.indexOf(':');
    const prop = style.substring(0, colonIndex).trim();
    const value = style.substring(colonIndex + 1).trim();
    // JS templates must stay unquoted so button-card can evaluate them
    if (value.startsWith('[[[')) return `${prop}: ${value}`;
    // Quote values that contain special YAML characters (commas, parentheses, etc.)
    if (value.includes(',') || value.includes('(') || value.includes(')') || value.includes('#') || value.includes("'") || value.includes(': ')) {
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
    const gradientOpacity = config.gradientOpacity ?? 100;
    const color1 = hexToRgba(config.gradientColor1, gradientOpacity);
    const color2 = hexToRgba(config.gradientColor2, gradientOpacity);
    const gradient = `linear-gradient(${config.gradientAngle || 135}deg, ${color1}, ${color2})`;
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
      yaml += `      -\n`;
      const usesCrossEntityCondition = shouldUseTemplateCondition(stateStyle, '');
      const outputAsTemplate =
        stateStyle.operator === 'template' ||
        (stateStyle.operator !== 'default' && usesCrossEntityCondition);

      if (stateStyle.operator === 'default') {
        yaml += `        operator: default\n`;
      } else if (outputAsTemplate) {
        const templateValue = stateStyle.operator === 'template'
          ? normalizeTemplateValue(stateStyle.value)
          : buildStateConditionTemplate(stateStyle, '');
        yaml += `        operator: template\n`;
        yaml += `        value: |\n`;
        templateValue.split('\n').forEach(line => {
          yaml += `          ${line}\n`;
        });
      } else if (stateStyle.operator === 'regex') {
        yaml += `        operator: regex\n`;
        yaml += `        value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      } else if (stateStyle.operator === 'above') {
        yaml += `        operator: '>'\n`;
        yaml += `        value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      } else if (stateStyle.operator === 'below') {
        yaml += `        operator: '<'\n`;
        yaml += `        value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      } else if (stateStyle.operator === 'not_equals') {
        yaml += `        operator: '!='\n`;
        yaml += `        value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
      } else {
        yaml += `        value: ${quoteYamlSingle(stateStyle.value || '')}\n`;
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
