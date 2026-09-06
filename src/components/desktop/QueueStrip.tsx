'use client';

import { useEffect, useRef } from 'react';
import { usePlayer } from '@/player/PlayerProvider';
import { Thumbnail } from '../Thumbnail';
import { formatTime } from '@/lib/format';

export function QueueStrip() {
  const { tracks, currentIndex, playTrackAt } = usePlayer();
  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const activeRef = useRef<HTMLLIElement | null>(null);

  const showDurations = tracks.some((track) => track.duration !== null);

  // When playback moves to a card that has scrolled out of view, bring it back.
  // `block: 'nearest'` keeps this from scrolling the page vertically as well.
  useEffect(() => {
    // A JS smooth scroll ignores the CSS reduced-motion rule, so check here.
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeRef.current?.scrollIntoView({
      behavior: reduced ? 'instant' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [currentIndex]);

  // A vertical wheel over a horizontal strip should scroll it, not the page.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onWheel = (event: WheelEvent) => {
      // Leave genuine horizontal gestures (trackpads) to the browser.
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const canScroll = scroller.scrollWidth > scroller.clientWidth;
      if (!canScroll) return;
      event.preventDefault();
      // Must be 'instant', not 'auto': the element sets scroll-behavior:smooth
      // in CSS, and 'auto' defers to that. A smooth animation fights rapid
      // wheel input and makes the strip feel laggy. Smooth is reserved for the
      // scroll-into-view on track change.
      scroller.scrollBy({ left: event.deltaY, behavior: 'instant' });
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    return () => scroller.removeEventListener('wheel', onWheel);
  }, []);

  // Arrow keys move by roughly one card. Browsers scroll a focused overflow
  // container natively, but only for some layouts - handling it explicitly
  // means the keyboard path behaves the same everywhere.
  function onKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    const step = 280;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollerRef.current?.scrollBy({ left: step, behavior: 'instant' });
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollerRef.current?.scrollBy({ left: -step, behavior: 'instant' });
    }
  }

  if (tracks.length === 0) return null;

  return (
    <section
      aria-label="Up next"
      className="relative shrink-0 border-t border-outline-variant/50 bg-surface-container-low/95 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="flex shrink-0 items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
            strokeLinecap="round" aria-hidden className="h-4 w-4 text-secondary">
            <path d="M3 6h11M3 12h11M3 18h7M16 13l5 3-5 3z" />
          </svg>
          <h2 className="text-xs font-semibold tracking-wider text-secondary uppercase">Up Next</h2>
          <span className="rounded-full bg-secondary-container px-2 py-0.5 font-numeric text-[10px] font-medium text-on-secondary-container">
            {tracks.length}
          </span>
        </div>

        <span aria-hidden className="h-8 w-px shrink-0 bg-outline-variant/70" />

        <div className="relative min-w-0 flex-1">
          <ul
            ref={scrollerRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            aria-label="Queue"
            className="flex gap-3 overflow-x-auto scroll-smooth pr-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tracks.map((track, index) => {
              const isCurrent = index === currentIndex;
              return (
                <li key={track.id} ref={isCurrent ? activeRef : null} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => playTrackAt(index)}
                    aria-current={isCurrent ? 'true' : undefined}
                    className={`flex w-64 items-center gap-3 rounded-xl border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isCurrent
                        ? 'border-primary bg-primary-fixed/70'
                        : 'border-transparent bg-surface-container-lowest/70 hover:border-outline-variant hover:bg-surface-container-lowest'
                    }`}
                  >
                    <Thumbnail
                      src={track.thumbnail} youtubeId={track.youtubeId} alt=""
                      width={80} height={45} className="shrink-0 rounded-md"
                    />
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm font-medium ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                        {track.title}
                      </span>
                      {track.artist ? (
                        <span className="block truncate text-xs text-secondary">{track.artist}</span>
                      ) : null}
                    </span>
                    {showDurations ? (
                      <span className="shrink-0 font-numeric text-xs text-secondary tabular-nums">
                        {formatTime(track.duration)}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Fades the right edge to signal there is more to scroll to. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-surface-container-low to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
