// Button Card Builder - Extracted from original App.tsx
// This contains all the button-card specific logic

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { PreviewCard } from './components/PreviewCard';
import { YamlViewer } from './components/YamlViewer';
import { MagicBuilder } from './components/MagicBuilder';
import { ButtonConfig, DEFAULT_CONFIG, StateAppearanceConfig, SavedButtonRecord } from './types';
import { generateYaml } from './utils/yamlGenerator';
import { mergeStateAppearance, appearanceFromConfig, appearanceToStateStyle, extractAppearance, migrateLegacyStateColors } from './utils/stateAppearance';
import { SavedTheme } from './types';
import { loadThemes, persistThemes, buildThemeValues, expandThemeKeys } from './utils/themes';
import { ThemeChooserModal } from './components/ThemeChooserModal';
import { parseButtonCardYaml, validateImportedConfig } from './utils/yamlImporter';
import { PRESETS, Preset, generateDarkModePreset, buildStylePresetConfig } from './presets';
import { Wand2, Eye, RotateCcw, Upload, Settings, Code, Menu, X, Undo2, Redo2, FolderOpen, AlertTriangle, PanelLeftClose, PanelLeftOpen, ChevronDown, ChevronUp, MoreHorizontal, Copy, Check, Key, ArrowRightLeft, Eraser, Palette } from 'lucide-react';
import { hasOnOffState } from './utils/entityCapabilities';
import { checkButtonBuilderEnvironment, ButtonBuilderEnvironmentReport } from './services/dashboardService';
import { APP_VERSION_LABEL } from './version';
import { cloneSnapshot, useToast, Toast, useResetConfirm, SaveRecordMetadata } from './shared/libraryUtils';
import { SaveRecordModal } from './shared/SaveRecordModal';
import { LibraryModal } from './shared/LibraryModal';

import logo from './assets/logo.png';

const STORAGE_KEY = 'button-builder-config';
const STATE_DESIGN_STORAGE_KEY = 'button-builder-state-design';
const CUSTOM_PRESETS_STORAGE_KEY = 'button-builder-custom-presets';
const SAVED_BUTTONS_STORAGE_KEY = 'button-builder-saved-buttons';
const ADVANCED_MODE_STORAGE_KEY = 'button-builder-advanced-mode';
const DESKTOP_CONFIG_MIN_WIDTH = 600;
const DESKTOP_PREVIEW_MIN_WIDTH = 480;

const getResponsiveConfigWidth = (viewportWidth: number): number => {
  const preferredWidth = Math.round(viewportWidth * 0.52);
  const maxWidth = Math.max(DESKTOP_CONFIG_MIN_WIDTH, viewportWidth - DESKTOP_PREVIEW_MIN_WIDTH);
  return Math.min(maxWidth, Math.max(DESKTOP_CONFIG_MIN_WIDTH, preferredWidth));
};

const buildDefaultOffAppearance = (config: ButtonConfig): Partial<StateAppearanceConfig> => {
  const color = config.backgroundColor;
  if (!color) return { backgroundColorOpacity: 55 };

  const match = color.match(/^#([0-9a-f]{6})$/i);
  if (!match) {
    return {
      backgroundColor: color,
      backgroundColorOpacity: Math.max(20, Math.round((config.backgroundColorOpacity ?? 100) * 0.55)),
    };
  }

  const value = match[1];
  const channel = (offset: number) => Math.round(parseInt(value.slice(offset, offset + 2), 16) * 0.4)
    .toString(16)
    .padStart(2, '0');
  return { backgroundColor: `#${channel(0)}${channel(2)}${channel(4)}` };
};

const loadStateDesign = (): {
  editingState: 'on' | 'off';
  onAppearance: Partial<StateAppearanceConfig>;
  offAppearance: Partial<StateAppearanceConfig>;
  hasSavedDesign: boolean;
} => {
  try {
    const saved = localStorage.getItem(STATE_DESIGN_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        editingState: parsed.editingState === 'off' ? 'off' : 'on',
        onAppearance: parsed.onAppearance && typeof parsed.onAppearance === 'object' ? parsed.onAppearance : {},
        offAppearance: parsed.offAppearance && typeof parsed.offAppearance === 'object' ? parsed.offAppearance : {},
        hasSavedDesign: true,
      };
    }
  } catch (error) {
    console.warn('Failed to load state design:', error);
  }
  return { editingState: 'on', onAppearance: {}, offAppearance: {}, hasSavedDesign: false };
};

const deriveButtonName = (config: ButtonConfig, fallbackIndex?: number): string => {
  const fromName = config.name.trim();
  if (fromName) return fromName;
  const fromEntity = config.entity.trim();
  if (fromEntity) return fromEntity;
  return `Button ${fallbackIndex ?? 1}`;
};

type SaveModalState =
  | { mode: 'current'; initialName: string; initialFolder: string; initialTags: string }
  | { mode: 'queued'; buttonId: string; initialName: string; initialFolder: string; initialTags: string }
  | null;

const loadSavedConfig = (): ButtonConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load saved config:', e);
  }
  return DEFAULT_CONFIG;
};

const loadCustomPresets = (): Preset[] => {
  try {
    const saved = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    const usedNames = new Set(PRESETS.map(preset => preset.name.toLowerCase()));

    const hydrated = parsed
      .filter((preset: any) => preset && typeof preset === 'object' && typeof preset.name === 'string')
      .map((preset: any, index: number): Preset => ({
        id: typeof preset.id === 'string' && preset.id ? preset.id : `user-preset-${index}`,
        name: preset.name.trim(),
        description: typeof preset.description === 'string' ? preset.description : 'Custom saved style',
        category: 'custom',
        config: preset.config && typeof preset.config === 'object' ? preset.config as Partial<ButtonConfig> : {},
        isUserPreset: true,
      }))
      .filter((preset: Preset) => {
        const normalized = preset.name.toLowerCase();
        if (!normalized || usedNames.has(normalized)) return false;
        usedNames.add(normalized);
        return true;
      });
    return hydrated;
  } catch (e) {
    console.warn('Failed to load custom presets:', e);
    return [];
  }
};

const loadSavedButtons = (): SavedButtonRecord[] => {
  try {
    const saved = localStorage.getItem(SAVED_BUTTONS_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((button: any) => button && typeof button === 'object' && typeof button.id === 'string')
      .map((button: any) => ({
        id: button.id,
        name: typeof button.name === 'string' ? button.name : 'Saved Button',
        folder: typeof button.folder === 'string' ? button.folder : '',
        tags: Array.isArray(button.tags) ? button.tags.filter((tag: unknown) => typeof tag === 'string') : [],
        yaml: typeof button.yaml === 'string' ? button.yaml : '',
        config: { ...DEFAULT_CONFIG, ...(button.config || {}) },
        useAutoDarkMode: button.useAutoDarkMode !== false,
        activePresetId: typeof button.activePresetId === 'string' ? button.activePresetId : null,
        legacyPresetCondition: button.presetCondition === 'on' || button.presetCondition === 'off' ? button.presetCondition : 'always',
        legacyOffStatePresetId: typeof button.offStatePresetId === 'string' ? button.offStatePresetId : null,
        legacyOnStatePresetId: typeof button.onStatePresetId === 'string' ? button.onStatePresetId : null,
        onStateAppearance: button.onStateAppearance && typeof button.onStateAppearance === 'object' ? button.onStateAppearance : {},
        offStateAppearance: button.offStateAppearance && typeof button.offStateAppearance === 'object' ? button.offStateAppearance : {},
        createdAt: typeof button.createdAt === 'number' ? button.createdAt : Date.now(),
        updatedAt: typeof button.updatedAt === 'number' ? button.updatedAt : Date.now(),
      }));
  } catch (e) {
    console.warn('Failed to load saved buttons:', e);
    return [];
  }
};

const isSamePreset = (a: Preset | null, b: Preset | null): boolean => {
  if (!a || !b) return false;
  if (a.id && b.id) return a.id === b.id;
  return a.name === b.name && a.category === b.category;
};

export const ButtonCardApp: React.FC = () => {
  // Migrate legacy state-color / icon-spin fields from persisted config into the
  // per-state appearance model on first load, so old buttons keep their look.
  const initialStateDesign = useMemo(loadStateDesign, []);
  const initialMigrated = useMemo(() => {
    const loadedConfig = loadSavedConfig();
    const migrated = migrateLegacyStateColors(
      loadedConfig,
      initialStateDesign.onAppearance,
      initialStateDesign.offAppearance,
    );
    if (!initialStateDesign.hasSavedDesign && hasOnOffState(loadedConfig.entity)) {
      migrated.offApp = { ...buildDefaultOffAppearance(loadedConfig), ...migrated.offApp };
    }
    return migrated;
  }, [initialStateDesign]);
  const [config, setConfigInternal] = useState<ButtonConfig>(initialMigrated.config);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importYaml, setImportYaml] = useState('');
  const [importError, setImportError] = useState('');
  const [mobileTab, setMobileTab] = useState<'preview' | 'config' | 'yaml'>('preview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopConfigOpen, setDesktopConfigOpen] = useState(true);
  const [desktopYamlOpen, setDesktopYamlOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [desktopConfigWidth, setDesktopConfigWidth] = useState(() => getResponsiveConfigWidth(window.innerWidth));
  const [yamlCopied, setYamlCopied] = useState(false);
  const [openMagicToApiKey, setOpenMagicToApiKey] = useState(false);
  const [simulatedState, setSimulatedState] = useState<'on' | 'off'>(initialStateDesign.editingState);
  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const [customPresets, setCustomPresets] = useState<Preset[]>(loadCustomPresets);
  const [themes, setThemes] = useState<SavedTheme[]>(loadThemes);
  const [themeChooserOpen, setThemeChooserOpen] = useState(
    () => !initialStateDesign.hasSavedDesign && !localStorage.getItem(STORAGE_KEY)
  );
  const [advancedMode, setAdvancedMode] = useState(
    () => localStorage.getItem(ADVANCED_MODE_STORAGE_KEY) === 'true'
  );
  const [savedButtons, setSavedButtons] = useState<SavedButtonRecord[]>(loadSavedButtons);
  const [queuedButtons, setQueuedButtons] = useState<SavedButtonRecord[]>([]);
  const [showButtonLibrary, setShowButtonLibrary] = useState(false);
  const [environmentReport, setEnvironmentReport] = useState<ButtonBuilderEnvironmentReport | null>(null);
  const [showRequirementsPrompt, setShowRequirementsPrompt] = useState(false);
  const [saveModalState, setSaveModalState] = useState<SaveModalState>(null);
  const [useAutoDarkMode, setUseAutoDarkMode] = useState<boolean>(true);
  const [onStateAppearance, setOnStateAppearance] = useState<Partial<StateAppearanceConfig>>(initialMigrated.onApp);
  const [offStateAppearance, setOffStateAppearance] = useState<Partial<StateAppearanceConfig>>(initialMigrated.offApp);
  const { toastMessage, showToast } = useToast();
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const [historyPast, setHistoryPast] = useState<ButtonConfig[]>([]);
  const [historyFuture, setHistoryFuture] = useState<ButtonConfig[]>([]);
  const historyDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedConfigRef = useRef<ButtonConfig>(loadSavedConfig());
  const isUndoRedoRef = useRef(false);
  const MAX_HISTORY = 50;

  const canUndo = historyPast.length > 0;
  const canRedo = historyFuture.length > 0;
  const availablePresets = useMemo(() => [...PRESETS, ...customPresets], [customPresets]);

  // Mutable refs holding the latest undo/redo logic so that useCallback can
  // use empty deps (stable references) and the keyboard listener is only
  // registered once, even as historyPast / historyFuture / config change.
  const undoImplRef = useRef<() => void>(() => {});
  const redoImplRef = useRef<() => void>(() => {});

  undoImplRef.current = () => {
    if (historyPast.length === 0) return;
    if (historyDebounceRef.current) {
      clearTimeout(historyDebounceRef.current);
      historyDebounceRef.current = null;
    }
    isUndoRedoRef.current = true;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast(prev => prev.slice(0, -1));
    setHistoryFuture(prev => [config, ...prev].slice(0, MAX_HISTORY));
    setConfigInternal(previous);
    lastSavedConfigRef.current = previous;
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  };

  redoImplRef.current = () => {
    if (historyFuture.length === 0) return;
    if (historyDebounceRef.current) {
      clearTimeout(historyDebounceRef.current);
      historyDebounceRef.current = null;
    }
    isUndoRedoRef.current = true;
    const next = historyFuture[0];
    setHistoryFuture(prev => prev.slice(1));
    setHistoryPast(prev => [...prev, config].slice(-MAX_HISTORY));
    setConfigInternal(next);
    lastSavedConfigRef.current = next;
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  };

  const handleUndo = useCallback(() => undoImplRef.current(), []);
  const handleRedo = useCallback(() => redoImplRef.current(), []);

  // Keyboard listener registered once — stable because handleUndo/handleRedo never change.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
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

  // Clear any pending timers when the component unmounts.
  useEffect(() => {
    return () => {
      if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
    };
  }, []);

  // Keep both desktop panes usable when the Home Assistant panel or browser is resized.
  useEffect(() => {
    const handleResize = () => {
      setDesktopConfigWidth(currentWidth => {
        const maxWidth = Math.max(
          DESKTOP_CONFIG_MIN_WIDTH,
          window.innerWidth - DESKTOP_PREVIEW_MIN_WIDTH,
        );
        return Math.min(maxWidth, Math.max(DESKTOP_CONFIG_MIN_WIDTH, currentWidth));
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Warn before closing if there are unsaved session-queue items.
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (queuedButtons.length > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [queuedButtons.length]);

  const isApplyingPresetRef = useRef(false);

  const setConfig: React.Dispatch<React.SetStateAction<ButtonConfig>> = (action) => {
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

  // Debounced autosave — avoids a synchronous localStorage write on every keypress.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        setLastSavedAt(Date.now());
      } catch (e) {
        console.warn('Failed to save config:', e);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [config]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(STATE_DESIGN_STORAGE_KEY, JSON.stringify({
          editingState: simulatedState,
          onAppearance: onStateAppearance,
          offAppearance: offStateAppearance,
        }));
      } catch (error) {
        console.warn('Failed to save state design:', error);
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [simulatedState, onStateAppearance, offStateAppearance]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(customPresets));
    } catch (e) {
      console.warn('Failed to save custom presets:', e);
    }
  }, [customPresets]);

  useEffect(() => {
    try {
      const recordsWithoutLegacyPresetMetadata = savedButtons.map(({
        legacyPresetCondition: _legacyCondition,
        legacyOffStatePresetId: _legacyOff,
        legacyOnStatePresetId: _legacyOn,
        ...record
      }) => record);
      localStorage.setItem(SAVED_BUTTONS_STORAGE_KEY, JSON.stringify(recordsWithoutLegacyPresetMetadata));
    } catch (e) {
      console.warn('Failed to save button library:', e);
    }
  }, [savedButtons]);

  useEffect(() => { persistThemes(themes); }, [themes]);

  useEffect(() => {
    localStorage.setItem(ADVANCED_MODE_STORAGE_KEY, String(advancedMode));
  }, [advancedMode]);

  // Only re-check when the entity changes, not on every config keypress.
  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      (async () => {
        const report = await checkButtonBuilderEnvironment(config);
        if (cancelled) {
          return;
        }

        setEnvironmentReport(report);
        if (report.requirements.some((requirement) => requirement.required && requirement.status === 'missing')) {
          setShowRequirementsPrompt(true);
        }
      })();
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.entity]);

  // Merged ON/OFF appearances: base-config appearance (shared/theme look) as the seed,
  // overlaid with the per-state manual override buffers. `null` for non-binary entities
  // (appearance lives entirely on the base config there).
  const mergedStateAppearances = useMemo(() => {
    if (!hasOnOffState(config.entity)) return null;
    const seed = appearanceFromConfig(config);
    return {
      on: mergeStateAppearance(seed, onStateAppearance),
      off: mergeStateAppearance(seed, offStateAppearance),
    };
  }, [config, onStateAppearance, offStateAppearance]);

  const finalConfig = useMemo(() => {
    const result = { ...config };
    // Drop any legacy synthetic state records (preset-generated or prior
    // state-appearance-*). The user's advanced Conditional Styles are preserved.
    const userStyles = (result.stateStyles || []).filter(
      s => !String(s.id || '').startsWith('state-appearance-') && !String(s.id || '').startsWith('preset-')
    );

    if (mergedStateAppearances) {
      // Inject synthetic merged ON/OFF entries so the live preview (which resolves
      // per-state styling from config.stateStyles) reflects the merged appearance.
      // The YAML generator emits from mergedStateAppearances and skips these.
      result.stateStyles = [
        ...userStyles,
        appearanceToStateStyle(mergedStateAppearances.on, 'on'),
        appearanceToStateStyle(mergedStateAppearances.off, 'off'),
      ];
    } else {
      result.stateStyles = userStyles;
      if (result.cardAnimationTrigger !== 'always') result.cardAnimationTrigger = 'always';
      if (result.iconAnimationTrigger !== 'always') result.iconAnimationTrigger = 'always';
    }

    return result;
  }, [config, mergedStateAppearances]);

  const yamlOutput = useMemo(
    () => generateYaml(finalConfig, mergedStateAppearances),
    [finalConfig, mergedStateAppearances]
  );

  const createButtonRecord = (metadata?: Partial<SaveRecordMetadata>): SavedButtonRecord => {
    const timestamp = Date.now();
    return {
      id: `button-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
      name: (metadata?.name?.trim() || deriveButtonName(config, savedButtons.length + queuedButtons.length + 1)).trim(),
      folder: metadata?.folder?.trim() || '',
      tags: metadata?.tags || [],
      yaml: yamlOutput,
      config: cloneSnapshot(config),
      useAutoDarkMode,
      activePresetId: activePreset?.id || null,
      onStateAppearance: cloneSnapshot(onStateAppearance),
      offStateAppearance: cloneSnapshot(offStateAppearance),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  };

  const resolveSavedPreset = (presetId: string | null): Preset | null => {
    if (!presetId) return null;
    return availablePresets.find((preset) => preset.id === presetId) || null;
  };

  const handleQueueCurrentButton = (): boolean => {
    setQueuedButtons((prev) => [createButtonRecord(), ...prev]);
    return true;
  };

  const handleSaveCurrentButton = (): boolean => {
    const suggestedName = deriveButtonName(config, savedButtons.length + 1);
    setSaveModalState({ mode: 'current', initialName: suggestedName, initialFolder: '', initialTags: '' });
    return true;
  };

  const handleLoadButtonRecord = (record: SavedButtonRecord) => {
    // Migrate legacy state colors / icon spin into the per-state model on load.
    const migrated = migrateLegacyStateColors(
      cloneSnapshot(record.config),
      cloneSnapshot(record.onStateAppearance || {}),
      cloneSnapshot(record.offStateAppearance || {}),
    );
    const active = resolveSavedPreset(record.activePresetId);
    const legacyCondition = record.legacyPresetCondition;
    if (legacyCondition === 'on' && Object.keys(migrated.onApp).length === 0 && active) {
      migrated.onApp = extractAppearance(active.config);
    } else if (legacyCondition === 'off' && Object.keys(migrated.offApp).length === 0 && active) {
      migrated.offApp = extractAppearance(active.config);
    }
    if (Object.keys(migrated.offApp).length === 0) {
      const legacyOffPreset = resolveSavedPreset(record.legacyOffStatePresetId || null);
      if (legacyOffPreset) migrated.offApp = extractAppearance(legacyOffPreset.config);
    }
    if (Object.keys(migrated.onApp).length === 0) {
      const legacyOnPreset = resolveSavedPreset(record.legacyOnStatePresetId || null);
      if (legacyOnPreset) migrated.onApp = extractAppearance(legacyOnPreset.config);
    }

    const nextConfig = migrated.config;
    setConfigInternal(nextConfig);
    lastSavedConfigRef.current = nextConfig;
    setHistoryPast([]);
    setHistoryFuture([]);
    setActivePreset(active);
    setUseAutoDarkMode(record.useAutoDarkMode);
    setOnStateAppearance(migrated.onApp);
    setOffStateAppearance(migrated.offApp);
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
    if (!saveModalState) {
      return;
    }

    if (saveModalState.mode === 'current') {
      setSavedButtons((prev) => [createButtonRecord(metadata), ...prev]);
    } else {
      const queued = queuedButtons.find((button) => button.id === saveModalState.buttonId);
      if (!queued) {
        return;
      }

      const timestamp = Date.now();
      setSavedButtons((prev) => [
        {
          ...cloneSnapshot(queued),
          id: `button-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
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

  const { resetConfirmPending, handleReset } = useResetConfirm(() => {
    setConfig(DEFAULT_CONFIG);
    setActivePreset(null);
    setUseAutoDarkMode(true);
    setOnStateAppearance({});
    setOffStateAppearance(buildDefaultOffAppearance(DEFAULT_CONFIG));
    setSimulatedState('on');
    localStorage.removeItem(STORAGE_KEY);
    // New button: prompt the theme chooser so the user can pick which appearance
    // controls stay global for this build.
    setThemeChooserOpen(true);
  });

  const handleApplyPreset = (preset: Preset) => {
    const isBinary = hasOnOffState(config.entity);
    // Split the preset into appearance (per-state) vs. non-appearance (base config).
    const presetAppearance = extractAppearance(preset.config);
    const applyBaseFields = (base: Partial<StateAppearanceConfig>) => {
      // Non-appearance fields (layout/content/behavior + templates) go to base config.
      const nonAppearance: Partial<ButtonConfig> = { ...preset.config };
      Object.keys(base).forEach(k => { delete (nonAppearance as Record<string, unknown>)[k]; });
      return nonAppearance;
    };

    // Appearance goes to the currently-active editing state; the
    // non-appearance fields refresh the base config.
    isApplyingPresetRef.current = true;
    setConfigInternal(prev => ({
      ...prev,
      ...(isBinary ? applyBaseFields(presetAppearance) : preset.config),
    }));
    setActivePreset(preset);
    isApplyingPresetRef.current = false;

    const targetState = simulatedState;
    if (isBinary) {
      if (targetState === 'on') {
        setOnStateAppearance(prev => ({ ...prev, ...presetAppearance }));
      } else {
        setOffStateAppearance(prev => ({ ...prev, ...presetAppearance }));
      }
    }

    // Auto-dark seeds the OFF appearance from the preset when editing ON.
    if (isBinary && useAutoDarkMode && targetState === 'on') {
      const darkPreset = generateDarkModePreset(preset);
      setOffStateAppearance(prev => ({ ...prev, ...extractAppearance(darkPreset.config) }));
    }
  };

  const handleResetToPreset = () => {
    if (!activePreset) return;
    const isBinary = hasOnOffState(config.entity);
    const presetAppearance = extractAppearance(activePreset.config);
    const nonAppearance: Partial<ButtonConfig> = { ...activePreset.config };
    Object.keys(presetAppearance).forEach(key => {
      delete (nonAppearance as Record<string, unknown>)[key];
    });
    isApplyingPresetRef.current = true;
    setConfigInternal(prev => ({ ...prev, ...(isBinary ? nonAppearance : activePreset.config) }));
    isApplyingPresetRef.current = false;
    if (isBinary && simulatedState === 'on') {
      setOnStateAppearance(prev => ({ ...prev, ...presetAppearance }));
      if (useAutoDarkMode) {
        setOffStateAppearance(prev => ({
          ...prev,
          ...extractAppearance(generateDarkModePreset(activePreset).config),
        }));
      }
    } else if (isBinary) {
      setOffStateAppearance(prev => ({ ...prev, ...presetAppearance }));
    }
  };

  const handlePresetConfigChange = (updates: Partial<ButtonConfig>) => {
    if (!activePreset) return;

    const isBinary = hasOnOffState(config.entity);
    const appearanceUpdates = extractAppearance(updates);
    const baseUpdates: Partial<ButtonConfig> = { ...updates };
    Object.keys(appearanceUpdates).forEach(key => {
      if (isBinary && !(config.themeKeys || []).includes(key)) {
        delete (baseUpdates as Record<string, unknown>)[key];
      }
    });

    isApplyingPresetRef.current = true;
    if (Object.keys(baseUpdates).length > 0) {
      setConfig(prev => ({ ...prev, ...baseUpdates }));
    }

    const nextPreset: Preset = {
      ...activePreset,
      config: { ...activePreset.config, ...updates },
    };
    setActivePreset(nextPreset);

    // Live edits to appearance fields also flow into the active state buffer.
    const stateAppearanceUpdates = Object.fromEntries(
      Object.entries(appearanceUpdates).filter(([key]) => isBinary && !(config.themeKeys || []).includes(key))
    ) as Partial<StateAppearanceConfig>;
    if (Object.keys(stateAppearanceUpdates).length > 0) {
      if (simulatedState === 'on') {
        setOnStateAppearance(prev => ({ ...prev, ...stateAppearanceUpdates }));
        if (useAutoDarkMode) {
          setOffStateAppearance(prev => ({ ...prev, ...extractAppearance(generateDarkModePreset(nextPreset).config) }));
        }
      } else {
        setOffStateAppearance(prev => ({ ...prev, ...stateAppearanceUpdates }));
      }
    }

    isApplyingPresetRef.current = false;
  };

  const handleSaveCustomPreset = (name: string, description: string): { ok: boolean; error?: string } => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      return { ok: false, error: 'Preset name is required.' };
    }
    const exists = availablePresets.some(p => p.name.toLowerCase() === normalizedName.toLowerCase());
    if (exists) {
      return { ok: false, error: `A preset named "${normalizedName}" already exists.` };
    }

    const stateStyleSource = mergedStateAppearances
      ? {
          ...config,
          ...mergedStateAppearances[simulatedState],
          borderStyle: mergedStateAppearances[simulatedState].borderStyle || config.borderStyle,
        }
      : config;
    const preset: Preset = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: normalizedName,
      description: description.trim() || 'Custom saved style',
      category: 'custom',
      config: buildStylePresetConfig(stateStyleSource as ButtonConfig),
      isUserPreset: true,
    };

    setCustomPresets(prev => [preset, ...prev]);
    return { ok: true };
  };

  const handleDeleteCustomPreset = (preset: Preset) => {
    if (!preset.isUserPreset) return;
    setCustomPresets(prev => prev.filter(p => !isSamePreset(p, preset)));
    if (isSamePreset(activePreset, preset)) setActivePreset(null);
  };

  // ---- Theme system ----

  // Change which appearance controls are global (theme). Migrates values across the
  // global<->per-state boundary so nothing visually jumps:
  //  - becoming global: promote the active editing state's value to base config
  //  - becoming per-state: seed both ON/OFF buffers from the base value
  const handleSetThemeKeys = (primaryKeys: string[]) => {
    const nextKeys = expandThemeKeys(primaryKeys);
    const prevKeys = config.themeKeys || [];
    const becameGlobal = nextKeys.filter(k => !prevKeys.includes(k));
    const becamePerState = prevKeys.filter(k => !nextKeys.includes(k));

    const activeBuffer = simulatedState === 'on' ? onStateAppearance : offStateAppearance;
    const baseUpdates: Record<string, unknown> = {};

    // Promote active-state overrides to the base config for controls becoming global.
    becameGlobal.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(activeBuffer, key)) {
        baseUpdates[key] = (activeBuffer as Record<string, unknown>)[key];
      }
    });

    setConfigInternal(prev => ({ ...prev, ...baseUpdates, themeKeys: nextKeys }));

    if (becameGlobal.length > 0) {
      const clearPromotedKeys = (previous: Partial<StateAppearanceConfig>) => {
        const next = { ...previous } as Record<string, unknown>;
        becameGlobal.forEach(key => { delete next[key]; });
        return next as Partial<StateAppearanceConfig>;
      };
      setOnStateAppearance(clearPromotedKeys);
      setOffStateAppearance(clearPromotedKeys);
    }

    // Seed both buffers from the base value for controls returning to per-state,
    // so ON and OFF start from the former shared/theme look.
    if (becamePerState.length > 0) {
      const seed: Record<string, unknown> = {};
      const baseSrc = config as unknown as Record<string, unknown>;
      becamePerState.forEach(key => {
        const v = baseSrc[key];
        if (v !== undefined && v !== '') seed[key] = v;
      });
      const seedFromGlobal = (previous: Partial<StateAppearanceConfig>) => {
        const next = { ...previous } as Record<string, unknown>;
        becamePerState.forEach(key => {
          if (key in seed) next[key] = seed[key];
          else delete next[key];
        });
        return next as Partial<StateAppearanceConfig>;
      };
      setOnStateAppearance(seedFromGlobal);
      setOffStateAppearance(seedFromGlobal);
    }
  };

  const handleApplySavedTheme = (theme: SavedTheme) => {
    const previousKeys = config.themeKeys || [];
    const nextKeys = theme.themeKeys;
    const becameGlobal = nextKeys.filter(key => !previousKeys.includes(key));
    const becamePerState = previousKeys.filter(key => !nextKeys.includes(key));

    if (becamePerState.length > 0) {
      const base = config as unknown as Record<string, unknown>;
      const seedFormerGlobals = (previous: Partial<StateAppearanceConfig>) => {
        const next = { ...previous } as Record<string, unknown>;
        becamePerState.forEach(key => {
          if (base[key] !== undefined) next[key] = base[key];
          else delete next[key];
        });
        return next as Partial<StateAppearanceConfig>;
      };
      setOnStateAppearance(seedFormerGlobals);
      setOffStateAppearance(seedFormerGlobals);
    }

    if (becameGlobal.length > 0) {
      const clearNewGlobals = (previous: Partial<StateAppearanceConfig>) => {
        const next = { ...previous } as Record<string, unknown>;
        becameGlobal.forEach(key => { delete next[key]; });
        return next as Partial<StateAppearanceConfig>;
      };
      setOnStateAppearance(clearNewGlobals);
      setOffStateAppearance(clearNewGlobals);
    }

    setConfigInternal(prev => ({ ...prev, ...theme.values, themeKeys: nextKeys }));
  };

  const handleSaveTheme = (name: string, primaryKeys: string[]): { ok: boolean; error?: string } => {
    const normalized = name.trim();
    if (!normalized) return { ok: false, error: 'Theme name is required.' };
    if (themes.some(t => t.name.toLowerCase() === normalized.toLowerCase())) {
      return { ok: false, error: `A theme named "${normalized}" already exists.` };
    }
    const themeKeys = expandThemeKeys(primaryKeys);
    if (themeKeys.length === 0) return { ok: false, error: 'Select at least one control to save as a theme.' };
    const activeBuffer = simulatedState === 'on' ? onStateAppearance : offStateAppearance;
    const valueSource = { ...config } as ButtonConfig & Record<string, unknown>;
    themeKeys.forEach(key => {
      if (!(config.themeKeys || []).includes(key) && Object.prototype.hasOwnProperty.call(activeBuffer, key)) {
        valueSource[key] = (activeBuffer as Record<string, unknown>)[key];
      }
    });
    const theme: SavedTheme = {
      id: `theme-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: normalized,
      themeKeys,
      values: buildThemeValues(valueSource, themeKeys),
    };
    setThemes(prev => [theme, ...prev]);
    return { ok: true };
  };

  const handleDeleteTheme = (id: string) => setThemes(prev => prev.filter(t => t.id !== id));

  const handleImportYaml = () => {
    setImportError('');
    try {
      const imported = parseButtonCardYaml(importYaml);
      const validated = validateImportedConfig(imported);

      if (Object.keys(validated).length === 0) {
        setImportError('No valid configuration found. Make sure it\'s valid button-card YAML.');
        return;
      }

      // Merge into current config, then migrate legacy state colors / icon spin from
      // the imported YAML into the per-state appearance buffers.
      const merged = { ...config, ...validated };
      const migrated = migrateLegacyStateColors(merged, {}, {});
      setConfig(migrated.config);
      setOnStateAppearance(migrated.onApp);
      setOffStateAppearance(migrated.offApp);
      setIsImportOpen(false);
      setImportYaml('');
    } catch (e: any) {
      console.error('YAML import error:', e);
      setImportError(`Failed to parse YAML: ${e.message || 'Please check the format.'}`);
    }
  };

  const handleCopyYaml = async () => {
    try {
      await navigator.clipboard.writeText(yamlOutput);
      setYamlCopied(true);
      showToast('YAML copied');
      window.setTimeout(() => setYamlCopied(false), 1800);
    } catch {
      showToast('Could not copy YAML');
    }
  };

  const startConfigResize = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = desktopConfigWidth;
    const handleMove = (moveEvent: PointerEvent) => {
      const maxWidth = Math.max(
        DESKTOP_CONFIG_MIN_WIDTH,
        window.innerWidth - DESKTOP_PREVIEW_MIN_WIDTH,
      );
      setDesktopConfigWidth(Math.min(
        maxWidth,
        Math.max(DESKTOP_CONFIG_MIN_WIDTH, startWidth + moveEvent.clientX - startX),
      ));
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const copyCurrentStateAppearance = () => {
    if (simulatedState === 'on') {
      setOffStateAppearance(cloneSnapshot(onStateAppearance));
      showToast('ON appearance copied to OFF');
    } else {
      setOnStateAppearance(cloneSnapshot(offStateAppearance));
      showToast('OFF appearance copied to ON');
    }
  };

  const resetCurrentStateAppearance = () => {
    if (simulatedState === 'on') setOnStateAppearance({});
    else setOffStateAppearance({});
    showToast(`${simulatedState.toUpperCase()} appearance reset to base style`);
  };

  return (
    <div className="flex min-w-0 flex-col h-full bg-black text-white font-sans overflow-hidden selection:bg-blue-500/30">
      <header className="h-12 md:h-14 border-b border-gray-800 flex items-center justify-between px-3 md:px-6 bg-gray-900/50 backdrop-blur-md shrink-0 relative z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <img src={logo} alt="Button Builder logo" className="w-7 h-7 md:w-9 md:h-9 rounded-lg object-contain border border-gray-800 bg-black/40" />
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm md:text-lg tracking-tight text-gray-200">Button Card Builder</h1>
            <span className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-[10px] font-medium text-gray-400">
              {APP_VERSION_LABEL}
            </span>
            {lastSavedAt && (
              <span className="hidden md:inline text-[10px] text-gray-600 tabular-nums">
                Saved {new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2">
          <button onClick={() => setShowButtonLibrary(true)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full text-sm font-medium transition-all" title="Open button library">
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
          <button onClick={handleCopyYaml} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-medium transition-colors" title="Copy generated YAML">
            {yamlCopied ? <Check size={14} /> : <Copy size={14} />}
            {yamlCopied ? 'Copied' : 'Copy YAML'}
          </button>
          <button onClick={() => setIsMagicOpen(true)} className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium transition-all group">
            <Wand2 size={14} className="group-hover:rotate-12 transition-transform" />
            Magic Build
          </button>
          <div className="relative">
            <button
              onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
              className="p-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
              title="More actions"
              aria-label="More actions"
              aria-expanded={desktopMenuOpen}
            >
              <MoreHorizontal size={16} />
            </button>
            {desktopMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-700 bg-gray-900 p-1.5 shadow-2xl z-50">
                <button onClick={() => { setIsImportOpen(true); setDesktopMenuOpen(false); }} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"><Upload size={15} /> Import YAML</button>
                <button onClick={() => { setShowRequirementsPrompt(true); setDesktopMenuOpen(false); }} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"><AlertTriangle size={15} /> Check setup</button>
                <button onClick={() => { setOpenMagicToApiKey(true); setIsMagicOpen(true); setDesktopMenuOpen(false); }} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"><Key size={15} /> Manage AI key</button>
                <div className="my-1 border-t border-gray-800" />
                <button onClick={() => { handleReset(); if (resetConfirmPending) setDesktopMenuOpen(false); }} className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left ${resetConfirmPending ? 'bg-red-600 text-white' : 'text-red-300 hover:bg-red-500/10'}`}><RotateCcw size={15} /> {resetConfirmPending ? 'Confirm reset' : 'Reset to defaults'}</button>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden p-2 text-gray-400 hover:text-white" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-12 md:top-14 left-0 right-0 bg-gray-900 border-b border-gray-800 z-40 p-3 space-y-2 animate-in slide-in-from-top-2">
          <button onClick={() => { setIsMagicOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-left">
            <Wand2 size={18} className="text-indigo-400" />
            <span>Magic Build</span>
          </button>
          <button onClick={() => { setIsImportOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg text-left">
            <Upload size={18} className="text-blue-400" />
            <span>Import YAML</span>
          </button>
          <button onClick={() => { handleCopyYaml(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-left text-white">
            <Copy size={18} />
            <span>Copy YAML</span>
          </button>
          <div className="flex gap-2">
            <button onClick={() => { handleUndo(); setMobileMenuOpen(false); }} disabled={!canUndo} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed">
              <Undo2 size={18} className="text-gray-400" />
              <span className="text-sm">Undo</span>
            </button>
            <button onClick={() => { handleRedo(); setMobileMenuOpen(false); }} disabled={!canRedo} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed">
              <Redo2 size={18} className="text-gray-400" />
              <span className="text-sm">Redo</span>
            </button>
          </div>
          <button onClick={() => { setShowRequirementsPrompt(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg text-left">
            <AlertTriangle size={18} className="text-amber-400" />
            <span>Check Setup</span>
          </button>
          <button onClick={() => { setOpenMagicToApiKey(true); setIsMagicOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg text-left">
            <Key size={18} className="text-purple-400" />
            <span>Manage AI Key</span>
          </button>
          <button onClick={() => { setShowButtonLibrary(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg text-left">
            <FolderOpen size={18} className="text-emerald-400" />
            <span>Button Library</span>
          </button>
          <button onClick={() => { handleReset(); if (resetConfirmPending) setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${resetConfirmPending ? 'bg-red-700' : 'bg-gray-800'}`}>
            <RotateCcw size={18} className={resetConfirmPending ? 'text-white' : 'text-gray-400'} />
            <span>{resetConfirmPending ? 'Confirm Reset?' : 'Reset to Defaults'}</span>
          </button>
        </div>
      )}

      <main className="hidden xl:flex flex-1 min-h-0 overflow-hidden">
        {desktopConfigOpen && <aside className="shrink-0 shadow-xl bg-gray-900 border-r border-gray-800 relative" style={{ width: desktopConfigWidth }}>
          <ConfigPanel
            config={config}
            setConfig={setConfig}
            presets={availablePresets}
            activePreset={activePreset}
            onPresetConfigChange={handlePresetConfigChange}
            onApplyPreset={handleApplyPreset}
            onSaveCustomPreset={handleSaveCustomPreset}
            onDeleteCustomPreset={handleDeleteCustomPreset}
            onResetToPreset={handleResetToPreset}
            useAutoDarkMode={useAutoDarkMode}
            onSetUseAutoDarkMode={setUseAutoDarkMode}
            editingState={simulatedState}
            onEditingStateChange={setSimulatedState}
            onStateAppearance={onStateAppearance}
            offStateAppearance={offStateAppearance}
            onSetOnStateAppearance={setOnStateAppearance}
            onSetOffStateAppearance={setOffStateAppearance}
            onOpenThemeChooser={() => setThemeChooserOpen(true)}
            advancedMode={advancedMode}
            onSetAdvancedMode={setAdvancedMode}
            layout="workbench"
          />
          <div
            onPointerDown={startConfigResize}
            className="absolute -right-1.5 top-0 bottom-0 z-30 w-3 cursor-col-resize group"
            title="Resize configuration panel"
          >
            <div className="absolute left-1/2 top-1/2 h-16 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-700 group-hover:bg-blue-500 transition-colors" />
          </div>
        </aside>}

        <section className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="preview-workbench flex-1 min-h-0 bg-[#0a0a0a] relative flex flex-col">
              <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
              <div className="preview-toolbar relative z-10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-gray-800/70 bg-black/40 backdrop-blur-sm">
                <div className="flex min-w-0 flex-wrap items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wider">
                  <Eye size={14} />
                  Live Preview
                  {config.entity && <span className="normal-case tracking-normal font-mono text-[10px] text-gray-600 max-w-48 truncate">{config.entity}</span>}
                  {activePreset && <span className="normal-case tracking-normal rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300">{activePreset.name}</span>}
                </div>
                <div className="preview-toolbar__actions flex min-w-0 flex-wrap items-center justify-end gap-2">
                  {hasOnOffState(config.entity) && <div className={`flex items-center gap-1.5 rounded-lg border p-1 ${simulatedState === 'on' ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-amber-500/40 bg-amber-500/5'}`}>
                    <button
                      type="button"
                      onClick={() => setSimulatedState(simulatedState === 'on' ? 'off' : 'on')}
                      className="group px-1.5 py-0.5 text-left"
                      aria-label={`Editing for ${simulatedState.toUpperCase()} State. Click to change to ${simulatedState === 'on' ? 'OFF' : 'ON'} State`}
                    >
                      <span className="flex items-baseline gap-1 font-semibold text-gray-400">
                        <span className="text-[10px]">Editing for</span>
                        <span className={`text-sm font-black tracking-wide ${simulatedState === 'on' ? 'text-emerald-300' : 'text-amber-300'}`}>
                          {simulatedState.toUpperCase()}
                        </span>
                        <span className="text-[10px]">State</span>
                      </span>
                      <span className="block text-[8px] font-medium text-gray-600 transition-colors group-hover:text-gray-400">Click to change</span>
                    </button>
                    <button onClick={copyCurrentStateAppearance} className="p-1.5 text-gray-500 hover:text-blue-300" title={`Copy ${simulatedState.toUpperCase()} appearance to ${simulatedState === 'on' ? 'OFF' : 'ON'}`} aria-label={`Copy current state appearance to ${simulatedState === 'on' ? 'off' : 'on'}`}><ArrowRightLeft size={13} /></button>
                    <button onClick={resetCurrentStateAppearance} className="p-1.5 text-gray-500 hover:text-red-300" title={`Reset ${simulatedState.toUpperCase()} appearance`} aria-label="Reset current state appearance"><Eraser size={13} /></button>
                  </div>}
                  <button onClick={() => setThemeChooserOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-900/80 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-800" title="Choose which appearance controls are global (theme)">
                    <Palette size={14} className="text-purple-300" /> Theme
                  </button>
                  <button onClick={() => setDesktopConfigOpen(!desktopConfigOpen)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-900/80 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-gray-800" title={desktopConfigOpen ? 'Hide configuration' : 'Show configuration'}>
                    {desktopConfigOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
                    {desktopConfigOpen ? 'Hide controls' : 'Controls'}
                  </button>
                  <button onClick={() => setDesktopYamlOpen(!desktopYamlOpen)} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${desktopYamlOpen ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : 'border-gray-700 bg-gray-900/80 text-gray-300 hover:bg-gray-800'}`} title={desktopYamlOpen ? 'Hide YAML' : 'Show YAML'}>
                    <Code size={14} /> YAML {desktopYamlOpen ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                  </button>
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden z-0 w-full min-h-0 min-w-0">
                <PreviewCard config={finalConfig} simulatedState={simulatedState} onSimulatedStateChange={setSimulatedState} />
              </div>
              {desktopYamlOpen && <div className="relative z-10 h-[42%] min-h-40 max-h-[28rem] border-t border-gray-700 bg-[#111] flex flex-col shrink-0 shadow-[0_-12px_35px_rgba(0,0,0,0.35)]">
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col p-3">
                <YamlViewer yaml={yamlOutput} config={config} className="flex-1" sessionButtons={queuedButtons} savedButtons={savedButtons} onQueueCurrent={handleQueueCurrentButton} onSaveCurrent={handleSaveCurrentButton} />
                </div>
              </div>}
          </div>
        </section>
      </main>

      <main className="xl:hidden flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileTab === 'preview' && (
            <div className="h-full bg-[#0a0a0a] relative flex flex-col">
              <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
              <div className="flex-1 relative overflow-hidden z-0">
                <PreviewCard config={finalConfig} simulatedState={simulatedState} onSimulatedStateChange={setSimulatedState} />
              </div>
            </div>
          )}

          {mobileTab === 'config' && (
            <div className="h-full overflow-y-auto bg-gray-900">
              <ConfigPanel
                config={config}
                setConfig={setConfig}
                presets={availablePresets}
                activePreset={activePreset}
                onPresetConfigChange={handlePresetConfigChange}
                onApplyPreset={handleApplyPreset}
                onSaveCustomPreset={handleSaveCustomPreset}
                onDeleteCustomPreset={handleDeleteCustomPreset}
                onResetToPreset={handleResetToPreset}
                useAutoDarkMode={useAutoDarkMode}
                onSetUseAutoDarkMode={setUseAutoDarkMode}
                editingState={simulatedState}
                onEditingStateChange={setSimulatedState}
                onStateAppearance={onStateAppearance}
                offStateAppearance={offStateAppearance}
                onSetOnStateAppearance={setOnStateAppearance}
                onSetOffStateAppearance={setOffStateAppearance}
                advancedMode={advancedMode}
                onSetAdvancedMode={setAdvancedMode}
              />
            </div>
          )}

          {mobileTab === 'yaml' && (
            <div className="h-full overflow-hidden bg-[#111] p-3">
              <YamlViewer yaml={yamlOutput} config={config} className="h-full" sessionButtons={queuedButtons} savedButtons={savedButtons} onQueueCurrent={handleQueueCurrentButton} onSaveCurrent={handleSaveCurrentButton} />
            </div>
          )}
        </div>

        <nav className="shrink-0 border-t border-gray-800 bg-gray-900 flex" aria-label="Builder workspace">
          <button onClick={() => setMobileTab('preview')} aria-current={mobileTab === 'preview' ? 'page' : undefined} className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${mobileTab === 'preview' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500'}`}>
            <Eye size={20} />
            <span className="text-[10px] font-medium">Preview</span>
          </button>
          <button onClick={() => setMobileTab('config')} aria-current={mobileTab === 'config' ? 'page' : undefined} className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${mobileTab === 'config' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500'}`}>
            <Settings size={20} />
            <span className="text-[10px] font-medium">Configure</span>
          </button>
          <button onClick={() => setMobileTab('yaml')} aria-current={mobileTab === 'yaml' ? 'page' : undefined} className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${mobileTab === 'yaml' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500'}`}>
            <Code size={20} />
            <span className="text-[10px] font-medium">YAML</span>
          </button>
        </nav>
      </main>

      <MagicBuilder isOpen={isMagicOpen} manageApiKey={openMagicToApiKey} onClose={() => { setIsMagicOpen(false); setOpenMagicToApiKey(false); }} onApply={(newConfig) => setConfig(prev => ({ ...prev, ...newConfig }))} />

      {showRequirementsPrompt && environmentReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 w-full max-w-2xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-400" />
                Home Assistant Requirements Check
              </h3>
              <button onClick={() => setShowRequirementsPrompt(false)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <p className="text-sm text-gray-300">
                Button Builder checked this Home Assistant instance for the dependencies needed to make generated buttons work correctly.
              </p>
              {environmentReport.requirements.map((requirement) => (
                <div key={requirement.id} className="rounded-lg border border-gray-700 bg-gray-800/60 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-white">{requirement.label}</div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      requirement.status === 'ok'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : requirement.required
                          ? 'bg-red-500/15 text-red-300'
                          : 'bg-amber-500/15 text-amber-300'
                    }`}>
                      {requirement.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{requirement.details}</p>
                  {requirement.actionUrl && requirement.actionLabel && (
                    <a href={requirement.actionUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-blue-300 hover:text-blue-200">
                      {requirement.actionLabel}
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-800/50 flex justify-end gap-3">
              <button onClick={() => setShowRequirementsPrompt(false)} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {showButtonLibrary && (
        <LibraryModal
          queuedRecords={queuedButtons}
          savedRecords={savedButtons}
          exportFilenamePrefix="button-card"
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
          initialName={saveModalState.initialName}
          initialFolder={saveModalState.initialFolder}
          initialTags={saveModalState.initialTags}
          existingNames={savedButtons.map((button) => button.name)}
          onConfirm={handleConfirmSaveModal}
          onClose={() => setSaveModalState(null)}
        />
      )}

      {themeChooserOpen && (
        <ThemeChooserModal
          currentThemeKeys={config.themeKeys || []}
          savedThemes={themes}
          onApplyKeys={handleSetThemeKeys}
          onApplySavedTheme={handleApplySavedTheme}
          onSaveTheme={handleSaveTheme}
          onDeleteTheme={handleDeleteTheme}
          onClose={() => setThemeChooserOpen(false)}
        />
      )}

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

              <textarea value={importYaml} onChange={(e) => setImportYaml(e.target.value)} placeholder="type: custom:button-card&#10;entity: light.living_room&#10;name: Living Room&#10;icon: mdi:lightbulb..." className="w-full h-48 bg-black/50 border border-gray-700 rounded-lg p-4 text-white font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none placeholder-gray-600" />

              {importError && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                  <p className="text-red-400 text-xs">{importError}</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-800/50 flex justify-end gap-3">
              <button onClick={() => { setIsImportOpen(false); setImportError(''); }} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">
                Cancel
              </button>
              <button onClick={handleImportYaml} disabled={!importYaml.trim()} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <Upload size={16} />
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

export default ButtonCardApp;
