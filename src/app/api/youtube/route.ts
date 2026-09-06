import { NextResponse } from 'next/server';
import { editKeyFromRequest, isValidEditKey } from '@/lib/auth';
import { extractVideoId, maxResThumbnail, parseIsoDuration } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

/**
 * Auth-gated even though the spec only requires it for writes: this is an
 * owner-only lookup, and leaving it open turns the deploy into a free YouTube
 * metadata proxy for anyone who finds the link.
 */
export async function GET(request: Request) {
  if (!isValidEditKey(editKeyFromRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const raw = new URL(request.url).searchParams.get('url');
  if (!raw) {
    return NextResponse.json({ error: 'Paste a YouTube link' }, { status: 400 });
  }

  const youtubeId = extractVideoId(raw);
  if (!youtubeId) {
    return NextResponse.json(
      { error: "That doesn't look like a YouTube link" },
      { status: 400 },
    );
  }

  const oembed = await fetchOembed(youtubeId);
  if (!oembed.ok) return NextResponse.json({ error: oembed.error }, { status: oembed.status });

  return NextResponse.json({
    youtubeId,
    title: oembed.title,
    artist: oembed.author,
    // Built from the ID, never taken from oEmbed - its thumbnail_url is
    // hqdefault.jpg, 4:3 with black bars baked into the image.
    thumbnail: maxResThumbnail(youtubeId),
    duration: await fetchDuration(youtubeId),
  });
}

type OembedResult =
  | { ok: true; title: string; author: string }
  | { ok: false; error: string; status: number };

async function fetchOembed(youtubeId: string): Promise<OembedResult> {
  const endpoint =
    'https://www.youtube.com/oembed?format=json&url=' +
    encodeURIComponent(`https://www.youtube.com/watch?v=${youtubeId}`);

  let response: Response;
  try {
    response = await fetch(endpoint, { cache: 'no-store' });
  } catch {
    return { ok: false, error: 'Could not reach YouTube. Try again.', status: 502 };
  }

  // These all mean the same thing to the owner: this link will not play for
  // their friend. Better they find out now than after they publish.
  //
  // The spec predicts 401/404, but oEmbed actually answers 400 for a video ID
  // that does not exist. Without 400 here, a dead link reads as a transient
  // YouTube outage and the owner retries it forever.
  if (response.status === 401 || response.status === 403) {
    return {
      ok: false,
      status: 422,
      error: 'That video has embedding disabled, so it can’t play here.',
    };
  }
  if (response.status === 400 || response.status === 404) {
    return {
      ok: false,
      status: 422,
      error: 'That video is private, deleted, or doesn’t exist.',
    };
  }
  if (!response.ok) {
    return { ok: false, error: 'YouTube couldn’t tell us about that video.', status: 502 };
  }

  try {
    const data = (await response.json()) as { title?: string; author_name?: string };
    return { ok: true, title: data.title ?? 'Untitled', author: data.author_name ?? '' };
  } catch {
    return { ok: false, error: 'YouTube sent back something unexpected.', status: 502 };
  }
}

/** Durations need the Data API. Without a key the track simply has none. */
async function fetchDuration(youtubeId: string): Promise<number | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${youtubeId}&key=${key}`,
      { cache: 'no-store' },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      items?: { contentDetails?: { duration?: string } }[];
    };
    return parseIsoDuration(data.items?.[0]?.contentDetails?.duration);
  } catch {
    // A missing duration is a cosmetic problem; never fail the add over it.
    return null;
  }
}
