// Home Assistant Entity Service
// Fetches HA entities when running inside HA iframe panel

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

class HomeAssistantService {
  private readonly isDevEnv: boolean;
  private entities: EntityInfo[] = [];
  private fetchAttempted: boolean = false;

  constructor() {
    this.isDevEnv = Boolean(IS_DEV_ENV);
  }

  private detectHomeAssistant(): boolean {
    // Multiple detection methods for different HA setups
    try {
      // Method 1: Check if we're in an iframe
      const inIframe = window.parent !== window;
      
      // Method 2: Check URL path patterns
      const path = window.location.pathname ?? '';
      const hostname = window.location.hostname ?? '';
      
      // Method 3: Check for HA-specific indicators
      const hasHassTokens = !!localStorage.getItem('hassTokens');
      const hasHassUrl = hostname.includes('homeassistant') || 
                         hostname.includes('hassio') ||
                         hostname.endsWith('.local') ||
                         hostname.includes('.nabu.casa');
      
      // Method 4: Check path for panel indicators
      const hasPanelPath = path.includes('/button_builder') || 
                          path.includes('/button-builder') ||
                          path.includes('/button_card_architect') || 
                          path.includes('/local/') ||
                          path.includes('/api/panel_custom/');
      
      const isHA = inIframe || hasHassTokens || hasHassUrl || hasPanelPath;
      
      console.log('[ButtonBuilder] HA Detection:', {
        inIframe,
        path,
        hostname,
        hasHassTokens,
        hasHassUrl,
        hasPanelPath,
        result: isHA
      });
      
      return isHA;
    } catch (e) {
      console.warn('[ButtonBuilder] HA detection error:', e);
      return false;
    }
  }

  async getEntities(): Promise<EntityInfo[]> {
    // Always try to fetch if we haven't yet, regardless of detection
    if (!this.fetchAttempted) {
      this.fetchAttempted = true;
      const fetched = await this.fetchEntitiesFromHA();
      if (fetched.length > 0) {
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

  private async fetchEntitiesFromHA(): Promise<EntityInfo[]> {
    const methods = [
      () => this.fetchWithToken(),
      () => this.fetchWithCredentials(),
      () => this.fetchDirect(),
    ];

    for (const method of methods) {
      try {
        const result = await method();
        if (result.length > 0) {
          this.entities = result;
          console.log(`[ButtonBuilder] Fetched ${result.length} entities`);
          return result;
        }
      } catch (e) {
        // Continue to next method
      }
    }

    console.warn('[ButtonBuilder] All fetch methods failed');
    return [];
  }

  private async fetchWithToken(): Promise<EntityInfo[]> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('No token available');
    }

    console.log('[ButtonBuilder] Trying fetch with Bearer token');
    const response = await fetch('/api/states', {
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
    console.log('[ButtonBuilder] Trying fetch with credentials');
    const response = await fetch('/api/states', {
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

  private async fetchDirect(): Promise<EntityInfo[]> {
    console.log('[ButtonBuilder] Trying direct fetch');
    const response = await fetch('/api/states');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return this.parseStates(await response.json());
  }

  private parseStates(states: HAEntity[]): EntityInfo[] {
    return states.map(entity => ({
      id: entity.entity_id,
      name: entity.attributes.friendly_name || entity.entity_id,
      state: entity.state,
      domain: entity.entity_id.split('.')[0],
      icon: entity.attributes.icon,
    }));
  }

  private getAuthToken(): string {
    // Try multiple token storage locations
    const tokenKeys = ['hassTokens', 'ha_auth', 'auth_token', 'access_token'];
    
    for (const key of tokenKeys) {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) continue;
        
        // Try parsing as JSON
        try {
          const parsed = JSON.parse(stored);
          const token = parsed?.access_token || parsed?.token || parsed?.refresh_token;
          if (token) {
            console.log(`[ButtonBuilder] Found token in ${key}`);
            return token;
          }
        } catch {
          // Not JSON, might be raw token
          if (stored.length > 20) {
            console.log(`[ButtonBuilder] Found raw token in ${key}`);
            return stored;
          }
        }
      } catch {
        continue;
      }
    }
    
    console.log('[ButtonBuilder] No auth token found');
    return '';
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

  getEntityDomains(): string[] {
    return ['light', 'switch', 'fan', 'cover', 'lock', 'climate', 'media_player', 
            'sensor', 'binary_sensor', 'scene', 'script', 'automation', 'vacuum', 
            'camera', 'alarm_control_panel', 'weather', 'person', 'device_tracker', 'input_boolean'];
  }
}

export const haService = new HomeAssistantService();
