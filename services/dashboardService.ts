/**
 * Dashboard Service - Fetches dashboard configurations from Home Assistant
 * to allow users to use their actual dashboard backgrounds as the preview canvas.
 */

import React from 'react';

export interface DashboardInfo {
  id: string;
  title: string;
  icon?: string;
  background?: string;
  mode: 'storage' | 'yaml';
  url_path: string;
}

export interface DashboardGridConfig {
  type: 'masonry' | 'sections' | 'panel' | 'sidebar';
  columns?: number;
  maxColumns?: number;
  cardSize?: number; // For sections view
  dense?: boolean;
  square?: boolean;
}

export interface DashboardConfig {
  dashboardId: string;
  title: string;
  background: string | null;
  icon?: string;
  grid: DashboardGridConfig;
}

// Default grid configs for different view types
const DEFAULT_GRID_CONFIGS: Record<string, DashboardGridConfig> = {
  masonry: { type: 'masonry', columns: 4, maxColumns: 4 },
  sections: { type: 'sections', columns: 4, maxColumns: 4, cardSize: 75, dense: true },
  panel: { type: 'panel', columns: 1 },
  sidebar: { type: 'sidebar', columns: 2 },
};

/**
 * Check if we're running inside Home Assistant iframe
 */
export const isInHomeAssistant = (): boolean => {
  try {
    // Check if parent window has Home Assistant connection
    return !!(window.parent as any)?.hassConnection || 
           !!(window.parent as any)?.hass ||
           window.location.pathname.includes('/button_builder');
  } catch {
    return false;
  }
};

/**
 * Get the Home Assistant connection from parent window
 */
const getHassConnection = async (): Promise<any> => {
  try {
    // Try to get connection from parent window (iframe scenario)
    const parent = window.parent as any;
    
    // Method 1: Direct hass object
    if (parent?.hass) {
      return parent.hass;
    }
    
    // Method 2: hassConnection promise
    if (parent?.hassConnection) {
      const { conn } = await parent.hassConnection;
      return conn;
    }
    
    // Method 3: Custom event for HA panels
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for HA connection')), 5000);
      
      window.addEventListener('message', (event) => {
        if (event.data?.type === 'hass-connection') {
          clearTimeout(timeout);
          resolve(event.data.connection);
        }
      }, { once: true });
      
      // Request connection from parent
      window.parent.postMessage({ type: 'request-hass-connection' }, '*');
    });
  } catch (error) {
    console.error('Failed to get HA connection:', error);
    throw error;
  }
};

/**
 * Send a WebSocket message to Home Assistant
 */
const sendHassMessage = async (hass: any, message: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const id = Date.now();
    
    if (hass.callWS) {
      // Using hass object with callWS method
      hass.callWS(message).then(resolve).catch(reject);
    } else if (hass.sendMessagePromise) {
      // Using connection object
      hass.sendMessagePromise({ ...message, id }).then(resolve).catch(reject);
    } else {
      reject(new Error('No valid method to send message'));
    }
  });
};

/**
 * Fetch list of all dashboards
 */
export const fetchDashboards = async (): Promise<DashboardInfo[]> => {
  try {
    const hass = await getHassConnection();
    
    const dashboards = await sendHassMessage(hass, {
      type: 'lovelace/dashboards'
    });
    
    return dashboards || [];
  } catch (error) {
    console.error('Failed to fetch dashboards:', error);
    return [];
  }
};

/**
 * Fetch a specific dashboard's configuration
 */
export const fetchDashboardConfig = async (urlPath: string | null): Promise<any> => {
  try {
    const hass = await getHassConnection();
    
    const config = await sendHassMessage(hass, {
      type: 'lovelace/config',
      url_path: urlPath, // null = default dashboard
    });
    
    return config;
  } catch (error) {
    console.error(`Failed to fetch dashboard config for ${urlPath}:`, error);
    return null;
  }
};

/**
 * Extract background from dashboard config
 */
const extractBackground = (config: any): string | null => {
  if (!config) return null;
  
  // Check for background in config root
  if (config.background) {
    return config.background;
  }
  
  // Check for background in views (some themes set per-view backgrounds)
  if (config.views && config.views.length > 0) {
    for (const view of config.views) {
      if (view.background) {
        return view.background;
      }
    }
  }
  
  return null;
};

/**
 * Extract grid configuration from dashboard config
 * Looks at the first view to determine grid settings
 */
const extractGridConfig = (config: any): DashboardGridConfig => {
  if (!config || !config.views || config.views.length === 0) {
    return DEFAULT_GRID_CONFIGS.masonry;
  }
  
  const firstView = config.views[0];
  const viewType = firstView.type || 'masonry';
  
  // Start with defaults for the view type
  const gridConfig: DashboardGridConfig = {
    ...DEFAULT_GRID_CONFIGS[viewType] || DEFAULT_GRID_CONFIGS.masonry
  };
  
  // Override with specific view settings if present
  if (firstView.columns !== undefined) {
    gridConfig.columns = firstView.columns;
  }
  
  if (firstView.max_columns !== undefined) {
    gridConfig.maxColumns = firstView.max_columns;
  }
  
  // For sections view, check section layout settings
  if (viewType === 'sections' && firstView.sections) {
    // Card size is often set at the view or section level
    if (firstView.card_size !== undefined) {
      gridConfig.cardSize = firstView.card_size;
    }
    
    if (firstView.dense !== undefined) {
      gridConfig.dense = firstView.dense;
    }
  }
  
  // Check for masonry-specific settings
  if (viewType === 'masonry') {
    if (firstView.dense !== undefined) {
      gridConfig.dense = firstView.dense;
    }
    
    if (firstView.square !== undefined) {
      gridConfig.square = firstView.square;
    }
  }
  
  return gridConfig;
};

/**
 * Fetch all dashboard configurations (backgrounds + grid settings)
 */
export const fetchAllDashboardConfigs = async (): Promise<DashboardConfig[]> => {
  const configs: DashboardConfig[] = [];
  
  try {
    // Always try to fetch the default dashboard first
    const defaultConfig = await fetchDashboardConfig(null);
    if (defaultConfig) {
      configs.push({
        dashboardId: 'lovelace',
        title: defaultConfig.title || 'Default Dashboard',
        background: extractBackground(defaultConfig),
        icon: 'mdi:view-dashboard',
        grid: extractGridConfig(defaultConfig),
      });
    }
    
    // Fetch list of other dashboards
    const dashboards = await fetchDashboards();
    
    for (const dashboard of dashboards) {
      if (dashboard.mode === 'storage') {
        const config = await fetchDashboardConfig(dashboard.url_path);
        
        configs.push({
          dashboardId: dashboard.url_path || dashboard.id,
          title: dashboard.title || dashboard.id,
          background: extractBackground(config),
          icon: dashboard.icon,
          grid: extractGridConfig(config),
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch dashboard configs:', error);
  }
  
  return configs;
};

// Backwards compatibility alias
export type DashboardBackground = DashboardConfig;
export const fetchAllDashboardBackgrounds = fetchAllDashboardConfigs;

/**
 * Parse a background string to get usable CSS
 * HA backgrounds can be: 
 * - "center / cover no-repeat url('/local/bg.jpg') fixed"
 * - "var(--primary-background-color)"
 * - Simple color values
 */
export const parseBackgroundToCss = (background: string): React.CSSProperties => {
  if (!background) return {};
  
  // If it starts with url( or contains url(, treat as background shorthand
  if (background.includes('url(')) {
    return { background };
  }
  
  // If it's a CSS variable
  if (background.startsWith('var(')) {
    return { background };
  }
  
  // If it looks like a color
  if (background.startsWith('#') || background.startsWith('rgb') || background.startsWith('hsl')) {
    return { backgroundColor: background };
  }
  
  // Otherwise, use as background shorthand
  return { background };
};
