'use client';

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from 'react';
import type { Config } from '@/lib/types';

type PublishState = 'idle' | 'saving' | 'saved' | 'error';

type ConfigContextValue = {
  /** What the page renders. In settings mode this is the unsaved draft. */
  config: Config;
  /** What is actually stored, for dirty-checking. */
  saved: Config;
  isSettingsMode: boolean;
  /** Present only when the server validated it. Null in public mode. */
  editKey: string | null;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  isDirty: boolean;
  publishState: PublishState;
  publishError: string | null;
  update: (patch: Partial<Config>) => void;
  publish: () => Promise<boolean>;
  resetPublishState: () => void;
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function useConfig(): ConfigContextValue {
  const value = useContext(ConfigContext);
  if (!value) throw new Error('useConfig must be used inside <ConfigProvider>');
  return value;
}

export function ConfigProvider({
  initialConfig,
  isSettingsMode,
  editKey,
  children,
}: {
  initialConfig: Config;
  isSettingsMode: boolean;
  /** Only ever populated when the server has already validated the key. */
  editKey: string | null;
  children: ReactNode;
}) {
  const [saved, setSaved] = useState(initialConfig);
  const [draft, setDraft] = useState(initialConfig);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [publishState, setPublishState] = useState<PublishState>('idle');
  const [publishError, setPublishError] = useState<string | null>(null);

  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const update = useCallback((patch: Partial<Config>) => {
    // Edits show in the live preview immediately; nothing reaches the store
    // until Publish.
    setDraft((current) => ({ ...current, ...patch }));
    setPublishState('idle');
  }, []);

  const draftRef = useRef(draft);
  draftRef.current = draft;

  const publish = useCallback(async () => {
    if (!editKey) return false;
    setPublishState('saving');
    setPublishError(null);

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-edit-key': editKey },
        body: JSON.stringify(draftRef.current),
      });
      const body = (await response.json()) as { error?: string; config?: Config };

      if (!response.ok) {
        setPublishState('error');
        setPublishError(body.error ?? 'Could not publish. Try again.');
        return false;
      }

      setSaved(body.config ?? draftRef.current);
      setPublishState('saved');
      return true;
    } catch {
      setPublishState('error');
      setPublishError('Could not reach the server. Check your connection.');
      return false;
    }
  }, [editKey]);

  const resetPublishState = useCallback(() => {
    setPublishState('idle');
    setPublishError(null);
  }, []);

  // Closing the tab with unsaved changes should not silently discard them.
  useEffect(() => {
    if (!isSettingsMode || !isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isSettingsMode, isDirty]);

  const value = useMemo<ConfigContextValue>(
    () => ({
      config: draft, saved, isSettingsMode, editKey, settingsOpen, setSettingsOpen,
      isDirty, publishState, publishError,
      update, publish, resetPublishState,
    }),
    [draft, saved, isSettingsMode, editKey, settingsOpen, isDirty, publishState,
     publishError, update, publish, resetPublishState],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}
