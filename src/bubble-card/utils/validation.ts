// Bubble Card Validation Utilities

import { BubbleConfig } from '../types';

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export function validateBubbleCard(config: BubbleConfig): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  switch (config.card_type) {
    case 'button':
      // Button type validation
      if (config.button_type === 'slider' && !config.entity) {
        warnings.push({
          field: 'entity',
          message: 'Slider buttons require an entity to control',
          severity: 'error'
        });
      }
      if (config.button_type === 'switch' && !config.entity) {
        warnings.push({
          field: 'entity',
          message: 'Switch buttons work best with an entity',
          severity: 'warning'
        });
      }
      break;

    case 'cover':
    case 'media-player':
    case 'climate':
    case 'select':
      if (!config.entity) {
        warnings.push({
          field: 'entity',
          message: `${config.card_type} card requires an entity`,
          severity: 'error'
        });
      }
      break;

    case 'pop-up':
      if (!config.hash) {
        warnings.push({
          field: 'hash',
          message: 'Pop-up requires a hash to be opened (e.g., #room)',
          severity: 'error'
        });
      }
      if (config.hash && !config.hash.startsWith('#')) {
        warnings.push({
          field: 'hash',
          message: 'Hash should start with # (e.g., #living-room)',
          severity: 'warning'
        });
      }
      break;

    case 'calendar':
      if (!config.entities || config.entities.length === 0) {
        warnings.push({
          field: 'entities',
          message: 'Calendar requires at least one entity',
          severity: 'error'
        });
      }
      break;

    case 'horizontal-buttons-stack':
      if (!config.buttons || config.buttons.length === 0) {
        warnings.push({
          field: 'buttons',
          message: 'Horizontal stack should have at least one button',
          severity: 'warning'
        });
      }
      break;
  }

  // Sub-button validation
  if (config.sub_button && config.sub_button.length > 0) {
    config.sub_button.forEach((sb, index) => {
      if (sb.select_attribute && !sb.entity) {
        warnings.push({
          field: `sub_button[${index}].entity`,
          message: `Sub-button ${index + 1}: select_attribute requires an entity`,
          severity: 'warning'
        });
      }
    });
  }

  // Slider validation
  if (config.button_type === 'slider') {
    if (config.min_value !== undefined && config.max_value !== undefined && config.min_value >= config.max_value) {
      warnings.push({
        field: 'max_value',
        message: 'Max value should be greater than min value',
        severity: 'error'
      });
    }
  }

  return warnings;
}
