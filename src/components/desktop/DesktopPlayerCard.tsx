'use client';

import { usePlayer } from '@/player/PlayerProvider';
import { Thumbnail } from '../Thumbnail';
import { SeekBar } from '../SeekBar';
import { TransportControls } from '../TransportControls';
import { VolumeControl } from '../VolumeControl';

/**
 * Horizontal, unlike the tall stacked mobile card: identity on the left,
 * transport inline on the right, seek across the second line, volume bottom
 * right. Same controller, different arrangement - no player logic here.
 */
export function DesktopPlayerCard() {
  const {
    currentTrack, currentTime, duration, volume, muted, seekTo, changeVolume, toggleMute,
  } = usePlayer();

  return (
    <section
      aria-label="Now playing"
      className="w-full rounded-2xl bg-surface-container-lowest/95 px-5 py-4 shadow-[0_18px_50px_-12px_rgba(58,48,42,0.45)] backdrop-blur-md"
    >
      <div className="flex items-center gap-4">
        {currentTrack ? (
          <Thumbnail
            src={currentTrack.thumbnail} youtubeId={currentTrack.youtubeId} alt=""
            width={72} height={41} className="shrink-0 rounded-md"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-headline text-lg leading-tight font-medium text-on-surface">
            {currentTrack?.title ?? 'Nothing playing'}
          </h2>
          {currentTrack?.artist ? (
            <p className="truncate text-sm text-secondary">{currentTrack.artist}</p>
          ) : null}
        </div>

        <TransportControls size="sm" className="shrink-0" />
      </div>

      <SeekBar currentTime={currentTime} duration={duration} onSeek={seekTo} className="mt-1" />

      <div className="mt-1 flex justify-end">
        <VolumeControl
          volume={volume} muted={muted} onChange={changeVolume} onToggleMute={toggleMute}
          className="w-40"
        />
      </div>
    </section>
  );
}
