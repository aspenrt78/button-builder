
import React, { useState, useEffect, useMemo } from 'react';
import { ButtonConfig, CustomField, Variable, StateStyleConfig, DEFAULT_LOCK_CONFIG, DEFAULT_PROTECT_CONFIG, DEFAULT_TOOLTIP_CONFIG, DEFAULT_TOAST_CONFIG, StateAppearanceConfig, DEFAULT_STATE_APPEARANCE, ThresholdColorConfig, DEFAULT_THRESHOLD_CONFIG } from '../types';
import { ControlInput } from './ControlInput';
import { EntitySelector } from './EntitySelector';
import { IconPicker } from './IconPicker';
import { GridDesigner } from './GridDesigner';
import { LAYOUT_OPTIONS, ACTION_OPTIONS, TRANSFORM_OPTIONS, WEIGHT_OPTIONS, BORDER_STYLE_OPTIONS, ANIMATION_OPTIONS, BLUR_OPTIONS, SHADOW_SIZE_OPTIONS, TRIGGER_OPTIONS, LOCK_UNLOCK_OPTIONS, STATE_OPERATOR_OPTIONS, COLOR_TYPE_OPTIONS, PROTECT_TYPE_OPTIONS, FONT_FAMILY_OPTIONS, LETTER_SPACING_OPTIONS, LINE_HEIGHT_OPTIONS, LIVE_STREAM_FIT_OPTIONS, CONDITIONAL_OPERATORS, HAPTIC_TYPE_OPTIONS } from '../constants';
import { Plus, X, Variable as VariableIcon, ToggleLeft, ToggleRight, Pencil, Gauge, Search, AlertCircle } from 'lucide-react';
import { NavHeader, CategoryList, SectionList, useNavigation, SectionId } from './ConfigPanelNav';
import { haService } from '../services/homeAssistantService';
import { PRESETS, Preset, generateDarkModePreset } from '../presets';
import { validateCss, formatValidationResults } from '../utils/cssValidator';
import { getEntityCapabilities } from '../utils/entityCapabilities';

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
  presets?: Preset[];
  activePreset?: Preset | null;
  onPresetConfigChange?: (updates: Partial<ButtonConfig>) => void;
  onSaveCustomPreset?: (name: string, description: string) => { ok: boolean; error?: string };
  onDeleteCustomPreset?: (preset: Preset) => void;
  // Preset management props
  onApplyPreset?: (preset: Preset, forState?: 'on' | 'off') => void;
  onResetToPreset?: () => void;
  presetCondition?: PresetCondition;
  onSetPresetCondition?: (condition: PresetCondition) => void;
  offStatePreset?: Preset | null;
  onStatePreset?: Preset | null;
  onSetOffStatePreset?: (preset: Preset | null) => void;
  onSetOnStatePreset?: (preset: Preset | null) => void;
  useAutoDarkMode?: boolean;
  onSetUseAutoDarkMode?: (value: boolean) => void;
  // State editing props
  editingState?: 'on' | 'off';
  onEditingStateChange?: (state: 'on' | 'off') => void;
  // State-specific appearance props
  onStateAppearance?: Partial<StateAppearanceConfig>;
  offStateAppearance?: Partial<StateAppearanceConfig>;
  onSetOnStateAppearance?: React.Dispatch<React.SetStateAction<Partial<StateAppearanceConfig>>>;
  onSetOffStateAppearance?: React.Dispatch<React.SetStateAction<Partial<StateAppearanceConfig>>>;
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
              style={{ backgroundColor: colorValue || '#000000' }}
            >
              <input 
                type="color" 
                value={colorValue || '#000000'} 
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
  presets = PRESETS,
  activePreset, 
  onPresetConfigChange,
  onSaveCustomPreset,
  onDeleteCustomPreset,
  onApplyPreset,
  onResetToPreset,
  presetCondition = 'always',
  onSetPresetCondition,
  offStatePreset,
  onStatePreset,
  onSetOffStatePreset,
  onSetOnStatePreset,
  useAutoDarkMode = true,
  onSetUseAutoDarkMode,
  editingState = 'on',
  onEditingStateChange,
  onStateAppearance = {},
  offStateAppearance = {},
  onSetOnStateAppearance,
  onSetOffStateAppearance,
}) => {
  
  const update = (key: keyof ButtonConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updatePresetField = (key: keyof ButtonConfig, value: any) => {
    if (!onPresetConfigChange) return;
    onPresetConfigChange({ [key]: value } as Partial<ButtonConfig>);
  };

  const formatPresetFieldLabel = (key: string) =>
    key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, c => c.toUpperCase());

  const presetSelectOptionsByKey: Record<string, { value: string; label: string }[]> = {
    layout: LAYOUT_OPTIONS,
    borderStyle: BORDER_STYLE_OPTIONS,
    colorType: COLOR_TYPE_OPTIONS,
    cardAnimation: ANIMATION_OPTIONS,
    iconAnimation: ANIMATION_OPTIONS,
    cardAnimationTrigger: TRIGGER_OPTIONS,
    iconAnimationTrigger: TRIGGER_OPTIONS,
    backdropBlur: BLUR_OPTIONS,
    shadowSize: SHADOW_SIZE_OPTIONS,
    textTransform: TRANSFORM_OPTIONS,
    fontWeight: WEIGHT_OPTIONS,
    fontFamily: FONT_FAMILY_OPTIONS,
    letterSpacing: LETTER_SPACING_OPTIONS,
    lineHeight: LINE_HEIGHT_OPTIONS,
  };

  const presetEditableEntries = useMemo(() => {
    if (!activePreset) return [] as Array<[keyof ButtonConfig, any]>;
    return Object.entries(activePreset.config)
      .filter(([, value]) => value !== undefined)
      .sort(([a], [b]) => a.localeCompare(b)) as Array<[keyof ButtonConfig, any]>;
  }, [activePreset]);

  // Get the current state appearance based on editing state
  const currentAppearance = editingState === 'on' ? onStateAppearance : offStateAppearance;
  const setCurrentAppearance = editingState === 'on' ? onSetOnStateAppearance : onSetOffStateAppearance;
  
  // Update appearance for current editing state - uses functional update to handle rapid successive calls
  const updateAppearance = (key: keyof StateAppearanceConfig, value: any) => {
    if (setCurrentAppearance) {
      // Use functional update to avoid stale state when multiple updates happen in sequence
      setCurrentAppearance(prev => ({ ...prev, [key]: value }));
    }
  };
  
  // Get value from current appearance or fall back to config
  const getAppearanceValue = <K extends keyof StateAppearanceConfig>(key: K): StateAppearanceConfig[K] => {
    const appearanceValue = (currentAppearance as StateAppearanceConfig)[key];
    if (appearanceValue !== undefined && appearanceValue !== '') {
      return appearanceValue as StateAppearanceConfig[K];
    }
    // Fall back to base config value if applicable
    if (key in config) {
      return (config as any)[key];
    }
    return DEFAULT_STATE_APPEARANCE[key];
  };

  // Drill-down navigation
  const { nav, goBack, selectCategory, selectSection } = useNavigation();
  const showSection = (sectionId: SectionId) => nav.level === 'content' && nav.sectionId === sectionId;
  
  // Preset search state
  const [presetSearch, setPresetSearch] = useState('');
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');
  const [savePresetError, setSavePresetError] = useState('');
  const [savePresetSuccess, setSavePresetSuccess] = useState('');
  
  // CSS validation for extraStyles
  const cssValidation = useMemo(() => {
    if (!config.extraStyles) return null;
    const result = validateCss(config.extraStyles);
    return (result.errors.length > 0 || result.warnings.length > 0) ? result : null;
  }, [config.extraStyles]);
  
  // Grid designer modal state
  const [showGridDesigner, setShowGridDesigner] = useState(false);

  // Label entity attributes
  const [labelEntityAttributes, setLabelEntityAttributes] = useState<string[]>([]);
  const [selectedEntityState, setSelectedEntityState] = useState<string>('');
  
  // Custom field entity attributes (indexed by field index)
  const [customFieldAttributes, setCustomFieldAttributes] = useState<Record<number, string[]>>({});
  
  const entityCapabilities = useMemo(
    () => getEntityCapabilities(config.entity, selectedEntityState),
    [config.entity, selectedEntityState]
  );

  const baseActionOptions = useMemo(
    () => ACTION_OPTIONS.filter(option => !['perform-action', 'assist', 'fire-dom-event', 'multi-actions'].includes(option.value)),
    []
  );

  const entityActionOptions = useMemo(() => {
    if (!config.entity || entityCapabilities.supportsToggleAction) return baseActionOptions;
    return baseActionOptions.filter(option => option.value !== 'toggle');
  }, [baseActionOptions, config.entity, entityCapabilities.supportsToggleAction]);

  const isActivePreset = (preset: Preset): boolean => {
    if (!activePreset) return false;
    if (preset.id && activePreset.id) return preset.id === activePreset.id;
    return preset.name === activePreset.name && preset.category === activePreset.category;
  };

  const actionTypeSnapshot = useMemo(
    () => [
      config.tapAction,
      config.holdAction,
      config.doubleTapAction,
      config.pressAction,
      config.releaseAction,
      config.iconTapAction,
      config.iconHoldAction,
      config.iconDoubleTapAction,
      config.iconPressAction,
      config.iconReleaseAction,
    ].join('|'),
    [
      config.tapAction,
      config.holdAction,
      config.doubleTapAction,
      config.pressAction,
      config.releaseAction,
      config.iconTapAction,
      config.iconHoldAction,
      config.iconDoubleTapAction,
      config.iconPressAction,
      config.iconReleaseAction,
    ]
  );

  const presetCategoryOrder: Preset['category'][] = [
    'minimal',
    'glass',
    'neon',
    'gradient',
    'animated',
    '3d',
    'cyberpunk',
    'retro',
    'nature',
    'icon-styles',
    'custom',
  ];

  const handleSaveCurrentStylePreset = () => {
    if (!onSaveCustomPreset) return;
    setSavePresetError('');
    setSavePresetSuccess('');

    const result = onSaveCustomPreset(newPresetName, newPresetDescription);
    if (!result.ok) {
      setSavePresetError(result.error || 'Failed to save preset.');
      return;
    }

    setNewPresetName('');
    setNewPresetDescription('');
    setSavePresetSuccess('Preset saved in Custom styles.');
  };

  useEffect(() => {
    if (!savePresetSuccess) return;
    const timer = window.setTimeout(() => setSavePresetSuccess(''), 2500);
    return () => window.clearTimeout(timer);
  }, [savePresetSuccess]);

  // Fetch label entity attributes when labelEntity changes
  useEffect(() => {
    if (config.labelEntity) {
      haService.getEntityAttributes(config.labelEntity).then(attrs => {
        setLabelEntityAttributes(attrs);
      });
    } else {
      setLabelEntityAttributes([]);
    }
  }, [config.labelEntity]);

  // Fetch current entity state so UI can present valid per-entity options.
  useEffect(() => {
    if (!config.entity) {
      setSelectedEntityState('');
      return;
    }
    haService.getEntityData(config.entity).then(entity => {
      setSelectedEntityState(entity?.state || '');
    });
  }, [config.entity]);

  // Keep live stream controls aligned with entity capabilities.
  useEffect(() => {
    if (!entityCapabilities.supportsLiveStream && config.showLiveStream) {
      setConfig(prev => ({
        ...prev,
        showLiveStream: false,
        liveStreamAspectRatio: '',
        liveStreamFitMode: ''
      }));
    }
  }, [entityCapabilities.supportsLiveStream, config.showLiveStream, setConfig]);

  // Replace unsupported toggle actions with valid equivalents for current entity type.
  useEffect(() => {
    const togglePairs: Array<[string, string]> = [
      ['tapAction', 'tapActionData'],
      ['holdAction', 'holdActionData'],
      ['doubleTapAction', 'doubleTapActionData'],
      ['pressAction', 'pressActionData'],
      ['releaseAction', 'releaseActionData'],
      ['iconTapAction', 'iconTapActionData'],
      ['iconHoldAction', 'iconHoldActionData'],
      ['iconDoubleTapAction', 'iconDoubleTapActionData'],
      ['iconPressAction', 'iconPressActionData'],
      ['iconReleaseAction', 'iconReleaseActionData'],
    ];
    const unsupportedActions = new Set(['perform-action', 'assist', 'fire-dom-event', 'multi-actions']);
    const fallbackService = entityCapabilities.toggleFallbackService;

    const updates: Record<string, any> = {};
    let hasChanges = false;

    togglePairs.forEach(([actionKey, actionDataKey]) => {
      const currentAction = (config as any)[actionKey];
      if (unsupportedActions.has(currentAction)) {
        hasChanges = true;
        updates[actionKey] = 'none';
        updates[actionDataKey] = '';
        return;
      }
      if (currentAction !== 'toggle') return;
      if (entityCapabilities.supportsToggleAction || !config.entity) return;

      hasChanges = true;
      if (fallbackService) {
        updates[actionKey] = 'call-service';
        updates[actionDataKey] = JSON.stringify({
          service: fallbackService,
          target: { entity_id: config.entity }
        });
      } else {
        updates[actionKey] = 'more-info';
      }
    });

    if (hasChanges) {
      setConfig(prev => ({ ...prev, ...updates }));
    }
  }, [
    entityCapabilities.supportsToggleAction,
    entityCapabilities.toggleFallbackService,
    config.entity,
    actionTypeSnapshot,
    setConfig
  ]);

  // Fetch custom field entity attributes when entities change
  useEffect(() => {
    const fetchAllAttributes = async () => {
      const newAttributes: Record<number, string[]> = {};
      for (let i = 0; i < config.customFields.length; i++) {
        const field = config.customFields[i];
        if (field.type === 'entity' && field.entity) {
          const attrs = await haService.getEntityAttributes(field.entity);
          newAttributes[i] = attrs;
        }
      }
      setCustomFieldAttributes(newAttributes);
    };
    fetchAllAttributes();
  }, [config.customFields.map(f => f.entity).join(',')]);

  const renderPresetFieldEditor = (key: keyof ButtonConfig, originalValue: any) => {
    const currentValue = (config as any)[key] !== undefined ? (config as any)[key] : originalValue;
    const fieldKey = key as string;
    const fieldLabel = formatPresetFieldLabel(fieldKey);

    if (typeof originalValue === 'boolean') {
      return (
        <ControlInput
          key={fieldKey}
          label={fieldLabel}
          type="checkbox"
          value={Boolean(currentValue)}
          onChange={(v) => updatePresetField(key, Boolean(v))}
          className="bg-gray-800/40 p-2 rounded border border-gray-700"
        />
      );
    }

    if (typeof originalValue === 'number') {
      return (
        <ControlInput
          key={fieldKey}
          label={fieldLabel}
          type="number"
          value={Number(currentValue)}
          onChange={(v) => updatePresetField(key, Number(v))}
        />
      );
    }

    if (typeof originalValue === 'string') {
      const selectOptions = presetSelectOptionsByKey[fieldKey];
      const isColorField = fieldKey.toLowerCase().includes('color') && fieldKey !== 'colorType';

      if (fieldKey === 'extraStyles') {
        return (
          <div key={fieldKey} className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{fieldLabel}</label>
            <textarea
              value={String(currentValue || '')}
              onChange={(e) => updatePresetField(key, e.target.value)}
              rows={4}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>
        );
      }

      if (selectOptions) {
        const normalizedValue = String(currentValue ?? '');
        const hasOption = selectOptions.some(opt => opt.value === normalizedValue);
        if (hasOption) {
          return (
            <ControlInput
              key={fieldKey}
              label={fieldLabel}
              type="select"
              value={normalizedValue}
              options={selectOptions}
              onChange={(v) => updatePresetField(key, v)}
            />
          );
        }
      }

      if (isColorField) {
        return (
          <ControlInput
            key={fieldKey}
            label={fieldLabel}
            type="color"
            value={String(currentValue || '')}
            onChange={(v) => updatePresetField(key, v)}
          />
        );
      }

      return (
        <ControlInput
          key={fieldKey}
          label={fieldLabel}
          value={String(currentValue || '')}
          onChange={(v) => updatePresetField(key, v)}
        />
      );
    }

    return (
      <div key={fieldKey} className="p-2 bg-gray-800/40 border border-gray-700 rounded text-xs text-gray-400">
        {fieldLabel}: complex value not editable here.
      </div>
    );
  };

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
          
          {/* State Editing Toggle - Shows for appearance-related sections */}
          {(showSection('colors') || showSection('glass') || showSection('borders') || showSection('animations') || showSection('typography')) && (
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-900/30 to-gray-900/30 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Editing State</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {entityCapabilities.hasOnOffState ? (
                      <>
                        Changes apply to <span className={editingState === 'on' ? 'text-green-400 font-medium' : 'text-gray-400 font-medium'}>{editingState.toUpperCase()}</span> state
                      </>
                    ) : (
                      <>
                        This entity state is <span className="text-amber-300 font-medium">{selectedEntityState || 'unknown'}</span>; ON/OFF editing is disabled.
                      </>
                    )}
                  </p>
                </div>
                <div className="flex bg-gray-800/80 rounded-full p-0.5 border border-gray-700">
                  <button
                    onClick={() => entityCapabilities.hasOnOffState && onEditingStateChange?.('on')}
                    disabled={!entityCapabilities.hasOnOffState}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      editingState === 'on' 
                        ? 'bg-green-600 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    ON
                  </button>
                  <button
                    onClick={() => entityCapabilities.hasOnOffState && onEditingStateChange?.('off')}
                    disabled={!entityCapabilities.hasOnOffState}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      editingState === 'off' 
                        ? 'bg-gray-600 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    OFF
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* ===== PRESETS > GALLERY ===== */}
          {showSection('presetGallery') && (
            <>
              {/* Save Custom Preset */}
              <div className="p-3 bg-gray-800/40 border border-gray-700 rounded-lg mb-4">
                <p className="text-xs font-bold text-gray-300 uppercase mb-2">Save Current Style as Preset</p>
                <div className="space-y-2">
                  <ControlInput
                    label="Preset Name"
                    value={newPresetName}
                    onChange={(v) => {
                      setNewPresetName(v);
                      if (savePresetError) setSavePresetError('');
                    }}
                    placeholder="My Kiln Green"
                  />
                  <ControlInput
                    label="Description"
                    value={newPresetDescription}
                    onChange={(v) => setNewPresetDescription(v)}
                    placeholder="Optional"
                  />
                  <button
                    onClick={handleSaveCurrentStylePreset}
                    disabled={!onSaveCustomPreset || !newPresetName.trim()}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded text-sm font-medium text-white transition-colors"
                  >
                    Save as Preset
                  </button>
                  {savePresetError && <p className="text-[10px] text-red-400">{savePresetError}</p>}
                  {savePresetSuccess && <p className="text-[10px] text-green-400">{savePresetSuccess}</p>}
                </div>
              </div>

              {/* Preset Search */}
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  placeholder="Search presets..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                {presetSearch && (
                  <button
                    onClick={() => setPresetSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              {/* Current Preset Info */}
              {activePreset && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-400">Active Preset</p>
                      <p className="text-sm font-medium text-purple-400">{activePreset.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Preset Styler - edits keep preset active and sync with normal controls */}
              {activePreset && onPresetConfigChange && (
                <div className="p-3 bg-gray-800/40 border border-gray-700 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-300 uppercase">Preset Styler</p>
                    <span className="text-[10px] text-gray-500">{presetEditableEntries.length} fields</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-3">
                    Changes here update this preset and sync with the normal editors. Editing outside this panel exits preset mode.
                  </p>
                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                    {presetEditableEntries.map(([key, value]) => renderPresetFieldEditor(key, value))}
                  </div>
                </div>
              )}
              
              {/* Preset Gallery */}
              {presetCategoryOrder.map(category => {
                const filteredPresets = presets.filter(p => {
                  if (p.category !== category) return false;
                  if (!presetSearch) return true;
                  const query = presetSearch.toLowerCase();
                  return p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
                });
                if (filteredPresets.length === 0) return null;
                
                return (
                  <div key={category} className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 sticky top-0 bg-gray-900 py-1">
                      {category === '3d' ? '3D Effects' : category === 'icon-styles' ? 'Icon Styles' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {filteredPresets.map(preset => (
                        <div
                          key={preset.id || preset.name}
                          className={`w-full px-3 py-2 rounded border transition-colors ${
                            isActivePreset(preset)
                              ? 'bg-purple-500/20 border-purple-500/50'
                              : 'hover:bg-gray-800 border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => onApplyPreset?.(preset)}
                              className="flex-1 text-left"
                            >
                              <div className="flex items-center gap-2">
                                <div className="text-sm text-white font-medium">{preset.name}</div>
                                {preset.isUserPreset && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Saved</span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-500">{preset.description}</div>
                            </button>
                            {preset.isUserPreset && onDeleteCustomPreset && (
                              <button
                                onClick={() => onDeleteCustomPreset(preset)}
                                className="text-[10px] px-2 py-1 rounded bg-red-500/15 text-red-300 hover:bg-red-500/25 transition-colors"
                                title="Delete saved preset"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {/* No results message */}
              {presetSearch && presets.filter(p => {
                const query = presetSearch.toLowerCase();
                return p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
              }).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No presets found</p>
                  <p className="text-gray-500 text-xs mt-1">Try a different search term</p>
                </div>
              )}
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
                            } else if (cond === 'on' && useAutoDarkMode && activePreset) {
                              // Re-apply auto dark mode when switching to 'on' condition
                              const darkPreset = generateDarkModePreset(activePreset);
                              onSetOffStatePreset?.(darkPreset);
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
                  
                  {/* Auto Dark Mode Toggle - Only shown when condition is 'on' */}
                  {presetCondition === 'on' && (
                    <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase font-bold">Auto Dark Mode for OFF</label>
                          <p className="text-[9px] text-gray-500 mt-0.5">
                            Automatically generate a muted/dark version of the preset for the off state
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const newValue = !useAutoDarkMode;
                            onSetUseAutoDarkMode?.(newValue);
                            if (newValue && activePreset) {
                              const darkPreset = generateDarkModePreset(activePreset);
                              onSetOffStatePreset?.(darkPreset);
                            } else if (!newValue) {
                              // Clear the auto-generated preset when disabling
                              if (offStatePreset?.isAutoDark) {
                                onSetOffStatePreset?.(null);
                              }
                            }
                          }}
                          className={`relative w-10 h-5 rounded-full transition-colors ${
                            useAutoDarkMode ? 'bg-purple-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                              useAutoDarkMode ? 'translate-x-5' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Secondary Preset Selection - When ON */}
                  {presetCondition === 'on' && (
                    <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <label className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                        <ToggleLeft size={12} />
                        When OFF, use:
                      </label>
                      {offStatePreset ? (
                        <div className="flex items-center justify-between bg-gray-700/50 rounded px-3 py-2">
                          <div>
                            <span className="text-sm text-cyan-400">{offStatePreset.name}</span>
                            {offStatePreset.isAutoDark && (
                              <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">Auto-generated</span>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              onSetOffStatePreset?.(null);
                              // If clearing an auto-generated preset, disable auto dark mode
                              if (offStatePreset.isAutoDark) {
                                onSetUseAutoDarkMode?.(false);
                              }
                            }}
                            className="text-gray-500 hover:text-red-400 text-xs"
                          >
                            Clear
                          </button>
                        </div>
                      ) : (
                        <select
                          onChange={(e) => {
                            const preset = presets.find(p => (p.id || p.name) === e.target.value);
                            if (preset) {
                              onSetOffStatePreset?.(preset);
                              // User manually selected a preset, disable auto dark mode
                              onSetUseAutoDarkMode?.(false);
                            }
                          }}
                          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                          defaultValue=""
                        >
                          <option value="" disabled>Select preset for OFF state...</option>
                          {presets.map(p => (
                            <option key={p.id || p.name} value={p.id || p.name}>{p.name}</option>
                          ))}
                        </select>
                      )}
                      <p className="text-[9px] text-gray-500">
                        {useAutoDarkMode 
                          ? "Using auto-generated dark mode. Select a preset manually to override."
                          : "Or leave empty to use default styling when OFF"}
                      </p>
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
                            const preset = presets.find(p => (p.id || p.name) === e.target.value);
                            if (preset) onSetOnStatePreset?.(preset);
                          }}
                          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                          defaultValue=""
                        >
                          <option value="" disabled>Select preset for ON state...</option>
                          {presets.map(p => (
                            <option key={p.id || p.name} value={p.id || p.name}>{p.name}</option>
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
                  // Clear attribute when entity changes
                  if (config.labelAttribute) {
                    update('labelAttribute', '');
                  }
                }}
                allowAll={true}
              />
              {labelEntityAttributes.length > 0 ? (
                <ControlInput 
                  type="select" 
                  label="Attribute (optional)" 
                  value={config.labelAttribute} 
                  options={[
                    { value: '', label: '-- Entity State --' },
                    ...labelEntityAttributes.map(attr => ({ value: attr, label: attr }))
                  ]}
                  onChange={(v) => update('labelAttribute', v)} 
                />
              ) : (
                <ControlInput 
                  label="Attribute (optional)" 
                  value={config.labelAttribute} 
                  onChange={(v) => update('labelAttribute', v)} 
                  placeholder="temperature, brightness, etc." 
                />
              )}
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
            <ControlInput 
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
          <div className="grid grid-cols-2 gap-4">
             <ControlInput 
               label="Grid Columns" 
               value={config.gridColumns.toString()} 
               onChange={(v) => update('gridColumns', Number(v) || 4)} 
               placeholder="4"
             />
             <ControlInput 
               label="Grid Rows" 
               value={config.gridRows === 0 ? 'auto' : config.gridRows.toString()} 
               onChange={(v) => update('gridRows', v === 'auto' || v === '' ? 0 : Number(v))} 
               placeholder="auto"
             />
          </div>
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
            <ControlInput
              type="checkbox"
              label="Live Stream"
              value={config.showLiveStream}
              onChange={(v) => update('showLiveStream', v)}
              disabled={!entityCapabilities.supportsLiveStream}
              disabledReason="Live stream is only supported for camera entities."
            />
            <ControlInput type="checkbox" label="Hidden" value={config.hidden} onChange={(v) => update('hidden', v)} />
          </div>
          {config.showLiveStream && (
            <>
            <ControlInput label="Stream Aspect Ratio" value={config.liveStreamAspectRatio} onChange={(v) => update('liveStreamAspectRatio', v)} placeholder="16x9, 50%, 1.78" className="mt-2" />
            <ControlInput type="select" label="Stream Fit Mode" value={config.liveStreamFitMode} options={LIVE_STREAM_FIT_OPTIONS} onChange={(v) => update('liveStreamFitMode', v)} className="mt-2" />
            </>
          )}
          {config.hidden && (
            <ControlInput label="Hidden Template" value={config.hiddenTemplate} onChange={(v) => update('hiddenTemplate', v)} placeholder="[[[ return entity.state === 'off' ]]]" />
          )}
            </>
          )}

          {/* ===== LAYOUT > GRID LAYOUT ===== */}
          {showSection('gridLayout') && (
            <>
          <div className="space-y-4">
            <p className="text-xs text-gray-400 mb-2">
              Configure the internal CSS Grid layout for custom field positioning. This uses CSS Grid Template Areas.
            </p>
            
            <ControlInput 
              type="checkbox" 
              label="Enable Custom Grid Layout" 
              value={config.customGridEnabled} 
              onChange={(v) => update('customGridEnabled', v)} 
            />
            
            {config.customGridEnabled && (
              <>
                {/* Visual Grid Designer Button */}
                <button
                  onClick={() => setShowGridDesigner(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-sm text-white font-medium transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  <Pencil size={16} />
                  Open Visual Grid Designer
                </button>
                
                <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Grid Template Areas</p>
                  <p className="text-[10px] text-gray-500 mb-2">
                    Define named grid areas. Use: <code className="text-blue-400">i</code> (icon), <code className="text-blue-400">n</code> (name), <code className="text-blue-400">s</code> (state), <code className="text-blue-400">l</code> (label), or custom field names.
                  </p>
                  <textarea
                    value={config.customGridTemplateAreas}
                    onChange={(e) => update('customGridTemplateAreas', e.target.value)}
                    placeholder={'"i n" "i s"'}
                    className="w-full h-20 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
                  />
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Grid Columns</label>
                      <input
                        type="text"
                        value={config.customGridTemplateColumns}
                        onChange={(e) => update('customGridTemplateColumns', e.target.value)}
                        placeholder="min-content 1fr"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Grid Rows</label>
                      <input
                        type="text"
                        value={config.customGridTemplateRows}
                        onChange={(e) => update('customGridTemplateRows', e.target.value)}
                        placeholder="min-content min-content"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Grid Presets */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Quick Presets</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        update('customGridTemplateAreas', '"i n" "i s"');
                        update('customGridTemplateColumns', 'min-content 1fr');
                        update('customGridTemplateRows', 'min-content min-content');
                      }}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-700 text-left"
                    >
                      <span className="font-medium">Icon Left</span>
                      <span className="block text-[10px] text-gray-500">Icon | Name/State</span>
                    </button>
                    <button
                      onClick={() => {
                        update('customGridTemplateAreas', '"i" "n" "s"');
                        update('customGridTemplateColumns', '1fr');
                        update('customGridTemplateRows', '1fr min-content min-content');
                      }}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-700 text-left"
                    >
                      <span className="font-medium">Stacked</span>
                      <span className="block text-[10px] text-gray-500">Icon / Name / State</span>
                    </button>
                    <button
                      onClick={() => {
                        update('customGridTemplateAreas', '"i" "n" "l" "field1 field2"');
                        update('customGridTemplateColumns', '1fr 1fr');
                        update('customGridTemplateRows', '1fr min-content min-content min-content');
                      }}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-700 text-left"
                    >
                      <span className="font-medium">Info Card</span>
                      <span className="block text-[10px] text-gray-500">Icon / Name / Custom Fields</span>
                    </button>
                    <button
                      onClick={() => {
                        update('customGridTemplateAreas', '"i i" "n s" "field1 field2" "field3 field4"');
                        update('customGridTemplateColumns', '1fr 1fr');
                        update('customGridTemplateRows', '1fr min-content min-content min-content');
                      }}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-700 text-left"
                    >
                      <span className="font-medium">Stats Grid</span>
                      <span className="block text-[10px] text-gray-500">Like the HassOS example</span>
                    </button>
                  </div>
                </div>
                
                {/* Custom Fields Grid Areas */}
                {config.customFields.length > 0 && (
                  <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Custom Field Grid Areas</p>
                    <p className="text-[10px] text-gray-500 mb-2">
                      Assign grid areas to your custom fields. Use the same names in your template areas above.
                    </p>
                    {config.customFields.map((field, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-20 truncate">{field.name}:</span>
                        <input
                          type="text"
                          value={field.gridArea || field.name}
                          onChange={(e) => {
                            const updated = [...config.customFields];
                            updated[idx] = { ...field, gridArea: e.target.value };
                            update('customFields', updated);
                          }}
                          placeholder={field.name}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
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

                <div className="space-y-4">
                   <div className="space-y-2">
                        <ControlInput label="Card Background" type="color" value={getAppearanceValue('backgroundColor') || '#000000'} onChange={(v) => {
                          updateAppearance('backgroundColor', v);
                          updateAppearance('gradientEnabled', false);
                        }} />
                        <ControlInput label="Opacity" type="slider" value={getAppearanceValue('backgroundColorOpacity')} min={0} max={100} onChange={(v) => updateAppearance('backgroundColorOpacity', v)} />
                   </div>
                   <ControlInput label="Default Text Color" type="color" value={getAppearanceValue('color') || '#ffffff'} onChange={(v) => updateAppearance('color', v)} />
                </div>
             </div>
             
             <div className="h-px bg-gray-700/50" />

             {/* Gradient Background */}
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-400 uppercase">Gradient Background</p>
                  <ControlInput type="checkbox" label="" value={!!getAppearanceValue('gradientEnabled')} onChange={(v) => {
                    // When enabling gradient, clear solid background color and set defaults
                    if (v) {
                      if (setCurrentAppearance && currentAppearance) {
                        setCurrentAppearance({ 
                          ...currentAppearance, 
                          gradientEnabled: true,
                          backgroundColor: '',
                          backgroundColorOpacity: 100,
                          gradientType: currentAppearance.gradientType || DEFAULT_STATE_APPEARANCE.gradientType,
                          gradientAngle: currentAppearance.gradientAngle ?? DEFAULT_STATE_APPEARANCE.gradientAngle,
                          gradientColor1: currentAppearance.gradientColor1 || DEFAULT_STATE_APPEARANCE.gradientColor1,
                          gradientColor2: currentAppearance.gradientColor2 || DEFAULT_STATE_APPEARANCE.gradientColor2,
                          gradientColor3: currentAppearance.gradientColor3 || DEFAULT_STATE_APPEARANCE.gradientColor3,
                          gradientColor3Enabled: currentAppearance.gradientColor3Enabled ?? DEFAULT_STATE_APPEARANCE.gradientColor3Enabled,
                          gradientOpacity: currentAppearance.gradientOpacity ?? DEFAULT_STATE_APPEARANCE.gradientOpacity,
                        });
                      }
                      // Also clear base config backgroundColor so it doesn't output in base styles
                      update('backgroundColor', '');
                    } else {
                      updateAppearance('gradientEnabled', false);
                    }
                  }} />
                </div>
                
                {getAppearanceValue('gradientEnabled') && (
                  <div className="space-y-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    {/* Gradient Preview */}
                    <div 
                      className="h-12 rounded-lg border border-gray-600"
                      style={{
                        background: getAppearanceValue('gradientType') === 'linear' 
                          ? `linear-gradient(${getAppearanceValue('gradientAngle')}deg, ${getAppearanceValue('gradientColor1')}, ${getAppearanceValue('gradientColor2')}${getAppearanceValue('gradientColor3Enabled') ? `, ${getAppearanceValue('gradientColor3')}` : ''})`
                          : getAppearanceValue('gradientType') === 'radial'
                          ? `radial-gradient(circle, ${getAppearanceValue('gradientColor1')}, ${getAppearanceValue('gradientColor2')}${getAppearanceValue('gradientColor3Enabled') ? `, ${getAppearanceValue('gradientColor3')}` : ''})`
                          : `conic-gradient(from ${getAppearanceValue('gradientAngle')}deg, ${getAppearanceValue('gradientColor1')}, ${getAppearanceValue('gradientColor2')}${getAppearanceValue('gradientColor3Enabled') ? `, ${getAppearanceValue('gradientColor3')}` : ''}, ${getAppearanceValue('gradientColor1')})`
                      }}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <ControlInput 
                        type="select" 
                        label="Type" 
                        value={getAppearanceValue('gradientType')} 
                        options={[
                          { value: 'linear', label: 'Linear' },
                          { value: 'radial', label: 'Radial' },
                          { value: 'conic', label: 'Conic' },
                        ]} 
                        onChange={(v) => updateAppearance('gradientType', v)} 
                      />
                      {(getAppearanceValue('gradientType') === 'linear' || getAppearanceValue('gradientType') === 'conic') && (
                        <ControlInput 
                          type="slider" 
                          label="Angle" 
                          value={getAppearanceValue('gradientAngle')} 
                          min={0} 
                          max={360} 
                          onChange={(v) => updateAppearance('gradientAngle', v)} 
                        />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <ControlInput label="Color 1" type="color" value={getAppearanceValue('gradientColor1')} onChange={(v) => updateAppearance('gradientColor1', v)} />
                      <ControlInput label="Color 2" type="color" value={getAppearanceValue('gradientColor2')} onChange={(v) => updateAppearance('gradientColor2', v)} />
                    </div>
                    
                    <ControlInput label="Gradient Opacity" type="slider" value={getAppearanceValue('gradientOpacity')} min={0} max={100} onChange={(v) => updateAppearance('gradientOpacity', v)} />
                    
                    <div className="flex items-center gap-3">
                      <ControlInput type="checkbox" label="3rd Color" value={getAppearanceValue('gradientColor3Enabled')} onChange={(v) => updateAppearance('gradientColor3Enabled', v)} />
                      {getAppearanceValue('gradientColor3Enabled') && (
                        <div className="flex-1">
                          <ControlInput label="" type="color" value={getAppearanceValue('gradientColor3')} onChange={(v) => updateAppearance('gradientColor3', v)} />
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
                  colorValue={getAppearanceValue('iconColor')}
                  setColor={(v: string) => updateAppearance('iconColor', v)}
                  autoValue={config.iconColorAuto}
                  setAuto={(v: boolean) => update('iconColorAuto', v)}
                />

                <ColorPairInput 
                  label="Name Color"
                  colorValue={getAppearanceValue('nameColor')}
                  setColor={(v: string) => updateAppearance('nameColor', v)}
                  autoValue={config.nameColorAuto}
                  setAuto={(v: boolean) => update('nameColorAuto', v)}
                />

                <ColorPairInput 
                  label="State Color"
                  colorValue={getAppearanceValue('stateColor')}
                  setColor={(v: string) => updateAppearance('stateColor', v)}
                  autoValue={config.stateColorAuto}
                  setAuto={(v: boolean) => update('stateColorAuto', v)}
                />

                <ColorPairInput 
                  label="Label Color"
                  colorValue={getAppearanceValue('labelColor')}
                  setColor={(v: string) => updateAppearance('labelColor', v)}
                  autoValue={config.labelColorAuto}
                  setAuto={(v: boolean) => update('labelColorAuto', v)}
                />
             </div>
             
             <div className="h-px bg-gray-700/50" />

             {/* Conditionals (State-Based Styling) - Moved from State Styles section */}
             <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Conditionals (State-Based Styling)</p>
                <button
                  onClick={() => update('stateStyles', [...config.stateStyles, { 
                    id: 'state_' + (config.stateStyles.length + 1), 
                    operator: 'equals', 
                    value: entityCapabilities.hasOnOffState ? 'on' : (selectedEntityState || ''),
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
                    stateColor: '',
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
              {!entityCapabilities.hasOnOffState && (
                <p className="text-[10px] text-amber-300/90 mb-3">
                  This entity is not ON/OFF based. Use exact state values like "{selectedEntityState || 'idle'}", regex, or numeric operators.
                </p>
              )}
              {config.stateStyles.some(style => style.operator === 'template') && (
                <p className="text-[10px] text-amber-300/90 mb-3">
                  Template operators are generated in YAML, but preview cannot execute custom JS templates.
                </p>
              )}
              
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
                            <ControlInput label="State Color" type="color" value={style.stateColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, stateColor: v };
                              update('stateStyles', updated);
                            }} />
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-2">
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
        
          {/* ===== APPEARANCE > GLASS ===== */}
          {showSection('glass') && (
            <>
           <div className="space-y-4">
              <p className="text-xs text-gray-500 italic">Glass & depth effects apply to all states</p>
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
               colorValue={getAppearanceValue('borderColor')}
               setColor={(v: string) => updateAppearance('borderColor', v)}
               autoValue={config.borderColorAuto}
               setAuto={(v: boolean) => update('borderColorAuto', v)}
            />
          </div>
            </>
          )}

          {/* ===== APPEARANCE > ANIMATIONS ===== */}
          {showSection('animations') && (
            <>
          <div className="space-y-6">
             {/* Card Animation */}
             <div className="space-y-3">
                <p className="text-xs font-bold text-blue-400 uppercase">Card Animation</p>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Type" type="select" value={getAppearanceValue('cardAnimation')} options={ANIMATION_OPTIONS} onChange={(v) => updateAppearance('cardAnimation', v)} />
                  <ControlInput label="Speed/Duration" value={getAppearanceValue('cardAnimationSpeed')} onChange={(v) => updateAppearance('cardAnimationSpeed', v)} suffix="s" />
                </div>
                <ControlInput 
                  type="checkbox" 
                  label="Always Animate Card (Bypass State Toggle)" 
                  value={config.alwaysAnimateCard} 
                  onChange={(v) => update('alwaysAnimateCard', v)} 
                />
             </div>

             <div className="h-px bg-gray-700/50" />

             {/* Icon Animation - NOT locked by extraStyles since it only affects card */}
             <div className="space-y-3">
                <p className="text-xs font-bold text-blue-400 uppercase">Icon Animation</p>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Type" type="select" value={getAppearanceValue('iconAnimation')} options={ANIMATION_OPTIONS} onChange={(v) => updateAppearance('iconAnimation', v)} />
                  <ControlInput label="Speed/Duration" value={getAppearanceValue('iconAnimationSpeed')} onChange={(v) => updateAppearance('iconAnimationSpeed', v)} suffix="s" />
                </div>
                <ControlInput 
                  type="checkbox" 
                  label="Always Animate Icon (Bypass State Toggle)" 
                  value={config.alwaysAnimateIcon} 
                  onChange={(v) => update('alwaysAnimateIcon', v)} 
                />
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

          {/* ===== APPEARANCE > THRESHOLD ALERTS ===== */}
          {showSection('thresholdColors') && (
            <>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-600/20 via-yellow-600/20 to-red-600/20 rounded-lg border border-gray-700">
              <Gauge className="text-yellow-400" size={24} />
              <div>
                <p className="text-sm font-medium text-white">Threshold Color Alerts</p>
                <p className="text-xs text-gray-400">Automatically color icons/text based on numeric sensor values</p>
              </div>
            </div>
            
            <ControlInput 
              type="checkbox" 
              label="Enable Threshold Colors" 
              value={config.thresholdColor.enabled} 
              onChange={(v) => update('thresholdColor', { ...config.thresholdColor, enabled: v })} 
            />
            
            {config.thresholdColor.enabled && (
              <>
                <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Data Source</p>
                  
                  <EntitySelector 
                    label="Entity" 
                    value={config.thresholdColor.entity || config.entity} 
                    onChange={(v) => update('thresholdColor', { ...config.thresholdColor, entity: v })}
                    allowAll={true}
                  />
                  
                  <ControlInput 
                    label="Attribute (optional)" 
                    value={config.thresholdColor.attribute} 
                    onChange={(v) => update('thresholdColor', { ...config.thresholdColor, attribute: v })} 
                    placeholder="Leave empty to use state"
                  />
                </div>
                
                <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Threshold Mode</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => update('thresholdColor', { ...config.thresholdColor, mode: 'ascending' })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        config.thresholdColor.mode === 'ascending'
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">📈 Ascending</div>
                      <div className="text-[10px] text-gray-500">Low = Green, High = Red</div>
                      <div className="text-[10px] text-gray-500 mt-1">e.g., CPU %, Temperature</div>
                    </button>
                    <button
                      onClick={() => update('thresholdColor', { ...config.thresholdColor, mode: 'descending' })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        config.thresholdColor.mode === 'descending'
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">📉 Descending</div>
                      <div className="text-[10px] text-gray-500">High = Green, Low = Red</div>
                      <div className="text-[10px] text-gray-500 mt-1">e.g., Battery %, Signal</div>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Thresholds</p>
                  <p className="text-[10px] text-gray-500 mb-2">
                    {config.thresholdColor.mode === 'ascending' 
                      ? 'Values ≤ Green threshold are green, > Yellow threshold are red, between is yellow'
                      : 'Values ≥ Green threshold are green, < Yellow threshold are red, between is yellow'
                    }
                  </p>
                  
                  {/* Visual threshold bar */}
                  <div className="relative h-8 rounded-lg overflow-hidden bg-gray-700">
                    <div 
                      className="absolute inset-y-0 left-0 transition-all"
                      style={{ 
                        width: `${config.thresholdColor.mode === 'ascending' ? config.thresholdColor.greenThreshold : 100 - config.thresholdColor.greenThreshold}%`,
                        backgroundColor: config.thresholdColor.greenColor
                      }}
                    />
                    <div 
                      className="absolute inset-y-0 transition-all"
                      style={{ 
                        left: config.thresholdColor.mode === 'ascending' 
                          ? `${config.thresholdColor.greenThreshold}%` 
                          : `${100 - config.thresholdColor.greenThreshold}%`,
                        width: config.thresholdColor.mode === 'ascending'
                          ? `${config.thresholdColor.yellowThreshold - config.thresholdColor.greenThreshold}%`
                          : `${config.thresholdColor.greenThreshold - config.thresholdColor.yellowThreshold}%`,
                        backgroundColor: config.thresholdColor.yellowColor
                      }}
                    />
                    <div 
                      className="absolute inset-y-0 right-0 transition-all"
                      style={{ 
                        width: config.thresholdColor.mode === 'ascending' 
                          ? `${100 - config.thresholdColor.yellowThreshold}%`
                          : `${config.thresholdColor.yellowThreshold}%`,
                        backgroundColor: config.thresholdColor.redColor
                      }}
                    />
                    {/* Markers */}
                    <div className="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-bold text-white/80">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.thresholdColor.greenColor }} />
                        <span className="text-xs text-gray-400">Green ≤</span>
                      </div>
                      <input
                        type="number"
                        value={config.thresholdColor.greenThreshold}
                        onChange={(e) => update('thresholdColor', { ...config.thresholdColor, greenThreshold: Number(e.target.value) })}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.thresholdColor.yellowColor }} />
                        <span className="text-xs text-gray-400">Yellow ≤</span>
                      </div>
                      <input
                        type="number"
                        value={config.thresholdColor.yellowThreshold}
                        onChange={(e) => update('thresholdColor', { ...config.thresholdColor, yellowThreshold: Number(e.target.value) })}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.thresholdColor.redColor }} />
                        <span className="text-xs text-gray-400">Red &gt;</span>
                      </div>
                      <input
                        type="number"
                        value={config.thresholdColor.redThreshold}
                        onChange={(e) => update('thresholdColor', { ...config.thresholdColor, redThreshold: Number(e.target.value) })}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                        disabled
                      />
                      <p className="text-[9px] text-gray-600">Auto (above yellow)</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Apply To</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <ControlInput 
                      type="checkbox" 
                      label="Icon" 
                      value={config.thresholdColor.applyToIcon} 
                      onChange={(v) => update('thresholdColor', { ...config.thresholdColor, applyToIcon: v })} 
                    />
                    <ControlInput 
                      type="checkbox" 
                      label="State/Value" 
                      value={config.thresholdColor.applyToState} 
                      onChange={(v) => update('thresholdColor', { ...config.thresholdColor, applyToState: v })} 
                    />
                    <ControlInput 
                      type="checkbox" 
                      label="Name" 
                      value={config.thresholdColor.applyToName} 
                      onChange={(v) => update('thresholdColor', { ...config.thresholdColor, applyToName: v })} 
                    />
                    <ControlInput 
                      type="checkbox" 
                      label="Label" 
                      value={config.thresholdColor.applyToLabel} 
                      onChange={(v) => update('thresholdColor', { ...config.thresholdColor, applyToLabel: v })} 
                    />
                  </div>
                </div>
                
                <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Custom Colors</p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Green</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border border-gray-600 overflow-hidden relative"
                          style={{ backgroundColor: config.thresholdColor.greenColor }}
                        >
                          <input 
                            type="color" 
                            value={config.thresholdColor.greenColor} 
                            onChange={(e) => update('thresholdColor', { ...config.thresholdColor, greenColor: e.target.value })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.thresholdColor.greenColor}
                          onChange={(e) => update('thresholdColor', { ...config.thresholdColor, greenColor: e.target.value })}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[10px] text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Yellow</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border border-gray-600 overflow-hidden relative"
                          style={{ backgroundColor: config.thresholdColor.yellowColor }}
                        >
                          <input 
                            type="color" 
                            value={config.thresholdColor.yellowColor} 
                            onChange={(e) => update('thresholdColor', { ...config.thresholdColor, yellowColor: e.target.value })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.thresholdColor.yellowColor}
                          onChange={(e) => update('thresholdColor', { ...config.thresholdColor, yellowColor: e.target.value })}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[10px] text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Red</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border border-gray-600 overflow-hidden relative"
                          style={{ backgroundColor: config.thresholdColor.redColor }}
                        >
                          <input 
                            type="color" 
                            value={config.thresholdColor.redColor} 
                            onChange={(e) => update('thresholdColor', { ...config.thresholdColor, redColor: e.target.value })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.thresholdColor.redColor}
                          onChange={(e) => update('thresholdColor', { ...config.thresholdColor, redColor: e.target.value })}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[10px] text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => update('thresholdColor', { 
                      ...config.thresholdColor, 
                      greenColor: DEFAULT_THRESHOLD_CONFIG.greenColor,
                      yellowColor: DEFAULT_THRESHOLD_CONFIG.yellowColor,
                      redColor: DEFAULT_THRESHOLD_CONFIG.redColor,
                    })}
                    className="w-full px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
                  >
                    Reset to Default Colors
                  </button>
                </div>
                
                {/* Preset configurations */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Quick Presets</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => update('thresholdColor', { 
                        ...config.thresholdColor, 
                        mode: 'ascending',
                        greenThreshold: 30,
                        yellowThreshold: 70,
                      })}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-700 text-left"
                    >
                      <span className="font-medium">🌡️ Temperature/CPU</span>
                      <span className="block text-[10px] text-gray-500">Green ≤30, Yellow ≤70, Red &gt;70</span>
                    </button>
                    <button
                      onClick={() => update('thresholdColor', { 
                        ...config.thresholdColor, 
                        mode: 'descending',
                        greenThreshold: 50,
                        yellowThreshold: 20,
                      })}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-700 text-left"
                    >
                      <span className="font-medium">🔋 Battery</span>
                      <span className="block text-[10px] text-gray-500">Green ≥50, Yellow ≥20, Red &lt;20</span>
                    </button>
                    <button
                      onClick={() => update('thresholdColor', { 
                        ...config.thresholdColor, 
                        mode: 'ascending',
                        greenThreshold: 50,
                        yellowThreshold: 80,
                      })}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-700 text-left"
                    >
                      <span className="font-medium">💾 Disk/Memory</span>
                      <span className="block text-[10px] text-gray-500">Green ≤50%, Yellow ≤80%, Red &gt;80%</span>
                    </button>
                    <button
                      onClick={() => update('thresholdColor', { 
                        ...config.thresholdColor, 
                        mode: 'descending',
                        greenThreshold: 80,
                        yellowThreshold: 40,
                      })}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-700 text-left"
                    >
                      <span className="font-medium">📶 Signal Strength</span>
                      <span className="block text-[10px] text-gray-500">Green ≥80, Yellow ≥40, Red &lt;40</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
            </>
          )}

          {/* ===== ACTIONS > CARD ACTIONS ===== */}
          {showSection('cardActions') && (
            <>
          <div className="space-y-4">
            {!entityCapabilities.supportsToggleAction && (
              <div className="text-[10px] text-amber-300 p-2 bg-amber-500/10 border border-amber-500/20 rounded">
                <code className="text-amber-200">toggle</code> is not supported for{' '}
                <code className="text-amber-200">{config.entity || 'this entity type'}</code>.
                {entityCapabilities.toggleFallbackService
                  ? ` Switched to call-service (${entityCapabilities.toggleFallbackService}).`
                  : ' Use call-service or more-info instead.'}
              </div>
            )}
            <div>
              <ControlInput label="Tap Action" type="select" value={config.tapAction} options={entityActionOptions} onChange={(v) => update('tapAction', v)} />
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
              <ControlInput label="Hold Action" type="select" value={config.holdAction} options={entityActionOptions} onChange={(v) => update('holdAction', v)} />
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
              <ControlInput label="Double Tap Action" type="select" value={config.doubleTapAction} options={entityActionOptions} onChange={(v) => update('doubleTapAction', v)} />
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
              <ControlInput label="Press Action" type="select" value={config.pressAction} options={entityActionOptions} onChange={(v) => update('pressAction', v)} />
              {(config.pressAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.pressActionData} onChange={(v) => update('pressActionData', v)} placeholder='{"service": "switch.turn_on"}' />
                </div>
              )}
              {(config.pressAction === 'navigate' || config.pressAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label={config.pressAction === 'url' ? 'URL' : 'Navigation Path'} value={config.pressActionNavigation} onChange={(v) => update('pressActionNavigation', v)} placeholder={config.pressAction === 'url' ? 'https://...' : '/lovelace/dashboard'} />
                </div>
              )}
              {(config.pressAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.pressActionJavascript} onChange={(v) => update('pressActionJavascript', v)} />
                </div>
              )}
            </div>
            
            <div>
              <ControlInput label="Release Action" type="select" value={config.releaseAction} options={entityActionOptions} onChange={(v) => update('releaseAction', v)} />
              {(config.releaseAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.releaseActionData} onChange={(v) => update('releaseActionData', v)} placeholder='{"service": "switch.turn_off"}' />
                </div>
              )}
              {(config.releaseAction === 'navigate' || config.releaseAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label={config.releaseAction === 'url' ? 'URL' : 'Navigation Path'} value={config.releaseActionNavigation} onChange={(v) => update('releaseActionNavigation', v)} placeholder={config.releaseAction === 'url' ? 'https://...' : '/lovelace/dashboard'} />
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
              <ControlInput label="Icon Tap Action" type="select" value={config.iconTapAction} options={entityActionOptions} onChange={(v) => update('iconTapAction', v)} />
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
              <ControlInput label="Icon Hold Action" type="select" value={config.iconHoldAction} options={entityActionOptions} onChange={(v) => update('iconHoldAction', v)} />
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
              <ControlInput label="Icon Double Tap Action" type="select" value={config.iconDoubleTapAction} options={entityActionOptions} onChange={(v) => update('iconDoubleTapAction', v)} />
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
                <ControlInput label="Icon Press Action" type="select" value={config.iconPressAction} options={entityActionOptions} onChange={(v) => update('iconPressAction', v)} />
                {(config.iconPressAction === 'call-service') && (
                  <div className="mt-2">
                    <ControlInput label="Service Data (JSON)" value={config.iconPressActionData} onChange={(v) => update('iconPressActionData', v)} />
                  </div>
                )}
                {(config.iconPressAction === 'navigate' || config.iconPressAction === 'url') && (
                  <div className="mt-2">
                    <ControlInput label={config.iconPressAction === 'url' ? 'URL' : 'Navigation Path'} value={config.iconPressActionNavigation} onChange={(v) => update('iconPressActionNavigation', v)} placeholder={config.iconPressAction === 'url' ? 'https://...' : '/lovelace/dashboard'} />
                  </div>
                )}
              </div>
              
              <div>
                <ControlInput label="Icon Release Action" type="select" value={config.iconReleaseAction} options={entityActionOptions} onChange={(v) => update('iconReleaseAction', v)} />
                {(config.iconReleaseAction === 'call-service') && (
                  <div className="mt-2">
                    <ControlInput label="Service Data (JSON)" value={config.iconReleaseActionData} onChange={(v) => update('iconReleaseActionData', v)} />
                  </div>
                )}
                {(config.iconReleaseAction === 'navigate' || config.iconReleaseAction === 'url') && (
                  <div className="mt-2">
                    <ControlInput label={config.iconReleaseAction === 'url' ? 'URL' : 'Navigation Path'} value={config.iconReleaseActionNavigation} onChange={(v) => update('iconReleaseActionNavigation', v)} placeholder={config.iconReleaseAction === 'url' ? 'https://...' : '/lovelace/dashboard'} />
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
                
                {/* Lock Exemptions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400">Exempt Users (won't see lock)</label>
                    <button
                      onClick={() => update('lock', { ...config.lock, exemptions: [...config.lock.exemptions, ''] })}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  {config.lock.exemptions.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No exemptions (all users see lock)</p>
                  ) : (
                    <div className="space-y-2">
                      {config.lock.exemptions.map((userId, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={userId}
                            onChange={(e) => {
                              const updated = [...config.lock.exemptions];
                              updated[idx] = e.target.value;
                              update('lock', { ...config.lock, exemptions: updated });
                            }}
                            placeholder="user_id or username"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                          />
                          <button
                            onClick={() => update('lock', { ...config.lock, exemptions: config.lock.exemptions.filter((_, i) => i !== idx) })}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
            <p className="text-xs text-gray-400">
              Add custom fields to display entity states, attributes, or custom content in your button.
            </p>
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Custom Fields</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => update('customFields', [...config.customFields, { name: 'field' + (config.customFields.length + 1), type: 'entity', value: '', entity: '', attribute: '', icon: '', prefix: '', suffix: '', styles: '' }])}
                    className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white"
                  >
                    <Plus size={12} /> Entity
                  </button>
                  <button
                    onClick={() => update('customFields', [...config.customFields, { name: 'field' + (config.customFields.length + 1), type: 'text', value: '', styles: '' }])}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                  >
                    <Plus size={12} /> Custom
                  </button>
                </div>
              </div>
              
              {config.customFields.length === 0 ? (
                <div className="text-xs text-gray-500 italic text-center py-4 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
                  No custom fields. Add an Entity field to display sensor data or a Custom field for templates.
                </div>
              ) : (
                <div className="space-y-3">
                  {config.customFields.map((field, idx) => (
                    <div key={idx} className="p-3 bg-gray-800 rounded border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${field.type === 'entity' ? 'bg-green-600/30 text-green-400' : field.type === 'template' ? 'bg-purple-600/30 text-purple-400' : 'bg-blue-600/30 text-blue-400'}`}>
                            {field.type === 'entity' ? 'Entity' : field.type === 'template' ? 'Template' : 'Custom'}
                          </span>
                          <span className="text-xs font-bold text-gray-400">{field.name}</span>
                        </div>
                        <button
                          onClick={() => update('customFields', config.customFields.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <ControlInput label="Field Name" value={field.name} onChange={(v) => {
                            const updated = [...config.customFields];
                            updated[idx] = { ...field, name: v };
                            update('customFields', updated);
                          }} placeholder="field1" />
                          <ControlInput 
                            label="Type" 
                            type="select" 
                            value={field.type} 
                            options={[
                              { value: 'entity', label: 'Entity State' },
                              { value: 'template', label: 'Template' },
                              { value: 'text', label: 'Static Text' },
                            ]}
                            onChange={(v) => {
                              const updated = [...config.customFields];
                              updated[idx] = { ...field, type: v as 'text' | 'template' | 'entity' };
                              update('customFields', updated);
                            }} 
                          />
                        </div>
                        
                        {/* Entity Type Fields */}
                        {field.type === 'entity' && (
                          <>
                            <EntitySelector 
                              label="Entity" 
                              value={field.entity || ''} 
                              onChange={(v) => {
                                const updated = [...config.customFields];
                                updated[idx] = { ...field, entity: v, attribute: '' };
                                update('customFields', updated);
                              }}
                              allowAll={true}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              {customFieldAttributes[idx]?.length > 0 ? (
                                <ControlInput 
                                  type="select"
                                  label="Attribute (optional)" 
                                  value={field.attribute || ''} 
                                  options={[
                                    { value: '', label: '-- Entity State --' },
                                    ...customFieldAttributes[idx].map(attr => ({ value: attr, label: attr }))
                                  ]}
                                  onChange={(v) => {
                                    const updated = [...config.customFields];
                                    updated[idx] = { ...field, attribute: v };
                                    update('customFields', updated);
                                  }}
                                />
                              ) : (
                                <ControlInput 
                                  label="Attribute (optional)" 
                                  value={field.attribute || ''} 
                                  onChange={(v) => {
                                    const updated = [...config.customFields];
                                    updated[idx] = { ...field, attribute: v };
                                    update('customFields', updated);
                                  }} 
                                  placeholder="temperature, battery..." 
                                />
                              )}
                              <ControlInput label="Icon (optional)" value={field.icon || ''} onChange={(v) => {
                                const updated = [...config.customFields];
                                updated[idx] = { ...field, icon: v };
                                update('customFields', updated);
                              }} placeholder="mdi:thermometer" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <ControlInput label="Prefix" value={field.prefix || ''} onChange={(v) => {
                                const updated = [...config.customFields];
                                updated[idx] = { ...field, prefix: v };
                                update('customFields', updated);
                              }} placeholder="CPU: " />
                              <ControlInput label="Suffix" value={field.suffix || ''} onChange={(v) => {
                                const updated = [...config.customFields];
                                updated[idx] = { ...field, suffix: v };
                                update('customFields', updated);
                              }} placeholder="%" />
                            </div>
                          </>
                        )}
                        
                        {/* Template/Text Fields */}
                        {(field.type === 'template' || field.type === 'text') && (
                          <ControlInput label="Value/Template" value={field.value} onChange={(v) => {
                            const updated = [...config.customFields];
                            updated[idx] = { ...field, value: v };
                            update('customFields', updated);
                          }} placeholder={field.type === 'template' ? "[[[ return entity.state ]]]" : "Static text"} />
                        )}
                        
                        {config.customGridEnabled && (
                          <ControlInput label="Grid Area" value={field.gridArea || ''} onChange={(v) => {
                            const updated = [...config.customFields];
                            updated[idx] = { ...field, gridArea: v };
                            update('customFields', updated);
                          }} placeholder={field.name} />
                        )}
                        
                        <ControlInput label="Styles (CSS)" value={field.styles || ''} onChange={(v) => {
                          const updated = [...config.customFields];
                          updated[idx] = { ...field, styles: v };
                          update('customFields', updated);
                        }} placeholder="font-size: 12px; color: #fff" />
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
              <ControlInput label="Haptic Feedback" type="select" value={config.hapticFeedback} options={HAPTIC_TYPE_OPTIONS} onChange={(v) => update('hapticFeedback', v)} />
              <ControlInput type="checkbox" label="Disable Keyboard" value={config.disableKeyboard} onChange={(v) => update('disableKeyboard', v)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ControlInput type="checkbox" label="Group Expand" value={config.groupExpand} onChange={(v) => update('groupExpand', v)} />
              <ControlInput type="checkbox" label="Hidden" value={config.hidden} onChange={(v) => update('hidden', v)} />
            </div>
            
            {config.spin && (
              <ControlInput label="Spin Duration" value={config.spinDuration} onChange={(v) => update('spinDuration', v)} suffix="s" />
            )}
            
            {config.spinner && (
              <ControlInput label="Spinner Template" value={config.spinnerTemplate} onChange={(v) => update('spinnerTemplate', v)} placeholder="[[[ return entity.state === 'on' ]]]" />
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
            
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Conditional Display</p>
            <p className="text-[10px] text-gray-500 mb-3">Show/hide this button based on an entity's state</p>
            <EntitySelector
              value={config.conditionalEntity}
              onChange={(v) => update('conditionalEntity', v)}
              label="Entity"
            />
            {config.conditionalEntity && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <ControlInput type="select" label="Operator" value={config.conditionalOperator} options={CONDITIONAL_OPERATORS} onChange={(v) => update('conditionalOperator', v)} />
                <ControlInput label="State Value" value={config.conditionalState} onChange={(v) => update('conditionalState', v)} placeholder="on, off, 50, etc." />
              </div>
            )}
            
            <div className="h-px bg-gray-700/50" />
            
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Extra Styles (Raw CSS)</p>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Card/General Styles</label>
              <textarea
                value={config.extraStyles}
                onChange={(e) => update('extraStyles', e.target.value)}
                placeholder="card:\n  - background: linear-gradient(...)\nicon:\n  - transform: rotate(45deg)"
                className={`w-full h-24 bg-gray-800 border rounded px-3 py-2 text-xs text-white font-mono focus:outline-none resize-none ${
                  cssValidation?.errors.length ? 'border-red-500/50 focus:border-red-500' : 
                  cssValidation?.warnings.length ? 'border-yellow-500/50 focus:border-yellow-500' : 
                  'border-gray-700 focus:border-blue-500'
                }`}
              />
              {cssValidation && (
                <div className={`mt-2 p-2 rounded text-[10px] ${
                  cssValidation.errors.length ? 'bg-red-900/20 border border-red-800 text-red-400' : 
                  'bg-yellow-900/20 border border-yellow-800 text-yellow-400'
                }`}>
                  <div className="flex items-start gap-1.5">
                    <AlertCircle size={12} className="shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      {cssValidation.errors.map((err, i) => (
                        <div key={`err-${i}`}>Line {err.line}: {err.message}</div>
                      ))}
                      {cssValidation.warnings.map((warn, i) => (
                        <div key={`warn-${i}`}>Line {warn.line}: {warn.message}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Img Cell Styles</label>
              <textarea
                value={config.imgCellStyles}
                onChange={(e) => update('imgCellStyles', e.target.value)}
                placeholder="- border-radius: 50%"
                className="w-full h-16 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
            </>
          )}
          
          <div className="h-10"></div>
        </div>
      )}
      
      {/* Grid Designer Modal */}
      {showGridDesigner && (
        <GridDesigner
          gridTemplateAreas={config.customGridTemplateAreas}
          gridTemplateColumns={config.customGridTemplateColumns}
          gridTemplateRows={config.customGridTemplateRows}
          existingCustomFields={config.customFields}
          onUpdate={(areas, columns, rows, customFields) => {
            update('customGridTemplateAreas', areas);
            update('customGridTemplateColumns', columns);
            update('customGridTemplateRows', rows);
            if (customFields) {
              // Merge new custom fields with existing ones (preserving non-grid fields)
              const existingNonGridFields = config.customFields.filter(
                f => !customFields.some(cf => cf.name === f.name)
              );
              update('customFields', [...existingNonGridFields, ...customFields]);
            }
          }}
          onClose={() => setShowGridDesigner(false)}
        />
      )}
    </div>
  );
};
