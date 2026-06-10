import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { parseTagInput, SaveRecordMetadata } from './libraryUtils';

interface Props {
  title?: string;
  description?: string;
  initialName: string;
  initialFolder?: string;
  initialTags?: string;
  existingNames: string[];
  itemNoun?: string;
  onConfirm: (meta: SaveRecordMetadata) => void;
  onClose: () => void;
}

export const SaveRecordModal: React.FC<Props> = ({
  title = 'Save Button',
  description = 'Save this button with a name, optional folder, and tags so it is easy to find later.',
  initialName,
  initialFolder = '',
  initialTags = '',
  existingNames,
  itemNoun = 'button',
  onConfirm,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(initialName);
  const [folderInput, setFolderInput] = useState(initialFolder);
  const [tagsInput, setTagsInput] = useState(initialTags);
  const [nameError, setNameError] = useState('');

  const handleConfirm = () => {
    const name = nameInput.trim();
    if (!name) return;

    const isDuplicate = existingNames.some(existing => existing.toLowerCase() === name.toLowerCase());
    if (isDuplicate) {
      setNameError(`A ${itemNoun} named "${name}" already exists. Choose a different name.`);
      return;
    }

    onConfirm({
      name,
      folder: folderInput.trim(),
      tags: parseTagInput(tagsInput),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Save size={20} className="text-emerald-400" />
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-300">{description}</p>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => { setNameInput(e.target.value); if (nameError) setNameError(''); }}
                placeholder={`${itemNoun.charAt(0).toUpperCase()}${itemNoun.slice(1)} name`}
                className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 ${nameError ? 'border-red-500' : 'border-gray-700'}`}
                autoFocus
              />
              {nameError && <p className="mt-1 text-xs text-red-400">{nameError}</p>}
            </div>
            <input
              type="text"
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder="Folder (optional)"
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500"
            />
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Tags, comma separated"
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="p-6 bg-gray-800/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!nameInput.trim()}
            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save size={16} />
            {title}
          </button>
        </div>
      </div>
    </div>
  );
};
