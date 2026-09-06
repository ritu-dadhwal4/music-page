import 'server-only';
import type { Config } from './types';
import { DEFAULT_CONFIG } from './default-config';
import { parseConfig } from './validate';
import { blobStore } from './store';

const CONFIG_KEY = 'config';

/** Reads the stored config, falling back to the seed on a cold or corrupt store. */
export async function readConfig(): Promise<Config> {
  let raw: string | null = null;
  try {
    raw = await blobStore().get(CONFIG_KEY, { type: 'text' });
  } catch (error) {
    console.error('[config] read failed, serving default', error);
    return DEFAULT_CONFIG;
  }

  if (!raw) return DEFAULT_CONFIG;

  const result = parseConfig(safeJson(raw));
  if (!result.ok) {
    // A stored blob that no longer validates would otherwise take the whole
    // page down. Serving the seed keeps the link working.
    console.error('[config] stored config is invalid, serving default:', result.error);
    return DEFAULT_CONFIG;
  }
  return result.value;
}

export async function writeConfig(config: Config): Promise<void> {
  await blobStore().set(CONFIG_KEY, JSON.stringify(config));
}

function safeJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
