'use client';

import { useConfig } from '@/settings/ConfigProvider';

export function EmptyState({ isSettingsMode }: { isSettingsMode: boolean }) {
  const { setSettingsOpen } = useConfig();

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface-container-lowest px-6 py-12 text-center shadow-lg shadow-surface-dim/30">
      <p className="font-headline text-xl text-on-surface">No songs yet</p>
      <p className="max-w-xs text-sm text-secondary">This page is waiting for its first track.</p>
      {isSettingsMode ? (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="min-h-11 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container"
        >
          Add your first song
        </button>
      ) : null}
    </div>
  );
}
