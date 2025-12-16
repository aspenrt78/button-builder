// Bubble Card Presets - Complete Transfer from Button Card

import { BubblePreset } from './types';

// Helper to convert button card styles to bubble card styles
const convertToBubbleStyles = (buttonConfig: any): Partial<any> => {
  const bubbleConfig: any = {
    card_type: 'button',
    button_type: 'switch',
    show_name: true,
    show_icon: true,
  };

  // Convert common properties
  if (buttonConfig.backgroundColor || buttonConfig.backgroundColorOpacity !== undefined) {
    // Convert to bubble CSS variable format
    const opacity = (buttonConfig.backgroundColorOpacity || 100) / 100;
    if (buttonConfig.backgroundColor) {
      const hex = buttonConfig.backgroundColor;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      bubbleConfig.styles = (bubbleConfig.styles || '') + `\n:host {\n  --bubble-main-background-color: rgba(${r}, ${g}, ${b}, ${opacity}) !important;\n}`;
    }
  }

  // Convert colors
  if (buttonConfig.color) {
    bubbleConfig.styles = (bubbleConfig.styles || '') + `\n.bubble-name { color: ${buttonConfig.color} !important; }`;
  }
  if (buttonConfig.iconColor) {
    bubbleConfig.styles = (bubbleConfig.styles || '') + `\n.bubble-icon { color: ${buttonConfig.iconColor} !important; }`;
  }

  // Convert border radius
  if (buttonConfig.borderRadius) {
    bubbleConfig.styles = (bubbleConfig.styles || '') + `\n.bubble-button-card-container { border-radius: ${buttonConfig.borderRadius} !important; }`;
  }

  // Convert borders
  if (buttonConfig.borderWidth && buttonConfig.borderStyle && buttonConfig.borderColor) {
    bubbleConfig.styles = (bubbleConfig.styles || '') + `\n.bubble-button-card-container { border: ${buttonConfig.borderWidth} ${buttonConfig.borderStyle} ${buttonConfig.borderColor} !important; }`;
  }

  // Convert animations
  if (buttonConfig.cardAnimation) {
    bubbleConfig.card_animation = buttonConfig.cardAnimation;
    bubbleConfig.card_animation_trigger = buttonConfig.cardAnimationTrigger || 'on';
    bubbleConfig.card_animation_speed = buttonConfig.cardAnimationSpeed || '2s';
  }
  if (buttonConfig.iconAnimation) {
    bubbleConfig.icon_animation_type = buttonConfig.iconAnimation;
    bubbleConfig.icon_animation_trigger = buttonConfig.iconAnimationTrigger || 'on';
    bubbleConfig.icon_animation_speed = buttonConfig.iconAnimationSpeed || '2s';
  }

  // Convert extra styles
  if (buttonConfig.extraStyles) {
    bubbleConfig.styles = (bubbleConfig.styles || '') + `\n.bubble-button-card-container {\n${buttonConfig.extraStyles}\n}`;
  }

  // Convert backdrop blur
  if (buttonConfig.backdropBlur) {
    bubbleConfig.styles = (bubbleConfig.styles || '') + `\nha-card { backdrop-filter: blur(${buttonConfig.backdropBlur}) !important; }`;
  }

  // Convert shadows
  if (buttonConfig.shadowSize && buttonConfig.shadowSize !== 'none') {
    const shadowMap: any = {
      'sm': '0 1px 2px rgba(0,0,0,0.05)',
      'md': '0 4px 6px rgba(0,0,0,0.1)',
      'lg': '0 10px 15px rgba(0,0,0,0.1)',
      'xl': '0 20px 25px rgba(0,0,0,0.1)',
    };
    const shadow = shadowMap[buttonConfig.shadowSize] || shadowMap.md;
    bubbleConfig.styles = (bubbleConfig.styles || '') + `\n.bubble-button-card-container { box-shadow: ${shadow} !important; }`;
  }

  return bubbleConfig;
};

export const BUBBLE_PRESETS: BubblePreset[] = [
  // ============================================
  // MINIMAL STYLES
  // ============================================
  {
    name: 'Minimal Dark',
    description: 'Clean, dark minimal style',
    category: 'minimal',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host {
  --bubble-main-background-color: rgba(26, 26, 26, 1) !important;
}
.bubble-button-card-container {
  border-radius: 12px !important;
}
.bubble-name { color: #ffffff !important; }
.bubble-icon { color: #888888 !important; }`
    }
  },
  {
    name: 'Minimal Light',
    description: 'Clean, light minimal style',
    category: 'minimal',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host {
  --bubble-main-background-color: rgba(245, 245, 245, 1) !important;
}
.bubble-button-card-container {
  border-radius: 12px !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
}
.bubble-name { color: #1a1a1a !important; }
.bubble-icon { color: #666666 !important; }`
    }
  },
  {
    name: 'Invisible Touch',
    description: 'Nearly invisible, just a hint',
    category: 'minimal',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host {
  --bubble-main-background-color: rgba(255, 255, 255, 0.05) !important;
}
.bubble-button-card-container {
  border-radius: 8px !important;
}
.bubble-name { color: #888888 !important; }`
    }
  },
  {
    name: 'Outlined',
    description: 'Just a simple outline',
    category: 'minimal',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host {
  --bubble-main-background-color: rgba(0, 0, 0, 0) !important;
}
.bubble-button-card-container {
  border-radius: 8px !important;
  border: 1px solid #444444 !important;
}
.bubble-name { color: #ffffff !important; }`
    }
  },
  {
    name: 'Soft Shadow',
    description: 'Subtle with soft shadow',
    category: 'minimal',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host {
  --bubble-main-background-color: rgba(30, 30, 30, 1) !important;
}
.bubble-button-card-container {
  border-radius: 16px !important;
  box-shadow: 0 10px 15px rgba(0,0,0,0.4) !important;
}
.bubble-name { color: #ffffff !important; }`
    }
  },

  // ============================================
  // GLASS STYLES
  // ============================================
  {
    name: 'Glassmorphism',
    description: 'Frosted glass effect with blur',
    category: 'glass',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host {
  --bubble-main-background-color: rgba(255, 255, 255, 0.15) !important;
}
ha-card {
  backdrop-filter: blur(10px) !important;
}
.bubble-button-card-container {
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 10px 15px rgba(0,0,0,0.2) !important;
}
.bubble-name { color: #ffffff !important; }`
    }
  },
  {
    name: 'Glassmorphism Dark',
    description: 'Dark frosted glass effect',
    category: 'glass',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host {
  --bubble-main-background-color: rgba(0, 0, 0, 0.4) !important;
}
ha-card {
  backdrop-filter: blur(20px) !important;
}
.bubble-button-card-container {
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 20px 25px rgba(0,0,0,0.3) !important;
}
.bubble-name { color: #ffffff !important; }`
    }
  },
  {
    name: 'Ice Glass',
    description: 'Cold blue frosted glass',
    category: 'glass',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host {
  --bubble-main-background-color: rgba(136, 204, 255, 0.15) !important;
}
ha-card {
  backdrop-filter: blur(15px) !important;
}
.bubble-button-card-container {
  border-radius: 16px !important;
  border: 1px solid rgba(136, 204, 255, 0.3) !important;
  box-shadow: 0 10px 15px rgba(0, 136, 255, 0.2) !important;
}
.bubble-name { color: #ffffff !important; }
.bubble-icon { color: #88ccff !important; }`
    }
  },
  {
    name: 'Rose Glass',
    description: 'Soft pink frosted glass',
    category: 'glass',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host {
  --bubble-main-background-color: rgba(255, 136, 170, 0.15) !important;
}
ha-card {
  backdrop-filter: blur(12px) !important;
}
.bubble-button-card-container {
  border-radius: 20px !important;
  border: 1px solid rgba(255, 136, 170, 0.3) !important;
  box-shadow: 0 10px 15px rgba(255, 68, 136, 0.25) !important;
}
.bubble-name { color: #ffffff !important; }
.bubble-icon { color: #ff88aa !important; }`
    }
  },
  {
    name: 'Crystal Clear',
    description: 'Maximum blur transparency',
    category: 'glass',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host {
  --bubble-main-background-color: rgba(255, 255, 255, 0.08) !important;
}
ha-card {
  backdrop-filter: blur(30px) !important;
}
.bubble-button-card-container {
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 4px 6px rgba(255,255,255,0.1) !important;
}
.bubble-name { color: #ffffff !important; }`
    }
  },

  // ============================================
  // NEON STYLES
  // ============================================
  {
    name: 'Neon Glow',
    description: 'Vibrant neon with glow effect',
    category: 'neon',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      glow_effect: '#00ff88',
      styles: `:host {
  --bubble-main-background-color: rgba(10, 10, 10, 1) !important;
}
.bubble-button-card-container {
  border-radius: 8px !important;
  border: 2px solid #00ff88 !important;
  box-shadow: 0 10px 15px rgba(0, 255, 136, 0.5) !important;
}
.bubble-name { color: #00ff88 !important; }
.bubble-icon { color: #00ff88 !important; }`
    }
  },
  {
    name: 'Neon Purple',
    description: 'Purple neon cyberpunk style',
    category: 'neon',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      glow_effect: '#bf00ff',
      styles: `:host {
  --bubble-main-background-color: rgba(15, 15, 26, 1) !important;
}
.bubble-button-card-container {
  border-radius: 8px !important;
  border: 2px solid #bf00ff !important;
  box-shadow: 0 10px 15px rgba(191, 0, 255, 0.6) !important;
}
.bubble-name { color: #bf00ff !important; }
.bubble-icon { color: #bf00ff !important; }`
    }
  },
  {
    name: 'Neon Orange',
    description: 'Warm orange neon style',
    category: 'neon',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      glow_effect: '#ff6600',
      styles: `:host {
  --bubble-main-background-color: rgba(26, 15, 10, 1) !important;
}
.bubble-button-card-container {
  border-radius: 8px !important;
  border: 2px solid #ff6600 !important;
  box-shadow: 0 10px 15px rgba(255, 102, 0, 0.5) !important;
}
.bubble-name { color: #ff6600 !important; }
.bubble-icon { color: #ff6600 !important; }`
    }
  },
  {
    name: 'Neon Cyan',
    description: 'Electric cyan glow',
    category: 'neon',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      glow_effect: '#00ffff',
      styles: `:host {
  --bubble-main-background-color: rgba(10, 26, 26, 1) !important;
}
.bubble-button-card-container {
  border-radius: 8px !important;
  border: 2px solid #00ffff !important;
  box-shadow: 0 20px 25px rgba(0, 255, 255, 0.6) !important;
}
.bubble-name { color: #00ffff !important; }
.bubble-icon { color: #00ffff !important; }`
    }
  },
  {
    name: 'Neon Pink',
    description: 'Hot pink neon glow',
    category: 'neon',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      glow_effect: '#ff0080',
      styles: `:host {
  --bubble-main-background-color: rgba(26, 10, 20, 1) !important;
}
.bubble-button-card-container {
  border-radius: 8px !important;
  border: 2px solid #ff0080 !important;
  box-shadow: 0 20px 25px rgba(255, 0, 128, 0.55) !important;
}
.bubble-name { color: #ff0080 !important; }
.bubble-icon { color: #ff0080 !important; }`
    }
  },
  {
    name: 'Neon Yellow',
    description: 'Bright yellow electric',
    category: 'neon',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      glow_effect: '#ffff00',
      styles: `:host {
  --bubble-main-background-color: rgba(26, 26, 10, 1) !important;
}
.bubble-button-card-container {
  border-radius: 8px !important;
  border: 2px solid #ffff00 !important;
  box-shadow: 0 10px 15px rgba(255, 255, 0, 0.5) !important;
}
.bubble-name { color: #ffff00 !important; }
.bubble-icon { color: #ffff00 !important; }`
    }
  },

  // ============================================
  // ANIMATED STYLES
  // ============================================
  {
    name: 'Pulse Animation',
    description: 'Subtle pulse when entity is on',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'pulse',
      card_animation_trigger: 'on',
      card_animation_speed: '2s',
      styles: `:host {
  --bubble-main-background-color: rgba(28, 28, 28, 1) !important;
}`
    }
  },
  {
    name: 'Icon Spin',
    description: 'Spinning icon when active',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      icon_animation_type: 'spin',
      icon_animation_trigger: 'on',
      icon_animation_speed: '2s',
      styles: `:host {
  --bubble-main-background-color: rgba(28, 28, 28, 1) !important;
}`
    }
  },
  {
    name: 'Floating',
    description: 'Gentle floating motion',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'float',
      card_animation_trigger: 'always',
      card_animation_speed: '3s',
      styles: `:host {
  --bubble-main-background-color: rgba(28, 28, 28, 1) !important;
}
.bubble-button-card-container {
  box-shadow: 0 10px 15px rgba(0,0,0,0.4) !important;
}`
    }
  },
  {
    name: 'Heartbeat',
    description: 'Pulsing heartbeat when on',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'heartbeat',
      card_animation_trigger: 'on',
      card_animation_speed: '1.5s',
      styles: `:host {
  --bubble-main-background-color: rgba(42, 10, 10, 1) !important;
}
.bubble-name { color: #ff4444 !important; }
.bubble-icon { color: #ff4444 !important; }`
    }
  },
  {
    name: 'Breathing Glow',
    description: 'Soft breathing glow effect',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'breathe',
      card_animation_trigger: 'on',
      card_animation_speed: '3s',
      glow_effect: '#4488ff',
      styles: `:host {
  --bubble-main-background-color: rgba(10, 26, 42, 1) !important;
}
.bubble-button-card-container {
  box-shadow: 0 10px 15px rgba(68,136,255,0.4) !important;
}
.bubble-name { color: #4488ff !important; }
.bubble-icon { color: #4488ff !important; }`
    }
  },
  {
    name: 'Shake Alert',
    description: 'Shaking alert when on',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'shake',
      card_animation_trigger: 'on',
      card_animation_speed: '0.5s',
      styles: `:host {
  --bubble-main-background-color: rgba(42, 26, 10, 1) !important;
}
.bubble-name { color: #ff8800 !important; }
.bubble-icon { color: #ff8800 !important; }`
    }
  },
  {
    name: 'Bounce',
    description: 'Bouncy animation',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'bounce',
      card_animation_trigger: 'on',
      card_animation_speed: '1s',
      styles: `:host {
  --bubble-main-background-color: rgba(28, 28, 28, 1) !important;
}`
    }
  },
  {
    name: 'Wobble Jelly',
    description: 'Wobbly jelly effect',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'wobble',
      card_animation_trigger: 'on',
      card_animation_speed: '1s',
      styles: `:host {
  --bubble-main-background-color: rgba(26, 26, 46, 1) !important;
}
.bubble-button-card-container {
  border-radius: 20px !important;
}`
    }
  },
  {
    name: 'Tada!',
    description: 'Attention-grabbing tada',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'tada',
      card_animation_trigger: 'on',
      card_animation_speed: '1s',
      styles: `:host {
  --bubble-main-background-color: rgba(42, 26, 42, 1) !important;
}
.bubble-name { color: #ff44ff !important; }
.bubble-icon { color: #ff44ff !important; }`
    }
  },
  {
    name: 'Swing Pendulum',
    description: 'Swinging pendulum motion',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      icon_animation_type: 'swing',
      icon_animation_trigger: 'on',
      icon_animation_speed: '2s',
      styles: `:host {
  --bubble-main-background-color: rgba(28, 28, 28, 1) !important;
}`
    }
  },
  {
    name: 'Flip Card',
    description: '3D flip animation',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'flip',
      card_animation_trigger: 'on',
      card_animation_speed: '2s',
      styles: `:host {
  --bubble-main-background-color: rgba(28, 28, 28, 1) !important;
}`
    }
  },
  {
    name: 'Rubber Band',
    description: 'Elastic rubber band effect',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'rubberBand',
      card_animation_trigger: 'on',
      card_animation_speed: '1s',
      styles: `:host {
  --bubble-main-background-color: rgba(28, 28, 28, 1) !important;
}`
    }
  },
  {
    name: 'Flash Blink',
    description: 'Flashing blink effect',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'flash',
      card_animation_trigger: 'on',
      card_animation_speed: '1s',
      styles: `:host {
  --bubble-main-background-color: rgba(28, 28, 28, 1) !important;
}`
    }
  },
  {
    name: 'Ripple Wave',
    description: 'Rippling wave effect',
    category: 'animated',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      card_animation: 'ripple',
      card_animation_trigger: 'on',
      card_animation_speed: '1.5s',
      ripple_effect: true,
      styles: `:host {
  --bubble-main-background-color: rgba(10, 26, 42, 1) !important;
}
.bubble-name { color: #00aaff !important; }
.bubble-icon { color: #00aaff !important; }`
    }
  },

  // Continue with remaining categories in next part...
];

// Export preset categories for filtering
export const BUBBLE_PRESET_CATEGORIES = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'glass', label: 'Glass' },
  { value: 'neon', label: 'Neon' },
  { value: 'animated', label: 'Animated' },
  { value: '3d', label: '3D Effects' },
  { value: 'gradient', label: 'Gradients' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'retro', label: 'Retro' },
  { value: 'nature', label: 'Nature' },
  { value: 'custom', label: 'Custom' },
  { value: 'basic', label: 'Basic' },
  { value: 'slider', label: 'Sliders' },
  { value: 'state', label: 'State Display' },
  { value: 'sub-buttons', label: 'Sub-buttons' },
];

// Export card type filters
export const BUBBLE_CARD_TYPE_FILTERS = [
  { value: 'all', label: 'All Types' },
  { value: 'button', label: 'Button' },
  { value: 'separator', label: 'Separator' },
  { value: 'pop-up', label: 'Pop-up' },
  { value: 'cover', label: 'Cover' },
  { value: 'media-player', label: 'Media Player' },
  { value: 'climate', label: 'Climate' },
  { value: 'select', label: 'Select' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'horizontal-buttons-stack', label: 'Horizontal Stack' },
  { value: 'empty-column', label: 'Empty Column' },
];
