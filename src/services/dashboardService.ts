/**
 * Dashboard Service - Fetches dashboard configurations from Home Assistant
 * to allow users to use their actual dashboard backgrounds as the preview canvas.
 */

import type { CSSProperties } from 'react';

/** Narrow shape of ButtonConfig needed only for environment checks. */
interface ButtonConfigSnapshot {
  icon?: string;
  lock?: { lockIcon?: string; unlockIcon?: string };
  stateStyles?: Array<{ icon?: string }>;
  customFields?: Array<{ icon?: string }>;
  customFontName?: string;
  customFontUrl?: string;
}

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
  cardSize?: number;
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

export interface DashboardSectionOption {
  index: number;
  title: string;
}

export interface DashboardViewOption {
  index: number;
  title: string;
  path?: string;
  type: string;
  sections: DashboardSectionOption[];
}

export interface DashboardWriteTarget {
  dashboardId: string;
  title: string;
  urlPath: string | null;
  views: DashboardViewOption[];
}

export interface AddCardToDashboardParams {
  dashboardId: string;
  viewIndex: number;
  sectionIndex?: number;
  cardConfig: Record<string, any>;
}

export interface AddCardsToDashboardParams {
  dashboardId: string;
  viewIndex: number;
  sectionIndex?: number;
  cardConfigs: Record<string, any>[];
}

export interface BuilderRequirementStatus {
  id: string;
  label: string;
  required: boolean;
  status: 'ok' | 'missing' | 'warning' | 'unavailable';
  details: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface ButtonBuilderEnvironmentReport {
  checkedAt: number;
  requirements: BuilderRequirementStatus[];
}

const collectConfigIcons = (config?: ButtonConfigSnapshot): string[] => {
  if (!config) {
    return [];
  }

  const icons = [
    config.icon,
    config.lock.lockIcon,
    config.lock.unlockIcon,
    ...config.stateStyles.map((style) => style.icon),
    ...config.customFields.map((field) => field.icon || ''),
  ];

  return icons
    .map((icon) => (icon || '').trim())
    .filter(Boolean);
};

const usesFontAwesomeIcons = (icons: string[]): boolean =>
  icons.some((icon) => /^(fas|far|fab):/i.test(icon));

const usesSimpleIcons = (icons: string[]): boolean =>
  icons.some((icon) => /^si:/i.test(icon));

const DEFAULT_GRID_CONFIGS: Record<string, DashboardGridConfig> = {
  masonry: { type: 'masonry', columns: 4, maxColumns: 4 },
  sections: { type: 'sections', columns: 4, maxColumns: 4, cardSize: 75, dense: true },
  panel: { type: 'panel', columns: 1 },
  sidebar: { type: 'sidebar', columns: 2 },
};

let hassAvailabilityChecked = false;
let hassAvailable = false;

export const isInHomeAssistant = (): boolean => {
  try {
    return window.location.pathname.includes('/button_builder') ||
           window.location.pathname.includes('/button-builder');
  } catch {
    return false;
  }
};

const canAccessParent = (): boolean => {
  try {
    const test = window.parent.location.href;
    return true;
  } catch {
    return false;
  }
};

const getParentWindow = (): any | null => {
  if (!canAccessParent()) {
    return null;
  }

  try {
    return window.parent as any;
  } catch {
    return null;
  }
};

const getHass = (): any | null => {
  if (hassAvailabilityChecked && !hassAvailable) {
    return null;
  }

  try {
    if (!canAccessParent()) {
      hassAvailabilityChecked = true;
      hassAvailable = false;
      console.info('Button Builder: Running in restricted context (e.g., iOS app), dashboard features disabled');
      return null;
    }

    const parent = window.parent as any;

    if (parent?.hass) {
      hassAvailabilityChecked = true;
      hassAvailable = true;
      return parent.hass;
    }

    const haElement = parent?.document?.querySelector?.('home-assistant');
    if (haElement?.hass) {
      hassAvailabilityChecked = true;
      hassAvailable = true;
      return haElement.hass;
    }

    hassAvailabilityChecked = true;
    hassAvailable = false;
    return null;
  } catch {
    hassAvailabilityChecked = true;
    hassAvailable = false;
    return null;
  }
};

const getParentCustomCards = (): Array<{ type?: string; name?: string }> => {
  const parent = getParentWindow();
  const cards = parent?.customCards;
  return Array.isArray(cards) ? cards : [];
};

const hasButtonCardRegistration = (): boolean => {
  return getParentCustomCards().some((entry) => {
    const type = (entry?.type || '').toString().toLowerCase();
    return type === 'button-card' || type === 'custom:button-card';
  });
};

const matchesResourceNeedle = (resourceUrl: string | undefined, needle: string): boolean => {
  return !!resourceUrl && resourceUrl.toLowerCase().includes(needle);
};

export const fetchLovelaceResources = async (): Promise<Array<{ id?: string; type?: string; url: string }>> => {
  const resources = await callHassWS('lovelace/resources');
  return Array.isArray(resources) ? resources : [];
};

export const checkButtonBuilderEnvironment = async (config?: ButtonConfigSnapshot): Promise<ButtonBuilderEnvironmentReport> => {
  const requirements: BuilderRequirementStatus[] = [];

  if (!getHass()) {
    requirements.push({
      id: 'ha-context',
      label: 'Home Assistant context',
      required: true,
      status: 'unavailable',
      details: 'The panel is running in a restricted context, so Home Assistant checks and dashboard features are unavailable.',
    });

    return {
      checkedAt: Date.now(),
      requirements,
    };
  }

  const resources = await fetchLovelaceResources();
  const buttonCardResourceInstalled = resources.some((resource) => matchesResourceNeedle(resource.url, 'button-card'));
  const buttonCardRegistered = hasButtonCardRegistration();
  const usedIcons = collectConfigIcons(config);
  const fontAwesomeResourceInstalled = resources.some((resource) => matchesResourceNeedle(resource.url, 'fontawesome'));
  const simpleIconsResourceInstalled = resources.some((resource) => matchesResourceNeedle(resource.url, 'simpleicons'));

  requirements.push({
    id: 'button-card',
    label: 'custom:button-card',
    required: true,
    status: buttonCardResourceInstalled || buttonCardRegistered ? 'ok' : 'missing',
    details: buttonCardResourceInstalled || buttonCardRegistered
      ? 'button-card appears to be installed and available in Lovelace.'
      : 'Button Builder generates custom:button-card YAML, so users need the button-card custom card installed in Home Assistant.',
    actionLabel: buttonCardResourceInstalled || buttonCardRegistered ? undefined : 'Install button-card',
    actionUrl: buttonCardResourceInstalled || buttonCardRegistered ? undefined : 'https://github.com/custom-cards/button-card',
  });

  if (usesFontAwesomeIcons(usedIcons)) {
    requirements.push({
      id: 'fontawesome-icons',
      label: 'Font Awesome icons',
      required: false,
      status: fontAwesomeResourceInstalled ? 'ok' : 'warning',
      details: fontAwesomeResourceInstalled
        ? 'This button uses Font Awesome icons and the related resource appears to be installed.'
        : 'This button uses Font Awesome icon prefixes (`fas:`, `far:`, or `fab:`). Users will need the Home Assistant Font Awesome integration for those icons to render.',
      actionLabel: fontAwesomeResourceInstalled ? undefined : 'Install hass-fontawesome',
      actionUrl: fontAwesomeResourceInstalled ? undefined : 'https://github.com/thomasloven/hass-fontawesome',
    });
  }

  if (usesSimpleIcons(usedIcons)) {
    requirements.push({
      id: 'simple-icons',
      label: 'Simple Icons',
      required: false,
      status: simpleIconsResourceInstalled ? 'ok' : 'warning',
      details: simpleIconsResourceInstalled
        ? 'This button uses Simple Icons and the related resource appears to be installed.'
        : 'This button uses the `si:` icon prefix. Users will need the Home Assistant Simple Icons integration for those icons to render.',
      actionLabel: simpleIconsResourceInstalled ? undefined : 'Install hass-simpleicons',
      actionUrl: simpleIconsResourceInstalled ? undefined : 'https://github.com/vigonotion/hass-simpleicons',
    });
  }

  if (config?.customFontName && config?.customFontUrl) {
    requirements.push({
      id: 'custom-font',
      label: 'Custom web font',
      required: false,
      status: 'warning',
      details: 'This button uses a custom web font. Users need network access to the configured font URL for the typography to match the builder preview.',
    });
  }

  const storageTargets = await fetchStorageDashboardTargets();
  requirements.push({
    id: 'storage-dashboards',
    label: 'Storage dashboards',
    required: false,
    status: storageTargets.length > 0 ? 'ok' : 'warning',
    details: storageTargets.length > 0
      ? 'Direct Add to Dashboard is available for at least one storage dashboard.'
      : 'No storage dashboards were found. Users can still copy YAML manually, but one-click Add to Dashboard will not be available.',
  });

  return {
    checkedAt: Date.now(),
    requirements,
  };
};

/**
 * Environment check for the Bubble Card builder: verifies that the
 * custom:bubble-card resource is installed in Lovelace.
 */
export const checkBubbleCardEnvironment = async (): Promise<ButtonBuilderEnvironmentReport> => {
  const requirements: BuilderRequirementStatus[] = [];

  if (!getHass()) {
    requirements.push({
      id: 'ha-context',
      label: 'Home Assistant context',
      required: true,
      status: 'unavailable',
      details: 'The panel is running in a restricted context, so Home Assistant checks are unavailable.',
    });
    return { checkedAt: Date.now(), requirements };
  }

  const resources = await fetchLovelaceResources();
  const resourceInstalled = resources.some((resource) => matchesResourceNeedle(resource.url, 'bubble-card'));
  const registered = getParentCustomCards().some((entry) => {
    const type = (entry?.type || '').toString().toLowerCase();
    return type === 'bubble-card' || type === 'custom:bubble-card';
  });
  const installed = resourceInstalled || registered;

  requirements.push({
    id: 'bubble-card',
    label: 'custom:bubble-card',
    required: true,
    status: installed ? 'ok' : 'missing',
    details: installed
      ? 'Bubble Card appears to be installed and available in Lovelace.'
      : 'This builder generates custom:bubble-card YAML, which requires the Bubble Card custom card to be installed in Home Assistant (available via HACS).',
    actionLabel: installed ? undefined : 'Install Bubble Card',
    actionUrl: installed ? undefined : 'https://github.com/Clooos/Bubble-Card',
  });

  return { checkedAt: Date.now(), requirements };
};

const callHassWS = async (type: string, data?: any): Promise<any | null> => {
  const hass = getHass();

  if (!hass) {
    return null;
  }

  try {
    if (typeof hass.callWS === 'function') {
      return await hass.callWS({ type, ...data });
    }

    if (hass.connection?.sendMessagePromise) {
      return await hass.connection.sendMessagePromise({ type, ...data });
    }

    return null;
  } catch {
    console.debug('Button Builder: WebSocket call failed (this is normal if HA features are unavailable)');
    return null;
  }
};

export const fetchDashboards = async (): Promise<DashboardInfo[]> => {
  try {
    const dashboards =
      await callHassWS('lovelace/dashboards/list') ??
      await callHassWS('lovelace/dashboards');

    if (!dashboards || !Array.isArray(dashboards)) {
      return [];
    }

    return dashboards;
  } catch {
    return [];
  }
};

export const fetchDashboardConfig = async (urlPath: string | null): Promise<any> => {
  try {
    const config = await callHassWS('lovelace/config', { url_path: urlPath });
    return config;
  } catch {
    return null;
  }
};

const extractBackground = (config: any): string | null => {
  if (!config) return null;
  if (config.background) {
    return config.background;
  }
  if (config.views && config.views.length > 0) {
    for (const view of config.views) {
      if (view.background) {
        return view.background;
      }
    }
  }
  return null;
};

const extractGridConfig = (config: any): DashboardGridConfig => {
  if (!config || !config.views || config.views.length === 0) {
    return DEFAULT_GRID_CONFIGS.masonry;
  }

  const firstView = config.views[0];
  const viewType = firstView.type || 'masonry';
  const gridConfig: DashboardGridConfig = {
    ...DEFAULT_GRID_CONFIGS[viewType] || DEFAULT_GRID_CONFIGS.masonry
  };

  if (firstView.columns !== undefined) {
    gridConfig.columns = firstView.columns;
  }
  if (firstView.max_columns !== undefined) {
    gridConfig.maxColumns = firstView.max_columns;
  }
  if (viewType === 'sections' && firstView.sections) {
    if (firstView.card_size !== undefined) {
      gridConfig.cardSize = firstView.card_size;
    }
    if (firstView.dense !== undefined) {
      gridConfig.dense = firstView.dense;
    }
  }
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

const getDefaultDashboardMode = (): 'storage' | 'yaml' | null => {
  const hass = getHass();
  const mode = hass?.panels?.lovelace?.config?.mode;
  return mode === 'storage' || mode === 'yaml' ? mode : null;
};

const extractViewOptions = (config: any): DashboardViewOption[] => {
  if (!config || !Array.isArray(config.views)) {
    return [];
  }

  return config.views.map((view: any, index: number) => {
    const sections = Array.isArray(view?.sections)
      ? view.sections.map((section: any, sectionIndex: number) => ({
          index: sectionIndex,
          title: section?.title || `Section ${sectionIndex + 1}`,
        }))
      : [];

    return {
      index,
      title: view?.title || `View ${index + 1}`,
      path: view?.path,
      type: view?.type || 'masonry',
      sections,
    };
  });
};

const cloneConfig = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const saveDashboardConfig = async (urlPath: string | null, config: any): Promise<void> => {
  const hass = getHass();
  if (!hass) {
    throw new Error('Home Assistant dashboard editing is unavailable in this context.');
  }

  const payload = {
    type: 'lovelace/config/save',
    url_path: urlPath,
    config,
  };

  try {
    if (typeof hass.callWS === 'function') {
      await hass.callWS(payload);
      return;
    }
    if (hass.connection?.sendMessagePromise) {
      await hass.connection.sendMessagePromise(payload);
      return;
    }
  } catch {
    throw new Error('Failed to save the dashboard configuration.');
  }

  throw new Error('Home Assistant dashboard editing is not supported in this environment.');
};

export const fetchStorageDashboardTargets = async (): Promise<DashboardWriteTarget[]> => {
  const targets: DashboardWriteTarget[] = [];
  const seen = new Set<string>();

  try {
    if (getDefaultDashboardMode() === 'storage') {
      const defaultConfig = await fetchDashboardConfig(null);
      if (defaultConfig) {
        targets.push({
          dashboardId: 'lovelace',
          title: defaultConfig.title || 'Default Dashboard',
          urlPath: null,
          views: extractViewOptions(defaultConfig),
        });
        seen.add('lovelace');
      }
    }

    const dashboards = await fetchDashboards();
    for (const dashboard of dashboards) {
      if (dashboard.mode !== 'storage') {
        continue;
      }

      const dashboardId = dashboard.url_path || dashboard.id;
      if (!dashboardId || seen.has(dashboardId)) {
        continue;
      }

      const config = await fetchDashboardConfig(dashboard.url_path || dashboard.id);
      if (!config) {
        continue;
      }

      targets.push({
        dashboardId,
        title: dashboard.title || dashboard.id,
        urlPath: dashboard.url_path || dashboard.id,
        views: extractViewOptions(config),
      });
      seen.add(dashboardId);
    }
  } catch {
    return [];
  }

  return targets.filter(target => target.views.length > 0);
};

const appendCardsToDashboardConfig = (
  config: any,
  viewIndex: number,
  sectionIndex: number | undefined,
  cardConfigs: Record<string, any>[]
): any => {
  if (!config || !Array.isArray(config.views)) {
    throw new Error('The selected dashboard configuration could not be loaded.');
  }

  const nextConfig = cloneConfig(config);
  const targetView = nextConfig.views[viewIndex];

  if (!targetView) {
    throw new Error('The selected dashboard view no longer exists.');
  }

  if (targetView.type === 'sections') {
    if (!Array.isArray(targetView.sections) || targetView.sections.length === 0) {
      throw new Error('The selected sections view has no sections to add the card to.');
    }

    const targetSection = targetView.sections[sectionIndex ?? 0];
    if (!targetSection) {
      throw new Error('The selected dashboard section no longer exists.');
    }

    targetSection.cards = Array.isArray(targetSection.cards)
      ? [...targetSection.cards, ...cardConfigs]
      : [...cardConfigs];
  } else {
    targetView.cards = Array.isArray(targetView.cards)
      ? [...targetView.cards, ...cardConfigs]
      : [...cardConfigs];
  }

  return nextConfig;
};

export const addCardsToDashboard = async ({
  dashboardId,
  viewIndex,
  sectionIndex,
  cardConfigs,
}: AddCardsToDashboardParams): Promise<void> => {
  if (!cardConfigs.length) {
    throw new Error('No button cards were selected to add to the dashboard.');
  }

  const urlPath = dashboardId === 'lovelace' ? null : dashboardId;
  const config = await fetchDashboardConfig(urlPath);
  const nextConfig = appendCardsToDashboardConfig(config, viewIndex, sectionIndex, cardConfigs);
  await saveDashboardConfig(urlPath, nextConfig);
};

export const addCardToDashboard = async ({
  dashboardId,
  viewIndex,
  sectionIndex,
  cardConfig,
}: AddCardToDashboardParams): Promise<void> => {
  await addCardsToDashboard({
    dashboardId,
    viewIndex,
    sectionIndex,
    cardConfigs: [cardConfig],
  });
};

export const fetchAllDashboardConfigs = async (): Promise<DashboardConfig[]> => {
  const configs: DashboardConfig[] = [];
  if (hassAvailabilityChecked && !hassAvailable) {
    return configs;
  }

  try {
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
      }
    }
  } catch {
  }

  return configs;
};

export type DashboardBackground = DashboardConfig;
export const fetchAllDashboardBackgrounds = fetchAllDashboardConfigs;

export const parseBackgroundToCss = (background: string | null | undefined): CSSProperties => {
  if (!background || typeof background !== 'string') return {};
  if (background.includes('url(')) {
    return { background };
  }
  if (background.startsWith('var(')) {
    return { background };
  }
  if (background.startsWith('#') || background.startsWith('rgb') || background.startsWith('hsl')) {
    return { backgroundColor: background };
  }
  return { background };
};