import React from 'react';
import { Gauge, Sparkles } from 'lucide-react';
import { Preset } from '../presets';
import { ThresholdColorConfig } from '../types';
import type { AnimationType } from '../types';

const PRESET_EXAMPLE_STYLES = `
  @keyframes cba-glow { 0%,100% { box-shadow: 0 0 5px currentColor, 0 0 10px currentColor; } 50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; } }
`;

export const OptionExampleStyles: React.FC = () => <style>{PRESET_EXAMPLE_STYLES}</style>;

const parseStyleText = (text?: string): Record<string, string> => {
  if (!text) return {};
  return text.split(/\r?\n/).reduce<Record<string, string>>((styles, rawLine) => {
    const line = rawLine.trim().replace(/;$/, '');
    const separator = line.indexOf(':');
    if (separator > 0) styles[line.slice(0, separator).trim().toLowerCase()] = line.slice(separator + 1).trim();
    return styles;
  }, {});
};

const alphaColor = (color: string, opacity = 100): string => {
  const match = color.match(/^#([0-9a-f]{6})$/i);
  if (!match || opacity >= 100) return color;
  const value = match[1];
  return `rgba(${parseInt(value.slice(0, 2), 16)}, ${parseInt(value.slice(2, 4), 16)}, ${parseInt(value.slice(4, 6), 16)}, ${opacity / 100})`;
};

const shadowValue = (size: string | undefined, color: string, opacity: number): string => {
  const resolvedColor = alphaColor(color || '#000000', opacity);
  switch (size) {
    case 'sm': return `0 2px 5px ${resolvedColor}`;
    case 'md': return `0 5px 12px ${resolvedColor}`;
    case 'lg': return `0 10px 24px ${resolvedColor}`;
    case 'xl': return `0 18px 42px ${resolvedColor}`;
    case 'inner': return `inset 0 3px 10px ${resolvedColor}`;
    default: return 'none';
  }
};

const COLOR_TOKENS = /#[0-9a-f]{6}\b|rgba?\([^)]*\)/gi;

type Rgba = { r: number; g: number; b: number; a: number };

const parseColorToken = (color: string): Rgba | null => {
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const value = hex[1];
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
      a: 1,
    };
  }
  const rgb = color.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/i);
  if (rgb) return { r: parseFloat(rgb[1]), g: parseFloat(rgb[2]), b: parseFloat(rgb[3]), a: rgb[4] === undefined ? 1 : parseFloat(rgb[4]) };
  return null;
};

const colorLuminance = ({ r, g, b }: Rgba): number => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** Bright or saturated enough (and opaque enough) to read clearly against the dark canvas. */
const popsOnDark = (color: Rgba): boolean =>
  color.a >= 0.5 &&
  (colorLuminance(color) > 0.5 ||
    (Math.max(color.r, color.g, color.b) >= 180 && Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b) >= 60));

const extractColors = (value?: string): Rgba[] =>
  (value?.match(COLOR_TOKENS) || [])
    .map(parseColorToken)
    .filter((color): color is Rgba => color !== null);

const CANVAS_DARK = 'radial-gradient(circle at top, #334155, #0f172a)';
const CANVAS_LIGHT = 'radial-gradient(circle at top, #e2e8f0, #94a3b8)';
const CANVAS_COLORFUL = 'linear-gradient(135deg, #075985 0 25%, #4c1d95 25% 50%, #9a3412 50% 75%, #065f46 75%)';

/** Curated gallery canvases from the button-card backdrop pairing guide. */
const PRESET_BACKDROPS: Readonly<Record<string, string>> = {
  'Minimal Dark': '#ECEDEF',
  'Minimal Light': '#2B2D31',
  'Invisible Touch': '#4A4E57',
  Outlined: '#14161A',
  'Soft Shadow': '#F2F0EC',
  'Blank Card': '#33363D',
  'Label Card': '#1E2026',
  Glassmorphism: '#6C5CE7',
  'Glassmorphism Dark': '#1B1035',
  'Ice Glass': '#0E3A5C',
  'Rose Glass': '#4A1F35',
  'Crystal Clear': '#2D1B4E',
  'Neon Glow': '#050A07',
  'Neon Purple': '#0A0512',
  'Neon Orange': '#100804',
  'Neon Cyan': '#040E10',
  'Neon Pink': '#100510',
  'Neon Yellow': '#0D0D03',
  'Sunset Gradient': '#2A1520',
  'Ocean Gradient': '#0B1230',
  'Aurora Gradient': '#071A1E',
  'Fire Gradient': '#1A0A05',
  'Midnight Gradient': '#E3E0EC',
  'Emerald Gradient': '#04140F',
  'Royal Gold': '#0F1830',
  'Cotton Candy': '#35283A',
  'Lava Lamp': '#17091A',
  Holographic: '#101018',
  'Pulse Animation': '#101216',
  'Icon Spin': '#DFE2E7',
  'Marquee Border': '#08080C',
  Floating: '#E4E6EA',
  Heartbeat: '#EFE9E9',
  'Breathing Glow': '#060A14',
  'Shake Alert': '#F2ECDF',
  Bounce: '#E8EAEE',
  'Wobble Jelly': '#E9EBF0',
  'Tada!': '#12060F',
  'Swing Pendulum': '#E7E9ED',
  'Flip Card': '#DFE3E9',
  'Rubber Band': '#EAECF0',
  'Flash Blink': '#0B0B0E',
  'Ripple Wave': '#082130',
  'Aurora Border': '#07060F',
  'Comet Border': '#05060A',
  'Energy Charge': '#04100F',
  'Neon Current': '#08070A',
  Scanner: '#06090C',
  Shimmer: '#23262B',
  'Liquid Gradient': '#14060E',
  'Mesh Gradient': '#0A0C12',
  Plasma: '#0C0518',
  Starfield: '#02030A',
  Embers: '#120703',
  Rain: '#0A0F16',
  'Radar Pulse': '#03110A',
  'Sonar Rings': '#04101C',
  'Status Beacon': '#050D08',
  Glitch: '#0A0A0D',
  'Electric Jolt': '#04070F',
  Frost: '#0B2432',
  'Heat Haze': '#170703',
  'Breathing Glass': '#2A1E3C',
  'Magnetic Hover': '#E6E8EC',
  'Icon Orbit': '#08090E',
  'Icon Draw': '#0E1014',
  'State Morph': '#120A20',
  'Progress Border': '#0B0A06',
  'Threshold Pulse': '#130C04',
  'Raised Button': '#C9CDD4',
  'Inset/Pressed': '#2A2D33',
  'Neumorphism Light': '#E0E5EC',
  'Neumorphism Dark': '#2E3239',
  Embossed: '#3A3E45',
  'Layered Card': '#B9BEC7',
  'Cyberpunk Red': '#0C0206',
  'Matrix Green': '#000502',
  'Tron Blue': '#01060D',
  'Glitch Effect': '#0A0410',
  Synthwave: '#1A0B2E',
  Terminal: '#020604',
  'Blade Runner': '#120C06',
  'Pixel Art': '#5C94FC',
  Gameboy: '#C4BEBB',
  'VHS Tape': '#1B1B22',
  Arcade: '#17040A',
  'Retro TV': '#4A4640',
  Cassette: '#E8DCC8',
  'Floppy Disk': '#C8C6BE',
  Forest: '#0C1A0F',
  'Ocean Deep': '#04121F',
  'Sunset Sky': '#2A1220',
  'Night Sky': '#050818',
  Lava: '#0F0503',
  'Ice Crystal': '#0F2E42',
  'Storm Cloud': '#262B31',
  'Aurora Borealis': '#030B14',
  'Circle Icon': '#E9EBEF',
  'Square Badge': '#E9EBEF',
  'Soft Glow Icon': '#0E1014',
  'Neon Ring Icon': '#040D0E',
  'Gradient Circle': '#E7E6EE',
  'Floating Icon': '#E4E7EC',
  'Icon Only Large': '#EBEDF0',
  'Mini Icon Badge': '#EAECF0',
  'Outlined Icon': '#EDEEF2',
  'Hexagon Icon': '#E8EAEF',
  'Diamond Icon': '#E8EAEF',
  'Pill Icon': '#EBEDF1',
  'Neumorphic Icon': '#E0E5EC',
  'Glassmorphic Icon': '#5B4B8A',
  'Pulse Ring Icon': '#0D0F13',
  'Sunrise Icon': '#2B1C14',
  'Ocean Icon': '#071726',
  'Fire Icon': '#180903',
  'Shadow Icon': '#DEE1E7',
  'Inset Icon': '#303439',
  'Minimal Line Icon': '#24272C',
  'Top Accent Icon': '#22252A',
  'Corner Notch Icon': '#E9EBEF',
  'Bottom-Left Icon': '#E9EBEF',
  'Bottom-Right Icon': '#E9EBEF',
  'Top-Left Icon': '#E9EBEF',
  'Top-Right Icon': '#E9EBEF',
  'Area Card - Amber': '#0A1420',
  'Area Card - Teal': '#1B1220',
  'Area Card - Purple': '#191614',
  'Area Card - Blue': '#1E1710',
  'Area Card - Green': '#1A1420',
  'Badge Icon - Top Right': '#EAEDF2',
  'Badge Icon - Notification': '#EDEEF1',
  'Overlay Info Icon': '#23262B',
  'Watermark Icon': '#1A1D22',
  'Split Card Icon': '#E9EBEF',
  'Entity Color Match': '#17181C',
  'Rounded Pill': '#E9EBEF',
  'Square Tile': '#E9EBEF',
  'Wide Banner': '#EDEEF1',
  'Circle Button': '#E8EAEF',
  Hexagon: '#E8EAEF',
  Diamond: '#E9EBEF',
  'Dashed Border': '#262A30',
  'Dotted Border': '#E8EAEE',
  'Double Border': '#24272D',
  'Compact Mini': '#E9EBEF',
  'Large Display': '#E9EBEF',
};

const glassBackdrop = (baseColor: string): string =>
  `linear-gradient(135deg, rgba(255,255,255,.38) 0%, rgba(255,255,255,.08) 42%, rgba(0,0,0,.32) 100%), ${baseColor}`;

/**
 * Pick a canvas the preset's effect can actually be seen against: a colorful
 * backdrop for glass/transparent looks (so blur and tint read), the card's own
 * color for neumorphic looks (they only work on a same-color surface), a light
 * canvas for dark cards with no bright accent, and the dark canvas otherwise.
 */
const canvasBackground = (
  preset: Preset,
  background: string,
  extraStyles: Record<string, string>,
  isMarquee: boolean,
): string => {
  const config = preset.config;
  const curatedBackdrop = PRESET_BACKDROPS[preset.name];
  if (curatedBackdrop) {
    // Glass needs visible variation behind it for backdrop blur to read.
    if (preset.category === 'glass' || /glass/i.test(preset.name)) return glassBackdrop(curatedBackdrop);
    return curatedBackdrop;
  }
  const translucent = (config.backgroundColorOpacity ?? 100) < 50;
  const blurred = Boolean(config.backdropBlur && config.backdropBlur !== '0px');
  if (translucent || blurred) return CANVAS_COLORFUL;
  if (isMarquee) return CANVAS_DARK;
  const accentColors = [
    config.borderStyle && config.borderStyle !== 'none' ? config.borderColor : undefined,
    config.shadowSize && config.shadowSize !== 'none' ? config.shadowColor : undefined,
    extraStyles['box-shadow'],
    extraStyles['text-shadow'],
  ].flatMap(extractColors);
  const backgroundColors = extractColors(background);
  if ([...accentColors, ...backgroundColors].some(popsOnDark)) return CANVAS_DARK;
  const avgLuminance = backgroundColors.length
    ? backgroundColors.reduce((sum, color) => sum + colorLuminance(color) * color.a, 0) / backgroundColors.length
    : 0.5;
  return avgLuminance < 0.22 ? CANVAS_LIGHT : CANVAS_DARK;
};

const presetBackground = (preset: Preset, extraStyles: Record<string, string>): string => {
  const config = preset.config;
  if (config.gradientEnabled) {
    const colors = [config.gradientColor1 || '#667eea', config.gradientColor2 || '#764ba2'];
    if (config.gradientColor3Enabled) colors.push(config.gradientColor3 || '#f093fb');
    if (config.gradientType === 'radial') return `radial-gradient(circle, ${colors.join(', ')})`;
    if (config.gradientType === 'conic') return `conic-gradient(from ${config.gradientAngle || 0}deg, ${colors.join(', ')}, ${colors[0]})`;
    return `linear-gradient(${config.gradientAngle ?? 135}deg, ${colors.join(', ')})`;
  }
  return extraStyles.background || alphaColor(config.backgroundColor || '#1c1c1c', config.backgroundColorOpacity ?? 100);
};

const animationValue = (animation: AnimationType | undefined, speed?: string): string | undefined => {
  if (!animation || animation === 'none' || animation === 'marquee') return undefined;
  const timing = animation === 'spin' ? 'linear' : 'ease-in-out';
  const keyframe = animation === 'spin' ? 'cba-rotate' : `cba-${animation}`;
  return `${keyframe} ${speed || '1.8s'} ${timing} infinite`;
};

// Thumbnail canvas: h-16 w-24 with p-2 padding leaves an 80x48 inner area.
const THUMB_INNER_W = 80;
const THUMB_INNER_H = 48;

const parsePx = (value?: string): number | undefined => {
  if (!value || !value.endsWith('px')) return undefined;
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

/** Halve full-size pixel offsets so they read correctly at thumbnail scale; pass % through. */
const scaleOffset = (value?: string): string | undefined => {
  const px = parsePx(value);
  return px === undefined ? value : `${Math.round(px / 2)}px`;
};

const ROW_LAYOUTS = new Set(['icon_name_state', 'icon_name_state2nd', 'icon_state', 'icon_state_name2nd', 'icon_label']);

/**
 * Drop undefined entries before handing styles to React. An explicit undefined
 * longhand (e.g. backgroundImage) after a shorthand (background) clears the
 * shorthand's value in the DOM, wiping gradient/border looks from thumbnails.
 */
const definedStyles = (styles: Record<string, string | number | undefined>): React.CSSProperties => {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(styles)) {
    if (value !== undefined && value !== '') out[key] = value;
  }
  return out as React.CSSProperties;
};

/** Mirror the real preview's icon sizing (percentage of card size) at thumbnail scale. */
const thumbIconSize = (size: string | undefined, boxH: number): number => {
  const value = size || '40%';
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) return 14;
  if (value.endsWith('%')) return Math.round(Math.min(30, Math.max(8, (parsed / 100) * boxH * 0.75)));
  return Math.round(Math.min(26, Math.max(8, parsed * 0.55)));
};

export const PresetExample: React.FC<{ preset: Preset }> = ({ preset }) => {
  const config = preset.config;
  const extraStyles = parseStyleText(config.extraStyles);
  const imgCellStyles = parseStyleText(config.imgCellStyles);
  const background = presetBackground(preset, extraStyles);
  const isMarquee = config.cardAnimation === 'marquee';
  const hasMovingGradient = Boolean(extraStyles['background-size'] && extraStyles.animation);
  const border = config.borderStyle && config.borderStyle !== 'none'
    ? `${config.borderWidth || '1px'} ${config.borderStyle} ${config.borderColor || '#64748b'}`
    : '1px solid rgba(148,163,184,.16)';

  // Card box dimensions: honor aspectRatio presets (circle/square/banner) and
  // fixed-size badge presets (extraStyles width/height) instead of always filling.
  let boxW = THUMB_INNER_W;
  let boxH = THUMB_INNER_H;
  const aspect = config.aspectRatio?.replace(':', '/');
  if (aspect) {
    const [w, h] = aspect.split('/').map((part) => parseFloat(part));
    if (w > 0 && h > 0) {
      boxW = Math.min(THUMB_INNER_W, THUMB_INNER_H * (w / h));
      boxH = boxW / (w / h);
    }
  }
  const badgeW = parsePx(extraStyles.width);
  if (badgeW && badgeW <= THUMB_INNER_H) {
    boxW = badgeW;
    boxH = parsePx(extraStyles.height) ?? badgeW;
  }

  const isCornerBadge = preset.name === 'Badge Icon - Top Right' || preset.name === 'Badge Icon - Notification';
  const showIcon = config.showIcon !== false;
  const showName = config.showName !== false;
  const iconSize = thumbIconSize(config.size, boxH);
  const iconAbsolute = imgCellStyles.position === 'absolute';
  // Rotated square cards (Diamond) overflow the thumbnail; shrink to keep corners visible.
  const cardTransform = extraStyles.transform
    ? `${extraStyles.transform}${aspect && extraStyles.transform.includes('rotate(') ? ' scale(0.7)' : ''}`
    : undefined;
  const nameFontPx = (() => {
    const parsed = parseFloat(config.fontSize || '');
    return Number.isNaN(parsed) ? 7 : Math.round(Math.min(10, Math.max(6, parsed * 0.5)));
  })();
  const letterSpacing = (() => {
    const parsed = parseFloat(config.letterSpacing || '');
    return Number.isNaN(parsed) ? undefined : `${Math.min(1.5, parsed * 0.5)}px`;
  })();

  return (
    <div
      className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-700 p-2"
      style={{ background: canvasBackground(preset, background, extraStyles, isMarquee) }}
    >
      {isCornerBadge && (
        <span className="absolute inset-2 rounded-[10px] border border-white/10 bg-[#1D2026] shadow-sm" />
      )}
      <div
        className={`relative flex items-center justify-center overflow-hidden ${ROW_LAYOUTS.has(config.layout || 'vertical') ? 'flex-row gap-1.5' : 'flex-col gap-1'}`}
        style={definedStyles({
          position: isCornerBadge ? 'absolute' : 'relative',
          top: isCornerBadge ? '6px' : undefined,
          right: isCornerBadge ? '6px' : undefined,
          zIndex: isCornerBadge ? 1 : undefined,
          width: `${boxW}px`,
          height: `${boxH}px`,
          background: isMarquee ? '#080808' : background,
          backgroundImage: extraStyles['background-image'],
          backgroundSize: extraStyles['background-size'],
          backgroundPosition: extraStyles['background-position'],
          border,
          borderTop: extraStyles['border-top'],
          borderBottom: extraStyles['border-bottom'],
          borderRadius: config.borderRadius || '10px',
          boxShadow: extraStyles['box-shadow'] || shadowValue(config.shadowSize, config.shadowColor || '#000000', config.shadowOpacity ?? 30),
          color: config.color || config.iconColor || '#ffffff',
          backdropFilter: config.backdropBlur && config.backdropBlur !== '0px' ? `blur(${config.backdropBlur})` : undefined,
          clipPath: extraStyles['clip-path'],
          transform: cardTransform,
          justifyContent: extraStyles['justify-content'],
          alignItems: extraStyles['align-items'],
          padding: extraStyles.padding ? '4px' : undefined,
          fontFamily: config.fontFamily || undefined,
          textTransform: config.textTransform,
          letterSpacing,
          textShadow: extraStyles['text-shadow'],
          animation: hasMovingGradient
            ? `${extraStyles.animation.split(/\s+/)[0]} 5s ease infinite`
            : animationValue(config.cardAnimation, config.cardAnimationSpeed),
        })}
      >
        {isMarquee && (
          <>
            <span className="absolute -inset-[70%] bg-[conic-gradient(#22d3ee,#a855f7,#f43f5e,#facc15,#22d3ee)]" style={{ animation: `marquee-spin ${config.cardAnimationSpeed || '4s'} linear infinite` }} />
            <span className="absolute inset-[2px]" style={{ background, borderRadius: config.borderRadius || '8px' }} />
          </>
        )}
        {showIcon && (
          <span
            className="z-10 flex items-center justify-center"
            style={definedStyles({
              position: iconAbsolute ? 'absolute' : 'relative',
              top: iconAbsolute ? scaleOffset(imgCellStyles.top) : undefined,
              right: iconAbsolute ? scaleOffset(imgCellStyles.right) : undefined,
              bottom: iconAbsolute ? scaleOffset(imgCellStyles.bottom) : undefined,
              left: iconAbsolute ? scaleOffset(imgCellStyles.left) : undefined,
              opacity: imgCellStyles.opacity,
              background: imgCellStyles.background,
              backgroundImage: imgCellStyles['background-image'],
              border: imgCellStyles.border,
              borderTop: imgCellStyles['border-top'],
              borderBottom: imgCellStyles['border-bottom'],
              borderRadius: imgCellStyles['border-radius'],
              boxShadow: imgCellStyles['box-shadow'],
              filter: imgCellStyles.filter,
              backdropFilter: imgCellStyles['backdrop-filter'],
              clipPath: imgCellStyles['clip-path'],
              padding: imgCellStyles.padding ? '3px' : undefined,
              marginRight: scaleOffset(imgCellStyles['margin-right']),
              transform: imgCellStyles.transform,
              animation: animationValue(config.iconAnimation, config.iconAnimationSpeed),
              transformOrigin: config.iconAnimation === 'swing' ? 'top center' : undefined,
            })}
          >
            <Sparkles size={iconSize} style={{ color: config.iconColor || config.color || '#ffffff' }} />
          </span>
        )}
        {showName && (
          <span className="relative z-10 max-w-16 truncate font-semibold" style={{ fontSize: `${nameFontPx}px`, fontWeight: config.fontWeight as React.CSSProperties['fontWeight'] }}>
            Button
          </span>
        )}
        {config.showState === true && showName && (
          <span className="relative z-10 opacity-70" style={{ fontSize: '6px' }}>On</span>
        )}
      </div>
    </div>
  );
};

export const EffectThumbnail: React.FC<{
  effect:
    | 'color'
    | 'textColor'
    | 'elementColors'
    | 'opacity'
    | 'backgroundOpacity'
    | 'gradient'
    | 'glass'
    | 'shadow'
    | 'border'
    | 'typography'
    | 'cardAnimation'
    | 'iconAnimation';
}> = ({ effect }) => {
  const isBackdropExample = effect === 'opacity' || effect === 'backgroundOpacity' || effect === 'glass';
  const effectLabels: Record<typeof effect, string> = {
    color: 'Alternate card color',
    textColor: 'Alternate text color',
    elementColors: 'Element colors',
    opacity: '50 percent card opacity',
    backgroundOpacity: '50 percent background opacity',
    gradient: 'Gradient background',
    glass: 'Glass button',
    shadow: 'Button shadow',
    border: 'Button border',
    typography: 'Typography',
    cardAnimation: 'Card animation',
    iconAnimation: 'Icon animation',
  };

  const buttonStyle: React.CSSProperties = {
    background:
      effect === 'color'
        ? '#db2777'
        : effect === 'gradient'
          ? 'linear-gradient(135deg, #06b6d4, #7c3aed 55%, #f43f5e)'
          : effect === 'glass'
            ? 'rgba(15, 23, 42, .42)'
            : effect === 'backgroundOpacity'
              ? 'rgba(14, 165, 233, .5)'
              : '#334155',
    border:
      effect === 'border'
        ? '3px solid #facc15'
        : effect === 'glass'
          ? '1px solid rgba(255,255,255,.42)'
          : '1px solid rgba(255,255,255,.2)',
    boxShadow:
      effect === 'shadow'
        ? shadowValue('lg', '#000000', 100)
        : effect === 'glass'
          ? '0 8px 24px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.28)'
          : undefined,
    backdropFilter: effect === 'glass' ? 'blur(10px)' : undefined,
    WebkitBackdropFilter: effect === 'glass' ? 'blur(10px)' : undefined,
    opacity: effect === 'opacity' ? 0.5 : undefined,
    color: effect === 'textColor' ? '#facc15' : '#ffffff',
    fontFamily: effect === 'typography' ? 'Georgia, serif' : undefined,
    fontWeight: effect === 'typography' ? 700 : 600,
    fontStyle: effect === 'typography' ? 'italic' : undefined,
    letterSpacing: effect === 'typography' ? '.5px' : undefined,
  };

  return (
    <div
      className={`relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-700 ${
        isBackdropExample
          ? 'bg-[linear-gradient(45deg,#111827_25%,#1f2937_25%_50%,#111827_50%_75%,#1f2937_75%)] bg-[length:12px_12px]'
          : effect === 'shadow'
            ? 'bg-[radial-gradient(circle_at_top,#e2e8f0,#94a3b8)]'
            : 'bg-gray-950'
      }`}
      aria-label={`${effectLabels[effect]} effect thumbnail`}
    >
      {effect === 'glass' && (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0ea5e9_0_25%,#7c3aed_25%_50%,#f97316_50%_75%,#10b981_75%)]" />
      )}
      <div
        className="relative flex h-8 w-14 items-center justify-center overflow-hidden rounded-md text-[8px]"
        style={buttonStyle}
      >
        {effect === 'elementColors' ? (
          <span className="flex items-center gap-1">
            <Sparkles size={10} className="text-cyan-300" />
            <span className="text-pink-300">Button</span>
          </span>
        ) : effect === 'iconAnimation' ? (
          <span className="relative flex items-center">
            <span className="absolute -left-3 text-cyan-400/35">•</span>
            <Sparkles size={14} className="text-cyan-300" />
          </span>
        ) : effect === 'cardAnimation' ? (
          <>
            <span className="absolute left-1 top-1 h-6 w-12 rounded border border-cyan-300/25" />
            <span className="relative">Button</span>
          </>
        ) : effect === 'typography' ? 'Aa' : 'Button'}
      </div>
    </div>
  );
};

export const ThresholdExample: React.FC<{ config: ThresholdColorConfig }> = ({ config }) => {
  const orderedColors = config.mode === 'ascending'
    ? [config.greenColor, config.yellowColor, config.redColor]
    : [config.redColor, config.yellowColor, config.greenColor];
  const firstStop = Math.max(0, Math.min(100, Math.min(config.greenThreshold, config.yellowThreshold)));
  const secondStop = Math.max(firstStop, Math.min(100, Math.max(config.greenThreshold, config.yellowThreshold)));

  return (
    <div
      className="rounded-xl border border-gray-700 bg-gray-950/70 p-4"
      style={{
        '--threshold-low': orderedColors[0],
        '--threshold-mid': orderedColors[1],
        '--threshold-high': orderedColors[2],
      } as React.CSSProperties}
    >
      <style>{`
        @keyframes cba-threshold-sweep { 0% { left: 0%; } 50% { left: 100%; } 100% { left: 0%; } }
        @keyframes cba-threshold-color { 0%, 18% { color: var(--threshold-low); border-color: var(--threshold-low); } 38%, 62% { color: var(--threshold-mid); border-color: var(--threshold-mid); } 82%, 100% { color: var(--threshold-high); border-color: var(--threshold-high); } }
      `}</style>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-24 shrink-0 flex-col items-center justify-center rounded-xl border bg-gray-900" style={{ animation: 'cba-threshold-color 5s ease-in-out infinite' }}>
          <Gauge size={20} />
          <span className="mt-1 text-[8px] font-bold uppercase">Live value</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative h-5 rounded-full" style={{ background: `linear-gradient(to right, ${orderedColors[0]} 0 ${firstStop}%, ${orderedColors[1]} ${firstStop}% ${secondStop}%, ${orderedColors[2]} ${secondStop}% 100%)` }}>
            <span className="absolute top-1/2 h-7 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-gray-950 shadow" style={{ animation: 'cba-threshold-sweep 5s ease-in-out infinite' }} />
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-gray-500"><span>0</span><span>Value sweeps through thresholds</span><span>100</span></div>
        </div>
      </div>
    </div>
  );
};
