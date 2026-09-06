import type { Config, Track, TextTheme } from './types';

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

const CONFIG_KEYS = [
  'version',
  'pageTitle',
  'subtitle',
  'photoUrl',
  'photoCaption',
  'backgroundMobileUrl',
  'backgroundDesktopUrl',
  'overlayOpacity',
  'textTheme',
  'tracks',
] as const;

const TRACK_KEYS = ['id', 'youtubeId', 'title', 'artist', 'thumbnail', 'duration'] as const;

const MAX_TRACKS = 200;
const MAX_TEXT = 300;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function unknownKeys(value: Record<string, unknown>, allowed: readonly string[]): string[] {
  return Object.keys(value).filter((key) => !allowed.includes(key));
}

function str(value: unknown, field: string, max = MAX_TEXT): ParseResult<string> {
  if (typeof value !== 'string') return { ok: false, error: `${field} must be a string` };
  if (value.length > max) return { ok: false, error: `${field} must be at most ${max} characters` };
  return { ok: true, value };
}

/** Accepts null, or an http(s) / same-origin URL. Blocks `javascript:` and friends. */
function nullableUrl(value: unknown, field: string): ParseResult<string | null> {
  if (value === null) return { ok: true, value: null };
  if (typeof value !== 'string') return { ok: false, error: `${field} must be a string or null` };
  if (value.startsWith('/')) return { ok: true, value };
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, error: `${field} must be a valid URL` };
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { ok: false, error: `${field} must be an http(s) URL` };
  }
  return { ok: true, value };
}

function parseTrack(value: unknown, index: number): ParseResult<Track> {
  const where = `tracks[${index}]`;
  if (!isRecord(value)) return { ok: false, error: `${where} must be an object` };

  const extra = unknownKeys(value, TRACK_KEYS);
  if (extra.length) return { ok: false, error: `${where} has unknown fields: ${extra.join(', ')}` };

  const id = str(value.id, `${where}.id`, 64);
  if (!id.ok) return id;
  if (!id.value) return { ok: false, error: `${where}.id must not be empty` };

  if (typeof value.youtubeId !== 'string' || !/^[A-Za-z0-9_-]{11}$/.test(value.youtubeId)) {
    return { ok: false, error: `${where}.youtubeId must be an 11-character video ID` };
  }

  const title = str(value.title, `${where}.title`);
  if (!title.ok) return title;

  const artist = str(value.artist, `${where}.artist`);
  if (!artist.ok) return artist;

  const thumbnail = nullableUrl(value.thumbnail, `${where}.thumbnail`);
  if (!thumbnail.ok) return thumbnail;
  if (thumbnail.value === null) return { ok: false, error: `${where}.thumbnail is required` };

  const duration = value.duration;
  if (duration !== null && (typeof duration !== 'number' || !Number.isFinite(duration) || duration < 0)) {
    return { ok: false, error: `${where}.duration must be a non-negative number or null` };
  }

  return {
    ok: true,
    value: {
      id: id.value,
      youtubeId: value.youtubeId,
      title: title.value,
      artist: artist.value,
      thumbnail: thumbnail.value,
      duration: duration as number | null,
    },
  };
}

export function parseConfig(value: unknown): ParseResult<Config> {
  if (!isRecord(value)) return { ok: false, error: 'config must be an object' };

  const extra = unknownKeys(value, CONFIG_KEYS);
  if (extra.length) return { ok: false, error: `unknown fields: ${extra.join(', ')}` };

  if (value.version !== 1) return { ok: false, error: 'version must be 1' };

  const pageTitle = str(value.pageTitle, 'pageTitle');
  if (!pageTitle.ok) return pageTitle;

  const subtitle = str(value.subtitle, 'subtitle');
  if (!subtitle.ok) return subtitle;

  const photoUrl = nullableUrl(value.photoUrl, 'photoUrl');
  if (!photoUrl.ok) return photoUrl;

  const photoCaption = str(value.photoCaption, 'photoCaption');
  if (!photoCaption.ok) return photoCaption;

  const backgroundMobileUrl = nullableUrl(value.backgroundMobileUrl, 'backgroundMobileUrl');
  if (!backgroundMobileUrl.ok) return backgroundMobileUrl;

  const backgroundDesktopUrl = nullableUrl(value.backgroundDesktopUrl, 'backgroundDesktopUrl');
  if (!backgroundDesktopUrl.ok) return backgroundDesktopUrl;

  const overlay = value.overlayOpacity;
  if (typeof overlay !== 'number' || !Number.isFinite(overlay) || overlay < 0 || overlay > 0.8) {
    return { ok: false, error: 'overlayOpacity must be a number between 0 and 0.8' };
  }

  if (value.textTheme !== 'dark' && value.textTheme !== 'light') {
    return { ok: false, error: "textTheme must be 'dark' or 'light'" };
  }

  if (!Array.isArray(value.tracks)) return { ok: false, error: 'tracks must be an array' };
  if (value.tracks.length > MAX_TRACKS) {
    return { ok: false, error: `tracks must contain at most ${MAX_TRACKS} entries` };
  }

  const tracks: Track[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < value.tracks.length; i += 1) {
    const track = parseTrack(value.tracks[i], i);
    if (!track.ok) return track;
    // Duplicate ids would break React keys and index lookups on reorder.
    if (seen.has(track.value.id)) {
      return { ok: false, error: `tracks[${i}].id is a duplicate of an earlier track` };
    }
    seen.add(track.value.id);
    tracks.push(track.value);
  }

  return {
    ok: true,
    value: {
      version: 1,
      pageTitle: pageTitle.value,
      subtitle: subtitle.value,
      photoUrl: photoUrl.value,
      photoCaption: photoCaption.value,
      backgroundMobileUrl: backgroundMobileUrl.value,
      backgroundDesktopUrl: backgroundDesktopUrl.value,
      overlayOpacity: overlay,
      textTheme: value.textTheme as TextTheme,
      tracks,
    },
  };
}
