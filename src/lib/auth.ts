import 'server-only';

/**
 * The only place the edit key is checked. Both the settings-mode render and
 * every write endpoint go through here - a browser-side comparison is
 * trivially bypassed in devtools, and the write endpoint is what matters.
 */
export function isValidEditKey(candidate: string | null | undefined): boolean {
  const expected = process.env.EDIT_KEY;
  if (!expected) return false;
  if (typeof candidate !== 'string' || candidate.length === 0) return false;
  return timingSafeEqual(candidate, expected);
}

/** Reads the key from the `x-edit-key` header, falling back to `?key=`. */
export function editKeyFromRequest(request: Request): string | null {
  const header = request.headers.get('x-edit-key');
  if (header) return header;
  return new URL(request.url).searchParams.get('key');
}

function timingSafeEqual(a: string, b: string): boolean {
  // Compare over a fixed length so the loop cost does not leak the key length.
  const length = Math.max(a.length, b.length);
  let mismatch = a.length ^ b.length;
  for (let i = 0; i < length; i += 1) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}
