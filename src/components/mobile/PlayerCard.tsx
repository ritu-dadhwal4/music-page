'use client';

import { usePlayer } from '@/player/PlayerProvider';
import { SeekBar } from '../SeekBar';
import { TransportControls } from '../TransportControls';
import { VolumeControl } from '../VolumeControl';

export function PlayerCard() {
  const {
    currentTrack, currentTime, duration, volume, muted, seekTo, changeVolume, toggleMute,
  } = usePlayer();

  return (
    <section
      aria-label="Now playing"
      className="rounded-2xl bg-surface-container-lowest p-5 shadow-lg shadow-surface-dim/30"
    >
      <div className="space-y-1 text-center">
        <h2 className="font-headline text-2xl leading-tight font-medium text-on-surface">
          {currentTrack?.title ?? 'Nothing playing'}
        </h2>
        {currentTrack?.artist ? (
          <p className="font-headline text-xs tracking-widest text-secondary uppercase italic">
            {currentTrack.artist}
          </p>
        ) : null}
      </div>

      <SeekBar
        currentTime={currentTime}
        duration={duration}
        onSeek={seekTo}
        className="mt-3"
      />

      <TransportControls size="lg" className="mt-2 px-1" />

      <VolumeControl
        volume={volume}
        muted={muted}
        onChange={changeVolume}
        onToggleMute={toggleMute}
        className="mt-2 rounded-xl bg-surface-container-low/70 px-2"
      />
    </section>
  );
}
