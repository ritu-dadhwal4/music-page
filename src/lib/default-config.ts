import type { Config } from './types';
import { maxResThumbnail } from './youtube';

function seedTrack(
  id: string,
  youtubeId: string,
  title: string,
  artist: string,
  duration: number | null,
) {
  return { id, youtubeId, title, artist, thumbnail: maxResThumbnail(youtubeId), duration };
}

/**
 * Rendered when the `config` blob is missing, so a fresh deploy shows a
 * working page instead of an empty shell or a crash. Real, embeddable videos
 * with their real titles - a seed full of invented tracks would pair fictional
 * names with whatever the thumbnails actually show.
 *
 * The last track deliberately carries a null duration so the "--:--" path and
 * the player-reported-duration fallback are exercised on a fresh deploy.
 */
export const DEFAULT_CONFIG: Config = {
  version: 1,
  pageTitle: 'For my best friend',
  subtitle: 'Cheers to our 10 years of friendship',
  photoUrl: null,
  photoCaption: 'Golden Hour Daze — 2009',
  backgroundMobileUrl: null,
  backgroundDesktopUrl: null,
  overlayOpacity: 0,
  textTheme: 'dark',
  tracks: [
    seedTrack('seed-1', 'ZAn3JdtSrnY', 'Archie, Marry Me', 'Alvvays', 195),
    seedTrack('seed-2', 'fLexgOxsZu0', 'The Lazy Song', 'Bruno Mars', 199),
    seedTrack('seed-3', 'hTWKbfoikeg', 'Smells Like Teen Spirit', 'Nirvana', 278),
    seedTrack('seed-4', 'lTRiuFIWV54', '1 A.M Study Session', 'Lofi Girl', 3674),
    seedTrack('seed-5', '5qap5aO4i9A', 'lofi hip hop radio', 'Lofi Girl', null),
  ],
};
