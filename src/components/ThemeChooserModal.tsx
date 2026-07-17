import React, { useState } from 'react';
import { Palette, Save, Check, Trash2 } from 'lucide-react';
import { SavedTheme } from '../types';
import { THEME_ELIGIBLE_CONTROLS, activePrimaryKeys } from '../utils/themes';

interface Props {
  currentThemeKeys: string[];
  savedThemes: SavedTheme[];
  onApplyKeys: (primaryKeys: string[]) => void;
  onApplySavedTheme: (theme: SavedTheme) => void;
  onSaveTheme: (name: string, primaryKeys: string[]) => { ok: boolean; error?: string };
  onDeleteTheme: (id: string) => void;
  onClose: () => void;
}

// A "theme" is a set of appearance controls the user keeps global (single value that
// persists across a button's ON/OFF states) instead of editing per-state. This modal
// lets the user pick those controls, load a saved theme, or save the current selection.
export const ThemeChooserModal: React.FC<Props> = ({
  currentThemeKeys,
  savedThemes,
  onApplyKeys,
  onApplySavedTheme,
  onSaveTheme,
  onDeleteTheme,
  onClose,
}) => {
  const [selected, setSelected] = useState<string[]>(() => activePrimaryKeys(currentThemeKeys));
  const [saveName, setSaveName] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveOk, setSaveOk] = useState(false);

  const toggle = (key: string) => {
    setSelected(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
  };

  const handleApply = () => {
    onApplyKeys(selected);
    onClose();
  };

  const handleSave = () => {
    // Apply the current selection first so themeKeys is up to date, then save.
    onApplyKeys(selected);
    const result = onSaveTheme(saveName, selected);
    if (!result.ok) {
      setSaveError(result.error || 'Could not save theme.');
      setSaveOk(false);
      return;
    }
    setSaveError('');
    setSaveOk(true);
    setSaveName('');
    window.setTimeout(() => setSaveOk(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette size={20} className="text-purple-400" />
            Theme options
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <p className="text-sm text-gray-300">
            Would you like to make any of these options part of your <span className="text-purple-300 font-semibold">theme</span>?
          </p>
          <p className="text-xs text-gray-500">
            A theme is a set of appearance options that stay <span className="text-gray-300">global</span> — they persist
            across a button's ON/OFF states instead of being set separately for each. Anything you don't select stays
            per-state.
          </p>

          {savedThemes.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Load a saved theme</p>
              <div className="flex flex-col gap-1.5">
                {savedThemes.map(theme => (
                  <div key={theme.id} className="flex items-center gap-2">
                    <button
                      onClick={() => { onApplySavedTheme(theme); onClose(); }}
                      className="flex-1 text-left px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-500/50 text-sm text-white"
                    >
                      {theme.name}
                      <span className="ml-2 text-[10px] text-gray-500">{theme.themeKeys.length} settings</span>
                    </button>
                    <button
                      onClick={() => onDeleteTheme(theme.id)}
                      className="p-2 text-gray-500 hover:text-red-400"
                      aria-label={`Delete theme ${theme.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Global (theme) controls</p>
            <div className="grid grid-cols-2 gap-2">
              {THEME_ELIGIBLE_CONTROLS.map(ctrl => {
                const active = selected.includes(ctrl.key as string);
                return (
                  <button
                    key={ctrl.key as string}
                    onClick={() => toggle(ctrl.key as string)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                      active
                        ? 'bg-purple-600/20 border-purple-500/60 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center border ${active ? 'bg-purple-500 border-purple-500' : 'border-gray-600'}`}>
                      {active && <Check size={12} className="text-white" />}
                    </span>
                    {ctrl.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-800">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Save current selection as a theme</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={saveName}
                onChange={(e) => { setSaveName(e.target.value); if (saveError) setSaveError(''); }}
                placeholder="Theme name"
                className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500"
              />
              <button
                onClick={handleSave}
                disabled={!saveName.trim() || selected.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 disabled:opacity-50"
              >
                {saveOk ? <Check size={15} /> : <Save size={15} />}
                {saveOk ? 'Saved' : 'Save'}
              </button>
            </div>
            {saveError && <p className="text-xs text-red-400">{saveError}</p>}
          </div>
        </div>

        <div className="p-6 bg-gray-800/50 flex justify-end gap-3 border-t border-gray-800">
          <button onClick={() => { onApplyKeys([]); onClose(); }} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">
            Start with no theme
          </button>
          <button
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 transition-all"
          >
            <Palette size={16} />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
