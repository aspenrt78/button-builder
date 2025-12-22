// Home Assistant Entity Service
// Fetches HA entities when running inside HA iframe panel (browser & mobile app)

export interface HAEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface EntityInfo {
  id: string;
  name: string;
  state: string;
  domain: string;
  icon?: string;
}

const IS_DEV_ENV = typeof import.meta !== 'undefined' && (import.meta as any)?.env?.DEV;

/**
 * Safely check if we can access the parent window
 */
const canAccessParent = (): boolean => {
  try {
    const test = window.parent.location.href;
    return true;
  } catch {
    return false;
  }
};

/**
 * Get the Home Assistant hass object from parent window
 * This is the most reliable method for iOS companion app
 */
const getHass = (): any | null => {
  try {
    if (!canAccessParent()) {
      return null;
    }
    
    const parent = window.parent as any;
    
    // Direct hass object on parent
    if (parent?.hass) {
      return parent.hass;
    }
    
    // Try to get from home-assistant element
    const haElement = parent?.document?.querySelector?.('home-assistant');
    if (haElement?.hass) {
      return haElement.hass;
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Call Home Assistant WebSocket API
 */
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
  } catch (error) {
    console.debug('[ButtonBuilder] WebSocket call failed:', error);
    return null;
  }
};

// Get auth token from parent HA frame (works on mobile app)
const getParentHassAuth = (): Promise<string | null> => {
  return new Promise((resolve) => {
    // Timeout after 2 seconds
    const timeout = setTimeout(() => {
      console.log('[ButtonBuilder] Parent auth request timed out');
      resolve(null);
    }, 2000);

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'auth' && event.data?.token) {
        clearTimeout(timeout);
        window.removeEventListener('message', handleMessage);
        console.log('[ButtonBuilder] Received auth token from parent');
        resolve(event.data.token);
      }
    };

    window.addEventListener('message', handleMessage);

    // Request auth from parent frame
    try {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'request_auth' }, '*');
        console.log('[ButtonBuilder] Requested auth from parent frame');
      } else {
        clearTimeout(timeout);
        window.removeEventListener('message', handleMessage);
        resolve(null);
      }
    } catch (e) {
      clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      console.warn('[ButtonBuilder] Cannot communicate with parent:', e);
      resolve(null);
    }
  });
};

// Try to extract token from URL (some HA setups pass it)
const getTokenFromUrl = (): string | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('auth_token') || params.get('token') || null;
  } catch {
    return null;
  }
};

const ENTITY_CACHE_KEY = 'button-builder-entity-cache';
const ENTITY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface EntityCache {
  entities: EntityInfo[];
  timestamp: number;
}

class HomeAssistantService {
  private readonly isDevEnv: boolean;
  private entities: EntityInfo[] = [];
  private fetchAttempted: boolean = false;
  private authToken: string | null = null;

  constructor() {
    this.isDevEnv = Boolean(IS_DEV_ENV);
    this.initAuth();
    // Load cached entities on init
    this.loadCachedEntities();
  }

  private loadCachedEntities(): void {
    try {
      const cached = localStorage.getItem(ENTITY_CACHE_KEY);
      if (cached) {
        const data: EntityCache = JSON.parse(cached);
        // Check if cache is still valid
        if (Date.now() - data.timestamp < ENTITY_CACHE_TTL && data.entities.length > 0) {
          this.entities = data.entities;
          console.log(`[ButtonBuilder] Loaded ${this.entities.length} cached entities`);
        }
      }
    } catch (e) {
      console.debug('[ButtonBuilder] Failed to load cached entities:', e);
    }
  }

  private cacheEntities(entities: EntityInfo[]): void {
    try {
      const cache: EntityCache = {
        entities,
        timestamp: Date.now()
      };
      localStorage.setItem(ENTITY_CACHE_KEY, JSON.stringify(cache));
      console.log(`[ButtonBuilder] Cached ${entities.length} entities`);
    } catch (e) {
      console.debug('[ButtonBuilder] Failed to cache entities:', e);
    }
  }

  private async initAuth(): Promise<void> {
    // Try to get auth token early
    this.authToken = getTokenFromUrl() || this.getLocalStorageToken();
    
    if (!this.authToken) {
      const parentToken = await getParentHassAuth();
      if (parentToken) {
        this.authToken = parentToken;
      }
    }
  }

  async getEntities(): Promise<EntityInfo[]> {
    // Return cached entities immediately if available
    if (this.entities.length > 0 && !this.fetchAttempted) {
      // Start a background refresh
      this.refreshEntitiesInBackground();
      return this.entities;
    }

    // Always try to fetch if we haven't yet
    if (!this.fetchAttempted) {
      this.fetchAttempted = true;
      
      // Wait a bit for auth to initialize if needed
      if (!this.authToken) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.initAuth();
      }
      
      const fetched = await this.fetchEntitiesFromHA();
      if (fetched.length > 0) {
        this.cacheEntities(fetched);
        return fetched;
      }
    } else if (this.entities.length > 0) {
      return this.entities;
    }

    // Fall back to mock entities in dev mode
    if (this.isDevEnv) {
      console.log('[ButtonBuilder] Using mock entities (dev mode)');
      return this.getMockEntities();
    }

    return [];
  }

  private async refreshEntitiesInBackground(): Promise<void> {
    // Don't block the UI, just refresh in background
    this.fetchAttempted = true;
    try {
      const fetched = await this.fetchEntitiesFromHA();
      if (fetched.length > 0) {
        this.entities = fetched;
        this.cacheEntities(fetched);
      }
    } catch (e) {
      console.debug('[ButtonBuilder] Background refresh failed:', e);
    }
  }

  private async fetchEntitiesFromHA(): Promise<EntityInfo[]> {
    // Method 1: Try WebSocket via parent's hass object (BEST for iOS companion app)
    try {
      const hass = getHass();
      if (hass?.states) {
        // Direct access to states object
        console.log('[ButtonBuilder] Trying direct hass.states access');
        const states = Object.values(hass.states) as HAEntity[];
        if (states.length > 0) {
          const entities = this.parseStates(states);
          this.entities = entities;
          console.log(`[ButtonBuilder] ✓ Fetched ${entities.length} entities via hass.states`);
          return entities;
        }
      }
    } catch (e: any) {
      console.log('[ButtonBuilder] hass.states failed:', e.message);
    }

    // Method 2: Try WebSocket API call
    try {
      console.log('[ButtonBuilder] Trying WebSocket get_states');
      const states = await callHassWS('get_states');
      if (states && Array.isArray(states) && states.length > 0) {
        const entities = this.parseStates(states);
        this.entities = entities;
        console.log(`[ButtonBuilder] ✓ Fetched ${entities.length} entities via WebSocket`);
        return entities;
      }
    } catch (e: any) {
      console.log('[ButtonBuilder] WebSocket get_states failed:', e.message);
    }

    // Method 3: Fall back to HTTP fetch methods
    const methods: Array<() => Promise<EntityInfo[]>> = [];
    
    // If we have a token, try it first
    if (this.authToken) {
      methods.push(() => this.fetchWithToken(this.authToken!));
    }
    
    // Then try other methods
    methods.push(
      () => this.fetchWithCredentials(),
      () => this.fetchDirect(),
      () => this.fetchWithSameOrigin(),
    );

    for (const method of methods) {
      try {
        const result = await method();
        if (result.length > 0) {
          this.entities = result;
          console.log(`[ButtonBuilder] ✓ Fetched ${result.length} entities via HTTP`);
          return result;
        }
      } catch (e: any) {
        console.log(`[ButtonBuilder] HTTP fetch failed: ${e.message}`);
      }
    }

    console.warn('[ButtonBuilder] ✗ All fetch methods failed');
    return [];
  }

  private async fetchWithToken(token: string): Promise<EntityInfo[]> {
    console.log('[ButtonBuilder] Trying fetch with Bearer token');
    const response = await fetch('/api/states', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return this.parseStates(await response.json());
  }

  private async fetchWithCredentials(): Promise<EntityInfo[]> {
    console.log('[ButtonBuilder] Trying fetch with credentials: include');
    const response = await fetch('/api/states', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return this.parseStates(await response.json());
  }

  private async fetchWithSameOrigin(): Promise<EntityInfo[]> {
    console.log('[ButtonBuilder] Trying fetch with credentials: same-origin');
    const response = await fetch('/api/states', {
      method: 'GET',
      credentials: 'same-origin',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return this.parseStates(await response.json());
  }

  private async fetchDirect(): Promise<EntityInfo[]> {
    console.log('[ButtonBuilder] Trying direct fetch');
    const response = await fetch('/api/states');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return this.parseStates(await response.json());
  }

  private parseStates(states: HAEntity[]): EntityInfo[] {
    if (!Array.isArray(states)) {
      console.warn('[ButtonBuilder] Invalid states response:', typeof states);
      return [];
    }
    return states.map(entity => ({
      id: entity.entity_id,
      name: entity.attributes?.friendly_name || entity.entity_id,
      state: entity.state,
      domain: entity.entity_id.split('.')[0],
      icon: entity.attributes?.icon,
    }));
  }

  private getLocalStorageToken(): string | null {
    // Try multiple token storage locations
    const tokenKeys = ['hassTokens', 'ha_auth', 'auth_token', 'access_token', 'hass_tokens'];
    
    for (const key of tokenKeys) {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) continue;
        
        // Try parsing as JSON
        try {
          const parsed = JSON.parse(stored);
          const token = parsed?.access_token || parsed?.token || parsed?.refresh_token || parsed?.hassUrl;
          if (token && typeof token === 'string' && token.length > 20) {
            console.log(`[ButtonBuilder] Found token in localStorage.${key}`);
            return token;
          }
        } catch {
          // Not JSON, might be raw token
          if (stored.length > 20 && !stored.startsWith('{')) {
            console.log(`[ButtonBuilder] Found raw token in localStorage.${key}`);
            return stored;
          }
        }
      } catch {
        continue;
      }
    }
    
    console.log('[ButtonBuilder] No auth token found in localStorage');
    return null;
  }

  private getMockEntities(): EntityInfo[] {
    return [
      { id: 'light.living_room', name: 'Living Room Light', state: 'on', domain: 'light', icon: 'mdi:lightbulb' },
      { id: 'light.bedroom', name: 'Bedroom Light', state: 'off', domain: 'light', icon: 'mdi:lightbulb' },
      { id: 'light.kitchen', name: 'Kitchen Light', state: 'on', domain: 'light', icon: 'mdi:lightbulb' },
      { id: 'switch.fan', name: 'Ceiling Fan', state: 'off', domain: 'switch', icon: 'mdi:fan' },
      { id: 'switch.outlet', name: 'Power Outlet', state: 'on', domain: 'switch', icon: 'mdi:power-socket' },
      { id: 'fan.bedroom', name: 'Bedroom Fan', state: 'off', domain: 'fan', icon: 'mdi:fan' },
      { id: 'cover.garage_door', name: 'Garage Door', state: 'closed', domain: 'cover', icon: 'mdi:garage' },
      { id: 'cover.blinds', name: 'Window Blinds', state: 'open', domain: 'cover', icon: 'mdi:blinds' },
      { id: 'lock.front_door', name: 'Front Door Lock', state: 'locked', domain: 'lock', icon: 'mdi:lock' },
      { id: 'lock.back_door', name: 'Back Door Lock', state: 'unlocked', domain: 'lock', icon: 'mdi:lock-open' },
      { id: 'climate.thermostat', name: 'Thermostat', state: 'heat', domain: 'climate', icon: 'mdi:thermostat' },
      { id: 'media_player.living_room', name: 'Living Room TV', state: 'playing', domain: 'media_player', icon: 'mdi:television' },
      { id: 'sensor.temperature', name: 'Temperature Sensor', state: '22', domain: 'sensor', icon: 'mdi:thermometer' },
      { id: 'sensor.humidity', name: 'Humidity Sensor', state: '45', domain: 'sensor', icon: 'mdi:water-percent' },
      { id: 'binary_sensor.motion', name: 'Motion Sensor', state: 'off', domain: 'binary_sensor', icon: 'mdi:motion-sensor' },
      { id: 'binary_sensor.door', name: 'Door Sensor', state: 'off', domain: 'binary_sensor', icon: 'mdi:door' },
      { id: 'scene.movie_time', name: 'Movie Time', state: 'scened', domain: 'scene', icon: 'mdi:movie' },
      { id: 'script.goodnight', name: 'Goodnight Routine', state: 'off', domain: 'script', icon: 'mdi:sleep' },
      { id: 'automation.lights_on', name: 'Auto Lights On', state: 'on', domain: 'automation', icon: 'mdi:robot' },
      { id: 'vacuum.roomba', name: 'Roomba', state: 'docked', domain: 'vacuum', icon: 'mdi:robot-vacuum' },
    ];
  }

  async searchEntities(query: string): Promise<EntityInfo[]> {
    const entities = await this.getEntities();
    if (!query) return entities;

    const lowerQuery = query.toLowerCase();
    return entities.filter(e => 
      e.id.toLowerCase().includes(lowerQuery) ||
      e.name.toLowerCase().includes(lowerQuery) ||
      e.domain.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get full entity data including state and attributes
   */
  async getEntityData(entityId: string): Promise<HAEntity | null> {
    try {
      const hass = getHass();
      if (hass?.states?.[entityId]) {
        return hass.states[entityId] as HAEntity;
      }

      // Fallback: try API endpoint
      if (!this.authToken) {
        await this.initAuth();
      }
      
      // Get hassUrl from hass object or derive from parent
      const hassUrl = hass?.hassUrl || (canAccessParent() ? window.parent.location.origin : null);
      
      if (!this.authToken || !hassUrl) {
        return null;
      }

      const response = await fetch(`${hassUrl}/api/states/${entityId}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`[ButtonBuilder] Error fetching entity ${entityId}:`, error);
      return null;
    }
  }

  /**
   * Get attribute keys from an entity
   */
  async getEntityAttributes(entityId: string): Promise<string[]> {
    const entity = await this.getEntityData(entityId);
    if (!entity?.attributes) {
      return [];
    }

    // Return attribute keys, excluding common internal ones
    return Object.keys(entity.attributes).filter(attr => 
      !['friendly_name', 'icon', 'entity_picture', 'supported_features', 'device_class'].includes(attr)
    );
  }

  getEntityDomains(): string[] {
    return ['light', 'switch', 'fan', 'cover', 'lock', 'climate', 'media_player', 
            'sensor', 'binary_sensor', 'scene', 'script', 'automation', 'vacuum', 
            'camera', 'alarm_control_panel', 'weather', 'person', 'device_tracker', 'input_boolean'];
  }
}

export const haService = new HomeAssistantService();
