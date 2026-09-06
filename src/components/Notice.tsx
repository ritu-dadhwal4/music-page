'use client';

import { usePlayer } from '@/player/PlayerProvider';

/** Non-blocking toast for dead links and player failures. Never blocks playback. */
export function Notice() {
  const { notice, dismissNotice } = usePlayer();
  if (!notice) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-xl bg-on-surface/95 px-4 py-3 text-sm text-surface shadow-lg backdrop-blur">
        <p className="flex-1">{notice}</p>
        <button
          type="button" onClick={dismissNotice} aria-label="Dismiss"
          className="-my-1 -mr-1 shrink-0 rounded px-2 py-1 text-surface/70 transition-colors hover:text-surface"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
