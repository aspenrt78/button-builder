import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { SavedButtonRecord } from '../types';
import {
  buildButtonLibraryEnvelope,
  hasSystemButtonLibraryConnection,
  parseButtonLibrary,
  readSystemButtonLibrary,
  subscribeSystemButtonLibrary,
  writeSystemButtonLibrary,
} from '../services/buttonLibraryService';

export type ButtonLibraryStorageStatus = 'local' | 'syncing' | 'shared' | 'error';

const fingerprint = (records: SavedButtonRecord[]): string => JSON.stringify(records);

const mergeMigrationRecords = (
  localRecords: SavedButtonRecord[],
  storedRecords: SavedButtonRecord[],
): SavedButtonRecord[] => {
  const records = new Map<string, SavedButtonRecord>();
  [...storedRecords, ...localRecords].forEach((record) => {
    const existing = records.get(record.id);
    if (!existing || record.updatedAt >= existing.updatedAt) records.set(record.id, record);
  });
  return Array.from(records.values()).sort((a, b) => b.updatedAt - a.updatedAt);
};

export const useSharedButtonLibrary = (
  savedButtons: SavedButtonRecord[],
  setSavedButtons: Dispatch<SetStateAction<SavedButtonRecord[]>>,
): ButtonLibraryStorageStatus => {
  const [status, setStatus] = useState<ButtonLibraryStorageStatus>('local');
  const latestRecordsRef = useRef(savedButtons);
  const remoteValueRef = useRef<unknown>(null);
  const readyRef = useRef(false);
  const lastSyncedFingerprintRef = useRef('');
  const writeTimerRef = useRef<number | null>(null);

  latestRecordsRef.current = savedButtons;

  useEffect(() => {
    if (!hasSystemButtonLibraryConnection()) {
      setStatus('local');
      return;
    }

    let active = true;
    let unsubscribe: (() => void) | null = null;
    setStatus('syncing');

    const publish = async (records: SavedButtonRecord[], existingValue: unknown) => {
      const value = buildButtonLibraryEnvelope(records, existingValue);
      const nextFingerprint = fingerprint(records);
      lastSyncedFingerprintRef.current = nextFingerprint;
      remoteValueRef.current = value;
      try {
        await writeSystemButtonLibrary(value);
        if (active) setStatus('shared');
      } catch (error) {
        lastSyncedFingerprintRef.current = '';
        if (active) setStatus('error');
        console.warn('Failed to save shared button library:', error);
      }
    };

    const applyRemoteValue = async (value: unknown) => {
      if (!active) return;
      remoteValueRef.current = value;
      const parsed = parseButtonLibrary(value);

      if (parsed.authoritative) {
        const remoteFingerprint = fingerprint(parsed.records);
        lastSyncedFingerprintRef.current = remoteFingerprint;
        if (remoteFingerprint !== fingerprint(latestRecordsRef.current)) setSavedButtons(parsed.records);
        readyRef.current = true;
        setStatus('shared');
        return;
      }

      // First run: publish the existing browser library, preserving any foreign
      // presets and any early `records`-envelope data already present under the
      // Button Builder-owned key.
      const migrationRecords = mergeMigrationRecords(latestRecordsRef.current, parsed.records);
      if (fingerprint(migrationRecords) !== fingerprint(latestRecordsRef.current)) {
        latestRecordsRef.current = migrationRecords;
        setSavedButtons(migrationRecords);
      }
      readyRef.current = true;
      await publish(migrationRecords, value);
    };

    const subscription = subscribeSystemButtonLibrary((value) => {
      void applyRemoteValue(value);
    });

    if (subscription) {
      subscription
        .then((stop) => {
          if (!active) stop();
          else unsubscribe = stop;
        })
        .catch(async (error) => {
          console.warn('Failed to subscribe to shared button library:', error);
          try {
            await applyRemoteValue(await readSystemButtonLibrary());
          } catch (readError) {
            if (active) setStatus('error');
            console.warn('Failed to load shared button library:', readError);
          }
        });
    } else {
      readSystemButtonLibrary()
        .then(applyRemoteValue)
        .catch((error) => {
          if (active) setStatus('error');
          console.warn('Failed to load shared button library:', error);
        });
    }

    return () => {
      active = false;
      unsubscribe?.();
      readyRef.current = false;
      if (writeTimerRef.current !== null) window.clearTimeout(writeTimerRef.current);
    };
  }, [setSavedButtons]);

  useEffect(() => {
    if (!readyRef.current) return;
    const nextFingerprint = fingerprint(savedButtons);
    if (nextFingerprint === lastSyncedFingerprintRef.current) return;
    if (writeTimerRef.current !== null) window.clearTimeout(writeTimerRef.current);

    writeTimerRef.current = window.setTimeout(async () => {
      const value = buildButtonLibraryEnvelope(savedButtons, remoteValueRef.current);
      lastSyncedFingerprintRef.current = nextFingerprint;
      remoteValueRef.current = value;
      try {
        await writeSystemButtonLibrary(value);
        setStatus('shared');
      } catch (error) {
        lastSyncedFingerprintRef.current = '';
        setStatus('error');
        console.warn('Failed to save shared button library:', error);
      }
    }, 350);

    return () => {
      if (writeTimerRef.current !== null) window.clearTimeout(writeTimerRef.current);
    };
  }, [savedButtons]);

  return status;
};
