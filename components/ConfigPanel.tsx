
import React, { useState } from 'react';
import { ButtonConfig, CustomField, Variable, StateStyleConfig, DEFAULT_LOCK_CONFIG, DEFAULT_PROTECT_CONFIG, DEFAULT_TOOLTIP_CONFIG, DEFAULT_TOAST_CONFIG } from '../types';
import { ControlInput } from './ControlInput';
import { EntitySelector } from './EntitySelector';
import { IconPicker } from './IconPicker';
import { LAYOUT_OPTIONS, ACTION_OPTIONS, TRANSFORM_OPTIONS, WEIGHT_OPTIONS, BORDER_STYLE_OPTIONS, ANIMATION_OPTIONS, BLUR_OPTIONS, SHADOW_SIZE_OPTIONS, TRIGGER_OPTIONS, LOCK_UNLOCK_OPTIONS, STATE_OPERATOR_OPTIONS, COLOR_TYPE_OPTIONS, PROTECT_TYPE_OPTIONS, FONT_FAMILY_OPTIONS, LETTER_SPACING_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import { Plus, X, Variable as VariableIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import { NavHeader, CategoryList, SectionList, useNavigation, SectionId } from './ConfigPanelNav';
import { PRESETS, Preset } from '../presets';

export type PresetCondition = 'always' | 'on' | 'off';

// Domain to icon mappings for auto-fill
const DOMAIN_ICONS: Record<string, string> = {
  // Lighting
  light: 'mdi:lightbulb',
  // Switches & Power
  switch: 'mdi:toggle-switch',
  input_boolean: 'mdi:toggle-switch-outline',
  // Climate & Comfort
  fan: 'mdi:fan',
  climate: 'mdi:thermostat',
  humidifier: 'mdi:air-humidifier',
  water_heater: 'mdi:water-boiler',
  // Covers & Shades
  cover: 'mdi:window-shutter',
  // Security
  lock: 'mdi:lock',
  alarm_control_panel: 'mdi:shield-home',
  // Media & Entertainment
  media_player: 'mdi:speaker',
  remote: 'mdi:remote',
  // Sensors (various types)
  binary_sensor: 'mdi:checkbox-blank-circle-outline',
  sensor: 'mdi:eye',
  // Location & Presence
  person: 'mdi:account',
  device_tracker: 'mdi:crosshairs-gps',
  zone: 'mdi:map-marker-radius',
  // Cameras & Doorbells
  camera: 'mdi:video',
  // Automation & Scripts
  automation: 'mdi:robot',
  script: 'mdi:script-text',
  scene: 'mdi:palette',
  // Input Helpers
  input_number: 'mdi:ray-vertex',
  input_select: 'mdi:form-dropdown',
  input_text: 'mdi:form-textbox',
  input_datetime: 'mdi:calendar-clock',
  input_button: 'mdi:gesture-tap-button',
  // Weather & Sun
  weather: 'mdi:weather-partly-cloudy',
  sun: 'mdi:weather-sunny',
  // Vacuum & Lawn
  vacuum: 'mdi:robot-vacuum',
  lawn_mower: 'mdi:robot-mower',
  // Notifications & Communication
  notify: 'mdi:bell',
  tts: 'mdi:text-to-speech',
  // Home Assistant Core
  update: 'mdi:package-up',
  button: 'mdi:gesture-tap-button',
  group: 'mdi:google-circles-communities',
  timer: 'mdi:timer',
  counter: 'mdi:counter',
  schedule: 'mdi:calendar-clock',
  // Miscellaneous
  plant: 'mdi:flower',
  image: 'mdi:image',
  calendar: 'mdi:calendar',
  todo: 'mdi:clipboard-check',
  stt: 'mdi:microphone',
  conversation: 'mdi:message-text',
};

// Specific entity ID patterns for more precise icon matching
const ENTITY_PATTERNS: Array<{ pattern: RegExp; icon: string }> = [
  // Sensors by type
  { pattern: /sensor\..*temperature/i, icon: 'mdi:thermometer' },
  { pattern: /sensor\..*humidity/i, icon: 'mdi:water-percent' },
  { pattern: /sensor\..*battery/i, icon: 'mdi:battery' },
  { pattern: /sensor\..*power|sensor\..*watt/i, icon: 'mdi:flash' },
  { pattern: /sensor\..*energy|sensor\..*kwh/i, icon: 'mdi:lightning-bolt' },
  { pattern: /sensor\..*motion/i, icon: 'mdi:motion-sensor' },
  { pattern: /sensor\..*door|sensor\..*window/i, icon: 'mdi:door' },
  { pattern: /sensor\..*illuminance|sensor\..*lux/i, icon: 'mdi:brightness-6' },
  { pattern: /sensor\..*pressure/i, icon: 'mdi:gauge' },
  { pattern: /sensor\..*co2|sensor\..*carbon/i, icon: 'mdi:molecule-co2' },
  { pattern: /sensor\..*pm25|sensor\..*pm10|sensor\..*air_quality/i, icon: 'mdi:air-filter' },
  // Binary sensors
  { pattern: /binary_sensor\..*motion/i, icon: 'mdi:motion-sensor' },
  { pattern: /binary_sensor\..*door/i, icon: 'mdi:door' },
  { pattern: /binary_sensor\..*window/i, icon: 'mdi:window-closed-variant' },
  { pattern: /binary_sensor\..*smoke/i, icon: 'mdi:smoke-detector' },
  { pattern: /binary_sensor\..*water|binary_sensor\..*leak/i, icon: 'mdi:water-alert' },
  { pattern: /binary_sensor\..*garage/i, icon: 'mdi:garage' },
  { pattern: /binary_sensor\..*vibration/i, icon: 'mdi:vibrate' },
  { pattern: /binary_sensor\..*occupancy/i, icon: 'mdi:home-account' },
  // Covers by type
  { pattern: /cover\..*garage/i, icon: 'mdi:garage' },
  { pattern: /cover\..*blind/i, icon: 'mdi:blinds' },
  { pattern: /cover\..*curtain/i, icon: 'mdi:curtains' },
  { pattern: /cover\..*shade/i, icon: 'mdi:roller-shade' },
  { pattern: /cover\..*door/i, icon: 'mdi:door' },
  { pattern: /cover\..*gate/i, icon: 'mdi:gate' },
  { pattern: /cover\..*window/i, icon: 'mdi:window-closed' },
  // Lights by type
  { pattern: /light\..*strip|light\..*led/i, icon: 'mdi:led-strip-variant' },
  { pattern: /light\..*ceiling|light\..*overhead/i, icon: 'mdi:ceiling-light' },
  { pattern: /light\..*floor|light\..*lamp/i, icon: 'mdi:floor-lamp' },
  { pattern: /light\..*desk|light\..*table/i, icon: 'mdi:desk-lamp' },
  { pattern: /light\..*outdoor|light\..*porch|light\..*patio/i, icon: 'mdi:outdoor-lamp' },
  { pattern: /light\..*chandelier/i, icon: 'mdi:chandelier' },
  // Media players
  { pattern: /media_player\..*tv|media_player\..*television/i, icon: 'mdi:television' },
  { pattern: /media_player\..*receiver|media_player\..*avr/i, icon: 'mdi:audio-video' },
  { pattern: /media_player\..*sonos|media_player\..*speaker/i, icon: 'mdi:speaker' },
  { pattern: /media_player\..*echo|media_player\..*alexa/i, icon: 'mdi:amazon-alexa' },
  { pattern: /media_player\..*google|media_player\..*nest/i, icon: 'mdi:google-home' },
  { pattern: /media_player\..*chromecast/i, icon: 'mdi:cast' },
  // Switches by type
  { pattern: /switch\..*outlet|switch\..*plug/i, icon: 'mdi:power-socket-us' },
  { pattern: /switch\..*pump/i, icon: 'mdi:water-pump' },
  { pattern: /switch\..*heater/i, icon: 'mdi:radiator' },
  // Climate
  { pattern: /climate\..*heat|climate\..*furnace/i, icon: 'mdi:fire' },
  { pattern: /climate\..*cool|climate\..*ac/i, icon: 'mdi:air-conditioner' },
];

function getIconForEntity(entityId: string, domain: string): string {
  // First check specific patterns for more precise matching
  for (const { pattern, icon } of ENTITY_PATTERNS) {
    if (pattern.test(entityId)) {
      return icon;
    }
  }
  
  // Fall back to domain-based icon
  return DOMAIN_ICONS[domain] || 'mdi:help-circle';
}

interface Props {
  config: ButtonConfig;
  setConfig: React.Dispatch<React.SetStateAction<ButtonConfig>>;
  activePreset?: Preset | null;
  // Preset management props
  onApplyPreset?: (preset: Preset, forState?: 'on' | 'off') => void;
  onResetToPreset?: () => void;
  presetCondition?: PresetCondition;
  onSetPresetCondition?: (condition: PresetCondition) => void;
  offStatePreset?: Preset | null;
  onStatePreset?: Preset | null;
  onSetOffStatePreset?: (preset: Preset | null) => void;
  onSetOnStatePreset?: (preset: Preset | null) => void;
}

// Section component removed - now using drill-down navigation via ConfigPanelNav

const ColorPairInput = ({ label, colorValue, setColor, autoValue, setAuto }: any) => (
  <div className="flex flex-col gap-1.5">
     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
       {label}
       <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setAuto(!autoValue)}>
         <div className={`w-2 h-2 rounded-full transition-colors ${autoValue ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-gray-600 group-hover:bg-gray-500'}`} />
         <span className={`text-[9px] transition-colors ${autoValue ? 'text-green-400' : 'text-gray-500 group-hover:text-gray-400'}`}>Match Entity</span>
       </div>
     </label>
     <div className="relative">
       {autoValue ? (
         <div className="h-[38px] w-full bg-gray-800 border border-gray-700 border-dashed rounded flex items-center justify-center text-xs text-gray-400 italic">
           Using Entity Color
         </div>
       ) : (
         <div className="flex items-center gap-2">
            <div 
              className="w-8 h-[38px] rounded border border-gray-600 overflow-hidden shrink-0 relative"
              style={{ backgroundColor: colorValue }}
            >
              <input 
                type="color" 
                value={colorValue} 
                onChange={(e) => setColor(e.target.value)}
                className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
              />
            </div>
            <input
               type="text"
               value={colorValue}
               placeholder="#FFFFFF"
               onChange={(e) => setColor(e.target.value)}
               className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-blue-500 h-[38px] font-mono"
             />
         </div>
       )}
     </div>
  </div>
);

export const ConfigPanel: React.FC<Props> = ({ 
  config, 
  setConfig, 
  activePreset, 
  onApplyPreset,
  onResetToPreset,
  presetCondition = 'always',
  onSetPresetCondition,
  offStatePreset,
  onStatePreset,
  onSetOffStatePreset,
  onSetOnStatePreset,
}) => {
  
  const update = (key: keyof ButtonConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Drill-down navigation
  const { nav, goBack, selectCategory, selectSection } = useNavigation();
  const showSection = (sectionId: SectionId) => nav.level === 'content' && nav.sectionId === sectionId;

  return (
    <div className="h-full overflow-y-auto bg-gray-900 border-r border-gray-800 flex flex-col custom-scrollbar">
      <NavHeader nav={nav} goBack={goBack} activePreset={activePreset} />

      {/* Category List */}
      {nav.level === 'categories' && <CategoryList onSelect={selectCategory} />}

      {/* Section List */}
      {nav.level === 'sections' && <SectionList categoryId={nav.categoryId} onSelect={selectSection} />}

      {/* Content Sections */}
      {nav.level === 'content' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          
          {/* ===== PRESETS > GALLERY ===== */}
          {showSection('presetGallery') && (
            <>
              {/* Current Preset Info */}
              {activePreset && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-400">Active Preset</p>
                      <p className="text-sm font-medium text-purple-400">{activePreset.name}</p>
                    </div>
                    {modifiedFromPreset && modifiedFromPreset.size > 0 && onResetToPreset && (
                      <button
                        onClick={onResetToPreset}
                        className="text-xs text-gray-400 hover:text-purple-400 underline"
                      >
                        Reset to preset
                      </button>
                    )}
                  </div>
                  {modifiedFromPreset && modifiedFromPreset.size > 0 && (
                    <p className="text-[10px] text-yellow-400">
                      {modifiedFromPreset.size} field(s) modified from preset
                    </p>
                  )}
                </div>
              )}
              
              {/* Preset Gallery */}
              {['minimal', 'glass', 'neon', 'gradient', 'animated', '3d', 'cyberpunk', 'retro', 'nature', 'icon-styles', 'custom'].map(category => (
                <div key={category} className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 sticky top-0 bg-gray-900 py-1">
                    {category === '3d' ? '3D Effects' : category === 'icon-styles' ? 'Icon Styles' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {PRESETS.filter(p => p.category === category).map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => onApplyPreset?.(preset)}
                        className={`w-full px-3 py-2 text-left rounded transition-colors ${
                          activePreset?.name === preset.name
                            ? 'bg-purple-500/20 border border-purple-500/50'
                            : 'hover:bg-gray-800 border border-transparent'
                        }`}
                      >
                        <div className="text-sm text-white font-medium">{preset.name}</div>
                        <div className="text-[10px] text-gray-500">{preset.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ===== PRESETS > CONDITIONS ===== */}
          {showSection('presetConditions') && (
            <>
              {!activePreset ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No preset selected</p>
                  <p className="text-gray-500 text-xs mt-1">Select a preset from the gallery first</p>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-4">
                    <p className="text-xs text-gray-400">Current Preset</p>
                    <p className="text-sm font-medium text-purple-400">{activePreset.name}</p>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-4">
                    Choose when "{activePreset.name}" applies and optionally set a different preset for the other state.
                  </p>
                  
                  {/* Condition Selection */}
                  <div className="space-y-2 mb-4">
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Apply Preset When</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['always', 'on', 'off'] as PresetCondition[]).map(cond => (
                        <button
                          key={cond}
                          onClick={() => {
                            onSetPresetCondition?.(cond);
                            if (cond === 'always') {
                              onSetOffStatePreset?.(null);
                              onSetOnStatePreset?.(null);
                            }
                          }}
                          className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                            presetCondition === cond
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {cond === 'always' ? 'Always' : cond === 'on' ? 'When ON' : 'When OFF'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Secondary Preset Selection - When ON */}
                  {presetCondition === 'on' && (
                    <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <label className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                        <ToggleLeft size={12} />
                        When OFF, use:
                      </label>
                      {offStatePreset ? (
                        <div className="flex items-center justify-between bg-gray-700/50 rounded px-3 py-2">
                          <span className="text-sm text-cyan-400">{offStatePreset.name}</span>
                          <button 
                            onClick={() => onSetOffStatePreset?.(null)}
                            className="text-gray-500 hover:text-red-400 text-xs"
                          >
                            Clear
                          </button>
                        </div>
                      ) : (
                        <select
                          onChange={(e) => {
                            const preset = PRESETS.find(p => p.name === e.target.value);
                            if (preset) onSetOffStatePreset?.(preset);
                          }}
                          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                          defaultValue=""
                        >
                          <option value="" disabled>Select preset for OFF state...</option>
                          {PRESETS.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      )}
                      <p className="text-[9px] text-gray-500">Or leave empty to use default styling when OFF</p>
                    </div>
                  )}
                  
                  {/* Secondary Preset Selection - When OFF */}
                  {presetCondition === 'off' && (
                    <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <label className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                        <ToggleRight size={12} />
                        When ON, use:
                      </label>
                      {onStatePreset ? (
                        <div className="flex items-center justify-between bg-gray-700/50 rounded px-3 py-2">
                          <span className="text-sm text-green-400">{onStatePreset.name}</span>
                          <button 
                            onClick={() => onSetOnStatePreset?.(null)}
                            className="text-gray-500 hover:text-red-400 text-xs"
                          >
                            Clear
                          </button>
                        </div>
                      ) : (
                        <select
                          onChange={(e) => {
                            const preset = PRESETS.find(p => p.name === e.target.value);
                            if (preset) onSetOnStatePreset?.(preset);
                          }}
                          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                          defaultValue=""
                        >
                          <option value="" disabled>Select preset for ON state...</option>
                          {PRESETS.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      )}
                      <p className="text-[9px] text-gray-500">Or leave empty to use default styling when ON</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ===== ENTITY > CORE ===== */}
          {showSection('core') && (
            <>
              <EntitySelector 
                label="Entity ID" 
                value={config.entity} 
                onChange={(v) => update('entity', v)} 
                onEntitySelect={(entity) => {
                  if (entity.name && (!config.name || config.name === 'Living Room')) {
                    update('name', entity.name);
                  }
                  if (!config.icon || config.icon === 'mdi:sofa') {
                    const suggestedIcon = getIconForEntity(entity.id, entity.domain);
                    update('icon', suggestedIcon);
                  }
                }}
              />
              <ControlInput label="Name" value={config.name} onChange={(v) => update('name', v)} />
              <IconPicker label="Icon" value={config.icon} onChange={(v) => update('icon', v)} />
              <ControlInput label="State Display (Custom)" value={config.stateDisplay} onChange={(v) => update('stateDisplay', v)} placeholder="Custom state text" />
          <ControlInput label="Entity Picture URL" value={config.entityPicture} onChange={(v) => update('entityPicture', v)} placeholder="https://..." />
          <ControlInput label="Units Override" value={config.units} onChange={(v) => update('units', v)} placeholder="°C, kW, etc." />
          
          <div className="pt-3 border-t border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase">Label Configuration</p>
              {!config.showLabel && (config.label || config.labelEntity) && (
                <button
                  onClick={() => update('showLabel', true)}
                  className="text-[10px] px-2 py-1 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded hover:bg-yellow-600/30 transition-colors"
                >
                  Enable Label ⚠️
                </button>
              )}
            </div>
            <div className="space-y-3">
              <ControlInput label="Static Label" value={config.label} onChange={(v) => update('label', v)} placeholder="My Label Text" />
              <p className="text-[10px] text-gray-500 -mt-1">Or display another entity's value as label:</p>
              <EntitySelector 
                label="Label Entity" 
                value={config.labelEntity} 
                onChange={(v) => {
                  update('labelEntity', v);
                  // Auto-enable Show Label when an entity is selected
                  if (v && !config.showLabel) {
                    update('showLabel', true);
                  }
                }}
                allowAll={true}
              />
              <ControlInput label="Attribute (optional)" value={config.labelAttribute} onChange={(v) => update('labelAttribute', v)} placeholder="temperature, brightness, etc." />
              <p className="text-[10px] text-gray-500 -mt-1">Leave attribute empty to show entity state. Examples: temperature, brightness, battery</p>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-800">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Templates (Advanced)</p>
            <div className="space-y-3">
              <ControlInput label="Name Template" value={config.nameTemplate} onChange={(v) => update('nameTemplate', v)} placeholder="[[[ return entity.state ]]]" />
              <ControlInput label="Label Template" value={config.labelTemplate} onChange={(v) => update('labelTemplate', v)} placeholder="[[[ return entity.attributes.temperature + '°C' ]]]" />
              <ControlInput label="Icon Template" value={config.iconTemplate} onChange={(v) => update('iconTemplate', v)} placeholder="[[[ return entity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off' ]]]" />
              <ControlInput label="State Display Template" value={config.stateDisplayTemplate} onChange={(v) => update('stateDisplayTemplate', v)} placeholder="[[[ return entity.state.toUpperCase() ]]]" />
            </div>
          </div>
            </>
          )}

          {/* ===== ENTITY > VARIABLES ===== */}
          {showSection('variables') && (
            <>
            <p className="text-xs text-gray-400">Define variables for use in templates</p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-400 uppercase">Variable List</p>
              <button
                onClick={() => update('variables', [...config.variables, { name: 'var' + (config.variables.length + 1), value: '' }])}
                className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
              >
                <Plus size={12} /> Add Variable
              </button>
            </div>
            
            {config.variables.length === 0 ? (
              <div className="text-xs text-gray-500 italic text-center py-2">No variables defined</div>
            ) : (
              <div className="space-y-3">
                {config.variables.map((variable, idx) => (
                  <div key={idx} className="p-3 bg-gray-800 rounded border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-400">Variable {idx + 1}</span>
                      <button
                        onClick={() => update('variables', config.variables.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <ControlInput label="Name" value={variable.name} onChange={(v) => {
                        const updated = [...config.variables];
                        updated[idx] = { ...variable, name: v };
                        update('variables', updated);
                      }} />
                      <ControlInput label="Value" value={variable.value} onChange={(v) => {
                        const updated = [...config.variables];
                        updated[idx] = { ...variable, value: v };
                        update('variables', updated);
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            </>
          )}

          {/* ===== LAYOUT > DIMENSIONS ===== */}
          {showSection('dimensions') && (
            <>
          <div className="grid grid-cols-2 gap-4">
            <PresetControl 
              field="layout"
              label="Layout" 
              type="select" 
              value={config.layout} 
              options={LAYOUT_OPTIONS} 
              onChange={(v) => update('layout', v)} 
            />
            <ControlInput label="Aspect Ratio (e.g 1/1)" value={config.aspectRatio} onChange={(v) => update('aspectRatio', v)} placeholder="1/1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ControlInput label="Card Height" value={config.height} onChange={(v) => update('height', v)} suffix="px" />
            <ControlInput label="Icon Size" value={config.size} onChange={(v) => update('size', v)} suffix="%" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <ControlInput label="Border Radius" value={config.borderRadius} onChange={(v) => update('borderRadius', v)} suffix="px" />
             <ControlInput label="Padding" value={config.padding} onChange={(v) => update('padding', v)} suffix="px" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <ControlInput label="Card Size (1-6)" value={config.cardSize.toString()} onChange={(v) => update('cardSize', Number(v) || 3)} placeholder="3" />
             <ControlInput type="checkbox" label="Section Mode" value={config.sectionMode} onChange={(v) => update('sectionMode', v)} />
          </div>
          {config.sectionMode && (
            <div className="grid grid-cols-2 gap-4">
               <ControlInput label="Grid Rows" value={config.gridRows.toString()} onChange={(v) => update('gridRows', Number(v) || 2)} />
               <ControlInput label="Grid Columns" value={config.gridColumns.toString()} onChange={(v) => update('gridColumns', Number(v) || 6)} />
            </div>
          )}
            </>
          )}

          {/* ===== LAYOUT > VISIBILITY ===== */}
          {showSection('visibility') && (
            <>
          <div className="grid grid-cols-2 gap-3">
            <ControlInput type="checkbox" label="Show Name" value={config.showName} onChange={(v) => update('showName', v)} />
            <ControlInput type="checkbox" label="Show Icon" value={config.showIcon} onChange={(v) => update('showIcon', v)} />
            <ControlInput type="checkbox" label="Show State" value={config.showState} onChange={(v) => update('showState', v)} />
            <ControlInput type="checkbox" label="Show Label" value={config.showLabel} onChange={(v) => update('showLabel', v)} />
            <ControlInput type="checkbox" label="Show Last Chg." value={config.showLastChanged} onChange={(v) => update('showLastChanged', v)} />
            <ControlInput type="checkbox" label="Entity Picture" value={config.showEntityPicture} onChange={(v) => update('showEntityPicture', v)} />
            <ControlInput type="checkbox" label="Show Units" value={config.showUnits} onChange={(v) => update('showUnits', v)} />
            <ControlInput type="checkbox" label="Show Ripple" value={config.showRipple} onChange={(v) => update('showRipple', v)} />
            <ControlInput type="checkbox" label="Live Stream" value={config.showLiveStream} onChange={(v) => update('showLiveStream', v)} />
            <ControlInput type="checkbox" label="Hidden" value={config.hidden} onChange={(v) => update('hidden', v)} />
          </div>
          {config.showLiveStream && (
            <ControlInput label="Stream Aspect Ratio" value={config.liveStreamAspectRatio} onChange={(v) => update('liveStreamAspectRatio', v)} placeholder="16x9, 50%, 1.78" className="mt-2" />
          )}
          {config.hidden && (
            <ControlInput label="Hidden Template" value={config.hiddenTemplate} onChange={(v) => update('hiddenTemplate', v)} placeholder="[[[ return entity.state === 'off' ]]]" />
          )}
            </>
          )}

          {/* ===== APPEARANCE > COLORS ===== */}
          {showSection('colors') && (
            <>
           <div className="space-y-6">
             {/* Global Settings */}
             <div className="space-y-4">
                <ControlInput type="select" label="Color Type" value={config.colorType} options={COLOR_TYPE_OPTIONS} onChange={(v) => update('colorType', v)} />
                
                <div className="grid grid-cols-2 gap-4">
                   <ControlInput type="checkbox" label="Auto Color (Light)" value={config.colorAuto} onChange={(v) => update('colorAuto', v)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                        <ControlInput label="Card Background" type="color" value={config.backgroundColor} onChange={(v) => update('backgroundColor', v)} />
                          <ControlInput label="Opacity" type="slider" value={config.backgroundColorOpacity} min={0} max={100} onChange={(v) => update('backgroundColorOpacity', v)} />
                   </div>
                   <ControlInput label="Default Text Color" type="color" value={config.color} onChange={(v) => update('color', v)} />
                </div>
             </div>
             
             <div className="h-px bg-gray-700/50" />

             {/* Gradient Background */}
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-400 uppercase">Gradient Background</p>
                  <ControlInput type="checkbox" label="" value={config.gradientEnabled} onChange={(v) => update('gradientEnabled', v)} />
                </div>
                
                {config.gradientEnabled && (
                  <div className="space-y-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    {/* Gradient Preview */}
                    <div 
                      className="h-12 rounded-lg border border-gray-600"
                      style={{
                        background: config.gradientType === 'linear' 
                          ? `linear-gradient(${config.gradientAngle}deg, ${config.gradientColor1}, ${config.gradientColor2}${config.gradientColor3Enabled ? `, ${config.gradientColor3}` : ''})`
                          : config.gradientType === 'radial'
                          ? `radial-gradient(circle, ${config.gradientColor1}, ${config.gradientColor2}${config.gradientColor3Enabled ? `, ${config.gradientColor3}` : ''})`
                          : `conic-gradient(from ${config.gradientAngle}deg, ${config.gradientColor1}, ${config.gradientColor2}${config.gradientColor3Enabled ? `, ${config.gradientColor3}` : ''}, ${config.gradientColor1})`
                      }}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <ControlInput 
                        type="select" 
                        label="Type" 
                        value={config.gradientType} 
                        options={[
                          { value: 'linear', label: 'Linear' },
                          { value: 'radial', label: 'Radial' },
                          { value: 'conic', label: 'Conic' },
                        ]} 
                        onChange={(v) => update('gradientType', v)} 
                      />
                      {(config.gradientType === 'linear' || config.gradientType === 'conic') && (
                        <ControlInput 
                          type="slider" 
                          label="Angle" 
                          value={config.gradientAngle} 
                          min={0} 
                          max={360} 
                          onChange={(v) => update('gradientAngle', v)} 
                        />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <ControlInput label="Color 1" type="color" value={config.gradientColor1} onChange={(v) => update('gradientColor1', v)} />
                      <ControlInput label="Color 2" type="color" value={config.gradientColor2} onChange={(v) => update('gradientColor2', v)} />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <ControlInput type="checkbox" label="3rd Color" value={config.gradientColor3Enabled} onChange={(v) => update('gradientColor3Enabled', v)} />
                      {config.gradientColor3Enabled && (
                        <div className="flex-1">
                          <ControlInput label="" type="color" value={config.gradientColor3} onChange={(v) => update('gradientColor3', v)} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
             </div>
             
             <div className="h-px bg-gray-700/50" />

             {/* Element Colors */}
             <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase">Element Colors</p>
                
                <ColorPairInput 
                  label="Icon Color"
                  colorValue={config.iconColor}
                  setColor={(v: string) => update('iconColor', v)}
                  autoValue={config.iconColorAuto}
                  setAuto={(v: boolean) => update('iconColorAuto', v)}
                />

                <ColorPairInput 
                  label="Name Color"
                  colorValue={config.nameColor}
                  setColor={(v: string) => update('nameColor', v)}
                  autoValue={config.nameColorAuto}
                  setAuto={(v: boolean) => update('nameColorAuto', v)}
                />

                <ColorPairInput 
                  label="State Color"
                  colorValue={config.stateColor}
                  setColor={(v: string) => update('stateColor', v)}
                  autoValue={config.stateColorAuto}
                  setAuto={(v: boolean) => update('stateColorAuto', v)}
                />

                <ColorPairInput 
                  label="Label Color"
                  colorValue={config.labelColor}
                  setColor={(v: string) => update('labelColor', v)}
                  autoValue={config.labelColorAuto}
                  setAuto={(v: boolean) => update('labelColorAuto', v)}
                />
             </div>
           </div>
            </>
          )}
        
          {/* ===== APPEARANCE > GLASS ===== */}
          {showSection('glass') && (
            <>
           {isShadowLockedByExtraStyles && (
             <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg mb-4">
               <p className="text-xs text-amber-400 flex items-center gap-2">
                 <span>🔒</span>
                 <span>Shadow controls are locked because the preset uses Custom CSS box-shadow.</span>
               </p>
             </div>
           )}
           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <ControlInput label="Backdrop Blur" type="select" value={config.backdropBlur} options={BLUR_OPTIONS} onChange={(v) => update('backdropBlur', v)} />
                 <ControlInput label="Shadow Size" type="select" value={config.shadowSize} options={SHADOW_SIZE_OPTIONS} onChange={(v) => update('shadowSize', v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Shadow Color" type="color" value={config.shadowColor} onChange={(v) => update('shadowColor', v)} />
                  <ControlInput label="Shadow Opacity" type="slider" value={config.shadowOpacity} min={0} max={100} onChange={(v) => update('shadowOpacity', v)} />
              </div>
           </div>
            </>
          )}

          {/* ===== APPEARANCE > BORDERS ===== */}
          {showSection('borders') && (
            <>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <ControlInput label="Border Width" value={config.borderWidth} onChange={(v) => update('borderWidth', v)} suffix="px" />
               <ControlInput label="Border Style" type="select" value={config.borderStyle} options={BORDER_STYLE_OPTIONS} onChange={(v) => update('borderStyle', v)} />
            </div>

            <ColorPairInput 
               label="Border Color"
               colorValue={config.borderColor}
               setColor={(v: string) => update('borderColor', v)}
               autoValue={config.borderColorAuto}
               setAuto={(v: boolean) => update('borderColorAuto', v)}
            />
          </div>
            </>
          )}

          {/* ===== APPEARANCE > ANIMATIONS ===== */}
          {showSection('animations') && (
            <>
          {isCardAnimationLockedByExtraStyles && (
            <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg mb-4">
              <p className="text-xs text-amber-400 flex items-center gap-2">
                <span>🔒</span>
                <span>Card animation is controlled by Custom CSS. Icon animation still works!</span>
              </p>
            </div>
          )}
          <div className="space-y-6">
             {/* Card Animation */}
             <div className="space-y-3">
                <p className="text-xs font-bold text-blue-400 uppercase">Card Animation</p>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Type" type="select" value={config.cardAnimation} options={ANIMATION_OPTIONS} onChange={(v) => update('cardAnimation', v)} disabled={isCardAnimationLockedByExtraStyles} disabledReason="Controlled by Custom CSS" />
                  <ControlInput label="Condition" type="select" value={config.cardAnimationTrigger} options={TRIGGER_OPTIONS} onChange={(v) => update('cardAnimationTrigger', v)} disabled={isCardAnimationLockedByExtraStyles} disabledReason="Controlled by Custom CSS" />
                </div>
                <ControlInput label="Speed/Duration" value={config.cardAnimationSpeed} onChange={(v) => update('cardAnimationSpeed', v)} suffix="s" disabled={isCardAnimationLockedByExtraStyles} disabledReason="Controlled by Custom CSS" />
             </div>

             <div className="h-px bg-gray-700/50" />

             {/* Icon Animation - NOT locked by extraStyles since it only affects card */}
             <div className="space-y-3">
                <p className="text-xs font-bold text-blue-400 uppercase">Icon Animation</p>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Type" type="select" value={config.iconAnimation} options={ANIMATION_OPTIONS} onChange={(v) => update('iconAnimation', v)} />
                  <ControlInput label="Condition" type="select" value={config.iconAnimationTrigger} options={TRIGGER_OPTIONS} onChange={(v) => update('iconAnimationTrigger', v)} />
                </div>
                <ControlInput label="Speed/Duration" value={config.iconAnimationSpeed} onChange={(v) => update('iconAnimationSpeed', v)} suffix="s" />
                <ControlInput type="checkbox" label="Rotate Icon" value={config.rotate} onChange={(v) => update('rotate', v)} />
             </div>
          </div>
            </>
          )}

          {/* ===== APPEARANCE > TYPOGRAPHY ===== */}
          {showSection('typography') && (
            <>
           <ControlInput label="Font Family" type="select" value={config.fontFamily} options={FONT_FAMILY_OPTIONS} onChange={(v) => update('fontFamily', v)} />
           
           {/* Custom Font */}
           <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
             <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Custom Font (Optional)</p>
             <div className="space-y-2">
               <ControlInput 
                 label="Font Name" 
                 value={config.customFontName} 
                 onChange={(v) => update('customFontName', v)} 
                 placeholder="My Custom Font" 
               />
               <ControlInput 
                 label="Google Fonts URL or @import" 
                 value={config.customFontUrl} 
                 onChange={(v) => update('customFontUrl', v)} 
                 placeholder="https://fonts.googleapis.com/css2?family=..." 
               />
               <p className="text-[9px] text-gray-500">
                 Get fonts from <a href="https://fonts.google.com" target="_blank" rel="noopener" className="text-blue-400 hover:underline">fonts.google.com</a> → 
                 Select font → Copy the embed URL. The font name must match exactly.
               </p>
               {config.customFontName && config.customFontUrl && (
                 <div className="mt-2 p-2 bg-green-900/20 border border-green-800/50 rounded text-[10px] text-green-400">
                   ✓ Using custom font: {config.customFontName}
                 </div>
               )}
             </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 mt-3">
              <ControlInput label="Font Size" value={config.fontSize} onChange={(v) => update('fontSize', v)} suffix="px" />
              <ControlInput label="Transform" type="select" value={config.textTransform} options={TRANSFORM_OPTIONS} onChange={(v) => update('textTransform', v)} />
           </div>
           <div className="grid grid-cols-2 gap-4 mt-3">
             <ControlInput label="Font Weight" type="select" value={config.fontWeight} options={WEIGHT_OPTIONS} onChange={(v) => update('fontWeight', v)} />
             <ControlInput label="Letter Spacing" type="select" value={config.letterSpacing} options={LETTER_SPACING_OPTIONS} onChange={(v) => update('letterSpacing', v)} />
           </div>
           <div className="grid grid-cols-2 gap-4 mt-3">
             <ControlInput label="Line Height" type="select" value={config.lineHeight} options={LINE_HEIGHT_OPTIONS} onChange={(v) => update('lineHeight', v)} />
             <ControlInput label="Numeric Precision" value={config.numericPrecision.toString()} onChange={(v) => update('numericPrecision', Number(v))} placeholder="-1 = auto" />
           </div>
            </>
          )}

          {/* ===== EFFECTS > STATE STYLES ===== */}
          {showSection('stateStyles') && (
            <>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <ControlInput label="ON: Color" type="color" value={config.stateOnColor} onChange={(v) => update('stateOnColor', v)} />
                 <ControlInput label="Opacity" type="slider" value={config.stateOnOpacity} min={0} max={100} onChange={(v) => update('stateOnOpacity', v)} />
              </div>
              <div className="space-y-2">
                 <ControlInput label="OFF: Color" type="color" value={config.stateOffColor} onChange={(v) => update('stateOffColor', v)} />
                 <ControlInput label="Opacity" type="slider" value={config.stateOffOpacity} min={0} max={100} onChange={(v) => update('stateOffOpacity', v)} />
              </div>
            </div>
            
            <div className="h-px bg-gray-700/50" />
            
            {/* State Styles / Conditionals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Conditionals (State-Based Styling)</p>
                <button
                  onClick={() => update('stateStyles', [...config.stateStyles, { 
                    id: 'state_' + (config.stateStyles.length + 1), 
                    operator: 'equals', 
                    value: 'on',
                    name: '',
                    icon: '',
                    color: '',
                    entityPicture: '',
                    label: '',
                    stateDisplay: '',
                    spin: false,
                    styles: '',
                    backgroundColor: '',
                    iconColor: '',
                    nameColor: '',
                    labelColor: '',
                    borderColor: '',
                    cardAnimation: 'none',
                    cardAnimationSpeed: '2s',
                    iconAnimation: 'none',
                    iconAnimationSpeed: '2s',
                  } as StateStyleConfig])}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                >
                  <Plus size={12} /> Add Conditional
                </button>
              </div>
              
              <p className="text-[10px] text-gray-500 mb-3">Define conditions to change colors, animations, or properties based on entity state.</p>
              
              {config.stateStyles.length === 0 ? (
                <div className="text-xs text-gray-500 italic text-center py-2">No conditionals defined</div>
              ) : (
                <div className="space-y-3">
                  {config.stateStyles.map((style, idx) => (
                    <div key={idx} className="p-3 bg-gray-800 rounded border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400">Condition {idx + 1}</span>
                        <button
                          onClick={() => update('stateStyles', config.stateStyles.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {/* Condition */}
                        <div className="grid grid-cols-2 gap-2">
                          <ControlInput label="Operator" type="select" value={style.operator} options={STATE_OPERATOR_OPTIONS} onChange={(v) => {
                            const updated = [...config.stateStyles];
                            updated[idx] = { ...style, operator: v };
                            update('stateStyles', updated);
                          }} />
                          <ControlInput label="Value" value={style.value} onChange={(v) => {
                            const updated = [...config.stateStyles];
                            updated[idx] = { ...style, value: v };
                            update('stateStyles', updated);
                          }} placeholder="on, off, 50, etc." />
                        </div>
                        
                        {/* Basic Overrides */}
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Overrides</p>
                          <div className="grid grid-cols-2 gap-2">
                            <ControlInput label="Name" value={style.name} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, name: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Icon" value={style.icon} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, icon: v };
                              update('stateStyles', updated);
                            }} placeholder="mdi:..." />
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <ControlInput label="Label" value={style.label} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, label: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="State Display" value={style.stateDisplay} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, stateDisplay: v };
                              update('stateStyles', updated);
                            }} />
                          </div>
                        </div>
                        
                        {/* Conditional Colors */}
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Conditional Colors</p>
                          <div className="grid grid-cols-3 gap-2">
                            <ControlInput label="Entity Color" type="color" value={style.color} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, color: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Background" type="color" value={style.backgroundColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, backgroundColor: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Border" type="color" value={style.borderColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, borderColor: v };
                              update('stateStyles', updated);
                            }} />
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <ControlInput label="Icon Color" type="color" value={style.iconColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, iconColor: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Name Color" type="color" value={style.nameColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, nameColor: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Label Color" type="color" value={style.labelColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, labelColor: v };
                              update('stateStyles', updated);
                            }} />
                          </div>
                        </div>
                        
                        {/* Conditional Animations */}
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Conditional Animations</p>
                          <div className="grid grid-cols-2 gap-2">
                            <ControlInput label="Card Animation" type="select" value={style.cardAnimation || 'none'} options={ANIMATION_OPTIONS} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, cardAnimation: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Card Speed" value={style.cardAnimationSpeed || '2s'} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, cardAnimationSpeed: v };
                              update('stateStyles', updated);
                            }} suffix="s" />
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <ControlInput label="Icon Animation" type="select" value={style.iconAnimation || 'none'} options={ANIMATION_OPTIONS} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, iconAnimation: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Icon Speed" value={style.iconAnimationSpeed || '2s'} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, iconAnimationSpeed: v };
                              update('stateStyles', updated);
                            }} suffix="s" />
                          </div>
                          <div className="mt-2">
                            <ControlInput type="checkbox" label="Spin Icon (Legacy)" value={style.spin} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, spin: v };
                              update('stateStyles', updated);
                            }} />
                          </div>
                        </div>
                        
                        {/* Raw Styles */}
                        <div className="pt-2 border-t border-gray-700">
                          <ControlInput label="Additional Styles (YAML)" value={style.styles} onChange={(v) => {
                            const updated = [...config.stateStyles];
                            updated[idx] = { ...style, styles: v };
                            update('stateStyles', updated);
                          }} placeholder="card:\n  - opacity: 0.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
            </>
          )}

          {/* ===== ACTIONS > CARD ACTIONS ===== */}
          {showSection('cardActions') && (
            <>
          <div className="space-y-4">
            <div>
              <ControlInput label="Tap Action" type="select" value={config.tapAction} options={ACTION_OPTIONS} onChange={(v) => update('tapAction', v)} />
              {(config.tapAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.tapActionData} onChange={(v) => update('tapActionData', v)} placeholder='{"service": "light.turn_on"}' />
                </div>
              )}
              {(config.tapAction === 'navigate' || config.tapAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.tapActionNavigation} onChange={(v) => update('tapActionNavigation', v)} placeholder="/lovelace/0" />
                </div>
              )}
              {(config.tapAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.tapActionJavascript} onChange={(v) => update('tapActionJavascript', v)} placeholder="alert('Hello!')" />
                </div>
              )}
              {(config.tapAction === 'toast') && (
                <div className="mt-2 space-y-2">
                  <ControlInput label="Toast Message" value={config.tapActionToast.message} onChange={(v) => update('tapActionToast', { ...config.tapActionToast, message: v })} />
                  <ControlInput label="Duration (ms)" value={config.tapActionToast.duration.toString()} onChange={(v) => update('tapActionToast', { ...config.tapActionToast, duration: Number(v) || 3000 })} />
                </div>
              )}
            </div>
            
            <div>
              <ControlInput label="Hold Action" type="select" value={config.holdAction} options={ACTION_OPTIONS} onChange={(v) => update('holdAction', v)} />
              {(config.holdAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.holdActionData} onChange={(v) => update('holdActionData', v)} placeholder='{"service": "light.turn_on"}' />
                </div>
              )}
              {(config.holdAction === 'navigate' || config.holdAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.holdActionNavigation} onChange={(v) => update('holdActionNavigation', v)} placeholder="/lovelace/0" />
                </div>
              )}
              {(config.holdAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.holdActionJavascript} onChange={(v) => update('holdActionJavascript', v)} placeholder="alert('Held!')" />
                </div>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ControlInput label="Repeat (ms)" value={config.holdActionRepeat.toString()} onChange={(v) => update('holdActionRepeat', Number(v) || 0)} placeholder="0 = disabled" />
                <ControlInput label="Repeat Limit" value={config.holdActionRepeatLimit.toString()} onChange={(v) => update('holdActionRepeatLimit', Number(v) || 0)} placeholder="0 = unlimited" />
              </div>
            </div>
            
            <div>
              <ControlInput label="Double Tap Action" type="select" value={config.doubleTapAction} options={ACTION_OPTIONS} onChange={(v) => update('doubleTapAction', v)} />
              {(config.doubleTapAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.doubleTapActionData} onChange={(v) => update('doubleTapActionData', v)} placeholder='{"service": "light.turn_on"}' />
                </div>
              )}
              {(config.doubleTapAction === 'navigate' || config.doubleTapAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.doubleTapActionNavigation} onChange={(v) => update('doubleTapActionNavigation', v)} placeholder="/lovelace/0" />
                </div>
              )}
              {(config.doubleTapAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.doubleTapActionJavascript} onChange={(v) => update('doubleTapActionJavascript', v)} placeholder="alert('Double!')" />
                </div>
              )}
            </div>
            
            <div className="h-px bg-gray-700/50" />
            
            <p className="text-xs font-bold text-gray-400 uppercase">Action Sounds</p>
            <div className="grid grid-cols-3 gap-2">
              <ControlInput label="Tap Sound" value={config.tapActionSound} onChange={(v) => update('tapActionSound', v)} placeholder="/local/..." />
              <ControlInput label="Hold Sound" value={config.holdActionSound} onChange={(v) => update('holdActionSound', v)} placeholder="/local/..." />
              <ControlInput label="Dbl Tap Sound" value={config.doubleTapActionSound} onChange={(v) => update('doubleTapActionSound', v)} placeholder="/local/..." />
            </div>
          </div>
            </>
          )}
        
          {/* ===== ACTIONS > MOMENTARY ACTIONS ===== */}
          {showSection('momentaryActions') && (
            <>
          <p className="text-xs text-gray-400 mb-4">Press/release actions for momentary switches (e.g., garage doors)</p>
          <div className="space-y-4">
            <div>
              <ControlInput label="Press Action" type="select" value={config.pressAction} options={ACTION_OPTIONS} onChange={(v) => update('pressAction', v)} />
              {(config.pressAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.pressActionData} onChange={(v) => update('pressActionData', v)} placeholder='{"service": "switch.turn_on"}' />
                </div>
              )}
              {(config.pressAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.pressActionJavascript} onChange={(v) => update('pressActionJavascript', v)} />
                </div>
              )}
            </div>
            
            <div>
              <ControlInput label="Release Action" type="select" value={config.releaseAction} options={ACTION_OPTIONS} onChange={(v) => update('releaseAction', v)} />
              {(config.releaseAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.releaseActionData} onChange={(v) => update('releaseActionData', v)} placeholder='{"service": "switch.turn_off"}' />
                </div>
              )}
              {(config.releaseAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.releaseActionJavascript} onChange={(v) => update('releaseActionJavascript', v)} />
                </div>
              )}
            </div>
          </div>
            </>
          )}
        
          {/* ===== ACTIONS > ICON ACTIONS ===== */}
          {showSection('iconActions') && (
            <>
          <p className="text-xs text-gray-400 mb-4">Separate actions when clicking on the icon specifically</p>
          <div className="space-y-4">
            <div>
              <ControlInput label="Icon Tap Action" type="select" value={config.iconTapAction} options={ACTION_OPTIONS} onChange={(v) => update('iconTapAction', v)} />
              {(config.iconTapAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.iconTapActionData} onChange={(v) => update('iconTapActionData', v)} />
                </div>
              )}
              {(config.iconTapAction === 'navigate' || config.iconTapAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.iconTapActionNavigation} onChange={(v) => update('iconTapActionNavigation', v)} />
                </div>
              )}
              {(config.iconTapAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.iconTapActionJavascript} onChange={(v) => update('iconTapActionJavascript', v)} />
                </div>
              )}
            </div>
            
            <div>
              <ControlInput label="Icon Hold Action" type="select" value={config.iconHoldAction} options={ACTION_OPTIONS} onChange={(v) => update('iconHoldAction', v)} />
              {(config.iconHoldAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.iconHoldActionData} onChange={(v) => update('iconHoldActionData', v)} />
                </div>
              )}
              {(config.iconHoldAction === 'navigate' || config.iconHoldAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.iconHoldActionNavigation} onChange={(v) => update('iconHoldActionNavigation', v)} />
                </div>
              )}
              {(config.iconHoldAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.iconHoldActionJavascript} onChange={(v) => update('iconHoldActionJavascript', v)} />
                </div>
              )}
            </div>
            
            <div>
              <ControlInput label="Icon Double Tap Action" type="select" value={config.iconDoubleTapAction} options={ACTION_OPTIONS} onChange={(v) => update('iconDoubleTapAction', v)} />
              {(config.iconDoubleTapAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.iconDoubleTapActionData} onChange={(v) => update('iconDoubleTapActionData', v)} />
                </div>
              )}
              {(config.iconDoubleTapAction === 'navigate' || config.iconDoubleTapAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.iconDoubleTapActionNavigation} onChange={(v) => update('iconDoubleTapActionNavigation', v)} />
                </div>
              )}
              {(config.iconDoubleTapAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.iconDoubleTapActionJavascript} onChange={(v) => update('iconDoubleTapActionJavascript', v)} />
                </div>
              )}
            </div>
            
            <div className="h-px bg-gray-700/50" />
            
            <p className="text-xs font-bold text-gray-400 uppercase">Icon Momentary Actions</p>
            <div className="space-y-4">
              <div>
                <ControlInput label="Icon Press Action" type="select" value={config.iconPressAction} options={ACTION_OPTIONS} onChange={(v) => update('iconPressAction', v)} />
                {(config.iconPressAction === 'call-service') && (
                  <div className="mt-2">
                    <ControlInput label="Service Data (JSON)" value={config.iconPressActionData} onChange={(v) => update('iconPressActionData', v)} />
                  </div>
                )}
              </div>
              
              <div>
                <ControlInput label="Icon Release Action" type="select" value={config.iconReleaseAction} options={ACTION_OPTIONS} onChange={(v) => update('iconReleaseAction', v)} />
                {(config.iconReleaseAction === 'call-service') && (
                  <div className="mt-2">
                    <ControlInput label="Service Data (JSON)" value={config.iconReleaseActionData} onChange={(v) => update('iconReleaseActionData', v)} />
                  </div>
                )}
              </div>
            </div>
          </div>
            </>
          )}
        
          {/* ===== ADVANCED > CONFIRMATION ===== */}
          {showSection('confirmation') && (
            <>
          <div className="space-y-4">
            <ControlInput type="checkbox" label="Require Confirmation" value={config.confirmation.enabled} onChange={(v) => update('confirmation', { ...config.confirmation, enabled: v })} />
            {config.confirmation.enabled && (
              <ControlInput label="Confirmation Text" value={config.confirmation.text} onChange={(v) => update('confirmation', { ...config.confirmation, text: v })} placeholder="Are you sure?" />
            )}
          </div>
            </>
          )}
        
          {/* ===== ADVANCED > LOCK ===== */}
          {showSection('lock') && (
            <>
          <div className="space-y-4">
            <ControlInput type="checkbox" label="Enable Lock" value={config.lock.enabled} onChange={(v) => update('lock', { ...config.lock, enabled: v })} />
            {config.lock.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Duration (sec)" value={config.lock.duration.toString()} onChange={(v) => update('lock', { ...config.lock, duration: Number(v) || 5 })} />
                  <ControlInput label="Unlock Gesture" type="select" value={config.lock.unlock} options={LOCK_UNLOCK_OPTIONS} onChange={(v) => update('lock', { ...config.lock, unlock: v })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Lock Icon" value={config.lock.lockIcon} onChange={(v) => update('lock', { ...config.lock, lockIcon: v })} placeholder="mdi:lock-outline" />
                  <ControlInput label="Unlock Icon" value={config.lock.unlockIcon} onChange={(v) => update('lock', { ...config.lock, unlockIcon: v })} placeholder="mdi:lock-open-outline" />
                </div>
                <ControlInput type="checkbox" label="Keep Unlock Icon" value={config.lock.keepUnlockIcon} onChange={(v) => update('lock', { ...config.lock, keepUnlockIcon: v })} />
              </>
            )}
          </div>
            </>
          )}
        
          {/* ===== ADVANCED > PROTECT ===== */}
          {showSection('protect') && (
            <>
          <div className="space-y-4">
            <ControlInput type="checkbox" label="Enable Protection" value={config.protect.enabled} onChange={(v) => update('protect', { ...config.protect, enabled: v })} />
            {config.protect.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Type" type="select" value={config.protect.type} options={PROTECT_TYPE_OPTIONS} onChange={(v) => update('protect', { ...config.protect, type: v })} />
                  <ControlInput label="Code/Password" type="password" value={config.protect.value} onChange={(v) => update('protect', { ...config.protect, value: v })} />
                </div>
                <ControlInput label="Failure Message" value={config.protect.failureMessage} onChange={(v) => update('protect', { ...config.protect, failureMessage: v })} />
                <ControlInput label="Success Message" value={config.protect.successMessage} onChange={(v) => update('protect', { ...config.protect, successMessage: v })} />
              </>
            )}
          </div>
            </>
          )}
        
          {/* ===== ADVANCED > TOOLTIP ===== */}
          {showSection('tooltip') && (
            <>
          <div className="space-y-4">
            <ControlInput type="checkbox" label="Enable Tooltip" value={config.tooltip.enabled} onChange={(v) => update('tooltip', { ...config.tooltip, enabled: v })} />
            {config.tooltip.enabled && (
              <ControlInput label="Content" value={config.tooltip.content} onChange={(v) => update('tooltip', { ...config.tooltip, content: v })} placeholder="Hover text or template..." />
            )}
          </div>
            </>
          )}
        
          {/* ===== ADVANCED > CUSTOM FIELDS ===== */}
          {showSection('customFields') && (
            <>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Custom Fields</p>
                <button
                  onClick={() => update('customFields', [...config.customFields, { name: 'field' + (config.customFields.length + 1), type: 'text', value: '', styles: '' }])}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                >
                  <Plus size={12} /> Add Field
                </button>
              </div>
              
              {config.customFields.length === 0 ? (
                <div className="text-xs text-gray-500 italic text-center py-2">No custom fields</div>
              ) : (
                <div className="space-y-3">
                  {config.customFields.map((field, idx) => (
                    <div key={idx} className="p-3 bg-gray-800 rounded border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400">Field {idx + 1}</span>
                        <button
                          onClick={() => update('customFields', config.customFields.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <ControlInput label="Name" value={field.name} onChange={(v) => {
                          const updated = [...config.customFields];
                          updated[idx] = { ...field, name: v };
                          update('customFields', updated);
                        }} />
                        <ControlInput label="Value/Template" value={field.value} onChange={(v) => {
                          const updated = [...config.customFields];
                          updated[idx] = { ...field, value: v };
                          update('customFields', updated);
                        }} placeholder="[[[ return entity.state ]]]" />
                        <ControlInput label="Styles (YAML)" value={field.styles || ''} onChange={(v) => {
                          const updated = [...config.customFields];
                          updated[idx] = { ...field, styles: v };
                          update('customFields', updated);
                        }} placeholder="- font-size: 12px" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
            </>
          )}
        
          {/* ===== ADVANCED > ADVANCED SETTINGS ===== */}
          {showSection('advancedSettings') && (
            <>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ControlInput label="Card Opacity" type="slider" value={config.cardOpacity} min={0} max={100} onChange={(v) => update('cardOpacity', v)} />
              <ControlInput label="Update Timer (s)" value={config.updateTimer.toString()} onChange={(v) => update('updateTimer', Number(v) || 0)} placeholder="0 = disabled" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ControlInput label="Hold Time (ms)" value={config.holdTime.toString()} onChange={(v) => update('holdTime', Number(v) || 500)} placeholder="500" />
              <ControlInput label="Template" value={config.template} onChange={(v) => update('template', v)} placeholder="template_name" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ControlInput type="checkbox" label="Icon Spin (rotate)" value={config.spin} onChange={(v) => update('spin', v)} />
              <ControlInput type="checkbox" label="Spinner Loading" value={config.spinner} onChange={(v) => update('spinner', v)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ControlInput type="checkbox" label="Haptic Feedback" value={config.hapticFeedback} onChange={(v) => update('hapticFeedback', v)} />
              <ControlInput type="checkbox" label="Disable Keyboard" value={config.disableKeyboard} onChange={(v) => update('disableKeyboard', v)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ControlInput type="checkbox" label="Group Expand" value={config.groupExpand} onChange={(v) => update('groupExpand', v)} />
              <ControlInput type="checkbox" label="Hidden" value={config.hidden} onChange={(v) => update('hidden', v)} />
            </div>
            
            {config.spin && (
              <ControlInput label="Spin Duration" value={config.spinDuration} onChange={(v) => update('spinDuration', v)} suffix="s" />
            )}
            
            {config.hidden && (
              <ControlInput label="Hidden Template" value={config.hiddenTemplate} onChange={(v) => update('hiddenTemplate', v)} placeholder="[[[ return ... ]]]" />
            )}
            
            <div className="h-px bg-gray-700/50" />
            
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Trigger Options</p>
            <ControlInput label="Trigger Entity" value={config.triggerEntity} onChange={(v) => update('triggerEntity', v)} placeholder="sensor.time" />
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Triggers Update (one entity per line)</label>
              <textarea
                value={config.triggersUpdate.join('\n')}
                onChange={(e) => update('triggersUpdate', e.target.value.split('\n').filter(s => s.trim()))}
                placeholder="sensor.temperature&#10;sensor.humidity"
                className="w-full h-16 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            
            <div className="h-px bg-gray-700/50" />
            
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Extra Styles (Raw CSS)</p>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Card/General Styles</label>
              <textarea
                value={config.extraStyles}
                onChange={(e) => update('extraStyles', e.target.value)}
                placeholder="card:\n  - background: linear-gradient(...)\nicon:\n  - transform: rotate(45deg)"
                className="w-full h-24 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Entity Picture Styles</label>
              <textarea
                value={config.entityPictureStyles}
                onChange={(e) => update('entityPictureStyles', e.target.value)}
                placeholder="- border-radius: 50%"
                className="w-full h-16 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Grid Styles</label>
              <textarea
                value={config.gridStyles}
                onChange={(e) => update('gridStyles', e.target.value)}
                placeholder="- grid-template-areas: ..."
                className="w-full h-16 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Lock Styles</label>
              <textarea
                value={config.lockStyles}
                onChange={(e) => update('lockStyles', e.target.value)}
                placeholder="- color: red"
                className="w-full h-16 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Tooltip Styles</label>
              <textarea
                value={config.tooltipStyles}
                onChange={(e) => update('tooltipStyles', e.target.value)}
                placeholder="- background: rgba(0,0,0,0.9)"
                className="w-full h-16 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
            </>
          )}
          
          <div className="h-10"></div>
        </div>
      )}
    </div>
  );
};
