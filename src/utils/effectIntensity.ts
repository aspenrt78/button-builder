import { AnimationType } from '../types';

const EFFECT_INTENSITY_ANIMATIONS = new Set<AnimationType>([
  'glow',
  'marquee',
  'ripple',
  'auroraBorder',
  'cometBorder',
  'energyCharge',
  'neonCurrent',
  'scanner',
  'shimmer',
  'liquidGradient',
  'meshGradient',
  'plasma',
  'starfield',
  'embers',
  'rain',
  'radarPulse',
  'sonarRings',
  'statusBeacon',
  'glitch',
  'electricJolt',
  'frost',
  'heatHaze',
  'breathingGlass',
  'stateMorph',
  'progressBorder',
  'thresholdPulse',
]);

export const supportsEffectIntensity = (animation?: AnimationType): boolean =>
  Boolean(animation && EFFECT_INTENSITY_ANIMATIONS.has(animation));

export const clampEffectIntensity = (intensity?: number): number => {
  const numeric = Number(intensity);
  if (!Number.isFinite(numeric)) return 100;
  return Math.min(200, Math.max(25, Math.round(numeric)));
};

const cleanNumber = (value: number): string =>
  Number(value.toFixed(3)).toString();

const interpolate = (from: number, to: number, progress: number): number =>
  from + ((to - from) * progress);

const formatRadiusList = (values: number[]): string =>
  values.map(value => `${cleanNumber(value)}px`).join(' ');

const scaled = (value: number, intensity: number): number =>
  value * (intensity / 100);

const px = (value: number, intensity: number): string =>
  `${cleanNumber(scaled(value, intensity))}px`;

const percent = (value: number): string => `${cleanNumber(value)}%`;

const SPATIAL_FILTER_ANIMATIONS = new Set<AnimationType>([
  'energyCharge',
  'plasma',
  'glitch',
  'frost',
  'heatHaze',
  'breathingGlass',
  'stateMorph',
  'thresholdPulse',
]);

const getLiquidGradientVariables = (intensity: number): Record<string, string> => {
  const baseA = [18, 12, 20, 10];
  const baseB = [11, 21, 12, 19];
  const softA = [15, 14, 16, 13];
  const softB = [14, 16, 14, 15];
  const strongA = [48, 3, 44, 5];
  const strongB = [4, 46, 6, 50];
  const isSoftened = intensity < 100;
  const progress = isSoftened
    ? (intensity - 25) / 75
    : (intensity - 100) / 100;
  const fromA = isSoftened ? softA : baseA;
  const fromB = isSoftened ? softB : baseB;
  const toA = isSoftened ? baseA : strongA;
  const toB = isSoftened ? baseB : strongB;

  return {
    '--cba-liquid-radius-a': formatRadiusList(fromA.map((value, index) => interpolate(value, toA[index], progress))),
    '--cba-liquid-radius-b': formatRadiusList(fromB.map((value, index) => interpolate(value, toB[index], progress))),
  };
};

const getSpatialEffectVariables = (
  animation: AnimationType,
  intensity: number,
): Record<string, string> => {
  const ratio = intensity / 100;
  const variables: Record<string, string> = {};

  switch (animation) {
    case 'glow':
      Object.assign(variables, {
        '--cba-glow-near': px(5, intensity),
        '--cba-glow-mid': px(10, intensity),
        '--cba-glow-far': px(20, intensity),
        '--cba-glow-peak': px(30, intensity),
      });
      break;
    case 'marquee':
      variables['--cba-marquee-width'] = px(3, intensity);
      break;
    case 'ripple':
      variables['--cba-ripple-reach'] = px(20, intensity);
      break;
    case 'auroraBorder':
      Object.assign(variables, {
        '--cba-aurora-soft': px(5, intensity),
        '--cba-aurora-inner': px(4, intensity),
        '--cba-aurora-peak': px(14, intensity),
        '--cba-aurora-inner-peak': px(7, intensity),
        '--cba-aurora-mid': px(10, intensity),
      });
      break;
    case 'cometBorder':
      Object.assign(variables, {
        '--cba-comet-x-neg': px(-8, intensity),
        '--cba-comet-x': px(8, intensity),
        '--cba-comet-y-neg': px(-5, intensity),
        '--cba-comet-y': px(5, intensity),
        '--cba-comet-blur': px(10, intensity),
        '--cba-comet-spread': px(-5, intensity),
        '--cba-comet-ambient': px(7, intensity),
      });
      break;
    case 'energyCharge':
      Object.assign(variables, {
        '--cba-charge-depth': px(-18, intensity),
        '--cba-charge-blur': px(18, intensity),
        '--cba-charge-spread': px(-16, intensity),
        '--cba-charge-glow': px(14, intensity),
        '--cba-charge-flash': px(24, intensity),
      });
      break;
    case 'neonCurrent':
      Object.assign(variables, {
        '--cba-neon-offset': px(5, intensity),
        '--cba-neon-offset-neg': px(-5, intensity),
        '--cba-neon-blur': px(8, intensity),
      });
      break;
    case 'scanner': {
      const travel = 170 * ratio;
      variables['--cba-scanner-start'] = percent(50 - travel);
      variables['--cba-scanner-end'] = percent(50 + travel);
      break;
    }
    case 'shimmer':
      variables['--cba-shimmer-start'] = percent(180 * ratio);
      variables['--cba-shimmer-end'] = percent(-180 * ratio);
      break;
    case 'liquidGradient':
      Object.assign(variables, getLiquidGradientVariables(intensity));
      break;
    case 'meshGradient':
      variables['--cba-mesh-position'] = [
        `${percent(100 * ratio)} ${percent(70 * ratio)}`,
        `${percent(100 - (100 * ratio))} ${percent(100 - (70 * ratio))}`,
        `${percent(50 + (30 * ratio))} ${percent(50 - (30 * ratio))}`,
      ].join(', ');
      break;
    case 'plasma':
      Object.assign(variables, {
        '--cba-plasma-start': percent(50 - (50 * ratio)),
        '--cba-plasma-end': percent(50 + (50 * ratio)),
        '--cba-plasma-hue': `${cleanNumber(100 * ratio)}deg`,
      });
      break;
    case 'starfield':
      variables['--cba-starfield-end'] = [
        `${px(24, intensity)} ${px(40, intensity)}`,
        `${px(12 - (30 * ratio), 100)} ${px(8 + (22 * ratio), 100)}`,
        '0 0',
      ].join(', ');
      break;
    case 'embers':
      variables['--cba-embers-end'] = [
        `${px(8, intensity)} ${px(30 - (65 * ratio), 100)}`,
        `${px(10 - (15 * ratio), 100)} ${px(45 - (65 * ratio), 100)}`,
        '0 0',
      ].join(', ');
      break;
    case 'rain':
      Object.assign(variables, {
        '--cba-rain-start': `0 ${px(-30, intensity)}`,
        '--cba-rain-end': `${px(-12, intensity)} ${px(45, intensity)}`,
      });
      break;
    case 'radarPulse':
      variables['--cba-radar-reach'] = px(35, intensity);
      break;
    case 'sonarRings':
      Object.assign(variables, {
        '--cba-sonar-near': px(10, intensity),
        '--cba-sonar-far': px(20, intensity),
      });
      break;
    case 'statusBeacon':
      Object.assign(variables, {
        '--cba-beacon-offset': px(7, intensity),
        '--cba-beacon-offset-neg': px(-7, intensity),
        '--cba-beacon-blur': px(12, intensity),
      });
      break;
    case 'glitch':
      Object.assign(variables, {
        '--cba-glitch-wide': px(3, intensity),
        '--cba-glitch-wide-neg': px(-3, intensity),
        '--cba-glitch-small': px(1, intensity),
        '--cba-glitch-small-neg': px(-1, intensity),
        '--cba-glitch-shadow': px(3, intensity),
        '--cba-glitch-shadow-neg': px(-3, intensity),
        '--cba-glitch-skew': `${cleanNumber(3 * ratio)}deg`,
      });
      break;
    case 'electricJolt':
      Object.assign(variables, {
        '--cba-electric-x-neg': px(-8, intensity),
        '--cba-electric-x': px(8, intensity),
        '--cba-electric-y-neg': px(-5, intensity),
        '--cba-electric-y': px(4, intensity),
        '--cba-electric-glow': px(18, intensity),
        '--cba-electric-glow-peak': px(20, intensity),
        '--cba-electric-jolt-neg': px(-1, intensity),
        '--cba-electric-jolt': px(2, intensity),
      });
      break;
    case 'frost':
      Object.assign(variables, {
        '--cba-frost-inner': px(8, intensity),
        '--cba-frost-outer': px(5, intensity),
        '--cba-frost-inner-peak': px(18, intensity),
        '--cba-frost-outer-peak': px(14, intensity),
      });
      break;
    case 'heatHaze':
      Object.assign(variables, {
        '--cba-haze-skew': `${cleanNumber(0.7 * ratio)}deg`,
        '--cba-haze-skew-neg': `${cleanNumber(-0.7 * ratio)}deg`,
        '--cba-haze-scale-up': cleanNumber(1 + (0.01 * ratio)),
        '--cba-haze-scale-down': cleanNumber(1 - (0.005 * ratio)),
      });
      break;
    case 'breathingGlass':
      Object.assign(variables, {
        '--cba-glass-inner': px(8, intensity),
        '--cba-glass-outer': px(4, intensity),
        '--cba-glass-inner-peak': px(16, intensity),
        '--cba-glass-outer-peak': px(14, intensity),
      });
      break;
    case 'stateMorph':
      Object.assign(variables, {
        '--cba-morph-radius-start': px(16 - (6 * ratio), 100),
        '--cba-morph-radius-end': px(16 + (6 * ratio), 100),
        '--cba-morph-hue': `${cleanNumber(75 * ratio)}deg`,
      });
      break;
    case 'progressBorder':
      variables['--cba-progress-width'] = px(3, intensity);
      break;
    case 'thresholdPulse':
      Object.assign(variables, {
        '--cba-threshold-glow': px(3, intensity),
        '--cba-threshold-glow-peak': px(18, intensity),
      });
      break;
  }

  return variables;
};

/**
 * 100% is visually neutral. Higher values add saturation, contrast, and a small
 * brightness lift; lower values soften the effect without hiding the card.
 */
export const getEffectIntensityFilter = (intensity?: number): string => {
  const ratio = clampEffectIntensity(intensity) / 100;
  const saturation = 0.45 + (0.55 * ratio);
  const contrast = 0.8 + (0.2 * ratio);
  const brightness = 0.95 + (0.05 * ratio);
  return `saturate(${cleanNumber(saturation)}) contrast(${cleanNumber(contrast)}) brightness(${cleanNumber(brightness)})`;
};

export const getEffectIntensityVariables = (
  animation: AnimationType | undefined,
  intensity?: number,
): Record<string, string> => {
  if (!supportsEffectIntensity(animation)) return {};
  const resolved = clampEffectIntensity(intensity);
  if (resolved === 100) return {};

  const variables: Record<string, string> = {
    '--cba-effect-intensity': String(resolved),
    ...getSpatialEffectVariables(animation!, resolved),
  };
  if (SPATIAL_FILTER_ANIMATIONS.has(animation!)) {
    variables['--cba-effect-filter'] = getEffectIntensityFilter(resolved);
  }
  return variables;
};

export const getEffectIntensityStyles = (
  animation: AnimationType | undefined,
  intensity?: number,
): string[] => {
  const variables = getEffectIntensityVariables(animation, intensity);
  const styles = Object.entries(variables).map(([property, value]) => `${property}: ${value}`);
  if (variables['--cba-effect-filter']) styles.push('filter: var(--cba-effect-filter)');
  return styles;
};
