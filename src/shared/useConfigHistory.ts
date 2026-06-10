import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface Options {
  maxHistory?: number;
  debounceMs?: number;
}

export function useConfigHistory<T>(initial: T | (() => T), options: Options = {}) {
  const { maxHistory = 50, debounceMs = 500 } = options;
  const [config, setConfigInternal] = useState<T>(initial);
  const [historyPast, setHistoryPast] = useState<T[]>([]);
  const [historyFuture, setHistoryFuture] = useState<T[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<T>(config);
  const isUndoRedoRef = useRef(false);

  const canUndo = historyPast.length > 0;
  const canRedo = historyFuture.length > 0;

  // Mutable refs hold the latest undo/redo logic so the exposed callbacks are
  // stable and the keyboard listener registers only once.
  const undoImplRef = useRef<() => void>(() => {});
  const redoImplRef = useRef<() => void>(() => {});

  undoImplRef.current = () => {
    if (historyPast.length === 0) return;
    isUndoRedoRef.current = true;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast(prev => prev.slice(0, -1));
    setHistoryFuture(prev => [config, ...prev].slice(0, maxHistory));
    setConfigInternal(previous);
    lastSavedRef.current = previous;
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  };

  redoImplRef.current = () => {
    if (historyFuture.length === 0) return;
    isUndoRedoRef.current = true;
    const next = historyFuture[0];
    setHistoryFuture(prev => prev.slice(1));
    setHistoryPast(prev => [...prev, config].slice(-maxHistory));
    setConfigInternal(next);
    lastSavedRef.current = next;
    setTimeout(() => { isUndoRedoRef.current = false; }, 0);
  };

  const undo = useCallback(() => undoImplRef.current(), []);
  const redo = useCallback(() => redoImplRef.current(), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const setConfig: Dispatch<SetStateAction<T>> = useCallback((action) => {
    setConfigInternal(prev => {
      const result = typeof action === 'function' ? (action as (p: T) => T)(prev) : action;
      if (!isUndoRedoRef.current) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          if (JSON.stringify(result) !== JSON.stringify(lastSavedRef.current)) {
            setHistoryPast(p => [...p, lastSavedRef.current].slice(-maxHistory));
            setHistoryFuture([]);
            lastSavedRef.current = result;
          }
        }, debounceMs);
      }
      return result;
    });
  }, [maxHistory, debounceMs]);

  /** Replace the config and clear history (e.g. when loading a saved record). */
  const replaceConfig = useCallback((next: T) => {
    setConfigInternal(next);
    lastSavedRef.current = next;
    setHistoryPast([]);
    setHistoryFuture([]);
  }, []);

  return { config, setConfig, replaceConfig, undo, redo, canUndo, canRedo };
}
