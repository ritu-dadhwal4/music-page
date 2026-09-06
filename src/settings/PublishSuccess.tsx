'use client';

import { useEffect, useState } from 'react';
import { publicUrl } from './useEditKey';

export function PublishSuccess({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Built on the client so it reflects the real deployed origin, with the
    // edit key stripped - the shared link must never carry it.
    setUrl(publicUrl());
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the URL is selectable in the box regardless.
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}
          strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-8 w-8">
          <path d="m5 13 4 4L19 7" />
        </svg>
      </div>

      <div className="space-y-1">
        <h2 className="font-headline text-2xl text-on-surface">Published</h2>
        <p className="text-sm text-secondary">Anyone with this link can listen.</p>
      </div>

      <p className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-sm break-all text-on-surface select-all">
        {url}
      </p>

      <div className="flex w-full flex-col gap-2">
        <button
          type="button" onClick={copy}
          className="min-h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container"
        >
          {copied ? 'Copied' : 'Copy link'}
        </button>

        {canShare ? (
          <button
            type="button"
            onClick={() => void navigator.share({ url }).catch(() => {})}
            className="min-h-11 w-full rounded-lg border border-outline-variant px-4 text-sm text-on-surface hover:bg-surface-container"
          >
            Share
          </button>
        ) : null}

        <button
          type="button" onClick={onClose}
          className="min-h-11 w-full text-sm text-secondary hover:underline"
        >
          Keep editing
        </button>
      </div>
    </div>
  );
}
