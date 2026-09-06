import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getStore, type Store } from '@netlify/blobs';

const STORE_NAME = 'music-page';

/**
 * On Netlify, `getStore` picks up its credentials from the environment with no
 * configuration. Off Netlify - a plain `npm run dev` without `netlify dev` -
 * it throws, so development falls back to a folder on disk. Production never
 * takes the fallback: a misconfigured deploy should fail loudly rather than
 * quietly write to an ephemeral container filesystem.
 */
const LOCAL_DIR = path.join(process.cwd(), '.netlify', 'blobs-local', STORE_NAME);

type BlobStore = Pick<Store, 'get' | 'set'>;

function localStore(): BlobStore {
  const fileFor = (key: string) => path.join(LOCAL_DIR, `${encodeURIComponent(key)}.blob`);
  return {
    // The real Store.get is heavily overloaded. The fallback honours the two
    // response types this app asks for - text for the config, arrayBuffer for
    // stored images - and the cast keeps the signatures compatible.
    get: (async (key: string, options?: { type?: string }) => {
      try {
        const buffer = await fs.readFile(fileFor(key));
        if (options?.type === 'arrayBuffer') {
          return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        }
        return buffer.toString('utf8');
      } catch {
        return null;
      }
    }) as Store['get'],
    set: (async (key: string, data: string | Buffer | ArrayBuffer) => {
      await fs.mkdir(LOCAL_DIR, { recursive: true });
      const payload =
        typeof data === 'string' ? Buffer.from(data, 'utf8')
        : Buffer.isBuffer(data) ? data
        : Buffer.from(data);
      await fs.writeFile(fileFor(key), payload);
      return { modified: true };
    }) as Store['set'],
  };
}

let cached: BlobStore | null = null;

export function blobStore(): BlobStore {
  if (cached) return cached;

  const siteID = process.env.NETLIFY_SITE_ID ?? process.env.SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN ?? process.env.NETLIFY_BLOBS_TOKEN;

  try {
    cached = siteID && token ? getStore({ name: STORE_NAME, siteID, token }) : getStore(STORE_NAME);
  } catch (error) {
    if (process.env.NODE_ENV === 'production') throw error;
    console.warn(
      '[store] Netlify Blobs is not configured; falling back to .netlify/blobs-local. ' +
        'Run `netlify dev` (or set NETLIFY_SITE_ID + NETLIFY_API_TOKEN) to use real Blobs locally.',
    );
    cached = localStore();
  }

  return cached;
}
