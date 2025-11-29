import React, { useState, useMemo, useEffect } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { PreviewCard } from './components/PreviewCard';
import { YamlViewer } from './components/YamlViewer';
import { MagicBuilder } from './components/MagicBuilder';
import { ButtonConfig, DEFAULT_CONFIG, StateStyleConfig } from './types';
import { generateYaml } from './utils/yamlGenerator';
import { parseButtonCardYaml, validateImportedConfig } from './utils/yamlImporter';
import { PRESETS, Preset } from './presets';
import { Wand2, Eye, RotateCcw, Upload, Settings, Code, Menu, X, ToggleLeft, ToggleRight, Layers } from 'lucide-react';

export type PresetCondition = 'always' | 'on' | 'off';

export interface PresetState {
  preset: Preset | null;
  condition: PresetCondition;
  offStatePreset: Preset | null; // Used when condition is 'on' - what preset to use for off state
  onStatePreset: Preset | null;  // Used when condition is 'off' - what preset to use for on state
}
import logo from './logo.png';

const STORAGE_KEY = 'button-builder-config';

const loadSavedConfig = (): ButtonConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to handle any new fields added in updates
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load saved config:', e);
  }
  return DEFAULT_CONFIG;
};

const App: React.FC = () => {
  const [config, setConfigInternal] = useState<ButtonConfig>(loadSavedConfig);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importYaml, setImportYaml] = useState('');
  const [importError, setImportError] = useState('');
  const [mobileTab, setMobileTab] = useState<'preview' | 'config' | 'yaml'>('preview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const [presetCondition, setPresetCondition] = useState<PresetCondition>('always');
  const [offStatePreset, setOffStatePreset] = useState<Preset | null>(null);
  const [onStatePreset, setOnStatePreset] = useState<Preset | null>(null);
  const [isApplyingPreset, setIsApplyingPreset] = useState(false);
  
  // Wrapper for setConfig that clears the active preset when user makes changes
  const setConfig: React.Dispatch<React.SetStateAction<ButtonConfig>> = (action) => {
    if (!isApplyingPreset && activePreset) {
      setActivePreset(null);
    }
    setConfigInternal(action);
  };
  
  // Save config to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save config:', e);
    }
  }, [config]);

  // Build config with conditional preset state styles
  const configWithPresetConditions = useMemo(() => {
    if (presetCondition === 'always' || !activePreset) {
      return config;
    }
    
    // When preset has a condition, we need to generate state_styles
    const newConfig = { ...config };
    const newStateStyles = [...(config.stateStyles || [])];
    
    // Create a state style for the "other" state if a secondary preset is set
    if (presetCondition === 'on' && offStatePreset) {
      // Main preset applies when ON, offStatePreset applies when OFF
      const offStyle: StateStyleConfig = {
        id: `preset-off-${Date.now()}`,
        operator: 'equals',
        value: 'off',
        name: '',
        icon: offStatePreset.config.icon || '',
        color: offStatePreset.config.color || '',
        entityPicture: '',
        label: '',
        stateDisplay: '',
        spin: false,
        styles: offStatePreset.config.extraStyles || '',
        backgroundColor: offStatePreset.config.backgroundColor || '',
        iconColor: offStatePreset.config.iconColor || '',
        nameColor: offStatePreset.config.nameColor || '',
        labelColor: offStatePreset.config.labelColor || '',
        borderColor: offStatePreset.config.borderColor || '',
        cardAnimation: offStatePreset.config.cardAnimation || 'none',
        cardAnimationSpeed: offStatePreset.config.cardAnimationSpeed || '2s',
        iconAnimation: offStatePreset.config.iconAnimation || 'none',
        iconAnimationSpeed: offStatePreset.config.iconAnimationSpeed || '2s',
      };
      newStateStyles.push(offStyle);
    } else if (presetCondition === 'off' && onStatePreset) {
      // Main preset applies when OFF, onStatePreset applies when ON
      const onStyle: StateStyleConfig = {
        id: `preset-on-${Date.now()}`,
        operator: 'equals',
        value: 'on',
        name: '',
        icon: onStatePreset.config.icon || '',
        color: onStatePreset.config.color || '',
        entityPicture: '',
        label: '',
        stateDisplay: '',
        spin: false,
        styles: onStatePreset.config.extraStyles || '',
        backgroundColor: onStatePreset.config.backgroundColor || '',
        iconColor: onStatePreset.config.iconColor || '',
        nameColor: onStatePreset.config.nameColor || '',
        labelColor: onStatePreset.config.labelColor || '',
        borderColor: onStatePreset.config.borderColor || '',
        cardAnimation: onStatePreset.config.cardAnimation || 'none',
        cardAnimationSpeed: onStatePreset.config.cardAnimationSpeed || '2s',
        iconAnimation: onStatePreset.config.iconAnimation || 'none',
        iconAnimationSpeed: onStatePreset.config.iconAnimationSpeed || '2s',
      };
      newStateStyles.push(onStyle);
    }
    
    newConfig.stateStyles = newStateStyles;
    return newConfig;
  }, [config, presetCondition, activePreset, offStatePreset, onStatePreset]);

  const yamlOutput = useMemo(() => generateYaml(configWithPresetConditions), [configWithPresetConditions]);

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      setConfig(DEFAULT_CONFIG);
      setActivePreset(null);
      setPresetCondition('always');
      setOffStatePreset(null);
      setOnStatePreset(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleApplyPreset = (preset: Preset, forState?: 'on' | 'off') => {
    if (forState === 'off') {
      // Setting the off-state preset (when main preset is 'on' condition)
      setOffStatePreset(preset);
    } else if (forState === 'on') {
      // Setting the on-state preset (when main preset is 'off' condition)
      setOnStatePreset(preset);
    } else {
      // Setting the main preset
      // Reset all visual style properties to defaults, then apply preset
      // This prevents style bleed from previous presets
      const styleDefaults: Partial<ButtonConfig> = {
        backgroundColor: DEFAULT_CONFIG.backgroundColor,
        backgroundColorOpacity: DEFAULT_CONFIG.backgroundColorOpacity,
        color: DEFAULT_CONFIG.color,
        borderRadius: DEFAULT_CONFIG.borderRadius,
        borderWidth: DEFAULT_CONFIG.borderWidth,
        borderStyle: DEFAULT_CONFIG.borderStyle,
        borderColor: DEFAULT_CONFIG.borderColor,
        backdropBlur: DEFAULT_CONFIG.backdropBlur,
        shadowSize: DEFAULT_CONFIG.shadowSize,
        shadowColor: DEFAULT_CONFIG.shadowColor,
        shadowOpacity: DEFAULT_CONFIG.shadowOpacity,
        iconColor: DEFAULT_CONFIG.iconColor,
        iconColorAuto: DEFAULT_CONFIG.iconColorAuto,
        nameColor: DEFAULT_CONFIG.nameColor,
        stateColor: DEFAULT_CONFIG.stateColor,
        labelColor: DEFAULT_CONFIG.labelColor,
        gradientEnabled: DEFAULT_CONFIG.gradientEnabled,
        gradientType: DEFAULT_CONFIG.gradientType,
        gradientAngle: DEFAULT_CONFIG.gradientAngle,
        gradientColor1: DEFAULT_CONFIG.gradientColor1,
        gradientColor2: DEFAULT_CONFIG.gradientColor2,
        gradientColor3: DEFAULT_CONFIG.gradientColor3,
        gradientColor3Enabled: DEFAULT_CONFIG.gradientColor3Enabled,
        cardAnimation: DEFAULT_CONFIG.cardAnimation,
        cardAnimationTrigger: DEFAULT_CONFIG.cardAnimationTrigger,
        cardAnimationSpeed: DEFAULT_CONFIG.cardAnimationSpeed,
        extraStyles: '',
      };
      
      // Use flag to prevent clearing preset when applying it
      setIsApplyingPreset(true);
      setConfigInternal(prev => ({ ...prev, ...styleDefaults, ...preset.config }));
      setActivePreset(preset);
      setIsApplyingPreset(false);
      // Reset condition-based presets when changing main preset
      if (presetCondition === 'always') {
        setOffStatePreset(null);
        setOnStatePreset(null);
      }
    }
  };

  const handleResetToPreset = () => {
    if (activePreset) {
      setIsApplyingPreset(true);
      setConfigInternal(prev => ({ ...prev, ...activePreset.config }));
      setIsApplyingPreset(false);
    }
  };

  const handleImportYaml = () => {
    setImportError('');
    try {
      // Use proper YAML parser
      const imported = parseButtonCardYaml(importYaml);
      const validated = validateImportedConfig(imported);
      
      if (Object.keys(validated).length === 0) {
        setImportError('No valid configuration found. Make sure it\'s valid button-card YAML.');
        return;
      }
      
      setConfig(prev => ({ ...prev, ...validated }));
      setIsImportOpen(false);
      setImportYaml('');
    } catch (e: any) {
      console.error('YAML import error:', e);
      setImportError(`Failed to parse YAML: ${e.message || 'Please check the format.'}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden selection:bg-blue-500/30">
      {/* Header - Responsive */}
      <header className="h-12 md:h-14 border-b border-gray-800 flex items-center justify-between px-3 md:px-6 bg-gray-900/50 backdrop-blur-md shrink-0 relative z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src={logo}
            alt="Button Builder logo"
            className="w-7 h-7 md:w-9 md:h-9 rounded-lg object-contain border border-gray-800 bg-black/40"
          />
          <h1 className="font-bold text-sm md:text-lg tracking-tight text-gray-200">Button Builder</h1>
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all"
            title="Import existing YAML"
          >
            <Upload size={14} />
            Import
          </button>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all"
            title="Reset to defaults"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button 
            onClick={() => setIsMagicOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium transition-all group"
          >
            <Wand2 size={14} className="group-hover:rotate-12 transition-transform" />
            Magic Build
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
            onClick={() => { setIsMagicOpen(true); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-left"
          >
            <Wand2 size={18} className="text-indigo-400" />
            <span>Magic Build</span>
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
        <aside className="w-80 shrink-0 shadow-xl bg-gray-900 border-r border-gray-800">
          <ConfigPanel 
            config={config} 
            setConfig={setConfig} 
            activePreset={activePreset}
            onApplyPreset={handleApplyPreset}
            onResetToPreset={handleResetToPreset}
            presetCondition={presetCondition}
            onSetPresetCondition={setPresetCondition}
            offStatePreset={offStatePreset}
            onStatePreset={onStatePreset}
            onSetOffStatePreset={setOffStatePreset}
            onSetOnStatePreset={setOnStatePreset}
          />
        </aside>

        {/* Center: Workspace */}
        <section className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex-1 min-h-0 flex">
            {/* Middle: Preview Canvas */}
            <div className="flex-1 bg-[#0a0a0a] relative flex flex-col min-h-0">
              {/* Background grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />

              <div className="relative z-0 px-6 py-3 flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider border-b border-gray-800/50 bg-black/30 backdrop-blur-sm">
                <Eye size={14} />
                Live Preview
              </div>

              {/* Content Container - fills space, lets PreviewCard handle centering */}
              <div className="flex-1 relative overflow-hidden z-0 w-full h-full min-h-0 min-w-0">
                <PreviewCard config={config} />
              </div>
            </div>

            {/* Right: YAML Output */}
            <div className="w-96 border-l border-gray-800 bg-[#111] flex flex-col shrink-0 min-h-0">
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col p-4">
                <YamlViewer yaml={yamlOutput} config={config} className="flex-1" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Main Content - Mobile */}
      <main className="md:hidden flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Mobile Tab Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileTab === 'preview' && (
            <div className="h-full bg-[#0a0a0a] relative flex flex-col">
              <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
              <div className="flex-1 relative overflow-hidden z-0">
                <PreviewCard config={config} />
              </div>
            </div>
          )}
          
          {mobileTab === 'config' && (
            <div className="h-full overflow-y-auto bg-gray-900">
              <ConfigPanel 
                config={config} 
                setConfig={setConfig}
                activePreset={activePreset}
                onApplyPreset={handleApplyPreset}
                onResetToPreset={handleResetToPreset}
                presetCondition={presetCondition}
                onSetPresetCondition={setPresetCondition}
                offStatePreset={offStatePreset}
                onStatePreset={onStatePreset}
                onSetOffStatePreset={setOffStatePreset}
                onSetOnStatePreset={setOnStatePreset}
              />
            </div>
          )}
          
          {mobileTab === 'yaml' && (
            <div className="h-full overflow-hidden bg-[#111] p-3">
              <YamlViewer yaml={yamlOutput} config={config} className="h-full" />
            </div>
          )}
        </div>

        {/* Mobile Tab Bar */}
        <nav className="shrink-0 border-t border-gray-800 bg-gray-900 flex">
          <button 
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'preview' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500'
            }`}
          >
            <Eye size={20} />
            <span className="text-[10px] font-medium">Preview</span>
          </button>
          <button 
            onClick={() => setMobileTab('config')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'config' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500'
            }`}
          >
            <Settings size={20} />
            <span className="text-[10px] font-medium">Configure</span>
          </button>
          <button 
            onClick={() => setMobileTab('yaml')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'yaml' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500'
            }`}
          >
            <Code size={20} />
            <span className="text-[10px] font-medium">YAML</span>
          </button>
        </nav>
      </main>

      <MagicBuilder 
        isOpen={isMagicOpen} 
        onClose={() => setIsMagicOpen(false)}
        onApply={(newConfig) => setConfig(prev => ({ ...prev, ...newConfig }))}
      />

      {/* Import YAML Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Upload size={20} className="text-blue-400" />
                Import YAML
              </h3>
              <button onClick={() => { setIsImportOpen(false); setImportError(''); }} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-300 text-sm">
                Paste your existing button-card YAML configuration below to import settings.
              </p>
              
              <textarea
                value={importYaml}
                onChange={(e) => setImportYaml(e.target.value)}
                placeholder="type: custom:button-card&#10;entity: light.living_room&#10;name: Living Room&#10;icon: mdi:lightbulb..."
                className="w-full h-48 bg-black/50 border border-gray-700 rounded-lg p-4 text-white font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none placeholder-gray-600"
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
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
};

export default App;