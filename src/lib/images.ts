import 'server-only';
import sharp from 'sharp';

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const PURPOSES = ['background-mobile', 'background-desktop', 'photo'] as const;
export type Purpose = (typeof PURPOSES)[number];

export function isPurpose(value: unknown): value is Purpose {
  return typeof value === 'string' && (PURPOSES as readonly string[]).includes(value);
}

/**
 * Target sizes differ by slot: a desktop backdrop needs the width, a phone
 * backdrop does not, and the polaroid photo is a fixed square. Shipping a
 * 6000px original to a phone is the difference between a page that opens
 * instantly and one that does not.
 */
export async function processImage(input: Buffer, purpose: Purpose): Promise<Buffer> {
  const pipeline = sharp(input, { failOn: 'error' }).rotate(); // honour EXIF orientation

  if (purpose === 'photo') {
    return pipeline
      .resize(1000, 1000, { fit: 'cover', position: 'attention', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  }

  const maxWidth = purpose === 'background-desktop' ? 2000 : 1200;
  return pipeline
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

/**
 * Mean luminance, 0-1. Used to suggest a text theme when a background is
 * uploaded - dark text on a dark photo is unreadable, and the owner should not
 * have to discover that by looking.
 */
export async function averageBrightness(input: Buffer): Promise<number> {
  const { channels } = await sharp(input).stats();
  const [r, g, b] = channels;
  if (!r || !g || !b) return 1;
  // Rec. 709 luma, matching how the eye weights the channels.
  return (0.2126 * r.mean + 0.7152 * g.mean + 0.0722 * b.mean) / 255;
}
