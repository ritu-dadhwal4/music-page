'use client';

import { useEffect, useState } from 'react';
import { usePlayer } from '@/player/PlayerProvider';

/**
 * The signature element of the desktop design: a decorative record behind the
 * video. Pure CSS and SVG, no image. It sizes off the viewport so a short
 * screen shrinks the disc instead of pushing the queue strip off the bottom.
 */
export function Vinyl() {
  const { isPlaying } = usePlayer();
  const [tabVisible, setTabVisible] = useState(true);

  // Spinning a hidden tab burns battery for something nobody can see.
  useEffect(() => {
    const onChange = () => setTabVisible(document.visibilityState === 'visible');
    onChange();
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  const spinning = isPlaying && tabVisible;

  return (
    <div
      aria-hidden
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      // Comfortably larger than the video card so it reads as a record behind
      // the screen rather than a ring peeking out from its edges. Its wrapper
      // clips it, so an oversized disc never adds scroll to the stage.
      style={{ width: 'min(52rem, 95vh, 62vw)', height: 'min(52rem, 95vh, 62vw)' }}
    >
      <div
        className="h-full w-full motion-safe:animate-[vinyl-spin_18s_linear_infinite]"
        style={{ animationPlayState: spinning ? 'running' : 'paused' }}
      >
        <svg viewBox="0 0 400 400" className="h-full w-full">
          <defs>
            <radialGradient id="vinyl-body" cx="38%" cy="32%">
              <stop offset="0%" stopColor="#8a7f78" />
              <stop offset="55%" stopColor="#7b706a" />
              <stop offset="100%" stopColor="#6d635e" />
            </radialGradient>
            <radialGradient id="vinyl-label" cx="42%" cy="38%">
              <stop offset="0%" stopColor="#fbdcb4" />
              <stop offset="100%" stopColor="#f0b880" />
            </radialGradient>
          </defs>

          <circle cx="200" cy="200" r="196" fill="url(#vinyl-body)" />

          {/* Grooves. Spaced tighter toward the rim, as on a real record. */}
          {Array.from({ length: 26 }, (_, i) => (
            <circle
              key={i}
              cx="200" cy="200" r={78 + i * 4.6}
              fill="none" stroke="#5f5550"
              strokeWidth={i % 4 === 0 ? 0.9 : 0.45}
              opacity={0.28}
            />
          ))}

          <circle cx="200" cy="200" r="72" fill="url(#vinyl-label)" />
          <circle cx="200" cy="200" r="72" fill="none" stroke="#e0a06a" strokeWidth="0.8" opacity="0.6" />
          <circle cx="200" cy="200" r="7" fill="#6d635e" />
        </svg>
      </div>
    </div>
  );
}
