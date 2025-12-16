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
    name: 'Brightness Slider (On/Off)',
    description: 'Light brightness slider with tap toggle',
    category: 'slider',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'slider',
      icon: 'mdi:lightbulb',
      tap_action: { action: 'toggle' },
      show_name: true,
      show_icon: true,
      show_slider_value: true,
      min_value: 0,
      max_value: 100,
      step: 1,
    }
  },
  {
    name: 'Volume Slider (Media)',
    description: 'Media player volume with live update',
    category: 'slider',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'slider',
      icon: 'mdi:volume-high',
      show_name: true,
      show_icon: true,
      slider_live_update: true,
      min_value: 0,
      max_value: 1,
      step: 0.01,
    }
  },
  {
    name: 'Cover Position Slider',
    description: 'Position slider with tap to open',
    category: 'slider',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'slider',
      icon: 'mdi:roller-shade',
      tap_action: { action: 'call-service', service: 'cover.open_cover' },
      hold_action: { action: 'call-service', service: 'cover.stop_cover' },
      show_slider_value: true,
      min_value: 0,
      max_value: 100,
      step: 5,
    }
  },
  {
    name: 'Fan Speed Slider',
    description: 'Fan percentage slider with 0 allowed',
    category: 'slider',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'slider',
      icon: 'mdi:fan',
      allow_light_slider_to_0: true,
      min_value: 0,
      max_value: 100,
      step: 5,
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
    }
  },

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
      styles: `:host { --bubble-main-background-color: rgba(26,26,26,1) !important; }
.bubble-button-card-container { border-radius: 12px !important; }
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
      styles: `:host { --bubble-main-background-color: rgba(245,245,245,1) !important; }
.bubble-button-card-container { border-radius: 12px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important; }
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
      styles: `:host { --bubble-main-background-color: rgba(255,255,255,0.05) !important; }
.bubble-button-card-container { border-radius: 8px !important; }
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
      styles: `:host { --bubble-main-background-color: rgba(0,0,0,0) !important; }
.bubble-button-card-container { border-radius: 8px !important; border: 1px solid #444444 !important; }
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
      styles: `:host { --bubble-main-background-color: rgba(30,30,30,1) !important; }
.bubble-button-card-container { border-radius: 16px !important; box-shadow: 0 10px 15px rgba(0,0,0,0.4) !important; }
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
      styles: `:host { --bubble-main-background-color: rgba(255,255,255,0.15) !important; }
ha-card { backdrop-filter: blur(10px) !important; }
.bubble-button-card-container { border-radius: 16px !important; border: 1px solid rgba(255,255,255,0.2) !important; box-shadow: 0 10px 15px rgba(0,0,0,0.2) !important; }
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
      styles: `:host { --bubble-main-background-color: rgba(0,0,0,0.4) !important; }
ha-card { backdrop-filter: blur(20px) !important; }
.bubble-button-card-container { border-radius: 16px !important; border: 1px solid rgba(255,255,255,0.1) !important; box-shadow: 0 20px 25px rgba(0,0,0,0.3) !important; }
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
      styles: `:host { --bubble-main-background-color: rgba(136,204,255,0.15) !important; }
ha-card { backdrop-filter: blur(15px) !important; }
.bubble-button-card-container { border-radius: 16px !important; border: 1px solid rgba(136,204,255,0.3) !important; box-shadow: 0 10px 15px rgba(0,136,255,0.2) !important; }
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
      styles: `:host { --bubble-main-background-color: rgba(255,136,170,0.15) !important; }
ha-card { backdrop-filter: blur(12px) !important; }
.bubble-button-card-container { border-radius: 20px !important; border: 1px solid rgba(255,136,170,0.3) !important; box-shadow: 0 10px 15px rgba(255,68,136,0.25) !important; }
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
      styles: `:host { --bubble-main-background-color: rgba(255,255,255,0.08) !important; }
ha-card { backdrop-filter: blur(30px) !important; }
.bubble-button-card-container { border-radius: 12px !important; border: 1px solid rgba(255,255,255,0.15) !important; box-shadow: 0 4px 6px rgba(255,255,255,0.1) !important; }
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
      styles: `:host { --bubble-main-background-color: rgba(10,10,10,1) !important; }
.bubble-button-card-container { border-radius: 8px !important; border: 2px solid #00ff88 !important; box-shadow: 0 10px 15px rgba(0,255,136,0.5) !important; }
.bubble-name, .bubble-icon { color: #00ff88 !important; }`
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
      styles: `:host { --bubble-main-background-color: rgba(15,15,26,1) !important; }
.bubble-button-card-container { border-radius: 8px !important; border: 2px solid #bf00ff !important; box-shadow: 0 10px 15px rgba(191,0,255,0.6) !important; }
.bubble-name, .bubble-icon { color: #bf00ff !important; }`
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
      styles: `:host { --bubble-main-background-color: rgba(26,15,10,1) !important; }
.bubble-button-card-container { border-radius: 8px !important; border: 2px solid #ff6600 !important; box-shadow: 0 10px 15px rgba(255,102,0,0.5) !important; }
.bubble-name, .bubble-icon { color: #ff6600 !important; }`
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
      styles: `:host { --bubble-main-background-color: rgba(10,26,26,1) !important; }
.bubble-button-card-container { border-radius: 8px !important; border: 2px solid #00ffff !important; box-shadow: 0 20px 25px rgba(0,255,255,0.6) !important; }
.bubble-name, .bubble-icon { color: #00ffff !important; }`
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
      styles: `:host { --bubble-main-background-color: rgba(26,10,20,1) !important; }
.bubble-button-card-container { border-radius: 8px !important; border: 2px solid #ff0080 !important; box-shadow: 0 20px 25px rgba(255,0,128,0.55) !important; }
.bubble-name, .bubble-icon { color: #ff0080 !important; }`
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
      styles: `:host { --bubble-main-background-color: rgba(26,26,10,1) !important; }
.bubble-button-card-container { border-radius: 8px !important; border: 2px solid #ffff00 !important; box-shadow: 0 10px 15px rgba(255,255,0,0.5) !important; }
.bubble-name, .bubble-icon { color: #ffff00 !important; }`
    }
  },

  // ============================================
  // 3D STYLES
  // ============================================
  {
    name: 'Neumorphism Light',
    description: 'Soft UI neumorphic style',
    category: '3d',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host { --bubble-main-background-color: rgba(224,224,224,1) !important; }
.bubble-button-card-container { border-radius: 20px !important; box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff !important; }
.bubble-name { color: #444444 !important; }
.bubble-icon { color: #666666 !important; }`
    }
  },
  {
    name: 'Neumorphism Dark',
    description: 'Dark neumorphic style',
    category: '3d',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host { --bubble-main-background-color: rgba(45,45,45,1) !important; }
.bubble-button-card-container { border-radius: 20px !important; box-shadow: 8px 8px 16px #1a1a1a, -8px -8px 16px #404040 !important; }
.bubble-name { color: #ffffff !important; }
.bubble-icon { color: #888888 !important; }`
    }
  },
  {
    name: 'Embossed',
    description: 'Embossed raised effect',
    category: '3d',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host { --bubble-main-background-color: rgba(51,51,51,1) !important; }
.bubble-button-card-container { border-radius: 12px !important; box-shadow: inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.4) !important; }
.bubble-name { color: #ffffff !important; }`
    }
  },

  // ============================================
  // GRADIENT STYLES
  // ============================================
  {
    name: 'Sunset Gradient',
    description: 'Warm sunset colors',
    category: 'gradient',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important; border-radius: 12px !important; }
.bubble-name { color: #ffffff !important; }`
    }
  },
  {
    name: 'Ocean Gradient',
    description: 'Cool ocean blue tones',
    category: 'gradient',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; border-radius: 12px !important; }
.bubble-name { color: #ffffff !important; }`
    }
  },
  {
    name: 'Aurora Gradient',
    description: 'Northern lights effect',
    category: 'gradient',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container { background: linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%) !important; border-radius: 12px !important; }
.bubble-name { color: #ffffff !important; }`
    }
  },
  {
    name: 'Fire Gradient',
    description: 'Hot fire colors',
    category: 'gradient',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container { background: linear-gradient(135deg, #f12711 0%, #f5af19 100%) !important; border-radius: 12px !important; }
.bubble-name { color: #ffffff !important; }`
    }
  },
  {
    name: 'Emerald Gradient',
    description: 'Rich emerald green',
    category: 'gradient',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important; border-radius: 12px !important; }
.bubble-name { color: #ffffff !important; }`
    }
  },

  // ============================================
  // CYBERPUNK STYLES
  // ============================================
  {
    name: 'Matrix Green',
    description: 'Matrix hacker style',
    category: 'cyberpunk',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host { --bubble-main-background-color: rgba(10,10,10,1) !important; }
.bubble-button-card-container { border-radius: 0px !important; border: 1px solid #00ff00 !important; box-shadow: 0 0 5px #00ff00, inset 0 0 10px rgba(0,255,0,0.05) !important; }
.bubble-name, .bubble-icon { color: #00ff00 !important; text-shadow: 0 0 5px #00ff00 !important; font-family: monospace !important; text-transform: uppercase !important; }`
    }
  },
  {
    name: 'Tron Blue',
    description: 'Tron legacy style',
    category: 'cyberpunk',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host { --bubble-main-background-color: rgba(0,0,0,1) !important; }
.bubble-button-card-container { border-radius: 2px !important; border: 2px solid #00d4ff !important; box-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff, inset 0 0 15px rgba(0,212,255,0.1) !important; }
.bubble-name, .bubble-icon { color: #00d4ff !important; }`
    }
  },
  {
    name: 'Synthwave',
    description: '80s synthwave aesthetic',
    category: 'cyberpunk',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container { background: linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 100%) !important; border-radius: 8px !important; border: 2px solid #ff6ec7 !important; box-shadow: 0 0 15px #ff6ec7, 0 0 30px rgba(255,110,199,0.3) !important; }
.bubble-name { color: #ff6ec7 !important; }
.bubble-icon { color: #00ffff !important; }`
    }
  },

  // ============================================
  // RETRO STYLES
  // ============================================
  {
    name: 'Gameboy',
    description: 'Classic Gameboy LCD',
    category: 'retro',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host { --bubble-main-background-color: rgba(155,188,15,1) !important; }
.bubble-button-card-container { border-radius: 4px !important; box-shadow: inset 2px 2px 0 #8bac0f, inset -2px -2px 0 #306230 !important; }
.bubble-name, .bubble-icon { color: #0f380f !important; font-family: monospace !important; }`
    }
  },
  {
    name: 'Arcade',
    description: 'Classic arcade cabinet',
    category: 'retro',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `:host { --bubble-main-background-color: rgba(0,0,0,1) !important; }
.bubble-button-card-container { border-radius: 8px !important; border: 3px solid #ff0000 !important; box-shadow: inset 0 0 20px rgba(255,255,0,0.1), 0 0 10px rgba(255,0,0,0.5) !important; }
.bubble-name, .bubble-icon { color: #ffff00 !important; font-family: monospace !important; text-transform: uppercase !important; }`
    }
  },

  // ============================================
  // NATURE STYLES
  // ============================================
  {
    name: 'Forest',
    description: 'Deep forest green',
    category: 'nature',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container { background: linear-gradient(180deg, #1a3a1a 0%, #0d1f0d 100%) !important; border-radius: 12px !important; }
.bubble-name, .bubble-icon { color: #90EE90 !important; }`
    }
  },
  {
    name: 'Ocean Deep',
    description: 'Deep ocean blue',
    category: 'nature',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container { background: linear-gradient(180deg, #1a3a5e 0%, #0a1a2e 100%) !important; border-radius: 12px !important; }
.bubble-name, .bubble-icon { color: #87CEEB !important; }`
    }
  },
  {
    name: 'Sunset Sky',
    description: 'Warm sunset tones',
    category: 'nature',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container { background: linear-gradient(180deg, #ff6b35 0%, #2e1a1a 100%) !important; border-radius: 12px !important; }
.bubble-name { color: #ffcc80 !important; }
.bubble-icon { color: #ff8c00 !important; }`
    }
  },
  {
    name: 'Night Sky',
    description: 'Starry night aesthetic',
    category: 'nature',
    cardType: 'button',
    config: {
      card_type: 'button',
      button_type: 'switch',
      show_name: true,
      show_icon: true,
      styles: `.bubble-button-card-container { background: radial-gradient(ellipse at top, #1a1a3e 0%, #0a0a1a 100%) !important; border-radius: 12px !important; }
.bubble-name { color: #e0e0ff !important; }
.bubble-icon { color: #ffd700 !important; }`
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
  // CALENDAR PRESETS
  // ============================================
  {
    name: 'Agenda – 3 Days',
    description: 'Compact agenda for the next few days',
    category: 'custom',
    cardType: 'calendar',
    config: {
      card_type: 'calendar',
      entities: [
        { entity: 'calendar.home' },
      ],
      days: 3,
      limit: 6,
      show_end: true,
      show_progress: true,
    },
  },
  {
    name: 'Work & Personal',
    description: 'Two calendars side-by-side colors',
    category: 'custom',
    cardType: 'calendar',
    config: {
      card_type: 'calendar',
      entities: [
        { entity: 'calendar.work', color: '#42a5f5' },
        { entity: 'calendar.personal', color: '#ef6c00' },
      ],
      days: 7,
      limit: 10,
      show_end: true,
      show_progress: false,
    },
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
  { value: 'minimal', label: 'Minimal' },
  { value: 'glass', label: 'Glass' },
  { value: 'neon', label: 'Neon' },
  { value: 'animated', label: 'Animated' },
  { value: '3d', label: '3D Effects' },
  { value: 'gradient', label: 'Gradients' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'retro', label: 'Retro' },
  { value: 'nature', label: 'Nature' },
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
  { value: 'cover', label: 'Cover' },
  { value: 'media-player', label: 'Media Player' },
  { value: 'climate', label: 'Climate' },
  { value: 'select', label: 'Select' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'horizontal-buttons-stack', label: 'Horizontal Stack' },
  { value: 'empty-column', label: 'Empty Column' },
];
