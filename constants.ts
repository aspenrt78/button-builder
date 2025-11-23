

export const LAYOUT_OPTIONS = [
  { value: 'vertical', label: 'Vertical (Default)' },
  { value: 'icon_name_state', label: 'Icon - Name - State' },
  { value: 'icon_name_state2nd', label: 'Icon - Name (State 2nd)' },
  { value: 'icon_state', label: 'Icon - State' },
  { value: 'icon_state_name2nd', label: 'Icon - State (Name 2nd)' },
  { value: 'name_state', label: 'Name - State' },
  { value: 'icon_label', label: 'Icon - Label' },
];

export const ACTION_OPTIONS = [
  { value: 'toggle', label: 'Toggle' },
  { value: 'more-info', label: 'More Info' },
  { value: 'call-service', label: 'Call Service' },
  { value: 'navigate', label: 'Navigate' },
  { value: 'url', label: 'URL' },
  { value: 'assist', label: 'Assist' },
  { value: 'fire-dom-event', label: 'Fire DOM Event' },
  { value: 'none', label: 'None' },
];

export const CONDITIONAL_OPERATORS = [
  { value: 'equals', label: 'Equals (=)' },
  { value: 'not_equals', label: 'Not Equals (≠)' },
  { value: 'above', label: 'Above (>)' },
  { value: 'below', label: 'Below (<)' },
  { value: 'contains', label: 'Contains' },
];

export const TRANSFORM_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'capitalize', label: 'Capitalize' },
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'lowercase', label: 'Lowercase' },
];

export const WEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: 'lighter', label: 'Lighter' },
  { value: 'bolder', label: 'Bolder' },
];

export const BORDER_STYLE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
  { value: 'groove', label: 'Groove' },
];

export const ANIMATION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'spin', label: 'Spin (Rotate)' },
  { value: 'blink', label: 'Blink' },
  { value: 'pulse', label: 'Pulse (Glow)' },
  { value: 'flash', label: 'Flash' },
  { value: 'jiggle', label: 'Jiggle' },
  { value: 'shake', label: 'Shake' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'marquee', label: 'Marquee (Card Only)' },
];

export const TRIGGER_OPTIONS = [
  { value: 'always', label: 'Always' },
  { value: 'on', label: 'When ON' },
  { value: 'off', label: 'When OFF' },
];

export const BLUR_OPTIONS = [
  { value: '0px', label: 'None' },
  { value: '2px', label: 'Subtle' },
  { value: '5px', label: 'Medium' },
  { value: '10px', label: 'Heavy' },
  { value: '20px', label: 'Frosted' },
];

export const SHADOW_SIZE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: 'inner', label: 'Inner Shadow' },
];

// Mock icons for preview mapping (since we don't load all MDIs)
export const MOCK_ICONS = [
  'mdi:sofa', 'mdi:lightbulb', 'mdi:fan', 'mdi:lock', 'mdi:garage', 'mdi:home', 'mdi:music', 'mdi:power'
];
