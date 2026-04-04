// Bubble Card Builder - Main App Component
// Modeled after ButtonCardApp.tsx structure

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  BubbleButtonConfig,
  BubbleConfig,
  BubblePreset,
  BubbleCardType,
  SavedBubbleRecord,
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
import { validateBubbleCard } from './utils/validation';
import { BUBBLE_PRESETS } from './presets';
import { BubbleConfigPanel } from './components/ConfigPanel';
import { BubblePreview } from './components/Preview';
import { BubbleYamlViewer } from './components/YamlViewer';
import { Eye, RotateCcw, Upload, Settings, Code, Menu, X, Sparkles, Copy, Undo2, Redo2, FolderOpen, Save, Trash2, Pencil } from 'lucide-react';
import { APP_VERSION_LABEL } from '../version';

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

const SAVED_BUBBLE_BUTTONS_STORAGE_KEY = 'bubble-card-builder-saved-buttons';

const cloneSnapshot = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const deriveBubbleName = (config: BubbleConfig, fallbackIndex?: number): string => {
  const name = 'name' in config && typeof config.name === 'string' ? config.name.trim() : '';
  if (name) return name;
  const entity = 'entity' in config && typeof config.entity === 'string' ? config.entity.trim() : '';
  if (entity) return entity;
  return `Bubble Card ${fallbackIndex ?? 1}`;
};

interface SaveBubbleMetadata {
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

const loadSavedButtons = (): SavedBubbleRecord[] => {
  try {
    const saved = localStorage.getItem(SAVED_BUBBLE_BUTTONS_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((button: any) => button && typeof button === 'object' && typeof button.id === 'string')
      .map((button: any) => ({
        id: button.id,
        name: typeof button.name === 'string' ? button.name : 'Saved Bubble Card',
        folder: typeof button.folder === 'string' ? button.folder : '',
        tags: Array.isArray(button.tags) ? button.tags.filter((tag: unknown) => typeof tag === 'string') : [],
        yaml: typeof button.yaml === 'string' ? button.yaml : '',
        config: button.config && typeof button.config === 'object'
          ? { ...getDefaultConfigForType(button.config.card_type || 'button'), ...button.config }
          : { ...DEFAULT_BUBBLE_BUTTON_CONFIG },
        activePresetName: typeof button.activePresetName === 'string' ? button.activePresetName : null,
        createdAt: typeof button.createdAt === 'number' ? button.createdAt : Date.now(),
        updatedAt: typeof button.updatedAt === 'number' ? button.updatedAt : Date.now(),
      }));
  } catch (e) {
    console.warn('Failed to load saved bubble cards:', e);
    return [];
  }
};

export function BubbleCardApp() {
  const [config, setConfigInternal] = useState<BubbleConfig>(loadSavedConfig);
  const [activePreset, setActivePreset] = useState<BubblePreset | null>(null);
  const [simulatedState, setSimulatedState] = useState<'on' | 'off'>('on');

  const [mobileTab, setMobileTab] = useState<'preview' | 'config' | 'yaml'>('preview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importYaml, setImportYaml] = useState('');
  const [importError, setImportError] = useState('');
  const [savedButtons, setSavedButtons] = useState<SavedBubbleRecord[]>(loadSavedButtons);
  const [queuedButtons, setQueuedButtons] = useState<SavedBubbleRecord[]>([]);
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

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCardType, setSelectedCardType] = useState<BubbleCardType | 'all'>('all');
  const [presetSearch, setPresetSearch] = useState('');

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

  const isApplyingPresetRef = useRef(false);

  const setConfig: React.Dispatch<React.SetStateAction<BubbleConfig>> = (action) => {
    if (!isApplyingPresetRef.current && activePreset) {
      setActivePreset(null);
    }

    setConfigInternal(prev => {
      const result = typeof action === 'function' ? action(prev) : action;

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

  const yamlOutput = useMemo(() => generateBubbleYaml(config), [config]);

  const createButtonRecord = (metadata?: Partial<SaveBubbleMetadata>): SavedBubbleRecord => {
    const timestamp = Date.now();
    return {
      id: `bubble-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
      name: (metadata?.name?.trim() || deriveBubbleName(config, savedButtons.length + queuedButtons.length + 1)).trim(),
      folder: metadata?.folder?.trim() || '',
      tags: metadata?.tags || [],
      yaml: yamlOutput,
      config: cloneSnapshot(config),
      activePresetName: activePreset?.name || null,
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
    const groups = new Map<string, SavedBubbleRecord[]>();
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

  useEffect(() => {
    try {
      localStorage.setItem(BUBBLE_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save Bubble config:', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_BUBBLE_BUTTONS_STORAGE_KEY, JSON.stringify(savedButtons));
    } catch (e) {
      console.warn('Failed to save Bubble library:', e);
    }
  }, [savedButtons]);

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

  const handleCardTypeChange = (newType: BubbleCardType) => {
    const commonFields = {
      entity: (config as any).entity || '',
      name: (config as any).name || '',
      icon: (config as any).icon || '',
    };

    const newDefaults = getDefaultConfigForType(newType);
    setConfig({ ...newDefaults, ...commonFields });
    setActivePreset(null);
  };

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

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      setConfigInternal(DEFAULT_BUBBLE_BUTTON_CONFIG);
      setActivePreset(null);
      localStorage.removeItem(BUBBLE_STORAGE_KEY);
    }
  };

  const handleDuplicate = () => {
    const duplicated = JSON.parse(JSON.stringify(config));
    if (duplicated.name) {
      duplicated.name = `${duplicated.name} (Copy)`;
    }
    setConfigInternal(duplicated);
    setActivePreset(null);
  };

  const handleQueueCurrentButton = (): boolean => {
    setQueuedButtons((prev) => [createButtonRecord(), ...prev]);
    return true;
  };

  const handleSaveCurrentButton = (): boolean => {
    setSaveNameInput(deriveBubbleName(config, savedButtons.length + 1));
    setSaveFolderInput('');
    setSaveTagsInput('');
    setSaveModalState({ mode: 'current' });
    return true;
  };

  const handleLoadButtonRecord = (record: SavedBubbleRecord) => {
    setConfigInternal(cloneSnapshot(record.config));
    setHistoryPast([]);
    setHistoryFuture([]);
    setActivePreset(record.activePresetName ? BUBBLE_PRESETS.find((preset) => preset.name === record.activePresetName) || null : null);
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

    const metadata: SaveBubbleMetadata = {
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
          id: `bubble-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
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

  const handleStartEditSavedButton = (button: SavedBubbleRecord) => {
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

  const updateConfig = <K extends keyof BubbleConfig>(key: K, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleImportYaml = () => {
    setImportError('');
    try {
      if (!importYaml.includes('bubble-card') && !importYaml.includes('card_type')) {
        setImportError('This doesn\'t look like Bubble Card YAML. Make sure it includes card_type.');
        return;
      }

      setImportError('YAML import coming soon! For now, use the visual builder.');
    } catch (e: any) {
      setImportError(`Failed to parse YAML: ${e.message}`);
    }
  };

  const currentCardType = config.card_type;

  return (
    <div className="flex flex-col h-full bg-black text-white font-sans overflow-hidden selection:bg-cyan-500/30">
      <header className="h-12 md:h-14 border-b border-gray-800 flex items-center justify-between px-3 md:px-6 bg-gray-900/50 backdrop-blur-md shrink-0 relative z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border border-cyan-500/30">
            <span className="text-sm md:text-base">🫧</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm md:text-lg tracking-tight text-gray-200">Bubble Card Builder</h1>
            <span className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-[10px] font-medium text-cyan-300">
              {APP_VERSION_LABEL}
            </span>
          </div>
        </div>

        {activePreset && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-cyan-600/20 border border-cyan-500/30 rounded-full">
            <Sparkles size={12} className="text-cyan-400" />
            <span className="text-xs text-cyan-300">{activePreset.name}</span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => setShowButtonLibrary(true)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all" title="Open bubble library">
            <FolderOpen size={14} />
            Library
            {(queuedButtons.length + savedButtons.length) > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-gray-700 text-[10px] text-gray-200">
                {queuedButtons.length + savedButtons.length}
              </span>
            )}
          </button>
          <div className="flex items-center border border-gray-700 rounded-full overflow-hidden">
            <button onClick={handleUndo} disabled={!canUndo} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed" title="Undo (Ctrl+Z)">
              <Undo2 size={14} />
            </button>
            <div className="w-px h-5 bg-gray-700" />
            <button onClick={handleRedo} disabled={!canRedo} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed" title="Redo (Ctrl+Y)">
              <Redo2 size={14} />
            </button>
          </div>
          <button onClick={() => setShowPresets(!showPresets)} className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-sm font-medium transition-all ${showPresets ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300'}`}>
            <Sparkles size={14} />
            Presets
          </button>
          <button onClick={() => setIsImportOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all" title="Import existing YAML">
            <Upload size={14} />
            Import
          </button>
          <button onClick={handleDuplicate} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all" title="Duplicate current card">
            <Copy size={14} />
            Duplicate
          </button>
          <button onClick={handleReset} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all" title="Reset to defaults">
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        <aside className="w-80 shrink-0 shadow-xl bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden" style={{ contain: 'strict' }}>
          <div className="p-4 border-b border-gray-800 shrink-0">
            <label className="text-xs text-gray-400 font-medium mb-2 block">Card Type</label>
            <select value={currentCardType} onChange={(e) => handleCardTypeChange(e.target.value as BubbleCardType)} className="w-full bg-gray-800 text-white text-sm px-3 py-2.5 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none cursor-pointer">
              {CARD_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <p className="text-[10px] text-gray-500 mt-1.5">
              {CARD_TYPE_OPTIONS.find(o => o.value === currentCardType)?.description}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ contain: 'layout paint' }}>
            <BubbleConfigPanel config={config as BubbleButtonConfig} updateConfig={updateConfig} setConfig={setConfig as React.Dispatch<React.SetStateAction<BubbleButtonConfig>>} />
          </div>
        </aside>

        <section className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex-1 min-h-0 flex">
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
                <BubblePreview config={config} simulatedState={simulatedState} onSimulatedStateChange={setSimulatedState} />
              </div>
            </div>

            <div className="w-96 border-l border-gray-800 bg-[#111] flex flex-col shrink-0 min-h-0">
              <div className="flex border-b border-gray-800 shrink-0">
                <button onClick={() => setShowPresets(false)} className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${!showPresets ? 'bg-gray-800 text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:text-white'}`}>
                  <Code size={14} />
                  YAML
                </button>
                <button onClick={() => setShowPresets(true)} className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${showPresets ? 'bg-gray-800 text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:text-white'}`}>
                  <Sparkles size={14} />
                  Presets ({BUBBLE_PRESETS.length})
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                {showPresets ? (
                  <div className="h-full flex flex-col">
                    <div className="p-3 border-b border-gray-800 space-y-2 shrink-0">
                      <input type="text" placeholder="Search presets..." value={presetSearch} onChange={(e) => setPresetSearch(e.target.value)} className="w-full bg-gray-900 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none" />
                      <div className="flex gap-2">
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="flex-1 bg-gray-900 text-white text-sm px-2 py-1.5 rounded border border-gray-700 focus:border-cyan-500">
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
                        <select value={selectedCardType} onChange={(e) => setSelectedCardType(e.target.value as BubbleCardType | 'all')} className="flex-1 bg-gray-900 text-white text-sm px-2 py-1.5 rounded border border-gray-700 focus:border-cyan-500">
                          <option value="all">All Types</option>
                          {CARD_TYPE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {filteredPresets.map((preset, index) => (
                        <button key={index} onClick={() => handleApplyPreset(preset)} className={`w-full text-left p-3 rounded-lg transition-all ${activePreset?.name === preset.name ? 'bg-cyan-600/20 border-cyan-500/50 ring-1 ring-cyan-500/30' : 'bg-gray-900 hover:bg-gray-800 border-gray-700'} border`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{preset.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 uppercase tracking-wide">
                              {preset.cardType}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col p-4">
                    <BubbleYamlViewer yaml={yamlOutput} sessionButtons={queuedButtons} savedButtons={savedButtons} onQueueCurrent={handleQueueCurrentButton} onSaveCurrent={handleSaveCurrentButton} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {showButtonLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 w-full max-w-4xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderOpen size={20} className="text-emerald-400" />
                Bubble Library
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
                    Queue bubble cards from the YAML panel to keep a working set for this session.
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
                          <button onClick={() => handleLoadButtonRecord(button)} className="px-3 py-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded">Load</button>
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
                  <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Saved Bubble Cards</h4>
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
                    Save bubble cards to revisit and reuse them later.
                  </div>
                ) : filteredSavedButtons.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-700 p-4 text-sm text-gray-500">
                    No saved bubble cards match the current folder or tag filters.
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
                                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-[10px] text-cyan-300 uppercase tracking-wide">
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
                                    <button onClick={() => handleLoadButtonRecord(button)} className="px-3 py-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded">Load</button>
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
    </div>
  );
}

export default BubbleCardApp;