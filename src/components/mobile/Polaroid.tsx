'use client';

import { usePlayer } from '@/player/PlayerProvider';

/**
 * The tilted white-bordered frame. The YouTube iframe mounts into the inner
 * window through the player slot and stays visible and unobscured from first
 * play onwards - nothing is layered over it, and it is never hidden or
 * collapsed while audio plays.
 *
 * Deviation from the reference screenshot: the inner window is 16:9 rather
 * than the near-square of a real polaroid. A square window would letterbox
 * every video with warm bars top and bottom, which is the exact artefact the
 * spec calls out for thumbnails.
 */
export function Polaroid({ photoUrl, caption }: { photoUrl: string | null; caption: string }) {
  const { registerSlot, hasStarted, currentTrack } = usePlayer();

  return (
    <div className="flex justify-center px-1 py-2">
      <div className="w-full max-w-[19.5rem] -rotate-2 rounded-xl bg-surface-container-lowest p-3 pb-0 shadow-xl shadow-surface-dim/50">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-on-surface">
          {/* Player slot. The provider portals the single iframe in here. */}
          <div ref={(el) => registerSlot('mobile', el)} className="absolute inset-0" />

          {/* Shown until first play, then the iframe takes over the frame. */}
          {!hasStarted ? (
            photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-linear-to-br from-surface-container-high to-surface-dim">
                <span className="px-6 text-center font-headline text-sm text-secondary italic">
                  {currentTrack?.title ?? ''}
                </span>
              </div>
            )
          ) : null}
        </div>

        <p className="px-1 py-3 text-center font-hand text-xl leading-none text-on-surface/80">
          {caption}
        </p>
      </div>
    </div>
  );
}
