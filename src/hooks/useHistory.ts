import { useState, useRef, useCallback, useEffect } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseHistoryReturn<T> {
  state: T;
  setState: (action: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

const MAX_HISTORY_SIZE = 50;

/**
 * Custom hook for state management with undo/redo functionality
 * @param initialState The initial state value
 * @param debounceMs Debounce time in ms before saving to history (prevents rapid changes from flooding history)
 */
export function useHistory<T>(
  initialState: T,
  debounceMs: number = 500
): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<T>(initialState);
  const isUndoRedoRef = useRef(false);

  // Deep comparison helper (simple JSON comparison)
  const areEqual = (a: T, b: T): boolean => {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return a === b;
    }
  };

  const setState = useCallback((action: T | ((prev: T) => T)) => {
    setHistory((prev) => {
      const newPresent = typeof action === 'function' 
        ? (action as (prev: T) => T)(prev.present) 
        : action;

      // If this is from undo/redo, don't add to history
      if (isUndoRedoRef.current) {
        return { ...prev, present: newPresent };
      }

      // Clear any pending debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // If value hasn't changed from present, just return
      if (areEqual(newPresent, prev.present)) {
        return prev;
      }

      // Debounce: only save to history after delay
      debounceRef.current = setTimeout(() => {
        setHistory((current) => {
          // Only add to past if significantly different from last saved
          if (!areEqual(current.present, lastSavedRef.current)) {
            const newPast = [...current.past, lastSavedRef.current].slice(-MAX_HISTORY_SIZE);
            lastSavedRef.current = current.present;
            return {
              past: newPast,
              present: current.present,
              future: [], // Clear future on new action
            };
          }
          return current;
        });
      }, debounceMs);

      return {
        past: prev.past,
        present: newPresent,
        future: [], // Clear future on new action
      };
    });
  }, [debounceMs]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);

      isUndoRedoRef.current = true;
      lastSavedRef.current = previous;

      // Reset the flag after state update
      setTimeout(() => {
        isUndoRedoRef.current = false;
      }, 0);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future].slice(0, MAX_HISTORY_SIZE),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      isUndoRedoRef.current = true;
      lastSavedRef.current = next;

      // Reset the flag after state update
      setTimeout(() => {
        isUndoRedoRef.current = false;
      }, 0);

      return {
        past: [...prev.past, prev.present].slice(-MAX_HISTORY_SIZE),
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory((prev) => ({
      past: [],
      present: prev.present,
      future: [],
    }));
    lastSavedRef.current = history.present;
  }, [history.present]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Z (undo) or Ctrl+Shift+Z / Ctrl+Y (redo)
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

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    clearHistory,
  };
}
