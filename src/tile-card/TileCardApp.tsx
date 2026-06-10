// Tile Card App - Main Component
// Tile card builder with features support

import React, { useState, useEffect, useMemo } from 'react';
import { TileCardConfig, DEFAULT_TILE_CONFIG, SavedTileRecord } from './types';
import { ConfigPanel } from './components/ConfigPanel';
import { Preview } from './components/Preview';
import { YamlViewer } from './components/YamlViewer';
import { generateTileCardYaml } from './utils/yamlGenerator';
import { parseTileCardYaml } from './utils/yamlImporter';
import { TILE_PRESETS, TILE_PRESET_CATEGORIES, TilePreset, applyTilePreset } from './presets';
import { FileDown, FileUp, FolderOpen, Eye, Settings, Code, Sparkles, Undo2, Redo2, X } from 'lucide-react';
import { APP_VERSION_LABEL } from '../version';
import { cloneSnapshot, useToast, Toast, useResetConfirm, SaveRecordMetadata } from '../shared/libraryUtils';
import { SaveRecordModal } from '../shared/SaveRecordModal';
import { LibraryModal } from '../shared/LibraryModal';
import { useConfigHistory } from '../shared/useConfigHistory';

const STORAGE_KEY = 'tile-card-config';
const SAVED_TILE_BUTTONS_STORAGE_KEY = 'tile-card-builder-saved-buttons';

const deriveTileName = (config: TileCardConfig, fallbackIndex?: number): string => {
  const name = config.name?.trim();
  if (name) return name;
  const entity = config.entity.trim();
  if (entity) return entity;
  return `Tile Card ${fallbackIndex ?? 1}`;
};

type SaveModalState =
  | { mode: 'current'; initialName: string; initialFolder: string; initialTags: string }
  | { mode: 'queued'; buttonId: string; initialName: string; initialFolder: string; initialTags: string }
  | null;

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

const loadSavedButtons = (): SavedTileRecord[] => {
  try {
    const saved = localStorage.getItem(SAVED_TILE_BUTTONS_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((button: any) => button && typeof button === 'object' && typeof button.id === 'string')
      .map((button: any) => ({
        id: button.id,
        name: typeof button.name === 'string' ? button.name : 'Saved Tile Card',
        folder: typeof button.folder === 'string' ? button.folder : '',
        tags: Array.isArray(button.tags) ? button.tags.filter((tag: unknown) => typeof tag === 'string') : [],
        yaml: typeof button.yaml === 'string' ? button.yaml : '',
        config: { ...DEFAULT_TILE_CONFIG, ...(button.config || {}) },
        createdAt: typeof button.createdAt === 'number' ? button.createdAt : Date.now(),
        updatedAt: typeof button.updatedAt === 'number' ? button.updatedAt : Date.now(),
      }));
  } catch (e) {
    console.warn('Failed to load saved tile cards:', e);
    return [];
  }
};

export const TileCardApp: React.FC = () => {
  const { config, setConfig, replaceConfig, undo, redo, canUndo, canRedo } = useConfigHistory<TileCardConfig>(loadSavedConfig);
  const [savedButtons, setSavedButtons] = useState<SavedTileRecord[]>(loadSavedButtons);
  const [queuedButtons, setQueuedButtons] = useState<SavedTileRecord[]>([]);
  const [showButtonLibrary, setShowButtonLibrary] = useState(false);
  const [saveModalState, setSaveModalState] = useState<SaveModalState>(null);
  const { toastMessage, showToast } = useToast();

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importYaml, setImportYaml] = useState('');
  const [importError, setImportError] = useState('');

  const [showPresets, setShowPresets] = useState(false);
  const [presetSearch, setPresetSearch] = useState('');
  const [presetCategory, setPresetCategory] = useState<string>('all');
  const [activePresetName, setActivePresetName] = useState<string | null>(null);

  const [mobileTab, setMobileTab] = useState<'preview' | 'config' | 'yaml' | 'presets'>('preview');

  const yamlCode = useMemo(() => generateTileCardYaml(config), [config]);

  // Debounced autosave — avoids a synchronous localStorage write on every keypress.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      } catch (e) {
        console.warn('Failed to save tile card config:', e);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_TILE_BUTTONS_STORAGE_KEY, JSON.stringify(savedButtons));
    } catch (e) {
      console.warn('Failed to save Tile library:', e);
    }
  }, [savedButtons]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (queuedButtons.length > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [queuedButtons.length]);

  const createButtonRecord = (metadata?: Partial<SaveRecordMetadata>): SavedTileRecord => {
    const timestamp = Date.now();
    return {
      id: `tile-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
      name: (metadata?.name?.trim() || deriveTileName(config, savedButtons.length + queuedButtons.length + 1)).trim(),
      folder: metadata?.folder?.trim() || '',
      tags: metadata?.tags || [],
      yaml: yamlCode,
      config: cloneSnapshot(config),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  };

  const filteredPresets = useMemo(() => {
    const query = presetSearch.trim().toLowerCase();
    return TILE_PRESETS.filter(preset => {
      const matchesCategory = presetCategory === 'all' || preset.category === presetCategory;
      const matchesSearch = !query ||
        preset.name.toLowerCase().includes(query) ||
        preset.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [presetSearch, presetCategory]);

  const handleApplyPreset = (preset: TilePreset) => {
    setConfig(applyTilePreset(preset));
    setActivePresetName(preset.name);
    showToast(`"${preset.name}" preset applied`);
  };

  const handleExport = () => {
    const dataUri = 'data:text/yaml;charset=utf-8,' + encodeURIComponent(yamlCode);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'tile-card.yaml');
    linkElement.click();
  };

  const handleImportYaml = () => {
    setImportError('');
    try {
      const parsed = parseTileCardYaml(importYaml);
      setConfig(parsed);
      setActivePresetName(null);
      setIsImportOpen(false);
      setImportYaml('');
      showToast('Tile card YAML imported');
    } catch (e: any) {
      setImportError(e.message || 'Failed to parse YAML. Please check the format.');
    }
  };

  const handleImportJsonFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setConfig({ ...DEFAULT_TILE_CONFIG, ...imported });
        setActivePresetName(null);
        showToast('Config imported');
      } catch (err) {
        console.error('Failed to import config:', err);
        alert('Failed to import config file');
      }
    };
    reader.readAsText(file);
  };

  const { resetConfirmPending, handleReset } = useResetConfirm(() => {
    replaceConfig({ ...DEFAULT_TILE_CONFIG });
    setActivePresetName(null);
    localStorage.removeItem(STORAGE_KEY);
  });

  const handleQueueCurrentButton = (): boolean => {
    setQueuedButtons((prev) => [createButtonRecord(), ...prev]);
    return true;
  };

  const handleSaveCurrentButton = (): boolean => {
    setSaveModalState({
      mode: 'current',
      initialName: deriveTileName(config, savedButtons.length + 1),
      initialFolder: '',
      initialTags: '',
    });
    return true;
  };

  const handleLoadButtonRecord = (record: SavedTileRecord) => {
    replaceConfig(cloneSnapshot(record.config));
    setActivePresetName(null);
    setShowButtonLibrary(false);
  };

  const handleDeleteSavedButton = (buttonId: string) => {
    setSavedButtons((prev) => prev.filter((button) => button.id !== buttonId));
  };

  const handleRemoveQueuedButton = (buttonId: string) => {
    setQueuedButtons((prev) => prev.filter((button) => button.id !== buttonId));
  };

  const handleSaveQueuedButton = (buttonId: string) => {
    const queued = queuedButtons.find((button) => button.id === buttonId);
    if (!queued) return;

    setSaveModalState({
      mode: 'queued',
      buttonId,
      initialName: queued.name,
      initialFolder: queued.folder,
      initialTags: queued.tags.join(', '),
    });
  };

  const handleConfirmSaveModal = (metadata: SaveRecordMetadata) => {
    if (!saveModalState) return;

    if (saveModalState.mode === 'current') {
      setSavedButtons((prev) => [createButtonRecord(metadata), ...prev]);
    } else {
      const queued = queuedButtons.find((button) => button.id === saveModalState.buttonId);
      if (!queued) return;

      const timestamp = Date.now();
      setSavedButtons((prev) => [
        {
          ...cloneSnapshot(queued),
          id: `tile-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
          name: metadata.name,
          folder: metadata.folder,
          tags: metadata.tags,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        ...prev,
      ]);
    }

    setSaveModalState(null);
    showToast(`"${metadata.name}" saved to library`);
  };

  const handleCommitEditSavedButton = (buttonId: string, metadata: SaveRecordMetadata) => {
    setSavedButtons((prev) => prev.map((button) => (
      button.id === buttonId
        ? {
            ...button,
            name: metadata.name,
            folder: metadata.folder,
            tags: metadata.tags,
            updatedAt: Date.now(),
          }
        : button
    )));
  };

  const presetsPanel = (
    <div className="h-full flex flex-col bg-[#111]">
      <div className="p-3 border-b border-gray-800 space-y-2 shrink-0">
        <input type="text" placeholder="Search presets..." value={presetSearch} onChange={(e) => setPresetSearch(e.target.value)} className="w-full bg-gray-900 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none" />
        <select value={presetCategory} onChange={(e) => setPresetCategory(e.target.value)} className="w-full bg-gray-900 text-white text-sm px-2 py-1.5 rounded border border-gray-700 focus:border-emerald-500">
          {TILE_PRESET_CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredPresets.map((preset) => (
          <button key={preset.name} onClick={() => handleApplyPreset(preset)} className={`w-full text-left p-3 rounded-lg transition-all border ${activePresetName === preset.name ? 'bg-emerald-600/20 border-emerald-500/50 ring-1 ring-emerald-500/30' : 'bg-gray-900 hover:bg-gray-800 border-gray-700'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{preset.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 uppercase tracking-wide">
                {preset.category}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
          </button>
        ))}
        {filteredPresets.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-8">No presets match your search.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-black text-white overflow-hidden">
      <div className="shrink-0 h-12 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-200">Tile Card Builder</h1>
          <span className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-[10px] font-medium text-gray-400">
            {APP_VERSION_LABEL}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 mr-1">
            <button onClick={undo} disabled={!canUndo} className="p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800" title="Undo (Ctrl+Z)">
              <Undo2 size={16} className="text-gray-400" />
            </button>
            <button onClick={redo} disabled={!canRedo} className="p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800" title="Redo (Ctrl+Y)">
              <Redo2 size={16} className="text-gray-400" />
            </button>
          </div>
          <button onClick={() => setShowButtonLibrary(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors" title="Open tile library">
            <FolderOpen size={14} />
            <span className="hidden sm:inline">Library</span>
            {(queuedButtons.length + savedButtons.length) > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-gray-700 text-[10px] text-gray-200">
                {queuedButtons.length + savedButtons.length}
              </span>
            )}
          </button>
          <button onClick={() => { setIsImportOpen(true); setImportError(''); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Import YAML">
            <FileUp size={16} className="text-gray-400" />
          </button>
          <button onClick={handleExport} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Export card YAML for HA dashboard">
            <FileDown size={16} className="text-gray-400" />
          </button>
          <button onClick={handleReset} className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${resetConfirmPending ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}>
            {resetConfirmPending ? 'Confirm?' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-gray-800 bg-gray-950 overflow-y-auto">
          <ConfigPanel config={config} setConfig={setConfig} />
        </div>

        <div className="flex-1 bg-gray-900 overflow-y-auto">
          <Preview config={config} />
        </div>

        <div className="w-96 border-l border-gray-800 bg-gray-950 flex flex-col overflow-hidden">
          <div className="flex border-b border-gray-800 shrink-0">
            <button onClick={() => setShowPresets(false)} className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${!showPresets ? 'bg-gray-800 text-white border-b-2 border-emerald-500' : 'text-gray-400 hover:text-white'}`}>
              <Code size={14} />
              YAML
            </button>
            <button onClick={() => setShowPresets(true)} className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${showPresets ? 'bg-gray-800 text-white border-b-2 border-emerald-500' : 'text-gray-400 hover:text-white'}`}>
              <Sparkles size={14} />
              Presets ({TILE_PRESETS.length})
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {showPresets ? presetsPanel : (
              <YamlViewer yaml={yamlCode} sessionButtons={queuedButtons} savedButtons={savedButtons} onQueueCurrent={handleQueueCurrentButton} onSaveCurrent={handleSaveCurrentButton} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileTab === 'preview' && (
            <div className="h-full bg-gray-900 overflow-y-auto">
              <Preview config={config} />
            </div>
          )}
          {mobileTab === 'config' && (
            <div className="h-full overflow-y-auto bg-gray-950">
              <ConfigPanel config={config} setConfig={setConfig} />
            </div>
          )}
          {mobileTab === 'yaml' && (
            <div className="h-full overflow-hidden bg-gray-950">
              <YamlViewer yaml={yamlCode} sessionButtons={queuedButtons} savedButtons={savedButtons} onQueueCurrent={handleQueueCurrentButton} onSaveCurrent={handleSaveCurrentButton} />
            </div>
          )}
          {mobileTab === 'presets' && presetsPanel}
        </div>

        <nav className="shrink-0 border-t border-gray-800 bg-gray-900 flex">
          <button onClick={() => setMobileTab('preview')} className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${mobileTab === 'preview' ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500'}`}>
            <Eye size={20} />
            <span className="text-[10px] font-medium">Preview</span>
          </button>
          <button onClick={() => setMobileTab('config')} className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${mobileTab === 'config' ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500'}`}>
            <Settings size={20} />
            <span className="text-[10px] font-medium">Configure</span>
          </button>
          <button onClick={() => setMobileTab('presets')} className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${mobileTab === 'presets' ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500'}`}>
            <Sparkles size={20} />
            <span className="text-[10px] font-medium">Presets</span>
          </button>
          <button onClick={() => setMobileTab('yaml')} className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${mobileTab === 'yaml' ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500'}`}>
            <Code size={20} />
            <span className="text-[10px] font-medium">YAML</span>
          </button>
        </nav>
      </div>

      {showButtonLibrary && (
        <LibraryModal
          title="Tile Library"
          itemNoun="tile card"
          queuedRecords={queuedButtons}
          savedRecords={savedButtons}
          loadAccentClass="bg-emerald-600 hover:bg-emerald-500"
          emptyQueueText="Queue tile cards from the YAML panel to keep a working set for this session."
          emptySavedText="Save tile cards to revisit and reuse them later."
          exportFilenamePrefix="tile-card"
          onClose={() => setShowButtonLibrary(false)}
          onLoad={handleLoadButtonRecord}
          onSaveQueued={handleSaveQueuedButton}
          onRemoveQueued={handleRemoveQueuedButton}
          onClearQueue={() => setQueuedButtons([])}
          onDelete={handleDeleteSavedButton}
          onCommitEdit={handleCommitEditSavedButton}
        />
      )}

      {saveModalState && (
        <SaveRecordModal
          title="Save Tile Card"
          description="Save this tile card with a name, optional folder, and tags so it is easy to find later."
          itemNoun="tile card"
          initialName={saveModalState.initialName}
          initialFolder={saveModalState.initialFolder}
          initialTags={saveModalState.initialTags}
          existingNames={savedButtons
            .filter((button) => saveModalState.mode !== 'queued' || button.id !== saveModalState.buttonId)
            .map((button) => button.name)}
          onConfirm={handleConfirmSaveModal}
          onClose={() => setSaveModalState(null)}
        />
      )}

      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 w-full max-w-2xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileUp size={20} className="text-emerald-400" />
                Import Tile Card YAML
              </h3>
              <button onClick={() => { setIsImportOpen(false); setImportYaml(''); setImportError(''); }} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-300">
                Paste tile card YAML from a Home Assistant dashboard to load it into the builder.
              </p>
              <textarea
                value={importYaml}
                onChange={(e) => setImportYaml(e.target.value)}
                placeholder={'type: tile\nentity: light.living_room\nfeatures:\n  - type: light-brightness'}
                spellCheck={false}
                className="w-full h-56 bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:border-emerald-500 focus:outline-none resize-none"
              />
              {importError && (
                <p className="text-sm text-red-400">{importError}</p>
              )}
              <div className="border-t border-gray-800 pt-4">
                <label className="inline-flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-gray-200">
                  <FileUp size={14} />
                  Or import a JSON config backup
                  <input type="file" accept=".json" onChange={(e) => { handleImportJsonFile(e); setIsImportOpen(false); }} className="hidden" />
                </label>
              </div>
            </div>

            <div className="p-6 bg-gray-800/50 flex justify-end gap-3">
              <button onClick={() => { setIsImportOpen(false); setImportYaml(''); setImportError(''); }} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">
                Cancel
              </button>
              <button onClick={handleImportYaml} disabled={!importYaml.trim()} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <FileUp size={16} />
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMessage} />
    </div>
  );
};
