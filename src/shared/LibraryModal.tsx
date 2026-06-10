import React, { useMemo, useState } from 'react';
import { FolderOpen, Save, Trash2, Pencil, FileDown } from 'lucide-react';
import { LibraryRecordBase, SaveRecordMetadata, parseTagInput, downloadLibraryBackup } from './libraryUtils';

interface Props<R extends LibraryRecordBase> {
  title?: string;
  itemNoun?: string;
  queuedRecords: R[];
  savedRecords: R[];
  loadAccentClass?: string;
  emptyQueueText?: string;
  emptySavedText?: string;
  /** Filename prefix for the Export All backup; the button is hidden when omitted. */
  exportFilenamePrefix?: string;
  onClose: () => void;
  onLoad: (record: R) => void;
  onSaveQueued: (id: string) => void;
  onRemoveQueued: (id: string) => void;
  onClearQueue: () => void;
  onDelete: (id: string) => void;
  onCommitEdit: (id: string, meta: SaveRecordMetadata) => void;
}

export function LibraryModal<R extends LibraryRecordBase>({
  title = 'Button Library',
  itemNoun = 'button',
  queuedRecords,
  savedRecords,
  loadAccentClass = 'bg-blue-600 hover:bg-blue-500',
  emptyQueueText,
  emptySavedText,
  exportFilenamePrefix,
  onClose,
  onLoad,
  onSaveQueued,
  onRemoveQueued,
  onClearQueue,
  onDelete,
  onCommitEdit,
}: Props<R>) {
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingFolder, setEditingFolder] = useState('');
  const [editingTags, setEditingTags] = useState('');

  const availableFolders = useMemo(() => {
    const folders = Array.from(new Set(savedRecords.map(record => record.folder.trim()).filter(Boolean)));
    return folders.sort((a, b) => a.localeCompare(b));
  }, [savedRecords]);

  const filteredRecords = useMemo(() => {
    const normalizedTag = tagFilter.trim().toLowerCase();
    const normalizedSearch = search.trim().toLowerCase();
    return savedRecords.filter((record) => {
      const matchesFolder = folderFilter === 'all' || record.folder === folderFilter;
      const matchesTag = !normalizedTag || record.tags.some(tag => tag.toLowerCase().includes(normalizedTag));
      const matchesSearch = !normalizedSearch || record.name.toLowerCase().includes(normalizedSearch);
      return matchesFolder && matchesTag && matchesSearch;
    });
  }, [savedRecords, folderFilter, tagFilter, search]);

  const groupedRecords = useMemo(() => {
    const groups = new Map<string, R[]>();
    filteredRecords.forEach((record) => {
      const folder = record.folder.trim() || 'Unfiled';
      const existing = groups.get(folder) || [];
      existing.push(record);
      groups.set(folder, existing);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([folder, records]) => ({ folder, records }));
  }, [filteredRecords]);

  const handleStartEdit = (record: R) => {
    setEditingId(record.id);
    setEditingName(record.name);
    setEditingFolder(record.folder);
    setEditingTags(record.tags.join(', '));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingFolder('');
    setEditingTags('');
  };

  const handleCommitEdit = (id: string) => {
    const name = editingName.trim();
    if (!name) return;
    onCommitEdit(id, {
      name,
      folder: editingFolder.trim(),
      tags: parseTagInput(editingTags),
    });
    handleCancelEdit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 w-full max-w-4xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderOpen size={20} className="text-emerald-400" />
            {title}
          </h3>
          <div className="flex items-center gap-3">
            {exportFilenamePrefix && savedRecords.some(r => r.yaml) && (
              <button
                onClick={() => downloadLibraryBackup(savedRecords, exportFilenamePrefix)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors"
                title="Download all saved cards as one .yaml backup file"
              >
                <FileDown size={14} />
                Export All
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ×
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Session Queue</h4>
              {queuedRecords.length > 0 && (
                <button onClick={onClearQueue} className="text-xs text-gray-400 hover:text-white">
                  Clear Queue
                </button>
              )}
            </div>
            {queuedRecords.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-700 p-4 text-sm text-gray-500">
                {emptyQueueText || `Queue ${itemNoun}s from the YAML panel to export a batch in one go.`}
              </div>
            ) : (
              <div className="space-y-3">
                {queuedRecords.map((record) => (
                  <div key={record.id} className="rounded-lg border border-gray-700 bg-gray-800/60 p-4 space-y-3">
                    <div>
                      <div className="text-sm font-medium text-white">{record.name}</div>
                      <div className="text-xs text-gray-500">Queued for this session</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => onLoad(record)} className={`px-3 py-1.5 text-xs text-white rounded ${loadAccentClass}`}>Load</button>
                      <button onClick={() => onSaveQueued(record.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded"><Save size={12} /> Save</button>
                      <button onClick={() => onRemoveQueued(record.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"><Trash2 size={12} /> Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Saved {itemNoun.charAt(0).toUpperCase()}{itemNoun.slice(1)}s</h4>
              <div className="text-xs text-gray-500">Stored in browser</div>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500"
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <select value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white">
                <option value="all">All folders</option>
                {availableFolders.map((folder) => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
              <input type="text" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} placeholder="Filter by tag" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500" />
            </div>
            {savedRecords.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-700 p-4 text-sm text-gray-500">
                {emptySavedText || `Save ${itemNoun}s to revisit and export them later.`}
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-700 p-4 text-sm text-gray-500">
                No saved {itemNoun}s match the current search/filters.
              </div>
            ) : (
              <div className="space-y-4">
                {groupedRecords.map(({ folder, records }) => (
                  <div key={folder} className="space-y-3">
                    <div className="sticky top-0 z-10 flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950/90 px-3 py-2 backdrop-blur-sm">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">{folder}</div>
                      <div className="text-[11px] text-gray-500">{records.length} saved</div>
                    </div>
                    {records.map((record) => {
                      const isEditing = editingId === record.id;
                      return (
                        <div key={record.id} className="rounded-lg border border-gray-700 bg-gray-800/60 p-4 space-y-3">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="grid gap-3 sm:grid-cols-2">
                                <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} placeholder="Name" className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500" />
                                <input type="text" value={editingFolder} onChange={(e) => setEditingFolder(e.target.value)} placeholder="Folder" className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500" />
                              </div>
                              <input type="text" value={editingTags} onChange={(e) => setEditingTags(e.target.value)} placeholder="Tags, comma separated" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500" />
                              <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleCommitEdit(record.id)} className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded">Save Details</button>
                                <button onClick={handleCancelEdit} className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="text-sm font-medium text-white">{record.name}</div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {record.folder && (
                                    <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-[10px] text-blue-300 uppercase tracking-wide">
                                      {record.folder}
                                    </span>
                                  )}
                                  {record.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-700 text-[10px] text-gray-200">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="text-xs text-gray-500">Updated {new Date(record.updatedAt).toLocaleString()}</div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button onClick={() => onLoad(record)} className={`px-3 py-1.5 text-xs text-white rounded ${loadAccentClass}`}>Load</button>
                                <button onClick={() => handleStartEdit(record)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"><Pencil size={12} /> Edit</button>
                                <button onClick={() => onDelete(record.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"><Trash2 size={12} /> Delete</button>
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
  );
}
