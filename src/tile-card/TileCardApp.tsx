// Tile Card App - Main Component
// Tile card builder with features support

import React, { useState, useEffect, useRef } from 'react';
import { TileCardConfig, DEFAULT_TILE_CONFIG } from './types';
import { ConfigPanel } from './components/ConfigPanel';
import { Preview } from './components/Preview';
import { YamlViewer } from './components/YamlViewer';
import { generateTileCardYaml } from './utils/yamlGenerator';
import { Copy, Check, FileDown, FileUp } from 'lucide-react';
import { APP_VERSION_LABEL } from '../version';

const STORAGE_KEY = 'tile-card-config';

const loadSavedConfig = (): TileCardConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_TILE_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load saved tile card config:', e);
  }
  return { ...DEFAULT_TILE_CONFIG };
};

export const TileCardApp: React.FC = () => {
  const [config, setConfig] = useState<TileCardConfig>(loadSavedConfig);
  const [yamlCode, setYamlCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Save to localStorage whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save tile card config:', e);
    }
  }, [config]);

  // Generate YAML whenever config changes
  useEffect(() => {
    const yaml = generateTileCardYaml(config);
    setYamlCode(yaml);
  }, [config]);

  const copyText = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback below.
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  const handleCopy = async () => {
    const ok = await copyText(yamlCode);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'tile-card-config.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setConfig({ ...DEFAULT_TILE_CONFIG, ...imported });
      } catch (err) {
        console.error('Failed to import config:', err);
        alert('Failed to import config file');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Reset to default configuration?')) {
      setConfig({ ...DEFAULT_TILE_CONFIG });
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 h-12 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-200">Tile Card Builder</h1>
          <span className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-[10px] font-medium text-gray-400">
            {APP_VERSION_LABEL}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Import Config">
            <FileUp size={16} className="text-gray-400" />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleExport}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Export Config"
          >
            <FileDown size={16} className="text-gray-400" />
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy YAML
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Configuration */}
        <div className="w-80 border-r border-gray-800 bg-gray-950 overflow-y-auto">
          <ConfigPanel config={config} setConfig={setConfig} />
        </div>

        {/* Center Panel - Preview */}
        <div className="flex-1 bg-gray-900 overflow-y-auto">
          <Preview config={config} />
        </div>

        {/* Right Panel - YAML */}
        <div className="w-96 border-l border-gray-800 bg-gray-950 overflow-hidden">
          <YamlViewer yaml={yamlCode} />
        </div>
      </div>
    </div>
  );
};
