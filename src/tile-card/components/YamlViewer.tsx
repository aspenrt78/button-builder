// Tile Card YAML Viewer Component

import React, { useState } from 'react';
import { FileCode, Copy, Check, Layers3, Save } from 'lucide-react';
import { SavedTileRecord } from '../types';

interface Props {
  yaml: string;
  sessionButtons?: SavedTileRecord[];
  savedButtons?: SavedTileRecord[];
  onQueueCurrent?: () => boolean;
  onSaveCurrent?: () => boolean;
}

export const YamlViewer: React.FC<Props> = ({
  yaml,
  sessionButtons = [],
  savedButtons = [],
  onQueueCurrent,
  onSaveCurrent,
}) => {
  const [copied, setCopied] = useState(false);
  const [queuedCurrent, setQueuedCurrent] = useState(false);
  const [savedCurrent, setSavedCurrent] = useState(false);

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

  const handleQueue = () => {
    if (!onQueueCurrent?.()) return;
    setQueuedCurrent(true);
    setTimeout(() => setQueuedCurrent(false), 2000);
  };

  const handleSave = () => {
    if (!onSaveCurrent?.()) return;
    setSavedCurrent(true);
    setTimeout(() => setSavedCurrent(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <div className="shrink-0 px-4 py-3 border-b border-gray-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileCode size={16} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-300">Generated YAML</span>
        </div>
        <div className="flex items-center gap-2">
          {onQueueCurrent && (
            <button onClick={handleQueue} className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${queuedCurrent ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'}`}>
              <Layers3 size={12} />
              {queuedCurrent ? 'Queued' : `Queue${sessionButtons.length ? ` (${sessionButtons.length})` : ''}`}
            </button>
          )}
          {onSaveCurrent && (
            <button onClick={handleSave} className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${savedCurrent ? 'bg-emerald-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'}`}>
              <Save size={12} />
              {savedCurrent ? 'Saving...' : `Save${savedButtons.length ? ` (${savedButtons.length})` : ''}`}
            </button>
          )}
          <button onClick={handleCopy} className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'}`}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
          {yaml || '# Configure your tile card to see YAML output'}
        </pre>
      </div>
    </div>
  );
};