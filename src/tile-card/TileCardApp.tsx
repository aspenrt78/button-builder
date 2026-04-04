// Tile Card App - Main Component
// Tile card builder with features support

import React, { useState, useEffect, useMemo } from 'react';
import { TileCardConfig, DEFAULT_TILE_CONFIG, SavedTileRecord } from './types';
import { ConfigPanel } from './components/ConfigPanel';
import { Preview } from './components/Preview';
import { YamlViewer } from './components/YamlViewer';
import { generateTileCardYaml } from './utils/yamlGenerator';
import { FileDown, FileUp, FolderOpen, Save, Trash2, Pencil } from 'lucide-react';
import { APP_VERSION_LABEL } from '../version';

const STORAGE_KEY = 'tile-card-config';
const SAVED_TILE_BUTTONS_STORAGE_KEY = 'tile-card-builder-saved-buttons';

const cloneSnapshot = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const deriveTileName = (config: TileCardConfig, fallbackIndex?: number): string => {
  const name = config.name?.trim();
  if (name) return name;
  const entity = config.entity.trim();
  if (entity) return entity;
  return `Tile Card ${fallbackIndex ?? 1}`;
};

interface SaveTileMetadata {
  name: string;
  folder: string;
  tags: string[];
}

type SaveModalState =
  | { mode: 'current' }
  | { mode: 'queued'; buttonId: string }
  | null;

const parseTagInput = (raw: string): string[] =>
  raw
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
    .filter((tag, index, all) => all.findIndex(item => item.toLowerCase() === tag.toLowerCase()) === index);

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
  const [config, setConfig] = useState<TileCardConfig>(loadSavedConfig);
  const [yamlCode, setYamlCode] = useState('');
  const [savedButtons, setSavedButtons] = useState<SavedTileRecord[]>(loadSavedButtons);
  const [queuedButtons, setQueuedButtons] = useState<SavedTileRecord[]>([]);
  const [showButtonLibrary, setShowButtonLibrary] = useState(false);
  const [folderFilter, setFolderFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [saveModalState, setSaveModalState] = useState<SaveModalState>(null);
  const [saveNameInput, setSaveNameInput] = useState('');
  const [saveFolderInput, setSaveFolderInput] = useState('');
  const [saveTagsInput, setSaveTagsInput] = useState('');
  const [editingSavedButtonId, setEditingSavedButtonId] = useState<string | null>(null);
  const [editingNameInput, setEditingNameInput] = useState('');
  const [editingFolderInput, setEditingFolderInput] = useState('');
  const [editingTagsInput, setEditingTagsInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save tile card config:', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_TILE_BUTTONS_STORAGE_KEY, JSON.stringify(savedButtons));
    } catch (e) {
      console.warn('Failed to save Tile library:', e);
    }
  }, [savedButtons]);

  useEffect(() => {
    const yaml = generateTileCardYaml(config);
    setYamlCode(yaml);
  }, [config]);

  const createButtonRecord = (metadata?: Partial<SaveTileMetadata>): SavedTileRecord => {
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

  const availableFolders = useMemo(() => {
    const folders = Array.from(new Set(savedButtons.map(button => button.folder.trim()).filter(Boolean)));
    return folders.sort((a, b) => a.localeCompare(b));
  }, [savedButtons]);

  const filteredSavedButtons = useMemo(() => {
    const normalizedTagFilter = tagFilter.trim().toLowerCase();
    return savedButtons.filter((button) => {
      const matchesFolder = folderFilter === 'all' || button.folder === folderFilter;
      const matchesTag = !normalizedTagFilter || button.tags.some(tag => tag.toLowerCase().includes(normalizedTagFilter));
      return matchesFolder && matchesTag;
    });
  }, [folderFilter, savedButtons, tagFilter]);

  const groupedSavedButtons = useMemo(() => {
    const groups = new Map<string, SavedTileRecord[]>();
    filteredSavedButtons.forEach((button) => {
      const folder = button.folder.trim() || 'Unfiled';
      const existing = groups.get(folder) || [];
      existing.push(button);
      groups.set(folder, existing);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([folder, buttons]) => ({ folder, buttons }));
  }, [filteredSavedButtons]);

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

  const handleQueueCurrentButton = (): boolean => {
    setQueuedButtons((prev) => [createButtonRecord(), ...prev]);
    return true;
  };

  const handleSaveCurrentButton = (): boolean => {
    setSaveNameInput(deriveTileName(config, savedButtons.length + 1));
    setSaveFolderInput('');
    setSaveTagsInput('');
    setSaveModalState({ mode: 'current' });
    return true;
  };

  const handleLoadButtonRecord = (record: SavedTileRecord) => {
    setConfig(cloneSnapshot(record.config));
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

    setSaveNameInput(queued.name);
    setSaveFolderInput(queued.folder);
    setSaveTagsInput(queued.tags.join(', '));
    setSaveModalState({ mode: 'queued', buttonId });
  };

  const handleConfirmSaveModal = () => {
    if (!saveModalState) return;

    const metadata: SaveTileMetadata = {
      name: saveNameInput.trim(),
      folder: saveFolderInput.trim(),
      tags: parseTagInput(saveTagsInput),
    };

    if (!metadata.name) return;

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
  };

  const handleStartEditSavedButton = (button: SavedTileRecord) => {
    setEditingSavedButtonId(button.id);
    setEditingNameInput(button.name);
    setEditingFolderInput(button.folder);
    setEditingTagsInput(button.tags.join(', '));
  };

  const handleCancelEditSavedButton = () => {
    setEditingSavedButtonId(null);
    setEditingNameInput('');
    setEditingFolderInput('');
    setEditingTagsInput('');
  };

  const handleCommitEditSavedButton = (buttonId: string) => {
    const nextName = editingNameInput.trim();
    if (!nextName) return;

    setSavedButtons((prev) => prev.map((button) => (
      button.id === buttonId
        ? {
            ...button,
            name: nextName,
            folder: editingFolderInput.trim(),
            tags: parseTagInput(editingTagsInput),
            updatedAt: Date.now(),
          }
        : button
    )));
    handleCancelEditSavedButton();
  };

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
          <button onClick={() => setShowButtonLibrary(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors" title="Open tile library">
            <FolderOpen size={14} />
            Library
            {(queuedButtons.length + savedButtons.length) > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-gray-700 text-[10px] text-gray-200">
                {queuedButtons.length + savedButtons.length}
              </span>
            )}
          </button>
          <label className="cursor-pointer p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Import Config">
            <FileUp size={16} className="text-gray-400" />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={handleExport} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Export Config">
            <FileDown size={16} className="text-gray-400" />
          </button>
          <button onClick={handleReset} className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-gray-800 bg-gray-950 overflow-y-auto">
          <ConfigPanel config={config} setConfig={setConfig} />
        </div>

        <div className="flex-1 bg-gray-900 overflow-y-auto">
          <Preview config={config} />
        </div>

        <div className="w-96 border-l border-gray-800 bg-gray-950 overflow-hidden">
          <YamlViewer yaml={yamlCode} sessionButtons={queuedButtons} savedButtons={savedButtons} onQueueCurrent={handleQueueCurrentButton} onSaveCurrent={handleSaveCurrentButton} />
        </div>
      </div>

      {showButtonLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 w-full max-w-4xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderOpen size={20} className="text-emerald-400" />
                Tile Library
              </h3>
              <button onClick={() => setShowButtonLibrary(false)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto">
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Session Queue</h4>
                  {queuedButtons.length > 0 && (
                    <button onClick={() => setQueuedButtons([])} className="text-xs text-gray-400 hover:text-white">
                      Clear Queue
                    </button>
                  )}
                </div>
                {queuedButtons.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-700 p-4 text-sm text-gray-500">
                    Queue tile cards from the YAML panel to keep a working set for this session.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queuedButtons.map((button) => (
                      <div key={button.id} className="rounded-lg border border-gray-700 bg-gray-800/60 p-4 space-y-3">
                        <div>
                          <div className="text-sm font-medium text-white">{button.name}</div>
                          <div className="text-xs text-gray-500">Queued for this session</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => handleLoadButtonRecord(button)} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded">Load</button>
                          <button onClick={() => handleSaveQueuedButton(button.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded"><Save size={12} /> Save</button>
                          <button onClick={() => handleRemoveQueuedButton(button.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"><Trash2 size={12} /> Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Saved Tile Cards</h4>
                  <div className="text-xs text-gray-500">Stored in browser</div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <select value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white">
                    <option value="all">All folders</option>
                    {availableFolders.map((folder) => (
                      <option key={folder} value={folder}>{folder}</option>
                    ))}
                  </select>
                  <input type="text" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} placeholder="Filter by tag" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500" />
                </div>
                {savedButtons.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-700 p-4 text-sm text-gray-500">
                    Save tile cards to revisit and reuse them later.
                  </div>
                ) : filteredSavedButtons.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-700 p-4 text-sm text-gray-500">
                    No saved tile cards match the current folder or tag filters.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupedSavedButtons.map(({ folder, buttons }) => (
                      <div key={folder} className="space-y-3">
                        <div className="sticky top-0 z-10 flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950/90 px-3 py-2 backdrop-blur-sm">
                          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">{folder}</div>
                          <div className="text-[11px] text-gray-500">{buttons.length} saved</div>
                        </div>
                        {buttons.map((button) => {
                          const isEditing = editingSavedButtonId === button.id;
                          return (
                            <div key={button.id} className="rounded-lg border border-gray-700 bg-gray-800/60 p-4 space-y-3">
                              {isEditing ? (
                                <div className="space-y-3">
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    <input type="text" value={editingNameInput} onChange={(e) => setEditingNameInput(e.target.value)} placeholder="Card name" className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500" />
                                    <input type="text" value={editingFolderInput} onChange={(e) => setEditingFolderInput(e.target.value)} placeholder="Folder" className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500" />
                                  </div>
                                  <input type="text" value={editingTagsInput} onChange={(e) => setEditingTagsInput(e.target.value)} placeholder="Tags, comma separated" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500" />
                                  <div className="flex flex-wrap gap-2">
                                    <button onClick={() => handleCommitEditSavedButton(button.id)} className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded">Save Details</button>
                                    <button onClick={handleCancelEditSavedButton} className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded">Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <div className="text-sm font-medium text-white">{button.name}</div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {button.folder && (
                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-[10px] text-blue-300 uppercase tracking-wide">
                                          {button.folder}
                                        </span>
                                      )}
                                      {button.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-700 text-[10px] text-gray-200">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="text-xs text-gray-500">Updated {new Date(button.updatedAt).toLocaleString()}</div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <button onClick={() => handleLoadButtonRecord(button)} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded">Load</button>
                                    <button onClick={() => handleStartEditSavedButton(button)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"><Pencil size={12} /> Edit</button>
                                    <button onClick={() => handleDeleteSavedButton(button.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"><Trash2 size={12} /> Delete</button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      {saveModalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Save size={20} className="text-emerald-400" />
                Save Tile Card
              </h3>
              <button onClick={() => setSaveModalState(null)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-300">
                Save this tile card with a name, optional folder, and tags so it is easy to reuse later.
              </p>
              <div className="space-y-3">
                <input type="text" value={saveNameInput} onChange={(e) => setSaveNameInput(e.target.value)} placeholder="Card name" className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500" />
                <input type="text" value={saveFolderInput} onChange={(e) => setSaveFolderInput(e.target.value)} placeholder="Folder (optional)" className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500" />
                <input type="text" value={saveTagsInput} onChange={(e) => setSaveTagsInput(e.target.value)} placeholder="Tags, comma separated" className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500" />
              </div>
            </div>

            <div className="p-6 bg-gray-800/50 flex justify-end gap-3">
              <button onClick={() => setSaveModalState(null)} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">
                Cancel
              </button>
              <button onClick={handleConfirmSaveModal} disabled={!saveNameInput.trim()} className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <Save size={16} />
                Save Tile Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};