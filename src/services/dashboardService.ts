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

// Track if we've already detected HA is unavailable to avoid repeated errors
let hassAvailabilityChecked = false;
let hassAvailable = false;

/**
 * Check if we're running inside Home Assistant iframe
 */
export const isInHomeAssistant = (): boolean => {
  try {
    // Simple check - don't access parent to avoid triggering auth
    return window.location.pathname.includes('/button_builder') ||
           window.location.pathname.includes('/button-builder');
  } catch {
    return false;
  }
};

/**
 * Safely check if we can access the parent window
 * Returns false if cross-origin restrictions apply
 */
const canAccessParent = (): boolean => {
  try {
    // Try to access a simple property - this will throw if cross-origin
    const test = window.parent.location.href;
    return true;
  } catch {
    // Cross-origin access denied - this is expected on iOS companion app
    return false;
  }
};

/**
 * Get the Home Assistant hass object from parent window
 * Returns null silently if not available (e.g., on iOS companion app)
 */
const getHass = (): any | null => {
  // If we already know HA isn't available, don't try again
  if (hassAvailabilityChecked && !hassAvailable) {
    return null;
  }
  
  try {
    // First check if we can even access the parent
    if (!canAccessParent()) {
      hassAvailabilityChecked = true;
      hassAvailable = false;
      console.info('Button Builder: Running in restricted context (e.g., iOS app), dashboard features disabled');
      return null;
    }
    
    const parent = window.parent as any;
    
    // Direct hass object on parent
    if (parent?.hass) {
      hassAvailabilityChecked = true;
      hassAvailable = true;
      return parent.hass;
    }
    
    // Try to get from home-assistant element
    const haElement = parent?.document?.querySelector?.('home-assistant');
    if (haElement?.hass) {
      hassAvailabilityChecked = true;
      hassAvailable = true;
      return haElement.hass;
    }
    
    hassAvailabilityChecked = true;
    hassAvailable = false;
    return null;
  } catch (error) {
    // Silently fail - this is expected in some contexts
    hassAvailabilityChecked = true;
    hassAvailable = false;
    return null;
  }
};

/**
 * Call a Home Assistant WebSocket API using the connection
 * Returns null instead of throwing if HA is not available
 */
const callHassWS = async (type: string, data?: any): Promise<any | null> => {
  const hass = getHass();
  
  if (!hass) {
    // Silently return null - HA integration not available
    return null;
  }
  
  try {
    // Use hass.callWS which is available in modern HA
    if (typeof hass.callWS === 'function') {
      return await hass.callWS({ type, ...data });
    }
    
    // Fallback: Use connection.sendMessagePromise
    if (hass.connection?.sendMessagePromise) {
      return await hass.connection.sendMessagePromise({ type, ...data });
    }
    
    return null;
  } catch (error) {
    // Don't log errors that might be auth-related
    console.debug('Button Builder: WebSocket call failed (this is normal if HA features are unavailable)');
    return null;
  }
};

/**
 * Fetch list of all dashboards
 * Returns empty array if HA integration is not available
 */
export const fetchDashboards = async (): Promise<DashboardInfo[]> => {
  try {
    const dashboards = await callHassWS('lovelace/dashboards');
    
    // callHassWS now returns null if HA is unavailable
    if (!dashboards || !Array.isArray(dashboards)) {
      return [];
    }
    
    return dashboards;
  } catch (error) {
    // Silently fail - this is expected in some contexts
    return [];
  }
};

/**
 * Fetch a specific dashboard's configuration
 * Returns null if HA integration is not available
 */
export const fetchDashboardConfig = async (urlPath: string | null): Promise<any> => {
  try {
    const config = await callHassWS('lovelace/config', { url_path: urlPath });
    return config;
  } catch (error) {
    // Silently fail
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
 * Returns empty array if HA integration is not available (e.g., on iOS app)
 */
export const fetchAllDashboardConfigs = async (): Promise<DashboardConfig[]> => {
  const configs: DashboardConfig[] = [];
  
  // Quick check - if we can't access parent, don't even try
  if (hassAvailabilityChecked && !hassAvailable) {
    return configs;
  }
  
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
      try {
        const config = await fetchDashboardConfig(dashboard.url_path);
        
        if (config) {
          configs.push({
            dashboardId: dashboard.url_path || dashboard.id,
            title: dashboard.title || dashboard.id,
            background: extractBackground(config),
            icon: dashboard.icon,
            grid: extractGridConfig(config),
          });
        }
      } catch {
        // Silently skip failed dashboard configs
      }
    }
  } catch {
    // Silently fail - HA integration not available
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
export const parseBackgroundToCss = (background: string | null | undefined): React.CSSProperties => {
  // Guard against non-string values
  if (!background || typeof background !== 'string') return {};
  
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
