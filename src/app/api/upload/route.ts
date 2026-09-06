import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { editKeyFromRequest, isValidEditKey } from '@/lib/auth';
import { blobStore } from '@/lib/store';
import {
  ACCEPTED_TYPES,
  MAX_UPLOAD_BYTES,
  averageBrightness,
  isPurpose,
  processImage,
} from '@/lib/images';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isValidEditKey(editKeyFromRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a file upload' }, { status: 400 });
  }

  const purpose = form.get('purpose');
  if (!isPurpose(purpose)) {
    return NextResponse.json({ error: 'Unknown upload purpose' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file was attached' }, { status: 400 });
  }

  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    return NextResponse.json(
      { error: 'Images only, please — JPEG, PNG or WebP.' },
      { status: 415 },
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return NextResponse.json(
      { error: `That image is ${mb} MB. The limit is 4 MB — try a smaller one.` },
      { status: 413 },
    );
  }

  const original = Buffer.from(await file.arrayBuffer());

  let processed: Buffer;
  let brightness: number;
  try {
    [processed, brightness] = await Promise.all([
      processImage(original, purpose),
      averageBrightness(original),
    ]);
  } catch {
    // sharp throws on truncated or disguised files - a .jpg that is not one.
    return NextResponse.json({ error: 'That file isn’t a readable image.' }, { status: 400 });
  }

  const name = `${nanoid()}.webp`;
  try {
    // Blobs takes an ArrayBuffer, not a Node Buffer view.
    await blobStore().set(
      `images/${name}`,
      processed.buffer.slice(processed.byteOffset, processed.byteOffset + processed.byteLength) as ArrayBuffer,
    );
  } catch (error) {
    console.error('[upload] write failed', error);
    return NextResponse.json({ error: 'Could not save that image' }, { status: 500 });
  }

  return NextResponse.json({
    url: `/api/images/${name}`,
    // The owner can override; this is a suggestion, not a decision.
    suggestedTextTheme: brightness < 0.5 ? 'light' : 'dark',
  });
}
