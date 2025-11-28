import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { haService, EntityInfo } from '../services/homeAssistantService';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onEntitySelect?: (entity: EntityInfo) => void; // Called with full entity info when selected from dropdown
  label?: string;
  placeholder?: string;
  allowAll?: boolean; // Allow all entities including non-actionable ones
}

// Domains that work well with button-card (actionable/toggleable)
const ACTIONABLE_DOMAINS = [
  'light', 'switch', 'fan', 'cover', 'lock', 'climate', 'media_player',
  'vacuum', 'scene', 'script', 'automation', 'input_boolean', 'input_button',
  'button', 'remote', 'humidifier', 'water_heater', 'siren', 'alarm_control_panel',
  'camera', 'garage', 'gate', 'valve', 'lawn_mower'
];

// Domains that are useful for display/info on buttons
const DISPLAY_DOMAINS = [
  'sensor', 'binary_sensor', 'weather', 'person', 'device_tracker',
  'sun', 'zone', 'input_number', 'input_select', 'input_text', 'counter',
  'timer', 'number', 'select', 'text'
];

// Domains that don't work well with button-card (excluded by default)
const EXCLUDED_DOMAINS = [
  'date', 'datetime', 'time', 'update', 'tts', 'stt', 'conversation',
  'persistent_notification', 'notify', 'calendar', 'todo', 'event',
  'image', 'geo_location', 'device_automation', 'homeassistant',
  'system_log', 'recorder', 'logger', 'group' // groups can be confusing
];

// Domain priority for sorting (lower = higher priority)
const DOMAIN_PRIORITY: Record<string, number> = {
  light: 1,
  switch: 2,
  fan: 3,
  climate: 4,
  cover: 5,
  lock: 6,
  media_player: 7,
  vacuum: 8,
  scene: 9,
  script: 10,
  automation: 11,
  input_boolean: 12,
  input_button: 13,
  button: 14,
  camera: 15,
  alarm_control_panel: 16,
  sensor: 20,
  binary_sensor: 21,
  person: 22,
  device_tracker: 23,
  weather: 24,
};

export const EntitySelector: React.FC<Props> = ({ value, onChange, onEntitySelect, label, placeholder = "Select or type entity...", allowAll = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [entities, setEntities] = useState<EntityInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllDomains, setShowAllDomains] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadEntities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const loadEntities = async () => {
    setLoading(true);
    try {
      const data = await haService.getEntities();
      setEntities(data);
    } catch (error) {
      console.error('Failed to load entities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort entities
  const filteredEntities = useMemo(() => {
    let filtered = entities;

    // Filter out excluded domains unless allowAll or showAllDomains
    if (!allowAll && !showAllDomains) {
      filtered = filtered.filter(e => !EXCLUDED_DOMAINS.includes(e.domain));
    }

    // Apply search filter
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(e => 
        e.id.toLowerCase().includes(query) ||
        e.name.toLowerCase().includes(query) ||
        e.domain.toLowerCase().includes(query)
      );
    }

    // Sort by domain priority, then by name
    filtered.sort((a, b) => {
      const priorityA = DOMAIN_PRIORITY[a.domain] ?? 50;
      const priorityB = DOMAIN_PRIORITY[b.domain] ?? 50;
      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [entities, search, allowAll, showAllDomains]);

  // Group entities by domain for display
  const groupedEntities = useMemo(() => {
    const groups: Record<string, EntityInfo[]> = {};
    filteredEntities.forEach(entity => {
      if (!groups[entity.domain]) {
        groups[entity.domain] = [];
      }
      groups[entity.domain].push(entity);
    });
    return groups;
  }, [filteredEntities]);

  const selectEntity = (entity: EntityInfo) => {
    onChange(entity.id);
    if (onEntitySelect) {
      onEntitySelect(entity);
    }
    setIsOpen(false);
    setSearch('');
  };

  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      light: 'text-yellow-400',
      switch: 'text-blue-400',
      fan: 'text-cyan-400',
      cover: 'text-purple-400',
      lock: 'text-red-400',
      climate: 'text-orange-400',
      media_player: 'text-pink-400',
      sensor: 'text-green-400',
      binary_sensor: 'text-teal-400',
      scene: 'text-indigo-400',
      script: 'text-violet-400',
      automation: 'text-amber-400',
      vacuum: 'text-emerald-400',
      camera: 'text-rose-400',
      person: 'text-sky-400',
      input_boolean: 'text-lime-400',
      button: 'text-fuchsia-400',
    };
    return colors[domain] || 'text-gray-400';
  };

  const getDomainIcon = (domain: string) => {
    const isActionable = ACTIONABLE_DOMAINS.includes(domain);
    return isActionable ? '⚡' : '📊';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-blue-500 pr-8"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-2 border-b border-gray-700">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search entities..."
                className="bg-gray-900 border border-gray-700 rounded px-7 py-1.5 text-xs text-white w-full focus:outline-none focus:border-blue-500"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="px-3 py-1.5 border-b border-gray-700 bg-gray-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[9px] text-gray-500">
              <span>⚡ Actionable</span>
              <span>📊 Display</span>
            </div>
            {!allowAll && (
              <button
                onClick={() => setShowAllDomains(!showAllDomains)}
                className={`text-[9px] px-2 py-0.5 rounded ${showAllDomains ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
              >
                {showAllDomains ? 'Showing All' : 'Show All'}
              </button>
            )}
          </div>

          {/* Entity List */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-xs">Loading entities...</div>
            ) : filteredEntities.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-xs">
                No entities found
                {!showAllDomains && !allowAll && (
                  <button
                    onClick={() => setShowAllDomains(true)}
                    className="block mx-auto mt-2 text-blue-400 hover:text-blue-300"
                  >
                    Show all entity types
                  </button>
                )}
              </div>
            ) : (
              Object.entries(groupedEntities).map(([domain, domainEntities]: [string, EntityInfo[]]) => (
                <div key={domain}>
                  {/* Domain Header */}
                  <div className="sticky top-0 px-3 py-1 bg-gray-900/90 backdrop-blur border-b border-gray-800 flex items-center gap-2">
                    <span>{getDomainIcon(domain)}</span>
                    <span className={`text-[10px] font-bold uppercase ${getDomainColor(domain)}`}>
                      {domain.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] text-gray-600">({domainEntities.length})</span>
                  </div>
                  {/* Entities in this domain */}
                  {domainEntities.map((entity) => (
                    <button
                      key={entity.id}
                      onClick={() => selectEntity(entity)}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors border-b border-gray-800/50 ${value === entity.id ? 'bg-blue-600/20' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-white truncate">{entity.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono truncate">{entity.id}</div>
                        </div>
                        <span className="text-[10px] text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded shrink-0">
                          {entity.state}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-700 bg-gray-900">
            <div className="text-[9px] text-gray-500 text-center">
              {filteredEntities.length} {filteredEntities.length === 1 ? 'entity' : 'entities'}
              {!showAllDomains && !allowAll && ' (actionable + display)'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
