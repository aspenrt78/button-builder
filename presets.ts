import { ButtonConfig, DEFAULT_CONFIG } from './types';

export interface Preset {
  name: string;
  description: string;
  category: 'minimal' | 'glass' | 'neon' | 'animated' | 'custom' | '3d' | 'retro' | 'gradient' | 'cyberpunk' | 'nature' | 'icon-styles';
  config: Partial<ButtonConfig>;
}

export const PRESETS: Preset[] = [
  // ============================================
  // MINIMAL STYLES
  // ============================================
  {
    name: 'Minimal Dark',
    description: 'Clean, dark minimal style',
    category: 'minimal',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      borderStyle: 'none',
      shadowSize: 'none',
      backdropBlur: '0px',
      iconColorAuto: false,
      iconColor: '#888888',
      showName: true,
      showIcon: true,
      showState: false,
      showLabel: false,
    }
  },
  {
    name: 'Minimal Light',
    description: 'Clean, light minimal style',
    category: 'minimal',
    config: {
      backgroundColor: '#f5f5f5',
      backgroundColorOpacity: 100,
      color: '#1a1a1a',
      borderRadius: '12px',
      borderStyle: 'none',
      shadowSize: 'sm',
      shadowColor: '#000000',
      shadowOpacity: 10,
      backdropBlur: '0px',
      iconColor: '#666666',
      nameColor: '#1a1a1a',
    }
  },
  {
    name: 'Invisible Touch',
    description: 'Nearly invisible, just a hint',
    category: 'minimal',
    config: {
      backgroundColor: '#ffffff',
      backgroundColorOpacity: 5,
      color: '#888888',
      borderRadius: '8px',
      borderStyle: 'none',
      shadowSize: 'none',
    }
  },
  {
    name: 'Outlined',
    description: 'Just a simple outline',
    category: 'minimal',
    config: {
      backgroundColor: '#000000',
      backgroundColorOpacity: 0,
      color: '#ffffff',
      borderRadius: '8px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#444444',
      shadowSize: 'none',
    }
  },
  {
    name: 'Soft Shadow',
    description: 'Subtle with soft shadow',
    category: 'minimal',
    config: {
      backgroundColor: '#1e1e1e',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '16px',
      borderStyle: 'none',
      shadowSize: 'lg',
      shadowColor: '#000000',
      shadowOpacity: 40,
    }
  },

  // ============================================
  // GLASS STYLES
  // ============================================
  {
    name: 'Glassmorphism',
    description: 'Frosted glass effect with blur',
    category: 'glass',
    config: {
      backgroundColor: '#ffffff',
      backgroundColorOpacity: 15,
      color: '#ffffff',
      borderRadius: '16px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(255,255,255,0.2)',
      backdropBlur: '10px',
      shadowSize: 'lg',
      shadowColor: '#000000',
      shadowOpacity: 20,
    }
  },
  {
    name: 'Glassmorphism Dark',
    description: 'Dark frosted glass effect',
    category: 'glass',
    config: {
      backgroundColor: '#000000',
      backgroundColorOpacity: 40,
      color: '#ffffff',
      borderRadius: '16px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(255,255,255,0.1)',
      backdropBlur: '20px',
      shadowSize: 'xl',
      shadowColor: '#000000',
      shadowOpacity: 30,
    }
  },
  {
    name: 'Ice Glass',
    description: 'Cold blue frosted glass',
    category: 'glass',
    config: {
      backgroundColor: '#88ccff',
      backgroundColorOpacity: 15,
      color: '#ffffff',
      borderRadius: '16px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(136,204,255,0.3)',
      backdropBlur: '15px',
      shadowSize: 'lg',
      shadowColor: '#0088ff',
      shadowOpacity: 20,
      iconColor: '#88ccff',
    }
  },
  {
    name: 'Rose Glass',
    description: 'Soft pink frosted glass',
    category: 'glass',
    config: {
      backgroundColor: '#ff88aa',
      backgroundColorOpacity: 15,
      color: '#ffffff',
      borderRadius: '20px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(255,136,170,0.3)',
      backdropBlur: '12px',
      shadowSize: 'lg',
      shadowColor: '#ff4488',
      shadowOpacity: 25,
      iconColor: '#ff88aa',
    }
  },
  {
    name: 'Crystal Clear',
    description: 'Maximum blur transparency',
    category: 'glass',
    config: {
      backgroundColor: '#ffffff',
      backgroundColorOpacity: 8,
      color: '#ffffff',
      borderRadius: '12px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(255,255,255,0.15)',
      backdropBlur: '30px',
      shadowSize: 'md',
      shadowColor: '#ffffff',
      shadowOpacity: 10,
    }
  },

  // ============================================
  // NEON STYLES
  // ============================================
  {
    name: 'Neon Glow',
    description: 'Vibrant neon with glow effect',
    category: 'neon',
    config: {
      backgroundColor: '#0a0a0a',
      backgroundColorOpacity: 100,
      color: '#00ff88',
      borderRadius: '8px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#00ff88',
      shadowSize: 'lg',
      shadowColor: '#00ff88',
      shadowOpacity: 50,
      iconColor: '#00ff88',
      nameColor: '#00ff88',
    }
  },
  {
    name: 'Neon Purple',
    description: 'Purple neon cyberpunk style',
    category: 'neon',
    config: {
      backgroundColor: '#0f0f1a',
      backgroundColorOpacity: 100,
      color: '#bf00ff',
      borderRadius: '8px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#bf00ff',
      shadowSize: 'lg',
      shadowColor: '#bf00ff',
      shadowOpacity: 60,
      iconColor: '#bf00ff',
      nameColor: '#bf00ff',
    }
  },
  {
    name: 'Neon Orange',
    description: 'Warm orange neon style',
    category: 'neon',
    config: {
      backgroundColor: '#1a0f0a',
      backgroundColorOpacity: 100,
      color: '#ff6600',
      borderRadius: '8px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#ff6600',
      shadowSize: 'lg',
      shadowColor: '#ff6600',
      shadowOpacity: 50,
      iconColor: '#ff6600',
      nameColor: '#ff6600',
    }
  },
  {
    name: 'Neon Cyan',
    description: 'Electric cyan glow',
    category: 'neon',
    config: {
      backgroundColor: '#0a1a1a',
      backgroundColorOpacity: 100,
      color: '#00ffff',
      borderRadius: '8px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#00ffff',
      shadowSize: 'xl',
      shadowColor: '#00ffff',
      shadowOpacity: 60,
      iconColor: '#00ffff',
      nameColor: '#00ffff',
    }
  },
  {
    name: 'Neon Pink',
    description: 'Hot pink neon glow',
    category: 'neon',
    config: {
      backgroundColor: '#1a0a14',
      backgroundColorOpacity: 100,
      color: '#ff0080',
      borderRadius: '8px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#ff0080',
      shadowSize: 'xl',
      shadowColor: '#ff0080',
      shadowOpacity: 55,
      iconColor: '#ff0080',
      nameColor: '#ff0080',
    }
  },
  {
    name: 'Neon Yellow',
    description: 'Bright yellow electric',
    category: 'neon',
    config: {
      backgroundColor: '#1a1a0a',
      backgroundColorOpacity: 100,
      color: '#ffff00',
      borderRadius: '8px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#ffff00',
      shadowSize: 'lg',
      shadowColor: '#ffff00',
      shadowOpacity: 50,
      iconColor: '#ffff00',
      nameColor: '#ffff00',
    }
  },

  // ============================================
  // ANIMATED STYLES
  // ============================================
  {
    name: 'Pulse Animation',
    description: 'Subtle pulse when entity is on',
    category: 'animated',
    config: {
      backgroundColor: '#1c1c1c',
      backgroundColorOpacity: 100,
      cardAnimation: 'pulse',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '2s',
    }
  },
  {
    name: 'Icon Spin',
    description: 'Spinning icon when active',
    category: 'animated',
    config: {
      backgroundColor: '#1c1c1c',
      backgroundColorOpacity: 100,
      iconAnimation: 'spin',
      iconAnimationTrigger: 'on',
      iconAnimationSpeed: '2s',
    }
  },
  {
    name: 'Marquee Border',
    description: 'Animated rotating border',
    category: 'animated',
    config: {
      backgroundColor: '#0a0a0a',
      backgroundColorOpacity: 100,
      cardAnimation: 'marquee',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '4s',
      borderColorAuto: true,
    }
  },
  {
    name: 'Floating',
    description: 'Gentle floating motion',
    category: 'animated',
    config: {
      backgroundColor: '#1c1c1c',
      backgroundColorOpacity: 100,
      cardAnimation: 'float',
      cardAnimationTrigger: 'always',
      cardAnimationSpeed: '3s',
      shadowSize: 'lg',
      shadowColor: '#000000',
      shadowOpacity: 40,
    }
  },
  {
    name: 'Heartbeat',
    description: 'Pulsing heartbeat when on',
    category: 'animated',
    config: {
      backgroundColor: '#2a0a0a',
      backgroundColorOpacity: 100,
      color: '#ff4444',
      iconColor: '#ff4444',
      cardAnimation: 'heartbeat',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '1.5s',
    }
  },
  {
    name: 'Breathing Glow',
    description: 'Soft breathing glow effect',
    category: 'animated',
    config: {
      backgroundColor: '#0a1a2a',
      backgroundColorOpacity: 100,
      color: '#4488ff',
      iconColor: '#4488ff',
      cardAnimation: 'breathe',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '3s',
      shadowSize: 'lg',
      shadowColor: '#4488ff',
      shadowOpacity: 40,
    }
  },
  {
    name: 'Shake Alert',
    description: 'Shaking alert when on',
    category: 'animated',
    config: {
      backgroundColor: '#2a1a0a',
      backgroundColorOpacity: 100,
      color: '#ff8800',
      iconColor: '#ff8800',
      cardAnimation: 'shake',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '0.5s',
    }
  },
  {
    name: 'Bounce',
    description: 'Bouncy animation',
    category: 'animated',
    config: {
      backgroundColor: '#1c1c1c',
      backgroundColorOpacity: 100,
      cardAnimation: 'bounce',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '1s',
    }
  },
  {
    name: 'Wobble Jelly',
    description: 'Wobbly jelly effect',
    category: 'animated',
    config: {
      backgroundColor: '#1a1a2e',
      backgroundColorOpacity: 100,
      cardAnimation: 'wobble',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '1s',
      borderRadius: '20px',
    }
  },
  {
    name: 'Tada!',
    description: 'Attention-grabbing tada',
    category: 'animated',
    config: {
      backgroundColor: '#2a1a2a',
      backgroundColorOpacity: 100,
      color: '#ff44ff',
      iconColor: '#ff44ff',
      cardAnimation: 'tada',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '1s',
    }
  },
  {
    name: 'Swing Pendulum',
    description: 'Swinging pendulum motion',
    category: 'animated',
    config: {
      backgroundColor: '#1c1c1c',
      backgroundColorOpacity: 100,
      iconAnimation: 'swing',
      iconAnimationTrigger: 'on',
      iconAnimationSpeed: '2s',
    }
  },
  {
    name: 'Flip Card',
    description: '3D flip animation',
    category: 'animated',
    config: {
      backgroundColor: '#1c1c1c',
      backgroundColorOpacity: 100,
      cardAnimation: 'flip',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '2s',
    }
  },
  {
    name: 'Rubber Band',
    description: 'Elastic rubber band effect',
    category: 'animated',
    config: {
      backgroundColor: '#1c1c1c',
      backgroundColorOpacity: 100,
      cardAnimation: 'rubberBand',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '1s',
    }
  },
  {
    name: 'Flash Blink',
    description: 'Flashing blink effect',
    category: 'animated',
    config: {
      backgroundColor: '#1c1c1c',
      backgroundColorOpacity: 100,
      cardAnimation: 'flash',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '1s',
    }
  },
  {
    name: 'Ripple Wave',
    description: 'Rippling wave effect',
    category: 'animated',
    config: {
      backgroundColor: '#0a1a2a',
      backgroundColorOpacity: 100,
      color: '#00aaff',
      iconColor: '#00aaff',
      cardAnimation: 'ripple',
      cardAnimationTrigger: 'on',
      cardAnimationSpeed: '1.5s',
    }
  },

  // ============================================
  // 3D STYLES
  // ============================================
  {
    name: 'Raised Button',
    description: '3D raised button with depth',
    category: '3d',
    config: {
      backgroundColor: '#2a2a2a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '8px',
      shadowSize: 'lg',
      shadowColor: '#000000',
      shadowOpacity: 60,
      extraStyles: 'transform: translateY(-4px)\nborder-bottom: 4px solid #1a1a1a',
    }
  },
  {
    name: 'Inset/Pressed',
    description: 'Pressed inset button',
    category: '3d',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#888888',
      borderRadius: '8px',
      shadowSize: 'inner',
      shadowColor: '#000000',
      shadowOpacity: 60,
      extraStyles: 'border-top: 2px solid #0a0a0a',
    }
  },
  {
    name: 'Neumorphism Light',
    description: 'Soft UI neumorphic style',
    category: '3d',
    config: {
      backgroundColor: '#e0e0e0',
      backgroundColorOpacity: 100,
      color: '#555555',
      iconColor: '#666666',
      nameColor: '#444444',
      borderRadius: '20px',
      borderStyle: 'none',
      extraStyles: 'box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    }
  },
  {
    name: 'Neumorphism Dark',
    description: 'Dark neumorphic style',
    category: '3d',
    config: {
      backgroundColor: '#2d2d2d',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      iconColor: '#888888',
      borderRadius: '20px',
      borderStyle: 'none',
      extraStyles: 'box-shadow: 8px 8px 16px #1a1a1a, -8px -8px 16px #404040',
    }
  },
  {
    name: 'Embossed',
    description: 'Embossed raised effect',
    category: '3d',
    config: {
      backgroundColor: '#333333',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      extraStyles: 'box-shadow: inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.4)',
    }
  },
  {
    name: 'Layered Card',
    description: 'Stacked layered effect',
    category: '3d',
    config: {
      backgroundColor: '#2a2a2a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      extraStyles: 'box-shadow: 0 1px 1px rgba(0,0,0,0.12), 0 2px 2px rgba(0,0,0,0.12), 0 4px 4px rgba(0,0,0,0.12), 0 8px 8px rgba(0,0,0,0.12), 0 16px 16px rgba(0,0,0,0.12)',
    }
  },

  // ============================================
  // GRADIENT STYLES
  // ============================================
  {
    name: 'Sunset Gradient',
    description: 'Warm sunset colors',
    category: 'gradient',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      extraStyles: 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    }
  },
  {
    name: 'Ocean Gradient',
    description: 'Cool ocean blue tones',
    category: 'gradient',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      extraStyles: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }
  },
  {
    name: 'Aurora Gradient',
    description: 'Northern lights effect',
    category: 'gradient',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      extraStyles: 'background: linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)',
    }
  },
  {
    name: 'Fire Gradient',
    description: 'Hot fire colors',
    category: 'gradient',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      extraStyles: 'background: linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    }
  },
  {
    name: 'Midnight Gradient',
    description: 'Deep midnight purple',
    category: 'gradient',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      extraStyles: 'background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    }
  },
  {
    name: 'Emerald Gradient',
    description: 'Rich emerald green',
    category: 'gradient',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      extraStyles: 'background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    }
  },
  {
    name: 'Royal Gold',
    description: 'Luxurious gold gradient',
    category: 'gradient',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#1a1a1a',
      borderRadius: '12px',
      extraStyles: 'background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    }
  },
  {
    name: 'Cotton Candy',
    description: 'Soft pink to blue',
    category: 'gradient',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '16px',
      extraStyles: 'background: linear-gradient(135deg, #ff9a9e 0%, #a18cd1 100%)',
    }
  },
  {
    name: 'Lava Lamp',
    description: 'Animated shifting gradient',
    category: 'gradient',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '16px',
      extraStyles: 'background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)\nbackground-size: 400% 400%\nanimation: lava-shift 15s ease infinite',
    }
  },
  {
    name: 'Holographic',
    description: 'Iridescent rainbow effect',
    category: 'gradient',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      extraStyles: 'background: linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)\nbackground-size: 400% 400%\nanimation: holo-shift 5s linear infinite',
    }
  },

  // ============================================
  // CYBERPUNK STYLES
  // ============================================
  {
    name: 'Cyberpunk Red',
    description: 'Edgy cyberpunk red',
    category: 'cyberpunk',
    config: {
      backgroundColor: '#0a0a0a',
      backgroundColorOpacity: 100,
      color: '#ff0040',
      borderRadius: '4px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#ff0040',
      iconColor: '#ff0040',
      nameColor: '#ff0040',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      extraStyles: 'box-shadow: 0 0 10px #ff0040, inset 0 0 20px rgba(255,0,64,0.1)',
    }
  },
  {
    name: 'Matrix Green',
    description: 'Matrix hacker style',
    category: 'cyberpunk',
    config: {
      backgroundColor: '#0a0a0a',
      backgroundColorOpacity: 100,
      color: '#00ff00',
      borderRadius: '0px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#00ff00',
      iconColor: '#00ff00',
      nameColor: '#00ff00',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      extraStyles: 'box-shadow: 0 0 5px #00ff00, inset 0 0 10px rgba(0,255,0,0.05)\ntext-shadow: 0 0 5px #00ff00',
    }
  },
  {
    name: 'Tron Blue',
    description: 'Tron legacy style',
    category: 'cyberpunk',
    config: {
      backgroundColor: '#000000',
      backgroundColorOpacity: 100,
      color: '#00d4ff',
      borderRadius: '2px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#00d4ff',
      iconColor: '#00d4ff',
      nameColor: '#00d4ff',
      extraStyles: 'box-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff, inset 0 0 15px rgba(0,212,255,0.1)',
    }
  },
  {
    name: 'Glitch Effect',
    description: 'Cyberpunk glitch aesthetic',
    category: 'cyberpunk',
    config: {
      backgroundColor: '#0a0a0a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '4px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#ff00ff',
      extraStyles: 'text-shadow: 2px 0 #ff00de, -2px 0 #00ffff\nbox-shadow: 2px 0 #ff00de, -2px 0 #00ffff',
    }
  },
  {
    name: 'Synthwave',
    description: '80s synthwave aesthetic',
    category: 'cyberpunk',
    config: {
      backgroundColor: '#1a0a2e',
      backgroundColorOpacity: 100,
      color: '#ff6ec7',
      borderRadius: '8px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#ff6ec7',
      iconColor: '#00ffff',
      nameColor: '#ff6ec7',
      extraStyles: 'background: linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 100%)\nbox-shadow: 0 0 15px #ff6ec7, 0 0 30px rgba(255,110,199,0.3)',
    }
  },
  {
    name: 'Terminal',
    description: 'Classic terminal look',
    category: 'cyberpunk',
    config: {
      backgroundColor: '#0a0a0a',
      backgroundColorOpacity: 100,
      color: '#33ff33',
      borderRadius: '0px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#33ff33',
      iconColor: '#33ff33',
      nameColor: '#33ff33',
      fontFamily: 'monospace',
      extraStyles: 'background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)',
    }
  },
  {
    name: 'Blade Runner',
    description: 'Noir cyberpunk',
    category: 'cyberpunk',
    config: {
      backgroundColor: '#0f0f1a',
      backgroundColorOpacity: 100,
      color: '#ff9500',
      borderRadius: '4px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#ff9500',
      iconColor: '#ff9500',
      nameColor: '#ff9500',
      extraStyles: 'box-shadow: 0 0 20px rgba(255,149,0,0.3), inset 0 0 30px rgba(255,149,0,0.05)',
    }
  },

  // ============================================
  // RETRO STYLES
  // ============================================
  {
    name: 'Pixel Art',
    description: '8-bit pixel style',
    category: 'retro',
    config: {
      backgroundColor: '#2d2d2d',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '0px',
      borderWidth: '4px',
      borderStyle: 'solid',
      borderColor: '#ffffff',
      fontFamily: 'monospace',
      extraStyles: 'box-shadow: 4px 4px 0 0 #000000\nimage-rendering: pixelated',
    }
  },
  {
    name: 'Gameboy',
    description: 'Classic Gameboy LCD',
    category: 'retro',
    config: {
      backgroundColor: '#9bbc0f',
      backgroundColorOpacity: 100,
      color: '#0f380f',
      borderRadius: '4px',
      iconColor: '#0f380f',
      nameColor: '#0f380f',
      fontFamily: 'monospace',
      extraStyles: 'box-shadow: inset 2px 2px 0 #8bac0f, inset -2px -2px 0 #306230',
    }
  },
  {
    name: 'VHS Tape',
    description: 'Retro VHS aesthetic',
    category: 'retro',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '4px',
      extraStyles: 'background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)\nbox-shadow: 0 0 0 3px #333, 0 0 0 6px #1a1a1a',
    }
  },
  {
    name: 'Arcade',
    description: 'Classic arcade cabinet',
    category: 'retro',
    config: {
      backgroundColor: '#000000',
      backgroundColorOpacity: 100,
      color: '#ffff00',
      borderRadius: '8px',
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: '#ff0000',
      iconColor: '#ffff00',
      nameColor: '#ffff00',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      extraStyles: 'box-shadow: inset 0 0 20px rgba(255,255,0,0.1), 0 0 10px rgba(255,0,0,0.5)',
    }
  },
  {
    name: 'Retro TV',
    description: 'Old CRT television',
    category: 'retro',
    config: {
      backgroundColor: '#2a2a2a',
      backgroundColorOpacity: 100,
      color: '#aaaaaa',
      borderRadius: '20px',
      extraStyles: 'background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)\nbox-shadow: inset 0 0 50px rgba(0,0,0,0.5), 0 0 0 8px #444, 0 0 0 12px #333',
    }
  },
  {
    name: 'Cassette',
    description: 'Cassette tape vibe',
    category: 'retro',
    config: {
      backgroundColor: '#3d3d3d',
      backgroundColorOpacity: 100,
      color: '#ff6b35',
      borderRadius: '6px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#ff6b35',
      iconColor: '#ff6b35',
      nameColor: '#ffffff',
      extraStyles: 'box-shadow: inset 0 -20px 30px rgba(0,0,0,0.3)',
    }
  },
  {
    name: 'Floppy Disk',
    description: '3.5" floppy style',
    category: 'retro',
    config: {
      backgroundColor: '#1a1a4e',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '4px',
      iconColor: '#cccccc',
      nameColor: '#ffffff',
      extraStyles: 'box-shadow: inset 8px 0 0 #2a2a6e, inset -8px 0 0 #0a0a2e, inset 0 -15px 0 #2a2a6e',
    }
  },

  // ============================================
  // NATURE STYLES
  // ============================================
  {
    name: 'Forest',
    description: 'Deep forest green',
    category: 'nature',
    config: {
      backgroundColor: '#1a3a1a',
      backgroundColorOpacity: 100,
      color: '#90EE90',
      borderRadius: '12px',
      iconColor: '#90EE90',
      nameColor: '#90EE90',
      extraStyles: 'background: linear-gradient(180deg, #1a3a1a 0%, #0d1f0d 100%)',
    }
  },
  {
    name: 'Ocean Deep',
    description: 'Deep ocean blue',
    category: 'nature',
    config: {
      backgroundColor: '#0a1a2e',
      backgroundColorOpacity: 100,
      color: '#87CEEB',
      borderRadius: '12px',
      iconColor: '#87CEEB',
      nameColor: '#87CEEB',
      extraStyles: 'background: linear-gradient(180deg, #1a3a5e 0%, #0a1a2e 100%)',
    }
  },
  {
    name: 'Sunset Sky',
    description: 'Warm sunset tones',
    category: 'nature',
    config: {
      backgroundColor: '#2e1a1a',
      backgroundColorOpacity: 100,
      color: '#ffcc80',
      borderRadius: '12px',
      iconColor: '#ff8c00',
      nameColor: '#ffcc80',
      extraStyles: 'background: linear-gradient(180deg, #ff6b35 0%, #2e1a1a 100%)',
    }
  },
  {
    name: 'Night Sky',
    description: 'Starry night aesthetic',
    category: 'nature',
    config: {
      backgroundColor: '#0a0a1a',
      backgroundColorOpacity: 100,
      color: '#e0e0ff',
      borderRadius: '12px',
      iconColor: '#ffd700',
      nameColor: '#e0e0ff',
      extraStyles: 'background: radial-gradient(ellipse at top, #1a1a3e 0%, #0a0a1a 100%)',
    }
  },
  {
    name: 'Lava',
    description: 'Molten lava effect',
    category: 'nature',
    config: {
      backgroundColor: '#1a0a0a',
      backgroundColorOpacity: 100,
      color: '#ff4500',
      borderRadius: '8px',
      iconColor: '#ff6600',
      nameColor: '#ff4500',
      shadowSize: 'lg',
      shadowColor: '#ff4500',
      shadowOpacity: 40,
      extraStyles: 'background: linear-gradient(180deg, #3a1a0a 0%, #1a0a0a 100%)',
    }
  },
  {
    name: 'Ice Crystal',
    description: 'Frozen ice look',
    category: 'nature',
    config: {
      backgroundColor: '#e8f4ff',
      backgroundColorOpacity: 90,
      color: '#1a4a6e',
      borderRadius: '12px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#a0d4ff',
      iconColor: '#4a9eff',
      nameColor: '#1a4a6e',
      backdropBlur: '10px',
      extraStyles: 'box-shadow: inset 0 0 20px rgba(160,212,255,0.3)',
    }
  },
  {
    name: 'Storm Cloud',
    description: 'Dark stormy atmosphere',
    category: 'nature',
    config: {
      backgroundColor: '#2a2a3a',
      backgroundColorOpacity: 100,
      color: '#9090a0',
      borderRadius: '12px',
      iconColor: '#ffff00',
      nameColor: '#c0c0d0',
      extraStyles: 'background: linear-gradient(180deg, #3a3a4a 0%, #1a1a2a 100%)\nbox-shadow: inset 0 -10px 20px rgba(0,0,0,0.3)',
    }
  },
  {
    name: 'Aurora Borealis',
    description: 'Northern lights glow',
    category: 'nature',
    config: {
      backgroundColor: '#0a1a1a',
      backgroundColorOpacity: 100,
      color: '#00ffaa',
      borderRadius: '12px',
      iconColor: '#00ffaa',
      nameColor: '#00ffaa',
      extraStyles: 'background: linear-gradient(180deg, #1a3a3a 0%, #0a1a1a 50%, #1a1a3a 100%)\nbox-shadow: 0 0 30px rgba(0,255,170,0.2)',
    }
  },

  // ============================================
  // CUSTOM/UTILITY STYLES
  // ============================================
  {
    name: 'Entity Color Match',
    description: 'Inherits color from entity',
    category: 'custom',
    config: {
      colorAuto: true,
      colorType: 'card',
      iconColorAuto: true,
      borderColorAuto: true,
    }
  },
  {
    name: 'Rounded Pill',
    description: 'Fully rounded pill shape',
    category: 'custom',
    config: {
      borderRadius: '999px',
      padding: '10px 20px',
      layout: 'icon_name_state',
    }
  },
  {
    name: 'Square Tile',
    description: 'Square aspect ratio tile',
    category: 'custom',
    config: {
      aspectRatio: '1/1',
      borderRadius: '8px',
      layout: 'vertical',
    }
  },
  {
    name: 'Wide Banner',
    description: 'Wide horizontal banner style',
    category: 'custom',
    config: {
      aspectRatio: '3/1',
      borderRadius: '12px',
      layout: 'icon_name_state',
      padding: '15px 25px',
    }
  },
  {
    name: 'Circle Button',
    description: 'Perfect circle shape',
    category: 'custom',
    config: {
      aspectRatio: '1/1',
      borderRadius: '50%',
      layout: 'vertical',
      showName: false,
      showState: false,
      size: '60%',
    }
  },
  {
    name: 'Hexagon',
    description: 'Hexagonal shape',
    category: 'custom',
    config: {
      aspectRatio: '1/1',
      borderRadius: '0px',
      layout: 'vertical',
      extraStyles: 'clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    }
  },
  {
    name: 'Diamond',
    description: 'Rotated diamond shape',
    category: 'custom',
    config: {
      aspectRatio: '1/1',
      borderRadius: '8px',
      layout: 'vertical',
      extraStyles: 'transform: rotate(45deg)\nclip-path: none',
    }
  },
  {
    name: 'Dashed Border',
    description: 'Animated dashed outline',
    category: 'custom',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '8px',
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderColor: '#888888',
    }
  },
  {
    name: 'Dotted Border',
    description: 'Playful dotted outline',
    category: 'custom',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '12px',
      borderWidth: '3px',
      borderStyle: 'dotted',
      borderColor: '#666666',
    }
  },
  {
    name: 'Double Border',
    description: 'Classic double border',
    category: 'custom',
    config: {
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '8px',
      borderWidth: '4px',
      borderStyle: 'double',
      borderColor: '#888888',
    }
  },
  {
    name: 'Compact Mini',
    description: 'Small compact button',
    category: 'custom',
    config: {
      padding: '8px',
      fontSize: '12px',
      size: '30%',
      borderRadius: '8px',
    }
  },
  {
    name: 'Large Display',
    description: 'Big prominent display',
    category: 'custom',
    config: {
      padding: '20px',
      fontSize: '18px',
      size: '60%',
      borderRadius: '16px',
      showState: true,
    }
  },

  // ============================================
  // ICON STYLES
  // ============================================
  {
    name: 'Circle Icon',
    description: 'Icon in a circular background',
    category: 'icon-styles',
    config: {
      size: '50%',
      imgCellStyles: `background: rgba(255, 255, 255, 0.1)
border-radius: 50%
padding: 12px
aspect-ratio: 1`,
    }
  },
  {
    name: 'Square Badge',
    description: 'Icon in a rounded square badge',
    category: 'icon-styles',
    config: {
      size: '45%',
      imgCellStyles: `background: rgba(255, 255, 255, 0.15)
border-radius: 12px
padding: 10px
aspect-ratio: 1`,
    }
  },
  {
    name: 'Soft Glow Icon',
    description: 'Icon with soft glow effect',
    category: 'icon-styles',
    config: {
      size: '50%',
      iconColorAuto: true,
      imgCellStyles: `filter: drop-shadow(0 0 8px currentColor)
padding: 8px`,
    }
  },
  {
    name: 'Neon Ring Icon',
    description: 'Icon with neon ring border',
    category: 'icon-styles',
    config: {
      size: '40%',
      iconColor: '#00ffff',
      imgCellStyles: `border: 2px solid currentColor
border-radius: 50%
padding: 12px
box-shadow: 0 0 10px currentColor, inset 0 0 10px rgba(0, 255, 255, 0.2)`,
    }
  },
  {
    name: 'Gradient Circle',
    description: 'Icon in gradient circle background',
    category: 'icon-styles',
    config: {
      size: '45%',
      iconColor: '#ffffff',
      imgCellStyles: `background: linear-gradient(135deg, #667eea, #764ba2)
border-radius: 50%
padding: 14px
aspect-ratio: 1`,
    }
  },
  {
    name: 'Floating Icon',
    description: 'Icon with floating shadow effect',
    category: 'icon-styles',
    config: {
      size: '50%',
      imgCellStyles: `background: rgba(255, 255, 255, 0.1)
border-radius: 16px
padding: 10px
box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4)
transform: translateY(-4px)`,
    }
  },
  {
    name: 'Icon Only Large',
    description: 'Large centered icon, no text',
    category: 'icon-styles',
    config: {
      size: '70%',
      showName: false,
      showState: false,
      showLabel: false,
      padding: '15%',
    }
  },
  {
    name: 'Mini Icon Badge',
    description: 'Small icon in top corner badge style',
    category: 'icon-styles',
    config: {
      size: '30%',
      layout: 'icon_name_state',
      imgCellStyles: `background: rgba(59, 130, 246, 0.8)
border-radius: 8px
padding: 6px`,
    }
  },
  {
    name: 'Outlined Icon',
    description: 'Icon with outline ring',
    category: 'icon-styles',
    config: {
      size: '45%',
      imgCellStyles: `border: 2px solid rgba(255, 255, 255, 0.3)
border-radius: 50%
padding: 10px`,
    }
  },
  {
    name: 'Hexagon Icon',
    description: 'Icon in hexagon shape',
    category: 'icon-styles',
    config: {
      size: '40%',
      imgCellStyles: `background: rgba(255, 255, 255, 0.1)
clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)
padding: 16px
aspect-ratio: 1`,
    }
  },
  {
    name: 'Diamond Icon',
    description: 'Icon in rotated square (diamond)',
    category: 'icon-styles',
    config: {
      size: '35%',
      imgCellStyles: `background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))
transform: rotate(45deg)
padding: 12px
border-radius: 4px`,
      extraStyles: `--mdc-icon-size: 24px`,
    }
  },
  {
    name: 'Pill Icon',
    description: 'Icon in horizontal pill shape',
    category: 'icon-styles',
    config: {
      size: '35%',
      layout: 'icon_name_state',
      imgCellStyles: `background: rgba(255, 255, 255, 0.15)
border-radius: 50px
padding: 8px 16px`,
    }
  },
  {
    name: 'Neumorphic Icon',
    description: 'Soft 3D neumorphic icon style',
    category: 'icon-styles',
    config: {
      size: '45%',
      backgroundColor: '#2a2a2a',
      imgCellStyles: `background: #2a2a2a
border-radius: 50%
padding: 14px
box-shadow: 8px 8px 16px #1a1a1a, -8px -8px 16px #3a3a3a`,
    }
  },
  {
    name: 'Glassmorphic Icon',
    description: 'Frosted glass icon background',
    category: 'icon-styles',
    config: {
      size: '45%',
      imgCellStyles: `background: rgba(255, 255, 255, 0.1)
backdrop-filter: blur(10px)
border: 1px solid rgba(255, 255, 255, 0.2)
border-radius: 16px
padding: 12px`,
    }
  },
  {
    name: 'Pulse Ring Icon',
    description: 'Icon with animated pulse ring',
    category: 'icon-styles',
    config: {
      size: '40%',
      iconAnimation: 'pulse',
      iconAnimationTrigger: 'on',
      imgCellStyles: `border: 2px solid currentColor
border-radius: 50%
padding: 12px`,
    }
  },
  {
    name: 'Sunrise Icon',
    description: 'Warm gradient icon backdrop',
    category: 'icon-styles',
    config: {
      size: '45%',
      iconColor: '#ffffff',
      imgCellStyles: `background: linear-gradient(180deg, #f093fb 0%, #f5576c 50%, #ffd89b 100%)
border-radius: 50%
padding: 14px`,
    }
  },
  {
    name: 'Ocean Icon',
    description: 'Cool ocean gradient icon',
    category: 'icon-styles',
    config: {
      size: '45%',
      iconColor: '#ffffff',
      imgCellStyles: `background: linear-gradient(135deg, #667eea 0%, #00d4ff 100%)
border-radius: 50%
padding: 14px`,
    }
  },
  {
    name: 'Fire Icon',
    description: 'Hot fire gradient icon',
    category: 'icon-styles',
    config: {
      size: '45%',
      iconColor: '#ffffff',
      imgCellStyles: `background: linear-gradient(135deg, #ff512f 0%, #f09819 100%)
border-radius: 50%
padding: 14px`,
    }
  },
  {
    name: 'Shadow Icon',
    description: 'Icon with dramatic drop shadow',
    category: 'icon-styles',
    config: {
      size: '55%',
      imgCellStyles: `filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.5))`,
    }
  },
  {
    name: 'Inset Icon',
    description: 'Icon pressed into surface',
    category: 'icon-styles',
    config: {
      size: '45%',
      imgCellStyles: `background: rgba(0, 0, 0, 0.2)
border-radius: 50%
padding: 12px
box-shadow: inset 2px 2px 6px rgba(0, 0, 0, 0.4), inset -2px -2px 6px rgba(255, 255, 255, 0.1)`,
    }
  },
  {
    name: 'Minimal Line Icon',
    description: 'Thin icon with underline accent',
    category: 'icon-styles',
    config: {
      size: '40%',
      imgCellStyles: `border-bottom: 2px solid currentColor
padding-bottom: 8px`,
    }
  },
  {
    name: 'Top Accent Icon',
    description: 'Icon with colored top accent bar',
    category: 'icon-styles',
    config: {
      size: '45%',
      imgCellStyles: `border-top: 3px solid #3b82f6
background: rgba(59, 130, 246, 0.1)
border-radius: 0 0 12px 12px
padding: 12px`,
    }
  },
  {
    name: 'Corner Notch Icon',
    description: 'Icon with corner cut style',
    category: 'icon-styles',
    config: {
      size: '40%',
      imgCellStyles: `background: rgba(255, 255, 255, 0.1)
clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))
padding: 14px`,
    }
  },
  {
    name: 'Bottom-Left Icon',
    description: 'Large icon anchored to bottom-left corner',
    category: 'icon-styles',
    config: {
      size: '55%',
      layout: 'vertical',
      showName: true,
      showState: false,
      iconColor: 'rgba(255, 255, 255, 0.9)',
      imgCellStyles: `position: absolute
top: 8px
right: 8px
opacity: 0.85`,
      extraStyles: `justify-content: flex-end
align-items: flex-end
padding: 12px`,
    }
  },
  {
    name: 'Bottom-Right Icon',
    description: 'Large icon anchored to bottom-right corner',
    category: 'icon-styles',
    config: {
      size: '55%',
      layout: 'vertical',
      showName: true,
      showState: false,
      iconColor: 'rgba(255, 255, 255, 0.9)',
      imgCellStyles: `position: absolute
top: 8px
left: 8px
opacity: 0.85`,
      extraStyles: `justify-content: flex-end
align-items: flex-start
padding: 12px`,
    }
  },
  {
    name: 'Top-Left Icon',
    description: 'Icon positioned in top-left corner',
    category: 'icon-styles',
    config: {
      size: '40%',
      layout: 'vertical',
      imgCellStyles: `position: absolute
bottom: 8px
right: 8px`,
      extraStyles: `justify-content: flex-start
align-items: flex-end
padding: 12px`,
    }
  },
  {
    name: 'Top-Right Icon',
    description: 'Icon positioned in top-right corner',
    category: 'icon-styles',
    config: {
      size: '40%',
      layout: 'vertical',
      imgCellStyles: `position: absolute
bottom: 8px
left: 8px`,
      extraStyles: `justify-content: flex-start
align-items: flex-start
padding: 12px`,
    }
  },
  {
    name: 'Area Card - Amber',
    description: 'Room area card style with amber tint',
    category: 'icon-styles',
    config: {
      backgroundColor: '#3d3520',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '16px',
      size: '60%',
      layout: 'vertical',
      showName: true,
      showState: true,
      showLabel: false,
      nameColor: '#ffffff',
      stateColor: 'rgba(255, 255, 255, 0.7)',
      fontSize: '13px',
      iconColor: 'rgba(255, 200, 100, 0.9)',
      imgCellStyles: `position: absolute
bottom: 6px
left: 6px
opacity: 0.9
filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
      extraStyles: `justify-content: flex-start
align-items: flex-start
padding: 10px
min-height: 80px`,
    }
  },
  {
    name: 'Area Card - Teal',
    description: 'Room area card style with teal tint',
    category: 'icon-styles',
    config: {
      backgroundColor: '#1a3a3a',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '16px',
      size: '60%',
      layout: 'vertical',
      showName: true,
      showState: true,
      showLabel: false,
      nameColor: '#ffffff',
      stateColor: 'rgba(255, 255, 255, 0.7)',
      fontSize: '13px',
      iconColor: 'rgba(100, 220, 220, 0.9)',
      imgCellStyles: `position: absolute
bottom: 6px
left: 6px
opacity: 0.9
filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
      extraStyles: `justify-content: flex-start
align-items: flex-start
padding: 10px
min-height: 80px`,
    }
  },
  {
    name: 'Area Card - Purple',
    description: 'Room area card style with purple tint',
    category: 'icon-styles',
    config: {
      backgroundColor: '#2a2040',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '16px',
      size: '60%',
      layout: 'vertical',
      showName: true,
      showState: true,
      showLabel: false,
      nameColor: '#ffffff',
      stateColor: 'rgba(255, 255, 255, 0.7)',
      fontSize: '13px',
      iconColor: 'rgba(180, 140, 255, 0.9)',
      imgCellStyles: `position: absolute
bottom: 6px
left: 6px
opacity: 0.9
filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
      extraStyles: `justify-content: flex-start
align-items: flex-start
padding: 10px
min-height: 80px`,
    }
  },
  {
    name: 'Area Card - Blue',
    description: 'Room area card style with blue tint',
    category: 'icon-styles',
    config: {
      backgroundColor: '#1a2a40',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '16px',
      size: '60%',
      layout: 'vertical',
      showName: true,
      showState: true,
      showLabel: false,
      nameColor: '#ffffff',
      stateColor: 'rgba(255, 255, 255, 0.7)',
      fontSize: '13px',
      iconColor: 'rgba(100, 180, 255, 0.9)',
      imgCellStyles: `position: absolute
bottom: 6px
left: 6px
opacity: 0.9
filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
      extraStyles: `justify-content: flex-start
align-items: flex-start
padding: 10px
min-height: 80px`,
    }
  },
  {
    name: 'Area Card - Green',
    description: 'Room area card style with green tint',
    category: 'icon-styles',
    config: {
      backgroundColor: '#1a3020',
      backgroundColorOpacity: 100,
      color: '#ffffff',
      borderRadius: '16px',
      size: '60%',
      layout: 'vertical',
      showName: true,
      showState: true,
      showLabel: false,
      nameColor: '#ffffff',
      stateColor: 'rgba(255, 255, 255, 0.7)',
      fontSize: '13px',
      iconColor: 'rgba(100, 220, 140, 0.9)',
      imgCellStyles: `position: absolute
bottom: 6px
left: 6px
opacity: 0.9
filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
      extraStyles: `justify-content: flex-start
align-items: flex-start
padding: 10px
min-height: 80px`,
    }
  },
  {
    name: 'Badge Icon - Top Right',
    description: 'Small status badge icon in top-right',
    category: 'icon-styles',
    config: {
      size: '24px',
      padding: '4px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      backgroundColorOpacity: 100,
      showName: false,
      showState: false,
      iconColor: '#ffffff',
      extraStyles: `width: 32px
height: 32px
min-width: unset
position: absolute
top: -4px
right: -4px`,
    }
  },
  {
    name: 'Badge Icon - Notification',
    description: 'Red notification badge style',
    category: 'icon-styles',
    config: {
      size: '18px',
      padding: '2px',
      borderRadius: '50%',
      backgroundColor: '#ef4444',
      backgroundColorOpacity: 100,
      showName: false,
      showState: false,
      iconColor: '#ffffff',
      extraStyles: `width: 24px
height: 24px
min-width: unset`,
    }
  },
  {
    name: 'Overlay Info Icon',
    description: 'Icon with semi-transparent info overlay',
    category: 'icon-styles',
    config: {
      size: '50%',
      layout: 'vertical',
      showName: true,
      showState: true,
      backgroundColor: '#1a1a1a',
      backgroundColorOpacity: 90,
      borderRadius: '12px',
      iconColor: 'rgba(255, 255, 255, 0.8)',
      imgCellStyles: `position: absolute
bottom: 10px
left: 10px
opacity: 0.7`,
      extraStyles: `position: relative
overflow: hidden`,
      gridStyles: `position: absolute
top: 8px
left: 8px
right: 8px`,
    }
  },
  {
    name: 'Watermark Icon',
    description: 'Large faded icon as background watermark',
    category: 'icon-styles',
    config: {
      size: '80%',
      showName: true,
      showState: true,
      iconColor: 'rgba(255, 255, 255, 0.1)',
      imgCellStyles: `position: absolute
bottom: -10%
right: -10%
opacity: 0.5
transform: rotate(-15deg)`,
      extraStyles: `overflow: hidden`,
    }
  },
  {
    name: 'Split Card Icon',
    description: 'Icon on left side with info on right',
    category: 'icon-styles',
    config: {
      size: '45%',
      layout: 'icon_name_state',
      showName: true,
      showState: true,
      borderRadius: '12px',
      imgCellStyles: `background: rgba(255, 255, 255, 0.1)
border-radius: 10px
padding: 12px
margin-right: 8px`,
    }
  },
];

export const applyPreset = (preset: Preset): Partial<ButtonConfig> => {
  return { ...DEFAULT_CONFIG, ...preset.config };
};
