import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { getIconComponent } from '../services/iconMapper';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

// Popular MDI icons organized by category
const ICON_CATEGORIES = {
  'Lights': [
    'mdi:lightbulb', 'mdi:lightbulb-on', 'mdi:lightbulb-off', 'mdi:lightbulb-outline',
    'mdi:lamp', 'mdi:lamps', 'mdi:ceiling-light', 'mdi:floor-lamp', 'mdi:desk-lamp',
    'mdi:led-strip', 'mdi:led-strip-variant', 'mdi:wall-sconce', 'mdi:chandelier',
    'mdi:light-switch', 'mdi:light-flood-down', 'mdi:light-flood-up', 'mdi:track-light',
    'mdi:vanity-light', 'mdi:outdoor-lamp', 'mdi:coach-lamp'
  ],
  'Climate': [
    'mdi:thermometer', 'mdi:thermometer-lines', 'mdi:temperature-celsius', 'mdi:temperature-fahrenheit',
    'mdi:fan', 'mdi:fan-off', 'mdi:air-conditioner', 'mdi:hvac', 'mdi:heat-wave',
    'mdi:snowflake', 'mdi:fire', 'mdi:water-percent', 'mdi:weather-sunny',
    'mdi:radiator', 'mdi:radiator-off', 'mdi:heating-coil', 'mdi:coolant-temperature'
  ],
  'Security': [
    'mdi:lock', 'mdi:lock-open', 'mdi:lock-outline', 'mdi:lock-open-outline',
    'mdi:shield', 'mdi:shield-home', 'mdi:shield-check', 'mdi:shield-lock',
    'mdi:alarm-light', 'mdi:bell', 'mdi:bell-ring', 'mdi:bell-outline',
    'mdi:cctv', 'mdi:camera', 'mdi:video', 'mdi:motion-sensor',
    'mdi:door', 'mdi:door-open', 'mdi:door-closed', 'mdi:gate'
  ],
  'Media': [
    'mdi:play', 'mdi:pause', 'mdi:stop', 'mdi:skip-next', 'mdi:skip-previous',
    'mdi:volume-high', 'mdi:volume-low', 'mdi:volume-mute', 'mdi:volume-off',
    'mdi:speaker', 'mdi:speaker-wireless', 'mdi:cast', 'mdi:television',
    'mdi:music', 'mdi:music-note', 'mdi:playlist-music', 'mdi:radio',
    'mdi:spotify', 'mdi:youtube', 'mdi:netflix', 'mdi:plex'
  ],
  'Rooms': [
    'mdi:home', 'mdi:home-outline', 'mdi:home-variant', 'mdi:home-assistant',
    'mdi:sofa', 'mdi:bed', 'mdi:bed-double', 'mdi:baby-carriage',
    'mdi:bathtub', 'mdi:shower', 'mdi:toilet', 'mdi:fridge',
    'mdi:stove', 'mdi:microwave', 'mdi:dishwasher', 'mdi:washing-machine',
    'mdi:garage', 'mdi:garage-open', 'mdi:car', 'mdi:desk'
  ],
  'Devices': [
    'mdi:power', 'mdi:power-plug', 'mdi:power-socket', 'mdi:power-plug-off',
    'mdi:flash', 'mdi:flash-off', 'mdi:lightning-bolt', 'mdi:battery',
    'mdi:wifi', 'mdi:bluetooth', 'mdi:router-wireless', 'mdi:access-point',
    'mdi:cellphone', 'mdi:tablet', 'mdi:laptop', 'mdi:monitor',
    'mdi:printer', 'mdi:robot-vacuum', 'mdi:coffee-maker', 'mdi:kettle'
  ],
  'Sensors': [
    'mdi:motion-sensor', 'mdi:run', 'mdi:walk', 'mdi:human',
    'mdi:water', 'mdi:water-alert', 'mdi:smoke-detector', 'mdi:gas-cylinder',
    'mdi:gauge', 'mdi:speedometer', 'mdi:chart-line', 'mdi:pulse',
    'mdi:vibrate', 'mdi:proximity-sensor', 'mdi:leak', 'mdi:molecule-co2'
  ],
  'Weather': [
    'mdi:weather-sunny', 'mdi:weather-cloudy', 'mdi:weather-rainy', 'mdi:weather-snowy',
    'mdi:weather-fog', 'mdi:weather-windy', 'mdi:weather-lightning', 'mdi:weather-night',
    'mdi:umbrella', 'mdi:sun-wireless', 'mdi:moon-waning-crescent', 'mdi:cloud',
    'mdi:weather-partly-cloudy', 'mdi:weather-pouring', 'mdi:weather-hurricane', 'mdi:weather-tornado'
  ],
  'Actions': [
    'mdi:check', 'mdi:close', 'mdi:plus', 'mdi:minus',
    'mdi:arrow-up', 'mdi:arrow-down', 'mdi:arrow-left', 'mdi:arrow-right',
    'mdi:refresh', 'mdi:sync', 'mdi:reload', 'mdi:restart',
    'mdi:cog', 'mdi:wrench', 'mdi:tune', 'mdi:dots-vertical',
    'mdi:menu', 'mdi:apps', 'mdi:view-grid', 'mdi:information'
  ],
  'Shapes': [
    'mdi:circle', 'mdi:circle-outline', 'mdi:square', 'mdi:square-outline',
    'mdi:triangle', 'mdi:triangle-outline', 'mdi:hexagon', 'mdi:hexagon-outline',
    'mdi:star', 'mdi:star-outline', 'mdi:heart', 'mdi:heart-outline',
    'mdi:diamond', 'mdi:diamond-outline', 'mdi:octagon', 'mdi:pentagon'
  ],
};

// All popular icons flattened for search
const ALL_ICONS = Object.values(ICON_CATEGORIES).flat();

// Third-party icon prefixes with examples
const THIRD_PARTY_PREFIXES = [
  { prefix: 'mdi:', name: 'Material Design Icons', example: 'mdi:lightbulb' },
  { prefix: 'hass:', name: 'Home Assistant', example: 'hass:home-assistant' },
  { prefix: 'fas:', name: 'Font Awesome Solid', example: 'fas:home' },
  { prefix: 'far:', name: 'Font Awesome Regular', example: 'far:bell' },
  { prefix: 'fab:', name: 'Font Awesome Brands', example: 'fab:apple' },
  { prefix: 'si:', name: 'Simple Icons', example: 'si:homeassistant' },
  { prefix: 'phu:', name: 'Philips Hue', example: 'phu:bulb-classic' },
];

const IconPreview = ({ icon, size = 20 }: { icon: string; size?: number }) => {
  const IconComponent = getIconComponent(icon);
  if (IconComponent) {
    return <IconComponent style={{ width: size, height: size }} />;
  }
  // For non-MDI icons, show a placeholder with the prefix
  const prefix = icon.split(':')[0];
  return (
    <div 
      className="flex items-center justify-center text-[8px] text-gray-500 font-mono bg-gray-800 rounded"
      style={{ width: size, height: size }}
    >
      {prefix}
    </div>
  );
};

export const IconPicker: React.FC<Props> = ({ value, onChange, label = 'Icon', placeholder = 'mdi:lightbulb' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!search) return [];
    const query = search.toLowerCase().replace('mdi:', '').replace('mdi-', '');
    return ALL_ICONS.filter(icon => 
      icon.toLowerCase().includes(query)
    ).slice(0, 50); // Limit results
  }, [search]);

  const handleSelect = (icon: string) => {
    onChange(icon);
    setIsOpen(false);
    setSearch('');
    setSelectedCategory(null);
  };

  const categoryIcons = selectedCategory ? ICON_CATEGORIES[selectedCategory as keyof typeof ICON_CATEGORIES] : [];

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      
      {/* Input with icon preview */}
      <div className="relative">
        <div className="flex items-center gap-2">
          {/* Icon Preview */}
          <div className="w-10 h-[38px] bg-gray-800 border border-gray-700 rounded flex items-center justify-center shrink-0">
            {value ? (
              <IconPreview icon={value} size={22} />
            ) : (
              <span className="text-gray-600 text-xs">?</span>
            )}
          </div>
          
          {/* Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="w-full h-[38px] bg-gray-800 border border-gray-700 rounded px-3 pr-8 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-[400px] overflow-hidden flex flex-col">
            {/* Search */}
            <div className="p-2 border-b border-gray-800">
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setSelectedCategory(null); }}
                  placeholder="Search icons..."
                  className="w-full h-8 bg-gray-800 border border-gray-700 rounded pl-8 pr-8 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Search Results */}
              {search && (
                <div className="p-2">
                  {filteredIcons.length > 0 ? (
                    <div className="grid grid-cols-6 gap-1">
                      {filteredIcons.map(icon => (
                        <button
                          key={icon}
                          onClick={() => handleSelect(icon)}
                          className={`p-2 rounded hover:bg-gray-800 flex flex-col items-center gap-1 transition-colors ${value === icon ? 'bg-blue-600/30 ring-1 ring-blue-500' : ''}`}
                          title={icon}
                        >
                          <IconPreview icon={icon} size={20} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-4">
                      No icons found for "{search}"
                      <div className="text-xs mt-1">Try typing the full icon name like "mdi:lightbulb"</div>
                    </div>
                  )}
                </div>
              )}

              {/* Category View */}
              {!search && selectedCategory && (
                <div className="p-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs text-blue-400 hover:text-blue-300 mb-2 flex items-center gap-1"
                  >
                    ← Back to categories
                  </button>
                  <div className="text-xs text-gray-400 uppercase font-bold mb-2">{selectedCategory}</div>
                  <div className="grid grid-cols-6 gap-1">
                    {categoryIcons.map(icon => (
                      <button
                        key={icon}
                        onClick={() => handleSelect(icon)}
                        className={`p-2 rounded hover:bg-gray-800 flex flex-col items-center gap-1 transition-colors ${value === icon ? 'bg-blue-600/30 ring-1 ring-blue-500' : ''}`}
                        title={icon}
                      >
                        <IconPreview icon={icon} size={20} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {!search && !selectedCategory && (
                <div className="p-2 space-y-3">
                  {/* Quick Categories */}
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Categories</div>
                    <div className="grid grid-cols-2 gap-1">
                      {Object.keys(ICON_CATEGORIES).map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 text-left text-sm text-gray-300"
                        >
                          <IconPreview icon={ICON_CATEGORIES[category as keyof typeof ICON_CATEGORIES][0]} size={16} />
                          <span>{category}</span>
                          <span className="text-[10px] text-gray-600 ml-auto">{ICON_CATEGORIES[category as keyof typeof ICON_CATEGORIES].length}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Third-Party Icons Info */}
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Third-Party Icon Libraries</div>
                    <div className="space-y-1">
                      {THIRD_PARTY_PREFIXES.map(({ prefix, name, example }) => (
                        <button
                          key={prefix}
                          onClick={() => onChange(example)}
                          className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-800 text-left"
                        >
                          <code className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-blue-400">{prefix}</code>
                          <span className="text-xs text-gray-400">{name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2">
                      Note: Third-party icons require the respective integration installed in Home Assistant (e.g., hass-fontawesome, hass-simpleicons).
                    </p>
                  </div>

                  {/* Recent/Common */}
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Popular Icons</div>
                    <div className="grid grid-cols-8 gap-1">
                      {['mdi:lightbulb', 'mdi:fan', 'mdi:thermometer', 'mdi:lock', 'mdi:home', 'mdi:power', 'mdi:play', 'mdi:cog',
                        'mdi:television', 'mdi:speaker', 'mdi:garage', 'mdi:door', 'mdi:camera', 'mdi:bell', 'mdi:wifi', 'mdi:battery'].map(icon => (
                        <button
                          key={icon}
                          onClick={() => handleSelect(icon)}
                          className={`p-1.5 rounded hover:bg-gray-800 flex items-center justify-center transition-colors ${value === icon ? 'bg-blue-600/30 ring-1 ring-blue-500' : ''}`}
                          title={icon}
                        >
                          <IconPreview icon={icon} size={18} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
