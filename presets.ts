import { ButtonConfig, DEFAULT_CONFIG } from './types';

export interface Preset {
  name: string;
  description: string;
  category: 'minimal' | 'glass' | 'neon' | 'animated' | 'custom';
  config: Partial<ButtonConfig>;
}

export const PRESETS: Preset[] = [
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
];

export const applyPreset = (preset: Preset): Partial<ButtonConfig> => {
  return { ...DEFAULT_CONFIG, ...preset.config };
};
