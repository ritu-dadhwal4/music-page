'use client';

import { useRef, useState, type CSSProperties } from 'react';
import type { Purpose } from '@/lib/images';
import { useConfig } from './ConfigProvider';
import { useUpload } from './useUpload';
import { PhotoCropper } from './PhotoCropper';

export function AppearanceTab({ editKey }: { editKey: string }) {
  const { config, update } = useConfig();
  const { upload, busy, error, clearError } = useUpload(editKey);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);

  const onlyOneBackground =
    Boolean(config.backgroundMobileUrl) !== Boolean(config.backgroundDesktopUrl);

  async function pickBackground(file: File, purpose: Purpose) {
    const result = await upload(file, purpose, file.name);
    if (!result) return;
    update(
      purpose === 'background-mobile'
        ? { backgroundMobileUrl: result.url, textTheme: result.suggestedTextTheme }
        : { backgroundDesktopUrl: result.url, textTheme: result.suggestedTextTheme },
    );
  }

  async function savePhoto(blob: Blob) {
    setPendingPhoto(null);
    const result = await upload(blob, 'photo', 'photo.webp');
    if (result) update({ photoUrl: result.url });
  }

  return (
    <div className="space-y-7">
      {error ? (
        <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}

      <Field label="Backgrounds">
        <div className="grid grid-cols-2 gap-3">
          <BackgroundSlot
            label="Mobile" hint="Portrait" aspect="9 / 16"
            url={config.backgroundMobileUrl}
            busy={busy === 'background-mobile'}
            onPick={(file) => { clearError(); void pickBackground(file, 'background-mobile'); }}
            onRemove={() => update({ backgroundMobileUrl: null })}
          />
          <BackgroundSlot
            label="Desktop" hint="Landscape" aspect="16 / 9"
            url={config.backgroundDesktopUrl}
            busy={busy === 'background-desktop'}
            onPick={(file) => { clearError(); void pickBackground(file, 'background-desktop'); }}
            onRemove={() => update({ backgroundDesktopUrl: null })}
          />
        </div>
        {/* The fallback is deliberate, so say so rather than letting it look
            like a bug when one slot is empty. */}
        {onlyOneBackground ? (
          <p className="mt-2 text-xs text-secondary">
            Only one background is set, so it will be used on both phone and desktop.
            Add the other to use a different image for each.
          </p>
        ) : null}
      </Field>

      <Field label="Overlay darkness" hint="Darkens the background so text stays readable.">
        <input
          type="range" min={0} max={0.8} step={0.05}
          value={config.overlayOpacity}
          onChange={(e) => update({ overlayOpacity: Number(e.target.value) })}
          aria-label="Overlay darkness"
          aria-valuetext={`${Math.round(config.overlayOpacity * 125)} percent`}
          className="range-warm w-full"
          style={{ '--range-progress': `${(config.overlayOpacity / 0.8) * 100}%` } as CSSProperties}
        />
      </Field>

      <Field label="Text" hint="Uploading a background suggests one of these automatically.">
        <div className="flex gap-2">
          {(['dark', 'light'] as const).map((theme) => (
            <button
              key={theme} type="button"
              onClick={() => update({ textTheme: theme })}
              aria-pressed={config.textTheme === theme}
              className={`min-h-11 flex-1 rounded-lg border px-3 text-sm transition-colors ${
                config.textTheme === theme
                  ? 'border-primary bg-primary-fixed/60 font-medium text-on-surface'
                  : 'border-outline-variant text-secondary hover:bg-surface-container'
              }`}
            >
              {theme === 'dark' ? 'Dark text' : 'Light text'}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Photo" hint="Shown in the frame until the first song plays.">
        {pendingPhoto ? (
          <PhotoCropper
            file={pendingPhoto}
            onCancel={() => setPendingPhoto(null)}
            onCropped={(blob) => void savePhoto(blob)}
          />
        ) : (
          <div className="flex items-start gap-3">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-container">
              {config.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={config.photoUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <FilePicker
                label={config.photoUrl ? 'Replace photo' : 'Upload photo'}
                busy={busy === 'photo'}
                onPick={(file) => { clearError(); setPendingPhoto(file); }}
              />
              {config.photoUrl ? (
                <button
                  type="button" onClick={() => update({ photoUrl: null })}
                  className="min-h-11 text-left text-sm text-error hover:underline"
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        )}
      </Field>

      <Field label="Photo caption">
        <TextInput
          value={config.photoCaption}
          onChange={(value) => update({ photoCaption: value })}
          placeholder="Golden Hour Daze — 2009"
        />
      </Field>

      <Field label="Page title">
        <TextInput
          value={config.pageTitle}
          onChange={(value) => update({ pageTitle: value })}
          placeholder="For my best friend"
        />
      </Field>

      <Field label="Subtitle">
        <TextInput
          value={config.subtitle}
          onChange={(value) => update({ subtitle: value })}
          placeholder="Cheers to our 10 years of friendship"
        />
      </Field>
    </div>
  );
}

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-medium text-on-surface">{label}</h3>
      {hint ? <p className="-mt-1 text-xs text-secondary">{hint}</p> : null}
      {children}
    </section>
  );
}

function TextInput({
  value, onChange, placeholder,
}: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <input
      type="text" value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface outline-none placeholder:text-outline focus:border-primary"
    />
  );
}

function BackgroundSlot({
  label, hint, aspect, url, busy, onPick, onRemove,
}: {
  label: string;
  hint: string;
  aspect: string;
  url: string | null;
  busy: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-on-surface">{label}</p>

      {/*
        Both slots share one outer height so the pair lines up. A raw 9/16
        frame at this width is nearly 300px tall and would push the mobile
        column's controls far below the desktop column's. The portrait vs
        landscape shape still reads from the inner frame.
      */}
      <div className="flex h-32 items-center justify-center rounded-lg bg-surface-container p-2">
        <div
          className="h-full max-w-full overflow-hidden rounded border border-outline-variant bg-surface-container-high"
          style={{ aspectRatio: aspect }}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-1 text-center text-[10px] leading-tight text-outline">
              {hint}
            </div>
          )}
        </div>
      </div>

      <FilePicker label={url ? 'Replace' : 'Upload'} busy={busy} onPick={onPick} small />
      {url ? (
        <button
          type="button" onClick={onRemove}
          className="min-h-11 w-full text-sm text-error hover:underline"
        >
          Remove
        </button>
      ) : null}
    </div>
  );
}

function FilePicker({
  label, busy, onPick, small,
}: { label: string; busy: boolean; onPick: (file: File) => void; small?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button" disabled={busy} onClick={() => inputRef.current?.click()}
        className={`min-h-11 rounded-lg border border-outline-variant bg-surface-container-lowest font-medium text-on-surface transition-colors hover:bg-surface-container disabled:opacity-50 ${
          small ? 'w-full px-2 text-xs' : 'px-4 text-sm'
        }`}
      >
        {busy ? 'Uploading…' : label}
      </button>
      <input
        ref={inputRef} type="file" className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Reset so picking the same file twice still fires a change event.
          e.target.value = '';
          if (file) onPick(file);
        }}
      />
    </>
  );
}
