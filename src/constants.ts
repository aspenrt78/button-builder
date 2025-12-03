
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
  { value: 'none', label: 'None' },
  { value: 'toggle', label: 'Toggle' },
  { value: 'more-info', label: 'More Info' },
  { value: 'call-service', label: 'Call Service' },
  { value: 'perform-action', label: 'Perform Action' },
  { value: 'navigate', label: 'Navigate' },
  { value: 'url', label: 'URL' },
  { value: 'assist', label: 'Assist' },
  { value: 'fire-dom-event', label: 'Fire DOM Event' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'multi-actions', label: 'Multi-Actions' },
  { value: 'toast', label: 'Toast Notification' },
];

export const LOCK_UNLOCK_OPTIONS = [
  { value: 'tap', label: 'Tap' },
  { value: 'hold', label: 'Hold' },
  { value: 'double_tap', label: 'Double Tap' },
];

export const STATE_OPERATOR_OPTIONS = [
  { value: 'equals', label: 'Equals (=)' },
  { value: 'not_equals', label: 'Not Equals (≠)' },
  { value: 'above', label: 'Above (>)' },
  { value: 'below', label: 'Below (<)' },
  { value: 'regex', label: 'Regex Match' },
  { value: 'template', label: 'Template' },
  { value: 'default', label: 'Default (Fallback)' },
];

export const CONDITIONAL_OPERATORS = [
  { value: 'equals', label: 'Equals (=)' },
  { value: 'not_equals', label: 'Not Equals (≠)' },
  { value: 'above', label: 'Above (>)' },
  { value: 'below', label: 'Below (<)' },
  { value: 'regex', label: 'Regex Match' },
  { value: 'template', label: 'Template' },
  { value: 'default', label: 'Default (Fallback)' },
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

export const COLOR_TYPE_OPTIONS = [
  { value: 'card', label: 'Card (Default)' },
  { value: 'icon', label: 'Icon Only' },
  { value: 'blank-card', label: 'Blank Card' },
  { value: 'label-card', label: 'Label Card' },
];

export const ANIMATION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'spin', label: 'Spin / Rotate' },
  { value: 'blink', label: 'Blink' },
  { value: 'pulse', label: 'Pulse (Scale)' },
  { value: 'flash', label: 'Flash (Opacity)' },
  { value: 'jiggle', label: 'Jiggle' },
  { value: 'shake', label: 'Shake' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'glow', label: 'Glow (Shadow Pulse)' },
  { value: 'float', label: 'Float (Up/Down)' },
  { value: 'swing', label: 'Swing (Pendulum)' },
  { value: 'rubberBand', label: 'Rubber Band' },
  { value: 'tada', label: 'Tada (Attention)' },
  { value: 'heartbeat', label: 'Heartbeat' },
  { value: 'flip', label: 'Flip (3D)' },
  { value: 'wobble', label: 'Wobble' },
  { value: 'breathe', label: 'Breathe (Opacity)' },
  { value: 'ripple', label: 'Ripple Effect' },
  { value: 'marquee', label: 'Marquee Border (Card Only)' },
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

export const PROTECT_TYPE_OPTIONS = [
  { value: 'pin', label: 'PIN Code' },
  { value: 'password', label: 'Password' },
];

export const HAPTIC_TYPE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'failure', label: 'Failure' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'selection', label: 'Selection' },
];

export const LIVE_STREAM_FIT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'contain', label: 'Contain' },
  { value: 'cover', label: 'Cover' },
  { value: 'fill', label: 'Fill' },
];

export const LETTER_SPACING_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: '-0.05em', label: 'Tighter' },
  { value: '-0.025em', label: 'Tight' },
  { value: '0.025em', label: 'Wide' },
  { value: '0.05em', label: 'Wider' },
  { value: '0.1em', label: 'Widest' },
  { value: '1px', label: '1px' },
  { value: '2px', label: '2px' },
  { value: '3px', label: '3px' },
];

export const LINE_HEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: '1', label: 'None (1)' },
  { value: '1.25', label: 'Tight (1.25)' },
  { value: '1.375', label: 'Snug (1.375)' },
  { value: '1.5', label: 'Relaxed (1.5)' },
  { value: '1.75', label: 'Loose (1.75)' },
  { value: '2', label: 'Double (2)' },
];

export const FONT_FAMILY_OPTIONS = [
  { value: '', label: 'Default (System)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans MS' },
  { value: 'Roboto, sans-serif', label: 'Roboto (Google)' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans (Google)' },
  { value: 'Lato, sans-serif', label: 'Lato (Google)' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat (Google)' },
  { value: 'Poppins, sans-serif', label: 'Poppins (Google)' },
  { value: 'Oswald, sans-serif', label: 'Oswald (Google)' },
  { value: 'Raleway, sans-serif', label: 'Raleway (Google)' },
  { value: 'Ubuntu, sans-serif', label: 'Ubuntu (Google)' },
  { value: 'Playfair Display, serif', label: 'Playfair Display (Google)' },
  { value: 'Merriweather, serif', label: 'Merriweather (Google)' },
];

// Mock icons for preview mapping (since we don't load all MDIs)
export const MOCK_ICONS = [
  'mdi:sofa', 'mdi:lightbulb', 'mdi:fan', 'mdi:lock', 'mdi:garage', 'mdi:home', 'mdi:music', 'mdi:power'
];
