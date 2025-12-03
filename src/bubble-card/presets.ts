// Bubble Card Presets

import { BubblePreset } from './types';

export const BUBBLE_PRESETS: BubblePreset[] = [
  // ============================================
  // BASIC BUTTON PRESETS
  // ============================================
  {
    name: 'Simple Switch',
    description: 'Basic toggle button',
    category: 'basic',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
    }
  },
  {
    name: 'Light Switch',
    description: 'Light toggle with icon',
    category: 'basic',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      icon: 'mdi:lightbulb',
      show_name: true,
      show_icon: true,
    }
  },
  {
    name: 'Power Button',
    description: 'Generic power toggle',
    category: 'basic',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      icon: 'mdi:power',
      show_name: true,
      show_icon: true,
    }
  },
  {
    name: 'Fan Control',
    description: 'Fan toggle button',
    category: 'basic',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      icon: 'mdi:fan',
      show_name: true,
      show_icon: true,
    }
  },

  // ============================================
  // SLIDER PRESETS
  // ============================================
  {
    name: 'Light Dimmer',
    description: 'Brightness slider for lights',
    category: 'slider',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'slider',
      icon: 'mdi:lightbulb',
      show_name: true,
      show_icon: true,
    }
  },
  {
    name: 'Volume Slider',
    description: 'Volume control for media players',
    category: 'slider',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'slider',
      icon: 'mdi:volume-high',
      show_name: true,
      show_icon: true,
    }
  },
  {
    name: 'Cover Position',
    description: 'Blind/curtain position slider',
    category: 'slider',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'slider',
      icon: 'mdi:blinds',
      show_name: true,
      show_icon: true,
    }
  },
  {
    name: 'Fan Speed',
    description: 'Fan speed percentage slider',
    category: 'slider',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'slider',
      icon: 'mdi:fan',
      show_name: true,
      show_icon: true,
    }
  },

  // ============================================
  // STATE PRESETS
  // ============================================
  {
    name: 'Temperature Sensor',
    description: 'Display temperature reading',
    category: 'state',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'state',
      icon: 'mdi:thermometer',
      show_name: true,
      show_icon: true,
      show_state: true,
    }
  },
  {
    name: 'Humidity Sensor',
    description: 'Display humidity percentage',
    category: 'state',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'state',
      icon: 'mdi:water-percent',
      show_name: true,
      show_icon: true,
      show_state: true,
    }
  },
  {
    name: 'Battery Level',
    description: 'Display battery percentage',
    category: 'state',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'state',
      icon: 'mdi:battery',
      show_name: true,
      show_icon: true,
      show_state: true,
    }
  },
  {
    name: 'Power Meter',
    description: 'Display power consumption',
    category: 'state',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'state',
      icon: 'mdi:flash',
      show_name: true,
      show_icon: true,
      show_state: true,
    }
  },
  {
    name: 'Last Changed',
    description: 'Shows when entity last changed',
    category: 'state',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'state',
      show_name: true,
      show_icon: true,
      show_last_changed: true,
    }
  },

  // ============================================
  // SUB-BUTTON PRESETS
  // ============================================
  {
    name: 'Light with Brightness',
    description: 'Light toggle with brightness sub-button',
    category: 'sub-buttons',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      icon: 'mdi:lightbulb',
      show_name: true,
      sub_button: [
        {
          id: 'brightness',
          show_background: false,
          show_attribute: true,
          attribute: 'brightness',
          show_icon: false,
        }
      ]
    }
  },
  {
    name: 'Vacuum Card',
    description: 'Vacuum with status and controls',
    category: 'sub-buttons',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      icon: 'mdi:robot-vacuum',
      show_name: true,
      show_state: true,
      show_last_changed: true,
      sub_button: [
        {
          id: 'battery',
          icon: 'mdi:battery',
          show_name: false,
          show_icon: true,
          show_background: false,
          show_attribute: true,
          attribute: 'battery_level',
        },
        {
          id: 'dock',
          icon: 'mdi:home',
          show_background: false,
          tap_action: {
            action: 'call-service',
            service: 'vacuum.return_to_base',
          }
        },
        {
          id: 'pause',
          icon: 'mdi:pause',
          show_background: false,
          tap_action: {
            action: 'call-service',
            service: 'vacuum.pause',
          }
        },
        {
          id: 'start',
          icon: 'mdi:play',
          tap_action: {
            action: 'call-service',
            service: 'vacuum.start',
          }
        }
      ]
    }
  },
  {
    name: 'Media Controls',
    description: 'Light with media control sub-buttons',
    category: 'sub-buttons',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'state',
      icon: 'mdi:speaker',
      show_name: true,
      show_state: true,
      sub_button: [
        {
          id: 'prev',
          icon: 'mdi:skip-previous',
          show_background: false,
          tap_action: {
            action: 'call-service',
            service: 'media_player.media_previous_track',
          }
        },
        {
          id: 'play',
          icon: 'mdi:play-pause',
          tap_action: {
            action: 'call-service',
            service: 'media_player.media_play_pause',
          }
        },
        {
          id: 'next',
          icon: 'mdi:skip-next',
          show_background: false,
          tap_action: {
            action: 'call-service',
            service: 'media_player.media_next_track',
          }
        }
      ]
    }
  },
  {
    name: 'Weather Info',
    description: 'Weather with temperature sub-buttons',
    category: 'sub-buttons',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'state',
      icon: 'mdi:weather-partly-cloudy',
      show_name: true,
      show_state: true,
      card_layout: 'large-2-rows',
      sub_button: [
        {
          id: 'inside',
          icon: 'mdi:home-thermometer-outline',
          show_state: true,
          show_icon: true,
          show_background: false,
        },
        {
          id: 'outside',
          icon: 'mdi:thermometer',
          show_state: true,
          show_background: false,
        },
        {
          id: 'today',
          show_name: true,
          name: 'Today',
          show_state: true,
        },
        {
          id: 'tomorrow',
          show_name: true,
          name: 'Tomorrow',
          show_state: true,
          show_background: false,
        }
      ]
    }
  },
  {
    name: 'Slider with Toggle',
    description: 'Brightness slider with toggle sub-button',
    category: 'sub-buttons',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'slider',
      icon: 'mdi:lightbulb',
      show_name: true,
      sub_button: [
        {
          id: 'brightness',
          show_icon: false,
          show_background: false,
          show_attribute: true,
          attribute: 'brightness',
        },
        {
          id: 'toggle',
          icon: 'mdi:lightbulb',
          tap_action: {
            action: 'toggle',
          }
        }
      ]
    }
  },

  // ============================================
  // LARGE LAYOUT PRESETS
  // ============================================
  {
    name: 'Large Button',
    description: 'Bigger button for section view',
    category: 'basic',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      card_layout: 'large',
      show_name: true,
      show_icon: true,
    }
  },
  {
    name: 'Energy Dashboard',
    description: 'Large card with energy stats',
    category: 'sub-buttons',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'state',
      card_layout: 'large-2-rows',
      icon: 'mdi:home-lightning-bolt-outline',
      show_name: true,
      show_state: true,
      sub_button: [
        {
          id: 'counter',
          icon: 'mdi:counter',
          show_background: false,
          show_state: true,
        },
        {
          id: 'today',
          show_state: true,
          show_background: false,
        },
        {
          id: 'daily',
          show_background: false,
          show_state: true,
        },
        {
          id: 'weekly',
          icon: 'mdi:calendar-week',
          show_state: true,
          show_background: false,
        }
      ]
    }
  },

  // ============================================
  // SEPARATOR PRESETS
  // ============================================
  {
    name: 'Simple Divider',
    description: 'Basic section divider',
    category: 'basic',
    cardType: 'separator',
    config: {
      card_type: 'separator',
      name: 'Section',
      icon: 'mdi:label',
    }
  },
  {
    name: 'Lights Section',
    description: 'Divider for lights',
    category: 'basic',
    cardType: 'separator',
    config: {
      card_type: 'separator',
      name: 'Lights',
      icon: 'mdi:lightbulb-group',
    }
  },
  {
    name: 'Devices Section',
    description: 'Divider for devices',
    category: 'basic',
    cardType: 'separator',
    config: {
      card_type: 'separator',
      name: 'Devices',
      icon: 'mdi:devices',
    }
  },
  {
    name: 'Settings Section',
    description: 'Divider for settings',
    category: 'basic',
    cardType: 'separator',
    config: {
      card_type: 'separator',
      name: 'Settings',
      icon: 'mdi:cog',
    }
  },

  // ============================================
  // CUSTOM STYLED PRESETS
  // ============================================
  {
    name: 'Glassmorphism',
    description: 'Modern glass effect',
    category: 'custom',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `ha-card {
  --bubble-main-background-color: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}`
    }
  },
  {
    name: 'Neon Glow',
    description: 'Glowing neon effect',
    category: 'custom',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.5);
}
.bubble-icon {
  color: cyan !important;
}`
    }
  },
  {
    name: 'Gradient Background',
    description: 'Purple to blue gradient',
    category: 'custom',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
.bubble-icon, .bubble-name {
  color: white !important;
}`
    }
  },
  {
    name: 'Minimal Outline',
    description: 'Clean outline style',
    category: 'custom',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container {
  background: transparent !important;
  border: 2px solid var(--primary-color);
}
.bubble-button-background {
  display: none;
}`
    }
  },
  {
    name: 'Dark Mode',
    description: 'Dark themed button',
    category: 'custom',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `ha-card {
  --bubble-main-background-color: #1a1a2e !important;
  --bubble-icon-background-color: #16213e !important;
}
.bubble-icon {
  color: #e94560 !important;
}`
    }
  },
];

// Export preset categories for filtering
export const BUBBLE_PRESET_CATEGORIES = [
  { value: 'basic', label: 'Basic' },
  { value: 'slider', label: 'Sliders' },
  { value: 'state', label: 'State Display' },
  { value: 'sub-buttons', label: 'Sub-buttons' },
  { value: 'custom', label: 'Custom Styles' },
];

// Export card type filters
export const BUBBLE_CARD_TYPE_FILTERS = [
  { value: 'all', label: 'All Types' },
  { value: 'button', label: 'Button' },
  { value: 'separator', label: 'Separator' },
  { value: 'pop-up', label: 'Pop-up' },
];
