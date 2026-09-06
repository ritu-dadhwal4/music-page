'use client';

import { useCallback, useState } from 'react';
import type { Purpose } from '@/lib/images';
import type { TextTheme } from '@/lib/types';

export type UploadResult = { url: string; suggestedTextTheme: TextTheme };

export function useUpload(editKey: string) {
  const [busy, setBusy] = useState<Purpose | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: Blob, purpose: Purpose, filename = 'upload'): Promise<UploadResult | null> => {
      setBusy(purpose);
      setError(null);
      try {
        const form = new FormData();
        form.append('file', file, filename);
        form.append('purpose', purpose);

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-edit-key': editKey },
          body: form,
        });
        const body = await response.json();

        if (!response.ok) {
          setError(body.error ?? 'Could not upload that image');
          return null;
        }
        return body as UploadResult;
      } catch {
        setError('Could not reach the server. Check your connection.');
        return null;
      } finally {
        setBusy(null);
      }
    },
    [editKey],
  );

  return { upload, busy, error, clearError: () => setError(null) };
}
