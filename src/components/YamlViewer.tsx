import React, { useState, useMemo, useEffect } from 'react';
import { Copy, Check, Download, FileCode2, X, LayoutDashboard, Loader2, Plus, Save, Layers3 } from 'lucide-react';
import YAML from 'yaml';
import { ButtonConfig, SavedButtonRecord } from '../types';
import { generateGlobalTemplate } from '../utils/yamlGenerator';
import { addCardsToDashboard, fetchStorageDashboardTargets, isInHomeAssistant, DashboardWriteTarget } from '../services/dashboardService';

interface Props {
  yaml: string;
  className?: string;
  config?: ButtonConfig;
  sessionButtons?: SavedButtonRecord[];
  savedButtons?: SavedButtonRecord[];
  onQueueCurrent?: () => boolean;
  onSaveCurrent?: () => boolean;
}

const highlightYaml = (yaml: string): React.ReactNode[] => {
  return yaml.split('\n').map((line, i) => {
    if (line.trim().startsWith('#')) {
      return <span key={i} className="text-gray-500 italic">{line}{'\n'}</span>;
    }

    const keyMatch = line.match(/^(\s*)([a-zA-Z_][a-zA-Z0-9_-]*)(:)/);
    if (keyMatch) {
      const [, indent, key, colon] = keyMatch;
      const rest = line.slice(keyMatch[0].length);
      let valueElement: React.ReactNode = rest;

      if (/^\s*(true|false)\s*$/.test(rest)) {
        valueElement = <span className="text-orange-400">{rest}</span>;
      } else if (/^\s*-?\d+\.?\d*\s*$/.test(rest)) {
        valueElement = <span className="text-cyan-400">{rest}</span>;
      } else if (/^\s*["'].*["']\s*$/.test(rest)) {
        valueElement = <span className="text-yellow-300">{rest}</span>;
      } else if (rest.includes('[[[')) {
        valueElement = <span className="text-purple-400">{rest}</span>;
      } else if (/^\s*(\/|http|mdi:)/.test(rest)) {
        valueElement = <span className="text-blue-400">{rest}</span>;
      } else if (rest.trim()) {
        valueElement = <span className="text-green-300">{rest}</span>;
      }

      return (
        <span key={i}>
          {indent}
          <span className="text-pink-400">{key}</span>
          <span className="text-gray-400">{colon}</span>
          {valueElement}
          {'\n'}
        </span>
      );
    }

    const arrayMatch = line.match(/^(\s*)(-)(\s+)(.*)$/);
    if (arrayMatch) {
      const [, indent, dash, space, value] = arrayMatch;
      return (
        <span key={i}>
          {indent}
          <span className="text-gray-500">{dash}</span>
          {space}
          <span className="text-green-300">{value}</span>
          {'\n'}
        </span>
      );
    }

    return <span key={i}>{line}{'\n'}</span>;
  });
};

export const YamlViewer: React.FC<Props> = ({
  yaml,
  className = '',
  config,
  sessionButtons = [],
  savedButtons = [],
  onQueueCurrent,
  onSaveCurrent,
}) => {
  const [copied, setCopied] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('custom_style');
  const [templateCopied, setTemplateCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dashboardTargets, setDashboardTargets] = useState<DashboardWriteTarget[]>([]);
  const [loadingDashboardTargets, setLoadingDashboardTargets] = useState(false);
  const [selectedDashboardId, setSelectedDashboardId] = useState('');
  const [selectedViewIndex, setSelectedViewIndex] = useState(0);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [dashboardActionError, setDashboardActionError] = useState('');
  const [addingToDashboard, setAddingToDashboard] = useState(false);
  const [dashboardAdded, setDashboardAdded] = useState(false);
  const [selectedButtonKeys, setSelectedButtonKeys] = useState<string[]>(['current']);
  const [queuedCurrent, setQueuedCurrent] = useState(false);
  const [savedCurrent, setSavedCurrent] = useState(false);
  const inHomeAssistant = useMemo(() => isInHomeAssistant(), []);
  const exportableButtons = useMemo(() => {
    const currentName = config ? (config.name.trim() || config.entity.trim() || 'Current Draft') : 'Current Draft';
    return [
      { key: 'current', name: currentName, yaml, source: 'Current Draft' },
      ...sessionButtons.map((button) => ({ key: `session:${button.id}`, name: button.name, yaml: button.yaml, source: 'Session Queue' })),
      ...savedButtons.map((button) => ({ key: `saved:${button.id}`, name: button.name, yaml: button.yaml, source: 'Saved Button' })),
    ];
  }, [config, savedButtons, sessionButtons, yaml]);

  const highlightedYaml = useMemo(() => highlightYaml(yaml), [yaml]);
  const selectedDashboard = useMemo(
    () => dashboardTargets.find((target) => target.dashboardId === selectedDashboardId) || null,
    [dashboardTargets, selectedDashboardId]
  );
  const selectedView = useMemo(
    () => selectedDashboard?.views[selectedViewIndex] || null,
    [selectedDashboard, selectedViewIndex]
  );
  const globalTemplate = useMemo(() => {
    if (!config) return '';
    return generateGlobalTemplate(config, templateName);
  }, [config, templateName]);

  useEffect(() => {
    if (!dashboardTargets.length) {
      return;
    }
    if (!dashboardTargets.some((target) => target.dashboardId === selectedDashboardId)) {
      setSelectedDashboardId(dashboardTargets[0].dashboardId);
      setSelectedViewIndex(0);
      setSelectedSectionIndex(0);
    }
  }, [dashboardTargets, selectedDashboardId]);

  useEffect(() => {
    if (!selectedDashboard) {
      return;
    }
    if (!selectedDashboard.views[selectedViewIndex]) {
      setSelectedViewIndex(0);
    }
  }, [selectedDashboard, selectedViewIndex]);

  useEffect(() => {
    if (!selectedView || selectedView.type !== 'sections') {
      if (selectedSectionIndex !== 0) {
        setSelectedSectionIndex(0);
      }
      return;
    }
    if (!selectedView.sections[selectedSectionIndex]) {
      setSelectedSectionIndex(0);
    }
  }, [selectedSectionIndex, selectedView]);

  useEffect(() => {
    const allowed = new Set(exportableButtons.map((button) => button.key));
    setSelectedButtonKeys((prev) => {
      const next = prev.filter((key) => allowed.has(key));
      if (next.length > 0) {
        return next;
      }
      const defaults = exportableButtons
        .filter((button) => button.key === 'current' || button.key.startsWith('session:'))
        .map((button) => button.key);
      return defaults.length > 0 ? defaults : (exportableButtons[0] ? [exportableButtons[0].key] : []);
    });
  }, [exportableButtons]);

  const copyText = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
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
    const ok = await copyText(yaml);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'button-card-config.yaml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyTemplate = async () => {
    const ok = await copyText(globalTemplate);
    if (!ok) return;
    setTemplateCopied(true);
    setTimeout(() => setTemplateCopied(false), 2000);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([globalTemplate], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName}-template.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenAddModal = async () => {
    setShowAddModal(true);
    setDashboardActionError('');
    setLoadingDashboardTargets(true);
    setSelectedButtonKeys(
      exportableButtons
        .filter((button) => button.key === 'current' || button.key.startsWith('session:'))
        .map((button) => button.key)
    );

    try {
      const targets = await fetchStorageDashboardTargets();
      setDashboardTargets(targets);
      setSelectedDashboardId((current) => {
        if (targets.some((target) => target.dashboardId === current)) {
          return current;
        }
        return targets[0]?.dashboardId || '';
      });
      setSelectedViewIndex(0);
      setSelectedSectionIndex(0);
    } catch {
      setDashboardTargets([]);
      setDashboardActionError('Failed to load storage dashboards from Home Assistant.');
    } finally {
      setLoadingDashboardTargets(false);
    }
  };

  const handleAddToDashboard = async () => {
    setDashboardActionError('');
    if (!selectedDashboard || !selectedView) {
      setDashboardActionError('Choose a dashboard and view before adding the card.');
      return;
    }
    if (selectedView.type === 'sections' && selectedView.sections.length === 0) {
      setDashboardActionError('The selected sections view has no sections available.');
      return;
    }

    const selectedButtons = exportableButtons.filter((button) => selectedButtonKeys.includes(button.key));
    if (selectedButtons.length === 0) {
      setDashboardActionError('Select at least one button to add to the dashboard.');
      return;
    }

    let cardConfigs: Record<string, any>[];
    try {
      cardConfigs = selectedButtons.map((button) => {
        const parsed = YAML.parse(button.yaml);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error(button.name);
        }
        return parsed as Record<string, any>;
      });
    } catch (error: any) {
      setDashboardActionError(`One of the selected buttons could not be converted into a dashboard card${error?.message ? `: ${error.message}` : '.'}`);
      return;
    }

    setAddingToDashboard(true);
    try {
      await addCardsToDashboard({
        dashboardId: selectedDashboard.dashboardId,
        viewIndex: selectedView.index,
        sectionIndex: selectedView.type === 'sections' ? selectedSectionIndex : undefined,
        cardConfigs,
      });
      setShowAddModal(false);
      setDashboardAdded(true);
      setTimeout(() => setDashboardAdded(false), 2500);
    } catch (error: any) {
      setDashboardActionError(error?.message || 'Failed to add the card to the selected dashboard.');
    } finally {
      setAddingToDashboard(false);
    }
  };

  const toggleSelectedButton = (buttonKey: string) => {
    setSelectedButtonKeys((prev) => (
      prev.includes(buttonKey)
        ? prev.filter((key) => key !== buttonKey)
        : [...prev, buttonKey]
    ));
  };

  const handleQueueCurrentClick = () => {
    const ok = onQueueCurrent?.();
    if (!ok) return;
    setQueuedCurrent(true);
    setTimeout(() => setQueuedCurrent(false), 2000);
  };

  const handleSaveCurrentClick = () => {
    const ok = onSaveCurrent?.();
    if (!ok) return;
    setSavedCurrent(true);
    setTimeout(() => setSavedCurrent(false), 2000);
  };

  return (
    <div className={`yaml-viewer flex flex-col h-full min-h-0 bg-[#1e1e1e] text-gray-300 rounded-lg border border-gray-700 shadow-xl ${className}`}>
      <div className="yaml-viewer__toolbar px-4 py-2 bg-[#252526] border-b border-gray-700 shrink-0">
        <span className="min-w-0 truncate text-xs font-mono text-gray-400" title="button-card-config.yaml">button-card-config.yaml</span>
        <div className="yaml-viewer__actions">
          {onQueueCurrent && (
            <button onClick={handleQueueCurrentClick} className="flex shrink-0 items-center gap-1 text-xs text-gray-400 hover:text-cyan-400 transition-colors p-1 hover:bg-gray-700 rounded" title="Add the current button to this session's export queue" aria-label={queuedCurrent ? 'Current button queued' : `Queue current button. ${sessionButtons.length} queued`}>
              {queuedCurrent ? <Check size={14} className="text-cyan-400" /> : <Layers3 size={14} />}
              <span className="yaml-viewer__action-label">{queuedCurrent ? 'Queued!' : `Queue (${sessionButtons.length})`}</span>
            </button>
          )}
          {onSaveCurrent && (
            <button onClick={handleSaveCurrentClick} className="flex shrink-0 items-center gap-1 text-xs text-gray-400 hover:text-amber-400 transition-colors p-1 hover:bg-gray-700 rounded" title="Save the current button so you can return to it later" aria-label={savedCurrent ? 'Current button saved' : `Save current button. ${savedButtons.length} saved`}>
              {savedCurrent ? <Check size={14} className="text-amber-400" /> : <Save size={14} />}
              <span className="yaml-viewer__action-label">{savedCurrent ? 'Saved!' : `Save (${savedButtons.length})`}</span>
            </button>
          )}
          {inHomeAssistant && (
            <button onClick={handleOpenAddModal} className="flex shrink-0 items-center gap-1 text-xs text-gray-400 hover:text-emerald-400 transition-colors p-1 hover:bg-gray-700 rounded" title="Add the current button to a Home Assistant dashboard" aria-label={dashboardAdded ? 'Added to dashboard' : 'Add to dashboard'}>
              {dashboardAdded ? <Check size={14} className="text-emerald-400" /> : <LayoutDashboard size={14} />}
              <span className="yaml-viewer__action-label">{dashboardAdded ? 'Added!' : 'Add to Dashboard'}</span>
            </button>
          )}
          {config && (
            <button onClick={() => setShowTemplateModal(true)} className="flex shrink-0 items-center gap-1 text-xs text-gray-400 hover:text-purple-400 transition-colors p-1 hover:bg-gray-700 rounded" title="Create Global Template" aria-label="Create global template">
              <FileCode2 size={14} />
              <span className="yaml-viewer__action-label">Global Template</span>
            </button>
          )}
          <button onClick={handleDownload} className="flex shrink-0 items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded" title="Download YAML" aria-label="Download YAML">
            <Download size={14} />
          </button>
          <button onClick={handleCopy} className="flex shrink-0 items-center gap-1 rounded p-1 text-xs hover:bg-gray-700 hover:text-white transition-colors" title="Copy YAML" aria-label={copied ? 'YAML copied' : 'Copy YAML'}>
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            <span className="yaml-viewer__action-label">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <pre className="flex-1 p-4 text-sm font-mono overflow-y-auto overflow-x-auto custom-scrollbar leading-relaxed whitespace-pre min-h-0">
        {highlightedYaml}
      </pre>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-lg border border-gray-700 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-700 rounded-t-lg">
              <div className="flex items-center gap-2">
                <LayoutDashboard size={18} className="text-emerald-400" />
                <span className="font-medium">Add To Dashboard</span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              <p className="text-sm text-gray-400">
                Add one or more buttons to the end of a storage dashboard view. Users can reposition them later in Home Assistant.
              </p>

              {loadingDashboardTargets ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 rounded border border-gray-700 bg-gray-900/60 px-3 py-4">
                  <Loader2 size={16} className="animate-spin" />
                  Loading storage dashboards...
                </div>
              ) : dashboardTargets.length === 0 ? (
                <div className="rounded border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm text-amber-200">
                  No storage dashboards are available in this Home Assistant instance. YAML-managed dashboards still need Copy YAML.
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Dashboard</label>
                    <select
                      value={selectedDashboardId}
                      onChange={(e) => {
                        setSelectedDashboardId(e.target.value);
                        setSelectedViewIndex(0);
                        setSelectedSectionIndex(0);
                      }}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {dashboardTargets.map((target) => (
                        <option key={target.dashboardId} value={target.dashboardId}>
                          {target.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">View</label>
                    <select
                      value={String(selectedViewIndex)}
                      onChange={(e) => {
                        setSelectedViewIndex(Number.parseInt(e.target.value, 10));
                        setSelectedSectionIndex(0);
                      }}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {(selectedDashboard?.views || []).map((view) => (
                        <option key={`${view.index}-${view.title}`} value={view.index}>
                          {view.title} ({view.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedView?.type === 'sections' && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Section</label>
                      <select
                        value={String(selectedSectionIndex)}
                        onChange={(e) => setSelectedSectionIndex(Number.parseInt(e.target.value, 10))}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                      >
                        {selectedView.sections.map((section) => (
                          <option key={`${section.index}-${section.title}`} value={section.index}>
                            {section.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="rounded border border-gray-700 bg-gray-900/60 px-3 py-3 text-xs text-gray-400">
                    Selected buttons will be appended to the end of the chosen {selectedView?.type === 'sections' ? 'section' : 'view'} in the order shown below.
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Buttons To Add</label>
                    <div className="max-h-56 overflow-y-auto rounded border border-gray-700 bg-gray-900/60 divide-y divide-gray-800">
                      {exportableButtons.map((button) => (
                        <label key={button.key} className="flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-gray-800/60">
                          <input
                            type="checkbox"
                            checked={selectedButtonKeys.includes(button.key)}
                            onChange={() => toggleSelectedButton(button.key)}
                            className="mt-1"
                          />
                          <div className="min-w-0">
                            <div className="text-sm text-white truncate">{button.name}</div>
                            <div className="text-xs text-gray-500">{button.source}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {dashboardActionError && (
                <div className="rounded border border-red-500/30 bg-red-500/10 px-3 py-3 text-sm text-red-200">
                  {dashboardActionError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-3 bg-[#252526] border-t border-gray-700 rounded-b-lg">
              <button onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                Cancel
              </button>
              <button
                onClick={handleAddToDashboard}
                disabled={
                  loadingDashboardTargets ||
                  addingToDashboard ||
                  !selectedDashboard ||
                  !selectedView ||
                  (selectedView.type === 'sections' && selectedView.sections.length === 0) ||
                  selectedButtonKeys.length === 0
                }
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToDashboard ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {addingToDashboard ? 'Adding...' : `Add ${selectedButtonKeys.length || ''} Button${selectedButtonKeys.length === 1 ? '' : 's'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-lg border border-gray-700 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-700 rounded-t-lg">
              <div className="flex items-center gap-2">
                <FileCode2 size={18} className="text-purple-400" />
                <span className="font-medium">Create Global Template</span>
              </div>
              <button onClick={() => setShowTemplateModal(false)} className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-700">
              <p className="text-sm text-gray-400 mb-2">
                This creates a reusable template. <strong className="text-yellow-400">Important:</strong> Add this to the <em>top level</em> of your dashboard's raw YAML config.
              </p>
              <p className="text-xs text-gray-500 mb-3">
                In your dashboard: ⋮ menu → Edit Dashboard → ⋮ menu → Raw configuration editor. Paste the <code className="bg-gray-800 px-1 rounded">button_card_templates:</code> section at the top (before <code className="bg-gray-800 px-1 rounded">views:</code>). Then use <code className="bg-gray-800 px-1 rounded">template: {templateName}</code> in any button card.
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Template Name:</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value.replace(/\s+/g, '_'))}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-purple-500 focus:outline-none"
                  placeholder="custom_style"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 min-h-0">
              <pre className="text-sm font-mono bg-[#0d0d0d] p-4 rounded border border-gray-800 overflow-x-auto whitespace-pre">
                {highlightYaml(globalTemplate)}
              </pre>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-t border-gray-700 rounded-b-lg">
              <p className="text-xs text-gray-500">
                ⚠️ Must be at top level of dashboard YAML (before views:), not inside a card
              </p>
              <div className="flex items-center gap-2">
                <button onClick={handleDownloadTemplate} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                  <Download size={14} />
                  Download
                </button>
                <button onClick={handleCopyTemplate} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors">
                  {templateCopied ? <Check size={14} /> : <Copy size={14} />}
                  {templateCopied ? 'Copied!' : 'Copy Template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};