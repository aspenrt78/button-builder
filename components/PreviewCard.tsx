
import React, { useState } from 'react';
import { ButtonConfig, AnimationType, AnimationTrigger } from '../types';
import { Sofa, Lightbulb, Fan, Lock, Home, Music, Power, HelpCircle, User, Palette } from 'lucide-react';

interface Props {
  config: ButtonConfig;
}

// Simulate the "Light Color" provided by HA when state is ON
const SIMULATED_ENTITY_COLOR = '#FFC107'; // Warm Amber/Gold

// Helper to convert Hex to RGBA
const hexToRgba = (hex: string, alpha: number) => {
  if (!hex || hex.length < 7) return 'transparent';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
};

const getShadowStyle = (size: string, color: string, opacity: number) => {
  if (size === 'none') return 'none';
  const rgba = hexToRgba(color, opacity);
  switch (size) {
    case 'sm': return `0 1px 2px 0 ${rgba}`;
    case 'md': return `0 4px 6px -1px ${rgba}, 0 2px 4px -1px ${rgba}`;
    case 'lg': return `0 10px 15px -3px ${rgba}, 0 4px 6px -2px ${rgba}`;
    case 'xl': return `0 20px 25px -5px ${rgba}, 0 10px 10px -5px ${rgba}`;
    case 'inner': return `inset 0 2px 4px 0 ${rgba}`;
    default: return 'none';
  }
};

const IconMapper = ({ name, size, color, animationClass, animationDuration }: { name: string, size: string, color: string, animationClass: string, animationDuration: string }) => {
  const style = { width: size.includes('%') ? size : size, height: size.includes('%') ? size : size, color };
  const iconProps = { style, strokeWidth: 2 };
  
  const n = name ? name.toLowerCase() : '';
  let IconComponent = HelpCircle;
  
  if (n.includes('sofa')) IconComponent = Sofa;
  else if (n.includes('light')) IconComponent = Lightbulb;
  else if (n.includes('fan')) IconComponent = Fan;
  else if (n.includes('lock')) IconComponent = Lock;
  else if (n.includes('garage') || n.includes('home')) IconComponent = Home;
  else if (n.includes('music') || n.includes('play')) IconComponent = Music;
  else if (n.includes('power') || n.includes('switch')) IconComponent = Power;
  
  const spanStyle: React.CSSProperties = {
    display: 'inline-block',
    lineHeight: 0,
    animationDuration: animationClass ? animationDuration : undefined,
  };

  return (
    <span className={animationClass} style={spanStyle}>
      <IconComponent {...iconProps} />
    </span>
  );
};

const getGridTemplate = (layout: string) => {
  switch (layout) {
    case 'icon_name_state':
    case 'icon_name_state2nd':
      return '"i n" "i s" "l l"';
    case 'icon_state':
      return '"i s" "n n" "l l"';
    case 'icon_state_name2nd':
      return '"i s" "i n" "l l"';
    case 'icon_label':
      return '"i l" "n n" "s s"';
    case 'name_state':
      return '"n" "s" "l" "i"';
    case 'vertical':
    default:
      return '"i" "n" "s" "l"';
  }
};

const getGridRows = (layout: string) => {
  switch (layout) {
    case 'icon_name_state':
    case 'icon_name_state2nd':
    case 'icon_state_name2nd':
      return '1fr 1fr min-content';
    case 'icon_state':
    case 'icon_label':
      return '1fr min-content min-content';
    case 'name_state':
      return 'auto auto auto auto';
    case 'vertical':
    default:
      return '1fr min-content min-content min-content';
  }
};

const getGridCols = (layout: string) => {
  switch (layout) {
    case 'icon_name_state':
    case 'icon_name_state2nd':
    case 'icon_state_name2nd':
    case 'icon_state':
    case 'icon_label':
      return 'min-content 1fr';
    case 'name_state':
    case 'vertical':
    default:
      return '1fr';
  }
};

export const PreviewCard: React.FC<Props> = ({ config }) => {
  const [simulatedState, setSimulatedState] = useState<'on' | 'off'>('on');
  const [canvasColor, setCanvasColor] = useState('#0a0a0a');
  const [showCanvasPicker, setShowCanvasPicker] = useState(false);

  const isOff = simulatedState === 'off';
  const isOn = simulatedState === 'on';

  // --- Helper to resolve color for an element ---
  const resolveColor = (
    manualColor: string, 
    autoFlag: boolean, 
    defaultColor: string,
    useSimulatedEntityColor: boolean
  ) => {
    if (autoFlag && useSimulatedEntityColor) return SIMULATED_ENTITY_COLOR;
    if (manualColor) return manualColor;
    return defaultColor;
  };

  // 1. Resolve Card Background
  let actualBgHex = isOff ? config.stateOffColor : config.stateOnColor;
  let actualBgOpacity = isOff ? config.stateOffOpacity : config.stateOnOpacity;
  
  if (config.colorType === 'card' && config.colorAuto && isOn) {
      actualBgHex = SIMULATED_ENTITY_COLOR; 
  } else if (!actualBgHex) {
      actualBgHex = config.backgroundColor;
      actualBgOpacity = config.backgroundColorOpacity;
  }

  const actualBg = hexToRgba(actualBgHex, actualBgOpacity);

  // 2. Resolve Colors
  const effectiveEntityColorActive = (config.colorAuto || config.nameColorAuto || config.iconColorAuto || config.stateColorAuto || config.labelColorAuto || config.borderColorAuto) && isOn;

  const actualIconColor = resolveColor(
    config.iconColor, 
    config.iconColorAuto, 
    config.color, 
    isOn && config.colorAuto && config.colorType !== 'card' // Fallback logic for auto-icon color if global auto is on
  );
  
  const actualNameColor = resolveColor(config.nameColor, config.nameColorAuto, config.color, isOn);
  const actualStateColor = resolveColor(config.stateColor, config.stateColorAuto, config.color, isOn);
  const actualLabelColor = resolveColor(config.labelColor, config.labelColorAuto, config.color, isOn);
  const actualBorderColor = resolveColor(config.borderColor, config.borderColorAuto, 'transparent', isOn);

  // 3. Border Logic
  const borderStyle = config.borderStyle !== 'none' ? `${config.borderWidth} ${config.borderStyle} ${actualBorderColor}` : 'none';
  
  // 4. Animation Logic Helper - Uses cba- prefix to avoid tailwind conflicts
  const getAnimationClass = (type: AnimationType, trigger: AnimationTrigger) => {
    if (type === 'none') return '';
    if (trigger === 'always') return `cba-animate-${type}`;
    if (trigger === 'on' && isOn) return `cba-animate-${type}`;
    if (trigger === 'off' && isOff) return `cba-animate-${type}`;
    return '';
  };

  const cardAnimationClass = getAnimationClass(config.cardAnimation, config.cardAnimationTrigger);
  const cardAnimationDuration = config.cardAnimationSpeed || '2s';

  const iconAnimationFromSelect = getAnimationClass(config.iconAnimation, config.iconAnimationTrigger);
  const iconAnimationClass = [config.spin ? 'cba-animate-spin' : '', iconAnimationFromSelect]
    .filter(Boolean)
    .join(' ');
  const iconAnimationDuration = (config.spin ? config.spinDuration : config.iconAnimationSpeed) || '2s';

  // Marquee Logic: If marquee is active and valid
  const isMarquee = config.cardAnimation === 'marquee' && 
                    ((config.cardAnimationTrigger === 'always') ||
                     (config.cardAnimationTrigger === 'on' && isOn) ||
                     (config.cardAnimationTrigger === 'off' && isOff));

  // 5. Shadow Logic
  const shadowStyle = getShadowStyle(config.shadowSize, config.shadowColor, config.shadowOpacity);

  const containerStyle: React.CSSProperties = {
    backgroundColor: actualBg,
    color: config.color, 
    borderRadius: config.borderRadius,
    padding: config.padding,
    height: config.aspectRatio ? 'auto' : (config.height === 'auto' ? 'auto' : config.height),
    aspectRatio: config.aspectRatio ? config.aspectRatio.replace(':', '/') : 'auto',
    display: 'grid',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: shadowStyle,
    backdropFilter: config.backdropBlur !== '0px' ? `blur(${config.backdropBlur})` : 'none',
    gridTemplateAreas: getGridTemplate(config.layout),
    gridTemplateRows: getGridRows(config.layout),
    gridTemplateColumns: getGridCols(config.layout),
    justifyItems: 'center',
    alignItems: 'center',
    gap: '4px',
    fontSize: config.fontSize,
    fontWeight: config.fontWeight,
    textTransform: config.textTransform,
    border: borderStyle,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden', // Needed for marquee mask
    opacity: Math.min(100, Math.max(0, config.cardOpacity)) / 100,
    animationDuration: cardAnimationClass ? cardAnimationDuration : undefined,
  };

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center transition-colors duration-500"
      style={{ backgroundColor: canvasColor }}
    >
      {/* Canvas Color Control */}
      <div className="absolute top-3 right-3 z-50">
        <div className="relative">
           <button 
             onClick={() => setShowCanvasPicker(!showCanvasPicker)}
             className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 shadow-lg backdrop-blur transition-colors"
             title="Change Canvas Backdrop Color"
           >
             <Palette size={16} />
           </button>
           {showCanvasPicker && (
             <div className="absolute top-10 right-0 bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-2xl w-48 animate-in slide-in-from-top-2">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Preview Backdrop</p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                   {['#0a0a0a', '#ffffff', '#3b82f6', '#ef4444'].map(c => (
                     <button 
                       key={c} 
                       className="w-6 h-6 rounded-full border border-gray-600 shadow-sm"
                       style={{ backgroundColor: c }}
                       onClick={() => setCanvasColor(c)}
                     />
                   ))}
                </div>
                <input 
                   type="color" 
                   value={canvasColor}
                   onChange={(e) => setCanvasColor(e.target.value)}
                   className="w-full h-8 rounded cursor-pointer"
                />
             </div>
           )}
        </div>
      </div>

      {/* The Card Preview - Centered */}
      <div className="relative w-full max-w-[240px] flex justify-center z-10">
        {/* Marquee Background Layer (Simulates rotating border) */}
        {isMarquee && (
          <div className="absolute -inset-[4px] rounded-xl overflow-hidden cba-animate-spin z-0" style={{ borderRadius: `calc(${config.borderRadius} + 4px)` }}>
             <div className="w-full h-full" style={{
               background: `conic-gradient(transparent 20%, ${actualBorderColor || SIMULATED_ENTITY_COLOR})`,
               filter: 'blur(4px)'
             }}></div>
          </div>
        )}

        {/* Main Card */}
        <div 
          style={containerStyle}
          className={`hover:brightness-110 w-full ${cardAnimationClass}`}
          onClick={() => setSimulatedState(s => s === 'on' ? 'off' : 'on')}
        >
           {/* Marquee Inner Cover to create border effect (Only if marquee is on) */}
           {isMarquee && (
             <div className="absolute inset-[2px] bg-black z-[-1]" style={{ 
               borderRadius: config.borderRadius,
               backgroundColor: actualBg
             }}></div>
           )}

          {/* Icon / Entity Picture */}
          {(config.showIcon || config.showEntityPicture) && (
            <div style={{ gridArea: 'i' }} className="flex justify-center items-center w-full h-full relative">
              {config.showEntityPicture ? (
                <div className="rounded-full bg-gray-300 overflow-hidden w-full h-full max-w-[80%] aspect-square flex items-center justify-center border-2 border-white/20">
                  <User className="text-gray-500 w-2/3 h-2/3" />
                </div>
              ) : (
                config.showIcon && (
                  <IconMapper 
                    name={config.icon}
                    size={config.size}
                    color={actualIconColor}
                    animationClass={iconAnimationClass}
                    animationDuration={iconAnimationDuration}
                  />
                )
              )}
            </div>
          )}
          
          {config.showName && (
            <div style={{ gridArea: 'n', color: actualNameColor }} className="font-bold text-[0.9em] text-center truncate w-full px-1">
              {config.name}
            </div>
          )}

          {config.showState && (
            <div style={{ gridArea: 's', color: actualStateColor }} className="opacity-80 text-[0.8em] text-center">
              {simulatedState.toUpperCase()}
            </div>
          )}

          {config.showLabel && (
            <div style={{ gridArea: 'l', color: actualLabelColor }} className="text-[0.75em] opacity-70 text-center px-1 truncate w-full">
              {config.label || 'Label Text'}
            </div>
          )}
        </div>

        {config.showLastChanged && (
           <div className="absolute -bottom-6 text-[10px] text-gray-500 font-mono">
             Last changed: 5 min ago
           </div>
        )}
      </div>

      {/* Controls Overlay - Positioned at bottom */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none">
        
        {/* Legend */}
        {effectiveEntityColorActive && (
          <div className="text-[10px] text-gray-400 bg-gray-900/80 backdrop-blur px-3 py-1 rounded-full border border-gray-800 shadow-lg animate-in slide-in-from-bottom-2">
             <span className="w-2 h-2 bg-[#FFC107] inline-block rounded-full mr-2"></span>
             Using Simulated Entity Color
          </div>
        )}

        {/* Simulator Toggle */}
        <div className="bg-gray-800/90 backdrop-blur p-1 rounded-full inline-flex border border-gray-700 shadow-xl pointer-events-auto">
          <button 
            onClick={() => setSimulatedState('on')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${simulatedState === 'on' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
          >
            ON
          </button>
          <button 
            onClick={() => setSimulatedState('off')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${simulatedState === 'off' ? 'bg-gray-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
          >
            OFF
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes cba-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cba-flash {
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

        .cba-animate-spin { animation: cba-rotate 2s linear infinite; will-change: transform; display: inline-block; }
        .cba-animate-rotate { animation: cba-rotate 2s linear infinite; will-change: transform; display: inline-block; }
        .cba-animate-flash { animation: cba-flash 2s ease infinite; }
        .cba-animate-pulse { animation: cba-pulse 2s infinite; will-change: transform; }
        .cba-animate-jiggle { animation: cba-jiggle 0.3s ease infinite; will-change: transform; display: inline-block; }
        .cba-animate-shake { animation: cba-shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite; will-change: transform; }
        .cba-animate-bounce { animation: cba-bounce 1s infinite; will-change: transform; }
        .cba-animate-blink { animation: cba-blink 1s infinite; }
      `}</style>
    </div>
  );
};
