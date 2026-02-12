// Tile Card YAML Generator
// Converts TileCardConfig to Home Assistant tile card YAML

import type { TileCardConfig, TileAction, TileFeature } from '../types';
import { DEFAULT_TILE_CONFIG } from '../types';

/**
 * Generate Home Assistant tile card YAML from configuration
 */
export function generateTileCardYaml(config: TileCardConfig): string {
  const lines: string[] = [];
  
  // Card type
  lines.push('type: tile');
  
  // Entity (required)
  if (config.entity) {
    lines.push(`entity: ${config.entity}`);
  }
  
  // Name
  if (config.name) {
    lines.push(`name: ${config.name}`);
  }
  
  // Icon
  if (config.icon) {
    lines.push(`icon: ${config.icon}`);
  }
  
  // Color
  if (config.color && config.color !== DEFAULT_TILE_CONFIG.color) {
    lines.push(`color: ${config.color}`);
  }
  
  // Show entity picture
  if (config.show_entity_picture !== DEFAULT_TILE_CONFIG.show_entity_picture) {
    lines.push(`show_entity_picture: ${config.show_entity_picture}`);
  }
  
  // Vertical layout
  if (config.vertical !== DEFAULT_TILE_CONFIG.vertical) {
    lines.push(`vertical: ${config.vertical}`);
  }
  
  // Hide state
  if (config.hide_state !== DEFAULT_TILE_CONFIG.hide_state) {
    lines.push(`hide_state: ${config.hide_state}`);
  }
  
  // State content
  if (config.state_content && config.state_content.length > 0) {
    const isDefault = config.state_content.length === 1 && config.state_content[0] === 'state';
    if (!isDefault) {
      if (config.state_content.length === 1) {
        lines.push(`state_content: ${config.state_content[0]}`);
      } else {
        lines.push('state_content:');
        config.state_content.forEach(item => {
          lines.push(`  - ${item}`);
        });
      }
    }
  }
  
  // Actions
  if (config.tap_action) {
    lines.push(...generateActionYaml('tap_action', config.tap_action));
  }
  
  if (config.hold_action) {
    lines.push(...generateActionYaml('hold_action', config.hold_action));
  }
  
  if (config.double_tap_action) {
    lines.push(...generateActionYaml('double_tap_action', config.double_tap_action));
  }
  
  if (config.icon_tap_action) {
    lines.push(...generateActionYaml('icon_tap_action', config.icon_tap_action));
  }
  
  if (config.icon_hold_action) {
    lines.push(...generateActionYaml('icon_hold_action', config.icon_hold_action));
  }
  
  if (config.icon_double_tap_action) {
    lines.push(...generateActionYaml('icon_double_tap_action', config.icon_double_tap_action));
  }
  
  // Features
  if (config.features && config.features.length > 0) {
    lines.push('features:');
    config.features.forEach(feature => {
      lines.push(...generateFeatureYaml(feature));
    });
  }
  
  // Features position
  if (config.features_position && config.features_position !== DEFAULT_TILE_CONFIG.features_position) {
    lines.push(`features_position: ${config.features_position}`);
  }
  
  return lines.join('\n');
}

/**
 * Generate action YAML
 */
function generateActionYaml(actionName: string, action: TileAction): string[] {
  const lines: string[] = [];
  
  lines.push(`${actionName}:`);
  lines.push(`  action: ${action.action}`);
  
  if (action.navigation_path) {
    lines.push(`  navigation_path: ${action.navigation_path}`);
  }
  
  if (action.url_path) {
    lines.push(`  url_path: ${action.url_path}`);
  }
  
  if (action.service) {
    lines.push(`  service: ${action.service}`);
  }
  
  if (action.data) {
    lines.push('  data:');
    Object.entries(action.data).forEach(([key, value]) => {
      lines.push(`    ${key}: ${JSON.stringify(value)}`);
    });
  }
  
  if (action.target) {
    lines.push('  target:');
    if (action.target.entity_id) {
      if (Array.isArray(action.target.entity_id)) {
        lines.push('    entity_id:');
        action.target.entity_id.forEach(id => lines.push(`      - ${id}`));
      } else {
        lines.push(`    entity_id: ${action.target.entity_id}`);
      }
    }
  }
  
  return lines;
}

/**
 * Generate feature YAML
 */
function generateFeatureYaml(feature: TileFeature): string[] {
  const lines: string[] = [];
  
  lines.push(`  - type: ${feature.type}`);
  
  // Feature-specific properties
  switch (feature.type) {
    case 'alarm-modes':
      if (feature.modes) {
        lines.push('    modes:');
        feature.modes.forEach(mode => lines.push(`      - ${mode}`));
      }
      break;
      
    case 'climate-hvac-modes':
      if (feature.style) lines.push(`    style: ${feature.style}`);
      if (feature.hvac_modes) {
        lines.push('    hvac_modes:');
        feature.hvac_modes.forEach(mode => lines.push(`      - ${mode}`));
      }
      break;
      
    case 'climate-fan-modes':
      if (feature.style) lines.push(`    style: ${feature.style}`);
      if (feature.fan_modes) {
        lines.push('    fan_modes:');
        feature.fan_modes.forEach(mode => lines.push(`      - ${mode}`));
      }
      break;
      
    case 'climate-preset-modes':
      if (feature.style) lines.push(`    style: ${feature.style}`);
      if (feature.preset_modes) {
        lines.push('    preset_modes:');
        feature.preset_modes.forEach(mode => lines.push(`      - ${mode}`));
      }
      break;
      
    case 'fan-preset-modes':
      if (feature.style) lines.push(`    style: ${feature.style}`);
      if (feature.preset_modes) {
        lines.push('    preset_modes:');
        feature.preset_modes.forEach(mode => lines.push(`      - ${mode}`));
      }
      break;
      
    case 'humidifier-modes':
      if (feature.style) lines.push(`    style: ${feature.style}`);
      if (feature.modes) {
        lines.push('    modes:');
        feature.modes.forEach(mode => lines.push(`      - ${mode}`));
      }
      break;
      
    case 'vacuum-commands':
      if (feature.commands) {
        lines.push('    commands:');
        feature.commands.forEach(cmd => lines.push(`      - ${cmd}`));
      }
      break;
      
    case 'lawn-mower-commands':
      if (feature.commands) {
        lines.push('    commands:');
        feature.commands.forEach(cmd => lines.push(`      - ${cmd}`));
      }
      break;
      
    case 'water-heater-operation-modes':
      if (feature.operation_modes) {
        lines.push('    operation_modes:');
        feature.operation_modes.forEach(mode => lines.push(`      - ${mode}`));
      }
      break;
      
    case 'button':
      if (feature.action_name) lines.push(`    action_name: ${feature.action_name}`);
      if (feature.data) {
        lines.push('    data:');
        Object.entries(feature.data).forEach(([key, value]) => {
          lines.push(`      ${key}: ${JSON.stringify(value)}`);
        });
      }
      break;
      
    case 'numeric-input':
      if (feature.style) lines.push(`    style: ${feature.style}`);
      break;
      
    case 'counter-actions':
      if (feature.actions) {
        lines.push('    actions:');
        feature.actions.forEach(action => lines.push(`      - ${action}`));
      }
      break;
      
    case 'update-actions':
      if (feature.backup) lines.push(`    backup: ${feature.backup}`);
      break;
      
    case 'bar-gauge':
      if (feature.min !== undefined) lines.push(`    min: ${feature.min}`);
      if (feature.max !== undefined) lines.push(`    max: ${feature.max}`);
      break;
      
    case 'trend-graph':
      if (feature.hours_to_show) lines.push(`    hours_to_show: ${feature.hours_to_show}`);
      if (feature.detail !== undefined) lines.push(`    detail: ${feature.detail}`);
      break;
      
    case 'media-player-volume-buttons':
      if (feature.step) lines.push(`    step: ${feature.step}`);
      break;
      
    case 'area-controls':
      if (feature.controls) {
        lines.push('    controls:');
        feature.controls.forEach(control => lines.push(`      - ${control}`));
      }
      break;
  }
  
  return lines;
}
