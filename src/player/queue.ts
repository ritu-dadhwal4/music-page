import type { Track } from '@/lib/types';

export type AdvanceOptions = {
  tracks: Track[];
  fromIndex: number;
  shuffle: boolean;
  repeat: boolean;
  /** True when a track ended on its own, false when the listener pressed next. */
  isAutoAdvance: boolean;
  /** Ids already played in the current shuffle cycle. Mutated on cycle reset. */
  played: Set<string>;
  /** Injectable for tests; defaults to Math.random. */
  random?: () => number;
};

/**
 * Which track plays next, or null to stop.
 *
 * Shuffle picks at random from tracks not yet played in the current cycle -
 * the visible list order never changes, only where playback jumps. Reaching
 * the end auto-advancing stops unless repeat is on; pressing next always
 * wraps, because the listener asked for it.
 */
export function pickNextIndex({
  tracks,
  fromIndex,
  shuffle,
  repeat,
  isAutoAdvance,
  played,
  random = Math.random,
}: AdvanceOptions): number | null {
  if (tracks.length === 0) return null;
  if (tracks.length === 1) return isAutoAdvance && !repeat ? null : 0;

  if (shuffle) {
    let candidates = tracks
      .map((track, index) => ({ track, index }))
      .filter(({ track, index }) => index !== fromIndex && !played.has(track.id));

    if (candidates.length === 0) {
      if (isAutoAdvance && !repeat) return null;
      played.clear();
      candidates = tracks
        .map((track, index) => ({ track, index }))
        .filter(({ index }) => index !== fromIndex);
    }
    return candidates[Math.floor(random() * candidates.length)].index;
  }

  const nextIndex = fromIndex + 1;
  if (nextIndex < tracks.length) return nextIndex;
  if (isAutoAdvance && !repeat) return null;
  return 0;
}
