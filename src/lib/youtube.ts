/**
 * Thumbnail URLs are built from the video ID rather than taken from oEmbed.
 * oEmbed hands back `hqdefault.jpg`, which is 480x360 with black letterbox
 * bars baked in above and below the 16:9 frame; dropping that into a 16:9
 * slot shows visible black bands. These two are true 16:9.
 *
 * `maxresdefault` does not exist for every upload, so anything rendering it
 * needs an onError fallback to `mqdefault` - see <Thumbnail>.
 */
export function maxResThumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
}

export function fallbackThumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;
}

const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/**
 * Pulls the 11-character video ID out of anything the owner is likely to paste:
 * a watch URL, a youtu.be short link, a Shorts or embed URL, any of those with
 * extra query params or a leading @, or a bare ID.
 */
export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (ID_PATTERN.test(trimmed)) return trimmed;

  let url: URL;
  try {
    // Paste without a scheme is common, so assume https rather than reject.
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./i, '').toLowerCase();
  const segments = url.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be') return validId(segments[0]);

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    if (segments[0] === 'watch') return validId(url.searchParams.get('v'));
    if (segments[0] === 'shorts' || segments[0] === 'embed' || segments[0] === 'live') {
      return validId(segments[1]);
    }
    // Some share links carry ?v= on other paths.
    return validId(url.searchParams.get('v'));
  }

  return null;
}

function validId(candidate: string | null | undefined): string | null {
  if (!candidate) return null;
  return ID_PATTERN.test(candidate) ? candidate : null;
}

/** `PT4M13S` -> 253. Returns null for anything unparseable or for live streams. */
export function parseIsoDuration(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const match = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return null;
  const [, d, h, m, s] = match;
  const total =
    Number(d ?? 0) * 86400 + Number(h ?? 0) * 3600 + Number(m ?? 0) * 60 + Number(s ?? 0);
  // A live stream reports PT0S; treat that as "unknown" rather than zero.
  return total > 0 ? total : null;
}
