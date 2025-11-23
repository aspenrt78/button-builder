// Home Assistant Entity Service
// Polls HA for available entities when running inside HA

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

class HomeAssistantService {
  private isInsideHA: boolean = false;
  private entities: EntityInfo[] = [];
  private connection: any = null;

  constructor() {
    // Detect if we're running inside Home Assistant
    this.isInsideHA = this.detectHomeAssistant();
  }

  private detectHomeAssistant(): boolean {
    // Check if we're in an iframe with HA parent
    try {
      return window.parent !== window && 
             window.location.pathname.includes('button-architect');
    } catch {
      return false;
    }
  }

  async getEntities(): Promise<EntityInfo[]> {
    if (!this.isInsideHA) {
      // Return mock entities for development
      return this.getMockEntities();
    }

    try {
      // Try to get entities from Home Assistant
      const response = await fetch('/api/states', {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (response.ok) {
        const states: HAEntity[] = await response.json();
        this.entities = states.map(entity => ({
          id: entity.entity_id,
          name: entity.attributes.friendly_name || entity.entity_id,
          state: entity.state,
          domain: entity.entity_id.split('.')[0],
          icon: entity.attributes.icon,
        }));
        return this.entities;
      }
    } catch (error) {
      console.warn('Failed to fetch HA entities, using mock data:', error);
    }

    return this.getMockEntities();
  }

  private getAuthToken(): string {
    // Try to get auth token from HA
    try {
      return localStorage.getItem('hassTokens') || '';
    } catch {
      return '';
    }
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
