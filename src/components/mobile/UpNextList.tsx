'use client';

import { usePlayer } from '@/player/PlayerProvider';
import { Thumbnail } from '../Thumbnail';
import { formatTime } from '@/lib/format';

export function UpNextList() {
  const { tracks, currentIndex, playTrackAt } = usePlayer();

  // A column of "--:--" is noise. If nothing has a duration, drop the column.
  const showDurations = tracks.some((track) => track.duration !== null);

  return (
    <section aria-label="Up next" className="space-y-3 pt-2">
      <div className="flex items-center gap-2 px-1">
        {/* Sits directly on the background, so it follows the text theme
            rather than the fixed warm gray the cards use. */}
        <h3 className="text-xs font-semibold tracking-wider text-page-muted uppercase">Up Next</h3>
        <span className="rounded-full bg-secondary-container px-2 py-0.5 font-numeric text-[10px] font-medium text-on-secondary-container">
          {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {tracks.map((track, index) => {
          const isCurrent = index === currentIndex;
          return (
            <li key={track.id}>
              <button
                type="button"
                onClick={() => playTrackAt(index)}
                aria-current={isCurrent ? 'true' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isCurrent
                    ? 'bg-primary-fixed/60 shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <Thumbnail
                  src={track.thumbnail}
                  youtubeId={track.youtubeId}
                  alt=""
                  width={96}
                  height={54}
                  className="shrink-0 rounded-lg"
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-headline text-lg leading-snug font-medium text-on-surface">
                    {track.title}
                  </span>
                  {track.artist ? (
                    <span className="block truncate text-sm text-secondary">{track.artist}</span>
                  ) : null}
                </span>

                {isCurrent ? (
                  <span className="shrink-0 font-numeric text-xs font-semibold tracking-wider text-primary">
                    NOW
                  </span>
                ) : showDurations ? (
                  <span className="shrink-0 font-numeric text-xs text-secondary tabular-nums">
                    {formatTime(track.duration)}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
