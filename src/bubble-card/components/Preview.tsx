// Bubble Card Preview Component

import React from 'react';
import { BubbleButtonConfig, BubbleSubButton, BubbleConfig } from '../types';

interface PreviewProps {
  config: BubbleConfig;
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
        {/* Default icon */}
        {!['lightbulb', 'power', 'fan', 'thermometer', 'robot-vacuum'].includes(iconName) && (
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
        flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-xs
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

export function BubblePreview({ config }: PreviewProps) {
  const cardType = config.card_type;
  
  // Type-safe access helper
  const cfg = config as any;
  
  // Common properties with safe access
  const hasSubButtons = cfg.sub_button && cfg.sub_button.length > 0;
  const isLarge = cfg.card_layout?.includes('large');
  const isTwoRows = cfg.card_layout === 'large-2-rows';
  const simulatedState = 'on';
  const sliderValue = 75;
  
  // Parse custom styles and CSS variables
  const customStyles = React.useMemo(() => {
    if (!cfg.styles) return {};
    const styles: Record<string, string> = {};
    
    // Parse CSS variables (--bubble-xxx)
    const varRegex = /(--bubble-[a-z-]+)\s*:\s*([^;}\n]+)/g;
    let match;
    while ((match = varRegex.exec(cfg.styles)) !== null) {
      styles[match[1]] = match[2].trim();
    }
    
    // Also check for direct background property
    const bgMatch = cfg.styles.match(/background:\s*([^;}\n]+)/);
    if (bgMatch) styles.background = bgMatch[1].replace('!important', '').trim();
    
    return styles;
  }, [cfg.styles]);
  
  // Extract commonly used style values
  const bgColor = customStyles['--bubble-main-background-color'] || customStyles.background;
  const accentColor = customStyles['--bubble-accent-color'];
  const iconBgColor = customStyles['--bubble-icon-background-color'];
  const borderRadius = customStyles['--bubble-border-radius'];
  const boxShadow = customStyles['--bubble-box-shadow'];

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
            background: bgColor || 'transparent',
            borderRadius: borderRadius || '32px',
            padding: '8px 16px',
            boxShadow: boxShadow || undefined,
          }}
        >
          <div className="flex items-center gap-3">
            {cfg.icon && (
              <div 
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: iconBgColor || 'rgba(255, 255, 255, 0.1)' }}
              >
                <BubbleIcon icon={cfg.icon} size={20} color={accentColor || 'white'} />
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
    return (
      <div className="flex flex-col items-center gap-4">
        <div 
          className="w-80 rounded-3xl overflow-hidden border border-white/10"
          style={{
            background: bgColor || cfg.bg_color || 'rgba(30, 30, 30, 0.95)',
            backdropFilter: cfg.bg_blur ? `blur(${cfg.bg_blur}px)` : 'blur(14px)',
            borderRadius: borderRadius || '24px',
            boxShadow: boxShadow || undefined,
          }}
        >
          {/* Pop-up Header */}
          <div className="p-4 flex items-center gap-3 border-b border-white/10">
            {cfg.icon && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: iconBgColor || 'rgba(255, 255, 255, 0.1)' }}
              >
                <BubbleIcon icon={cfg.icon} size={24} color={accentColor || '#FFB432'} />
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
        </div>
        <div className="text-xs text-gray-500">
          pop-up • {cfg.hash || '#room'}
          {cfg.auto_close && ` • auto-close: ${cfg.auto_close}s`}
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
          className="w-72 overflow-hidden p-4"
          style={{ 
            background: bgColor || 'rgba(255, 255, 255, 0.1)',
            borderRadius: borderRadius || '24px',
            boxShadow: boxShadow || undefined,
          }}
        >
          <div className="flex items-center gap-3">
            {cfg.show_icon !== false && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: iconBgColor || 'rgba(255, 255, 255, 0.1)' }}
              >
                <BubbleIcon icon={cfg.icon_open || 'mdi:blinds-open'} size={24} color={accentColor || 'white'} />
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
          className="w-80 overflow-hidden"
          style={{ 
            background: bgColor || (cfg.cover_background !== false 
              ? 'linear-gradient(135deg, rgba(50, 50, 80, 0.9), rgba(30, 30, 50, 0.9))' 
              : 'rgba(255, 255, 255, 0.1)'),
            borderRadius: borderRadius || '24px',
            boxShadow: boxShadow || undefined,
          }}
        >
          <div className="p-4 flex items-center gap-3">
            {cfg.show_icon !== false && (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: iconBgColor || 'rgba(255, 255, 255, 0.1)' }}
              >
                <BubbleIcon icon={cfg.icon || 'mdi:speaker'} size={28} color={accentColor || 'white'} />
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
          className="w-72 overflow-hidden p-4"
          style={{ 
            background: bgColor || 'rgba(255, 140, 50, 0.2)',
            borderRadius: borderRadius || '24px',
            boxShadow: boxShadow || undefined,
          }}
        >
          <div className="flex items-center gap-3">
            {cfg.show_icon !== false && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: iconBgColor || 'rgba(255, 140, 50, 0.3)' }}
              >
                <BubbleIcon icon={cfg.icon || 'mdi:thermometer'} size={24} color={accentColor || '#FF8C32'} />
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
            background: bgColor || 'rgba(255, 255, 255, 0.1)',
            borderRadius: borderRadius || '24px',
            boxShadow: boxShadow || undefined,
          }}
        >
          <div className="flex items-center gap-3">
            {cfg.show_icon !== false && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: iconBgColor || 'rgba(255, 255, 255, 0.1)' }}
              >
                <BubbleIcon icon={cfg.icon || 'mdi:format-list-bulleted'} size={24} color={accentColor || 'white'} />
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
        <div className="text-xs text-gray-500">select • dropdown menu</div>
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
            background: bgColor || 'rgba(255, 255, 255, 0.1)',
            borderRadius: borderRadius || '24px',
            boxShadow: boxShadow || undefined,
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
  const defaultOnBg = 'rgba(255, 180, 50, 0.3)';
  const defaultOffBg = 'rgba(255, 255, 255, 0.1)';
  const defaultOnIconBg = 'rgba(255, 180, 50, 0.5)';
  const defaultOnAccent = '#FFB432';
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={`
          relative overflow-hidden transition-all duration-300
          ${isLarge ? 'w-80' : 'w-64'}
          ${isTwoRows ? 'min-h-28' : 'min-h-16'}
        `}
        style={{
          background: bgColor || (simulatedState === 'on' ? defaultOnBg : defaultOffBg),
          borderRadius: borderRadius || '32px',
          padding: '12px 16px',
          boxShadow: boxShadow || undefined,
        }}
      >
        <div className="flex items-center gap-3">
          {cfg.show_icon !== false && (
            <div 
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: iconBgColor || (simulatedState === 'on' ? defaultOnIconBg : 'rgba(255, 255, 255, 0.1)'),
              }}
            >
              <BubbleIcon 
                icon={cfg.icon || 'mdi:lightbulb'} 
                size={24} 
                color={accentColor || (simulatedState === 'on' ? defaultOnAccent : 'white')} 
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {cfg.show_name !== false && (
              <div className="text-white font-medium text-sm truncate">
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
          <div className="mt-3 relative h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{ 
                width: `${sliderValue}%`,
                backgroundColor: accentColor || (simulatedState === 'on' ? defaultOnAccent : 'rgba(255,255,255,0.5)'),
              }}
            />
          </div>
        )}
        {hasSubButtons && isTwoRows && (
          <div className="flex gap-1 mt-3 justify-end">
            {cfg.sub_button.map((sb: BubbleSubButton, i: number) => (
              <SubButtonPreview key={sb.id || i} subButton={sb} />
            ))}
          </div>
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
