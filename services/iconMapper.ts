import React from 'react';
import * as mdi from '@mdi/js';
import { Icon } from '@mdi/react';

type IconComponent = React.ComponentType<{ style?: React.CSSProperties }>;

const cache = new Map<string, IconComponent>();

const toPascal = (input: string) =>
  input
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

export function getIconComponent(name: string): IconComponent | undefined {
  if (!name) {
    return undefined;
  }

  const normalized = name.trim().toLowerCase();
  if (cache.has(normalized)) {
    return cache.get(normalized);
  }

  let component: IconComponent | undefined;

  if (normalized.startsWith('mdi:')) {
    const pascalName = toPascal(normalized.replace('mdi:', ''));
    const key = `mdi${pascalName}` as keyof typeof mdi;
    const path = mdi[key];
    if (path) {
      component = ({ style }) => React.createElement(Icon, { path, size: '1em', style });
    }
  }

  if (component) {
    cache.set(normalized, component);
  }

  return component;
}
