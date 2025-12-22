// Bubble Card Builder - Main App Component
// Modeled after ButtonCardApp.tsx structure

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  BubbleButtonConfig, 
  BubbleConfig, 
  BubblePreset, 
  BubbleCardType,
  BubbleSeparatorConfig,
  BubblePopUpConfig,
  BubbleCoverConfig,
  BubbleMediaPlayerConfig,
  BubbleClimateConfig,
  BubbleSelectConfig,
  BubbleCalendarConfig,
  BubbleHorizontalButtonsStackConfig,
  BubbleEmptyColumnConfig,
} from './types';
import { 
  DEFAULT_BUBBLE_BUTTON_CONFIG, 
  BUBBLE_STORAGE_KEY,
  CARD_TYPE_OPTIONS,
} from './constants';
import { generateBubbleYaml } from './utils/yamlGenerator';
import { validateBubbleCard, ValidationWarning } from './utils/validation';
import { BUBBLE_PRESETS } from './presets';
import { BubbleConfigPanel } from './components/ConfigPanel';
import { BubblePreview } from './components/Preview';
import { BubbleYamlViewer } from './components/YamlViewer';
import { Wand2, Eye, RotateCcw, Upload, Settings, Code, Menu, X, Sparkles, Copy, Check, AlertCircle, AlertTriangle, Info, Undo2, Redo2 } from 'lucide-react';

// ============================================
// DEFAULT CONFIGS FOR EACH CARD TYPE
// ============================================

const DEFAULT_SEPARATOR_CONFIG: BubbleSeparatorConfig = {
  card_type: 'separator',
  name: '',
  icon: '',
  card_layout: 'normal',
  rows: 1,
  grid_options: {
    rows: 2,
    columns: 3,
  },
  sub_button: [],
  modules: [],
  styles: '',
};

const DEFAULT_POPUP_CONFIG: BubblePopUpConfig = {
  card_type: 'pop-up',
  hash: '#room',
  name: '',
  icon: '',
  entity: '',
  auto_close: undefined,
  close_on_click: false,
  close_by_clicking_outside: true,
  width_desktop: '540px',
  margin: '7px',
  margin_top_mobile: '0px',
  margin_top_desktop: '0px',
  bg_color: '',
  bg_opacity: 85,
  bg_blur: 14,
  shadow_opacity: 0,
  hide_backdrop: false,
  background_update: false,
  show_header: false,
  trigger_entity: '',
  trigger_state: '',
  trigger_close: false,
  styles: '',
  modules: [],
};

const DEFAULT_COVER_CONFIG: BubbleCoverConfig = {
  card_type: 'cover',
  entity: '',
  name: '',
  force_icon: false,
  show_name: true,
  show_icon: true,
  show_state: false,
  show_last_changed: false,
  show_last_updated: false,
  show_attribute: false,
  attribute: '',
  scrolling_effect: true,
  icon_open: '',
  icon_close: '',
  icon_up: '',
  icon_down: '',
  open_service: '',
  stop_service: '',
  close_service: '',
  card_layout: 'normal',
  rows: 1,
  grid_options: {
    rows: 2,
    columns: 3,
  },
  sub_button: [],
  modules: [],
  styles: '',
};

const DEFAULT_MEDIA_PLAYER_CONFIG: BubbleMediaPlayerConfig = {
  card_type: 'media-player',
  entity: '',
  name: '',
  icon: '',
  force_icon: false,
  show_name: true,
  show_icon: true,
  show_state: false,
  show_last_changed: false,
  show_last_updated: false,
  show_attribute: false,
  attribute: '',
  scrolling_effect: true,
  min_volume: 0,
  max_volume: 100,
  cover_background: true,
  columns: 1,
  hide: {
    play_pause_button: false,
    volume_button: false,
    previous_button: false,
    next_button: false,
    power_button: false,
  },
  card_layout: 'normal',
  rows: 1,
  grid_options: {
    rows: 2,
    columns: 3,
  },
  sub_button: [],
  modules: [],
  styles: '',
};

const DEFAULT_CLIMATE_CONFIG: BubbleClimateConfig = {
  card_type: 'climate',
  entity: '',
  name: '',
  icon: '',
  force_icon: false,
  show_name: true,
  show_icon: true,
  show_state: false,
  hide_target_temp_low: false,
  hide_target_temp_high: false,
  state_color: true,
  step: 0.5,
  min_temp: 16,
  max_temp: 30,
  card_layout: 'normal',
  rows: 1,
  grid_options: {
    rows: 2,
    columns: 3,
  },
  sub_button: [],
  modules: [],
  styles: '',
};

const DEFAULT_SELECT_CONFIG: BubbleSelectConfig = {
  card_type: 'select',
  entity: '',
  name: '',
  icon: '',
  force_icon: false,
  show_name: true,
  show_icon: true,
  show_state: false,
  show_last_changed: false,
  show_last_updated: false,
  show_attribute: false,
  attribute: '',
  scrolling_effect: true,
  card_layout: 'normal',
  rows: 1,
  grid_options: {
    rows: 2,
    columns: 3,
  },
  sub_button: [],
  modules: [],
  styles: '',
};

const DEFAULT_CALENDAR_CONFIG: BubbleCalendarConfig = {
  card_type: 'calendar',
  entities: [],
  days: 7,
  limit: 5,
  show_end: true,
  show_progress: true,
  scrolling_effect: true,
  card_layout: 'normal',
  rows: 1,
  grid_options: {
    rows: 2,
    columns: 3,
  },
  sub_button: [],
  modules: [],
  styles: '',
};

const DEFAULT_HORIZONTAL_BUTTONS_CONFIG: BubbleHorizontalButtonsStackConfig = {
  card_type: 'horizontal-buttons-stack',
  buttons: [],
  auto_order: false,
  margin: '7px',
  width_desktop: '540px',
  is_sidebar_hidden: false,
  rise_animation: true,
  highlight_current_view: false,
  hide_gradient: false,
  styles: '',
  modules: [],
};

const DEFAULT_EMPTY_COLUMN_CONFIG: BubbleEmptyColumnConfig = {
  card_type: 'empty-column',
  modules: [],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getDefaultConfigForType(cardType: BubbleCardType): BubbleConfig {
  switch (cardType) {
    case 'button': return { ...DEFAULT_BUBBLE_BUTTON_CONFIG };
    case 'separator': return { ...DEFAULT_SEPARATOR_CONFIG };
    case 'pop-up': return { ...DEFAULT_POPUP_CONFIG };
    case 'cover': return { ...DEFAULT_COVER_CONFIG };
    case 'media-player': return { ...DEFAULT_MEDIA_PLAYER_CONFIG };
    case 'climate': return { ...DEFAULT_CLIMATE_CONFIG };
    case 'select': return { ...DEFAULT_SELECT_CONFIG };
    case 'calendar': return { ...DEFAULT_CALENDAR_CONFIG };
    case 'horizontal-buttons-stack': return { ...DEFAULT_HORIZONTAL_BUTTONS_CONFIG };
    case 'empty-column': return { ...DEFAULT_EMPTY_COLUMN_CONFIG };
    default: return { ...DEFAULT_BUBBLE_BUTTON_CONFIG };
  }
}

function loadSavedConfig(): BubbleConfig {
  try {
    const saved = localStorage.getItem(BUBBLE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const cardType = parsed.card_type || 'button';
      const defaults = getDefaultConfigForType(cardType);
      return { ...defaults, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load saved Bubble config:', e);
  }
  return DEFAULT_BUBBLE_BUTTON_CONFIG;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function BubbleCardApp() {
  // Core state
  const [config, setConfigInternal] = useState<BubbleConfig>(loadSavedConfig);
  const [activePreset, setActivePreset] = useState<BubblePreset | null>(null);
  const [simulatedState, setSimulatedState] = useState<'on' | 'off'>('on');
  
  // UI state
  const [mobileTab, setMobileTab] = useState<'preview' | 'config' | 'yaml'>('preview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importYaml, setImportYaml] = useState('');
  const [importError, setImportError] = useState('');
  
  // Preset filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCardType, setSelectedCardType] = useState<BubbleCardType | 'all'>('all');
  const [presetSearch, setPresetSearch] = useState('');
  
  // Undo/Redo history
  const [historyPast, setHistoryPast] = useState<BubbleConfig[]>([]);
  const [historyFuture, setHistoryFuture] = useState<BubbleConfig[]>([]);
  const historyDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedConfigRef = useRef<BubbleConfig>(loadSavedConfig());
  const isUndoRedoRef = useRef(false);
  const MAX_HISTORY = 50;

  const canUndo = historyPast.length > 0;
  const canRedo = historyFuture.length > 0;

  const handleUndo = useCallback(() => {
    if (historyPast.length === 0) return;
    
    isUndoRedoRef.current = true;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast(prev => prev.slice(0, -1));
    setHistoryFuture(prev => [config, ...prev].slice(0, MAX_HISTORY));
    setConfigInternal(previous);
    lastSavedConfigRef.current = previous;
    
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  }, [historyPast, config]);

  const handleRedo = useCallback(() => {
    if (historyFuture.length === 0) return;
    
    isUndoRedoRef.current = true;
    const next = historyFuture[0];
    setHistoryFuture(prev => prev.slice(1));
    setHistoryPast(prev => [...prev, config].slice(-MAX_HISTORY));
    setConfigInternal(next);
    lastSavedConfigRef.current = next;
    
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  }, [historyFuture, config]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);
  
  // Ref to track preset application
  const isApplyingPresetRef = useRef(false);
  
  // Wrapped setConfig that clears preset when user modifies config
  const setConfig: React.Dispatch<React.SetStateAction<BubbleConfig>> = (action) => {
    if (!isApplyingPresetRef.current && activePreset) {
      setActivePreset(null);
    }
    
    setConfigInternal(prev => {
      const result = typeof action === 'function' ? action(prev) : action;
      
      // History tracking (debounced)
      if (!isUndoRedoRef.current) {
        if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
        historyDebounceRef.current = setTimeout(() => {
          if (JSON.stringify(result) !== JSON.stringify(lastSavedConfigRef.current)) {
            setHistoryPast(p => [...p, lastSavedConfigRef.current].slice(-MAX_HISTORY));
            setHistoryFuture([]);
            lastSavedConfigRef.current = result;
          }
        }, 500);
      }
      
      return result;
    });
  };

  // Generate YAML output
  const yamlOutput = useMemo(() => generateBubbleYaml(config), [config]);
  
  // Validate current config
  const validationWarnings = useMemo(() => validateBubbleCard(config), [config]);
  const errors = validationWarnings.filter(w => w.severity === 'error');
  const warnings = validationWarnings.filter(w => w.severity === 'warning');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BUBBLE_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save Bubble config:', e);
    }
  }, [config]);

  // Filter presets
  const filteredPresets = useMemo(() => {
    return BUBBLE_PRESETS.filter(preset => {
      const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
      const matchesCardType = selectedCardType === 'all' || preset.cardType === selectedCardType;
      const matchesSearch = !presetSearch || 
        preset.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
        preset.description.toLowerCase().includes(presetSearch.toLowerCase());
      return matchesCategory && matchesCardType && matchesSearch;
    });
  }, [selectedCategory, selectedCardType, presetSearch]);

  // Handle card type change
  const handleCardTypeChange = (newType: BubbleCardType) => {
    // Preserve common fields when switching types
    const commonFields = {
      entity: (config as any).entity || '',
      name: (config as any).name || '',
      icon: (config as any).icon || '',
    };
    
    const newDefaults = getDefaultConfigForType(newType);
    setConfig({ ...newDefaults, ...commonFields });
    setActivePreset(null);
  };

  // Apply preset
  const handleApplyPreset = (preset: BubblePreset) => {
    isApplyingPresetRef.current = true;
    
    const defaults = getDefaultConfigForType(preset.cardType);
    const currentEntity = (config as any).entity || '';
    
    setConfigInternal({
      ...defaults,
      entity: currentEntity,
      ...preset.config,
    } as BubbleConfig);
    
    setActivePreset(preset);
    isApplyingPresetRef.current = false;
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      setConfigInternal(DEFAULT_BUBBLE_BUTTON_CONFIG);
      setActivePreset(null);
      localStorage.removeItem(BUBBLE_STORAGE_KEY);
    }
  };
  
  // Duplicate current card
  const handleDuplicate = () => {
    const duplicated = JSON.parse(JSON.stringify(config));
    if (duplicated.name) {
      duplicated.name = `${duplicated.name} (Copy)`;
    }
    setConfigInternal(duplicated);
    setActivePreset(null);
  };

  // Update config helper (for ConfigPanel)
  const updateConfig = <K extends keyof BubbleConfig>(key: K, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Import YAML
  const handleImportYaml = () => {
    setImportError('');
    try {
      // Basic YAML parsing - we'll enhance this later
      // For now just check if it looks like bubble-card YAML
      if (!importYaml.includes('bubble-card') && !importYaml.includes('card_type')) {
        setImportError('This doesn\'t look like Bubble Card YAML. Make sure it includes card_type.');
        return;
      }
      
      // TODO: Implement proper YAML parsing
      setImportError('YAML import coming soon! For now, use the visual builder.');
    } catch (e: any) {
      setImportError(`Failed to parse YAML: ${e.message}`);
    }
  };

  const currentCardType = config.card_type;

  return (
    <div className="flex flex-col h-full bg-black text-white font-sans overflow-hidden selection:bg-cyan-500/30">
      {/* Header - Responsive */}
      <header className="h-12 md:h-14 border-b border-gray-800 flex items-center justify-between px-3 md:px-6 bg-gray-900/50 backdrop-blur-md shrink-0 relative z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border border-cyan-500/30">
            <span className="text-sm md:text-base">🫧</span>
          </div>
          <h1 className="font-bold text-sm md:text-lg tracking-tight text-gray-200">Bubble Card Builder</h1>
        </div>
        
        {/* Active Preset Badge */}
        {activePreset && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-cyan-600/20 border border-cyan-500/30 rounded-full">
            <Sparkles size={12} className="text-cyan-400" />
            <span className="text-xs text-cyan-300">{activePreset.name}</span>
          </div>
        )}
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Undo/Redo Buttons */}
          <div className="flex items-center border border-gray-700 rounded-full overflow-hidden">
            <button 
              onClick={handleUndo}
              disabled={!canUndo}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <div className="w-px h-5 bg-gray-700" />
            <button 
              onClick={handleRedo}
              disabled={!canRedo}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={14} />
            </button>
          </div>
          <button 
            onClick={() => setShowPresets(!showPresets)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-sm font-medium transition-all ${
              showPresets 
                ? 'bg-cyan-600 border-cyan-500 text-white' 
                : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300'
            }`}
          >
            <Sparkles size={14} />
            Presets
          </button>
          <button 
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all"
            title="Import existing YAML"
          >
            <Upload size={14} />
            Import
          </button>
          <button 
            onClick={handleDuplicate}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all"
            title="Duplicate current card"
          >
            <Copy size={14} />
            Duplicate
          </button>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all"
            title="Reset to defaults"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-12 left-0 right-0 bg-gray-900 border-b border-gray-800 z-40 p-3 space-y-2 animate-in slide-in-from-top-2">
          <button 
            onClick={() => { setShowPresets(true); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-left"
          >
            <Sparkles size={18} className="text-cyan-400" />
            <span>Browse Presets</span>
          </button>
          <button 
            onClick={() => { setIsImportOpen(true); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg text-left"
          >
            <Upload size={18} className="text-blue-400" />
            <span>Import YAML</span>
          </button>
          <button 
            onClick={() => { handleReset(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg text-left"
          >
            <RotateCcw size={18} className="text-gray-400" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      )}

      {/* Main Content - Desktop */}
      <main className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Configuration */}
        <aside className="w-80 shrink-0 shadow-xl bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden" style={{ contain: 'strict' }}>
          {/* Card Type Selector */}
          <div className="p-4 border-b border-gray-800 shrink-0">
            <label className="text-xs text-gray-400 font-medium mb-2 block">Card Type</label>
            <select
              value={currentCardType}
              onChange={(e) => handleCardTypeChange(e.target.value as BubbleCardType)}
              className="w-full bg-gray-800 text-white text-sm px-3 py-2.5 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              {CARD_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <p className="text-[10px] text-gray-500 mt-1.5">
              {CARD_TYPE_OPTIONS.find(o => o.value === currentCardType)?.description}
            </p>
          </div>
          
          {/* Config Panel */}
          <div className="flex-1 overflow-y-auto" style={{ contain: 'layout paint' }}>
            <BubbleConfigPanel 
              config={config as BubbleButtonConfig} 
              updateConfig={updateConfig}
              setConfig={setConfig as React.Dispatch<React.SetStateAction<BubbleButtonConfig>>}
            />
          </div>
        </aside>

        {/* Center: Workspace */}
        <section className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex-1 min-h-0 flex">
            {/* Middle: Preview Canvas */}
            <div className="flex-1 bg-[#0a0a0a] relative flex flex-col min-h-0">
              <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
              <div className="relative z-0 px-6 py-3 flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider border-b border-gray-800/50 bg-black/30 backdrop-blur-sm">
                <Eye size={14} />
                Live Preview
                <span className="ml-auto text-cyan-400/60 normal-case">
                  {currentCardType}
                </span>
              </div>
              <div className="flex-1 relative overflow-auto z-0 w-full min-h-0 min-w-0 flex items-center justify-center p-8">
                <BubblePreview 
                  config={config} 
                  simulatedState={simulatedState}
                  onSimulatedStateChange={setSimulatedState}
                />
              </div>
            </div>

            {/* Right: YAML Output or Presets */}
            <div className="w-96 border-l border-gray-800 bg-[#111] flex flex-col shrink-0 min-h-0">
              {/* Tabs */}
              <div className="flex border-b border-gray-800 shrink-0">
                <button
                  onClick={() => setShowPresets(false)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    !showPresets 
                      ? 'bg-gray-800 text-white border-b-2 border-cyan-500' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code size={14} />
                  YAML
                </button>
                <button
                  onClick={() => setShowPresets(true)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    showPresets 
                      ? 'bg-gray-800 text-white border-b-2 border-cyan-500' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={14} />
                  Presets ({BUBBLE_PRESETS.length})
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {showPresets ? (
                  <div className="h-full flex flex-col">
                    {/* Preset Filters */}
                    <div className="p-3 border-b border-gray-800 space-y-2 shrink-0">
                      <input
                        type="text"
                        placeholder="Search presets..."
                        value={presetSearch}
                        onChange={(e) => setPresetSearch(e.target.value)}
                        className="w-full bg-gray-900 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="flex-1 bg-gray-900 text-white text-sm px-2 py-1.5 rounded border border-gray-700 focus:border-cyan-500"
                        >
                          <option value="all">All Categories</option>
                          <option value="basic">Basic</option>
                          <option value="slider">Sliders</option>
                          <option value="state">State Display</option>
                          <option value="sub-buttons">Sub-buttons</option>
                          <option value="media">Media</option>
                          <option value="climate">Climate</option>
                          <option value="cover">Cover</option>
                          <option value="custom">Custom Styles</option>
                        </select>
                        <select
                          value={selectedCardType}
                          onChange={(e) => setSelectedCardType(e.target.value as BubbleCardType | 'all')}
                          className="flex-1 bg-gray-900 text-white text-sm px-2 py-1.5 rounded border border-gray-700 focus:border-cyan-500"
                        >
                          <option value="all">All Types</option>
                          {CARD_TYPE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Preset List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {filteredPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handleApplyPreset(preset)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            activePreset?.name === preset.name
                              ? 'bg-cyan-600/20 border-cyan-500/50 ring-1 ring-cyan-500/30'
                              : 'bg-gray-900 hover:bg-gray-800 border-gray-700'
                          } border`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{preset.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 uppercase tracking-wide">
                              {preset.cardType}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
                        </button>
                      ))}
                      {filteredPresets.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No presets match your filters</p>
                          <button 
                            onClick={() => { setSelectedCategory('all'); setSelectedCardType('all'); setPresetSearch(''); }}
                            className="mt-2 text-sm text-cyan-400 hover:underline"
                          >
                            Clear filters
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col p-4">
                    <BubbleYamlViewer yaml={yamlOutput} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Main Content - Mobile */}
      <main className="md:hidden flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileTab === 'preview' && (
            <div className="h-full bg-[#0a0a0a] relative flex flex-col">
              <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
              <div className="flex-1 relative overflow-hidden z-0 flex items-center justify-center p-4">
                <BubblePreview 
                  config={config} 
                  simulatedState={simulatedState}
                  onSimulatedStateChange={setSimulatedState}
                />
              </div>
            </div>
          )}
          
          {mobileTab === 'config' && (
            <div className="h-full overflow-y-auto bg-gray-900">
              {/* Mobile Card Type Selector */}
              <div className="p-4 border-b border-gray-800">
                <label className="text-xs text-gray-400 font-medium mb-2 block">Card Type</label>
                <select
                  value={currentCardType}
                  onChange={(e) => handleCardTypeChange(e.target.value as BubbleCardType)}
                  className="w-full bg-gray-800 text-white text-sm px-3 py-2.5 rounded-lg border border-gray-600"
                >
                  {CARD_TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              
              <BubbleConfigPanel 
                config={config as BubbleButtonConfig} 
                updateConfig={updateConfig}
                setConfig={setConfig as React.Dispatch<React.SetStateAction<BubbleButtonConfig>>}
              />
            </div>
          )}
          
          {mobileTab === 'yaml' && (
            <div className="h-full overflow-hidden bg-[#111] p-3">
              <BubbleYamlViewer yaml={yamlOutput} />
            </div>
          )}
        </div>

        {/* Mobile Tab Bar */}
        <nav className="shrink-0 border-t border-gray-800 bg-gray-900 flex">
          <button 
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'preview' ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-500'
            }`}
          >
            <Eye size={20} />
            <span className="text-[10px] font-medium">Preview</span>
          </button>
          <button 
            onClick={() => setMobileTab('config')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'config' ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-500'
            }`}
          >
            <Settings size={20} />
            <span className="text-[10px] font-medium">Configure</span>
          </button>
          <button 
            onClick={() => setMobileTab('yaml')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'yaml' ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-500'
            }`}
          >
            <Code size={20} />
            <span className="text-[10px] font-medium">YAML</span>
          </button>
        </nav>
      </main>

      {/* Import YAML Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Upload size={20} className="text-cyan-400" />
                Import YAML
              </h3>
              <button onClick={() => { setIsImportOpen(false); setImportError(''); }} className="text-gray-400 hover:text-white text-2xl">
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-300 text-sm">
                Paste your existing bubble-card YAML configuration below to import settings.
              </p>
              
              <textarea
                value={importYaml}
                onChange={(e) => setImportYaml(e.target.value)}
                placeholder="type: custom:bubble-card&#10;card_type: button&#10;entity: light.living_room&#10;name: Living Room..."
                className="w-full h-48 bg-black/50 border border-gray-700 rounded-lg p-4 text-white font-mono text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none placeholder-gray-600"
              />
              
              {importError && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                  <p className="text-red-400 text-xs">{importError}</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-800/50 flex justify-end gap-3">
              <button 
                onClick={() => { setIsImportOpen(false); setImportError(''); }}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleImportYaml}
                disabled={!importYaml.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Upload size={16} />
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BubbleCardApp;
