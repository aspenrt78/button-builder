// Tile Card Configuration Panel

import React, { useState } from 'react';
import { TileCardConfig, TileCardColor, FeaturesPosition, StateContentType, TileFeature, FeatureType, TileAction, TileActionType } from '../types';
import { EntitySelector } from '../../components/EntitySelector';
import { IconPicker } from '../../components/IconPicker';
import { ChevronDown, ChevronUp, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

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

// Full tile-card feature catalog, grouped by domain.
const FEATURE_CATALOG: { group: string; items: { type: FeatureType; label: string; description: string }[] }[] = [
  {
    group: 'General',
    items: [
      { type: 'toggle', label: 'Toggle', description: 'Toggle switch/boolean' },
      { type: 'button', label: 'Button', description: 'Press button entity' },
      { type: 'select-options', label: 'Select Options', description: 'Option picker for select entities' },
      { type: 'numeric-input', label: 'Numeric Input', description: 'Number slider or buttons' },
      { type: 'date-set', label: 'Date', description: 'Date picker for date entities' },
      { type: 'counter-actions', label: 'Counter Actions', description: 'Increment / decrement / reset' },
      { type: 'update-actions', label: 'Update Actions', description: 'Install / skip for update entities' },
    ],
  },
  {
    group: 'Light',
    items: [
      { type: 'light-brightness', label: 'Brightness', description: 'Brightness slider' },
      { type: 'light-color-temp', label: 'Color Temperature', description: 'Color temperature slider' },
      { type: 'light-color-favorites', label: 'Color Favorites', description: 'Favorite color shortcut buttons' },
    ],
  },
  {
    group: 'Climate',
    items: [
      { type: 'climate-hvac-modes', label: 'HVAC Modes', description: 'Heat / cool / auto / off' },
      { type: 'climate-fan-modes', label: 'Fan Modes', description: 'Climate fan mode selector' },
      { type: 'climate-preset-modes', label: 'Preset Modes', description: 'Eco / comfort / away presets' },
      { type: 'climate-swing-modes', label: 'Swing Modes', description: 'Vertical swing mode selector' },
      { type: 'climate-swing-horizontal-modes', label: 'Swing Horizontal Modes', description: 'Horizontal swing mode selector' },
      { type: 'target-temperature', label: 'Target Temperature', description: 'Temperature controls' },
    ],
  },
  {
    group: 'Cover & Valve',
    items: [
      { type: 'cover-open-close', label: 'Open/Close', description: 'Open / stop / close buttons' },
      { type: 'cover-position', label: 'Position', description: 'Cover position slider' },
      { type: 'cover-position-favorite', label: 'Position Favorite', description: 'Favorite position button' },
      { type: 'cover-tilt', label: 'Tilt', description: 'Tilt open / stop / close buttons' },
      { type: 'cover-tilt-position', label: 'Tilt Position', description: 'Tilt position slider' },
      { type: 'cover-tilt-favorite', label: 'Tilt Favorite', description: 'Favorite tilt position button' },
      { type: 'valve-open-close', label: 'Valve Open/Close', description: 'Valve open / close buttons' },
      { type: 'valve-position', label: 'Valve Position', description: 'Valve position slider' },
      { type: 'valve-position-favorite', label: 'Valve Position Favorite', description: 'Favorite valve position button' },
    ],
  },
  {
    group: 'Fan',
    items: [
      { type: 'fan-speed', label: 'Speed', description: 'Fan speed slider' },
      { type: 'fan-direction', label: 'Direction', description: 'Forward / reverse buttons' },
      { type: 'fan-oscillate', label: 'Oscillate', description: 'Oscillation toggle' },
      { type: 'fan-preset-modes', label: 'Preset Modes', description: 'Fan preset selector' },
    ],
  },
  {
    group: 'Media Player',
    items: [
      { type: 'media-player-playback', label: 'Playback', description: 'Play / pause / next / prev' },
      { type: 'media-player-volume-slider', label: 'Volume Slider', description: 'Volume control slider' },
      { type: 'media-player-volume-buttons', label: 'Volume Buttons', description: 'Volume +/- buttons' },
      { type: 'media-player-sound-mode', label: 'Sound Mode', description: 'Sound mode selector' },
      { type: 'media-player-source', label: 'Source', description: 'Input source selector' },
    ],
  },
  {
    group: 'Security',
    items: [
      { type: 'alarm-modes', label: 'Alarm Modes', description: 'Arm home / away / disarm' },
      { type: 'lock-commands', label: 'Lock Commands', description: 'Lock / unlock buttons' },
      { type: 'lock-open-door', label: 'Open Door', description: 'Open-door button for locks' },
    ],
  },
  {
    group: 'Humidifier & Water Heater',
    items: [
      { type: 'humidifier-toggle', label: 'Humidifier Toggle', description: 'On/off toggle' },
      { type: 'humidifier-modes', label: 'Humidifier Modes', description: 'Mode selector' },
      { type: 'target-humidity', label: 'Target Humidity', description: 'Humidity slider' },
      { type: 'water-heater-operation-modes', label: 'Water Heater Modes', description: 'Operation mode selector' },
    ],
  },
  {
    group: 'Vacuum & Mower',
    items: [
      { type: 'vacuum-commands', label: 'Vacuum Commands', description: 'Start / stop / locate / dock' },
      { type: 'lawn-mower-commands', label: 'Mower Commands', description: 'Start/pause / dock' },
    ],
  },
  {
    group: 'Weather',
    items: [
      { type: 'temperature-forecast', label: 'Temperature Forecast', description: 'Forecast temperature chart' },
      { type: 'precipitation-forecast', label: 'Precipitation Forecast', description: 'Forecast precipitation chart' },
    ],
  },
  {
    group: 'Sensors & Area',
    items: [
      { type: 'bar-gauge', label: 'Bar Gauge', description: 'Horizontal bar gauge' },
      { type: 'trend-graph', label: 'Trend Graph', description: 'Mini history graph' },
      { type: 'area-controls', label: 'Area Controls', description: 'Light / fan / switch controls for areas' },
    ],
  },
];

const ACTION_TYPE_OPTIONS: { value: TileActionType | 'default'; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'more-info', label: 'More Info' },
  { value: 'toggle', label: 'Toggle' },
  { value: 'perform-action', label: 'Perform Action (Call Service)' },
  { value: 'navigate', label: 'Navigate' },
  { value: 'url', label: 'Open URL' },
  { value: 'assist', label: 'Assist' },
  { value: 'none', label: 'None' },
];

const ACTION_SLOTS: { key: keyof Pick<TileCardConfig, 'tap_action' | 'hold_action' | 'double_tap_action' | 'icon_tap_action' | 'icon_hold_action' | 'icon_double_tap_action'>; label: string }[] = [
  { key: 'tap_action', label: 'Tap' },
  { key: 'hold_action', label: 'Hold' },
  { key: 'double_tap_action', label: 'Double Tap' },
  { key: 'icon_tap_action', label: 'Icon Tap' },
  { key: 'icon_hold_action', label: 'Icon Hold' },
  { key: 'icon_double_tap_action', label: 'Icon Double Tap' },
];

const inputClass = 'w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500';
const selectClass = 'w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white focus:outline-none focus:border-blue-500';

const parseCommaList = (raw: string): string[] =>
  raw.split(',').map(s => s.trim()).filter(Boolean);

export const ConfigPanel: React.FC<Props> = ({ config, setConfig }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    display: true,
    actions: false,
    features: true,
    layout: false,
  });
  const [featurePickerOpen, setFeaturePickerOpen] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateConfig = (updates: Partial<TileCardConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const addFeature = (type: FeatureType) => {
    const newFeature: TileFeature = { type } as TileFeature;
    updateConfig({ features: [...(config.features || []), newFeature] });
    setFeaturePickerOpen(false);
  };

  const removeFeature = (index: number) => {
    const features = [...(config.features || [])];
    features.splice(index, 1);
    updateConfig({ features });
  };

  const moveFeature = (index: number, direction: -1 | 1) => {
    const features = [...(config.features || [])];
    const target = index + direction;
    if (target < 0 || target >= features.length) return;
    [features[index], features[target]] = [features[target], features[index]];
    updateConfig({ features });
  };

  const updateFeature = (index: number, updates: Partial<TileFeature>) => {
    const features = [...(config.features || [])];
    features[index] = { ...features[index], ...updates } as TileFeature;
    updateConfig({ features });
  };

  const addStateContent = () => {
    const current = config.state_content || ['state'];
    updateConfig({ state_content: [...current, 'last_changed'] });
  };

  const removeStateContent = (index: number) => {
    const content = [...(config.state_content || [])];
    if (content.length > 1) {
      content.splice(index, 1);
      updateConfig({ state_content: content });
    }
  };

  const featureLabel = (type: FeatureType): string => {
    for (const group of FEATURE_CATALOG) {
      const item = group.items.find(i => i.type === type);
      if (item) return item.label;
    }
    return type;
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
              value={COLOR_OPTIONS.find(o => o.value === config.color) ? config.color : 'custom'}
              onChange={(e) => updateConfig({ color: e.target.value === 'custom' ? '#3b82f6' : e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {COLOR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
              <option value="custom">Custom (Hex)…</option>
            </select>
          </div>

          {config.color && !COLOR_OPTIONS.find(o => o.value === config.color) && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(config.color) ? config.color : '#3b82f6'}
                onChange={(e) => updateConfig({ color: e.target.value })}
                className="h-9 w-12 bg-gray-900 border border-gray-700 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.color}
                onChange={(e) => updateConfig({ color: e.target.value })}
                placeholder="#93c47d"
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
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
            <p className="text-[10px] text-gray-500 mt-1">Use "state", "last_changed", "last_updated", or any attribute name.</p>
          </div>
        </div>
      </Section>

      {/* Actions */}
      <Section
        title="Actions"
        expanded={expandedSections.actions}
        onToggle={() => toggleSection('actions')}
      >
        <div className="space-y-4">
          {ACTION_SLOTS.map(({ key, label }) => (
            <ActionEditor
              key={key}
              label={label}
              action={config[key]}
              onChange={(action) => updateConfig({ [key]: action })}
            />
          ))}
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
                  <span className="text-xs font-medium text-gray-300">{featureLabel(feature.type)}</span>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => moveFeature(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:bg-gray-800 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveFeature(index, 1)}
                      disabled={index === (config.features?.length || 0) - 1}
                      className="p-1 text-gray-400 hover:bg-gray-800 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => removeFeature(index)}
                      className="p-1 text-red-400 hover:bg-red-900/20 rounded"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <FeatureConfig feature={feature} onChange={(updates) => updateFeature(index, updates)} />
              </div>
            ))}
          </div>

          <button
            onClick={() => setFeaturePickerOpen(!featurePickerOpen)}
            className="w-full px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-xs font-medium text-blue-400 transition-colors"
          >
            {featurePickerOpen ? 'Close Feature Picker' : '+ Add Feature'}
          </button>

          {featurePickerOpen && (
            <div className="space-y-3 max-h-72 overflow-y-auto border border-gray-800 rounded-lg p-2">
              {FEATURE_CATALOG.map(group => (
                <div key={group.group}>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1 mb-1">{group.group}</div>
                  <div className="grid grid-cols-1 gap-1">
                    {group.items.map(feat => (
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
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Layout */}
      <Section
        title="Grid Layout"
        expanded={expandedSections.layout}
        onToggle={() => toggleSection('layout')}
      >
        <div className="space-y-3">
          <p className="text-[10px] text-gray-500">Card size in sections-view dashboards. Leave blank for automatic sizing.</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Rows</label>
              <input
                type="number"
                min={1}
                value={config.grid_options?.rows ?? ''}
                onChange={(e) => {
                  const rows = e.target.value === '' ? undefined : Number(e.target.value);
                  const next = { ...config.grid_options, rows };
                  if (next.rows === undefined) delete next.rows;
                  updateConfig({ grid_options: Object.keys(next).length ? next : undefined });
                }}
                placeholder="auto"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Columns</label>
              <select
                value={config.grid_options?.columns === 'full' ? 'full' : (config.grid_options?.columns ?? '')}
                onChange={(e) => {
                  const raw = e.target.value;
                  const columns = raw === '' ? undefined : (raw === 'full' ? 'full' as const : Number(raw));
                  const next = { ...config.grid_options, columns };
                  if (next.columns === undefined) delete next.columns;
                  updateConfig({ grid_options: Object.keys(next).length ? next : undefined });
                }}
                className={selectClass}
              >
                <option value="">Auto</option>
                {[1, 2, 3, 4, 6, 8, 9, 12].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
                <option value="full">Full width</option>
              </select>
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

// Editor for a single tile action slot (tap/hold/double-tap and icon variants)
const ActionEditor: React.FC<{
  label: string;
  action?: TileAction;
  onChange: (action: TileAction | undefined) => void;
}> = ({ label, action, onChange }) => {
  const actionType = action?.action ?? 'default';

  const handleTypeChange = (value: string) => {
    if (value === 'default') {
      onChange(undefined);
      return;
    }
    onChange({ action: value as TileActionType });
  };

  const update = (updates: Partial<TileAction>) => {
    if (!action) return;
    onChange({ ...action, ...updates });
  };

  const updateTarget = (key: 'entity_id' | 'device_id' | 'area_id', raw: string) => {
    if (!action) return;
    const ids = parseCommaList(raw);
    const target = { ...action.target };
    if (ids.length === 0) {
      delete target[key];
    } else {
      target[key] = ids.length === 1 ? ids[0] : ids;
    }
    update({ target: Object.keys(target).length ? target : undefined });
  };

  const targetValue = (key: 'entity_id' | 'device_id' | 'area_id'): string => {
    const value = action?.target?.[key];
    return Array.isArray(value) ? value.join(', ') : (value || '');
  };

  const confirmationText = typeof action?.confirmation === 'object' ? (action.confirmation.text || '') : '';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-400 w-28 shrink-0">{label}</span>
        <select value={actionType} onChange={(e) => handleTypeChange(e.target.value)} className={selectClass}>
          {ACTION_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {action?.action === 'navigate' && (
        <div className="space-y-2 pl-2 border-l-2 border-gray-800">
          <input
            type="text"
            value={action.navigation_path || ''}
            onChange={(e) => update({ navigation_path: e.target.value })}
            placeholder="/lovelace/living-room"
            className={inputClass}
          />
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={action.navigation_replace || false}
              onChange={(e) => update({ navigation_replace: e.target.checked || undefined })}
              className="rounded bg-gray-800 border-gray-700"
            />
            Replace current page in browser history
          </label>
        </div>
      )}

      {action?.action === 'url' && (
        <input
          type="text"
          value={action.url_path || ''}
          onChange={(e) => update({ url_path: e.target.value })}
          placeholder="https://example.com"
          className={inputClass}
        />
      )}

      {action?.action === 'assist' && (
        <div className="space-y-2 pl-2 border-l-2 border-gray-800">
          <input
            type="text"
            value={action.pipeline_id || ''}
            onChange={(e) => update({ pipeline_id: e.target.value || undefined })}
            placeholder="Pipeline ID (default: last_used)"
            className={inputClass}
          />
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={action.start_listening || false}
              onChange={(e) => update({ start_listening: e.target.checked || undefined })}
              className="rounded bg-gray-800 border-gray-700"
            />
            Start listening immediately
          </label>
        </div>
      )}

      {action?.action === 'perform-action' && (
        <div className="space-y-2 pl-2 border-l-2 border-gray-800">
          <input
            type="text"
            value={action.perform_action || ''}
            onChange={(e) => update({ perform_action: e.target.value })}
            placeholder="Action, e.g. light.turn_on"
            className={inputClass}
          />
          <input
            type="text"
            value={targetValue('entity_id')}
            onChange={(e) => updateTarget('entity_id', e.target.value)}
            placeholder="Target entity_id (comma separated for multiple)"
            className={inputClass}
          />
          <input
            type="text"
            value={targetValue('device_id')}
            onChange={(e) => updateTarget('device_id', e.target.value)}
            placeholder="Target device_id (comma separated for multiple)"
            className={inputClass}
          />
          <input
            type="text"
            value={targetValue('area_id')}
            onChange={(e) => updateTarget('area_id', e.target.value)}
            placeholder="Target area_id (comma separated for multiple)"
            className={inputClass}
          />
          <textarea
            value={action.data ? JSON.stringify(action.data, null, 2) : ''}
            onChange={(e) => {
              const raw = e.target.value.trim();
              if (!raw) {
                update({ data: undefined });
                return;
              }
              try {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                  update({ data: parsed });
                }
              } catch {
                // Keep typing; only commit when the JSON parses.
              }
            }}
            placeholder={'Action data (JSON), e.g.\n{ "brightness_pct": 50 }'}
            spellCheck={false}
            rows={3}
            className={`${inputClass} font-mono resize-y`}
          />
        </div>
      )}

      {action && action.action !== 'none' && (
        <div className="space-y-2 pl-2 border-l-2 border-gray-800">
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={!!action.confirmation}
              onChange={(e) => update({ confirmation: e.target.checked ? true : undefined })}
              className="rounded bg-gray-800 border-gray-700"
            />
            Require confirmation
          </label>
          {!!action.confirmation && (
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => update({ confirmation: e.target.value ? { text: e.target.value } : true })}
              placeholder="Confirmation text (optional)"
              className={inputClass}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Reusable comma-separated string list editor for feature options
const CommaListInput: React.FC<{
  label: string;
  values: string[] | undefined;
  placeholder: string;
  onChange: (values: string[]) => void;
}> = ({ label, values, placeholder, onChange }) => (
  <div>
    <label className="block text-[10px] font-medium text-gray-500 mb-1">{label}</label>
    <input
      type="text"
      defaultValue={(values || []).join(', ')}
      onBlur={(e) => onChange(parseCommaList(e.target.value))}
      placeholder={placeholder}
      className={inputClass}
    />
  </div>
);

// Checkbox group for enumerated feature options
const CheckboxGroup: React.FC<{
  options: { value: string; label: string }[];
  selected: string[] | undefined;
  onChange: (selected: string[]) => void;
}> = ({ options, selected, onChange }) => {
  const current = selected || [];
  const toggle = (value: string) => {
    onChange(current.includes(value) ? current.filter(v => v !== value) : [...current, value]);
  };
  return (
    <div className="grid grid-cols-2 gap-1">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={current.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            className="rounded bg-gray-800 border-gray-700"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
};

const StyleSelect: React.FC<{
  value: string | undefined;
  options: string[];
  onChange: (value: string) => void;
}> = ({ value, options, onChange }) => (
  <div>
    <label className="block text-[10px] font-medium text-gray-500 mb-1">Style</label>
    <select value={value || options[0]} onChange={(e) => onChange(e.target.value)} className={selectClass}>
      {options.map(o => (
        <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
      ))}
    </select>
  </div>
);

// Feature-specific configuration
const FeatureConfig: React.FC<{
  feature: TileFeature;
  onChange: (updates: Partial<TileFeature>) => void;
}> = ({ feature, onChange }) => {
  switch (feature.type) {
    case 'alarm-modes':
      return (
        <CheckboxGroup
          options={[
            { value: 'armed_home', label: 'Arm Home' },
            { value: 'armed_away', label: 'Arm Away' },
            { value: 'armed_night', label: 'Arm Night' },
            { value: 'armed_vacation', label: 'Arm Vacation' },
            { value: 'armed_custom_bypass', label: 'Custom Bypass' },
            { value: 'disarmed', label: 'Disarm' },
          ]}
          selected={feature.modes}
          onChange={(modes) => onChange({ modes: modes as any })}
        />
      );

    case 'climate-hvac-modes':
      return (
        <div className="space-y-2">
          <StyleSelect value={feature.style} options={['icons', 'dropdown']} onChange={(style) => onChange({ style: style as any })} />
          <CheckboxGroup
            options={[
              { value: 'auto', label: 'Auto' },
              { value: 'heat_cool', label: 'Heat/Cool' },
              { value: 'heat', label: 'Heat' },
              { value: 'cool', label: 'Cool' },
              { value: 'dry', label: 'Dry' },
              { value: 'fan_only', label: 'Fan Only' },
              { value: 'off', label: 'Off' },
            ]}
            selected={feature.hvac_modes}
            onChange={(hvac_modes) => onChange({ hvac_modes: hvac_modes as any })}
          />
        </div>
      );

    case 'climate-fan-modes':
      return (
        <div className="space-y-2">
          <StyleSelect value={feature.style} options={['dropdown', 'icons']} onChange={(style) => onChange({ style: style as any })} />
          <CommaListInput label="Fan modes" values={feature.fan_modes} placeholder="low, medium, high, auto" onChange={(fan_modes) => onChange({ fan_modes })} />
        </div>
      );

    case 'climate-preset-modes':
      return (
        <div className="space-y-2">
          <StyleSelect value={feature.style} options={['dropdown', 'icons']} onChange={(style) => onChange({ style: style as any })} />
          <CommaListInput label="Preset modes" values={feature.preset_modes} placeholder="eco, comfort, away, boost" onChange={(preset_modes) => onChange({ preset_modes })} />
        </div>
      );

    case 'climate-swing-modes':
      return (
        <div className="space-y-2">
          <StyleSelect value={feature.style} options={['dropdown', 'icons']} onChange={(style) => onChange({ style: style as any })} />
          <CommaListInput label="Swing modes" values={feature.swing_modes} placeholder="off, vertical, horizontal, both" onChange={(swing_modes) => onChange({ swing_modes })} />
        </div>
      );

    case 'climate-swing-horizontal-modes':
      return (
        <div className="space-y-2">
          <StyleSelect value={feature.style} options={['dropdown', 'icons']} onChange={(style) => onChange({ style: style as any })} />
          <CommaListInput label="Horizontal swing modes" values={feature.swing_horizontal_modes} placeholder="off, left, center, right" onChange={(swing_horizontal_modes) => onChange({ swing_horizontal_modes })} />
        </div>
      );

    case 'fan-preset-modes':
      return (
        <div className="space-y-2">
          <StyleSelect value={feature.style} options={['dropdown', 'icons']} onChange={(style) => onChange({ style: style as any })} />
          <CommaListInput label="Preset modes" values={feature.preset_modes} placeholder="auto, breeze, sleep" onChange={(preset_modes) => onChange({ preset_modes })} />
        </div>
      );

    case 'humidifier-modes':
      return (
        <div className="space-y-2">
          <StyleSelect value={feature.style} options={['dropdown', 'icons']} onChange={(style) => onChange({ style: style as any })} />
          <CommaListInput label="Modes" values={feature.modes} placeholder="normal, eco, away, boost" onChange={(modes) => onChange({ modes })} />
        </div>
      );

    case 'water-heater-operation-modes':
      return (
        <CommaListInput label="Operation modes" values={feature.operation_modes} placeholder="eco, electric, gas, off" onChange={(operation_modes) => onChange({ operation_modes })} />
      );

    case 'vacuum-commands':
      return (
        <CheckboxGroup
          options={[
            { value: 'start_pause', label: 'Start/Pause' },
            { value: 'stop', label: 'Stop' },
            { value: 'clean_spot', label: 'Clean Spot' },
            { value: 'locate', label: 'Locate' },
            { value: 'return_home', label: 'Return Home' },
          ]}
          selected={feature.commands}
          onChange={(commands) => onChange({ commands: commands as any })}
        />
      );

    case 'lawn-mower-commands':
      return (
        <CheckboxGroup
          options={[
            { value: 'start_pause', label: 'Start/Pause' },
            { value: 'dock', label: 'Dock' },
          ]}
          selected={feature.commands}
          onChange={(commands) => onChange({ commands: commands as any })}
        />
      );

    case 'counter-actions':
      return (
        <CheckboxGroup
          options={[
            { value: 'increment', label: 'Increment' },
            { value: 'decrement', label: 'Decrement' },
            { value: 'reset', label: 'Reset' },
          ]}
          selected={feature.actions}
          onChange={(actions) => onChange({ actions: actions as any })}
        />
      );

    case 'update-actions':
      return (
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Backup before install</label>
          <select value={feature.backup || 'ask'} onChange={(e) => onChange({ backup: e.target.value as any })} className={selectClass}>
            <option value="ask">Ask</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      );

    case 'area-controls':
      return (
        <CheckboxGroup
          options={[
            { value: 'light', label: 'Lights' },
            { value: 'fan', label: 'Fans' },
            { value: 'switch', label: 'Switches' },
          ]}
          selected={feature.controls}
          onChange={(controls) => onChange({ controls: controls as any })}
        />
      );

    case 'button':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={feature.action_name || ''}
            onChange={(e) => onChange({ action_name: e.target.value })}
            placeholder="Button label (optional)"
            className={inputClass}
          />
          <textarea
            value={feature.data ? JSON.stringify(feature.data, null, 2) : ''}
            onChange={(e) => {
              const raw = e.target.value.trim();
              if (!raw) {
                onChange({ data: undefined });
                return;
              }
              try {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                  onChange({ data: parsed });
                }
              } catch {
                // Keep typing; only commit when the JSON parses.
              }
            }}
            placeholder={'Press data (JSON), e.g.\n{ "duration": 5 }'}
            spellCheck={false}
            rows={3}
            className={`${inputClass} font-mono resize-y`}
          />
        </div>
      );

    case 'select-options':
      return (
        <CommaListInput label="Options" values={feature.options} placeholder="Leave empty for all options" onChange={(options) => onChange({ options })} />
      );

    case 'media-player-playback':
      return (
        <CheckboxGroup
          options={[
            { value: 'on_off', label: 'On/Off' },
            { value: 'shuffle', label: 'Shuffle' },
            { value: 'previous', label: 'Previous' },
            { value: 'play_pause_stop', label: 'Play/Pause/Stop' },
            { value: 'next', label: 'Next' },
            { value: 'repeat', label: 'Repeat' },
          ]}
          selected={feature.controls}
          onChange={(controls) => onChange({ controls: controls as any })}
        />
      );

    case 'media-player-volume-slider':
      return (
        <label className="flex items-center gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            checked={feature.show_mute_button ?? false}
            onChange={(e) => onChange({ show_mute_button: e.target.checked })}
            className="rounded bg-gray-800 border-gray-700"
          />
          Show mute button
        </label>
      );

    case 'media-player-volume-buttons':
      return (
        <div className="space-y-2">
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Volume step %</label>
            <input
              type="number"
              min={1}
              max={50}
              value={feature.step ?? 10}
              onChange={(e) => onChange({ step: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={feature.show_mute_button ?? false}
              onChange={(e) => onChange({ show_mute_button: e.target.checked })}
              className="rounded bg-gray-800 border-gray-700"
            />
            Show mute button
          </label>
        </div>
      );

    case 'media-player-sound-mode':
      return (
        <CommaListInput label="Sound modes" values={feature.sound_modes} placeholder="Leave empty for all sound modes" onChange={(sound_modes) => onChange({ sound_modes })} />
      );

    case 'media-player-source':
      return (
        <CommaListInput label="Sources" values={feature.sources} placeholder="Leave empty for all sources" onChange={(sources) => onChange({ sources })} />
      );

    case 'numeric-input':
      return (
        <select
          value={feature.style || 'slider'}
          onChange={(e) => onChange({ style: e.target.value as 'slider' | 'buttons' })}
          className={selectClass}
        >
          <option value="slider">Slider</option>
          <option value="buttons">Buttons</option>
        </select>
      );

    case 'bar-gauge':
      return (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Min</label>
            <input
              type="number"
              value={feature.min ?? 0}
              onChange={(e) => onChange({ min: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Max</label>
            <input
              type="number"
              value={feature.max ?? 100}
              onChange={(e) => onChange({ max: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
        </div>
      );

    case 'trend-graph':
      return (
        <div className="space-y-2">
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Hours to show</label>
            <input
              type="number"
              min={1}
              value={feature.hours_to_show ?? 24}
              onChange={(e) => onChange({ hours_to_show: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
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

    case 'temperature-forecast':
    case 'precipitation-forecast':
      return (
        <div className="space-y-2">
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Forecast type</label>
            <select
              value={feature.forecast_type || 'daily'}
              onChange={(e) => onChange({ forecast_type: e.target.value as any })}
              className={selectClass}
            >
              <option value="daily">Daily</option>
              <option value="hourly">Hourly</option>
              <option value="twice_daily">Twice Daily</option>
            </select>
          </div>
          {feature.type === 'precipitation-forecast' && (
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Precipitation type</label>
              <select
                value={feature.precipitation_type || 'precipitation'}
                onChange={(e) => onChange({ precipitation_type: e.target.value as any })}
                className={selectClass}
              >
                <option value="precipitation">Precipitation</option>
                <option value="precipitation_probability">Precipitation Probability</option>
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Days to show</label>
              <input
                type="number"
                min={1}
                value={feature.days_to_show ?? ''}
                onChange={(e) => onChange({ days_to_show: e.target.value === '' ? undefined : Number(e.target.value) })}
                placeholder="auto"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Hours to show</label>
              <input
                type="number"
                min={1}
                value={feature.hours_to_show ?? ''}
                onChange={(e) => onChange({ hours_to_show: e.target.value === '' ? undefined : Number(e.target.value) })}
                placeholder="auto"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Color</label>
            <input
              type="text"
              value={feature.color || ''}
              onChange={(e) => onChange({ color: e.target.value || undefined })}
              placeholder="e.g. blue or #2196f3"
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={feature.show_labels ?? false}
              onChange={(e) => onChange({ show_labels: e.target.checked })}
              className="rounded bg-gray-800 border-gray-700"
            />
            Show labels
          </label>
        </div>
      );

    default:
      return null;
  }
};
