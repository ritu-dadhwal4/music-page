'use client';

/** The link the owner shares. The edit key must never travel with it. */
export function publicUrl(): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.delete('edit');
  url.hash = '';
  return url.toString();
}
