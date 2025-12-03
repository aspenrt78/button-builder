// Bubble Card YAML Generator

import {
  BubbleConfig,
  BubbleButtonConfig,
  BubbleSeparatorConfig,
  BubblePopUpConfig,
  BubbleCoverConfig,
  BubbleMediaPlayerConfig,
  BubbleClimateConfig,
  BubbleSelectConfig,
  BubbleCalendarConfig,
  BubbleHorizontalButtonsStackConfig,
  BubbleSubButton,
  BubbleAction,
} from '../types';
import { DEFAULT_BUBBLE_BUTTON_CONFIG } from '../constants';

// ============================================
// HELPER FUNCTIONS
// ============================================

function indent(str: string, spaces: number = 2): string {
  const pad = ' '.repeat(spaces);
  return str.split('\n').map(line => pad + line).join('\n');
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    // Check if it needs quotes (contains special chars or is empty)
    if (value === '' || value.includes(':') || value.includes('#') || value.includes("'") || value.includes('"') || value.includes('\n')) {
      // Use single quotes, escape internal single quotes
      return `'${value.replace(/'/g, "''")}'`;
    }
    return value;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return String(value);
}

// ============================================
// ACTION GENERATOR
// ============================================

function generateActionYaml(action: BubbleAction, indentLevel: number = 0): string {
  const lines: string[] = [];
  const pad = '  '.repeat(indentLevel);
  
  lines.push(`${pad}action: ${action.action}`);
  
  if (action.navigation_path) {
    lines.push(`${pad}navigation_path: ${formatValue(action.navigation_path)}`);
  }
  if (action.url_path) {
    lines.push(`${pad}url_path: ${formatValue(action.url_path)}`);
  }
  if (action.service) {
    lines.push(`${pad}service: ${action.service}`);
  }
  if (action.data && Object.keys(action.data).length > 0) {
    lines.push(`${pad}data:`);
    for (const [key, val] of Object.entries(action.data)) {
      lines.push(`${pad}  ${key}: ${formatValue(val)}`);
    }
  }
  if (action.target) {
    lines.push(`${pad}target:`);
    if (action.target.entity_id) {
      if (Array.isArray(action.target.entity_id)) {
        lines.push(`${pad}  entity_id:`);
        action.target.entity_id.forEach(id => lines.push(`${pad}    - ${id}`));
      } else {
        lines.push(`${pad}  entity_id: ${action.target.entity_id}`);
      }
    }
    if (action.target.device_id) {
      lines.push(`${pad}  device_id: ${formatValue(action.target.device_id)}`);
    }
    if (action.target.area_id) {
      lines.push(`${pad}  area_id: ${formatValue(action.target.area_id)}`);
    }
  }
  if (action.confirmation) {
    lines.push(`${pad}confirmation:`);
    if (action.confirmation.text) {
      lines.push(`${pad}  text: ${formatValue(action.confirmation.text)}`);
    }
  }
  
  return lines.join('\n');
}

// ============================================
// SUB-BUTTON GENERATOR
// ============================================

function generateSubButtonYaml(subButton: BubbleSubButton, indentLevel: number = 1): string {
  const lines: string[] = [];
  const pad = '  '.repeat(indentLevel);
  
  // First property goes on the same line as - or on next line
  if (subButton.entity) lines.push(`${pad}entity: ${subButton.entity}`);
  if (subButton.name) lines.push(`${pad}name: ${formatValue(subButton.name)}`);
  if (subButton.icon) lines.push(`${pad}icon: ${subButton.icon}`);
  
  // Only output non-default boolean values
  if (subButton.show_background === false) lines.push(`${pad}show_background: false`);
  if (subButton.show_state === true) lines.push(`${pad}show_state: true`);
  if (subButton.show_name === true) lines.push(`${pad}show_name: true`);
  if (subButton.show_icon === false) lines.push(`${pad}show_icon: false`);
  if (subButton.show_last_changed === true) lines.push(`${pad}show_last_changed: true`);
  if (subButton.show_last_updated === true) lines.push(`${pad}show_last_updated: true`);
  if (subButton.show_attribute === true) {
    lines.push(`${pad}show_attribute: true`);
    if (subButton.attribute) lines.push(`${pad}attribute: ${subButton.attribute}`);
  }
  if (subButton.select_attribute) lines.push(`${pad}select_attribute: ${subButton.select_attribute}`);
  
  // Actions
  if (subButton.tap_action && subButton.tap_action.action !== 'more-info') {
    lines.push(`${pad}tap_action:`);
    lines.push(generateActionYaml(subButton.tap_action, indentLevel + 1));
  }
  if (subButton.double_tap_action && subButton.double_tap_action.action !== 'none') {
    lines.push(`${pad}double_tap_action:`);
    lines.push(generateActionYaml(subButton.double_tap_action, indentLevel + 1));
  }
  if (subButton.hold_action && subButton.hold_action.action !== 'more-info') {
    lines.push(`${pad}hold_action:`);
    lines.push(generateActionYaml(subButton.hold_action, indentLevel + 1));
  }
  
  return lines.join('\n');
}

/**
 * Helper to add sub-buttons to a card's YAML output
 */
function addSubButtonsToYaml(lines: string[], subButtons: BubbleSubButton[] | undefined): void {
  if (!subButtons || subButtons.length === 0) return;
  
  lines.push('sub_button:');
  subButtons.forEach(sb => {
    const sbLines: string[] = [];
    
    if (sb.entity) sbLines.push(`entity: ${sb.entity}`);
    if (sb.name) sbLines.push(`name: ${formatValue(sb.name)}`);
    if (sb.icon) sbLines.push(`icon: ${sb.icon}`);
    
    // Boolean flags (only output non-defaults)
    if (sb.show_background === false) sbLines.push('show_background: false');
    if (sb.show_state === true) sbLines.push('show_state: true');
    if (sb.show_name === true) sbLines.push('show_name: true');
    if (sb.show_icon === false) sbLines.push('show_icon: false');
    if (sb.show_last_changed === true) sbLines.push('show_last_changed: true');
    if (sb.show_last_updated === true) sbLines.push('show_last_updated: true');
    if (sb.show_attribute === true) {
      sbLines.push('show_attribute: true');
      if (sb.attribute) sbLines.push(`attribute: ${sb.attribute}`);
    }
    if (sb.select_attribute) sbLines.push(`select_attribute: ${sb.select_attribute}`);
    
    // Actions for sub-buttons
    if (sb.tap_action && sb.tap_action.action !== 'more-info') {
      sbLines.push('tap_action:');
      const actionLines = generateActionYaml(sb.tap_action, 1).split('\n');
      actionLines.forEach(l => sbLines.push(l));
    }
    if (sb.double_tap_action && sb.double_tap_action.action !== 'none') {
      sbLines.push('double_tap_action:');
      const actionLines = generateActionYaml(sb.double_tap_action, 1).split('\n');
      actionLines.forEach(l => sbLines.push(l));
    }
    if (sb.hold_action && sb.hold_action.action !== 'more-info') {
      sbLines.push('hold_action:');
      const actionLines = generateActionYaml(sb.hold_action, 1).split('\n');
      actionLines.forEach(l => sbLines.push(l));
    }
    
    // Format as YAML list item with first property on same line as -
    if (sbLines.length > 0) {
      lines.push(`  - ${sbLines[0]}`);
      for (let i = 1; i < sbLines.length; i++) {
        lines.push(`    ${sbLines[i]}`);
      }
    }
  });
}

/**
 * Helper to add custom styles to a card's YAML output
 */
function addStylesToYaml(lines: string[], styles: string | undefined): void {
  if (!styles || !styles.trim()) return;
  
  lines.push('styles: |');
  styles.split('\n').forEach(line => {
    lines.push(`  ${line}`);
  });
}

// ============================================
// BUTTON CARD GENERATOR
// ============================================

function generateButtonYaml(config: BubbleButtonConfig): string {
  const lines: string[] = [];
  const defaults = DEFAULT_BUBBLE_BUTTON_CONFIG;
  
  // Required fields
  lines.push('type: custom:bubble-card');
  lines.push('card_type: button');
  
  // Entity (required for most button types)
  if (config.entity) {
    lines.push(`entity: ${config.entity}`);
  }
  
  // Button type (only if not default)
  if (config.button_type && config.button_type !== 'switch') {
    lines.push(`button_type: ${config.button_type}`);
  }
  
  // Name & Icon
  if (config.name) lines.push(`name: ${formatValue(config.name)}`);
  if (config.icon) lines.push(`icon: ${config.icon}`);
  if (config.force_icon === true) lines.push('force_icon: true');
  
  // Visibility (only output non-defaults)
  if (config.show_name === false) lines.push('show_name: false');
  if (config.show_icon === false) lines.push('show_icon: false');
  if (config.show_state === true) lines.push('show_state: true');
  if (config.show_last_changed === true) lines.push('show_last_changed: true');
  if (config.show_last_updated === true) lines.push('show_last_updated: true');
  if (config.show_attribute === true) {
    lines.push('show_attribute: true');
    if (config.attribute) lines.push(`attribute: ${config.attribute}`);
  }
  if (config.scrolling_effect === false) lines.push('scrolling_effect: false');
  if (config.use_accent_color === true) lines.push('use_accent_color: true');
  
  // Layout
  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  
  // Slider options (only when button_type is slider)
  if (config.button_type === 'slider') {
    if (config.min_value !== undefined && config.min_value !== 0) {
      lines.push(`min_value: ${config.min_value}`);
    }
    if (config.max_value !== undefined && config.max_value !== 100) {
      lines.push(`max_value: ${config.max_value}`);
    }
    if (config.step !== undefined && config.step !== 1) {
      lines.push(`step: ${config.step}`);
    }
    if (config.tap_to_slide === true) lines.push('tap_to_slide: true');
    if (config.relative_slide === true) lines.push('relative_slide: true');
    if (config.read_only_slider === true) lines.push('read_only_slider: true');
    if (config.slider_live_update === true) lines.push('slider_live_update: true');
    if (config.allow_light_slider_to_0 === true) lines.push('allow_light_slider_to_0: true');
    if (config.light_transition === true) {
      lines.push('light_transition: true');
      if (config.light_transition_time !== 500) {
        lines.push(`light_transition_time: ${config.light_transition_time}`);
      }
    }
  }
  
  // Button actions
  if (config.button_action) {
    lines.push('button_action:');
    if (config.button_action.tap_action) {
      lines.push('  tap_action:');
      lines.push(generateActionYaml(config.button_action.tap_action, 2));
    }
    if (config.button_action.double_tap_action) {
      lines.push('  double_tap_action:');
      lines.push(generateActionYaml(config.button_action.double_tap_action, 2));
    }
    if (config.button_action.hold_action) {
      lines.push('  hold_action:');
      lines.push(generateActionYaml(config.button_action.hold_action, 2));
    }
  }
  
  // Icon actions
  if (config.tap_action && config.tap_action.action !== 'more-info') {
    lines.push('tap_action:');
    lines.push(generateActionYaml(config.tap_action, 1));
  }
  if (config.double_tap_action && config.double_tap_action.action !== 'none') {
    lines.push('double_tap_action:');
    lines.push(generateActionYaml(config.double_tap_action, 1));
  }
  if (config.hold_action && config.hold_action.action !== 'more-info') {
    lines.push('hold_action:');
    lines.push(generateActionYaml(config.hold_action, 1));
  }
  
  // Sub-buttons
  addSubButtonsToYaml(lines, config.sub_button);
  
  // Custom styles
  addStylesToYaml(lines, config.styles);
  
  return lines.join('\n');
}

// ============================================
// SEPARATOR CARD GENERATOR
// ============================================

function generateSeparatorYaml(config: BubbleSeparatorConfig): string {
  const lines: string[] = [];
  
  lines.push('type: custom:bubble-card');
  lines.push('card_type: separator');
  
  if (config.name) lines.push(`name: ${formatValue(config.name)}`);
  if (config.icon) lines.push(`icon: ${config.icon}`);
  
  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  
  // Sub-buttons
  addSubButtonsToYaml(lines, config.sub_button);
  
  // Custom styles
  addStylesToYaml(lines, config.styles);
  
  return lines.join('\n');
}

// ============================================
// POP-UP GENERATOR
// ============================================

function generatePopUpYaml(config: BubblePopUpConfig): string {
  const lines: string[] = [];
  
  lines.push('type: custom:bubble-card');
  lines.push('card_type: pop-up');
  lines.push(`hash: ${formatValue(config.hash)}`);
  
  if (config.name) lines.push(`name: ${formatValue(config.name)}`);
  if (config.icon) lines.push(`icon: ${config.icon}`);
  if (config.entity) lines.push(`entity: ${config.entity}`);
  
  // Pop-up specific options
  if (config.auto_close) lines.push(`auto_close: ${config.auto_close}`);
  if (config.close_on_click === true) lines.push('close_on_click: true');
  if (config.close_by_clicking_outside === false) lines.push('close_by_clicking_outside: false');
  if (config.width_desktop) lines.push(`width_desktop: ${config.width_desktop}`);
  if (config.margin) lines.push(`margin: ${config.margin}`);
  if (config.margin_top_mobile) lines.push(`margin_top_mobile: ${config.margin_top_mobile}`);
  if (config.margin_top_desktop) lines.push(`margin_top_desktop: ${config.margin_top_desktop}`);
  if (config.bg_color) lines.push(`bg_color: ${formatValue(config.bg_color)}`);
  if (config.bg_opacity !== undefined) lines.push(`bg_opacity: ${config.bg_opacity}`);
  if (config.bg_blur !== undefined) lines.push(`bg_blur: ${config.bg_blur}`);
  if (config.shadow_opacity !== undefined) lines.push(`shadow_opacity: ${config.shadow_opacity}`);
  if (config.hide_backdrop === true) lines.push('hide_backdrop: true');
  if (config.background_update === true) lines.push('background_update: true');
  if (config.show_header === true) lines.push('show_header: true');
  
  // Trigger
  if (config.trigger_entity) {
    lines.push(`trigger_entity: ${config.trigger_entity}`);
    if (config.trigger_state) lines.push(`trigger_state: ${formatValue(config.trigger_state)}`);
    if (config.trigger_close === true) lines.push('trigger_close: true');
  }
  
  // Actions
  if (config.open_action) {
    lines.push('open_action:');
    lines.push(generateActionYaml(config.open_action, 1));
  }
  if (config.close_action) {
    lines.push('close_action:');
    lines.push(generateActionYaml(config.close_action, 1));
  }
  
  // Custom styles
  addStylesToYaml(lines, config.styles);
  
  return lines.join('\n');
}

// ============================================
// HORIZONTAL BUTTONS STACK GENERATOR
// ============================================

function generateHorizontalButtonsStackYaml(config: BubbleHorizontalButtonsStackConfig): string {
  const lines: string[] = [];
  
  lines.push('type: custom:bubble-card');
  lines.push('card_type: horizontal-buttons-stack');
  
  // Convert buttons array to numbered format
  if (config.buttons && config.buttons.length > 0) {
    config.buttons.forEach((btn, index) => {
      const num = index + 1;
      lines.push(`${num}_link: ${formatValue(btn.link)}`);
      if (btn.name) lines.push(`${num}_name: ${formatValue(btn.name)}`);
      if (btn.icon) lines.push(`${num}_icon: ${btn.icon}`);
      if (btn.entity) lines.push(`${num}_entity: ${btn.entity}`);
      if (btn.pir_sensor) lines.push(`${num}_pir_sensor: ${btn.pir_sensor}`);
    });
  }
  
  if (config.auto_order === true) lines.push('auto_order: true');
  if (config.margin) lines.push(`margin: ${config.margin}`);
  if (config.width_desktop) lines.push(`width_desktop: ${config.width_desktop}`);
  if (config.is_sidebar_hidden === true) lines.push('is_sidebar_hidden: true');
  if (config.rise_animation === false) lines.push('rise_animation: false');
  if (config.highlight_current_view === true) lines.push('highlight_current_view: true');
  if (config.hide_gradient === true) lines.push('hide_gradient: true');
  
  // Custom styles
  addStylesToYaml(lines, config.styles);
  
  return lines.join('\n');
}

// ============================================
// COVER GENERATOR
// ============================================

function generateCoverYaml(config: BubbleCoverConfig): string {
  const lines: string[] = [];
  
  lines.push('type: custom:bubble-card');
  lines.push('card_type: cover');
  
  if (config.entity) lines.push(`entity: ${config.entity}`);
  if (config.name) lines.push(`name: ${formatValue(config.name)}`);
  if (config.force_icon === true) lines.push('force_icon: true');
  
  // Visibility
  if (config.show_name === false) lines.push('show_name: false');
  if (config.show_icon === false) lines.push('show_icon: false');
  if (config.show_state === true) lines.push('show_state: true');
  if (config.show_last_changed === true) lines.push('show_last_changed: true');
  if (config.show_last_updated === true) lines.push('show_last_updated: true');
  if (config.show_attribute === true) {
    lines.push('show_attribute: true');
    if (config.attribute) lines.push(`attribute: ${config.attribute}`);
  }
  if (config.scrolling_effect === false) lines.push('scrolling_effect: false');
  
  // Cover-specific icons
  if (config.icon_open) lines.push(`icon_open: ${config.icon_open}`);
  if (config.icon_close) lines.push(`icon_close: ${config.icon_close}`);
  if (config.icon_up) lines.push(`icon_up: ${config.icon_up}`);
  if (config.icon_down) lines.push(`icon_down: ${config.icon_down}`);
  
  // Custom services
  if (config.open_service) lines.push(`open_service: ${config.open_service}`);
  if (config.stop_service) lines.push(`stop_service: ${config.stop_service}`);
  if (config.close_service) lines.push(`close_service: ${config.close_service}`);
  
  // Layout
  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  
  // Actions
  if (config.tap_action && config.tap_action.action !== 'more-info') {
    lines.push('tap_action:');
    lines.push(generateActionYaml(config.tap_action, 1));
  }
  if (config.double_tap_action && config.double_tap_action.action !== 'none') {
    lines.push('double_tap_action:');
    lines.push(generateActionYaml(config.double_tap_action, 1));
  }
  if (config.hold_action && config.hold_action.action !== 'more-info') {
    lines.push('hold_action:');
    lines.push(generateActionYaml(config.hold_action, 1));
  }
  
  // Button actions
  if (config.button_action) {
    lines.push('button_action:');
    if (config.button_action.tap_action) {
      lines.push('  tap_action:');
      lines.push(generateActionYaml(config.button_action.tap_action, 2));
    }
    if (config.button_action.double_tap_action) {
      lines.push('  double_tap_action:');
      lines.push(generateActionYaml(config.button_action.double_tap_action, 2));
    }
    if (config.button_action.hold_action) {
      lines.push('  hold_action:');
      lines.push(generateActionYaml(config.button_action.hold_action, 2));
    }
  }
  
  // Sub-buttons
  addSubButtonsToYaml(lines, config.sub_button);
  
  // Custom styles
  addStylesToYaml(lines, config.styles);
  
  return lines.join('\n');
}

// ============================================
// MEDIA PLAYER GENERATOR
// ============================================

function generateMediaPlayerYaml(config: BubbleMediaPlayerConfig): string {
  const lines: string[] = [];
  
  lines.push('type: custom:bubble-card');
  lines.push('card_type: media-player');
  
  if (config.entity) lines.push(`entity: ${config.entity}`);
  if (config.name) lines.push(`name: ${formatValue(config.name)}`);
  if (config.icon) lines.push(`icon: ${config.icon}`);
  if (config.force_icon === true) lines.push('force_icon: true');
  
  // Visibility
  if (config.show_name === false) lines.push('show_name: false');
  if (config.show_icon === false) lines.push('show_icon: false');
  if (config.show_state === true) lines.push('show_state: true');
  if (config.show_last_changed === true) lines.push('show_last_changed: true');
  if (config.show_last_updated === true) lines.push('show_last_updated: true');
  if (config.show_attribute === true) {
    lines.push('show_attribute: true');
    if (config.attribute) lines.push(`attribute: ${config.attribute}`);
  }
  if (config.scrolling_effect === false) lines.push('scrolling_effect: false');
  
  // Media player specific
  if (config.min_volume !== undefined && config.min_volume !== 0) {
    lines.push(`min_volume: ${config.min_volume}`);
  }
  if (config.max_volume !== undefined && config.max_volume !== 100) {
    lines.push(`max_volume: ${config.max_volume}`);
  }
  if (config.cover_background === true) lines.push('cover_background: true');
  
  // Hide options
  if (config.hide) {
    const hideLines: string[] = [];
    if (config.hide.play_pause_button) hideLines.push('  play_pause_button: true');
    if (config.hide.volume_button) hideLines.push('  volume_button: true');
    if (config.hide.previous_button) hideLines.push('  previous_button: true');
    if (config.hide.next_button) hideLines.push('  next_button: true');
    if (config.hide.power_button) hideLines.push('  power_button: true');
    if (hideLines.length > 0) {
      lines.push('hide:');
      lines.push(...hideLines);
    }
  }
  
  // Layout
  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  
  // Actions
  if (config.tap_action && config.tap_action.action !== 'more-info') {
    lines.push('tap_action:');
    lines.push(generateActionYaml(config.tap_action, 1));
  }
  if (config.double_tap_action && config.double_tap_action.action !== 'none') {
    lines.push('double_tap_action:');
    lines.push(generateActionYaml(config.double_tap_action, 1));
  }
  if (config.hold_action && config.hold_action.action !== 'more-info') {
    lines.push('hold_action:');
    lines.push(generateActionYaml(config.hold_action, 1));
  }
  
  // Button actions
  if (config.button_action) {
    lines.push('button_action:');
    if (config.button_action.tap_action) {
      lines.push('  tap_action:');
      lines.push(generateActionYaml(config.button_action.tap_action, 2));
    }
    if (config.button_action.double_tap_action) {
      lines.push('  double_tap_action:');
      lines.push(generateActionYaml(config.button_action.double_tap_action, 2));
    }
    if (config.button_action.hold_action) {
      lines.push('  hold_action:');
      lines.push(generateActionYaml(config.button_action.hold_action, 2));
    }
  }
  
  // Sub-buttons
  addSubButtonsToYaml(lines, config.sub_button);
  
  // Custom styles
  addStylesToYaml(lines, config.styles);
  
  return lines.join('\n');
}

// ============================================
// CLIMATE GENERATOR
// ============================================

function generateClimateYaml(config: BubbleClimateConfig): string {
  const lines: string[] = [];
  
  lines.push('type: custom:bubble-card');
  lines.push('card_type: climate');
  
  if (config.entity) lines.push(`entity: ${config.entity}`);
  if (config.name) lines.push(`name: ${formatValue(config.name)}`);
  if (config.icon) lines.push(`icon: ${config.icon}`);
  if (config.force_icon === true) lines.push('force_icon: true');
  
  // Visibility
  if (config.show_name === false) lines.push('show_name: false');
  if (config.show_icon === false) lines.push('show_icon: false');
  if (config.show_state === true) lines.push('show_state: true');
  
  // Climate specific
  if (config.hide_target_temp_low === true) lines.push('hide_target_temp_low: true');
  if (config.hide_target_temp_high === true) lines.push('hide_target_temp_high: true');
  if (config.state_color === false) lines.push('state_color: false');
  if (config.step !== undefined && config.step !== 1) {
    lines.push(`step: ${config.step}`);
  }
  if (config.min_temp !== undefined) {
    lines.push(`min_temp: ${config.min_temp}`);
  }
  if (config.max_temp !== undefined) {
    lines.push(`max_temp: ${config.max_temp}`);
  }
  
  // Layout
  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  
  // Actions
  if (config.tap_action && config.tap_action.action !== 'more-info') {
    lines.push('tap_action:');
    lines.push(generateActionYaml(config.tap_action, 1));
  }
  if (config.double_tap_action && config.double_tap_action.action !== 'none') {
    lines.push('double_tap_action:');
    lines.push(generateActionYaml(config.double_tap_action, 1));
  }
  if (config.hold_action && config.hold_action.action !== 'more-info') {
    lines.push('hold_action:');
    lines.push(generateActionYaml(config.hold_action, 1));
  }
  
  // Button actions
  if (config.button_action) {
    lines.push('button_action:');
    if (config.button_action.tap_action) {
      lines.push('  tap_action:');
      lines.push(generateActionYaml(config.button_action.tap_action, 2));
    }
    if (config.button_action.double_tap_action) {
      lines.push('  double_tap_action:');
      lines.push(generateActionYaml(config.button_action.double_tap_action, 2));
    }
    if (config.button_action.hold_action) {
      lines.push('  hold_action:');
      lines.push(generateActionYaml(config.button_action.hold_action, 2));
    }
  }
  
  // Sub-buttons
  addSubButtonsToYaml(lines, config.sub_button);
  
  // Custom styles
  addStylesToYaml(lines, config.styles);
  
  return lines.join('\n');
}

// ============================================
// SELECT GENERATOR
// ============================================

function generateSelectYaml(config: BubbleSelectConfig): string {
  const lines: string[] = [];
  
  lines.push('type: custom:bubble-card');
  lines.push('card_type: select');
  
  if (config.entity) lines.push(`entity: ${config.entity}`);
  if (config.name) lines.push(`name: ${formatValue(config.name)}`);
  if (config.icon) lines.push(`icon: ${config.icon}`);
  if (config.force_icon === true) lines.push('force_icon: true');
  
  // Visibility
  if (config.show_name === false) lines.push('show_name: false');
  if (config.show_icon === false) lines.push('show_icon: false');
  if (config.show_state === true) lines.push('show_state: true');
  if (config.show_last_changed === true) lines.push('show_last_changed: true');
  if (config.show_last_updated === true) lines.push('show_last_updated: true');
  if (config.show_attribute === true) {
    lines.push('show_attribute: true');
    if (config.attribute) lines.push(`attribute: ${config.attribute}`);
  }
  if (config.scrolling_effect === false) lines.push('scrolling_effect: false');
  
  // Layout
  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  
  // Actions
  if (config.tap_action && config.tap_action.action !== 'more-info') {
    lines.push('tap_action:');
    lines.push(generateActionYaml(config.tap_action, 1));
  }
  if (config.double_tap_action && config.double_tap_action.action !== 'none') {
    lines.push('double_tap_action:');
    lines.push(generateActionYaml(config.double_tap_action, 1));
  }
  if (config.hold_action && config.hold_action.action !== 'more-info') {
    lines.push('hold_action:');
    lines.push(generateActionYaml(config.hold_action, 1));
  }
  
  // Sub-buttons
  addSubButtonsToYaml(lines, config.sub_button);
  
  // Custom styles
  addStylesToYaml(lines, config.styles);
  
  return lines.join('\n');
}

// ============================================
// CALENDAR GENERATOR
// ============================================

function generateCalendarYaml(config: BubbleCalendarConfig): string {
  const lines: string[] = [];
  
  lines.push('type: custom:bubble-card');
  lines.push('card_type: calendar');
  
  // Entities
  if (config.entities && config.entities.length > 0) {
    lines.push('entities:');
    config.entities.forEach(ent => {
      lines.push(`  - entity: ${ent.entity}`);
      if (ent.color) lines.push(`    color: ${ent.color}`);
    });
  }
  
  // Calendar options
  if (config.days !== undefined && config.days !== 7) {
    lines.push(`days: ${config.days}`);
  }
  if (config.limit !== undefined) {
    lines.push(`limit: ${config.limit}`);
  }
  if (config.show_end === true) lines.push('show_end: true');
  if (config.show_progress === true) lines.push('show_progress: true');
  if (config.scrolling_effect === false) lines.push('scrolling_effect: false');
  
  // Layout
  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  
  // Event actions
  if (config.event_action) {
    lines.push('event_action:');
    if (config.event_action.tap_action) {
      lines.push('  tap_action:');
      lines.push(generateActionYaml(config.event_action.tap_action, 2));
    }
    if (config.event_action.double_tap_action) {
      lines.push('  double_tap_action:');
      lines.push(generateActionYaml(config.event_action.double_tap_action, 2));
    }
    if (config.event_action.hold_action) {
      lines.push('  hold_action:');
      lines.push(generateActionYaml(config.event_action.hold_action, 2));
    }
  }
  
  // Card-level actions
  if (config.tap_action && config.tap_action.action !== 'more-info') {
    lines.push('tap_action:');
    lines.push(generateActionYaml(config.tap_action, 1));
  }
  if (config.double_tap_action && config.double_tap_action.action !== 'none') {
    lines.push('double_tap_action:');
    lines.push(generateActionYaml(config.double_tap_action, 1));
  }
  if (config.hold_action && config.hold_action.action !== 'more-info') {
    lines.push('hold_action:');
    lines.push(generateActionYaml(config.hold_action, 1));
  }
  
  // Sub-buttons
  addSubButtonsToYaml(lines, config.sub_button);
  
  // Custom styles
  addStylesToYaml(lines, config.styles);
  
  return lines.join('\n');
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateBubbleYaml(config: BubbleConfig): string {
  switch (config.card_type) {
    case 'button':
      return generateButtonYaml(config as BubbleButtonConfig);
    case 'separator':
      return generateSeparatorYaml(config as BubbleSeparatorConfig);
    case 'pop-up':
      return generatePopUpYaml(config as BubblePopUpConfig);
    case 'cover':
      return generateCoverYaml(config as BubbleCoverConfig);
    case 'media-player':
      return generateMediaPlayerYaml(config as BubbleMediaPlayerConfig);
    case 'climate':
      return generateClimateYaml(config as BubbleClimateConfig);
    case 'select':
      return generateSelectYaml(config as BubbleSelectConfig);
    case 'calendar':
      return generateCalendarYaml(config as BubbleCalendarConfig);
    case 'horizontal-buttons-stack':
      return generateHorizontalButtonsStackYaml(config as BubbleHorizontalButtonsStackConfig);
    case 'empty-column':
      return 'type: custom:bubble-card\ncard_type: empty-column';
    default:
      return '# Unknown card type';
  }
}
