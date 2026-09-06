'use client';

import { useEffect, useState } from 'react';
import { useConfig } from './ConfigProvider';
import { MusicTab } from './MusicTab';
import { AppearanceTab } from './AppearanceTab';
import { PublishSuccess } from './PublishSuccess';

type Tab = 'music' | 'appearance';

export function SettingsPanel({
  editKey, onClose,
}: { editKey: string; onClose: () => void }) {
  const { isDirty, publish, publishState, publishError, resetPublishState } = useConfig();
  const [tab, setTab] = useState<Tab>('music');
  const [confirmingClose, setConfirmingClose] = useState(false);

  // Escape closes, going through the same unsaved-changes check as the X.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') attemptClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function attemptClose() {
    if (isDirty) setConfirmingClose(true);
    else onClose();
  }

  const showSuccess = publishState === 'saved';

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button" aria-label="Close settings" onClick={attemptClose}
        className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm"
      />

      {/*
        Dynamic viewport units, so the on-screen keyboard shrinks the panel
        instead of pushing its footer off the bottom of the screen.
      */}
      <aside
        role="dialog" aria-modal="true" aria-label="Settings"
        className="relative flex h-[100dvh] w-full max-w-[28rem] flex-col bg-surface shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-outline-variant/60 px-4 py-3">
          <h2 className="font-headline text-xl text-on-surface">Settings</h2>
          <button
            type="button" onClick={attemptClose} aria-label="Close settings"
            className="flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
              strokeLinecap="round" aria-hidden className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {showSuccess ? (
          <PublishSuccess onClose={resetPublishState} />
        ) : (
          <>
            <div role="tablist" className="flex gap-1 border-b border-outline-variant/60 px-4">
              {(['music', 'appearance'] as const).map((value) => (
                <button
                  key={value} type="button" role="tab"
                  aria-selected={tab === value}
                  onClick={() => setTab(value)}
                  className={`min-h-11 border-b-2 px-4 text-sm transition-colors ${
                    tab === value
                      ? 'border-primary font-medium text-on-surface'
                      : 'border-transparent text-secondary hover:text-on-surface'
                  }`}
                >
                  {value === 'music' ? 'Music' : 'Appearance'}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
              {tab === 'music' ? <MusicTab editKey={editKey} /> : <AppearanceTab editKey={editKey} />}
            </div>

            {/* Fixed footer, visible on both tabs. */}
            <footer className="border-t border-outline-variant/60 bg-surface px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {publishError ? (
                <p role="alert" className="mb-2 text-sm text-error">{publishError}</p>
              ) : null}
              <button
                type="button"
                onClick={() => void publish()}
                disabled={publishState === 'saving' || !isDirty}
                className="min-h-12 w-full rounded-lg bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container disabled:opacity-40"
              >
                {publishState === 'saving' ? 'Publishing…' : isDirty ? 'Publish' : 'No changes to publish'}
              </button>
            </footer>
          </>
        )}

        {confirmingClose ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-on-surface/40 px-6">
            <div className="w-full max-w-xs space-y-4 rounded-xl bg-surface-container-lowest p-5 text-center shadow-xl">
              <p className="text-sm text-on-surface">
                You have changes that haven’t been published. Close anyway?
              </p>
              <div className="flex gap-2">
                <button
                  type="button" onClick={onClose}
                  className="min-h-11 flex-1 rounded-lg border border-outline-variant text-sm text-error hover:bg-error/10"
                >
                  Discard
                </button>
                <button
                  type="button" onClick={() => setConfirmingClose(false)}
                  className="min-h-11 flex-1 rounded-lg bg-primary text-sm font-medium text-on-primary hover:bg-primary-container"
                >
                  Keep editing
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
