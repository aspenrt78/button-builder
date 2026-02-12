// Tile Card Configuration Panel

import React, { useState } from 'react';
import { TileCardConfig, TileCardColor, FeaturesPosition, StateContentType, TileFeature, FeatureType } from '../types';
import { EntitySelector } from '../../components/EntitySelector';
import { IconPicker } from '../../components/IconPicker';
import { ChevronDown, ChevronUp, Plus, Trash2, GripVertical } from 'lucide-react';

interface Props {
  config: TileCardConfig;
  setConfig: (config: TileCardConfig) => void;
}

const COLOR_OPTIONS: { value: TileCardColor | string; label: string }[] = [
  { value: 'state', label: 'State (Auto)' },
  { value: 'primary', label: 'Primary' },
  { value: 'accent', label: 'Accent' },
  { value: 'red', label: 'Red' },
  { value: 'pink', label: 'Pink' },
  { value: 'purple', label: 'Purple' },
  { value: 'deep-purple', label: 'Deep Purple' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'blue', label: 'Blue' },
  { value: 'light-blue', label: 'Light Blue' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'teal', label: 'Teal' },
  { value: 'green', label: 'Green' },
  { value: 'light-green', label: 'Light Green' },
  { value: 'lime', label: 'Lime' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'amber', label: 'Amber' },
  { value: 'orange', label: 'Orange' },
  { value: 'deep-orange', label: 'Deep Orange' },
  { value: 'brown', label: 'Brown' },
  { value: 'grey', label: 'Grey' },
  { value: 'blue-grey', label: 'Blue Grey' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
];

const STATE_CONTENT_OPTIONS: { value: StateContentType; label: string }[] = [
  { value: 'state', label: 'State' },
  { value: 'last-changed', label: 'Last Changed' },
  { value: 'last-updated', label: 'Last Updated' },
];

const SIMPLE_FEATURES: { type: FeatureType; label: string; description: string }[] = [
  { type: 'toggle', label: 'Toggle', description: 'Toggle switch/boolean' },
  { type: 'light-brightness', label: 'Light Brightness', description: 'Brightness slider' },
  { type: 'light-color-temp', label: 'Light Color Temp', description: 'Color temperature slider' },
  { type: 'cover-position', label: 'Cover Position', description: 'Cover position slider' },
  { type: 'cover-open-close', label: 'Cover Open/Close', description: 'Open/close buttons' },
  { type: 'fan-speed', label: 'Fan Speed', description: 'Fan speed controls' },
  { type: 'media-player-volume-slider', label: 'Volume Slider', description: 'Volume control' },
  { type: 'media-player-playback', label: 'Playback Controls', description: 'Play/pause/next/prev' },
  { type: 'target-temperature', label: 'Target Temperature', description: 'Temperature controls' },
  { type: 'target-humidity', label: 'Target Humidity', description: 'Humidity slider' },
  { type: 'numeric-input', label: 'Numeric Input', description: 'Number slider/buttons' },
  { type: 'bar-gauge', label: 'Bar Gauge', description: 'Horizontal bar gauge' },
  { type: 'trend-graph', label: 'Trend Graph', description: 'Mini history graph' },
];

export const ConfigPanel: React.FC<Props> = ({ config, setConfig }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    display: true,
    actions: false,
    features: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateConfig = (updates: Partial<TileCardConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const addFeature = (type: FeatureType) => {
    const newFeature: TileFeature = { type } as TileFeature;
    updateConfig({ features: [...(config.features || []), newFeature] });
  };

  const removeFeature = (index: number) => {
    const features = [...(config.features || [])];
    features.splice(index, 1);
    updateConfig({ features });
  };

  const updateFeature = (index: number, updates: Partial<TileFeature>) => {
    const features = [...(config.features || [])];
    features[index] = { ...features[index], ...updates } as TileFeature;
    updateConfig({ features });
  };

  const addStateContent = () => {
    const current = config.state_content || ['state'];
    updateConfig({ state_content: [...current, 'last-changed'] });
  };

  const removeStateContent = (index: number) => {
    const content = [...(config.state_content || [])];
    if (content.length > 1) {
      content.splice(index, 1);
      updateConfig({ state_content: content });
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Basic Settings */}
      <Section
        title="Basic Settings"
        expanded={expandedSections.basic}
        onToggle={() => toggleSection('basic')}
      >
        <div className="space-y-3">
          <EntitySelector
            value={config.entity}
            onChange={(entity) => updateConfig({ entity })}
            label="Entity"
            placeholder="Select entity..."
            allowAll={true}
          />

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={config.name || ''}
              onChange={(e) => updateConfig({ name: e.target.value })}
              placeholder="Optional custom name..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <IconPicker
            value={config.icon || ''}
            onChange={(icon) => updateConfig({ icon })}
            label="Icon"
            placeholder="Optional custom icon..."
          />

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Color</label>
            <select
              value={config.color || 'state'}
              onChange={(e) => updateConfig({ color: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {COLOR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {config.color && !COLOR_OPTIONS.find(o => o.value === config.color) && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Custom Color (Hex)</label>
              <input
                type="text"
                value={config.color}
                onChange={(e) => updateConfig({ color: e.target.value })}
                placeholder="#93c47d"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </Section>

      {/* Display Settings */}
      <Section
        title="Display"
        expanded={expandedSections.display}
        onToggle={() => toggleSection('display')}
      >
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.vertical || false}
              onChange={(e) => updateConfig({ vertical: e.target.checked })}
              className="rounded bg-gray-900 border-gray-700"
            />
            <span className="text-sm text-gray-300">Vertical Layout</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.hide_state || false}
              onChange={(e) => updateConfig({ hide_state: e.target.checked })}
              className="rounded bg-gray-900 border-gray-700"
            />
            <span className="text-sm text-gray-300">Hide State</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.show_entity_picture || false}
              onChange={(e) => updateConfig({ show_entity_picture: e.target.checked })}
              className="rounded bg-gray-900 border-gray-700"
            />
            <span className="text-sm text-gray-300">Show Entity Picture</span>
          </label>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-400">State Content</label>
              <button
                onClick={addStateContent}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                + Add
              </button>
            </div>
            <div className="space-y-1">
              {(config.state_content || ['state']).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const content = [...(config.state_content || [])];
                      content[index] = e.target.value;
                      updateConfig({ state_content: content });
                    }}
                    placeholder="state / attribute name"
                    className="flex-1 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-xs text-white"
                  />
                  {(config.state_content?.length || 0) > 1 && (
                    <button
                      onClick={() => removeStateContent(index)}
                      className="p-1 text-red-400 hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section
        title="Features"
        expanded={expandedSections.features}
        onToggle={() => toggleSection('features')}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Features Position</label>
            <select
              value={config.features_position || 'bottom'}
              onChange={(e) => updateConfig({ features_position: e.target.value as FeaturesPosition })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="bottom">Bottom</option>
              <option value="inline">Inline</option>
            </select>
          </div>

          <div className="space-y-2">
            {(config.features || []).map((feature, index) => (
              <div key={index} className="p-3 bg-gray-900 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-300">{feature.type}</span>
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-1 text-red-400 hover:bg-red-900/20 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <FeatureConfig feature={feature} onChange={(updates) => updateFeature(index, updates)} />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Add Feature</label>
            <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
              {SIMPLE_FEATURES.map(feat => (
                <button
                  key={feat.type}
                  onClick={() => addFeature(feat.type)}
                  className="text-left px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors"
                >
                  <div className="text-xs font-medium text-gray-200">{feat.label}</div>
                  <div className="text-[10px] text-gray-500">{feat.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

// Section component with collapse
const Section: React.FC<{
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, expanded, onToggle, children }) => (
  <div className="border border-gray-800 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-850 transition-colors"
    >
      <span className="text-sm font-semibold text-gray-200">{title}</span>
      {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {expanded && <div className="p-4 bg-gray-950">{children}</div>}
  </div>
);

// Feature-specific configuration
const FeatureConfig: React.FC<{
  feature: TileFeature;
  onChange: (updates: Partial<TileFeature>) => void;
}> = ({ feature, onChange }) => {
  switch (feature.type) {
    case 'numeric-input':
      return (
        <select
          value={feature.style || 'slider'}
          onChange={(e) => onChange({ style: e.target.value as 'slider' | 'buttons' })}
          className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs"
        >
          <option value="slider">Slider</option>
          <option value="buttons">Buttons</option>
        </select>
      );

    case 'bar-gauge':
      return (
        <div className="space-y-2">
          <input
            type="number"
            value={feature.min ?? 0}
            onChange={(e) => onChange({ min: Number(e.target.value) })}
            placeholder="Min"
            className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs"
          />
          <input
            type="number"
            value={feature.max ?? 100}
            onChange={(e) => onChange({ max: Number(e.target.value) })}
            placeholder="Max"
            className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs"
          />
        </div>
      );

    case 'trend-graph':
      return (
        <div className="space-y-2">
          <input
            type="number"
            value={feature.hours_to_show ?? 24}
            onChange={(e) => onChange({ hours_to_show: Number(e.target.value) })}
            placeholder="Hours to show"
            className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs"
          />
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={feature.detail ?? true}
              onChange={(e) => onChange({ detail: e.target.checked })}
              className="rounded bg-gray-800 border-gray-700"
            />
            Show detail
          </label>
        </div>
      );

    default:
      return null;
  }
};
