'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import type { Track } from '@/lib/types';
import { useConfig } from './ConfigProvider';
import { Thumbnail } from '@/components/Thumbnail';
import { formatTime } from '@/lib/format';

export function MusicTab({ editKey }: { editKey: string }) {
  const { config, update } = useConfig();
  const [link, setLink] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tracks = config.tracks;

  async function addTrack(event: React.FormEvent) {
    event.preventDefault();
    if (!link.trim() || isAdding) return;

    setIsAdding(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/youtube?url=${encodeURIComponent(link.trim())}`,
        { headers: { 'x-edit-key': editKey } },
      );
      const body = await response.json();

      if (!response.ok) {
        setError(body.error ?? 'Could not add that link');
        return;
      }

      const track: Track = {
        id: nanoid(),
        youtubeId: body.youtubeId,
        title: body.title,
        artist: body.artist ?? '',
        thumbnail: body.thumbnail,
        duration: body.duration ?? null,
      };
      update({ tracks: [...tracks, track] });
      setLink('');
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setIsAdding(false);
    }
  }

  function edit(index: number, patch: Partial<Track>) {
    update({ tracks: tracks.map((t, i) => (i === index ? { ...t, ...patch } : t)) });
  }

  /** Reordering is an array splice - the array order *is* the play order. */
  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= tracks.length) return;
    const next = [...tracks];
    [next[index], next[target]] = [next[target], next[index]];
    update({ tracks: next });
  }

  function remove(index: number) {
    update({ tracks: tracks.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-5">
      <form onSubmit={addTrack} className="space-y-2">
        <label htmlFor="yt-link" className="block text-sm font-medium text-on-surface">
          Paste a YouTube link
        </label>
        <div className="flex gap-2">
          <input
            id="yt-link"
            type="text"
            inputMode="url"
            value={link}
            onChange={(e) => { setLink(e.target.value); setError(null); }}
            placeholder="youtube.com/watch?v=…"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'yt-link-error' : undefined}
            className={`min-w-0 flex-1 rounded-lg border bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface outline-none placeholder:text-outline focus:border-primary ${
              error ? 'border-error' : 'border-outline-variant'
            }`}
          />
          <button
            type="submit"
            disabled={isAdding || !link.trim()}
            className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container disabled:opacity-40"
          >
            {isAdding ? 'Adding…' : 'Add'}
          </button>
        </div>
        {/* Inline, next to the field that caused it - never an alert(). */}
        {error ? (
          <p id="yt-link-error" role="alert" className="text-sm text-error">{error}</p>
        ) : null}
      </form>

      {tracks.length === 0 ? (
        <p className="py-8 text-center text-sm text-secondary">
          No songs yet. Paste a link above to add the first one.
        </p>
      ) : (
        <ul className="space-y-2">
          {tracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              isFirst={index === 0}
              isLast={index === tracks.length - 1}
              onEdit={(patch) => edit(index, patch)}
              onMove={(delta) => move(index, delta)}
              onRemove={() => remove(index)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TrackRow({
  track, isFirst, isLast, onEdit, onMove, onRemove,
}: {
  track: Track;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (patch: Partial<Track>) => void;
  onMove: (delta: number) => void;
  onRemove: () => void;
}) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  return (
    <li className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3">
      <div className="flex gap-3">
        <Thumbnail
          src={track.thumbnail} youtubeId={track.youtubeId} alt=""
          width={96} height={54} className="mt-0.5 shrink-0 rounded-lg"
        />

        <div className="min-w-0 flex-1 space-y-1.5">
          <input
            value={track.title}
            onChange={(e) => onEdit({ title: e.target.value })}
            aria-label="Title"
            className="w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 font-headline text-base text-on-surface outline-none hover:border-outline-variant focus:border-primary focus:bg-surface"
          />
          <input
            value={track.artist}
            onChange={(e) => onEdit({ artist: e.target.value })}
            aria-label="Artist"
            placeholder="Artist"
            className="w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm text-secondary outline-none placeholder:text-outline hover:border-outline-variant focus:border-primary focus:bg-surface"
          />
        </div>
      </div>

      {confirmingRemove ? (
        // Inline confirmation, not a browser confirm() - it keeps the owner in
        // the panel and cannot be suppressed by the browser.
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-error/10 px-3 py-2">
          <span className="flex-1 text-sm text-on-surface">Remove?</span>
          <button
            type="button" onClick={onRemove}
            className="min-h-11 rounded-md px-3 text-sm font-medium text-error hover:underline"
          >
            Yes
          </button>
          <button
            type="button" onClick={() => setConfirmingRemove(false)}
            className="min-h-11 rounded-md px-3 text-sm text-secondary hover:underline"
          >
            No
          </button>
        </div>
      ) : (
        <div className="mt-1.5 flex items-center justify-end gap-1">
          <span className="mr-auto pl-1 font-numeric text-xs text-secondary">
            {track.duration === null ? '' : formatTime(track.duration)}
          </span>
          {/* Arrows, not drag-and-drop: dragging on touch is fiddly. */}
          <IconButton label="Move up" disabled={isFirst} onClick={() => onMove(-1)}>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </IconButton>
          <IconButton label="Move down" disabled={isLast} onClick={() => onMove(1)}>
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </IconButton>
          <IconButton label="Remove" danger onClick={() => setConfirmingRemove(true)}>
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
          </IconButton>
        </div>
      )}
    </li>
  );
}

function IconButton({
  label, children, onClick, disabled, danger,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} aria-label={label}
      // 44x44 minimum - these are the controls most likely to end up too small.
      className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-30 ${
        danger ? 'text-error hover:bg-error/10' : 'text-secondary hover:bg-surface-container hover:text-on-surface'
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
        strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-[18px] w-[18px]">
        {children}
      </svg>
    </button>
  );
}
