'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { formatTime } from '@/lib/format';

/**
 * A native range input, so touch, mouse, and keyboard all work without custom
 * pointer handling. While the listener is dragging, the thumb follows their
 * finger rather than the 4x-per-second poll, which would otherwise yank it back.
 */
export function SeekBar({
  currentTime,
  duration,
  onSeek,
  className = '',
}: {
  currentTime: number;
  duration: number | null;
  onSeek: (seconds: number) => void;
  className?: string;
}) {
  const [dragValue, setDragValue] = useState<number | null>(null);
  const seekable = duration !== null && duration > 0;
  const value = dragValue ?? currentTime;
  const percent = seekable ? Math.min(100, (value / duration) * 100) : 0;

  // A track change while dragging should drop the drag, not seek the new track.
  useEffect(() => setDragValue(null), [duration]);

  const commit = (next: number) => {
    setDragValue(null);
    onSeek(next);
  };

  return (
    <div className={className}>
      <input
        type="range"
        min={0}
        max={seekable ? duration : 100}
        step={0.5}
        value={value}
        disabled={!seekable}
        aria-label="Seek"
        aria-valuetext={`${formatTime(value)} of ${formatTime(duration)}`}
        onChange={(event) => setDragValue(Number(event.target.value))}
        onPointerUp={(event) => commit(Number((event.target as HTMLInputElement).value))}
        onKeyUp={(event) => commit(Number((event.target as HTMLInputElement).value))}
        onBlur={() => setDragValue(null)}
        className="range-warm w-full disabled:cursor-default disabled:opacity-50"
        style={{ '--range-progress': `${percent}%` } as CSSProperties}
      />
      <div className="flex items-center justify-between px-0.5 font-numeric text-xs text-secondary tabular-nums">
        <span>{formatTime(value)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
