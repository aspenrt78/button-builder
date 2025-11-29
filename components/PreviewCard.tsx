
import React, { useState, useEffect, useRef } from 'react';
import { Palette, User, HelpCircle, Lock, Loader2, Settings2, Grid3X3, LayoutDashboard, RefreshCw, Upload, X, Image } from 'lucide-react';
import { ButtonConfig, AnimationType, AnimationTrigger } from '../types';
import { getIconComponent } from '../services/iconMapper';
import { isInHomeAssistant, fetchAllDashboardConfigs, DashboardConfig, DashboardGridConfig, parseBackgroundToCss } from '../services/dashboardService';

interface Props {
  config: ButtonConfig;
}

// Dashboard layout presets matching common HA configurations
const DASHBOARD_PRESETS = [
  { name: 'Masonry (Default)', columns: 4, cardWidth: 100, cardHeight: 100, gap: 8 },
  { name: 'Masonry Wide', columns: 6, cardWidth: 85, cardHeight: 85, gap: 8 },
  { name: 'Sections', columns: 4, cardWidth: 95, cardHeight: 75, gap: 4 },
  { name: 'Panel', columns: 1, cardWidth: 200, cardHeight: 120, gap: 16 },
  { name: 'Sidebar', columns: 2, cardWidth: 110, cardHeight: 90, gap: 8 },
  { name: 'Mobile', columns: 2, cardWidth: 85, cardHeight: 85, gap: 6 },
  { name: 'Custom', columns: 4, cardWidth: 100, cardHeight: 100, gap: 8 },
];

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

// Helper to parse extraStyles string into a React CSSProperties object
const parseExtraStyles = (extraStyles: string): React.CSSProperties => {
  if (!extraStyles) return {};
  
  const result: Record<string, string> = {};
  
  // Split by newlines and process each line
  const lines = extraStyles.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
    
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    
    const property = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();
    
    // Remove trailing semicolon if present
    if (value.endsWith(';')) {
      value = value.slice(0, -1).trim();
    }
    
    // Convert CSS property to camelCase for React
    const camelCase = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelCase] = value;
  }
  
  return result as React.CSSProperties;
};

const IconMapper = ({ name, size, color, animationClass, animationDuration, containerSize }: { name: string, size: string, color: string, animationClass: string, animationDuration: string, containerSize?: number }) => {
  // Handle percentage-based sizing by calculating actual pixel size
  let computedSize = size;
  if (size.endsWith('%') && containerSize) {
    const percentage = parseFloat(size) / 100;
    computedSize = `${Math.round(containerSize * percentage)}px`;
  }
  
  const style = { width: computedSize, height: computedSize, color };
  const IconComponent = getIconComponent(name) ?? HelpCircle;
  const spanStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 0,
    animationDuration: animationClass ? animationDuration : undefined,
  };

  return (
    <span className={animationClass} style={spanStyle}>
      <IconComponent style={style} />
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
  const [canvasBackground, setCanvasBackground] = useState<string | null>(null);
  const [showCanvasPicker, setShowCanvasPicker] = useState(false);
  const [showLayoutSettings, setShowLayoutSettings] = useState(false);
  
  // Dashboard backgrounds from HA
  const [dashboardConfigs, setDashboardConfigs] = useState<DashboardConfig[]>([]);
  const [loadingDashboards, setLoadingDashboards] = useState(false);
  const [dashboardsLoaded, setDashboardsLoaded] = useState(false);
  const [isHA, setIsHA] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);
  
  // Dashboard layout settings
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [cardWidth, setCardWidth] = useState(100);
  const [cardHeight, setCardHeight] = useState(100);
  const [gridGap, setGridGap] = useState(8);
  const [showGrid, setShowGrid] = useState(false);
  
  // Custom background image upload
  const [customBackgroundName, setCustomBackgroundName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file upload for custom background
  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setCanvasBackground(`url(${dataUrl})`);
        setCustomBackgroundName(file.name);
        setSelectedDashboard(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Clear custom background
  const clearCustomBackground = () => {
    setCanvasBackground(null);
    setCustomBackgroundName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if we're in HA on mount
  useEffect(() => {
    setIsHA(isInHomeAssistant());
  }, []);

  // Load dashboard backgrounds when picker is opened
  const loadDashboardConfigs = async () => {
    if (loadingDashboards || dashboardsLoaded) return;
    
    setLoadingDashboards(true);
    try {
      const configs = await fetchAllDashboardConfigs();
      setDashboardConfigs(configs);
      setDashboardsLoaded(true);
    } catch (error) {
      console.error('Failed to load dashboard configs:', error);
    } finally {
      setLoadingDashboards(false);
    }
  };

  // Apply dashboard config (background + grid)
  const applyDashboardConfig = (db: DashboardConfig) => {
    setSelectedDashboard(db.dashboardId);
    
    // Apply background if available
    if (db.background) {
      setCanvasBackground(db.background);
    }
    
    // Apply grid settings
    if (db.grid) {
      // Calculate card size based on grid type and columns
      const columns = db.grid.columns || 4;
      const gridType = db.grid.type;
      
      // Base canvas size approximation (typical HA sidebar view)
      // We'll use reasonable defaults that match HA's default layouts
      let newCardWidth: number;
      let newCardHeight: number;
      
      if (gridType === 'sections') {
        // Sections view uses card_size for height calculation
        const cardSize = db.grid.cardSize || 75;
        newCardWidth = Math.round(300 / columns * 1.5);
        newCardHeight = cardSize;
      } else if (gridType === 'panel') {
        // Panel view - full width card
        newCardWidth = 200;
        newCardHeight = 150;
      } else {
        // Masonry (default) - calculate based on column count
        // Typical masonry card widths in HA are ~300px at 4 columns
        newCardWidth = Math.round(280 / (columns / 4));
        newCardHeight = Math.round(newCardWidth * 0.85); // Slightly shorter than square
      }
      
      // Clamp values to reasonable ranges
      setCardWidth(Math.max(60, Math.min(200, newCardWidth)));
      setCardHeight(Math.max(60, Math.min(200, newCardHeight)));
      
      // Set gap based on dense mode
      setGridGap(db.grid.dense ? 4 : 8);
    }
  };

  // Clear dashboard selection
  const clearDashboardSelection = () => {
    setSelectedDashboard(null);
    setCanvasBackground(null);
    setCustomBackgroundName(null);
  };

  // Refresh dashboards
  const refreshDashboards = async () => {
    setDashboardsLoaded(false);
    setDashboardConfigs([]);
    await loadDashboardConfigs();
  };

  // Load custom font when customFontUrl changes
  useEffect(() => {
    if (config.customFontName && config.customFontUrl) {
      const fontUrl = config.customFontUrl.trim();
      const linkId = 'custom-font-link';
      
      // Remove existing link
      const existing = document.getElementById(linkId);
      if (existing) existing.remove();
      
      // Create new link element
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      
      // Handle both full URLs and @import statements
      if (fontUrl.startsWith('@import')) {
        // Convert @import to link
        const urlMatch = fontUrl.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch) {
          link.href = urlMatch[1];
        }
      } else {
        link.href = fontUrl;
      }
      
      document.head.appendChild(link);
      
      return () => {
        const el = document.getElementById(linkId);
        if (el) el.remove();
      };
    }
  }, [config.customFontName, config.customFontUrl]);

  // Apply preset
  const applyPreset = (index: number) => {
    setSelectedPreset(index);
    if (index < DASHBOARD_PRESETS.length - 1) { // Not "Custom"
      const preset = DASHBOARD_PRESETS[index];
      setCardWidth(preset.cardWidth);
      setCardHeight(preset.cardHeight);
      setGridGap(preset.gap);
    }
  };

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

  // 2. Resolve Colors - Auto flag should use simulated entity color when ON
  const actualIconColor = resolveColor(
    config.iconColor, 
    config.iconColorAuto, 
    config.color || '#ffffff', 
    isOn // Use simulated color when iconColorAuto is true AND state is ON
  );
  
  const actualNameColor = resolveColor(config.nameColor, config.nameColorAuto, config.color || '#ffffff', isOn);
  const actualStateColor = resolveColor(config.stateColor, config.stateColorAuto, config.color || '#ffffff', isOn);
  const actualLabelColor = resolveColor(config.labelColor, config.labelColorAuto, config.color || '#ffffff', isOn);
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
  // Include rotate flag (same as spin)
  const iconAnimationClass = [(config.spin || config.rotate) ? 'cba-animate-spin' : '', iconAnimationFromSelect]
    .filter(Boolean)
    .join(' ');
  const iconAnimationDuration = ((config.spin || config.rotate) ? config.spinDuration : config.iconAnimationSpeed) || '2s';

  // Marquee Logic: If marquee is active and valid
  const isMarquee = config.cardAnimation === 'marquee' && 
                    ((config.cardAnimationTrigger === 'always') ||
                     (config.cardAnimationTrigger === 'on' && isOn) ||
                     (config.cardAnimationTrigger === 'off' && isOff));

  // 5. Shadow Logic
  const shadowStyle = getShadowStyle(config.shadowSize, config.shadowColor, config.shadowOpacity);

  // 6. Parse extra styles
  const extraStylesParsed = parseExtraStyles(config.extraStyles);

  // 7. Gradient Background
  const getGradientBackground = () => {
    if (!config.gradientEnabled) return undefined;
    
    const colors = config.gradientColor3Enabled 
      ? `${config.gradientColor1}, ${config.gradientColor2}, ${config.gradientColor3}`
      : `${config.gradientColor1}, ${config.gradientColor2}`;
    
    switch (config.gradientType) {
      case 'linear':
        return `linear-gradient(${config.gradientAngle}deg, ${colors})`;
      case 'radial':
        return `radial-gradient(circle, ${colors})`;
      case 'conic':
        return `conic-gradient(from ${config.gradientAngle}deg, ${colors}, ${config.gradientColor1})`;
      default:
        return undefined;
    }
  };

  const gradientBg = getGradientBackground();
  
  // Check if extraStyles has a background property to avoid React warning about conflicting styles
  const hasExtraBackground = 'background' in extraStylesParsed || 'backgroundImage' in extraStylesParsed;

  const containerStyle: React.CSSProperties = {
    // Only set backgroundColor if no gradient and no extraStyles background
    ...((!gradientBg && !hasExtraBackground) ? { backgroundColor: actualBg } : {}),
    // Only set background if gradient is enabled
    ...(gradientBg ? { background: gradientBg } : {}),
    color: config.color || '#ffffff',  // Default text color, overridden by individual element colors
    borderRadius: config.borderRadius,
    padding: config.padding,
    height: config.aspectRatio ? 'auto' : (config.height === 'auto' ? 'auto' : config.height),
    width: '100%',  // Fill the container (controlled by wrapper)
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
    fontFamily: (config.customFontName && config.customFontUrl) 
      ? `'${config.customFontName}', sans-serif` 
      : (config.fontFamily || 'inherit'),
    fontSize: config.fontSize,
    fontWeight: config.fontWeight,
    textTransform: config.textTransform,
    letterSpacing: config.letterSpacing,
    lineHeight: config.lineHeight,
    border: borderStyle,
    position: 'relative',
    zIndex: 1,
    overflow: isMarquee ? 'hidden' : 'visible', // Only hide overflow for marquee mask
    opacity: Math.min(100, Math.max(0, config.cardOpacity)) / 100,
    animationDuration: cardAnimationClass ? cardAnimationDuration : undefined,
    // Apply extra styles LAST so they can override defaults
    ...extraStylesParsed,
  };

  // Calculate canvas style - support both color and background image
  const canvasStyle: React.CSSProperties = canvasBackground 
    ? { ...parseBackgroundToCss(canvasBackground), backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: canvasColor };

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center transition-all duration-500"
      style={canvasStyle}
    >
      {/* Grid Overlay (when enabled) */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #666 1px, transparent 1px),
              linear-gradient(to bottom, #666 1px, transparent 1px)
            `,
            backgroundSize: `${cardWidth + gridGap}px ${cardHeight + gridGap}px`,
            backgroundPosition: 'center center',
          }}
        />
      )}

      {/* Canvas Controls */}
      <div className="absolute top-3 right-3 z-50 flex gap-2">
        {/* Dashboard Layout Settings */}
        <div className="relative">
          <button 
            onClick={() => { setShowLayoutSettings(!showLayoutSettings); setShowCanvasPicker(false); }}
            className={`p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 shadow-lg backdrop-blur transition-colors ${showLayoutSettings ? 'bg-gray-700 text-white' : ''}`}
            title="Dashboard Layout Settings"
          >
            <Grid3X3 size={16} />
          </button>
          {showLayoutSettings && (
            <div className="absolute top-10 right-0 bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-2xl w-64 animate-in slide-in-from-top-2">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Dashboard Layout</p>
              
              {/* Preset Selector */}
              <div className="mb-3">
                <select
                  value={selectedPreset}
                  onChange={(e) => applyPreset(Number(e.target.value))}
                  disabled={!!selectedDashboard}
                  className={`w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white ${selectedDashboard ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {DASHBOARD_PRESETS.map((preset, i) => (
                    <option key={preset.name} value={i}>{preset.name}</option>
                  ))}
                </select>
              </div>

              {/* Custom Size Controls */}
              <div className={`space-y-2 ${selectedDashboard ? 'opacity-50' : ''}`}>
                {selectedDashboard && (
                  <p className="text-[9px] text-amber-500/80 mb-1">
                    Locked by dashboard preset
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-gray-400 w-16">Width</label>
                  <input
                    type="range"
                    min="60"
                    max="250"
                    value={cardWidth}
                    disabled={!!selectedDashboard}
                    onChange={(e) => { setCardWidth(Number(e.target.value)); setSelectedPreset(DASHBOARD_PRESETS.length - 1); }}
                    className={`flex-1 h-1 bg-gray-700 rounded-lg appearance-none ${selectedDashboard ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  />
                  <span className="text-[10px] text-gray-300 w-10 text-right">{cardWidth}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-gray-400 w-16">Height</label>
                  <input
                    type="range"
                    min="60"
                    max="250"
                    value={cardHeight}
                    disabled={!!selectedDashboard}
                    onChange={(e) => { setCardHeight(Number(e.target.value)); setSelectedPreset(DASHBOARD_PRESETS.length - 1); }}
                    className={`flex-1 h-1 bg-gray-700 rounded-lg appearance-none ${selectedDashboard ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  />
                  <span className="text-[10px] text-gray-300 w-10 text-right">{cardHeight}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-gray-400 w-16">Gap</label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={gridGap}
                    disabled={!!selectedDashboard}
                    onChange={(e) => { setGridGap(Number(e.target.value)); setSelectedPreset(DASHBOARD_PRESETS.length - 1); }}
                    className={`flex-1 h-1 bg-gray-700 rounded-lg appearance-none ${selectedDashboard ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  />
                  <span className="text-[10px] text-gray-300 w-10 text-right">{gridGap}px</span>
                </div>
              </div>

              {/* Show Grid Toggle */}
              <label className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="w-3 h-3 rounded bg-gray-700 border-gray-600"
                />
                <span className="text-[10px] text-gray-400">Show grid overlay</span>
              </label>
            </div>
          )}
        </div>

        {/* Canvas Color Picker */}
        <div className="relative">
           <button 
             onClick={() => { 
               setShowCanvasPicker(!showCanvasPicker); 
               setShowLayoutSettings(false);
               // Load dashboards when opening picker
               if (!showCanvasPicker && isHA) {
                 loadDashboardConfigs();
               }
             }}
             className={`p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 shadow-lg backdrop-blur transition-colors ${showCanvasPicker ? 'bg-gray-700 text-white' : ''}`}
             title="Change Canvas Backdrop"
           >
             <Palette size={16} />
           </button>
           {showCanvasPicker && (
             <div className="absolute top-10 right-0 bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-2xl w-64 animate-in slide-in-from-top-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Preview Backdrop</p>
                
                {/* Solid Colors */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                   {['#0a0a0a', '#1a1a2e', '#ffffff', '#1e3a5f'].map(c => (
                     <button 
                       key={c} 
                       className={`w-8 h-8 rounded-full border shadow-sm transition-all ${canvasColor === c && !canvasBackground ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-600 hover:border-gray-500'}`}
                       style={{ backgroundColor: c }}
                       onClick={() => { setCanvasColor(c); setCanvasBackground(null); setCustomBackgroundName(null); }}
                       title={c}
                     />
                   ))}
                </div>
                <input 
                   type="color" 
                   value={canvasColor || '#0a0a0a'}
                   onChange={(e) => { setCanvasColor(e.target.value); setCanvasBackground(null); setCustomBackgroundName(null); }}
                   className="w-full h-8 rounded cursor-pointer mb-3"
                />

                {/* Custom Background Upload */}
                <div className="border-t border-gray-800 pt-3 mt-3">
                  <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1 mb-2">
                    <Image size={12} />
                    Custom Background
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="hidden"
                    id="background-upload"
                  />
                  
                  {!customBackgroundName ? (
                    <label
                      htmlFor="background-upload"
                      className="flex items-center justify-center gap-2 w-full px-3 py-2 border border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-800/50 transition-colors"
                    >
                      <Upload size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-400">Upload image</span>
                    </label>
                  ) : (
                    <div className="flex items-center gap-2 px-2 py-2 bg-gray-800 rounded-lg">
                      <div 
                        className="w-8 h-8 rounded border border-gray-600 shrink-0 bg-cover bg-center"
                        style={canvasBackground ? parseBackgroundToCss(canvasBackground) : {}}
                      />
                      <span className="text-xs text-gray-300 truncate flex-1">{customBackgroundName}</span>
                      <button
                        onClick={clearCustomBackground}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        title="Remove background"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  <p className="text-[9px] text-gray-500 mt-1">
                    Upload your dashboard background image
                  </p>
                </div>

                {/* Dashboard Backgrounds Section */}
                {isHA && (
                  <div className="border-t border-gray-800 pt-3 mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                        <LayoutDashboard size={12} />
                        Dashboard Presets
                      </p>
                      <button
                        onClick={refreshDashboards}
                        disabled={loadingDashboards}
                        className="p-1 text-gray-500 hover:text-gray-300 disabled:opacity-50"
                        title="Refresh dashboards"
                      >
                        <RefreshCw size={12} className={loadingDashboards ? 'animate-spin' : ''} />
                      </button>
                    </div>
                    
                    <p className="text-[9px] text-gray-500 mb-2">
                      Apply dashboard background & grid sizing
                    </p>
                    
                    {loadingDashboards && (
                      <div className="flex items-center justify-center py-4 text-gray-500">
                        <Loader2 size={16} className="animate-spin mr-2" />
                        <span className="text-xs">Loading dashboards...</span>
                      </div>
                    )}
                    
                    {!loadingDashboards && dashboardConfigs.length === 0 && dashboardsLoaded && (
                      <p className="text-[10px] text-gray-500 text-center py-2">
                        No dashboards found
                      </p>
                    )}
                    
                    {!loadingDashboards && dashboardConfigs.length > 0 && (
                      <div className="space-y-1">
                        {dashboardConfigs.map((db) => (
                          <button
                            key={db.dashboardId}
                            onClick={() => applyDashboardConfig(db)}
                            className={`w-full flex items-center gap-2 px-2 py-2 rounded text-left transition-colors ${
                              selectedDashboard === db.dashboardId 
                                ? 'bg-blue-600/20 border border-blue-500/50' 
                                : 'hover:bg-gray-800 border border-transparent'
                            }`}
                          >
                            {/* Background Preview */}
                            <div 
                              className="w-8 h-8 rounded border border-gray-600 shrink-0"
                              style={db.background ? parseBackgroundToCss(db.background) : { backgroundColor: '#333' }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-white truncate">{db.title}</p>
                              <p className="text-[9px] text-gray-500 truncate">
                                {db.grid.type}{db.grid.columns ? ` · ${db.grid.columns} cols` : ''}
                                {db.background ? ' · bg' : ''}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Clear dashboard selection */}
                    {selectedDashboard && (
                      <button
                        onClick={clearDashboardSelection}
                        className="w-full mt-2 px-2 py-1.5 text-[10px] text-gray-400 hover:text-white border border-gray-700 rounded hover:bg-gray-800 transition-colors"
                      >
                        Clear dashboard preset
                      </button>
                    )}
                  </div>
                )}

                {/* Not in HA message */}
                {!isHA && (
                  <div className="border-t border-gray-800 pt-3 mt-3">
                    <p className="text-[10px] text-gray-500 text-center">
                      <LayoutDashboard size={12} className="inline mr-1" />
                      Dashboard presets available when running in Home Assistant
                    </p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      {/* The Card Preview - Centered */}
      <div 
        className="relative flex justify-center items-center z-10 transition-all duration-300" 
        style={{ width: `${cardWidth}px`, height: config.aspectRatio ? 'auto' : `${cardHeight}px` }}
      >
        {/* Marquee Background Layer (Simulates rotating border) */}
        {isMarquee && (
          <div className="absolute -inset-[4px] overflow-hidden cba-animate-spin z-0" style={{ borderRadius: config.borderRadius === '50%' ? '50%' : `calc(${config.borderRadius} + 4px)` }}>
             <div className="w-full h-full" style={{
               background: `conic-gradient(transparent 20%, ${actualBorderColor || SIMULATED_ENTITY_COLOR})`,
               filter: 'blur(4px)'
             }}></div>
          </div>
        )}

        {/* Main Card */}
        <div 
          style={containerStyle}
          className={`hover:brightness-110 ${config.aspectRatio ? '' : 'w-full'} ${cardAnimationClass} group`}
          onClick={() => setSimulatedState(s => s === 'on' ? 'off' : 'on')}
          title={config.tooltip.enabled ? config.tooltip.content : undefined}
        >
           {/* Tooltip */}
           {config.tooltip.enabled && config.tooltip.content && (
             <div className={`absolute z-50 px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
               config.tooltip.position === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' :
               config.tooltip.position === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' :
               config.tooltip.position === 'right' ? 'left-full ml-2 top-1/2 -translate-y-1/2' :
               'bottom-full mb-2 left-1/2 -translate-x-1/2' /* top (default) */
             }`}>
               {config.tooltip.content}
             </div>
           )}

           {/* Marquee Inner Cover to create border effect (Only if marquee is on) */}
           {isMarquee && (
             <div className="absolute inset-[2px] z-[-1]" style={{ 
               borderRadius: config.borderRadius,
               backgroundColor: actualBg
             }}></div>
           )}

          {/* Icon / Entity Picture */}
          {(config.showIcon || config.showEntityPicture) && (
            <div style={{ gridArea: 'i', ...parseExtraStyles(config.imgCellStyles) }} className="flex justify-center items-center w-full h-full relative">
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
                    containerSize={cardWidth}
                  />
                )
              )}
            </div>
          )}
          
          {config.showName && (
            <div style={{ gridArea: 'n', color: actualNameColor }} className="text-center truncate w-full px-1">
              {config.name}
            </div>
          )}

          {config.showState && (
            <div style={{ gridArea: 's', color: actualStateColor, opacity: 0.8, fontSize: '0.85em' }} className="text-center flex items-center justify-center gap-1">
              <span>{config.stateDisplay || simulatedState.toUpperCase()}</span>
              {config.showUnits && config.units && (
                <span className="opacity-70">{config.units}</span>
              )}
            </div>
          )}

          {config.showLabel && (
            <div style={{ gridArea: 'l', color: actualLabelColor, opacity: 0.7, fontSize: '0.8em' }} className="text-center px-1 truncate w-full">
              {config.label || 'Label Text'}
            </div>
          )}

          {/* Custom Fields */}
          {config.customFields.length > 0 && (
            <div className="absolute bottom-1 right-1 text-[8px] text-gray-400 opacity-50">
              +{config.customFields.length} field{config.customFields.length > 1 ? 's' : ''}
            </div>
          )}

          {/* Spinner Overlay */}
          {config.spinner && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-inherit z-10">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {/* Lock Overlay */}
          {config.lock.enabled && (
            <div className="absolute top-1 right-1 z-10">
              <Lock size={14} className="text-white/70" />
            </div>
          )}

          {/* Ripple Effect Indicator */}
          {config.showRipple && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
              <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors" />
            </div>
          )}
        </div>

        {/* Hidden Indicator */}
        {config.hidden && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-20">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Hidden</span>
          </div>
        )}

        {config.showLastChanged && (
           <div className="absolute -bottom-6 text-[10px] text-gray-500 font-mono">
             Last changed: 5 min ago
           </div>
        )}
      </div>

      {/* Controls Overlay - Positioned at bottom */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none">

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
        @keyframes cba-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes cba-breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.9; }
        }
        @keyframes cba-ripple {
          0% { box-shadow: 0 0 0 0 currentColor; }
          100% { box-shadow: 0 0 0 20px transparent; }
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

        .cba-animate-spin { animation: cba-rotate 2s linear infinite; will-change: transform; display: inline-block; }
        .cba-animate-flash { animation: cba-flash 2s ease infinite; }
        .cba-animate-pulse { animation: cba-pulse 2s infinite; will-change: transform; }
        .cba-animate-jiggle { animation: cba-jiggle 0.3s ease infinite; will-change: transform; display: inline-block; }
        .cba-animate-shake { animation: cba-shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite; will-change: transform; }
        .cba-animate-bounce { animation: cba-bounce 1s infinite; will-change: transform; }
        .cba-animate-blink { animation: cba-blink 1s infinite; }
        .cba-animate-glow { animation: cba-glow 2s ease-in-out infinite; }
        .cba-animate-swing { animation: cba-swing 1s ease-in-out infinite; will-change: transform; display: inline-block; transform-origin: top center; }
        .cba-animate-heartbeat { animation: cba-heartbeat 1.5s ease-in-out infinite; will-change: transform; }
        .cba-animate-rubber { animation: cba-rubber 1s ease infinite; will-change: transform; }
        .cba-animate-rubberBand { animation: cba-rubber 1s ease infinite; will-change: transform; }
        .cba-animate-fade { animation: cba-fade 2s ease-in-out infinite; }
        .cba-animate-float { animation: cba-float 2s ease-in-out infinite; will-change: transform; }
        .cba-animate-breathe { animation: cba-breathe 3s ease-in-out infinite; }
        .cba-animate-ripple { animation: cba-ripple 1.5s ease-out infinite; }
        .cba-animate-slide-up { animation: cba-slide-up 1s ease infinite; will-change: transform; }
        .cba-animate-slide-down { animation: cba-slide-down 1s ease infinite; will-change: transform; }
        .cba-animate-tada { animation: cba-tada 1s ease infinite; will-change: transform; }
        .cba-animate-wobble { animation: cba-wobble 1s ease infinite; will-change: transform; }
        .cba-animate-flip { animation: cba-flip 2s ease infinite; will-change: transform; }
      `}</style>
    </div>
  );
};
