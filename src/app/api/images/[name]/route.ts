import { NextResponse } from 'next/server';
import { blobStore } from '@/lib/store';

/**
 * Netlify Blobs are not addressable from the browser, so uploaded images are
 * served through here. Names are nanoids written by the upload route and are
 * never user-supplied paths, but the pattern is enforced anyway so a crafted
 * name cannot reach another key in the store.
 */
const NAME_PATTERN = /^[A-Za-z0-9_-]{1,64}\.webp$/;

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!NAME_PATTERN.test(name)) {
    return new NextResponse('Not found', { status: 404 });
  }

  let data: ArrayBuffer | null;
  try {
    data = await blobStore().get(`images/${name}`, { type: 'arrayBuffer' });
  } catch (error) {
    console.error('[images] read failed', error);
    return new NextResponse('Not found', { status: 404 });
  }

  if (!data) return new NextResponse('Not found', { status: 404 });

  return new NextResponse(data, {
    headers: {
      'content-type': 'image/webp',
      // Content at a given name never changes - a new upload gets a new id.
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
}
