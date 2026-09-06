'use client';

import type { CSSProperties } from 'react';
import { MutedIcon, VolumeHighIcon, VolumeLowIcon } from './icons';

export function VolumeControl({
  volume,
  muted,
  onChange,
  onToggleMute,
  className = '',
}: {
  volume: number;
  muted: boolean;
  onChange: (volume: number) => void;
  onToggleMute: () => void;
  className?: string;
}) {
  const effective = muted ? 0 : volume;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        aria-pressed={muted}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-secondary transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="h-[18px] w-[18px]">
          {muted ? <MutedIcon /> : effective < 50 ? <VolumeLowIcon /> : <VolumeHighIcon />}
        </span>
      </button>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={effective}
        aria-label="Volume"
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-warm w-full"
        style={{ '--range-progress': `${effective}%` } as CSSProperties}
      />
    </div>
  );
}
