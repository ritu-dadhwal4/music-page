'use client';

import { usePlayer } from '@/player/PlayerProvider';
import { Vinyl } from './Vinyl';
import { DesktopPlayerCard } from './DesktopPlayerCard';
import { EmptyState } from '../EmptyState';

export function Stage({ isSettingsMode }: { isSettingsMode: boolean }) {
  const { tracks, registerSlot, hasStarted, currentTrack } = usePlayer();

  return (
    <div
      className="relative flex min-h-full items-center justify-center px-8 py-10"
      style={{
        /*
         * The video card shrinks on short viewports so the stage keeps fitting
         * between the top bar and the pinned queue strip. 27rem is the fixed
         * furniture: bars, the control card, and the stage's own padding.
         */
        ['--stage-w' as string]: 'clamp(20rem, (100dvh - 27rem) * 1.778, 40rem)',
      }}
    >
      {/* Clipped, so the disc can overflow the stage without creating scroll. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Vinyl />
      </div>

      {tracks.length === 0 ? (
        <div className="relative z-10 w-full max-w-md">
          <EmptyState isSettingsMode={isSettingsMode} />
        </div>
      ) : (
        <div className="relative z-10 flex w-full flex-col items-center">
          {/*
            The video card's own padding is the overlap budget. The control
            card below rides up by less than that padding, so it clips the
            card's edge and shadow and never the iframe itself.
          */}
          <div
            className="rounded-2xl bg-on-surface/90 p-3 shadow-[0_24px_60px_-16px_rgba(58,48,42,0.55)]"
            style={{ width: 'var(--stage-w)' }}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-on-surface">
              <div ref={(el) => registerSlot('desktop', el)} className="absolute inset-0" />

              {!hasStarted ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-linear-to-br from-surface-container-high to-surface-dim">
                  <span className="px-8 text-center font-headline text-base text-secondary italic">
                    {currentTrack?.title ?? ''}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div
            className="-mt-2 flex justify-center"
            style={{ width: 'calc(var(--stage-w) + 2rem)' }}
          >
            <DesktopPlayerCard />
          </div>
        </div>
      )}
    </div>
  );
}
