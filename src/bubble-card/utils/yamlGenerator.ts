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
  BubbleEmptyColumnConfig,
  BubbleSubButton,
  BubbleAction,
  BubbleCardLayout,
} from '../types';

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    if (value === '' || value.includes(':') || value.includes('#') || value.includes("'") || value.includes('"') || value.includes('\n')) {
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
  if (action.pipeline) {
    lines.push(`${pad}pipeline: ${formatValue(action.pipeline)}`);
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

  if (subButton.entity) lines.push(`${pad}entity: ${subButton.entity}`);
  if (subButton.name) lines.push(`${pad}name: ${formatValue(subButton.name)}`);
  if (subButton.icon) lines.push(`${pad}icon: ${subButton.icon}`);

  if (subButton.show_background === false) lines.push(`${pad}show_background: false`);
  if (subButton.state_background === false) lines.push(`${pad}state_background: false`);
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
  if (subButton.show_arrow === false) lines.push(`${pad}show_arrow: false`);

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

function addSubButtonsToYaml(lines: string[], subButtons: BubbleSubButton[] | undefined): void {
  if (!subButtons || subButtons.length === 0) return;

  lines.push('sub_button:');
  subButtons.forEach(sb => {
    const sbLines: string[] = [];

    if (sb.entity) sbLines.push(`entity: ${sb.entity}`);
    if (sb.name) sbLines.push(`name: ${formatValue(sb.name)}`);
    if (sb.icon) sbLines.push(`icon: ${sb.icon}`);

    if (sb.sub_button_type && sb.sub_button_type !== 'default') {
      sbLines.push(`sub_button_type: ${sb.sub_button_type}`);
    }

    if (sb.show_background === false) sbLines.push('show_background: false');
    if (sb.state_background === false) sbLines.push('state_background: false');
    if (sb.light_background === true) sbLines.push('light_background: true');
    if (sb.show_state === true) sbLines.push('show_state: true');
    if (sb.show_name === true) sbLines.push('show_name: true');
    if (sb.show_icon === false) sbLines.push('show_icon: false');
    if (sb.force_icon === true) sbLines.push('force_icon: true');
    if (sb.show_last_changed === true) sbLines.push('show_last_changed: true');
    if (sb.show_last_updated === true) sbLines.push('show_last_updated: true');
    if (sb.show_attribute === true) {
      sbLines.push('show_attribute: true');
      if (sb.attribute) sbLines.push(`attribute: ${sb.attribute}`);
    }
    if (sb.select_attribute) sbLines.push(`select_attribute: ${sb.select_attribute}`);
    if (sb.scrolling_effect === false) sbLines.push('scrolling_effect: false');
    if (sb.content_layout && sb.content_layout !== 'icon-left') {
      sbLines.push(`content_layout: ${sb.content_layout}`);
    }
    if (sb.hide_when_parent_unavailable === true) sbLines.push('hide_when_parent_unavailable: true');
    if (sb.show_arrow === false) sbLines.push('show_arrow: false');

    if (sb.sub_button_type === 'slider') {
      if (sb.min_value !== undefined && sb.min_value !== 0) sbLines.push(`min_value: ${sb.min_value}`);
      if (sb.max_value !== undefined && sb.max_value !== 100) sbLines.push(`max_value: ${sb.max_value}`);
      if (sb.step !== undefined && sb.step !== 1) sbLines.push(`step: ${sb.step}`);
      if (sb.tap_to_slide === true) sbLines.push('tap_to_slide: true');
      if (sb.read_only_slider === true) sbLines.push('read_only_slider: true');
      if (sb.slider_live_update === true) sbLines.push('slider_live_update: true');
      if (sb.slider_fill_orientation && sb.slider_fill_orientation !== 'left') {
        sbLines.push(`slider_fill_orientation: ${sb.slider_fill_orientation}`);
      }
      if (sb.slider_value_position && sb.slider_value_position !== 'right') {
        sbLines.push(`slider_value_position: ${sb.slider_value_position}`);
      }
      if (sb.invert_slider_value === true) sbLines.push('invert_slider_value: true');
    }

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

    if (sbLines.length > 0) {
      lines.push(`  - ${sbLines[0]}`);
      for (let i = 1; i < sbLines.length; i++) {
        lines.push(`    ${sbLines[i]}`);
      }
    }
  });
}

function addStylesToYaml(lines: string[], styles: string | undefined): void {
  if (!styles || !styles.trim()) return;

  lines.push('styles: |');
  styles.split('\n').forEach(line => {
    lines.push(`  ${line}`);
  });
}

function addGridOptions(lines: string[], cardLayout: BubbleCardLayout | undefined, gridOptions?: { rows?: number; columns?: number }): void {
  if (cardLayout === 'large-sub-buttons-grid' && gridOptions) {
    const { rows, columns } = gridOptions;
    if (rows !== undefined || columns !== undefined) {
      lines.push('grid_options:');
      if (rows !== undefined) lines.push(`  rows: ${rows}`);
      if (columns !== undefined) lines.push(`  columns: ${columns}`);
    }
  }
}

function addModules(lines: string[], modules: string[] | undefined, indentLevel: number = 0): void {
  if (!modules || modules.length === 0) return;
  const pad = '  '.repeat(indentLevel);
  lines.push(`${pad}modules:`);
  modules.forEach(mod => lines.push(`${pad}  - ${mod}`));
}

// ============================================
// BUTTON CARD GENERATOR
// ============================================

function generateButtonYaml(config: BubbleButtonConfig): string {
  const lines: string[] = [];

  lines.push('type: custom:bubble-card');
  lines.push('card_type: button');

  if (config.entity) {
    lines.push(`entity: ${config.entity}`);
  }

  if (config.button_type && config.button_type !== 'switch') {
    lines.push(`button_type: ${config.button_type}`);
  }

  if (config.name) lines.push(`name: ${formatValue(config.name)}`);
  if (config.icon) lines.push(`icon: ${config.icon}`);
  if (config.force_icon === true) lines.push('force_icon: true');

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
  if (config.icon_animation) lines.push(`icon_animation: ${formatValue(config.icon_animation)}`);

  // Note: badge, footer text, icon size, name weight, glow and gradient are
  // compiled into the styles option (Bubble Card has no top-level keys for them)
  
  // Note: card_animation and icon_animation_type are handled as CSS in styles, not as direct properties
  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  addGridOptions(lines, config.card_layout, config.grid_options);

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
    if (config.slider_fill_orientation && config.slider_fill_orientation !== 'left') {
      lines.push(`slider_fill_orientation: ${config.slider_fill_orientation}`);
    }
    if (config.slider_value_position && config.slider_value_position !== 'right') {
      lines.push(`slider_value_position: ${config.slider_value_position}`);
    }
    if (config.invert_slider_value === true) lines.push('invert_slider_value: true');
    if (config.light_slider_type && config.light_slider_type !== 'brightness') {
      lines.push(`light_slider_type: ${config.light_slider_type}`);
    }
    if (config.light_slider_type === 'hue' && config.hue_force_saturation === true) {
      lines.push('hue_force_saturation: true');
      if (config.hue_force_saturation_value !== undefined) {
        lines.push(`hue_force_saturation_value: ${config.hue_force_saturation_value}`);
      }
    }
    if (config.allow_light_slider_to_0 === true) lines.push('allow_light_slider_to_0: true');
    if (config.light_transition === true) {
      lines.push('light_transition: true');
      if (config.light_transition_time !== 500) {
        lines.push(`light_transition_time: ${config.light_transition_time}`);
      }
    }
  }

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

  if (config.footer_mode === true) lines.push('footer_mode: true');
  if (config.footer_full_width === true) lines.push('footer_full_width: true');
  addSubButtonsToYaml(lines, config.sub_button);
  addModules(lines, config.modules);

  // Add animations and visual effects to styles if configured
  let finalStyles = config.styles || '';
  finalStyles = addAnimationStyles(finalStyles, config);
  finalStyles = addVisualEffectStyles(finalStyles, config);

  addStylesToYaml(lines, finalStyles);

  return lines.join('\n');
}

// ============================================
// ANIMATION STYLES HELPER
// ============================================

function addAnimationStyles(existingStyles: string, config: BubbleButtonConfig): string {
  let animationCss = '';
  
  // Card animation
  if (config.card_animation && config.card_animation !== 'none') {
    const trigger = config.card_animation_trigger || 'always';
    const speed = config.card_animation_speed || '2s';
    
    if (trigger === 'always') {
      animationCss += `.bubble-button-card-container {\n  animation: cba-${config.card_animation} ${speed} infinite;\n}\n`;
    } else {
      const stateSelector = trigger === 'on' ? '[data-state="on"]' : '[data-state="off"]';
      animationCss += `.bubble-button-card-container${stateSelector} {\n  animation: cba-${config.card_animation} ${speed} infinite;\n}\n`;
    }
  }
  
  // Icon animation
  if (config.icon_animation_type && config.icon_animation_type !== 'none') {
    const trigger = config.icon_animation_trigger || 'always';
    const speed = config.icon_animation_speed || '2s';
    
    if (trigger === 'always') {
      animationCss += `.bubble-icon {\n  animation: cba-${config.icon_animation_type} ${speed} infinite;\n  display: inline-block;\n}\n`;
    } else {
      const stateSelector = trigger === 'on' ? '[data-state="on"]' : '[data-state="off"]';
      animationCss += `.bubble-button-card-container${stateSelector} .bubble-icon {\n  animation: cba-${config.icon_animation_type} ${speed} infinite;\n  display: inline-block;\n}\n`;
    }
  }
  
  // Combine with existing styles
  if (animationCss) {
    return existingStyles ? `${existingStyles}\n${animationCss}` : animationCss;
  }

  return existingStyles;
}

// ============================================
// VISUAL EFFECT STYLES HELPER
// ============================================

const NAME_WEIGHT_MAP: Record<string, string> = {
  normal: '400',
  medium: '500',
  bold: '700',
};

function escapeCssContent(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function addVisualEffectStyles(existingStyles: string, config: BubbleButtonConfig): string {
  let css = '';

  if (config.icon_size !== undefined) {
    css += `.bubble-icon {\n  --mdc-icon-size: ${config.icon_size}px;\n}\n`;
  }

  if (config.name_weight && config.name_weight !== 'normal') {
    css += `.bubble-name {\n  font-weight: ${NAME_WEIGHT_MAP[config.name_weight] || config.name_weight};\n}\n`;
  }

  if (config.glow_effect) {
    css += `.bubble-button-card-container {\n  box-shadow: 0 0 15px ${config.glow_effect};\n}\n`;
  }

  if (config.background_gradient) {
    css += `.bubble-button-card-container {\n  background: ${config.background_gradient} !important;\n}\n`;
  }

  if (config.badge_text) {
    const badgeColor = config.badge_color || 'var(--accent-color)';
    css += `.bubble-button-card-container::after {\n  content: "${escapeCssContent(config.badge_text)}";\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  background: ${badgeColor};\n  color: #fff;\n  border-radius: 10px;\n  padding: 2px 8px;\n  font-size: 11px;\n  z-index: 2;\n}\n`;
  }

  if (config.footer_text) {
    css += `.bubble-button-card-container::before {\n  content: "${escapeCssContent(config.footer_text)}";\n  position: absolute;\n  bottom: 2px;\n  left: 0;\n  right: 0;\n  text-align: center;\n  font-size: 10px;\n  opacity: 0.7;\n  pointer-events: none;\n  z-index: 2;\n}\n`;
  }

  if (css) {
    return existingStyles ? `${existingStyles}\n${css}` : css;
  }

  return existingStyles;
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
  addGridOptions(lines, config.card_layout, config.grid_options);

  addSubButtonsToYaml(lines, config.sub_button);
  addModules(lines, config.modules);
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
  if (config.force_icon === true) lines.push('force_icon: true');

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
  if (config.popup_style && config.popup_style !== 'bubble') lines.push(`popup_style: ${config.popup_style}`);
  if (config.popup_mode && config.popup_mode !== 'default') lines.push(`popup_mode: ${config.popup_mode}`);
  if ((config.popup_mode === 'fit-content' || config.popup_mode === 'adaptive-dialog') && config.with_bottom_offset === true) {
    lines.push('with_bottom_offset: true');
  }
  if (config.popup_mode === 'centered' && config.full_width_on_mobile === true) {
    lines.push('full_width_on_mobile: true');
  }
  if (config.performance_mode && config.performance_mode !== 'default') lines.push(`performance_mode: ${config.performance_mode}`);
  if (config.show_previous_button === true) lines.push('show_previous_button: true');
  if (config.show_close_button === false) lines.push('show_close_button: false');
  if (config.buttons_position && config.buttons_position !== 'right') lines.push(`buttons_position: ${config.buttons_position}`);

  if (config.trigger_entity) {
    lines.push(`trigger_entity: ${config.trigger_entity}`);
    if (config.trigger_state) lines.push(`trigger_state: ${formatValue(config.trigger_state)}`);
    if (config.trigger_close === true) lines.push('trigger_close: true');
  }

  if (config.open_action) {
    lines.push('open_action:');
    lines.push(generateActionYaml(config.open_action, 1));
  }
  if (config.close_action) {
    lines.push('close_action:');
    lines.push(generateActionYaml(config.close_action, 1));
  }

  addModules(lines, config.modules);
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

  addModules(lines, config.modules);
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

  if (config.icon_open) lines.push(`icon_open: ${config.icon_open}`);
  if (config.icon_close) lines.push(`icon_close: ${config.icon_close}`);
  if (config.icon_up) lines.push(`icon_up: ${config.icon_up}`);
  if (config.icon_down) lines.push(`icon_down: ${config.icon_down}`);

  if (config.open_service) lines.push(`open_service: ${config.open_service}`);
  if (config.stop_service) lines.push(`stop_service: ${config.stop_service}`);
  if (config.close_service) lines.push(`close_service: ${config.close_service}`);

  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  addGridOptions(lines, config.card_layout, config.grid_options);

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

  if (config.main_buttons_position && config.main_buttons_position !== 'default') {
    lines.push(`main_buttons_position: ${config.main_buttons_position}`);
  }
  if (config.main_buttons_full_width === true) lines.push('main_buttons_full_width: true');
  if (config.main_buttons_alignment && config.main_buttons_alignment !== 'end') {
    lines.push(`main_buttons_alignment: ${config.main_buttons_alignment}`);
  }
  if (config.footer_mode === true) lines.push('footer_mode: true');
  if (config.footer_full_width === true) lines.push('footer_full_width: true');
  addSubButtonsToYaml(lines, config.sub_button);
  addModules(lines, config.modules);
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

  if (config.min_volume !== undefined && config.min_volume !== 0) {
    lines.push(`min_volume: ${config.min_volume}`);
  }
  if (config.max_volume !== undefined && config.max_volume !== 100) {
    lines.push(`max_volume: ${config.max_volume}`);
  }
  if (config.cover_background === true) lines.push('cover_background: true');
  if (config.columns && config.columns !== 1) {
    lines.push(`columns: ${config.columns}`);
  }

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

  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  addGridOptions(lines, config.card_layout, config.grid_options);

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

  if (config.main_buttons_position && config.main_buttons_position !== 'default') {
    lines.push(`main_buttons_position: ${config.main_buttons_position}`);
  }
  if (config.main_buttons_full_width === true) lines.push('main_buttons_full_width: true');
  if (config.main_buttons_alignment && config.main_buttons_alignment !== 'end') {
    lines.push(`main_buttons_alignment: ${config.main_buttons_alignment}`);
  }
  if (config.footer_mode === true) lines.push('footer_mode: true');
  if (config.footer_full_width === true) lines.push('footer_full_width: true');
  addSubButtonsToYaml(lines, config.sub_button);
  addModules(lines, config.modules);
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

  if (config.show_name === false) lines.push('show_name: false');
  if (config.show_icon === false) lines.push('show_icon: false');
  if (config.show_state === true) lines.push('show_state: true');

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

  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  addGridOptions(lines, config.card_layout, config.grid_options);

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

  if (config.main_buttons_position && config.main_buttons_position !== 'default') {
    lines.push(`main_buttons_position: ${config.main_buttons_position}`);
  }
  if (config.main_buttons_full_width === true) lines.push('main_buttons_full_width: true');
  if (config.main_buttons_alignment && config.main_buttons_alignment !== 'end') {
    lines.push(`main_buttons_alignment: ${config.main_buttons_alignment}`);
  }
  if (config.footer_mode === true) lines.push('footer_mode: true');
  if (config.footer_full_width === true) lines.push('footer_full_width: true');
  addSubButtonsToYaml(lines, config.sub_button);
  addModules(lines, config.modules);
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

  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  addGridOptions(lines, config.card_layout, config.grid_options);

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

  if (config.footer_mode === true) lines.push('footer_mode: true');
  if (config.footer_full_width === true) lines.push('footer_full_width: true');
  addSubButtonsToYaml(lines, config.sub_button);
  addModules(lines, config.modules);
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

  if (config.entities && config.entities.length > 0) {
    lines.push('entities:');
    config.entities.forEach(ent => {
      lines.push(`  - entity: ${ent.entity}`);
      if (ent.color) lines.push(`    color: ${ent.color}`);
    });
  }

  if (config.days !== undefined && config.days !== 7) {
    lines.push(`days: ${config.days}`);
  }
  if (config.limit !== undefined) {
    lines.push(`limit: ${config.limit}`);
  }
  if (config.show_end === true) lines.push('show_end: true');
  if (config.show_progress === true) lines.push('show_progress: true');
  if (config.show_started_events === false) lines.push('show_started_events: false');
  if (config.scrolling_effect === false) lines.push('scrolling_effect: false');

  if (config.card_layout && config.card_layout !== 'normal') {
    lines.push(`card_layout: ${config.card_layout}`);
  }
  if (config.rows && config.rows !== 1) {
    lines.push(`rows: ${config.rows}`);
  }
  addGridOptions(lines, config.card_layout, config.grid_options);

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

  addSubButtonsToYaml(lines, config.sub_button);
  addModules(lines, config.modules);
  addStylesToYaml(lines, config.styles);

  return lines.join('\n');
}

// ============================================
// EMPTY COLUMN GENERATOR
// ============================================

function generateEmptyColumnYaml(config: BubbleEmptyColumnConfig): string {
  const lines: string[] = [];
  lines.push('type: custom:bubble-card');
  lines.push('card_type: empty-column');
  addModules(lines, config.modules);
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
      return generateEmptyColumnYaml(config as BubbleEmptyColumnConfig);
    default:
      return '# Unknown card type';
  }
}
