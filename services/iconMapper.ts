import React from 'react';
import * as mdi from '@mdi/js';
import { Icon } from '@mdi/react';

type IconComponent = React.ComponentType<{ style?: React.CSSProperties }>;

const cache = new Map<string, IconComponent | null>();

const toPascal = (input: string) =>
  input
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const normalize = (icon: string) => {
  if (!icon) {
    return '';
  }

  let value = icon.trim();

  if (!value) {
    return '';
  }

  // Replace common separators with hyphen for consistent casing
  value = value.replace(/\s+/g, '-').replace(/_/g, '-');

  if (value.startsWith('mdi:')) {
    value = value.slice(4);
  } else if (value.startsWith('mdi-')) {
    value = value.slice(4);
  } else if (value.toLowerCase().startsWith('mdi')) {
    value = value.slice(3);
  }

  return value.replace(/^[-:]+/, '').toLowerCase();
};

export function getIconComponent(name: string): IconComponent | undefined {
  const normalized = normalize(name);
  if (!normalized) {
    return undefined;
  }

  if (cache.has(normalized)) {
    return cache.get(normalized) ?? undefined;
  }

  const pascalName = toPascal(normalized);
  const key = `mdi${pascalName}` as keyof typeof mdi;
  const path = mdi[key];

  if (!path) {
    cache.set(normalized, null);
    const isDev = typeof import.meta !== 'undefined' && Boolean((import.meta as any)?.env?.DEV);
    if (isDev) {
      console.warn(`[iconMapper] Unknown mdi icon: ${name}`);
    }
    return undefined;
  }

  const component: IconComponent = ({ style }) => {
    // Extract size from style, default to 1em
    const size = style?.width || style?.height || '1em';
    return React.createElement(Icon, { path, size, style });
  };
  cache.set(normalized, component);
  return component;
}
