'use client';

import { usePlayer } from '@/player/PlayerProvider';
import { NextIcon, PauseIcon, PlayIcon, PreviousIcon, RepeatIcon, ShuffleIcon } from './icons';

/**
 * Shuffle - previous - play/pause - next - repeat. Shared by both layouts;
 * `size` only changes the metrics, never the behaviour.
 */
export function TransportControls({
  size = 'lg',
  className = '',
}: {
  size?: 'lg' | 'sm';
  className?: string;
}) {
  const {
    isPlaying, shuffle, repeat, tracks, togglePlay, next, previous, toggleShuffle, toggleRepeat,
  } = usePlayer();

  const disabled = tracks.length === 0;
  const large = size === 'lg';

  // Every control keeps a 44px hit area even at the small desktop size - the
  // visual circle shrinks, the button does not.
  const ghost =
    'flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-40';
  const stepped = `${ghost} bg-surface-container text-on-surface shadow-sm hover:text-primary active:scale-90`;

  return (
    <div className={`flex items-center ${large ? 'justify-between' : 'gap-1'} ${className}`}>
      <button
        type="button" onClick={toggleShuffle} disabled={disabled}
        aria-label="Shuffle" aria-pressed={shuffle}
        className={`${ghost} ${shuffle ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}
      >
        <span className="h-[20px] w-[20px]"><ShuffleIcon /></span>
      </button>

      <button
        type="button" onClick={previous} disabled={disabled}
        aria-label="Previous track" className={stepped}
      >
        <span className="h-[22px] w-[22px]"><PreviousIcon /></span>
      </button>

      <button
        type="button" onClick={togglePlay} disabled={disabled}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className={`flex items-center justify-center rounded-full bg-primary text-on-primary shadow-lg shadow-primary/30 transition-all hover:bg-primary-container active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-40 ${
          large ? 'h-14 w-14' : 'h-11 w-11'
        }`}
      >
        <span className={large ? 'h-[28px] w-[28px]' : 'h-[20px] w-[20px]'}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </span>
      </button>

      <button
        type="button" onClick={next} disabled={disabled}
        aria-label="Next track" className={stepped}
      >
        <span className="h-[22px] w-[22px]"><NextIcon /></span>
      </button>

      <button
        type="button" onClick={toggleRepeat} disabled={disabled}
        aria-label="Repeat" aria-pressed={repeat}
        className={`${ghost} ${repeat ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}
      >
        <span className="h-[20px] w-[20px]"><RepeatIcon /></span>
      </button>
    </div>
  );
}
