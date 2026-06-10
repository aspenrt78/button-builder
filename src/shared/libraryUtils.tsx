import React, { useEffect, useRef, useState } from 'react';

export interface SaveRecordMetadata {
  name: string;
  folder: string;
  tags: string[];
}

export interface LibraryRecordBase {
  id: string;
  name: string;
  folder: string;
  tags: string[];
  updatedAt: number;
  /** Generated card YAML, used by the library Export All backup. */
  yaml?: string;
}

/**
 * Download all saved records as a single .yaml backup file.
 * Cards are emitted as a YAML list so the file can be pasted under a
 * dashboard's `cards:` key (or re-imported one card at a time).
 */
export const downloadLibraryBackup = (records: LibraryRecordBase[], filenamePrefix: string): void => {
  const date = new Date().toISOString().slice(0, 10);
  const blocks = records
    .filter(record => record.yaml)
    .map(record => {
      const header = `  # ${record.name}${record.folder ? ` — ${record.folder}` : ''}`;
      const indented = (record.yaml || '')
        .split('\n')
        .map((line, i) => (i === 0 ? `  - ${line}` : `    ${line}`))
        .join('\n');
      return `${header}\n${indented}`;
    });
  const content = `# Library backup — ${date}\n# ${blocks.length} card${blocks.length === 1 ? '' : 's'}\ncards:\n${blocks.join('\n')}\n`;

  const dataUri = 'data:text/yaml;charset=utf-8,' + encodeURIComponent(content);
  const link = document.createElement('a');
  link.setAttribute('href', dataUri);
  link.setAttribute('download', `${filenamePrefix}-library-${date}.yaml`);
  link.click();
};

export const parseTagInput = (raw: string): string[] =>
  raw
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
    .filter((tag, index, all) => all.findIndex(item => item.toLowerCase() === tag.toLowerCase()) === index);

export const cloneSnapshot = <T,>(value: T): T => structuredClone(value);

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showToast = (message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToastMessage(message);
    timerRef.current = setTimeout(() => setToastMessage(null), 2500);
  };

  return { toastMessage, showToast };
};

export const Toast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-full shadow-xl animate-in fade-in slide-in-from-bottom-2 pointer-events-none">
      {message}
    </div>
  );
};

export const useResetConfirm = (onConfirmedReset: () => void, windowMs = 3000) => {
  const [resetConfirmPending, setResetConfirmPending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(onConfirmedReset);
  callbackRef.current = onConfirmedReset;

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleReset = () => {
    if (!resetConfirmPending) {
      setResetConfirmPending(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setResetConfirmPending(false), windowMs);
      return;
    }
    setResetConfirmPending(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    callbackRef.current();
  };

  return { resetConfirmPending, handleReset };
};
