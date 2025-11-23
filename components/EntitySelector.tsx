import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { haService, EntityInfo } from '../services/homeAssistantService';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const EntitySelector: React.FC<Props> = ({ value, onChange, label, placeholder = "Select or type entity..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [entities, setEntities] = useState<EntityInfo[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<EntityInfo[]>([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (search) {
      const filtered = entities.filter(e => 
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.domain.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredEntities(filtered);
    } else {
      setFilteredEntities(entities);
    }
  }, [search, entities]);

  const loadEntities = async () => {
    setLoading(true);
    try {
      const data = await haService.getEntities();
      setEntities(data);
      setFilteredEntities(data);
    } catch (error) {
      console.error('Failed to load entities:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectEntity = (entityId: string) => {
    onChange(entityId);
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
    };
    return colors[domain] || 'text-gray-400';
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
        <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-80 overflow-hidden flex flex-col">
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

          {/* Entity List */}
          <div className="overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-xs">Loading entities...</div>
            ) : filteredEntities.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-xs">No entities found</div>
            ) : (
              filteredEntities.map((entity) => (
                <button
                  key={entity.id}
                  onClick={() => selectEntity(entity.id)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors border-b border-gray-750 last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{entity.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono truncate">{entity.id}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-bold uppercase ${getDomainColor(entity.domain)}`}>
                        {entity.domain}
                      </span>
                      <span className="text-[10px] text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded">
                        {entity.state}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-700 bg-gray-900">
            <div className="text-[9px] text-gray-500 text-center">
              {filteredEntities.length} {filteredEntities.length === 1 ? 'entity' : 'entities'} found
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
