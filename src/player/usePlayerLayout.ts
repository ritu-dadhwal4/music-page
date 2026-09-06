'use client';

import { useSyncExternalStore } from 'react';

export const DESKTOP_QUERY = '(min-width: 1024px)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener('change', onChange);
  // Belt and braces. Some embedded webviews and remote-controlled browsers
  // resize the viewport without dispatching media-query change events; others
  // do the reverse. Listening to both means the player still finds the right
  // slot wherever the page is opened. Re-reading the query is cheap, and
  // useSyncExternalStore ignores a snapshot that has not actually changed.
  window.addEventListener('resize', onChange);
  return () => {
    media.removeEventListener('change', onChange);
    window.removeEventListener('resize', onChange);
  };
}

/**
 * Which of the two layouts is on screen. Both layouts are rendered on the
 * server and gated with CSS so the page never flashes the wrong one; this
 * hook exists only so the single player iframe knows which slot to occupy.
 * It intentionally reports `false` during SSR - the iframe is not visible
 * until first play, so a post-hydration correction costs nothing.
 */
export function useIsDesktopLayout(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}
