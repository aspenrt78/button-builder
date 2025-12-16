// Bubble Card Preview Component

import React from 'react';
import { BubbleButtonConfig, BubbleSubButton, BubbleConfig } from '../types';

// ============================================
// HELPER FUNCTIONS
// ============================================

// Helper to convert Hex to RGBA
function hexToRgba(hex: string, alpha: number): string {
  if (!hex || hex.length < 7) return 'transparent';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
}

function applyOpacityToColor(color: string, opacityPercent: number): string {
  if (!color) return color;
  const opacity = Math.max(0, Math.min(100, opacityPercent)) / 100;

  const hex = color.trim().match(/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/);
  if (hex) {
    const value = hex[1];
    const expand = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
    const r = parseInt(expand.slice(0, 2), 16);
    const g = parseInt(expand.slice(2, 4), 16);
    const b = parseInt(expand.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  const rgb = color.trim().match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    const parts = rgb[1].split(',').map((part) => part.trim()).slice(0, 3);
    if (parts.length === 3) {
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
    }
  }

  return color;
}

interface PreviewProps {
  config: BubbleConfig;
  simulatedState?: 'on' | 'off';
  onSimulatedStateChange?: (state: 'on' | 'off') => void;
}

// ============================================
// ICON COMPONENT (simplified MDI rendering)
// ============================================

function BubbleIcon({ icon, size = 24, color = 'currentColor' }: { icon?: string; size?: number; color?: string }) {
  // Map common icons to simple representations
  // In production, you'd use a proper icon library
  const iconName = icon?.replace('mdi:', '') || 'help';
  
  return (
    <div 
      className="flex items-center justify-center"
      style={{ width: size, height: size, color }}
    >
      {/* Use a placeholder for now - in real app would render actual MDI icons */}
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        {iconName === 'lightbulb' && (
          <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z" />
        )}
        {iconName === 'power' && (
          <path d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13V3Z" />
        )}
        {iconName === 'fan' && (
          <path d="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z" />
        )}
        {iconName === 'thermometer' && (
          <path d="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z" />
        )}
        {iconName === 'robot-vacuum' && (
          <path d="M12,2C14.65,2 17.19,3.06 19.07,4.93C20.94,6.81 22,9.35 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
        )}
        {(iconName === 'weather-partly-cloudy' || iconName === 'weather-partlycloudy') && (
          <path d="M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.5C18,19.54 15.64,22 12.5,22C10.23,22 8.32,20.75 7.21,18.9C5.87,19.3 4.5,19.2 3.4,18.6C1.29,17.45 0.32,14.87 1.5,12.76C2.24,11.5 3.5,10.8 4.84,10.7C4.95,8.07 7.06,5.96 9.69,5.85C10.1,5.47 10.5,5.1 10.96,4.79C11.13,4.67 11.31,4.56 11.5,4.46C11.68,4.37 11.87,4.28 12.06,4.2C12.25,4.13 12.44,4.07 12.64,4C12.83,3.97 13.03,3.94 13.23,3.93C13.42,3.9 13.62,3.9 13.82,3.9C15.72,3.9 17.4,4.96 18.3,6.5C19.61,6.5 20.7,7.13 21.42,8.05C22.5,9.4 22.5,11.3 21.42,12.65C20.7,13.57 19.61,14.2 18.3,14.2C18.3,14 18.3,13.8 18.3,13.6C18.3,12.46 17.96,11.42 17.38,10.53C17.69,8.95 17.35,7.28 16.35,5.96C15.26,4.54 13.58,3.9 11.95,4.05C12.23,4.18 12.5,4.32 12.74,5.47M6.5,11C4.5,11 3,12.5 3,14.5C3,16.5 4.5,18 6.5,18C7,18 7.41,17.9 7.79,17.71C7.36,16.87 7.1,15.94 7.03,14.95C6.31,14.85 5.7,14.36 5.35,13.69C5,13 5,12.2 5.35,11.5C5.7,10.8 6.31,10.3 7.03,10.2C7.27,10.15 7.5,10.13 7.73,10.13C7.74,10.13 7.75,10.13 7.76,10.13C7.54,10.41 7.34,10.71 7.17,11.03C6.93,11 6.72,11 6.5,11M9.74,9.74C9.27,10.21 8.9,10.76 8.65,11.35C8.4,11.94 8.27,12.58 8.27,13.24C8.27,13.9 8.4,14.54 8.65,15.13C8.9,15.72 9.27,16.27 9.74,16.74C10.21,17.21 10.76,17.58 11.35,17.83C11.94,18.08 12.58,18.21 13.24,18.21C13.9,18.21 14.54,18.08 15.13,17.83C15.72,17.58 16.27,17.21 16.74,16.74C17.21,16.27 17.58,15.72 17.83,15.13C18.08,14.54 18.21,13.9 18.21,13.24C18.21,12.58 18.08,11.94 17.83,11.35C17.58,10.76 17.21,10.21 16.74,9.74C16.27,9.27 15.72,8.9 15.13,8.65C14.54,8.4 13.9,8.27 13.24,8.27C12.58,8.27 11.94,8.4 11.35,8.65C10.76,8.9 10.21,9.27 9.74,9.74Z" />
        )}
        {iconName === 'weather-sunny' && (
          <path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" />
        )}
        {iconName === 'weather-cloudy' && (
          <path d="M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z" />
        )}
        {iconName === 'weather-rainy' && (
          <path d="M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59" />
        )}
        {/* Default icon */}
        {!['lightbulb', 'power', 'fan', 'thermometer', 'robot-vacuum', 'weather-partly-cloudy', 'weather-partlycloudy', 'weather-sunny', 'weather-cloudy', 'weather-rainy'].includes(iconName) && (
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
        )}
      </svg>
    </div>
  );
}

// ============================================
// SUB-BUTTON COMPONENT
// ============================================

const SubButtonPreview: React.FC<{ subButton: BubbleSubButton }> = ({ subButton }) => {
  const showBackground = subButton.show_background !== false;
  
  return (
    <div 
      className={`
        flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-xs pointer-events-none
        ${showBackground ? 'bg-white/10' : 'bg-transparent'}
      `}
    >
      {subButton.show_icon !== false && subButton.icon && (
        <BubbleIcon icon={subButton.icon} size={16} />
      )}
      {subButton.show_state && (
        <span className="text-white/80">75%</span>
      )}
      {subButton.show_name && subButton.name && (
        <span className="text-white/80">{subButton.name}</span>
      )}
      {subButton.show_attribute && (
        <span className="text-white/70">{subButton.attribute || 'attr'}</span>
      )}
      {/* Fallback if nothing is shown */}
      {!subButton.icon && !subButton.show_state && !subButton.show_name && !subButton.show_attribute && (
        <span className="text-white/50">•</span>
      )}
    </div>
  );
}

// ============================================
// MAIN PREVIEW COMPONENT
// ============================================

export function BubblePreview({ config, simulatedState = 'on', onSimulatedStateChange }: PreviewProps) {
  const cardType = config.card_type;
  
  // Type-safe access helper
  const cfg = config as any;
  
  // Common properties with safe access
  const hasSubButtons = cfg.sub_button && cfg.sub_button.length > 0;
  const isLarge = cfg.card_layout?.includes('large');
  const isTwoRows = cfg.card_layout === 'large-2-rows';
  const sliderValue = 75;
  const isOn = simulatedState === 'on';
  const isOff = !isOn;
  
  // Generate unique CSS ID for this preview instance (for scoped styling)
  const cssId = React.useMemo(() => `bubble-preview-${Math.random().toString(36).slice(2, 9)}`, []);
  
  // Toggle state on click
  const handleClick = () => {
    if (onSimulatedStateChange) {
      onSimulatedStateChange(simulatedState === 'on' ? 'off' : 'on');
    }
  };
  
  // ============================================
  // PARSE CUSTOM STYLES (if any)
  // ============================================
  // Parse the styles string to extract CSS variable values and other style properties
  const parsedStyles = React.useMemo(() => {
    if (!cfg.styles) return {};
    const styleMap: Record<string, any> = {};
    
    // Parse CSS variables (--bubble-xxx) and extract their VALUES
    // Take the LAST occurrence of each variable (later declarations override earlier ones)
    const varRegex = /(--bubble-[a-z-]+)\s*:\s*([^;}\n]+)/g;
    let match;
    while ((match = varRegex.exec(cfg.styles)) !== null) {
      const varName = match[1];
      const varValue = match[2].replace('!important', '').trim();
      // Overwrite any previous value - last one wins
      styleMap[varName] = varValue;
    }
    
    // Also extract common CSS properties from .bubble-button-card-container blocks
    const containerStyles = cfg.styles.match(/\.bubble-button-card-container\s*{([^}]+)}/);
    if (containerStyles) {
      const styleBlock = containerStyles[1];
      
      // Extract background (gradient or color)
      const bgMatch = styleBlock.match(/background\s*:\s*([^;!]+)/);
      if (bgMatch) {
        styleMap.containerBackground = bgMatch[1].trim();
      }
      
      // Extract border-radius
      const borderRadiusMatch = styleBlock.match(/border-radius\s*:\s*([^;!]+)/);
      if (borderRadiusMatch) {
        styleMap.containerBorderRadius = borderRadiusMatch[1].trim();
      }
      
      // Extract border
      const borderMatch = styleBlock.match(/border\s*:\s*([^;!]+)/);
      if (borderMatch) {
        styleMap.containerBorder = borderMatch[1].trim();
      }
      
      // Extract box-shadow
      const shadowMatch = styleBlock.match(/box-shadow\s*:\s*([^;!]+)/);
      if (shadowMatch) {
        styleMap.containerBoxShadow = shadowMatch[1].trim();
      }
    }
    
    // Extract text colors from .bubble-name and .bubble-icon
    const nameColorMatch = cfg.styles.match(/\.bubble-name\s*{[^}]*color\s*:\s*([^;!]+)/);
    if (nameColorMatch) {
      styleMap.nameColor = nameColorMatch[1].trim();
    }
    
    const iconColorMatch = cfg.styles.match(/\.bubble-icon\s*{[^}]*color\s*:\s*([^;!]+)/);
    if (iconColorMatch) {
      styleMap.iconColor = iconColorMatch[1].trim();
    }
    
    // Extract backdrop-filter from ha-card
    const backdropMatch = cfg.styles.match(/backdrop-filter\s*:\s*([^;!]+)/);
    if (backdropMatch) {
      styleMap.backdropFilter = backdropMatch[1].trim();
    }
    
    return styleMap;
  }, [cfg.styles]);
  
  // ============================================
  // RESOLVE COLORS & STYLES
  // ============================================
  // Priority: Parsed CSS from presets > Direct config property > Parsed CSS variable VALUE > Defaults
  // NO CSS INJECTION - everything is computed and applied as inline styles
  
  const defaultOnBg = 'rgba(255, 180, 50, 0.3)';
  const defaultOffBg = 'rgba(255, 255, 255, 0.1)';
  const defaultOnIconBg = 'rgba(255, 180, 50, 0.5)';
  const defaultOffIconBg = 'rgba(255, 255, 255, 0.1)';
  const defaultOnAccent = '#FFB432';
  const defaultOffAccent = 'rgba(255, 255, 255, 0.8)';
  
  // Resolve background color
  // Priority: Parsed container background > Direct gradient config > CSS variable > Defaults
  const actualBg = parsedStyles.containerBackground
    || cfg.background_gradient 
    || parsedStyles['--bubble-main-background-color']
    || (isOn ? defaultOnBg : defaultOffBg);
  
  // Debug logging
  React.useEffect(() => {
    console.log('Bubble Preview Debug:', {
      styles: cfg.styles,
      parsedStyles,
      actualBg,
      backgroundGradient: cfg.background_gradient,
      cssVar: parsedStyles['--bubble-main-background-color']
    });
  }, [cfg.styles, actualBg]);
  
  // Resolve accent color from CSS variable VALUE
  const actualAccent = parsedStyles['--bubble-accent-color'] || (isOn ? defaultOnAccent : defaultOffAccent);
  
  // Resolve icon background color from CSS variable VALUE
  const actualIconBg = parsedStyles['--bubble-icon-background-color'] || (isOn ? defaultOnIconBg : defaultOffIconBg);
  
  // Resolve border radius from CSS variable VALUE
  const actualBorderRadius = parsedStyles['--bubble-border-radius'] || '32px';
  
  // Resolve box shadow from CSS variable VALUE
  const actualBoxShadow = parsedStyles['--bubble-box-shadow'] || undefined;
  
  // Icon size and name weight
  const iconSize = cfg.icon_size || 24;
  const nameWeight = cfg.name_weight === 'bold' ? '700' : cfg.name_weight === 'normal' ? '400' : '600';
  
  // ============================================
  // ANIMATION LOGIC
  // ============================================
  const getAnimationClass = (type: string | undefined, trigger: string | undefined) => {
    if (!type || type === 'none') return '';
    const effectiveTrigger = trigger || 'always';
    if (effectiveTrigger === 'always') return `cba-animate-${type}`;
    if (effectiveTrigger === 'on' && isOn) return `cba-animate-${type}`;
    if (effectiveTrigger === 'off' && isOff) return `cba-animate-${type}`;
    return '';
  };
  
  const cardAnimationClass = getAnimationClass(cfg.card_animation, cfg.card_animation_trigger);
  const cardAnimationDuration = cfg.card_animation_speed || '2s';
  
  const iconAnimationClass = getAnimationClass(cfg.icon_animation_type, cfg.icon_animation_trigger);
  const iconAnimationDuration = cfg.icon_animation_speed || '2s';

  // ============================================
  // EMPTY COLUMN PREVIEW
  // ============================================
  if (cardType === 'empty-column') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-24 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
          <span className="text-gray-600 text-xs">Empty</span>
        </div>
        <div className="text-xs text-gray-500">empty-column • spacer</div>
      </div>
    );
  }

  // ============================================
  // SEPARATOR PREVIEW
  // ============================================
  if (cardType === 'separator') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div 
          className="w-80 overflow-hidden transition-all duration-300"
          style={{
            background: actualBg,
            borderRadius: actualBorderRadius,
            padding: '8px 16px',
            boxShadow: actualBoxShadow,
          }}
        >
          <div className="flex items-center gap-3">
            {cfg.icon && (
              <div 
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: actualIconBg }}
              >
                <BubbleIcon icon={cfg.icon} size={20} color={actualAccent} />
              </div>
            )}
            <div className="text-white/80 font-medium text-sm">
              {cfg.name || 'Section Name'}
            </div>
            <div className="flex-1 h-px bg-white/20" />
            {hasSubButtons && (
              <div className="flex gap-1 shrink-0">
                {cfg.sub_button.slice(0, 4).map((sb: BubbleSubButton, i: number) => (
                  <SubButtonPreview key={sb.id || i} subButton={sb} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          separator • section divider
          {hasSubButtons && ` • ${cfg.sub_button.length} sub-button${cfg.sub_button.length > 1 ? 's' : ''}`}
        </div>
      </div>
    );
  }

  // ============================================
  // POP-UP PREVIEW
  // ============================================
  if (cardType === 'pop-up') {
    const shadowOpacity = Number(cfg.shadow_opacity ?? 0);
    const opacityValue = Number(cfg.bg_opacity ?? 85);
    const blurValue = Number(cfg.bg_blur ?? 14);
    const hideBackdrop = cfg.hide_backdrop === true;
    
    // Resolve pop-up specific colors
    const popUpBgColor = parsedStyles['--bubble-pop-up-background-color'] || parsedStyles['--bubble-pop-up-main-background-color'];
    const popUpBackdropColor = parsedStyles['--bubble-backdrop-background-color'];
    const basePopUpBackground = popUpBackdropColor || popUpBgColor || actualBg || cfg.bg_color || 'rgba(30, 30, 30, 0.95)';
    const popupBackground = hideBackdrop ? 'transparent' : applyOpacityToColor(basePopUpBackground, opacityValue);
    const popupBlur = hideBackdrop ? 'none' : `blur(${blurValue}px)`;
    const popupShadow = actualBoxShadow || (shadowOpacity ? `0 20px 50px rgba(0,0,0,${shadowOpacity / 100})` : undefined);

    return (
      <div className="flex flex-col items-center gap-4">
        <div 
          className="relative w-80 rounded-3xl overflow-hidden border border-white/10"
          style={{
            background: popupBackground,
            backdropFilter: popupBlur,
            borderRadius: actualBorderRadius,
            boxShadow: popupShadow,
          }}
        >
          {cfg.badge_text && (
            <div className="absolute right-4 top-4 px-2 py-0.5 rounded-full text-[10px] font-semibold z-10"
              style={{ background: cfg.badge_color || 'rgba(255,255,255,0.15)', color: '#fff' }}>
              {cfg.badge_text}
            </div>
          )}
          {/* Pop-up Header */}
          <div className="p-4 flex items-center gap-3 border-b border-white/10">
            {cfg.icon && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: actualIconBg }}
              >
                <BubbleIcon icon={cfg.icon} size={24} color={actualAccent} />
              </div>
            )}
            <div className="flex-1">
              <div className="text-white font-medium">{cfg.name || 'Pop-up Title'}</div>
              <div className="text-white/50 text-xs">{cfg.hash || '#room'}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50">
              ✕
            </div>
          </div>
          {/* Pop-up Content Area */}
          <div className="p-4 min-h-32 flex items-center justify-center text-white/30 text-sm">
            Cards would appear here...
          </div>
          {cfg.footer_text && (
            <div className="px-4 pb-4 text-white/60 text-xs truncate">{cfg.footer_text}</div>
          )}
        </div>
        <div className="text-xs text-gray-500">
          pop-up • {cfg.hash || '#room'}
          {cfg.auto_close && ` • auto-close: ${cfg.auto_close}ms`}
        </div>
      </div>
    );
  }

  // ============================================
  // COVER PREVIEW
  // ============================================
  if (cardType === 'cover') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div 
          className="relative w-72 overflow-hidden p-4"
          style={{ 
            background: actualBg || 'rgba(255, 255, 255, 0.1)',
            borderRadius: actualBorderRadius || '24px',
            boxShadow: actualBoxShadow || undefined,
          }}
        >
          {cfg.badge_text && (
            <div className="absolute right-3 top-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: cfg.badge_color || 'rgba(255,255,255,0.15)', color: '#fff' }}>
              {cfg.badge_text}
            </div>
          )}
          <div className="flex items-center gap-3">
            {cfg.show_icon !== false && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: cfg.entity_picture && !cfg.force_icon ? 'transparent' : (iconBgColor || 'rgba(255, 255, 255, 0.1)') }}
              >
                {cfg.entity_picture && !cfg.force_icon ? (
                  <img src={cfg.entity_picture} alt="Entity" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <BubbleIcon icon={cfg.icon_open || 'mdi:blinds-open'} size={24} color={actualAccent || 'white'} />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {cfg.show_name !== false && (
                <div className="text-white font-medium text-sm truncate">
                  {cfg.name || 'Living Room Blinds'}
                </div>
              )}
              {cfg.show_state && <div className="text-white/60 text-xs">Open</div>}
            </div>
            {/* Cover Controls */}
            <div className="flex gap-1">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">▲</div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">■</div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">▼</div>
            </div>
          </div>
          {/* Position slider */}
          <div className="mt-3 relative h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-3/4 rounded-full bg-white/50" />
          </div>
          {cfg.footer_text && (
            <div className="mt-2 text-white/60 text-xs truncate">{cfg.footer_text}</div>
          )}
        </div>
        <div className="text-xs text-gray-500">cover • blinds/shades control</div>
      </div>
    );
  }

  // ============================================
  // MEDIA PLAYER PREVIEW
  // ============================================
  if (cardType === 'media-player') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div 
          className="relative w-80 overflow-hidden"
          style={{ 
            background: actualBg || (cfg.cover_background !== false 
              ? 'linear-gradient(135deg, rgba(50, 50, 80, 0.9), rgba(30, 30, 50, 0.9))' 
              : 'rgba(255, 255, 255, 0.1)'),
            borderRadius: actualBorderRadius || '24px',
            boxShadow: actualBoxShadow || undefined,
          }}
        >
          {cfg.badge_text && (
            <div className="absolute right-3 top-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: cfg.badge_color || 'rgba(255,255,255,0.15)', color: '#fff' }}>
              {cfg.badge_text}
            </div>
          )}
          <div className="p-4 flex items-center gap-3">
            {cfg.show_icon !== false && (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: cfg.entity_picture && !cfg.force_icon ? 'transparent' : (iconBgColor || 'rgba(255, 255, 255, 0.1)') }}
              >
                {cfg.entity_picture && !cfg.force_icon ? (
                  <img src={cfg.entity_picture} alt="Entity" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <BubbleIcon icon={cfg.icon || 'mdi:speaker'} size={28} color={actualAccent || 'white'} />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {cfg.show_name !== false && (
                <div className="text-white font-medium text-sm truncate">
                  {cfg.name || 'Media Player'}
                </div>
              )}
              <div className="text-white/60 text-xs truncate">Playing • Artist - Song</div>
            </div>
          </div>
          {/* Media Controls */}
          <div className="px-4 pb-4 flex items-center justify-center gap-4">
            {!cfg.hide?.previous_button && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">⏮</div>
            )}
            {!cfg.hide?.play_pause_button && (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">▶</div>
            )}
            {!cfg.hide?.next_button && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">⏭</div>
            )}
            {!cfg.hide?.volume_button && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">🔊</div>
            )}
          </div>
          {/* Volume slider */}
          <div className="px-4 pb-4">
            <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-3/5 rounded-full bg-white/50" />
            </div>
          </div>
          {cfg.footer_text && (
            <div className="px-4 pb-4 text-white/60 text-xs truncate">{cfg.footer_text}</div>
          )}
        </div>
        <div className="text-xs text-gray-500">media-player • streaming controls</div>
      </div>
    );
  }

  // ============================================
  // CLIMATE PREVIEW
  // ============================================
  if (cardType === 'climate') {
    const currentTemp = 22;
    const targetTemp = cfg.min_temp && cfg.max_temp ? ((cfg.min_temp + cfg.max_temp) / 2).toFixed(1) : '21';
    
    return (
      <div className="flex flex-col items-center gap-4">
        <div 
          className="relative w-72 overflow-hidden p-4"
          style={{ 
            background: actualBg || 'rgba(255, 140, 50, 0.2)',
            borderRadius: actualBorderRadius || '24px',
            boxShadow: actualBoxShadow || undefined,
          }}
        >
          {cfg.badge_text && (
            <div className="absolute right-3 top-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: cfg.badge_color || 'rgba(255,255,255,0.15)', color: '#fff' }}>
              {cfg.badge_text}
            </div>
          )}
          <div className="flex items-center gap-3">
            {cfg.show_icon !== false && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: cfg.entity_picture && !cfg.force_icon ? 'transparent' : (iconBgColor || 'rgba(255, 140, 50, 0.3)') }}
              >
                {cfg.entity_picture && !cfg.force_icon ? (
                  <img src={cfg.entity_picture} alt="Entity" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <BubbleIcon icon={cfg.icon || 'mdi:thermometer'} size={24} color={actualAccent || '#FF8C32'} />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {cfg.show_name !== false && (
                <div className="text-white font-medium text-sm">
                  {cfg.name || 'Thermostat'}
                </div>
              )}
              <div className="text-white/60 text-xs">Heating • {currentTemp}°C</div>
            </div>
            {/* Temperature Controls */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 text-lg">−</div>
              <div className="text-white font-bold text-xl">{targetTemp}°</div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 text-lg">+</div>
            </div>
          </div>
          {cfg.footer_text && (
            <div className="mt-2 text-white/60 text-xs truncate">{cfg.footer_text}</div>
          )}
        </div>
        <div className="text-xs text-gray-500">
          climate • {cfg.min_temp ?? 16}° - {cfg.max_temp ?? 30}° range
        </div>
      </div>
    );
  }

  // ============================================
  // SELECT PREVIEW
  // ============================================
  if (cardType === 'select') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div 
          className="w-64 overflow-hidden p-4"
          style={{ 
            background: actualBg || 'rgba(255, 255, 255, 0.1)',
            borderRadius: actualBorderRadius || '24px',
            boxShadow: actualBoxShadow || undefined,
          }}
        >
          <div className="flex items-center gap-3">
            {cfg.show_icon !== false && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: cfg.entity_picture && !cfg.force_icon ? 'transparent' : (iconBgColor || 'rgba(255, 255, 255, 0.1)') }}
              >
                {cfg.entity_picture && !cfg.force_icon ? (
                  <img src={cfg.entity_picture} alt="Entity" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <BubbleIcon icon={cfg.icon || 'mdi:format-list-bulleted'} size={24} color={actualAccent || 'white'} />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {cfg.show_name !== false && (
                <div className="text-white font-medium text-sm truncate">
                  {cfg.name || 'Select Mode'}
                </div>
              )}
              <div className="text-white/60 text-xs">Current: Option 1</div>
            </div>
            <div className="text-white/50">▼</div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          select • dropdown menu
          {cfg.scrolling_effect && ' • scrolling effect enabled'}
        </div>
      </div>
    );
  }

  // ============================================
  // CALENDAR PREVIEW
  // ============================================
  if (cardType === 'calendar') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div 
          className="w-80 overflow-hidden p-4"
          style={{ 
            background: actualBg || 'rgba(255, 255, 255, 0.1)',
            borderRadius: actualBorderRadius || '24px',
            boxShadow: actualBoxShadow || undefined,
          }}
        >
          <div className="space-y-2">
            {/* Event 1 */}
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
              <div className="w-1 h-8 rounded-full bg-blue-400" />
              <div className="flex-1">
                <div className="text-white text-sm font-medium">Team Meeting</div>
                <div className="text-white/50 text-xs">10:00 - 11:00</div>
              </div>
            </div>
            {/* Event 2 */}
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
              <div className="w-1 h-8 rounded-full bg-green-400" />
              <div className="flex-1">
                <div className="text-white text-sm font-medium">Lunch</div>
                <div className="text-white/50 text-xs">12:00 - 13:00</div>
              </div>
            </div>
            {/* Event 3 */}
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
              <div className="w-1 h-8 rounded-full bg-purple-400" />
              <div className="flex-1">
                <div className="text-white text-sm font-medium">Project Review</div>
                <div className="text-white/50 text-xs">14:00 - 15:30</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          calendar • {cfg.days ?? 7} days • max {cfg.limit ?? 5} events
        </div>
      </div>
    );
  }

  // ============================================
  // HORIZONTAL BUTTONS STACK PREVIEW
  // ============================================
  if (cardType === 'horizontal-buttons-stack') {
    const buttons = cfg.buttons || [
      { link: '#living', name: 'Living', icon: 'mdi:sofa' },
      { link: '#kitchen', name: 'Kitchen', icon: 'mdi:fridge' },
      { link: '#bedroom', name: 'Bedroom', icon: 'mdi:bed' },
    ];
    
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-md overflow-x-auto">
          <div className="flex gap-2 p-2">
            {buttons.map((btn: any, i: number) => (
              <div 
                key={i}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-white/10 flex items-center gap-2"
              >
                {btn.icon && <BubbleIcon icon={btn.icon} size={18} color="white" />}
                <span className="text-white text-sm whitespace-nowrap">{btn.name || btn.link}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          horizontal-buttons-stack • {buttons.length} buttons
        </div>
      </div>
    );
  }

  // ============================================
  // BUTTON PREVIEW (default)
  // ============================================
  const isSlider = cfg.button_type === 'slider';
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={`
          relative overflow-hidden transition-all duration-300 cursor-pointer
          ${isLarge ? 'w-80' : 'w-64'}
          ${isTwoRows ? 'min-h-28' : 'min-h-16'}
          ${cardAnimationClass}
        `}
        onClick={handleClick}
        style={{
          background: actualBg,
          borderRadius: parsedStyles.containerBorderRadius || actualBorderRadius,
          padding: '12px 16px',
          boxShadow: parsedStyles.containerBoxShadow || actualBoxShadow,
          border: parsedStyles.containerBorder,
          backdropFilter: parsedStyles.backdropFilter,
          filter: cfg.glow_effect ? `drop-shadow(0 0 12px ${cfg.glow_effect})` : undefined,
          animationDuration: cardAnimationClass ? cardAnimationDuration : undefined,
        }}
      >
        {cfg.ripple_effect && (
          <div className="absolute inset-0 pointer-events-none animate-pulse" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 45%)' }} />
        )}

        {cfg.badge_text && (
          <div className="absolute right-3 top-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: cfg.badge_color || 'rgba(255,255,255,0.15)', color: '#fff' }}>
            {cfg.badge_text}
          </div>
        )}

        <div className="flex items-center gap-3">
          {cfg.show_icon !== false && (
            <div 
              className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${iconAnimationClass}`}
              style={{ 
                backgroundColor: cfg.entity_picture && !cfg.force_icon ? 'transparent' : actualIconBg,
                animationDuration: iconAnimationClass ? iconAnimationDuration : undefined,
              }}
            >
              {cfg.entity_picture && !cfg.force_icon ? (
                <img 
                  src={cfg.entity_picture} 
                  alt="Entity" 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <BubbleIcon 
                  icon={cfg.icon || 'mdi:lightbulb'} 
                  size={iconSize} 
                  color={parsedStyles.iconColor || actualAccent} 
                />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {cfg.show_name !== false && (
              <div className="text-white font-medium text-sm truncate" style={{ 
                fontWeight: nameWeight as React.CSSProperties['fontWeight'],
                color: parsedStyles.nameColor || undefined,
              }}>
                {cfg.name || cfg.entity || 'Button Name'}
              </div>
            )}
            {(cfg.show_state || cfg.show_last_changed || cfg.show_attribute) && (
              <div className="text-white/60 text-xs truncate">
                {cfg.show_state && (simulatedState === 'on' ? 'On' : 'Off')}
                {cfg.show_attribute && cfg.attribute && ` • ${cfg.attribute}: 75%`}
                {cfg.show_last_changed && ' • 5 min ago'}
              </div>
            )}
          </div>
          {hasSubButtons && !isTwoRows && (
            <div className="flex gap-1 shrink-0">
              {cfg.sub_button.slice(0, 3).map((sb: BubbleSubButton, i: number) => (
                <SubButtonPreview key={sb.id || i} subButton={sb} />
              ))}
            </div>
          )}
        </div>
        {isSlider && (
          <div className="mt-3">
            <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full rounded-full transition-all"
                style={{ 
                  width: `${sliderValue}%`,
                  backgroundColor: actualAccent || (simulatedState === 'on' ? defaultOnAccent : 'rgba(255,255,255,0.5)'),
                }}
              />
            </div>
            {cfg.show_slider_value && (
              <div className="mt-1 text-right text-white/70 text-xs font-mono">{sliderValue}%</div>
            )}
          </div>
        )}
        {hasSubButtons && isTwoRows && (
          <div className="flex gap-1 mt-3 justify-end">
            {cfg.sub_button.map((sb: BubbleSubButton, i: number) => (
              <SubButtonPreview key={sb.id || i} subButton={sb} />
            ))}
          </div>
        )}
        {cfg.footer_text && (
          <div className="mt-2 text-white/60 text-xs truncate">{cfg.footer_text}</div>
        )}
      </div>
      <div className="text-xs text-gray-500">
        {cfg.button_type || 'switch'} button • {cfg.card_layout || 'normal'} layout
        {hasSubButtons && ` • ${cfg.sub_button.length} sub-button${cfg.sub_button.length > 1 ? 's' : ''}`}
      </div>
      <div className="flex gap-2">
        <span className="text-xs text-gray-400">Preview shows simulated "on" state</span>
      </div>
    </div>
  );
}

export default BubblePreview;
