'use client';

import type { Config } from '@/lib/types';
import { TopBar } from './TopBar';
import { Stage } from './Stage';
import { QueueStrip } from './QueueStrip';

/**
 * Fixed top bar, a centred stage, and a queue strip pinned along the bottom.
 * Structurally unlike mobile - not a widened version of it - but it drives the
 * exact same controller through usePlayer(). No player logic lives here.
 */
export function DesktopLayout({
  config, isSettingsMode,
}: { config: Config; isSettingsMode: boolean }) {
  return (
    <div className="flex h-[100dvh] flex-col">
      <TopBar config={config} />
      {/* The stage scrolls on its own so the strip below stays pinned. */}
      <main className="min-h-0 flex-1 overflow-y-auto">
        <Stage isSettingsMode={isSettingsMode} />
      </main>
      <QueueStrip />
    </div>
  );
}
