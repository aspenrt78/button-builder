import React, { useState, useMemo } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { PreviewCard } from './components/PreviewCard';
import { YamlViewer } from './components/YamlViewer';
import { MagicBuilder } from './components/MagicBuilder';
import { ButtonConfig, DEFAULT_CONFIG } from './types';
import { generateYaml } from './utils/yamlGenerator';
import { PRESETS, Preset } from './presets';
import { Wand2, Eye, RotateCcw, Upload, Palette, ChevronDown } from 'lucide-react';
import logo from './logo.png';

const App: React.FC = () => {
  const [config, setConfig] = useState<ButtonConfig>(DEFAULT_CONFIG);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [importYaml, setImportYaml] = useState('');
  const [importError, setImportError] = useState('');

  const yamlOutput = useMemo(() => generateYaml(config), [config]);

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      setConfig(DEFAULT_CONFIG);
    }
  };

  const handleApplyPreset = (preset: Preset) => {
    setConfig(prev => ({ ...prev, ...preset.config }));
    setIsPresetsOpen(false);
  };

  const handleImportYaml = () => {
    setImportError('');
    try {
      // Basic YAML parser for button-card config
      const lines = importYaml.split('\n');
      const imported: Partial<ButtonConfig> = {};
      
      for (const line of lines) {
        const match = line.match(/^(\s*)([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*)$/);
        if (match) {
          const [, , key, value] = match;
          const cleanValue = value.trim().replace(/^["']|["']$/g, '');
          
          // Map YAML keys to config keys
          const keyMap: Record<string, keyof ButtonConfig> = {
            'entity': 'entity',
            'name': 'name',
            'icon': 'icon',
            'label': 'label',
            'show_name': 'showName',
            'show_icon': 'showIcon',
            'show_state': 'showState',
            'show_label': 'showLabel',
            'show_entity_picture': 'showEntityPicture',
            'show_last_changed': 'showLastChanged',
            'size': 'size',
            'layout': 'layout',
            'color_type': 'colorType',
            'aspect_ratio': 'aspectRatio',
          };
          
          const configKey = keyMap[key];
          if (configKey) {
            // Handle booleans
            if (cleanValue === 'true') (imported as any)[configKey] = true;
            else if (cleanValue === 'false') (imported as any)[configKey] = false;
            // Handle numbers
            else if (!isNaN(Number(cleanValue)) && cleanValue !== '') (imported as any)[configKey] = Number(cleanValue);
            // Handle strings
            else (imported as any)[configKey] = cleanValue;
          }
        }
      }
      
      if (Object.keys(imported).length === 0) {
        setImportError('No valid configuration found. Make sure it\'s valid button-card YAML.');
        return;
      }
      
      setConfig(prev => ({ ...prev, ...imported }));
      setIsImportOpen(false);
      setImportYaml('');
    } catch (e) {
      setImportError('Failed to parse YAML. Please check the format.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden selection:bg-blue-500/30">
      {/* Header */}
      <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Button Builder logo"
            className="w-9 h-9 rounded-lg object-contain border border-gray-800 bg-black/40"
          />
          <h1 className="font-bold text-lg tracking-tight text-gray-200">Button Builder</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsPresetsOpen(!isPresetsOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all"
              title="Style Presets"
            >
              <Palette size={14} />
              Presets
              <ChevronDown size={12} />
            </button>
            {isPresetsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsPresetsOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
                  {['minimal', 'glass', 'neon', 'animated', 'custom'].map(category => (
                    <div key={category}>
                      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-800/50 sticky top-0">
                        {category}
                      </div>
                      {PRESETS.filter(p => p.category === category).map(preset => (
                        <button
                          key={preset.name}
                          onClick={() => handleApplyPreset(preset)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-800 transition-colors border-b border-gray-800/50 last:border-b-0"
                        >
                          <div className="text-sm text-white font-medium">{preset.name}</div>
                          <div className="text-xs text-gray-500">{preset.description}</div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
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
      </header>

      <main className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left: Configuration */}
        <aside className="w-80 shrink-0 z-20 shadow-xl bg-gray-900 border-r border-gray-800">
          <ConfigPanel config={config} setConfig={setConfig} />
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
               {/* Simplified container to ensure full height scrolling */}
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col p-4">
                <YamlViewer yaml={yamlOutput} className="flex-1" />
              </div>
            </div>
          </div>
        </section>
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